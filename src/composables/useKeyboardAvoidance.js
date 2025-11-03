import { onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer l'évitement du clavier mobile
 * Scroll automatiquement vers l'input focus pour éviter qu'il soit masqué par le clavier
 */
export function useKeyboardAvoidance() {
  let _activeInput = null

  /**
   * Scroll vers l'input focusé
   */
  const scrollToInput = input => {
    if (!input) return

    // Délai pour laisser le clavier s'ouvrir
    setTimeout(() => {
      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }, 300)
  }

  /**
   * Gère le focus sur un input
   */
  const handleFocus = event => {
    const target = event.target

    // Ignore les éléments qui ne sont pas des champs de formulaire
    if (
      target.disabled ||
      target.readOnly ||
      target.tagName === 'BUTTON' ||
      (target.tagName === 'INPUT' &&
        (target.type === 'submit' || target.type === 'button' || target.type === 'reset'))
    ) {
      return
    }

    // Vérifie que c'est un input, textarea ou select valide
    if (
      (target.tagName === 'INPUT' &&
        !['submit', 'button', 'reset', 'checkbox', 'radio', 'file'].includes(target.type)) ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      _activeInput = target
      scrollToInput(target)
    }
  }

  /**
   * Gère le blur (perte de focus)
   */
  const handleBlur = () => {
    _activeInput = null
    // Note: on ne fait rien ici, juste nettoyer la référence
  }

  /**
   * Initialise les écouteurs
   */
  const init = () => {
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)
  }

  /**
   * Nettoie les écouteurs
   */
  const cleanup = () => {
    document.removeEventListener('focusin', handleFocus)
    document.removeEventListener('focusout', handleBlur)
    _activeInput = null
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    init,
    cleanup,
    scrollToInput
  }
}
