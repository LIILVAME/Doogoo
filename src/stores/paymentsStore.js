import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from './authStore'
import { usePropertiesStore } from './propertiesStore'
import { useToastStore } from './toastStore'
import { TRANSACTION_STATUS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import { paymentsApi } from '@/api'
import { useStoreLoader } from '@/composables/useStoreLoader'

/**
 * Store Pinia pour gérer les paiements
 * Connecté à Supabase pour la persistance et synchronisation en temps réel
 */
export const usePaymentsStore = defineStore(
  'payments',
  () => {
    // State
    const payments = ref([])
    const loading = ref(false) // Toujours initialisé à false
    const error = ref(null)

    // Surveillance automatique du loading pour éviter les blocages
    const { cleanup: _cleanupLoader } = useStoreLoader(loading, 'PaymentsStore')
    let realtimeChannel = null
    let isRealtimeInitialized = false
    let isRealtimeActive = false // Flag pour désactiver les callbacks lors du cleanup
    let lastFetchTime = 0
    const FETCH_CACHE_MS = 5000 // Cache de 5 secondes pour éviter les requêtes multiples

    /**
     * Récupère tous les paiements de l'utilisateur depuis Supabase
     */
    const fetchPayments = async (force = false) => {
      // Vérifie que l'utilisateur est authentifié avant de fetcher
      const authStore = useAuthStore()
      if (!authStore.user) {
        console.warn('fetchPayments: User not authenticated, skipping fetch')
        // S'assure que loading est false si pas d'utilisateur
        loading.value = false
        return
      }

      // Évite les requêtes multiples si déjà en cours (sauf si force = true)
      if (loading.value && !force) {
        console.debug('fetchPayments: requête déjà en cours, skip')
        return
      }

      // Si loading est à true (bloqué), on le reset avant de commencer
      // Le composable useStoreLoader devrait l'avoir déjà fait, mais sécurité supplémentaire
      if (loading.value) {
        console.warn('⚠️ fetchPayments: loading déjà à true au début, reset avant fetch')
        loading.value = false
      }

      // Cache de 5 secondes pour éviter les requêtes trop fréquentes
      const now = Date.now()
      if (!force && now - lastFetchTime < FETCH_CACHE_MS && payments.value.length > 0) {
        // S'assure que loading est false si on utilise le cache
        loading.value = false
        return
      }

      // Note: Le composable useStoreLoader gère déjà le timeout de sécurité
      // On fait confiance au finally pour remettre loading à false
      loading.value = true
      error.value = null

      try {
        // Timeout explicite de 10 secondes pour éviter blocage
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('Timeout: La requête a pris plus de 10 secondes')),
            10000
          )
        })

        const apiPromise = paymentsApi.getPayments(authStore.user.id)
        const result = await Promise.race([apiPromise, timeoutPromise])

        if (result.success && result.data) {
          lastFetchTime = Date.now()

          // Transforme les données Supabase pour correspondre au format attendu
          payments.value = (result.data || []).map(payment => ({
            id: payment.id,
            propertyId: payment.property_id,
            property: payment.properties?.name || 'N/A',
            tenant: payment.tenants?.name || payment.properties?.name || 'N/A',
            amount: Number(payment.amount),
            dueDate: payment.due_date,
            status: payment.status
          }))
        } else {
          error.value = result.message || 'Erreur lors de la récupération des paiements'

          // Si erreur réseau et qu'on a des données en cache, les utiliser
          const { useConnectionStore } = await import('@/stores/connectionStore')
          const { useToastStore } = await import('@/stores/toastStore')
          const connectionStore = useConnectionStore()
          const toastStore = useToastStore()

          if (!connectionStore.isOnline && payments.value.length > 0) {
            // Affiche un toast informatif mais continue avec les données du cache
            if (toastStore) {
              toastStore.info('⚠️ Données locales affichées (connexion perdue)')
            }
          }
        }
      } catch (err) {
        // Gestion d'erreur pour éviter que loading reste bloqué
        console.error('Erreur lors du chargement des paiements:', err)
        error.value = err.message || 'Erreur lors de la récupération des paiements'

        // Si erreur et qu'on a des données en cache, on continue avec le cache
        if (payments.value.length > 0) {
          const { useToastStore } = await import('@/stores/toastStore')
          const toastStore = useToastStore()
          if (toastStore) {
            toastStore.warning('⚠️ Erreur de chargement, données en cache affichées')
          }
        }
      } finally {
        // Garantit que loading est toujours remis à false, même en cas d'erreur
        // Le composable useStoreLoader surveille aussi, mais c'est notre responsabilité principale
        loading.value = false
      }
    }

    /**
     * Ajoute un nouveau paiement dans Supabase
     * @param {Object} paymentData - Données du paiement à ajouter
     * @returns {Object} Le paiement créé avec son ID
     */
    const addPayment = async paymentData => {
      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        const toastStore = useToastStore()
        if (!authStore.user) {
          throw new Error('User not authenticated')
        }

        // Trouve le tenant_id si property_id est fourni
        let tenantId = null
        if (paymentData.propertyId) {
          const propertiesStore = usePropertiesStore()
          const property = propertiesStore.properties.find(p => p.id === paymentData.propertyId)
          if (property && property.tenant) {
            tenantId = property.tenant.id
          }
        }

        // Optimistic UI : Ajoute temporairement le paiement à la liste
        const optimisticPayment = {
          id: `temp-${Date.now()}`,
          propertyId: paymentData.propertyId,
          property: paymentData.property || 'N/A',
          tenant: paymentData.tenant || 'N/A',
          amount: Number(paymentData.amount),
          dueDate: paymentData.dueDate || paymentData.date,
          status: paymentData.status || 'pending'
        }
        const oldPayments = [...payments.value]
        payments.value.unshift(optimisticPayment)

        // Crée le paiement via l'API
        const result = await paymentsApi.createPayment(
          {
            ...paymentData,
            tenantId
          },
          authStore.user.id
        )

        if (!result.success) {
          // Revert l'optimistic update
          payments.value = oldPayments
          error.value = result.message
          loading.value = false
          throw new Error(result.message)
        }

        const data = result.data

        // Track payment added event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PAYMENT_ADDED, {
                amount: data.amount || 0,
                status: data.status || 'pending'
              })
            })
            .catch(() => {})
        }

        // Transforme pour le format attendu
        // Note: La vue payments_view expose due_date, mais la table utilise 'date'
        const newPayment = {
          id: data.id,
          propertyId: data.property_id,
          property: data.properties?.name || paymentData.property || 'N/A',
          tenant: data.tenants?.name || paymentData.tenant || 'N/A',
          amount: Number(data.amount),
          dueDate: data.due_date || data.date, // Utilise due_date de la vue ou date de la table
          status: data.status
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
        error.value = err.message
        loading.value = false
        throw err
      }
    }

    /**
     * Met à jour un paiement existant dans Supabase
     * @param {string} id - ID UUID du paiement à mettre à jour
     * @param {Object} updates - Données à mettre à jour
     */
    const updatePayment = async (id, updates) => {
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
        const optimisticUpdates = {
          ...oldPayment,
          ...updates,
          amount: updates.amount ? Number(updates.amount) : oldPayment.amount
        }
        payments.value[paymentIndex] = optimisticUpdates

        // Prépare les données de mise à jour
        const updateData = {
          amount: updates.amount ? Number(updates.amount) : undefined,
          dueDate: updates.dueDate || undefined,
          status: updates.status || undefined
        }

        // Supprime les propriétés undefined
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined) {
            delete updateData[key]
          }
        })

        // Met à jour via l'API
        const result = await paymentsApi.updatePayment(id, updateData, authStore.user.id)

        if (!result.success) {
          // Revert l'optimistic update
          payments.value[paymentIndex] = oldPayment
          error.value = result.message
          loading.value = false
          throw new Error(result.message)
        }

        const data = result.data

        // Met à jour dans la liste locale avec les vraies données
        payments.value[paymentIndex] = {
          id: data.id,
          propertyId: data.property_id,
          property: data.properties?.name || 'N/A',
          tenant: data.tenants?.name || 'N/A',
          amount: Number(data.amount),
          dueDate: data.due_date || data.date,
          status: data.status
        }

        // Track payment updated event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PAYMENT_UPDATED, {
                payment_id: id,
                status: data.status || updates.status
              })
            })
            .catch(() => {})
        }

        if (toastStore) {
          toastStore.success('Modification appliquée')
        }

        loading.value = false
      } catch (err) {
        error.value = err.message
        loading.value = false
        throw err
      }
    }

    /**
     * Supprime un paiement dans Supabase
     * @param {string} id - ID UUID du paiement à supprimer
     */
    const removePayment = async id => {
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

        const result = await paymentsApi.deletePayment(id, authStore.user.id)

        if (!result.success) {
          // Revert l'optimistic update
          payments.value = oldPayments
          error.value = result.message
          loading.value = false
          throw new Error(result.message)
        }

        // Track payment deleted event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.PAYMENT_DELETED, {
                payment_id: id
              })
            })
            .catch(() => {})
        }

        if (toastStore) {
          toastStore.success('Paiement supprimé avec succès')
        }

        loading.value = false
      } catch (err) {
        error.value = err.message
        loading.value = false
        throw err
      }
    }

    /**
     * Computed : Paiements en attente
     */
    const pendingPayments = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.PENDING)
    )

    /**
     * Computed : Paiements en retard
     */
    const latePayments = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.LATE)
    )

    /**
     * Computed : Paiements effectués
     */
    const paidPayments = computed(() =>
      payments.value.filter(p => p.status === TRANSACTION_STATUS.PAID)
    )

    /**
     * Initialise l'abonnement temps réel pour les paiements
     * Écoute les changements INSERT/UPDATE/DELETE sur la table payments
     */
    const initRealtime = () => {
      // Vérifie que l'utilisateur est authentifié avant d'initialiser
      const authStore = useAuthStore()
      if (!authStore.user) {
        console.warn('⚠️ Cannot init Realtime: user not authenticated')
        return
      }

      // Évite d'initialiser plusieurs fois - vérifie aussi si le channel est actif
      if (isRealtimeInitialized && realtimeChannel && isRealtimeActive) {
        // Déjà initialisé, retourne silencieusement (pas de log pour éviter le spam)
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
            filter: `user_id=eq.${authStore.user.id}` // Seulement les paiements de l'utilisateur
          },
          async payload => {
            // Vérifie que Realtime est toujours actif et que le store est valide
            if (!isRealtimeActive || !payments.value || !payments.value) return

            const { eventType, new: rowNew, old: rowOld } = payload
            const toast = useToastStore()

            if (eventType === 'INSERT') {
              // Charge les données complètes avec relations via l'API
              const result = await paymentsApi.getPaymentById(rowNew.id, authStore.user.id)

              if (result.success && result.data) {
                const data = result.data
                const newPayment = {
                  id: data.id,
                  propertyId: data.property_id,
                  property: data.properties?.name || 'N/A',
                  tenant: data.tenants?.name || data.properties?.name || 'N/A',
                  amount: Number(data.amount),
                  dueDate: data.due_date,
                  status: data.status
                }

                // Ajoute seulement s'il n'existe pas déjà
                if (payments.value && !payments.value.find(p => p.id === newPayment.id)) {
                  payments.value.unshift(newPayment)
                  if (toast) toast.info(`Nouveau paiement : ${formatCurrency(newPayment.amount)}`)
                }
              }
            }

            if (eventType === 'UPDATE') {
              // Vérifie que le store est encore valide
              if (!payments.value || !payments.value) return

              // Recharge le paiement avec ses relations via l'API
              const result = await paymentsApi.getPaymentById(rowNew.id, authStore.user.id)

              if (result.success && result.data) {
                const data = result.data
                const updatedPayment = {
                  id: data.id,
                  propertyId: data.property_id,
                  property: data.properties?.name || 'N/A',
                  tenant: data.tenants?.name || 'N/A',
                  amount: Number(data.amount),
                  dueDate: data.due_date,
                  status: data.status
                }

                const index = payments.value.findIndex(p => p.id === updatedPayment.id)
                if (index !== -1 && payments.value) {
                  payments.value[index] = updatedPayment
                  if (toast) toast.info(`Paiement mis à jour`)
                }
              }
            }

            if (eventType === 'DELETE') {
              // Vérifie que le store est encore valide
              if (!payments.value || !payments.value) return
              payments.value = payments.value.filter(p => p.id !== rowOld.id)
              if (toast) toast.info('Paiement supprimé')
            }
          }
        )
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime subscribed to payments')
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Realtime error for payments')
            isRealtimeInitialized = false // Réinitialise pour permettre une nouvelle tentative
            isRealtimeActive = false
            realtimeChannel = null
            // Ne pas afficher d'erreur toast pour éviter le spam
            // Le Realtime est optionnel, l'application fonctionne sans
          } else if (status === 'CLOSED') {
            console.log('🔌 Realtime channel closed for payments')
            isRealtimeInitialized = false
            isRealtimeActive = false
            realtimeChannel = null
          }
        })
    }

    /**
     * Arrête l'abonnement temps réel
     */
    const stopRealtime = () => {
      // Désactive les callbacks en premier pour éviter les erreurs
      isRealtimeActive = false

      if (realtimeChannel) {
        try {
          supabase.removeChannel(realtimeChannel)
        } catch (e) {
          // Ignore les erreurs lors du nettoyage
          console.warn('Error removing Realtime channel (non blocking):', e)
        }
        realtimeChannel = null
        isRealtimeInitialized = false
        console.log('🔌 Realtime unsubscribed from payments')
      }
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
      paths: ['payments'], // Seulement persister les données, pas loading/error
      storage: localStorage
    }
  }
)
