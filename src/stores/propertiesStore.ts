import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'
import { PROPERTY_STATUS } from '@/utils/constants'
import { propertiesApi } from '@/api'
import { tenantsApi } from '@/api'
import { useStoreLoader } from '@/composables/useStoreLoader'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import type { Property } from '@/types/api'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Types pour les données de propriété
 */

/**
 * Locataire dans le contexte d'une propriété
 */
export interface PropertyTenant {
  id: string
  name: string
  entryDate: string
  exitDate: string | null
  rent: number
  status: 'on_time' | 'late' | 'pending' | 'paid'
}

/**
 * Propriété avec données transformées depuis l'API
 */
export interface PropertyData extends Omit<Property, 'tenant' | 'status'> {
  status: 'occupied' | 'vacant'
  tenant: PropertyTenant | null
  surface: number
  pieces: number
  description: string
  type: string
  image: string
}

/**
 * Données pour créer une nouvelle propriété
 */
export interface CreatePropertyData {
  name: string
  address?: string
  city: string
  rent: number | string
  status?: 'occupied' | 'vacant'
  surface?: number
  pieces?: number
  description?: string
  type?: string
  tenant?: {
    name: string
    entryDate: string
    exitDate?: string | null
    rent?: number | string
    status?: 'on_time' | 'late' | 'pending' | 'paid'
  } | null
}

/**
 * Données pour mettre à jour une propriété
 */
export interface UpdatePropertyData {
  name?: string
  address?: string
  city?: string
  rent?: number | string
  status?: 'occupied' | 'vacant'
  surface?: number
  pieces?: number
  description?: string
  type?: string
  tenant?: {
    name: string
    entryDate: string
    exitDate?: string | null
    rent?: number | string
    status?: 'on_time' | 'late' | 'pending' | 'paid'
  } | null
}

/**
 * Statistiques des propriétés
 */
export interface PropertyStats {
  total: number
  occupied: number
  vacant: number
  totalRent: number
  occupancyRate: number
}

/**
 * Données de propriété depuis l'API Supabase
 */
interface PropertyApiData {
  id: string
  name: string
  address?: string | null
  city: string
  rent: number | string
  status: 'occupied' | 'vacant'
  surface?: number | string | null
  pieces?: number | string | null
  description?: string | null
  type?: string | null
  created_at?: string
  updated_at?: string
  tenants?: Array<{
    id: string
    name: string
    entry_date: string
    exit_date?: string | null
    rent: number | string
    status?: 'on_time' | 'late' | 'pending' | 'paid'
  }> | null
}

/**
 * Réponse API pour les propriétés
 */
interface PropertiesApiResponse {
  success: boolean
  data?: PropertyApiData | PropertyApiData[]
  message?: string
  error?: Error
}

