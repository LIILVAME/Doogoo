import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

import { formatDate, formatCurrency } from '@/utils/formatters'

import { alertsApi } from '@/api/alerts'

export interface Alert {
  id: string
  type: string
  severity: 'high' | 'medium' | 'low'
  title: string
  message: string
  date: string
  actionUrl?: string | null
  amount?: number
  [key: string]: any
}

/**
 * Store Pinia pour gérer les alertes automatiques
 */
export const useAlertsStore = defineStore(
  'alerts',
  () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const alerts = ref<Alert[]>([])

    // Set des alertes lues (persisté dans localStorage)
    // Utilisé comme Set en interne, mais persisté comme Array
    const readAlerts = ref<Set<string>>(new Set())

    /**
     * Types d'alertes (réexport depuis l'API)
     */
    const ALERT_TYPES = alertsApi.ALERT_TYPES

    /**
     * Charge les alertes lues depuis localStorage
     */
    const loadReadAlerts = () => {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) return

        const key = `doogoo-read-alerts-${authStore.user.id}`
        const stored = localStorage.getItem(key)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            readAlerts.value = new Set(parsed)
          }
        }
      } catch (err) {
        console.error('Error loading read alerts:', err)
      }
    }

    /**
     * Sauvegarde les alertes lues dans localStorage
     */
    const saveReadAlerts = () => {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) return

        const key = `doogoo-read-alerts-${authStore.user.id}`
        localStorage.setItem(key, JSON.stringify([...readAlerts.value]))
      } catch (err) {
        console.error('Error saving read alerts:', err)
      }
    }

    /**
     * Initialise le store (charge les alertes lues)
     */
    const init = () => {
      loadReadAlerts()
    }

    /**
     * Récupère toutes les alertes pour l'utilisateur via l'API layer
     * Note: Cette fonction peut être lente car elle fait plusieurs requêtes Supabase
     */
    const fetchAlerts = async () => {
      // Évite les requêtes multiples si déjà en cours
      if (loading.value) {
        console.debug('fetchAlerts: requête déjà en cours, skip')
        return
      }

      loading.value = true
      error.value = null

      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          loading.value = false
          throw new Error('User not authenticated')
        }

        // Utilise l'API layer pour bénéficier de retry, timeout et gestion d'erreur centralisée
        // Timeout de 20s car getAlerts fait plusieurs requêtes séquentielles
        const result = await alertsApi.getAlerts(authStore.user.id)

        if (!result.success) {
          error.value = result.message || null
          loading.value = false
          throw new Error(result.message)
        }

        // Formate les messages avec formatCurrency pour la cohérence
        const formattedAlerts = (result as any).data.map((alert: any) => {
          if (alert.amount) {
            return {
              ...alert,
              message: alert.message.replace(`${alert.amount}€`, formatCurrency(alert.amount))
            }
          }
          if (alert.date && alert.type === alertsApi.ALERT_TYPES.UPCOMING_LEASE_END) {
            return {
              ...alert,
              message: alert.message.replace(
                new Date(alert.date).toLocaleDateString(),
                formatDate(new Date(alert.date))
              )
            }
          }
          return alert
        })

        alerts.value = formattedAlerts
        loading.value = false
      } catch (err: any) {
        error.value = err.message
        loading.value = false
        console.error('Error fetching alerts:', err)
      }
    }

    /**
     * Marque une alerte comme lue
     * @param alertId - ID de l'alerte
     */
    const markAsRead = (alertId: string) => {
      readAlerts.value.add(alertId)
      saveReadAlerts()
    }

    /**
     * Vérifie si une alerte est lue
     * @param alertId - ID de l'alerte
     * @returns {boolean}
     */
    const isRead = (alertId: string) => {
      return readAlerts.value.has(alertId)
    }

    /**
     * Marque toutes les alertes comme lues
     */
    const markAllAsRead = () => {
      alerts.value.forEach(alert => {
        readAlerts.value.add(alert.id)
      })
      saveReadAlerts()
    }

    /**
     * Marque une alerte comme résolue (supprime de la liste)
     */
    const markAsResolved = (alertId: string) => {
      alerts.value = alerts.value.filter(a => a.id !== alertId)
    }

    /**
     * Ajoute une alerte manuellement (pour les notifications d'automatisation)
     * @param alertData - Données de l'alerte
     */
    const addAlert = (alertData: any) => {
      const newAlert: Alert = {
        id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: alertData.type || 'info',
        severity: alertData.severity || 'low',
        title: alertData.title,
        message: alertData.message,
        date: new Date().toISOString(),
        actionUrl: alertData.actionUrl || null,
        ...alertData.metadata
      }

      // Ajoute l'alerte au début de la liste
      alerts.value.unshift(newAlert)

      // Limite à 100 alertes pour éviter les problèmes de performance
      if (alerts.value.length > 100) {
        alerts.value = alerts.value.slice(0, 100)
      }
    }

    /**
     * Computed : Nombre d'alertes par sévérité
     */
    const highSeverityAlerts = computed(() => alerts.value.filter(a => a.severity === 'high'))
    const mediumSeverityAlerts = computed(() => alerts.value.filter(a => a.severity === 'medium'))
    const lowSeverityAlerts = computed(() => alerts.value.filter(a => a.severity === 'low'))

    /**
     * Réinitialise le store
     */
    const reset = () => {
      alerts.value = []
      loading.value = false
      error.value = null
      readAlerts.value = new Set()
      saveReadAlerts()
    }

    // Initialise le store au chargement
    init()

    return {
      loading,
      error,
      alerts,
      ALERT_TYPES,
      fetchAlerts,
      markAsRead,
      markAllAsRead,
      isRead,
      markAsResolved,
      addAlert,
      reset,
      highSeverityAlerts,
      mediumSeverityAlerts,
      lowSeverityAlerts
    }
  },
  {
    // Configuration de persistance avec pinia-plugin-persistedstate

    persist: {
      key: 'doogoo-alerts',

      storage: localStorage,
      // On ne persiste pas readAlerts via pinia car c'est un Set
      // On utilise loadReadAlerts/saveReadAlerts manuellement
      serializer: {
        serialize: JSON.stringify,
        deserialize: JSON.parse
      }
    }
  }
)
