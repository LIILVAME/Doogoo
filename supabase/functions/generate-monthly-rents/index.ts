// Supabase Edge Function - Génération automatique des loyers mensuels (Cron Job)
// Exécution automatique chaque 1er du mois via cron job
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    
    // Détermine si l'appel vient d'un utilisateur (token) ou d'un cron job (SERVICE_ROLE_KEY)
    const authHeader = req.headers.get('Authorization')
    let supabase
    
    let currentUserId: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Appel manuel depuis le frontend avec token utilisateur
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: { Authorization: authHeader },
        },
      })
      
      // Vérifie l'authentification utilisateur
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unauthorized' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        )
      }
      
      currentUserId = user.id
    } else {
      // Appel depuis cron job (SERVICE_ROLE_KEY)
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      supabase = createClient(supabaseUrl, supabaseServiceKey)
    }

    // Parse le payload du cron (optionnel)
    // Note: cronPayload non utilisé pour l'instant mais peut être utile pour futures fonctionnalités
    try {
      await req.json()
    } catch {
      // Pas de payload, on continue
    }

    // Date du mois en cours (1er jour)
    const now = new Date()
    const targetMonth = now.getMonth() + 1 // 1-12
    const targetYear = now.getFullYear()
    const targetDate = new Date(targetYear, targetMonth - 1, 1)
    const targetDateStr = targetDate.toISOString().split('T')[0]
    const period = `${targetYear}-${String(targetMonth).padStart(2, '0')}` // Format 'YYYY-MM'

    console.log(`[generate-monthly-rents] Début génération pour ${period}${currentUserId ? ` (user: ${currentUserId})` : ' (cron job)'}`)

    // 1️⃣ Récupère les utilisateurs à traiter
    let usersToProcess: Array<{ user_id: string }>
    
    if (currentUserId) {
      // Appel manuel : seulement l'utilisateur connecté
      usersToProcess = [{ user_id: currentUserId }]
    } else {
      // Appel cron : tous les utilisateurs
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('user_id')
        .not('user_id', 'is', null)

      if (usersError) {
        throw new Error(`Error fetching users: ${usersError.message}`)
      }

      if (!allUsers || allUsers.length === 0) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Aucun utilisateur trouvé',
            generated: 0,
            skipped: 0,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }
      
      usersToProcess = allUsers
    }

    const globalStats = {
      totalUsers: usersToProcess.length,
      totalGenerated: 0,
      totalSkipped: 0,
      errors: [] as Array<{ userId: string; error: string }>,
    }

    // 2️⃣ Pour chaque utilisateur, génère les loyers
    for (const userProfile of usersToProcess) {
      const userId = userProfile.user_id

      try {
        // Récupère tous les locataires actifs de cet utilisateur
        // Un locataire est actif si :
        // - entry_date <= fin du mois cible
        // - exit_date est NULL OU exit_date >= début du mois cible
        const monthStart = new Date(targetYear, targetMonth - 1, 1)
        const monthEnd = new Date(targetYear, targetMonth, 0) // Dernier jour du mois
        const monthStartStr = monthStart.toISOString().split('T')[0]
        const monthEndStr = monthEnd.toISOString().split('T')[0]

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
            properties!inner (
              id,
              name,
              rent,
              charges_amount,
              user_id
            )
          `
          )
          .eq('user_id', userId)
          .lte('entry_date', monthEndStr)
          .or(`exit_date.is.null,exit_date.gte.${monthStartStr}`)

        if (tenantsError) {
          console.error(`[generate-monthly-rents] Error fetching tenants for user ${userId}:`, tenantsError)
          globalStats.errors.push({
            userId,
            error: `Error fetching tenants: ${tenantsError.message}`,
          })
          continue
        }

        if (!activeTenants || activeTenants.length === 0) {
          console.log(`[generate-monthly-rents] Aucun locataire actif pour l'utilisateur ${userId}`)
          continue
        }

        // 3️⃣ Pour chaque locataire actif, vérifie et crée le paiement
        for (const tenant of activeTenants) {
          try {
            // Vérifie si un paiement existe déjà pour ce locataire et ce mois
            // Utilise la colonne period pour une vérification efficace
            const { data: existingPayments, error: checkError } = await supabase
              .from('payments')
              .select('id')
              .eq('user_id', userId)
              .eq('tenant_id', tenant.id)
              .eq('property_id', tenant.property_id)
              .eq('period', period)
              .limit(1)

            if (checkError) {
              console.error(
                `[generate-monthly-rents] Error checking existing payment for tenant ${tenant.id}:`,
                checkError
              )
              globalStats.totalSkipped++
              continue
            }

            // Si un paiement existe déjà, on skip
            if (existingPayments && existingPayments.length > 0) {
              console.log(
                `[generate-monthly-rents] Paiement déjà existant pour tenant ${tenant.id} (${tenant.name}) - période ${period}`
              )
              globalStats.totalSkipped++
              continue
            }

            // 4️⃣ Calcule le montant total (loyer + charges)
            const property = tenant.properties
            const rentAmount = parseFloat(tenant.rent) || parseFloat(property.rent) || 0

            // Récupère les charges depuis la propriété
            let chargesAmount = 0
            try {
              const { data: propertyData, error: propError } = await supabase
                .from('properties')
                .select('charges_amount')
                .eq('id', tenant.property_id)
                .eq('user_id', userId)
                .maybeSingle()

              if (!propError && propertyData && propertyData.charges_amount !== null && propertyData.charges_amount !== undefined) {
                chargesAmount = parseFloat(propertyData.charges_amount) || 0
              }
            } catch {
              // Si charges_amount n'existe pas, on utilise 0
              console.debug(`[generate-monthly-rents] charges_amount not available for property ${tenant.property_id}, using 0`)
            }

            const totalAmount = rentAmount + chargesAmount

            if (totalAmount <= 0) {
              console.warn(
                `[generate-monthly-rents] Montant invalide pour tenant ${tenant.id} (${tenant.name}): ${totalAmount}`
              )
              globalStats.totalSkipped++
              continue
            }

            // 5️⃣ Crée le paiement
            // La colonne period sera remplie automatiquement par le trigger set_payment_period
            // La contrainte d'unicité idx_payments_unique_monthly_rent empêchera les doublons
            // même si la fonction est relancée par erreur
            const { data: newPayment, error: createError } = await supabase
              .from('payments')
              .insert([
                {
                  property_id: tenant.property_id,
                  tenant_id: tenant.id,
                  user_id: userId,
                  amount: totalAmount,
                  due_date: targetDateStr,
                  date: targetDateStr, // Pour compatibilité avec l'ancien schéma
                  status: 'pending',
                  // period sera rempli automatiquement par le trigger set_payment_period
                },
              ])
              .select()
              .single()

            if (createError) {
              // Si erreur de contrainte unique (code 23505), c'est normal (doublon détecté)
              // Cela peut arriver si le cron job est relancé ou si un paiement a été créé manuellement
              if (createError.code === '23505') {
                console.log(
                  `[generate-monthly-rents] Doublon détecté pour tenant ${tenant.id} (${tenant.name}) - période ${period} (contrainte d'unicité)`
                )
                globalStats.totalSkipped++
              } else {
                console.error(
                  `[generate-monthly-rents] Error creating payment for tenant ${tenant.id}:`,
                  createError
                )
                globalStats.totalSkipped++
              }
              continue
            }

            console.log(
              `[generate-monthly-rents] Paiement créé: ${newPayment.id} pour tenant ${tenant.id} (${tenant.name}) - ${totalAmount}€`
            )
            globalStats.totalGenerated++
          } catch (tenantError) {
            console.error(
              `[generate-monthly-rents] Error processing tenant ${tenant.id}:`,
              tenantError
            )
            globalStats.totalSkipped++
          }
        }
      } catch (userError) {
        console.error(`[generate-monthly-rents] Error processing user ${userId}:`, userError)
        globalStats.errors.push({
          userId,
          error: userError instanceof Error ? userError.message : String(userError),
        })
      }
    }

    console.log(`[generate-monthly-rents] Génération terminée pour ${period}`)
    console.log(`[generate-monthly-rents] Stats: ${globalStats.totalGenerated} générés, ${globalStats.totalSkipped} ignorés`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Génération terminée pour ${period}`,
        period,
        stats: {
          totalUsers: globalStats.totalUsers,
          generated: globalStats.totalGenerated,
          skipped: globalStats.totalSkipped,
          errors: globalStats.errors.length,
        },
        errors: globalStats.errors.length > 0 ? globalStats.errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('[generate-monthly-rents] Fatal error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération des loyers',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
