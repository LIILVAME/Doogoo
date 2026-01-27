import { onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer l'évitement du clavier mobile
 * Scroll automatiquement vers l'input focus pour éviter qu'il soit masqué par le clavier
 */
export function useKeyboardAvoidance() {
  let _activeInput: HTMLElement | null = null

  /**
   * Scroll vers l'input focusé
   */
  const scrollToInput = (input: HTMLElement | null) => {
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
  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement

    // Ignore les éléments qui ne sont pas des champs de formulaire
    if (
      (target as any).disabled ||
      (target as any).readOnly ||
      target.tagName === 'BUTTON' ||
      (target.tagName === 'INPUT' &&
        ((target as any).type === 'submit' ||
          (target as any).type === 'button' ||
          (target as any).type === 'reset'))
    ) {
      return
    }

    // Vérifie que c'est un input, textarea ou select valide
    if (
      (target.tagName === 'INPUT' &&
        !['submit', 'button', 'reset', 'checkbox', 'radio', 'file'].includes(
          (target as any).type
        )) ||
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
    document.addEventListener('focusin', handleFocus as any)
    document.addEventListener('focusout', handleBlur)
  }

  /**
   * Nettoie les écouteurs
   */
  const cleanup = () => {
    document.removeEventListener('focusin', handleFocus as any)
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
