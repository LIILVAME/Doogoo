import { onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer l'évitement du clavier sur mobile
 * Scroll automatiquement vers l'input focus pour éviter qu'il soit masqué par le clavier
 *
 * @example
 * useKeyboardAvoidance()
 */
export function useKeyboardAvoidance() {
  let previousScrollY = 0
  let timeoutId = null

  const handleInputFocus = event => {
    // Annule le timeout précédent
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Attendre que le clavier soit affiché (petit délai)
    timeoutId = setTimeout(() => {
      const input = event.target
      if (!input) return

      // Calculer la position de l'input par rapport à la viewport
      const rect = input.getBoundingClientRect()
      const inputBottom = rect.bottom
      const inputTop = rect.top

      // Hauteur de la viewport (peut être réduite par le clavier)
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Seuil pour considérer que l'input est masqué (30% du bas de l'écran)
      const threshold = viewportHeight * 0.3

      // Si l'input est trop bas ou trop haut, scroller pour le centrer
      if (inputBottom > viewportHeight - threshold || inputTop < threshold) {
        // Option 1: scrollIntoView avec options
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })

        // Option 2: Scroll manuel pour plus de contrôle
        // const scrollOffset = inputBottom - viewportHeight + threshold + 20 // 20px de marge
        // window.scrollBy({
        //   top: scrollOffset,
        //   behavior: 'smooth'
        // })
      }
    }, 300) // Délai pour laisser le clavier s'afficher
  }

  const handleInputBlur = () => {
    // Optionnel: restaurer la position de scroll après la fermeture du clavier
    // (désactivé par défaut pour ne pas perturber l'utilisateur)
  }

  onMounted(() => {
    // Écoute les événements focus sur tous les inputs, textareas, selects
    document.addEventListener('focusin', handleInputFocus, true)
    document.addEventListener('focusout', handleInputBlur, true)

    // Sauvegarde la position de scroll initiale
    previousScrollY = window.scrollY || window.pageYOffset
  })

  onUnmounted(() => {
    document.removeEventListener('focusin', handleInputFocus, true)
    document.removeEventListener('focusout', handleInputBlur, true)

    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return {
    // Expose des méthodes si besoin
    scrollToInput: inputElement => {
      if (inputElement && inputElement.scrollIntoView) {
        inputElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }
    }
  }
}