/**
 * Store Pinia pour gérer les biens immobiliers
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePropertiesStore = defineStore(
  'properties',
  () => {
    // State
    const properties: Ref<PropertyData[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    // Surveillance automatique du loading pour éviter les blocages
    const { cleanup: _cleanupLoader } = useStoreLoader(loading, 'PropertiesStore')
    let realtimeChannel: RealtimeChannel | null = null
    let isRealtimeInitialized = false
    let isRealtimeActive = false
    let lastFetchTime = 0
    const FETCH_CACHE_MS = 5000

    /**
     * Transforme les données de l'API vers le format du store
     */
    const transformPropertyData = (prop: PropertyApiData): PropertyData => {
      return {
        id: prop.id,
        name: prop.name,
        address: prop.address || '',
        city: prop.city,
        status: prop.status,
        rent: Number(prop.rent),
        tenant:
          prop.tenants && prop.tenants.length > 0
            ? {
                id: prop.tenants[0].id,
                name: prop.tenants[0].name,
                entryDate: prop.tenants[0].entry_date,
                exitDate: prop.tenants[0].exit_date || null,
                rent: Number(prop.tenants[0].rent),
                status: prop.tenants[0].status || 'on_time'
              }
            : null,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        surface: Number(prop.surface) || 0,
        pieces: Number(prop.pieces) || 0,
        description: prop.description || '',
        type: prop.type || 'apartment'
      }
    }

    /**
     * Récupère toutes les propriétés de l'utilisateur depuis Supabase
     */
    const fetchProperties = async (force = false): Promise<void> => {
      const authStore = useAuthStore()
      if (!authStore.user) {
        if (import.meta.env.DEV) {
          console.warn('fetchProperties: User not authenticated, skipping fetch')
        }
        loading.value = false
        return
      }

      // Évite les requêtes multiples si déjà en cours (sauf si force = true)
      if (loading.value && !force) {
        if (import.meta.env.DEV) {
          console.debug('fetchProperties: requête déjà en cours, skip')
        }
        return
      }

      // Si loading est à true (bloqué), on le reset avant de commencer
      if (loading.value) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ fetchProperties: loading déjà à true au début, reset avant fetch')
        }
        loading.value = false
      }

      // Cache de 5 secondes pour éviter les requêtes trop fréquentes
      const now = Date.now()
      if (!force && now - lastFetchTime < FETCH_CACHE_MS && properties.value.length > 0) {
        loading.value = false
        return
      }

      loading.value = true
      error.value = null

      try {
        // Timeout explicite de 10 secondes pour éviter blocage
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error('Timeout: La requête a pris plus de 10 secondes')),
            10000
          )
        })

        const apiPromise = propertiesApi.getProperties(
          authStore.user.id
        ) as Promise<PropertiesApiResponse>
        const result = await Promise.race([apiPromise, timeoutPromise])

        if (result.success && result.data) {
          lastFetchTime = Date.now()
          const dataArray = Array.isArray(result.data) ? result.data : [result.data]
          properties.value = dataArray.map(transformPropertyData)
        } else {
          error.value = result.message || 'Erreur lors de la récupération des biens'

          // Si erreur réseau et qu'on a des données en cache, les utiliser
          const { useConnectionStore } = await import('@/stores/connectionStore')
          const { useToastStore } = await import('@/stores/toastStore')
          const connectionStore = useConnectionStore()
          const toastStore = useToastStore()

          if (!connectionStore.isOnline && properties.value.length > 0) {
            if (toastStore) {
              toastStore.info('⚠️ Données locales affichées (connexion perdue)')
            }
          }
        }
      } catch (err) {
        const errorObj = err as Error
        // Log sécurisé : ne pas exposer les détails sensibles (adresses, noms de locataires)
        console.error(
          'Erreur lors du chargement des propriétés:',
          sanitizeObject(errorObj, ['message'])
        )
        error.value = errorObj.message || 'Erreur lors de la récupération des biens'

        // Si erreur et qu'on a des données en cache, on continue avec le cache
        if (properties.value.length > 0) {
          const { useToastStore } = await import('@/stores/toastStore')
          const toastStore = useToastStore()
          if (toastStore) {
            toastStore.warning('⚠️ Erreur de chargement, données en cache affichées')
          }
        }
      } finally {
        loading.value = false
      }
    }

    /**
     * Ajoute un nouveau bien dans Supabase
     */
    const addProperty = async (propertyData: CreatePropertyData): Promise<PropertyData> => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Optimistic UI : Ajoute temporairement le bien à la liste
        const optimisticProperty: PropertyData = {
          id: `temp-${Date.now()}`,
          name: propertyData.name,
          address: propertyData.address || '',
          city: propertyData.city,
          status: propertyData.status || PROPERTY_STATUS.VACANT,
          rent: Number(propertyData.rent),
          tenant: propertyData.tenant
            ? {
                id: 'temp-tenant',
                name: propertyData.tenant.name,
                entryDate: propertyData.tenant.entryDate,
                exitDate: propertyData.tenant.exitDate || null,
                rent: Number(propertyData.tenant.rent || propertyData.rent),
                status: propertyData.tenant.status || 'on_time'
              }
            : null,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          surface: propertyData.surface || 0,
          pieces: propertyData.pieces || 0,
          description: propertyData.description || '',
          type: propertyData.type || 'apartment'
        }
        const oldProperties = [...properties.value]
        properties.value.unshift(optimisticProperty)

        // Crée le bien via l'API
        const result = (await propertiesApi.createProperty(
          propertyData,
          authStore.user.id
        )) as PropertiesApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          properties.value = oldProperties
          error.value = result.message || 'Erreur lors de la création du bien'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la création du bien')
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data
        if (!data) {
          throw new Error('Données de propriété invalides')
        }

        const newProperty = transformPropertyData(data)

        // Remplace le bien temporaire par le vrai bien retourné par l'API
        const tempIndex = properties.value.findIndex(p => p.id === optimisticProperty.id)
        if (tempIndex !== -1) {
          properties.value[tempIndex] = newProperty
        }

        // Track property added event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PROPERTY_ADDED, {
                property_type: newProperty.type,
                rent_amount: newProperty.rent
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        if (toastStore) {
          toastStore.success('Bien ajouté avec succès')
        }

        // Si le bien est occupé et qu'un locataire est fourni, créer le locataire
        if (propertyData.status === PROPERTY_STATUS.OCCUPIED && propertyData.tenant) {
          const tenantResult = await tenantsApi.createTenant(
            {
              propertyId: data.id,
              name: propertyData.tenant.name,
              entryDate: propertyData.tenant.entryDate,
              exitDate: propertyData.tenant.exitDate || null,
              rent: Number(propertyData.rent),
              status: propertyData.tenant.status || 'on_time'
            },
            authStore.user.id
          )

          if (tenantResult.success && tenantResult.data) {
            // Recharge les propriétés pour avoir les données à jour avec le locataire
            await fetchProperties(true)
            const updatedIndex = properties.value.findIndex(p => p.id === data.id)
            if (updatedIndex !== -1) {
              return properties.value[updatedIndex]
            }
          }
        }

        loading.value = false
        return properties.value[tempIndex] || newProperty
      } catch (err) {
        const errorObj = err as Error
        error.value = errorObj.message
        loading.value = false
        throw err
      }
    }

    /**
     * Met à jour un bien existant dans Supabase
     */
    const updateProperty = async (
      id: string,
      updates: UpdatePropertyData
    ): Promise<PropertyData> => {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      const toastStore = useToastStore()

      if (!authStore.user) {
        const errorMsg = 'User not authenticated'
        error.value = errorMsg
        loading.value = false
        if (toastStore) {
          toastStore.error('Vous devez être connecté pour modifier un bien')
        }
        throw new Error(errorMsg)
      }

      try {

        // Optimistic UI : Sauvegarde l'ancien état et applique les modifications
        const propertyIndex = properties.value.findIndex(p => p.id === id)
        if (propertyIndex === -1) {
          throw new Error('Property not found')
        }
        const oldProperty = { ...properties.value[propertyIndex] }
        const optimisticUpdates: PropertyData = {
          ...oldProperty,
          ...updates,
          rent: updates.rent ? Number(updates.rent) : oldProperty.rent
        }
        properties.value[propertyIndex] = optimisticUpdates

        // Prépare les données pour Supabase
        const supabaseUpdates: Record<string, unknown> = {
          name: updates.name,
          address: updates.address,
          city: updates.city,
          rent: updates.rent ? Number(updates.rent) : undefined,
          status: updates.status,
          surface: updates.surface !== undefined ? Number(updates.surface) : undefined,
          pieces: updates.pieces !== undefined ? Number(updates.pieces) : undefined,
          description: updates.description,
          type: updates.type
        }

        // Supprime les propriétés undefined
        Object.keys(supabaseUpdates).forEach(key => {
          if (supabaseUpdates[key] === undefined) {
            delete supabaseUpdates[key]
          }
        })

        // Met à jour le bien via l'API
        const result = (await propertiesApi.updateProperty(
          id,
          supabaseUpdates,
          authStore.user.id
        )) as PropertiesApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          properties.value[propertyIndex] = oldProperty
          error.value = result.message || 'Erreur lors de la mise à jour du bien'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la mise à jour du bien')
        }

        // Gère le locataire si nécessaire
        if (updates.status === PROPERTY_STATUS.OCCUPIED && updates.tenant) {
          // Récupère le bien avec ses locataires pour vérifier
          const propertyResult = (await propertiesApi.getPropertyById(
            id,
            authStore.user.id
          )) as PropertiesApiResponse

          const existingTenant =
            propertyResult.success &&
            propertyResult.data &&
            !Array.isArray(propertyResult.data) &&
            propertyResult.data.tenants &&
            propertyResult.data.tenants.length > 0
              ? propertyResult.data.tenants[0]
              : null

          if (existingTenant) {
            // Met à jour le locataire existant
            await tenantsApi.updateTenant(
              existingTenant.id,
              {
                name: updates.tenant.name,
                entry_date: updates.tenant.entryDate,
                exit_date: updates.tenant.exitDate || null,
                rent: Number(updates.rent || oldProperty.rent),
                status: updates.tenant.status || 'on_time'
              },
              authStore.user.id
            )
          } else {
            // Crée un nouveau locataire
            await tenantsApi.createTenant(
              {
                propertyId: id,
                name: updates.tenant.name,
                entryDate: updates.tenant.entryDate,
                exitDate: updates.tenant.exitDate || null,
                rent: Number(updates.rent || oldProperty.rent),
                status: updates.tenant.status || 'on_time'
              },
              authStore.user.id
            )
          }
        } else if (updates.status === PROPERTY_STATUS.VACANT) {
          // Supprime le locataire si le bien devient libre
          const propertyResult = (await propertiesApi.getPropertyById(
            id,
            authStore.user.id
          )) as PropertiesApiResponse

          if (
            propertyResult.success &&
            propertyResult.data &&
            !Array.isArray(propertyResult.data) &&
            propertyResult.data.tenants &&
            propertyResult.data.tenants.length > 0
          ) {
            for (const tenant of propertyResult.data.tenants) {
              await tenantsApi.deleteTenant(tenant.id, authStore.user.id)
            }
          }
        }

        // Recharge les propriétés pour avoir les données à jour
        await fetchProperties(true)

        // Track property updated event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PROPERTY_UPDATED, {
                property_id: id
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        if (toastStore) {
          toastStore.success('Bien modifié avec succès')
        }

        // Récupère le bien mis à jour
        const updatedProperty = properties.value.find(p => p.id === id)
        if (!updatedProperty) {
          throw new Error('Propriété introuvable après mise à jour')
        }

        loading.value = false
        return updatedProperty
      } catch (err) {
        const errorObj = err as Error
        const errorMessage = errorObj.message || 'Erreur lors de la mise à jour du bien'
        
        // Log sécurisé de l'erreur
        console.error(
          'Erreur lors de la mise à jour du bien:',
          sanitizeObject(errorObj, ['message'])
        )
        
        error.value = errorMessage
        loading.value = false

        // Affiche un toast avec le message d'erreur exact
        if (toastStore) {
          // Messages d'erreur plus conviviaux
          if (errorMessage.includes('Timeout') || errorMessage.includes('timeout')) {
            toastStore.error('La modification a pris trop de temps. Veuillez réessayer.')
          } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            toastStore.error('Erreur de connexion. Vérifiez votre réseau.')
          } else {
            toastStore.error(`Erreur: ${errorMessage}`)
          }
        }

        throw err
      }
    }

    /**
     * Supprime un bien dans Supabase
     */
    const removeProperty = async (id: string): Promise<void> => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Optimistic UI : Supprime temporairement de la liste
        const propertyIndex = properties.value.findIndex(p => p.id === id)
        if (propertyIndex === -1) {
          throw new Error('Property not found')
        }
        const oldProperties = [...properties.value]
        properties.value = properties.value.filter(p => p.id !== id)

        const result = (await propertiesApi.deleteProperty(
          id,
          authStore.user.id
        )) as PropertiesApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          properties.value = oldProperties
          error.value = result.message || 'Erreur lors de la suppression du bien'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la suppression du bien')
        }

        // Track property deleted event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PROPERTY_DELETED, {
                property_id: id
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        if (toastStore) {
          toastStore.success('Bien supprimé avec succès')
        }

        loading.value = false
      } catch (err) {
        const errorObj = err as Error
        error.value = errorObj.message
        loading.value = false
        throw err
      }
    }

    /**
     * Computed : Nombre total de biens
     */
    const totalProperties: ComputedRef<number> = computed(() => properties.value.length)

    /**
     * Computed : Nombre de biens occupés
     */
    const occupiedProperties: ComputedRef<number> = computed(
      () => properties.value.filter(p => p.status === PROPERTY_STATUS.OCCUPIED).length
    )

    /**
     * Computed : Nombre de biens libres
     */
    const vacantProperties: ComputedRef<number> = computed(
      () => properties.value.filter(p => p.status === PROPERTY_STATUS.VACANT).length
    )

    /**
     * Computed : Total des loyers mensuels (uniquement biens occupés)
     */
    const totalRent: ComputedRef<number> = computed(() =>
      properties.value
        .filter(p => p.status === PROPERTY_STATUS.OCCUPIED)
        .reduce((sum, p) => sum + (p.rent || 0), 0)
    )

    /**
     * Initialise l'abonnement temps réel pour les propriétés
     * Écoute les changements INSERT/UPDATE/DELETE sur la table properties
     */
    const initRealtime = (): void => {
      const authStore = useAuthStore()
      if (!authStore.user) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Cannot init Realtime: user not authenticated')
        }
        return
      }

      // Évite d'initialiser plusieurs fois - vérifie aussi si le channel est actif
      if (isRealtimeInitialized && realtimeChannel && isRealtimeActive) {
        return
      }

      // Si le channel existe mais n'est plus actif, le nettoie d'abord
      if (realtimeChannel && !isRealtimeActive) {
        try {
          supabase.removeChannel(realtimeChannel)
        } catch {
          // Ignore les erreurs de nettoyage
        }
        realtimeChannel = null
        isRealtimeInitialized = false
      }

      isRealtimeInitialized = true
      isRealtimeActive = true

      realtimeChannel = supabase
        .channel('public:properties')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'properties',
            filter: `user_id=eq.${authStore.user.id}`
          },
          async payload => {
            // Vérifie que Realtime est toujours actif et que le store est valide
            if (!isRealtimeActive || !properties.value) return

            const { eventType, new: rowNew, old: rowOld } = payload
            const toast = useToastStore()

            if (eventType === 'INSERT') {
              // Charge les données complètes avec le tenant si présent via l'API
              const result = (await propertiesApi.getPropertyById(
                rowNew.id,
                authStore.user.id
              )) as PropertiesApiResponse

              if (result.success && result.data && !Array.isArray(result.data)) {
                const newProperty = transformPropertyData(result.data)

                // Ajoute seulement s'il n'existe pas déjà
                if (properties.value && !properties.value.find(p => p.id === newProperty.id)) {
                  properties.value.unshift(newProperty)
                  if (toast) {
                    // Log sécurisé : le nom de la propriété peut être loggé (non sensible)
                    toast.info(`Nouveau bien : ${newProperty.name}`)
                  }
                }
              }
            }

            if (eventType === 'UPDATE') {
              // Vérifie que le store est encore valide
              if (!properties.value) return

              // Recharge la propriété avec ses relations via l'API
              const result = (await propertiesApi.getPropertyById(
                rowNew.id,
                authStore.user.id
              )) as PropertiesApiResponse

              if (result.success && result.data && !Array.isArray(result.data)) {
                const updatedProperty = transformPropertyData(result.data)

                const index = properties.value.findIndex(p => p.id === updatedProperty.id)
                if (index !== -1 && properties.value) {
                  properties.value[index] = updatedProperty
                  if (toast) {
                    // Log sécurisé : le nom de la propriété peut être loggé (non sensible)
                    toast.info(`Bien mis à jour : ${updatedProperty.name}`)
                  }
                }
              }
            }

            if (eventType === 'DELETE') {
              // Vérifie que le store est encore valide
              if (!properties.value) return
              properties.value = properties.value.filter(p => p.id !== rowOld.id)
              if (toast) {
                toast.info('Bien supprimé')
              }
            }
          }
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            if (import.meta.env.DEV) {
              console.debug('✅ Realtime subscribed to properties')
            }
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Realtime error for properties')
            isRealtimeInitialized = false
            isRealtimeActive = false
            realtimeChannel = null
          } else if (status === 'CLOSED') {
            if (import.meta.env.DEV) {
              console.debug('🔌 Realtime channel closed for properties')
            }
            isRealtimeInitialized = false
            isRealtimeActive = false
            realtimeChannel = null
          }
        })
    }

    /**
     * Arrête l'abonnement temps réel
     */
    const stopRealtime = (): void => {
      // Désactive les callbacks en premier pour éviter les erreurs
      isRealtimeActive = false

      if (realtimeChannel) {
        try {
          supabase.removeChannel(realtimeChannel)
        } catch {
          // Log sécurisé : ne pas exposer les détails d'erreur
          if (import.meta.env.DEV) {
            console.warn('Error removing Realtime channel (non blocking)')
          }
        }
        realtimeChannel = null
        isRealtimeInitialized = false
        if (import.meta.env.DEV) {
          console.debug('🔌 Realtime unsubscribed from properties')
        }
      }
    }

    /**
     * Réinitialise le store
     */
    const reset = (): void => {
      properties.value = []
      loading.value = false
      error.value = null
      lastFetchTime = 0
      stopRealtime()
    }

    return {
      // State
      properties,
      loading,
      error,
      // Actions
      fetchProperties,
      addProperty,
      updateProperty,
      removeProperty,
      initRealtime,
      stopRealtime,
      reset,
      // Getters
      totalProperties,
      occupiedProperties,
      vacantProperties,
      totalRent
    }
  },
  {
    // Configuration de persistance avec pinia-plugin-persistedstate
    persist: {
      key: 'vylo-properties',
      paths: ['properties'],
      storage: localStorage
    }
  }
)
