/**
 * Composable pour gérer la reconnexion automatique avec backoff exponentiel
 * Évite les reconnexions infinies en cas d'erreurs répétées
 */

let reconnectAttempts = 0
let reconnectTimeoutId = null
const MAX_RECONNECT_ATTEMPTS = 5
const INITIAL_DELAY_MS = 1000 // 1 seconde
const MAX_DELAY_MS = 30000 // 30 secondes max

/**
 * Calcule le délai de reconnexion avec backoff exponentiel
 * @param {number} attempt - Numéro de la tentative (commence à 1)
 * @returns {number} Délai en millisecondes
 */
export function calculateReconnectDelay(attempt) {
  // Backoff exponentiel : 1s, 2s, 4s, 8s, 16s, 30s (max)
  const delay = Math.min(INITIAL_DELAY_MS * Math.pow(2, attempt - 1), MAX_DELAY_MS)
  return delay
}

/**
 * Réinitialise le compteur de tentatives (quand connexion réussie)
 */
export function resetReconnectAttempts() {
  reconnectAttempts = 0
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId)
    reconnectTimeoutId = null
  }
}

/**
 * Gère la reconnexion avec backoff exponentiel
 * @param {Function} reconnectFn - Fonction à appeler pour reconnecter
 * @param {string} context - Nom du contexte (pour logs)
 * @returns {boolean} true si reconnexion programmée, false si limite atteinte
 */
export function scheduleReconnect(reconnectFn, context = 'Realtime') {
  // Si on a atteint le maximum, on arrête
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    if (import.meta.env.DEV) {
      console.warn(
        `⚠️ ${context}: Maximum de tentatives de reconnexion atteint (${MAX_RECONNECT_ATTEMPTS}). Arrêt des tentatives.`
      )
    }
    reconnectAttempts = 0 // Reset pour permettre une nouvelle série après un délai
    return false
  }

  reconnectAttempts++
  const delay = calculateReconnectDelay(reconnectAttempts)

  if (import.meta.env.DEV) {
    console.log(
      `🔄 ${context}: Tentative de reconnexion ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dans ${delay}ms`
    )
  }

  // Annule la reconnexion précédente si elle existe
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId)
  }

  // Programme la reconnexion
  reconnectTimeoutId = setTimeout(() => {
    reconnectTimeoutId = null
    try {
      reconnectFn()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`❌ ${context}: Erreur lors de la reconnexion:`, error)
      }
    }
  }, delay)

  return true
}

/**
 * Annule une reconnexion programmée
 */
export function cancelScheduledReconnect() {
  if (reconnectTimeoutId) {
    clearTimeout(reconnectTimeoutId)
    reconnectTimeoutId = null
  }
}
