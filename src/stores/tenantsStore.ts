import { defineStore } from 'pinia'
import { computed, type ComputedRef } from 'vue'
import { usePropertiesStore } from './propertiesStore'
import { useToastStore } from './toastStore'
import { PROPERTY_STATUS, PAYMENT_STATUS } from '@/utils/constants'
import { sanitizeObject } from '@/utils/sanitizeLogs'
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
}

/**
 * Données pour créer un nouveau locataire
 */
export interface CreateTenantData {
  propertyId?: string
  property?: string // Nom de la propriété (fallback si propertyId non fourni)
  name: string // Nom complet (PII)
  entryDate: string
  exitDate?: string | null
  rent: number | string
  status?: 'on_time' | 'late' | 'pending' | 'paid'
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
}

/**
 * Store Pinia pour gérer les locataires
 *
 * NOTE: Ce store est dérivé de propertiesStore.
 * Il n'a pas de state propre mais calcule les locataires depuis les propriétés.
 * Les actions CRUD passent par propertiesStore.updateProperty().
 */
export const useTenantsStore = defineStore('tenants', () => {
  const propertiesStore = usePropertiesStore()

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
            status: property.tenant.status || PAYMENT_STATUS.ON_TIME
          }
        })
        .filter((t): t is TenantData => t !== null) // Supprime les valeurs null

      // Debug en développement (sécurisé)
      if (import.meta.env.DEV && mapped.length === 0 && propertiesStore.properties.length > 0) {
        // Log sécurisé : statistiques uniquement, pas de PII
        console.warn('⚠️ Aucun locataire trouvé dans les propriétés:', {
          totalProperties: propertiesStore.properties.length,
          propertiesWithTenants: propertiesStore.properties.filter(p => p.tenant !== null).length,
          occupiedProperties: propertiesStore.properties.filter(
            p => p.status === PROPERTY_STATUS.OCCUPIED
          ).length,
          // Ne pas logger les noms de propriétés ni de locataires (PII)
          propertiesCount: propertiesStore.properties.length
        })
      }

      return mapped
    } catch (error) {
      // Log sécurisé : ne pas exposer les détails de l'erreur qui peuvent contenir des données
      const errorObj = error as Error
      console.error('❌ Erreur dans computed tenants:', sanitizeObject(errorObj, ['message']))
      return []
    }
  })

  /**
   * Ajoute un nouveau locataire à un bien existant
   * @param tenantData - Données du locataire à ajouter
   * @returns Le bien mis à jour ou null si erreur
   */
  const addTenant = async (tenantData: CreateTenantData): Promise<PropertyData | null> => {
    const toast = useToastStore()

    try {
      // Trouve le bien correspondant par son ID (UUID maintenant)
      let property: PropertyData | undefined = undefined

      if (tenantData.propertyId) {
        property = propertiesStore.properties.find(p => p.id === tenantData.propertyId)
      } else if (tenantData.property) {
        property = propertiesStore.properties.find(p => p.name === tenantData.property)
      }

      if (property) {
        // Met à jour le bien avec le nouveau locataire via Supabase
        await propertiesStore.updateProperty(property.id, {
          status: PROPERTY_STATUS.OCCUPIED,
          tenant: {
            name: tenantData.name, // PII - mais nécessaire pour la création
            entryDate: tenantData.entryDate,
            exitDate: tenantData.exitDate || null,
            rent: Number(tenantData.rent),
            status: tenantData.status || PAYMENT_STATUS.ON_TIME
          }
        })

        // Toast avec nom de locataire OK (affichage utilisateur)
        toast.success(`Locataire "${tenantData.name}" ajouté avec succès`)
        return property
      } else {
        const errorMsg = 'Bien non trouvé pour le locataire'
        // Log sécurisé : ne pas logger le nom de propriété qui peut être sensible
        if (import.meta.env.DEV) {
          console.warn(errorMsg, {
            hasPropertyId: !!tenantData.propertyId,
            hasPropertyName: !!tenantData.property
          })
        }
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
   * Met à jour un locataire existant
   * @param tenantId - ID UUID du locataire (tenant.id)
   * @param updates - Données à mettre à jour
   */
  const updateTenant = async (tenantId: string, updates: UpdateTenantData): Promise<void> => {
    const toast = useToastStore()

    try {
      // Trouve le locataire dans la liste
      const tenant = tenants.value.find(t => t.id === tenantId)

      if (tenant && tenant.propertyId) {
        const property = propertiesStore.properties.find(p => p.id === tenant.propertyId)

        if (property && property.tenant) {
          await propertiesStore.updateProperty(property.id, {
            tenant: {
              ...property.tenant,
              ...updates,
              // Convertit le loyer en number si présent
              rent: updates.rent ? Number(updates.rent) : property.tenant.rent
            }
          })

          toast.success('Locataire mis à jour avec succès')
        }
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
    addTenant,
    updateTenant,
    removeTenant,
    reset,
    // Getters
    onTimeTenants,
    lateTenants,
    totalTenantsRent
  }
})
