import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * Plugin Pinia pour la persistance locale des données
 * Permet de sauvegarder l'état des stores dans localStorage
 * pour permettre un fonctionnement hors ligne
 */
const persistedState = createPersistedState({
  storage: localStorage,
  // Options par défaut pour tous les stores
  auto: false // Désactive la persistance automatique, doit être activée manuellement dans chaque store
})

export default persistedState
