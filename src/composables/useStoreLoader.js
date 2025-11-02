/**
 * Composable pour gérer le loading state de manière centralisée et pérenne
 * Garantit que loading ne reste jamais bloqué à true
 *
 * Utilise un watcher réactif qui fonctionne dans les stores Pinia
 */

import { watchEffect, onScopeDispose } from 'vue'

/**
 * Initialise un système de surveillance pour garantir que loading ne reste jamais bloqué
 * @param {Ref} loading - Référence réactive du loading state
 * @param {string} storeName - Nom du store pour les logs
 * @param {number} maxLoadingTime - Temps maximum en ms avant reset automatique (défaut: 20s)
 */
export function useStoreLoader(loading, storeName = 'Store', maxLoadingTime = 20000) {
  let loadingStartTime = null
  let safetyTimeout = null
  let isDisposed = false

  // Surveille les changements de loading avec watchEffect (fonctionne dans les stores)
  const stopWatcher = watchEffect(() => {
    if (isDisposed) return

    const currentLoading = loading.value

    if (currentLoading === true && loadingStartTime === null) {
      // Loading devient true : on démarre le chrono
      loadingStartTime = Date.now()

      // Timeout de sécurité
      safetyTimeout = setTimeout(() => {
        if (!isDisposed && loading.value === true) {
          console.warn(
            `⚠️ [${storeName}] loading bloqué depuis plus de ${maxLoadingTime}ms, reset automatique`
          )
          loading.value = false
          loadingStartTime = null
        }
      }, maxLoadingTime)
    } else if (currentLoading === false && loadingStartTime !== null) {
      // Loading devient false : on nettoie
      if (safetyTimeout) {
        clearTimeout(safetyTimeout)
        safetyTimeout = null
      }

      if (loadingStartTime) {
        const duration = Date.now() - loadingStartTime
        if (duration > 5000) {
          console.warn(`⚠️ [${storeName}] loading était actif pendant ${duration}ms (plus de 5s)`)
        }
        loadingStartTime = null
      }
    }
  })

  // Fonction de nettoyage
  const cleanup = () => {
    isDisposed = true
    stopWatcher()

    if (safetyTimeout) {
      clearTimeout(safetyTimeout)
      safetyTimeout = null
    }

    if (loading.value === true) {
      console.warn(`⚠️ [${storeName}] cleanup: reset loading forcé`)
      loading.value = false
    }

    loadingStartTime = null
  }

  // Nettoyage automatique si le scope est détruit
  onScopeDispose(cleanup)

  return { cleanup }
}
