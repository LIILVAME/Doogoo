import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { PROPERTY_STATUS } from '@/utils/constants'
import { propertiesApi, tenantsApi } from '@/api'
import type { ApiResponse } from '@/api/properties'
// @ts-expect-error - Composable might not be typed
import { useStoreLoader } from '@/composables/useStoreLoader'

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
  birthDate?: string | null
  birthPlace?: string | null
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
  image?: string | null
  zip?: string
  heatingType?: string
  chargesAmount?: number | null
  createdAt?: string
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
  zip?: string
  city?: string
  rent?: number | string
  status?: 'occupied' | 'vacant'
  surface?: number
  pieces?: number
  description?: string
  type?: string
  heatingType?: string
  chargesAmount?: number | null
  image_url?: string
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
  surface_m2?: number | string | null
  rooms?: number | string | null
  image?: string | null
  heating_type?: string | null
  charges_amount?: number | string | null
  zip?: string | null
  description?: string | null
  type?: string | null
  created_at?: string
  updated_at?: string
  surface?: number | string | null
  pieces?: number | string | null
  image_url?: string | null
  tenants?: Array<{
    id: string
    name: string
    entry_date: string
    exit_date?: string | null
    rent: number | string
    status?: 'on_time' | 'late' | 'pending' | 'paid'
    birth_date?: string | null
    birth_place?: string | null
  }> | null
}

