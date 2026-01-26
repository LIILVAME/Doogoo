/**
 * Composable pour le haptic feedback sur mobile
 * Utilise l'API Vibration pour les appareils compatibles
 */

/**
 * Types de feedback haptique
 */
export const HapticType = {
  LIGHT: 'light', // Feedback léger (sélection)
  MEDIUM: 'medium', // Feedback moyen (action)
  HEAVY: 'heavy', // Feedback fort (confirmation)
  SUCCESS: 'success', // Feedback de succès
  ERROR: 'error', // Feedback d'erreur
  WARNING: 'warning' // Feedback d'avertissement
}

/**
 * Patterns de vibration pour chaque type
 */
const vibrationPatterns = {
  [HapticType.LIGHT]: [10],
  [HapticType.MEDIUM]: [20],
  [HapticType.HEAVY]: [30],
  [HapticType.SUCCESS]: [10, 50, 10],
  [HapticType.ERROR]: [30, 50, 30],
  [HapticType.WARNING]: [20, 50, 20]
}

/**
 * Vérifie si le haptic feedback est supporté
 */
const isHapticSupported = () => {
  if (typeof window === 'undefined') return false
  return 'vibrate' in navigator
}

/**
 * Déclenche un feedback haptique
 * @param {HapticType} type - Type de feedback
 * @param {boolean} force - Force le feedback même si l'utilisateur a désactivé les animations
 */
export function useHapticFeedback(type = HapticType.MEDIUM, force = false) {
  /**
   * Déclenche le feedback
   */
  const trigger = () => {
    // Respecte prefers-reduced-motion sauf si force=true
    if (!force && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    if (!isHapticSupported()) {
      return
    }

    const pattern = vibrationPatterns[type] || vibrationPatterns[HapticType.MEDIUM]

    try {
      navigator.vibrate(pattern)
    } catch (error) {
      // Ignore les erreurs de vibration (peut échouer sur certains navigateurs)
      if (import.meta.env.DEV) {
        console.debug('Haptic feedback non disponible:', error)
      }
    }
  }

  return {
    trigger,
    isSupported: isHapticSupported()
  }
}

/**
 * Helper pour déclencher un feedback léger
 */
export const hapticLight = () => {
  const { trigger } = useHapticFeedback(HapticType.LIGHT)
  trigger()
}

/**
 * Helper pour déclencher un feedback moyen
 */
export const hapticMedium = () => {
  const { trigger } = useHapticFeedback(HapticType.MEDIUM)
  trigger()
}

/**
 * Helper pour déclencher un feedback fort
 */
export const hapticHeavy = () => {
  const { trigger } = useHapticFeedback(HapticType.HEAVY)
  trigger()
}

/**
 * Helper pour déclencher un feedback de succès
 */
export const hapticSuccess = () => {
  const { trigger } = useHapticFeedback(HapticType.SUCCESS)
  trigger()
}

/**
 * Helper pour déclencher un feedback d'erreur
 */
export const hapticError = () => {
  const { trigger } = useHapticFeedback(HapticType.ERROR)
  trigger()
}

/**
 * Helper pour déclencher un feedback d'avertissement
 */
export const hapticWarning = () => {
  const { trigger } = useHapticFeedback(HapticType.WARNING)
  trigger()
}
