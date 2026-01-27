import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timeout: number
  action?: ToastAction
}

export interface ToastOptions {
  timeout?: number
  action?: ToastAction
}

/**
 * Store Pinia pour gérer les notifications toast
 * Centralise l'affichage des messages de succès, erreur et info
 */
export const useToastStore = defineStore('toasts', () => {
  const items: Ref<ToastItem[]> = ref([])

  /**
   * Ajoute un nouveau toast
   * Limite à 1 toast visible à la fois pour éviter la surcharge
   */
  const push = (
    toast: Omit<ToastItem, 'id' | 'timeout' | 'type'> & {
      type: ToastItem['type']
      timeout?: number
    }
  ) => {
    // Supprime le toast précédent s'il existe (limite à 1 toast visible)
    if (items.value.length > 0) {
      clear()
    }

    const id =
      crypto.randomUUID?.() || Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const toastItem: ToastItem = {
      id,
      timeout: 4000,
      ...toast
    }

    items.value.push(toastItem)

    // Supprime automatiquement après le timeout
    if (toastItem.timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, toastItem.timeout)
    }
  }

  /**
   * Supprime un toast par son ID
   */
  const remove = (id: string) => {
    const index = items.value.findIndex(t => t.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  /**
   * Supprime tous les toasts
   */
  const clear = () => {
    items.value = []
  }

  /**
   * Méthodes helper pour les types courants
   */
  const success = (message: string, options: ToastOptions = {}) => {
    push({ type: 'success', message, ...options })
  }

  const error = (message: string, options: ToastOptions = {}) => {
    push({ type: 'error', message, timeout: 6000, ...options })
  }

  const info = (message: string, options: ToastOptions = {}) => {
    push({ type: 'info', message, ...options })
  }

  // Alias warning -> type dédié (utilisé par certains stores)
  const warning = (message: string, options: ToastOptions = {}) => {
    push({ type: 'warning', message, timeout: 6000, ...options })
  }

  return {
    // State
    items,
    // Actions
    push,
    remove,
    clear,
    // Helpers
    success,
    error,
    info,
    warning
  }
})
