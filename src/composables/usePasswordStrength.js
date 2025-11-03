import { computed } from 'vue'

/**
 * Composable pour calculer et afficher la force d'un mot de passe
 */
export function usePasswordStrength(password) {
  /**
   * Calcule la force du mot de passe (0-4)
   * 0 = très faible
   * 1 = faible
   * 2 = moyen
   * 3 = fort
   * 4 = très fort
   */
  const strength = computed(() => {
    if (!password.value || password.value.length === 0) {
      return 0
    }

    let score = 0

    // Longueur
    if (password.value.length >= 8) score++
    if (password.value.length >= 12) score++

    // Complexité
    if (/[a-z]/.test(password.value)) score++ // minuscules
    if (/[A-Z]/.test(password.value)) score++ // majuscules
    if (/[0-9]/.test(password.value)) score++ // chiffres
    if (/[^a-zA-Z0-9]/.test(password.value)) score++ // caractères spéciaux

    // Normalise entre 0 et 4
    return Math.min(score, 4)
  })

  /**
   * Label textuel de la force
   */
  const strengthLabel = computed(() => {
    const labels = {
      0: 'Très faible',
      1: 'Faible',
      2: 'Moyen',
      3: 'Fort',
      4: 'Très fort'
    }
    return labels[strength.value] || 'Très faible'
  })

  /**
   * Couleur de la barre de force
   */
  const strengthColor = computed(() => {
    const colors = {
      0: 'bg-red-500',
      1: 'bg-orange-500',
      2: 'bg-yellow-500',
      3: 'bg-blue-500',
      4: 'bg-green-500'
    }
    return colors[strength.value] || 'bg-gray-300'
  })

  /**
   * Largeur de la barre de force (pourcentage)
   */
  const strengthWidth = computed(() => {
    return (strength.value / 4) * 100
  })

  /**
   * Vérifie si le mot de passe est valide (minimum 6 caractères)
   */
  const isValid = computed(() => {
    return password.value && password.value.length >= 6
  })

  /**
   * Vérifie si le mot de passe est fort (score >= 3)
   */
  const isStrong = computed(() => {
    return strength.value >= 3
  })

  return {
    strength,
    strengthLabel,
    strengthColor,
    strengthWidth,
    isValid,
    isStrong
  }
}
