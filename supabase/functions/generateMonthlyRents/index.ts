// Supabase Edge Function - Génération automatique des loyers mensuels
// Génère les paiements mensuels pour tous les locataires actifs
// Documentation : https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Récupère le token d'authentification depuis les headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Initialise Supabase client avec SERVICE_ROLE_KEY pour contourner RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Vérifie l'utilisateur depuis le token (pour filtrer ses locataires uniquement)
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse les paramètres optionnels (mois/année personnalisés)
    let targetMonth: number
    let targetYear: number

    try {
      const body = await req.json().catch(() => ({}))
      if (body.month && body.year) {
        targetMonth = parseInt(body.month, 10)
        targetYear = parseInt(body.year, 10)
      } else {
        // Par défaut : mois en cours
        const now = new Date()
        targetMonth = now.getMonth() + 1 // 1-12
        targetYear = now.getFullYear()
      }
    } catch {
      // Si pas de body, utilise le mois en cours
      const now = new Date()
      targetMonth = now.getMonth() + 1
      targetYear = now.getFullYear()
    }

    // Date du 1er jour du mois cible (pour due_date)
    const targetDate = new Date(targetYear, targetMonth - 1, 1)
    const targetDateStr = targetDate.toISOString().split('T')[0]

    // Date de début et fin du mois pour vérifier les paiements existants
    const monthStart = new Date(targetYear, targetMonth - 1, 1)
    const monthEnd = new Date(targetYear, targetMonth, 0) // Dernier jour du mois
    const monthStartStr = monthStart.toISOString().split('T')[0]
    const monthEndStr = monthEnd.toISOString().split('T')[0]

    // 1️⃣ Récupère tous les locataires actifs de l'utilisateur
    // Un locataire est actif si :
    // - entry_date <= fin du mois cible
    // - exit_date est NULL OU exit_date >= début du mois cible
    // Note: Le statut 'on_time', 'late', 'pending', 'paid' indique un bail en cours
    // On filtre par la présence d'un bail (pas de exit_date ou exit_date future)
    const { data: activeTenants, error: tenantsError } = await supabase
      .from('tenants')
      .select(
        `
        id,
        name,
        property_id,
        rent,
        entry_date,
        exit_date,
        status,
        properties!inner (
          id,
          name,
          rent,
          charges_amount,
          user_id
        )
      `
      )
      .eq('user_id', user.id)
      .lte('entry_date', monthEndStr) // Le locataire doit être entré avant ou pendant le mois
      .or(`exit_date.is.null,exit_date.gte.${monthStartStr}`) // Le bail n'est pas terminé avant le début du mois

    if (tenantsError) {
      throw new Error(`Error fetching tenants: ${tenantsError.message}`)
    }

    if (!activeTenants || activeTenants.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Aucun locataire actif trouvé',
          generated: 0,
          skipped: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // 2️⃣ Pour chaque locataire actif, vérifie si un paiement existe déjà pour le mois
    const generatedPayments: Array<{
      payment_id: string
      tenant_id: string
      tenant_name: string
      property_name: string
      amount: number
      due_date: string
    }> = []
    const skippedPayments: Array<{
      tenant_id: string
      tenant_name: string
      reason: string
    }> = []
    let errorCount = 0

    for (const tenant of activeTenants) {
      // Calcule la période au format 'YYYY-MM'
      const period = `${targetYear}-${String(targetMonth).padStart(2, '0')}`
      
      // Vérifie si un paiement existe déjà pour ce locataire et ce mois
      // Utilise la colonne period pour une vérification plus efficace
      const { data: existingPayments, error: checkError } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('tenant_id', tenant.id)
        .eq('property_id', tenant.property_id)
        .eq('period', period)
        .limit(1)

      if (checkError) {
        console.error(`Error checking existing payment for tenant ${tenant.id}:`, checkError)
        errorCount++
        skippedPayments.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          reason: `Erreur lors de la vérification: ${checkError.message}`,
        })
        continue
      }

      // Si un paiement existe déjà, on skip
      if (existingPayments && existingPayments.length > 0) {
        skippedPayments.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          reason: 'Paiement déjà existant pour ce mois',
        })
        continue
      }

      // 3️⃣ Calcule le montant total (loyer + charges)
      const property = tenant.properties
      const rentAmount = parseFloat(tenant.rent) || parseFloat(property?.rent) || 0
      
      // Récupère les charges depuis la propriété
      // charges_amount est déjà inclus dans la jointure properties!inner
      const chargesAmount = parseFloat(property?.charges_amount) || 0
      
      // Calcul du montant total
      const totalAmount = rentAmount + chargesAmount

      if (totalAmount <= 0) {
        skippedPayments.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          reason: 'Montant invalide (loyer + charges = 0)',
        })
        continue
      }

      // 4️⃣ Crée le paiement
      // Le trigger set_payment_period() remplira automatiquement la colonne period
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert([
          {
            property_id: tenant.property_id,
            tenant_id: tenant.id,
            user_id: user.id,
            amount: totalAmount,
            due_date: targetDateStr,
            date: targetDateStr, // Pour compatibilité avec l'ancien schéma
            status: 'pending',
            // period sera rempli automatiquement par le trigger set_payment_period()
          },
        ])
        .select()
        .single()

      if (createError) {
        console.error(`Error creating payment for tenant ${tenant.id}:`, createError)
        errorCount++
        skippedPayments.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          reason: `Erreur lors de la création: ${createError.message}`,
        })
        continue
      }

      generatedPayments.push({
        payment_id: newPayment.id,
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        property_name: property.name,
        amount: totalAmount,
        due_date: targetDateStr,
      })
    }

    // 5️⃣ Rapport final
    const summary = {
      summary: 'Opération terminée',
      created: generatedPayments.length,
      skipped: skippedPayments.length,
      errors: errorCount,
      period: `${targetYear}-${String(targetMonth).padStart(2, '0')}`,
      generated_payments: generatedPayments,
      skipped_payments: skippedPayments,
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Génération terminée pour ${targetMonth}/${targetYear}`,
        ...summary,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in generateMonthlyRents:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erreur lors de la génération des loyers',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
