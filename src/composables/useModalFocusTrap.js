import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useFocusTrap } from '@vueuse/core'

/**
 * Composable réutilisable pour ajouter le focus trap aux modales
 * @param {import('vue').Ref} isOpen - Référence reactive pour l'état d'ouverture de la modale
 * @param {Object} options - Options de configuration
 * @returns {Object} Référence modalRef à utiliser dans le template
 */
export function useModalFocusTrap(isOpen, options = {}) {
  const modalRef = ref(null)

  const { escapeDeactivates = true, clickOutsideDeactivates = false, immediate = false } = options

  // Focus trap pour accessibilité
  const { activate, deactivate } = useFocusTrap(modalRef, {
    immediate,
    escapeDeactivates,
    clickOutsideDeactivates
  })

  // Active le focus trap quand la modal s'ouvre
  watch(
    () => isOpen.value,
    isOpenValue => {
      if (isOpenValue) {
        // Délai pour s'assurer que le DOM est rendu
        nextTick(() => {
          if (modalRef.value) {
            activate()
          }
        })
      } else {
        deactivate()
      }
    }
  )

  // Nettoie le focus trap au démontage
  onUnmounted(() => {
    deactivate()
  })

  return {
    modalRef,
    activate,
    deactivate
  }
}
