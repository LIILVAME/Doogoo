import { defineStore } from 'pinia'
import { computed, type ComputedRef } from 'vue'
import { usePropertiesStore } from './propertiesStore'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'
import { PROPERTY_STATUS, PAYMENT_STATUS } from '@/utils/constants'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import { tenantsApi } from '@/api'
import * as documentsApi from '@/api/documents'
import type { RetryResult } from '@/utils/retry'
import type { PropertyData } from './propertiesStore'

/**
 * Types pour les données de locataire
 */

/**
 * Locataire avec informations de propriété (format du store)
 */
export interface TenantData {
  id: string // UUID du locataire (tenant.id) ou fallback sur property.id
  propertyId: string // UUID de la propriété
  name: string // Nom complet du locataire (PII - ne pas logger)
  property: string // Nom de la propriété
  propertyCity: string // Ville de la propriété
  entryDate: string // Date d'entrée (ISO format)
  exitDate: string | null // Date de sortie (null si toujours présent)
  rent: number // Loyer (number, pas string)
  status: 'on_time' | 'late' | 'pending' | 'paid' // Statut de paiement
  birthDate?: string | null // Date de naissance (ISO format, pour conformité Loi Alur)
  birthPlace?: string | null // Lieu de naissance (pour conformité Loi Alur)
}

/**
 * Données pour créer un nouveau locataire
 */
export interface CreateTenantData {
  propertyId?: string
  property?: string // Nom de la propriété (fallback si propertyId non fourni)
  name: string // Nom complet (PII)
  email?: string // Email du locataire (optionnel)
  entryDate: string
  exitDate?: string | null
  rent: number | string
  status?: 'on_time' | 'late' | 'pending' | 'paid'
  birthDate?: string | null // Date de naissance (ISO format, pour conformité Loi Alur)
  birthPlace?: string | null // Lieu de naissance (pour conformité Loi Alur)
}

/**
 * Données pour mettre à jour un locataire
 */
export interface UpdateTenantData {
  name?: string // PII
  entryDate?: string
  exitDate?: string | null
  rent?: number | string
  status?: 'on_time' | 'late' | 'pending' | 'paid'
  birthDate?: string | null // Date de naissance (ISO format, pour conformité Loi Alur)
  birthPlace?: string | null // Lieu de naissance (pour conformité Loi Alur)
}

/**
 * Store Pinia pour gérer les locataires
 *
 * NOTE: Ce store est dérivé de propertiesStore pour les computed.
 * Les actions CRUD utilisent directement l'API layer tenantsApi.
 */
