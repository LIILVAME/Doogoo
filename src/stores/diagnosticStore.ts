import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LogEntry {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  context: Record<string, any>
  timestamp: string
}

export interface ApiLatencyMeasure {
  endpoint: string
  duration: number
  timestamp: number
}

export interface Metrics {
  apiLatency: ApiLatencyMeasure[]
  apiErrors: number
  apiSuccess: number
  lastSync: string | null
}

export interface UserSession {
  userId: string | null
  email: string | null
  authenticatedAt: string | null
}

/**
 * Store Pinia pour le monitoring et le diagnostic de l'application
 * Centralise les logs, erreurs, latences et événements API
 */
export const useDiagnosticStore = defineStore(
  'diagnostic',
  () => {
    // State
    const logs = ref<LogEntry[]>([])
    const metrics = ref<Metrics>({
      apiLatency: [], // Array of { endpoint, duration, timestamp }
      apiErrors: 0,
      apiSuccess: 0,
      lastSync: null
    })
    const userSession = ref<UserSession | null>(null)
    const isDegradedMode = ref(false) // Mode dégradé activé si erreurs critiques
    const maxLogs = 500 // Limite de logs pour éviter la saturation mémoire

    /**
     * Enregistre un événement dans les logs
     * @param type - Type d'événement ('info', 'warning', 'error', 'success')
     * @param message - Message de l'événement
     * @param context - Contexte additionnel
     */
    const logEvent = (
      type: LogEntry['type'],
      message: string,
      context: Record<string, any> = {}
    ) => {
      const logEntry: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type,
        message,
        context,
        timestamp: new Date().toISOString()
      }

      logs.value.unshift(logEntry)

      // Limite le nombre de logs pour éviter la saturation
      if (logs.value.length > maxLogs) {
        logs.value = logs.value.slice(0, maxLogs)
      }

      // Active le mode dégradé si erreur critique
      if (type === 'error' && context.severity === 'critical') {
        isDegradedMode.value = true
      }
    }

    /**
     * Enregistre la latence d'un appel API
     * @param endpoint - Nom de l'endpoint appelé
     * @param duration - Durée en millisecondes
     */
    const trackLatency = (endpoint: string, duration: number) => {
      metrics.value.apiLatency.push({
        endpoint,
        duration,
        timestamp: Date.now()
      })

      // Garde seulement les 100 dernières mesures par endpoint
      const endpointLatencies = metrics.value.apiLatency.filter(l => l.endpoint === endpoint)
      if (endpointLatencies.length > 100) {
        metrics.value.apiLatency = metrics.value.apiLatency.filter(
          l => !(l.endpoint === endpoint && endpointLatencies.indexOf(l) >= 100)
        )
      }
    }

    /**
     * Enregistre une erreur avec contexte
     * @param error - L'erreur à enregistrer
     * @param context - Contexte de l'erreur
     */
    const recordError = (error: any, context: Record<string, any> = {}) => {
      metrics.value.apiErrors++

      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      const errorStack = error?.stack || null

      logEvent('error', errorMessage, {
        ...context,
        stack: errorStack,
        error: error
      })
    }

    /**
     * Enregistre un succès API
     * @param endpoint - Nom de l'endpoint
     */
    const recordSuccess = (endpoint: string) => {
      metrics.value.apiSuccess++
      metrics.value.lastSync = new Date().toISOString()

      logEvent('success', `API call succeeded: ${endpoint}`, { endpoint })
    }

    /**
     * Calcule la latence moyenne pour un endpoint
     * @param endpoint - Nom de l'endpoint
     * @returns Latence moyenne en ms
     */
    const getAverageLatency = (endpoint: string) => {
      const latencies = metrics.value.apiLatency
        .filter(l => l.endpoint === endpoint)
        .map(l => l.duration)

      if (latencies.length === 0) return 0

      const sum = latencies.reduce((acc, val) => acc + val, 0)
      return Math.round(sum / latencies.length)
    }

    /**
     * Calcule la latence moyenne globale
     * @returns Latence moyenne globale en ms
     */
    const getGlobalAverageLatency = () => {
      if (metrics.value.apiLatency.length === 0) return 0

      const sum = metrics.value.apiLatency.reduce((acc, l) => acc + l.duration, 0)
      return Math.round(sum / metrics.value.apiLatency.length)
    }

    /**
     * Récupère les logs filtrés par type
     * @param type - Type de log à filtrer ('info', 'warning', 'error', 'success')
     * @returns Logs filtrés
     */
    const getLogsByType = (type: LogEntry['type']) => {
      return logs.value.filter(log => log.type === type)
    }

    /**
     * Récupère les métriques groupées par endpoint
     * @returns Métriques groupées { endpoint: { count, avgLatency, errors } }
     */
    const getMetricsByEndpoint = () => {
      const grouped: Record<string, any> = {}

      metrics.value.apiLatency.forEach(l => {
        if (!grouped[l.endpoint]) {
          grouped[l.endpoint] = {
            count: 0,
            totalLatency: 0,
            errors: 0
          }
        }
        grouped[l.endpoint].count++
        grouped[l.endpoint].totalLatency += l.duration
      })

      // Compter les erreurs par endpoint depuis les logs
      logs.value
        .filter(log => log.type === 'error' && log.context.endpoint)
        .forEach(log => {
          const endpoint = log.context.endpoint
          if (!grouped[endpoint]) {
            grouped[endpoint] = { count: 0, totalLatency: 0, errors: 0 }
          }
          grouped[endpoint].errors++
        })

      // Calculer les moyennes
      Object.keys(grouped).forEach(endpoint => {
        const data = grouped[endpoint]
        data.avgLatency = data.count > 0 ? Math.round(data.totalLatency / data.count) : 0
      })

      return grouped
    }

    /**
     * Exporte les diagnostics au format JSON
     * @returns Objet JSON contenant tous les diagnostics
     */
    const exportDiagnostics = () => {
      return {
        timestamp: new Date().toISOString(),
        userSession: userSession.value,
        metrics: {
          ...metrics.value,
          globalAverageLatency: getGlobalAverageLatency(),
          metricsByEndpoint: getMetricsByEndpoint()
        },
        logs: logs.value,
        isDegradedMode: isDegradedMode.value
      }
    }

    /**
     * Réinitialise le store de diagnostic
     */
    const reset = () => {
      logs.value = []
      metrics.value = {
        apiLatency: [],
        apiErrors: 0,
        apiSuccess: 0,
        lastSync: null
      }
      isDegradedMode.value = false
    }

    /**
     * Met à jour la session utilisateur
     * @param session - Données de session
     */
    const setUserSession = (session: any) => {
      userSession.value = {
        userId: session?.user?.id || null,
        email: session?.user?.email || null,
        authenticatedAt: session?.user ? new Date().toISOString() : null
      }
    }

    return {
      // State
      logs,
      metrics,
      userSession,
      isDegradedMode,
      // Actions
      logEvent,
      trackLatency,
      recordError,
      recordSuccess,
      getAverageLatency,
      getGlobalAverageLatency,
      getLogsByType,
      getMetricsByEndpoint,
      exportDiagnostics,
      reset,
      setUserSession
    }
  },
  {
    // Configuration de persistance

    persist: {
      key: 'vylo-diagnostics',

      storage: localStorage
    }
  }
)
