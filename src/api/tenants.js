import { supabase } from '@/lib/supabaseClient'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour les locataires
 * Toutes les interactions avec la table tenants passent par ici
 */

/**
 * Récupère tous les locataires d'un utilisateur (via les propriétés)
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Array, error?: Error }
 */
export async function getTenants(userId) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        `
        *,
        properties (
          id,
          name,
          city,
          address
        )
      `
      )
      .eq('properties.user_id', userId)
      .order('entry_date', { ascending: false })

    return { data, error }
  }, 'getTenants')
}

/**
 * Récupère un locataire par son ID
 * @param {string} tenantId - ID du locataire
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function getTenantById(tenantId, userId) {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        `
        *,
        properties (
          id,
          name,
          city,
          address
        )
      `
      )
      .eq('id', tenantId)
      .eq('properties.user_id', userId)
      .single()

    return { data, error }
  }, 'getTenantById')
}

/**
 * Crée un nouveau locataire
 * @param {Object} tenantData - Données du locataire
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function createTenant(tenantData, userId) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  // Timeout augmenté à 12s pour les créations (peuvent être plus lentes)
  const timeout = 12000

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase
        .from('tenants')
        .insert([
          {
            property_id: tenantData.propertyId,
            name: tenantData.name,
            entry_date: tenantData.entryDate,
            exit_date: tenantData.exitDate || null,
            rent: Number(tenantData.rent) || 0,
            status: tenantData.status || 'on_time'
          }
        ])
        .select()
        .single()

      return { data, error }
    },
    'createTenant',
    { timeout }
  )
}

/**
 * Met à jour un locataire existant
 * @param {string} tenantId - ID du locataire
 * @param {Object} updates - Données à mettre à jour
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function updateTenant(tenantId, updates, userId) {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Prépare les données de mise à jour
    const updateData = {
      ...updates
    }

    // Convertit le loyer en nombre si présent
    if (updateData.rent !== undefined) {
      updateData.rent = Number(updateData.rent)
    }

    // Supprime les champs non autorisés
    delete updateData.id
    delete updateData.property_id
    delete updateData.created_at

    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single()

    // Vérifie que la propriété associée appartient à l'utilisateur
    if (data) {
      const { data: property } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', data.property_id)
        .single()

      if (!property || property.user_id !== userId) {
        return { data: null, error: { message: 'Action non autorisée' } }
      }
    }

    return { data, error }
  }, 'updateTenant')
}

/**
 * Supprime un locataire
 * @param {string} tenantId - ID du locataire
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, error?: Error }
 */
export async function deleteTenant(tenantId, userId) {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Vérifie que le locataire appartient à l'utilisateur
    const { data: tenant } = await supabase
      .from('tenants')
      .select('property_id, properties(user_id)')
      .eq('id', tenantId)
      .single()

    if (!tenant || !tenant.properties || tenant.properties.user_id !== userId) {
      return { data: null, error: { message: 'Action non autorisée' } }
    }

    const { error } = await supabase.from('tenants').delete().eq('id', tenantId)

    return { data: null, error }
  }, 'deleteTenant')
}
