import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { usePropertiesStore } from './propertiesStore'
import { useToastStore } from './toastStore'
import { TRANSACTION_STATUS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import { paymentsApi } from '@/api'
import { useStoreLoader } from '@/composables/useStoreLoader'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import type { Payment } from '@/types/api'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Types pour les données de paiement
 */

/**
 * Paiement avec données transformées depuis l'API
 */
export interface PaymentData extends Payment {
  property: string
  tenant: string
}

/**
 * Données pour créer un nouveau paiement
 */
export interface CreatePaymentData {
  propertyId?: string
  property?: string
  tenant?: string
  tenantId?: string
  amount: number
  dueDate?: string
  date?: string
  status?: 'paid' | 'pending' | 'late'
}

/**
 * Données pour mettre à jour un paiement
 */
export interface UpdatePaymentData {
  amount?: number
  dueDate?: string
  status?: 'paid' | 'pending' | 'late'
}

/**
 * Filtres pour les paiements
 */
export interface PaymentFilters {
  status?: 'paid' | 'pending' | 'late'
  propertyId?: string
  startDate?: string
  endDate?: string
  orderAscending?: boolean
}

/**
 * Résumé des paiements (statistiques)
 */
export interface PaymentSummary {
  total: number
  pending: number
  late: number
  paid: number
  totalRevenue: number
  pendingRevenue: number
  lateRevenue: number
  paidRevenue: number
}

/**
 * Données de paiement depuis l'API Supabase
 */
interface PaymentApiData {
  id: string
  property_id: string
  tenant_id?: string | null
  amount: number | string
  due_date?: string
  date?: string
  status: 'paid' | 'pending' | 'late'
  properties?: { id: string; name: string; city?: string } | null
  tenants?: { id: string; name: string } | null
}

/**
 * Réponse API pour les paiements
 */
interface PaymentsApiResponse {
  success: boolean
  data?: PaymentApiData | PaymentApiData[]
  message?: string
  error?: Error
}

/**
 * Store Pinia pour gérer les paiements
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePaymentsStore = defineStore(
  'payments',
  () => {
    // State
    const payments: Ref<PaymentData[]> = ref([])
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    // Surveillance automatique du loading pour éviter les blocages
    const { cleanup: _cleanupLoader } = useStoreLoader(loading, 'PaymentsStore')
    let realtimeChannel: RealtimeChannel | null = null
    let isRealtimeInitialized = false
    let isRealtimeActive = false
    let lastFetchTime = 0
    const FETCH_CACHE_MS = 5000

    /**
     * Transforme les données de l'API vers le format du store
     */
    const transformPaymentData = (payment: PaymentApiData): PaymentData => {
      return {
        id: payment.id,
        propertyId: payment.property_id,
        property: payment.properties?.name || 'N/A',
        tenant: payment.tenants?.name || payment.properties?.name || 'N/A',
        amount: Number(payment.amount),
        dueDate: payment.due_date || payment.date || '',
        status: payment.status
      }
    }

    /**
     * Récupère tous les paiements de l'utilisateur depuis Supabase
     */
    const fetchPayments = async (force = false): Promise<void> => {
      const authStore = useAuthStore()
      if (!authStore.user) {
        if (import.meta.env.DEV) {
          console.warn('fetchPayments: User not authenticated, skipping fetch')
        }
        loading.value = false
        return
      }

      // Évite les requêtes multiples si déjà en cours (sauf si force = true)
      if (loading.value && !force) {
        if (import.meta.env.DEV) {
          console.debug('fetchPayments: requête déjà en cours, skip')
        }
        return
      }

      // Si loading est à true (bloqué), on le reset avant de commencer
      if (loading.value) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ fetchPayments: loading déjà à true au début, reset avant fetch')
        }
        loading.value = false
      }

      // Cache de 5 secondes pour éviter les requêtes trop fréquentes
      const now = Date.now()
      if (!force && now - lastFetchTime < FETCH_CACHE_MS && payments.value.length > 0) {
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

        const apiPromise = paymentsApi.getPayments(
          authStore.user.id
        ) as Promise<PaymentsApiResponse>
        const result = await Promise.race([apiPromise, timeoutPromise])

        if (result.success && result.data) {
          lastFetchTime = Date.now()
          const dataArray = Array.isArray(result.data) ? result.data : [result.data]
          payments.value = dataArray.map(transformPaymentData)
        } else {
          error.value = result.message || 'Erreur lors de la récupération des paiements'

          // Si erreur réseau et qu'on a des données en cache, les utiliser
          const { useConnectionStore } = await import('@/stores/connectionStore')
          const { useToastStore } = await import('@/stores/toastStore')
          const connectionStore = useConnectionStore()
          const toastStore = useToastStore()

          if (!connectionStore.isOnline && payments.value.length > 0) {
            if (toastStore) {
              toastStore.info('⚠️ Données locales affichées (connexion perdue)')
            }
          }
        }
      } catch (err) {
        const errorObj = err as Error
        // Log sécurisé : ne pas exposer les détails sensibles
        console.error(
          'Erreur lors du chargement des paiements:',
          sanitizeObject(errorObj, ['message'])
        )
        error.value = errorObj.message || 'Erreur lors de la récupération des paiements'

        // Si erreur et qu'on a des données en cache, on continue avec le cache
        if (payments.value.length > 0) {
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
     * Ajoute un nouveau paiement dans Supabase
     */
    const addPayment = async (paymentData: CreatePaymentData): Promise<PaymentData> => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Trouve le tenant_id si property_id est fourni
        let tenantId: string | null = null
        if (paymentData.propertyId) {
          const propertiesStore = usePropertiesStore()
          const property = propertiesStore.properties.find(p => p.id === paymentData.propertyId)
          if (property && property.tenant) {
            tenantId = property.tenant.id
          }
        }

        // Optimistic UI : Ajoute temporairement le paiement à la liste
        const optimisticPayment: PaymentData = {
          id: `temp-${Date.now()}`,
          propertyId: paymentData.propertyId || '',
          property: paymentData.property || 'N/A',
          tenant: paymentData.tenant || 'N/A',
          amount: Number(paymentData.amount),
          dueDate: paymentData.dueDate || paymentData.date || '',
          status: paymentData.status || TRANSACTION_STATUS.PENDING
        }
        const oldPayments = [...payments.value]
        payments.value.unshift(optimisticPayment)

        // Crée le paiement via l'API
        const result = (await paymentsApi.createPayment(
          {
            ...paymentData,
            tenantId
          },
          authStore.user.id
        )) as PaymentsApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          payments.value = oldPayments
          error.value = result.message || 'Erreur lors de la création du paiement'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la création du paiement')
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data
        if (!data) {
          throw new Error('Données de paiement invalides')
        }
        const newPayment = transformPaymentData(data)

        // Track payment added event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              // Données sanitizées pour analytics
              trackDoogooEvent(DoogooEvents.PAYMENT_ADDED, {
                amount: newPayment.amount,
                status: newPayment.status
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        // Remplace le paiement temporaire par le vrai paiement retourné par l'API
        const tempIndex = payments.value.findIndex(p => p.id === optimisticPayment.id)
        if (tempIndex !== -1) {
          payments.value[tempIndex] = newPayment
        }

        if (toastStore) {
          toastStore.success('Modification appliquée')
        }

        loading.value = false
        return newPayment
      } catch (err) {
        const errorObj = err as Error
        error.value = errorObj.message
        loading.value = false
        throw err
      }
    }

    /**
     * Met à jour un paiement existant dans Supabase
     */
    const updatePayment = async (id: string, updates: UpdatePaymentData): Promise<PaymentData> => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Optimistic UI : Sauvegarde l'ancien état et applique les modifications
        const paymentIndex = payments.value.findIndex(p => p.id === id)
        if (paymentIndex === -1) {
          throw new Error('Payment not found')
        }
        const oldPayment = { ...payments.value[paymentIndex] }
        const optimisticUpdates: PaymentData = {
          ...oldPayment,
          ...updates,
          amount: updates.amount ? Number(updates.amount) : oldPayment.amount,
          dueDate: updates.dueDate || oldPayment.dueDate,
          status: updates.status || oldPayment.status
        }
        payments.value[paymentIndex] = optimisticUpdates

        // Prépare les données de mise à jour
        const updateData: Partial<UpdatePaymentData & { date?: string }> = {
          amount: updates.amount ? Number(updates.amount) : undefined,
          dueDate: updates.dueDate || undefined,
          status: updates.status || undefined
        }

        // Supprime les propriétés undefined
        Object.keys(updateData).forEach(key => {
          const k = key as keyof typeof updateData
          if (updateData[k] === undefined) {
            delete updateData[k]
          }
        })

        // Met à jour via l'API
        const result = (await paymentsApi.updatePayment(
          id,
          updateData,
          authStore.user.id
        )) as PaymentsApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          payments.value[paymentIndex] = oldPayment
          error.value = result.message || 'Erreur lors de la mise à jour du paiement'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la mise à jour du paiement')
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data
        if (!data) {
          throw new Error('Données de paiement invalides')
        }
        const updatedPayment = transformPaymentData(data)

        // Met à jour dans la liste locale avec les vraies données
        payments.value[paymentIndex] = updatedPayment

        // Track payment updated event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PAYMENT_UPDATED, {
                payment_id: id,
                status: updatedPayment.status
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        if (toastStore) {
          toastStore.success('Modification appliquée')
        }

        loading.value = false
        return updatedPayment
      } catch (err) {
        const errorObj = err as Error
        error.value = errorObj.message
        loading.value = false
        throw err
      }
    }

    /**
     * Supprime un paiement dans Supabase
     */
    const removePayment = async (id: string): Promise<void> => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Optimistic UI : Supprime temporairement de la liste
        const paymentIndex = payments.value.findIndex(p => p.id === id)
        if (paymentIndex === -1) {
          throw new Error('Payment not found')
        }
        const oldPayments = [...payments.value]
        payments.value = payments.value.filter(p => p.id !== id)

        const result = (await paymentsApi.deletePayment(
          id,
          authStore.user.id
        )) as PaymentsApiResponse

        if (!result.success) {
          // Revert l'optimistic update
          payments.value = oldPayments
          error.value = result.message || 'Erreur lors de la suppression du paiement'
          loading.value = false
          throw new Error(result.message || 'Erreur lors de la suppression du paiement')
        }

        // Track payment deleted event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PAYMENT_DELETED, {
                payment_id: id
              })
            })
            .catch(() => {
              // Ignore les erreurs d'analytics
            })
        }

        if (toastStore) {
          toastStore.success('Paiement supprimé avec succès')
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
     * Computed : Paiements en attente
     */
    const pendingPayments: ComputedRef<PaymentData[]> = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.PENDING)
    )

    /**
     * Computed : Paiements en retard
     */
    const latePayments: ComputedRef<PaymentData[]> = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.LATE)
    )

    /**
     * Computed : Paiements effectués
     */
    const paidPayments: ComputedRef<PaymentData[]> = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.PAID)
    )

    /**
     * Initialise l'abonnement temps réel pour les paiements
     * Écoute les changements INSERT/UPDATE/DELETE sur la table payments
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
        .channel('public:payments')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments',
            filter: `user_id=eq.${authStore.user.id}`
          },
          async payload => {
            // Vérifie que Realtime est toujours actif et que le store est valide
            if (!isRealtimeActive || !payments.value) return

            const { eventType, new: rowNew, old: rowOld } = payload
            const toast = useToastStore()

            if (eventType === 'INSERT') {
              // Charge les données complètes avec relations via l'API
              const result = (await paymentsApi.getPaymentById(
                rowNew.id,
                authStore.user.id
              )) as PaymentsApiResponse

              if (result.success && result.data) {
                // getPaymentById retourne un objet unique, pas un array
                const data = Array.isArray(result.data) ? result.data[0] : result.data
                if (!data) return
                const newPayment = transformPaymentData(data)

                // Ajoute seulement s'il n'existe pas déjà
                if (payments.value && !payments.value.find(p => p.id === newPayment.id)) {
                  payments.value.unshift(newPayment)
                  if (toast) {
                    // Log sécurisé : ne pas exposer le montant en détail dans les logs
                    toast.info(`Nouveau paiement : ${formatCurrency(newPayment.amount)}`)
                  }
                }
              }
            }

            if (eventType === 'UPDATE') {
              // Vérifie que le store est encore valide
              if (!payments.value) return

              // Recharge le paiement avec ses relations via l'API
              const result = (await paymentsApi.getPaymentById(
                rowNew.id,
                authStore.user.id
              )) as PaymentsApiResponse

              if (result.success && result.data) {
                // getPaymentById retourne un objet unique, pas un array
                const data = Array.isArray(result.data) ? result.data[0] : result.data
                if (!data) return
                const updatedPayment = transformPaymentData(data)

                const index = payments.value.findIndex(p => p.id === updatedPayment.id)
                if (index !== -1 && payments.value) {
                  payments.value[index] = updatedPayment
                  if (toast) {
                    toast.info('Paiement mis à jour')
                  }
                }
              }
            }

            if (eventType === 'DELETE') {
              // Vérifie que le store est encore valide
              if (!payments.value) return
              payments.value = payments.value.filter(p => p.id !== rowOld.id)
              if (toast) {
                toast.info('Paiement supprimé')
              }
            }
          }
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            if (import.meta.env.DEV) {
              console.debug('✅ Realtime subscribed to payments')
            }
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Realtime error for payments')
            isRealtimeInitialized = false
            isRealtimeActive = false
            realtimeChannel = null
          } else if (status === 'CLOSED') {
            if (import.meta.env.DEV) {
              console.debug('🔌 Realtime channel closed for payments')
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
          console.debug('🔌 Realtime unsubscribed from payments')
        }
      }
    }

    /**
     * Réinitialise le store
     */
    const reset = (): void => {
      payments.value = []
      loading.value = false
      error.value = null
      lastFetchTime = 0
      stopRealtime()
    }

    return {
      // State
      payments,
      loading,
      error,
      // Actions
      fetchPayments,
      addPayment,
      updatePayment,
      removePayment,
      initRealtime,
      stopRealtime,
      reset,
      // Getters
      pendingPayments,
      latePayments,
      paidPayments
    }
  },
  {
    // Configuration de persistance avec pinia-plugin-persistedstate
    persist: {
      key: 'vylo-payments',
      paths: ['payments'],
      storage: localStorage
    }
  }
)
