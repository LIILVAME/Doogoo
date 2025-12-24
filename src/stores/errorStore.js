import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store Pinia pour gérer les erreurs réseau globales
 * Utilisé par NetworkErrorModal pour afficher les erreurs de connexion serveur
 */
export const useErrorStore = defineStore('error', () => {
  // État
  const isNetworkError = ref(false)
  const errorMessage = ref('')
  const errorContext = ref('')

  /**
   * Déclenche une erreur réseau
   * @param {string} message - Message d'erreur à afficher
   * @param {string} context - Contexte de l'erreur (optionnel)
   */
  const triggerNetworkError = (message, context = '') => {
    isNetworkError.value = true
    errorMessage.value = message || 'Le serveur semble endormi ou inaccessible.'
    errorContext.value = context
  }

  /**
   * Réinitialise l'erreur réseau
   */
  const resetError = () => {
    isNetworkError.value = false
    errorMessage.value = ''
    errorContext.value = ''
  }

  /**
   * Vérifie si l'erreur est une erreur réseau/timeout
   * @param {Error|Object|string} error - L'erreur à vérifier
   * @returns {boolean}
   */
  const isNetworkOrTimeoutError = (error) => {
    if (!error) return false

    const errorMessage = typeof error === 'string' 
      ? error 
      : error?.message || error?.error_description || String(error)

    const lowerMessage = errorMessage.toLowerCase()

    // Détecte les erreurs réseau et timeout
    const networkErrorPatterns = [
      'timeout',
      'network',
      'failed to fetch',
      'network request failed',
      'connection',
      'internet',
      'serveur',
      'inaccessible',
      'endormi',
      'cold start',
      'service unavailable',
      'gateway timeout',
      '503',
      '504'
    ]

    return networkErrorPatterns.some(pattern => lowerMessage.includes(pattern))
  }

  return {
    // State
    isNetworkError,
    errorMessage,
    errorContext,
    // Actions
    triggerNetworkError,
    resetError,
    isNetworkOrTimeoutError
  }
})
