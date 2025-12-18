/**
 * Utilitaire de conversion de données de formulaire
 * Utilisé pour préparer les données avant envoi aux stores TypeScript
 */

/**
 * Convertit une valeur en number, retourne undefined si invalide
 *
 * Gère les cas suivants :
 * - Chaînes numériques : "100" → 100
 * - Nombres : 100 → 100
 * - Décimales avec virgule : "1,200.50" → 1200.5 (remplace la virgule par un point)
 * - Valeurs vides : "", null, undefined → undefined
 * - Valeurs invalides : "abc" → undefined
 *
 * @param {unknown} value - Valeur à convertir (string, number, null, undefined)
 * @returns {number | undefined} - Nombre converti ou undefined si invalide
 *
 * @example
 * toNumber("100") // → 100
 * toNumber("10.5") // → 10.5
 * toNumber("1,200.50") // → 1200.5
 * toNumber(100) // → 100
 * toNumber("") // → undefined
 * toNumber(null) // → undefined
 * toNumber("abc") // → undefined
 */
export const toNumber = value => {
  // Valeurs vides → undefined
  if (value === null || value === undefined || value === '') {
    return undefined
  }

  // Si c'est déjà un number, on le retourne directement
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value
  }

  // Si c'est une string, on nettoie et on parse
  if (typeof value === 'string') {
    const cleaned = value.trim().replace(',', '.')
    const num = parseFloat(cleaned)
    return isNaN(num) ? undefined : num
  }

  // Pour les autres types (bool, object, array), on tente Number() mais on filtre NaN
  // Note: Dans un formulaire réel, ces cas ne devraient pas arriver
  const num = Number(value)
  return isNaN(num) ? undefined : num
}
