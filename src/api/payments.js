import { supabase } from '@/lib/supabaseClient'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour les paiements
 * Toutes les interactions avec la table payments passent par ici
 */

/**
 * Récupère tous les paiements d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Array, error?: Error }
 */
export async function getPayments(userId) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(
    async () => {
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
        .eq('user_id', userId)
        .order('due_date', { ascending: false })

      return { data, error }
    },
    'getPayments',
    { timeout: 12000 }
  )
}

/**
 * Récupère un paiement par son ID
 * @param {string} paymentId - ID du paiement
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function getPaymentById(paymentId, userId) {
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
 * @param {Object} paymentData - Données du paiement
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function createPayment(paymentData, userId) {
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
 * @param {string} paymentId - ID du paiement
 * @param {Object} updates - Données à mettre à jour
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function updatePayment(paymentId, updates, userId) {
  if (!paymentId || !userId) {
    return { success: false, message: 'Payment ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Prépare les données de mise à jour
    const updateData = {
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
 * @param {string} paymentId - ID du paiement
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, error?: Error }
 */
export async function deletePayment(paymentId, userId) {
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
 * Récupère les paiements selon des critères (pour les filtres/rapports)
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} filters - Filtres à appliquer (status, propertyId, dateRange, etc.)
 * @returns {Promise<Object>} { success: boolean, data?: Array, error?: Error }
 */
export async function getPaymentsByFilters(userId, filters = {}) {
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
