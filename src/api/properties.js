import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour les propriétés
 * Toutes les interactions avec la table properties passent par ici
 */

/**
 * Récupère toutes les propriétés d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Array, error?: Error }
 */
export async function getProperties(userId) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    console.log('🔍 getProperties API: Début requête Supabase', { userId })

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        tenants (*)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    console.log('🔍 getProperties API: Réponse Supabase', {
      dataCount: data?.length || 0,
      error: error?.message || null,
      hasData: !!data,
      data: data
        ? data.map(p => ({
            id: p.id,
            name: p.name,
            user_id: p.user_id,
            tenantsCount: p.tenants?.length || 0
          }))
        : null
    })

    return { data, error }
  }, 'getProperties')
}

/**
 * Récupère une propriété par son ID
 * @param {string} propertyId - ID de la propriété
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function getPropertyById(propertyId, userId) {
  if (!propertyId || !userId) {
    return { success: false, message: 'Property ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        tenants (*)
      `
      )
      .eq('id', propertyId)
      .eq('user_id', userId)
      .single()

    return { data, error }
  }, 'getPropertyById')
}

/**
 * Crée une nouvelle propriété
 * @param {Object} propertyData - Données de la propriété
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function createProperty(propertyData, userId) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          name: propertyData.name,
          address: propertyData.address || '',
          city: propertyData.city,
          rent: Number(propertyData.rent),
          status: propertyData.status || 'vacant',
          user_id: userId
        }
      ])
      .select()
      .single()

    return { data, error }
  }, 'createProperty')
}

/**
 * Met à jour une propriété existante
 * @param {string} propertyId - ID de la propriété
 * @param {Object} updates - Données à mettre à jour
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: Error }
 */
export async function updateProperty(propertyId, updates, userId) {
  if (!propertyId || !userId) {
    return { success: false, message: 'Property ID et User ID requis' }
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
    delete updateData.user_id
    delete updateData.created_at

    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  }, 'updateProperty')
}

/**
 * Supprime une propriété
 * @param {string} propertyId - ID de la propriété
 * @param {string} userId - ID de l'utilisateur (pour la sécurité)
 * @returns {Promise<Object>} { success: boolean, error?: Error }
 */
export async function deleteProperty(propertyId, userId) {
  if (!propertyId || !userId) {
    return { success: false, message: 'Property ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', userId)

    return { data: null, error }
  }, 'deleteProperty')
}
