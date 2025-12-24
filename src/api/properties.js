import { supabase } from '@/lib/supabaseClient'
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

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(
          `
        *,
        tenants (
          id,
          name,
          entry_date,
          exit_date,
          rent,
          status,
          birth_date,
          birth_place
        )
      `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1000) // Limite pour éviter les requêtes trop lourdes

      return { data, error }
    },
    'getProperties',
    { timeout: 10000 } // Réduit de 12s à 10s avec optimisations
  )
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
        tenants (
          id,
          name,
          entry_date,
          exit_date,
          rent,
          status,
          birth_date,
          birth_place
        )
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
    const insertData = {
      // Champs simples (même nom)
      name: propertyData.name,
      address: propertyData.address || '',
      city: propertyData.city,
      rent: Number(propertyData.rent),
      status: propertyData.status || 'vacant',
      user_id: userId
    }

    // Ajoute les champs optionnels avec mapping STRICT Frontend -> Backend (noms de colonnes DB)
    if (propertyData.zip !== undefined && propertyData.zip !== null) {
      insertData.zip = String(propertyData.zip)
    }
    if (propertyData.description !== undefined && propertyData.description !== null) {
      insertData.description = String(propertyData.description)
    }
    if (propertyData.type !== undefined && propertyData.type !== null) {
      insertData.type = String(propertyData.type)
    }
    // MAPPING Frontend -> Backend
    if (propertyData.surface !== undefined && propertyData.surface !== null) {
      insertData.surface_m2 = Number(propertyData.surface) // Frontend "surface" -> DB "surface_m2"
    }
    if (propertyData.pieces !== undefined && propertyData.pieces !== null) {
      insertData.rooms = Number(propertyData.pieces) // Frontend "pieces" -> DB "rooms"
    }
    if (propertyData.heatingType !== undefined && propertyData.heatingType !== null) {
      insertData.heating_type = String(propertyData.heatingType) // Frontend "heatingType" -> DB "heating_type"
    }
    if (propertyData.chargesAmount !== undefined && propertyData.chargesAmount !== null) {
      insertData.charges_amount = Number(propertyData.chargesAmount) // Frontend "chargesAmount" -> DB "charges_amount"
    }
    if (propertyData.image_url !== undefined && propertyData.image_url !== null) {
      insertData.image = String(propertyData.image_url) // Frontend "image_url" -> DB "image"
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([insertData])
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

  return withErrorHandling(
    async () => {
      // Prépare les données de mise à jour avec mapping STRICT Frontend -> Backend
      const updateData = {
        // Champs simples (même nom)
        name: updates.name,
        address: updates.address,
        city: updates.city,
        zip: updates.zip,
        rent: updates.rent !== undefined ? Number(updates.rent) : undefined,
        status: updates.status,
        description: updates.description,
        type: updates.type
      }

      // MAPPING Frontend -> Backend (noms de colonnes DB)
      if (updates.surface !== undefined && updates.surface !== null) {
        updateData.surface_m2 = Number(updates.surface) // Frontend "surface" -> DB "surface_m2"
      }
      if (updates.pieces !== undefined && updates.pieces !== null) {
        updateData.rooms = Number(updates.pieces) // Frontend "pieces" -> DB "rooms"
      }
      if (updates.heatingType !== undefined && updates.heatingType !== null) {
        updateData.heating_type = String(updates.heatingType) // Frontend "heatingType" -> DB "heating_type"
      }
      if (updates.chargesAmount !== undefined && updates.chargesAmount !== null) {
        updateData.charges_amount = Number(updates.chargesAmount) // Frontend "chargesAmount" -> DB "charges_amount"
      }
      if (updates.image_url !== undefined && updates.image_url !== null) {
        updateData.image = String(updates.image_url) // Frontend "image_url" -> DB "image"
      }

      // Supprime les champs non autorisés
      delete updateData.id
      delete updateData.user_id
      delete updateData.created_at
      delete updateData.tenant // Le tenant est géré séparément

      // Supprime les champs undefined pour éviter les updates inutiles
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key]
        }
      })

      // UPDATE optimisé : on sélectionne seulement l'ID pour confirmer la mise à jour
      // Cela évite de charger toutes les colonnes et les relations (tenants) qui peuvent être lentes
      const { data: updateResult, error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .eq('user_id', userId)
        .select('id')
        .single()

      if (updateError) {
        return { data: null, error: updateError }
      }

      // Si l'update a réussi, on retourne les données mises à jour en fusionnant
      // les updates avec les données existantes (le store les a déjà en mémoire)
      // Cela évite un SELECT supplémentaire qui pourrait être lent
      return { 
        data: {
          id: updateResult.id,
          ...updateData,
          // Les autres champs seront préservés côté store
        }, 
        error: null 
      }
    },
    'updateProperty',
    { timeout: 10000 } // Timeout réduit à 10s (UPDATE simple devrait être rapide)
  )
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
