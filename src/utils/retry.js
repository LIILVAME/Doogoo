/**
 * Utilitaire pour réessayer automatiquement une fonction en cas d'échec
 * Utilisé pour améliorer la robustesse des appels API en cas d'erreur réseau temporaire
 */

/**
 * Réessaye une fonction plusieurs fois avec un délai exponentiel
 * @param {Function} fn - Fonction async à réessayer
 * @param {Object} options - Options de retry
 * @param {number} options.maxRetries - Nombre maximum de tentatives (défaut: 3)
 * @param {number} options.initialDelay - Délai initial en ms (défaut: 500)
 * @param {number} options.maxDelay - Délai maximum en ms (défaut: 2000)
 * @param {Function} options.shouldRetry - Fonction pour déterminer si on doit réessayer (défaut: toujours réessayer)
 * @returns {Promise<Object>} { success: boolean, data?: any, error?: Error, retries: number }
 */
export async function retry(fn, options = {}) {
  const { maxRetries = 3, initialDelay = 500, maxDelay = 2000, shouldRetry = () => true } = options

  let lastError = null
  let retries = 0

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn()

      // Si la fonction retourne un objet avec success: false, vérifie si on doit réessayer
      if (result && typeof result === 'object' && result.success === false) {
        if (attempt < maxRetries && shouldRetry(result.error || result)) {
          retries++
          const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)

          console.warn(
            `[RETRY] Tentative ${attempt + 1}/${maxRetries + 1} échouée, réessai dans ${delay}ms...`,
            result.error || result.message
          )

          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }

        return {
          success: false,
          error: result.error || new Error(result.message || 'Unknown error'),
          message: result.message,
          retries
        }
      }

      // Succès
      return {
        success: true,
        data: result?.data || result,
        retries
      }
    } catch (error) {
      lastError = error
      retries++

      // Vérifie si on doit réessayer cette erreur
      if (attempt < maxRetries && shouldRetry(error)) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)

        console.warn(
          `[RETRY] Erreur à la tentative ${attempt + 1}/${maxRetries + 1}, réessai dans ${delay}ms...`,
          error.message
        )

        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // Plus de tentatives ou erreur non réessayable
      break
    }
  }

  // Échec final
  console.warn(`[RETRY] Échec après ${retries} tentative(s)`, lastError)

  return {
    success: false,
    error: lastError || new Error('Unknown error'),
    retries
  }
}

/**
 * Détermine si une erreur est liée au réseau et peut être réessayée
 * @param {Error|Object} error - L'erreur à vérifier
 * @returns {boolean} true si l'erreur est réessayable
 */
export function isRetryableError(error) {
  if (!error) return false

  const errorMessage = error.message?.toLowerCase() || error.toString().toLowerCase()

  // ⚠️ EXCLURE les timeouts - ils ne sont pas réessayables
  // Un timeout indique que la requête prend trop de temps, pas un problème réseau temporaire
  if (errorMessage.includes('timeout') || errorMessage.includes("l'opération a pris plus de")) {
    return false
  }

  const retryableMessages = [
    'network',
    'fetch',
    'connection',
    'econnrefused',
    'enotfound',
    'failed to fetch',
    'networkerror',
    'network request failed'
  ]

  return retryableMessages.some(msg => errorMessage.includes(msg))
}
