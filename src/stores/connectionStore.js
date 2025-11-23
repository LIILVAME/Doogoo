import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store Pinia pour gérer l'état de connexion réseau
 * Détecte les changements online/offline et fournit l'état de synchronisation
 */
export const useConnectionStore = defineStore('connection', () => {
  const isOnline = ref(navigator.onLine !== undefined ? navigator.onLine : true)
  const lastSync = ref(null)
  let connectionWatcherInitialized = false

  /**
   * Met à jour l'état de connexion
   * @param {boolean} online - État de la connexion
   */
  const setOnline = online => {
    isOnline.value = online
    if (online) {
      updateLastSync()
    }
  }

  /**
   * Met à jour le timestamp de dernière synchronisation
   */
  const updateLastSync = () => {
    lastSync.value = new Date().toISOString()
  }

  /**
   * Initialise les écouteurs d'événements réseau
   */
  const initConnectionWatcher = () => {
    if (connectionWatcherInitialized) {
      return
    }

    // Écoute les événements online/offline du navigateur
    const handleOnline = () => {
      console.log('🌐 Connexion rétablie')
      setOnline(true)
    }

    const handleOffline = () => {
      console.log('📴 Connexion perdue')
      setOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    connectionWatcherInitialized = true

    // Retourne une fonction de nettoyage
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      connectionWatcherInitialized = false
    }
  }

  /**
   * Vérifie manuellement l'état de la connexion
   * Envoie une requête HEAD légère pour tester la connectivité
   */
  const checkConnection = async () => {
    try {
      // Teste la connexion avec une requête légère
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache'
      })

      clearTimeout(timeoutId)
      setOnline(true)
      return true
    } catch {
      setOnline(false)
      return false
    }
  }

  return {
    isOnline,
    lastSync,
    setOnline,
    updateLastSync,
    initConnectionWatcher,
    checkConnection
  }
})