/**
 * Store Pinia pour gérer les biens immobiliers
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePropertiesStore = defineStore(
  'properties',
  () => {
    const properties: Ref<PropertyData[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const isUpdating: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    const { cleanup: _cleanupLoader } = useStoreLoader(loading, 'PropertiesStore')
    let realtimeChannel: RealtimeChannel | null = null
    let isRealtimeInitialized = false
    let isRealtimeActive = false
    let lastFetchTime = 0
    const FETCH_CACHE_MS = 5000

    const transformPropertyData = (prop: PropertyApiData): PropertyData => {
      return {
        id: prop.id,
        name: prop.name,
        address: prop.address || '',
        zip: (prop as any).zip || '',
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
                status: prop.tenants[0].status || 'on_time',
                birthDate: prop.tenants[0].birth_date || null,
                birthPlace: prop.tenants[0].birth_place || null
              }
            : null,
        image: (prop as any).image || (prop as any).image_url || null,
        surface: Number((prop as any).surface_m2 || prop.surface) || 0,
        pieces: Number((prop as any).rooms || prop.pieces) || 0,
        description: prop.description || '',
        type: prop.type || 'apartment',
        heatingType: (prop as any).heating_type || 'Individuel',
        chargesAmount: (prop as any).charges_amount ? Number((prop as any).charges_amount) : null,
        createdAt: prop.created_at
      }
    }

    const fetchProperties = async (force = false): Promise<void> => {
      const authStore = useAuthStore()
      if (!authStore.user) {
        loading.value = false
        return
      }

      if (loading.value && !force) return

      const now = Date.now()
      if (!force && now - lastFetchTime < FETCH_CACHE_MS && properties.value.length > 0) {
        return
      }

      loading.value = true
      error.value = null

      try {
        const result = (await (propertiesApi.getProperties(
          authStore.user.id
        ) as any)) as ApiResponse<PropertyApiData[]>

        if (result.success && result.data) {
          lastFetchTime = Date.now()
          const dataArray = Array.isArray(result.data) ? result.data : [result.data]
          properties.value = dataArray.map(transformPropertyData)
        } else {
          error.value = result.message || 'Erreur lors de la récupération des biens'
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
      } catch (err: any) {
        console.error('Erreur lors du chargement des propriétés:', err)
        error.value = err.message || 'Erreur lors de la récupération des biens'
      } finally {
        loading.value = false
      }
    }

    const addProperty = async (propertyData: CreatePropertyData): Promise<PropertyData> => {
      isUpdating.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) throw new Error('User not authenticated')

        const result = (await (propertiesApi.createProperty(
          propertyData,
          authStore.user.id
        ) as any)) as ApiResponse<PropertyApiData>

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors de la création du bien')
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data
        if (!data) throw new Error('Données de propriété invalides')

        const newProperty = transformPropertyData(data)
        properties.value.unshift(newProperty)

        if (toastStore) toastStore.success('Bien ajouté avec succès')

        // Handle tenant creation if occupied
        if (propertyData.status === PROPERTY_STATUS.OCCUPIED && propertyData.tenant) {
          await tenantsApi.createTenant(
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
          await fetchProperties(true)
        }

        return newProperty
      } catch (err: any) {
        error.value = err.message
        throw err
      } finally {
        isUpdating.value = false
      }
    }

    const updateProperty = async (
      id: string,
      updates: UpdatePropertyData
    ): Promise<PropertyData> => {
      isUpdating.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) throw new Error('User not authenticated')

        const supabaseUpdates: any = {
          name: updates.name,
          address: updates.address,
          city: updates.city,
          zip: updates.zip,
          rent: updates.rent ? Number(updates.rent) : undefined,
          status: updates.status,
          description: updates.description,
          type: updates.type,
          rooms: updates.pieces !== undefined ? Number(updates.pieces) : undefined,
          surface_m2: updates.surface !== undefined ? Number(updates.surface) : undefined,
          image: updates.image_url,
          heating_type: updates.heatingType,
          charges_amount:
            updates.chargesAmount !== undefined ? Number(updates.chargesAmount) : undefined
        }

        Object.keys(supabaseUpdates).forEach(key => {
          if (supabaseUpdates[key] === undefined) delete supabaseUpdates[key]
        })

        const result = (await (propertiesApi.updateProperty(
          id,
          supabaseUpdates,
          authStore.user.id
        ) as any)) as ApiResponse<PropertyApiData>

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors de la mise à jour du bien')
        }

        if (updates.status === PROPERTY_STATUS.OCCUPIED && updates.tenant) {
          const propertyIndex = properties.value.findIndex(p => p.id === id)
          const existingTenant =
            propertyIndex !== -1 ? properties.value[propertyIndex].tenant : null

          if (existingTenant) {
            await tenantsApi.updateTenant(
              existingTenant.id,
              {
                name: updates.tenant.name,
                entryDate: updates.tenant.entryDate,
                exitDate: updates.tenant.exitDate || null,
                rent: Number(
                  updates.rent || (propertyIndex !== -1 ? properties.value[propertyIndex].rent : 0)
                ),
                status: updates.tenant.status || 'on_time'
              },
              authStore.user.id
            )
          } else {
            await tenantsApi.createTenant(
              {
                propertyId: id,
                name: updates.tenant.name,
                entryDate: updates.tenant.entryDate,
                exitDate: updates.tenant.exitDate || null,
                rent: Number(
                  updates.rent || (propertyIndex !== -1 ? properties.value[propertyIndex].rent : 0)
                ),
                status: updates.tenant.status || 'on_time'
              },
              authStore.user.id
            )
          }
        } else if (updates.status === PROPERTY_STATUS.VACANT) {
          const propertyIndex = properties.value.findIndex(p => p.id === id)
          const tenantToDelete =
            propertyIndex !== -1 ? properties.value[propertyIndex].tenant : null
          if (tenantToDelete) {
            await tenantsApi.deleteTenant(tenantToDelete.id, authStore.user.id)
          }
        }

        await fetchProperties(true)
        if (toastStore) toastStore.success('Bien modifié avec succès')

        const updated = properties.value.find(p => p.id === id)
        if (!updated) throw new Error('Propriété introuvable après mise à jour')
        return updated
      } catch (err: any) {
        error.value = err.message
        throw err
      } finally {
        isUpdating.value = false
      }
    }

    const removeProperty = async (id: string): Promise<void> => {
      isUpdating.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) throw new Error('User not authenticated')

        const result = (await (propertiesApi.deleteProperty(
          id,
          authStore.user.id
        ) as any)) as ApiResponse<null>

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors de la suppression du bien')
        }

        properties.value = properties.value.filter(p => p.id !== id)
        if (toastStore) toastStore.success('Bien supprimé avec succès')
      } catch (err: any) {
        error.value = err.message
        throw err
      } finally {
        isUpdating.value = false
      }
    }

    const totalProperties = computed(() => properties.value.length)
    const occupiedProperties = computed(
      () => properties.value.filter(p => p.status === PROPERTY_STATUS.OCCUPIED).length
    )
    const vacantProperties = computed(
      () => properties.value.filter(p => p.status === PROPERTY_STATUS.VACANT).length
    )
    const totalRent = computed(() =>
      properties.value
        .filter(p => p.status === PROPERTY_STATUS.OCCUPIED)
        .reduce((sum, p) => sum + (p.rent || 0), 0)
    )

    const initRealtime = (): void => {
      const authStore = useAuthStore()
      if (!authStore.user || isRealtimeInitialized) return

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
            if (!isRealtimeActive) return
            await fetchProperties(true)
            const toast = useToastStore()
            if (payload.eventType === 'INSERT') toast.info('Nouveau bien ajouté')
            if (payload.eventType === 'UPDATE') toast.info('Bien mis à jour')
            if (payload.eventType === 'DELETE') toast.info('Bien supprimé')
          }
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            isRealtimeActive = true
            isRealtimeInitialized = true
          }
        })
    }

    const stopRealtime = (): void => {
      isRealtimeActive = false
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
        realtimeChannel = null
        isRealtimeInitialized = false
      }
    }

    const reset = (): void => {
      properties.value = []
      loading.value = false
      isUpdating.value = false
      error.value = null
      lastFetchTime = 0
      stopRealtime()
    }

    return {
      properties,
      loading,
      isUpdating,
      error,
      fetchProperties,
      addProperty,
      updateProperty,
      removeProperty,
      initRealtime,
      stopRealtime,
      reset,
      totalProperties,
      occupiedProperties,
      vacantProperties,
      totalRent
    }
  },
  {
    persist: {
      key: 'vylo-properties',
      pick: ['properties'],
      storage: localStorage
    }
  }
)
