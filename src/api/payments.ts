import { supabase } from '@/lib/supabaseClient'

import { withErrorHandling } from '@/utils/apiErrorHandler'
import type { PostgrestError } from '@supabase/supabase-js'

export interface PaymentParams {
  propertyId: string
  tenantId: string
  amount: number | string
  date: string
  status?: string
  dueDate?: string // Alias pour date (compatibilité)
}

export interface PaymentUpdateParams {
  propertyId?: string
  tenantId?: string
  amount?: number | string
  date?: string
  status?: string
  dueDate?: string
  // Champs techniques
  id?: string
  user_id?: string
  created_at?: string
  property_id?: string
  tenant_id?: string
}

export interface PaymentFilters {
  status?: string
  propertyId?: string
  startDate?: string
  endDate?: string
  orderAscending?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: PostgrestError | Error | null
  message?: string
}

/**
 * Récupère tous les paiements d'un utilisateur
 */
export async function getPayments(userId: string): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase
        .from('payments_view')
        .select(
          `
        id,
        property_id,
        tenant_id,
        amount,
        due_date,
        status,
        created_at,
        updated_at,
        properties (
          id,
          name,
          city
        ),
        tenants (
          id,
          name
        )
      `
        )
        .eq('user_id', userId)
        .order('due_date', { ascending: false })
        .limit(1000)

      return { data, error }
    },
    'getPayments',
    { timeout: 10000 }
  )
}

/**
 * Récupère un paiement par son ID
 */
export async function getPaymentById(paymentId: string, userId: string): Promise<ApiResponse> {
  if (!paymentId || !userId) {
    return { success: false, message: 'Payment ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('payments_view')
      .select(
        `
        *,
        properties (
          id,
          name,
          city
        ),
        tenants (
          id,
          name
        )
      `
      )
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single()

    return { data, error }
  }, 'getPaymentById')
}

/**
 * Crée un nouveau paiement
 */
export async function createPayment(
  paymentData: PaymentParams,
  userId: string
): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    // La table payments utilise 'date' et non 'due_date'
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          property_id: paymentData.propertyId || null,
          tenant_id: paymentData.tenantId || null,
          amount: Number(paymentData.amount),
          date: paymentData.dueDate || paymentData.date, // La table utilise 'date'
          status: paymentData.status || 'pending',
          user_id: userId
        }
      ])
      .select(
        `
        *,
        properties (
          id,
          name,
          city
        ),
        tenants (
          id,
          name
        )
      `
      )
      .single()

    return { data, error }
  }, 'createPayment')
}

/**
 * Met à jour un paiement existant
 */
export async function updatePayment(
  paymentId: string,
  updates: PaymentUpdateParams,
  userId: string
): Promise<ApiResponse> {
  if (!paymentId || !userId) {
    return { success: false, message: 'Payment ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Prépare les données de mise à jour
    const updateData: Record<string, any> = {
      ...updates
    }

    // Convertit le montant en nombre si présent
    if (updateData.amount !== undefined) {
      updateData.amount = Number(updateData.amount)
    }

    // Mappe dueDate vers date (la table utilise 'date')
    if (updateData.dueDate !== undefined) {
      updateData.date = updateData.dueDate
      delete updateData.dueDate
    }

    // Supprime les champs non autorisés
    delete updateData.id
    delete updateData.user_id
    delete updateData.created_at
    delete updateData.property_id
    delete updateData.tenant_id

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .eq('user_id', userId)
      .select(
        `
        *,
        properties (
          id,
          name,
          city
        ),
        tenants (
          id,
          name
        )
      `
      )
      .single()

    return { data, error }
  }, 'updatePayment')
}

/**
 * Supprime un paiement
 */
export async function deletePayment(paymentId: string, userId: string): Promise<ApiResponse> {
  if (!paymentId || !userId) {
    return { success: false, message: 'Payment ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId)
      .eq('user_id', userId)

    return { data: null, error }
  }, 'deletePayment')
}

/**
 * Récupère les paiements selon des critères
 */
export async function getPaymentsByFilters(
  userId: string,
  filters: PaymentFilters = {}
): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    let query = supabase
      .from('payments_view')
      .select(
        `
        *,
        properties (
          id,
          name,
          city
        ),
        tenants (
          id,
          name
        )
      `
      )
      .eq('user_id', userId)

    // Filtre par statut
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    // Filtre par bien
    if (filters.propertyId) {
      query = query.eq('property_id', filters.propertyId)
    }

    // Filtre par date (date de début)
    if (filters.startDate) {
      query = query.gte('due_date', filters.startDate)
    }

    // Filtre par date (date de fin)
    if (filters.endDate) {
      query = query.lte('due_date', filters.endDate)
    }

    query = query.order('due_date', { ascending: filters.orderAscending ?? false })

    const { data, error } = await query

    return { data, error }
  }, 'getPaymentsByFilters')
}

/**
 * Génère automatiquement les paiements mensuels
 */
export async function generateMonthlyRents(
  userId: string,
  options: { month?: number; year?: number } = {}
): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(
    async () => {
      // Récupère le token de session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        return {
          success: false,
          message: 'Session non valide',
          error: sessionError
        }
      }

      const session = sessionData.session

      // Appelle l'Edge Function pour génération manuelle
      // Note: Essaie d'abord avec camelCase, puis avec kebab-case si ça échoue
      let functionName = 'generateMonthlyRents'
      let result = await supabase.functions.invoke(functionName, {
        body: {
          month: options.month,
          year: options.year
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })

      // Si camelCase échoue, essayons kebab-case
      if (
        result.error &&
        (result.error.message?.includes('Failed to send') ||
          result.error.message?.includes('CORS') ||
          result.error.name === 'FunctionsFetchError')
      ) {
        functionName = 'generate-monthly-rents'
        result = await supabase.functions.invoke(functionName, {
          body: {
            month: options.month,
            year: options.year
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
      }

      const { data, error } = result

      if (error) {
        return { success: false, message: error.message || 'Erreur lors de la génération', error }
      }

      return { success: true, data }
    },
    'generateMonthlyRents',
    { timeout: 30000 }
  )
}