export const useTenantsStore = defineStore('tenants', () => {
  const propertiesStore = usePropertiesStore()
  const authStore = useAuthStore()

  /**
   * Computed : Liste des locataires extraits des propriétés
   * Chaque locataire inclut les informations du bien associé
   */
  const tenants: ComputedRef<TenantData[]> = computed(() => {
    try {
      const filtered = propertiesStore.properties.filter(
        (p): p is PropertyData =>
          p !== null &&
          p !== undefined &&
          p.tenant !== null &&
          p.tenant !== undefined &&
          p.status === PROPERTY_STATUS.OCCUPIED
      )

      const mapped = filtered
        .map((property): TenantData | null => {
          // Vérifie que property.tenant existe avant d'accéder à ses propriétés
          if (!property.tenant) {
            if (import.meta.env.DEV) {
              // Log sécurisé : ne pas exposer le nom de la propriété (peut contenir des infos sensibles)
              console.warn('⚠️ Property has tenant null but passed filter:', {
                id: property.id,
                status: property.status
              })
            }
            return null
          }

          return {
            id: property.tenant.id || property.id, // Utilise l'ID du locataire (UUID) si disponible, sinon l'ID du bien
            propertyId: property.id,
            name: property.tenant.name, // PII - ne pas logger en clair
            property: property.name,
            propertyCity: property.city,
            entryDate: property.tenant.entryDate,
            exitDate: property.tenant.exitDate || null,
            rent: property.rent,
            status: property.tenant.status || PAYMENT_STATUS.ON_TIME,
            birthDate: property.tenant.birthDate || null,
            birthPlace: property.tenant.birthPlace || null
          }
        })
        .filter((t): t is TenantData => t !== null) // Supprime les valeurs null

      // Pas de log d'avertissement pour éviter le bruit pendant l'initialisation
      // Le computed se met à jour automatiquement lorsque les données sont disponibles

      return mapped
    } catch (error) {
      // Log sécurisé : ne pas exposer les détails de l'erreur qui peuvent contenir des données
      const errorObj = error as Error
      console.error('❌ Erreur dans computed tenants:', sanitizeObject(errorObj, ['message']))
      return []
    }
  })

  /**
   * Crée un nouveau locataire dans la base de données
   * @param tenantData - Données du locataire à créer
   * @returns Le locataire créé ou null si erreur
   */
  const createTenant = async (tenantData: CreateTenantData): Promise<PropertyData | null> => {
    const toast = useToastStore()

    try {
      // Vérifie que l'utilisateur est authentifié
      if (!authStore.user?.id) {
        toast.error('Vous devez être connecté pour ajouter un locataire')
        return null
      }

      // Trouve le bien correspondant par son ID
      let property: PropertyData | undefined = undefined

      if (tenantData.propertyId) {
        property = propertiesStore.properties.find(p => p.id === tenantData.propertyId)
      } else if (tenantData.property) {
        property = propertiesStore.properties.find(p => p.name === tenantData.property)
      }

      if (!property) {
        const errorMsg = 'Bien non trouvé pour le locataire'
        if (import.meta.env.DEV) {
          console.warn(errorMsg, {
            hasPropertyId: !!tenantData.propertyId,
            hasPropertyName: !!tenantData.property
          })
        }
        toast.error(errorMsg)
        return null
      }

      // Crée le locataire via l'API layer
      const result = await tenantsApi.createTenant(
        {
          propertyId: property.id,
          name: tenantData.name,
          email: tenantData.email,
          entryDate: tenantData.entryDate,
          exitDate: tenantData.exitDate || null,
          rent: Number(tenantData.rent) || 0,
          status: tenantData.status || PAYMENT_STATUS.ON_TIME,
          birthDate: tenantData.birthDate || null,
          birthPlace: tenantData.birthPlace || null
        },
        authStore.user.id
      )

      if (result.success && result.data) {
        // Met à jour le statut de la propriété pour qu'elle soit "occupied"
        await propertiesStore.updateProperty(property.id, {
          status: PROPERTY_STATUS.OCCUPIED
        })

        // Recharge les propriétés pour avoir les données à jour
        await propertiesStore.fetchProperties(true)

        // Retourne la propriété mise à jour
        const updatedProperty = propertiesStore.properties.find(p => p.id === property.id)
        toast.success(`Locataire "${tenantData.name}" ajouté avec succès`)
        return updatedProperty || property
      } else {
        const errorMsg = result.error?.message || 'Erreur lors de la création du locataire'
        toast.error(errorMsg)
        return null
      }
    } catch (error) {
      const errorObj = error as Error
      toast.error(`Erreur lors de l'ajout du locataire : ${errorObj.message}`)
      throw error
    }
  }

  /**
   * Ajoute un nouveau locataire (alias pour createTenant pour compatibilité)
   * @param tenantData - Données du locataire à ajouter
   * @returns Le bien mis à jour ou null si erreur
   */
  const addTenant = async (tenantData: CreateTenantData): Promise<PropertyData | null> => {
    return createTenant(tenantData)
  }

  /**
   * Récupère un locataire par son ID
   * @param tenantId - ID UUID du locataire
   * @returns Le locataire ou null si non trouvé
   */
  const getTenantById = async (tenantId: string): Promise<TenantData | null> => {
    if (!authStore.user?.id) {
      return null
    }

    try {
      const result = await tenantsApi.getTenantById(tenantId, authStore.user.id)
      if (result.success && result.data) {
        // Convertit les données API en format TenantData
        const property = propertiesStore.properties.find(p => p.id === result.data.property_id)
        if (property) {
          return {
            id: result.data.id,
            propertyId: result.data.property_id,
            name: result.data.name,
            property: property.name,
            propertyCity: property.city,
            entryDate: result.data.entry_date,
            exitDate: result.data.exit_date || null,
            rent: Number(result.data.rent) || 0,
            status: result.data.status || PAYMENT_STATUS.ON_TIME,
            birthDate: result.data.birth_date || null,
            birthPlace: result.data.birth_place || null
          }
        }
      }
      return null
    } catch (error) {
      const errorObj = error as Error
      console.error(
        'Erreur lors de la récupération du locataire:',
        sanitizeObject(errorObj, ['message'])
      )
      return null
    }
  }

  /**
   * Met à jour un locataire existant
   * @param tenantId - ID UUID du locataire (tenant.id)
   * @param updates - Données à mettre à jour
   */
  const updateTenant = async (tenantId: string, updates: UpdateTenantData): Promise<void> => {
    const toast = useToastStore()

    try {
      // Vérifie que l'utilisateur est authentifié
      if (!authStore.user?.id) {
        toast.error('Vous devez être connecté pour mettre à jour un locataire')
        return
      }

      // Prépare les données pour l'API (format Supabase)
      const apiUpdates: Record<string, unknown> = {}
      if (updates.name !== undefined) apiUpdates.name = updates.name
      if (updates.entryDate !== undefined) apiUpdates.entry_date = updates.entryDate
      if (updates.exitDate !== undefined) apiUpdates.exit_date = updates.exitDate || null
      if (updates.rent !== undefined) apiUpdates.rent = Number(updates.rent)
      if (updates.status !== undefined) apiUpdates.status = updates.status
      if (updates.birthDate !== undefined) apiUpdates.birth_date = updates.birthDate || null
      if (updates.birthPlace !== undefined) apiUpdates.birth_place = updates.birthPlace || null

      // Met à jour le locataire directement via l'API
      const result = await tenantsApi.updateTenant(tenantId, apiUpdates, authStore.user.id)

      if (result.success && result.data) {
        // Recharge les propriétés pour avoir les données à jour
        await propertiesStore.fetchProperties(true)
        toast.success('Locataire mis à jour avec succès')
      } else {
        const errorMsg =
          result.error?.message || result.message || 'Erreur lors de la mise à jour du locataire'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      const errorObj = error as Error
      toast.error(`Erreur lors de la mise à jour : ${errorObj.message}`)
      throw error
    }
  }

  /**
   * Supprime un locataire (libère le bien)
   * @param tenantId - ID UUID du locataire (tenant.id)
   */
  const removeTenant = async (tenantId: string): Promise<void> => {
    const toast = useToastStore()

    try {
      // Trouve le locataire dans la liste
      const tenant = tenants.value.find(t => t.id === tenantId)

      if (tenant && tenant.propertyId) {
        await propertiesStore.updateProperty(tenant.propertyId, {
          status: PROPERTY_STATUS.VACANT,
          tenant: null
        })

        toast.success('Locataire supprimé avec succès')
      }
    } catch (error) {
      const errorObj = error as Error
      toast.error(`Erreur lors de la suppression : ${errorObj.message}`)
      throw error
    }
  }

  /**
   * Computed : Locataires à jour
   */
  const onTimeTenants: ComputedRef<TenantData[]> = computed(() =>
    tenants.value.filter(t => t.status === PAYMENT_STATUS.ON_TIME)
  )

  /**
   * Computed : Locataires en retard
   */
  const lateTenants: ComputedRef<TenantData[]> = computed(() =>
    tenants.value.filter(t => t.status === PAYMENT_STATUS.LATE)
  )

  /**
   * Computed : Total des loyers des locataires
   */
  const totalTenantsRent: ComputedRef<number> = computed(() =>
    tenants.value.reduce((sum, t) => sum + (t.rent || 0), 0)
  )

  /**
   * Upload un document pour un locataire
   * @param tenantId - ID UUID du locataire
   * @param file - Fichier à uploader
   * @returns Liste des documents mis à jour
   */
  const uploadDocument = async (tenantId: string, file: File): Promise<unknown[]> => {
    const toast = useToastStore()

    try {
      if (!authStore.user?.id) {
        toast.error('Vous devez être connecté pour uploader un document')
        return []
      }

      const result = await (documentsApi.uploadDocument(
        tenantId,
        file,
        authStore.user.id
      ) as Promise<RetryResult<any>>)

      if (result.success) {
        toast.success('Document uploadé avec succès')
        // Rafraîchit la liste des documents
        return await fetchDocuments(tenantId)
      } else {
        const errorMsg = result.error?.message || result.message || "Erreur lors de l'upload"
        toast.error(errorMsg)
        return []
      }
    } catch (error) {
      const errorObj = error as Error
      toast.error(`Erreur lors de l'upload : ${errorObj.message}`)
      throw error
    }
  }

  /**
   * Récupère la liste des documents d'un locataire
   * @param tenantId - ID UUID du locataire
   * @returns Liste des documents
   */
  const fetchDocuments = async (tenantId: string): Promise<unknown[]> => {
    try {
      if (!authStore.user?.id) {
        return []
      }

      const result = await (documentsApi.listDocuments(tenantId, authStore.user.id) as Promise<
        RetryResult<any>
      >)

      if (result.success && result.data) {
        return result.data
      }

      return []
    } catch (error) {
      const errorObj = error as Error
      console.error(
        'Erreur lors de la récupération des documents:',
        sanitizeObject(errorObj, ['message'])
      )
      return []
    }
  }

  /**
   * Génère une URL signée pour télécharger un document
   * @param tenantId - ID UUID du locataire
   * @param fileName - Nom du fichier
   * @returns URL signée ou null
   */
  const getDocumentUrl = async (tenantId: string, fileName: string): Promise<string | null> => {
    try {
      if (!authStore.user?.id) {
        return null
      }

      const result = await (documentsApi.getDocumentUrl(
        tenantId,
        fileName,
        authStore.user.id,
        3600
      ) as Promise<RetryResult<{ signedUrl: string }>>)

      if (result.success && result.data?.signedUrl) {
        return result.data.signedUrl
      }

      return null
    } catch (error) {
      const errorObj = error as Error
      console.error("Erreur lors de la génération de l'URL:", sanitizeObject(errorObj, ['message']))
      return null
    }
  }

  /**
   * Supprime un document
   * @param tenantId - ID UUID du locataire
   * @param fileName - Nom du fichier à supprimer
   * @returns Liste des documents mis à jour
   */
  const deleteDocument = async (tenantId: string, fileName: string): Promise<unknown[]> => {
    const toast = useToastStore()

    try {
      if (!authStore.user?.id) {
        toast.error('Vous devez être connecté pour supprimer un document')
        return []
      }

      const result = await (documentsApi.deleteDocument(
        tenantId,
        fileName,
        authStore.user.id
      ) as Promise<RetryResult<any>>)

      if (result.success) {
        toast.success('Document supprimé avec succès')
        // Rafraîchit la liste des documents
        return await fetchDocuments(tenantId)
      } else {
        const errorMsg = result.error?.message || result.message || 'Erreur lors de la suppression'
        toast.error(errorMsg)
        return []
      }
    } catch (error) {
      const errorObj = error as Error
      toast.error(`Erreur lors de la suppression : ${errorObj.message}`)
      throw error
    }
  }

  /**
   * Réinitialise le store (placeholder pour cohérence)
   *
   * NOTE: Rien à faire car tenants est computed depuis propertiesStore.
   * Le reset se fait automatiquement quand propertiesStore est reset.
   */
  const reset = (): void => {
    // Rien à faire car tenants est computed depuis propertiesStore
    // Le reset se fait automatiquement quand propertiesStore.reset() est appelé
  }

  return {
    // State (computed)
    tenants,
    // Actions
    createTenant,
    addTenant, // Alias pour compatibilité
    getTenantById,
    updateTenant,
    removeTenant,
    reset,
    // Document actions
    uploadDocument,
    fetchDocuments,
    getDocumentUrl,
    deleteDocument,
    // Getters
    onTimeTenants,
    lateTenants,
    totalTenantsRent
  }
})
