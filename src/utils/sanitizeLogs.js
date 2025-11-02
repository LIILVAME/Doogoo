/**
 * Utilitaires pour masquer les informations sensibles dans les logs
 */

/**
 * Masque les informations sensibles d'un objet utilisateur
 * @param {Object} user - Objet utilisateur
 * @returns {Object} Objet utilisateur avec données masquées
 */
export function sanitizeUser(user) {
  if (!user) return null

  return {
    id: maskId(user.id),
    email: maskEmail(user.email)
    // Ne pas logger d'autres champs sensibles
    // phone, avatar_url, etc. sont exclus
  }
}

/**
 * Masque les informations sensibles d'une session
 * @param {Object} session - Objet session
 * @returns {Object} Objet session avec données masquées
 */
export function sanitizeSession(session) {
  if (!session) return null

  return {
    access_token: maskToken(session.access_token),
    refresh_token: maskToken(session.refresh_token),
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: sanitizeUser(session.user)
  }
}

/**
 * Masque un ID UUID (garde les 4 premiers caractères)
 * @param {string} id - UUID à masquer
 * @returns {string} ID masqué (ex: "5d7b4a1c-****")
 */
export function maskId(id) {
  if (!id || typeof id !== 'string') return '***'
  if (id.length <= 8) return '***'
  return id.substring(0, 8) + '-****'
}

/**
 * Masque un email (garde le préfixe et le domaine)
 * @param {string} email - Email à masquer
 * @returns {string} Email masqué (ex: "tv**@duck.com")
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '***'
  const [local, domain] = email.split('@')
  if (!domain) return '***'

  if (local.length <= 2) {
    return `**@${domain}`
  }
  return `${local.substring(0, 2)}**@${domain}`
}

/**
 * Masque un token (garde les 10 premiers caractères)
 * @param {string} token - Token à masquer
 * @returns {string} Token masqué (ex: "eyJhbGciOi...")
 */
export function maskToken(token) {
  if (!token || typeof token !== 'string') return '***'
  if (token.length <= 20) return '***'
  return token.substring(0, 20) + '...'
}

/**
 * Masque les informations sensibles d'un objet pour les logs
 * @param {Object} obj - Objet à masquer
 * @param {Array<string>} sensitiveKeys - Clés sensibles à masquer
 * @returns {Object} Objet avec données sensibles masquées
 */
export function sanitizeObject(obj, sensitiveKeys = []) {
  if (!obj || typeof obj !== 'object') return obj

  const defaultSensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'api_key',
    'access_token',
    'refresh_token',
    'authorization',
    'email',
    'phone',
    'user_id',
    'id'
  ]

  const keysToMask = [...defaultSensitiveKeys, ...sensitiveKeys]
  const sanitized = { ...obj }

  for (const key of keysToMask) {
    if (key in sanitized) {
      if (key === 'email') {
        sanitized[key] = maskEmail(sanitized[key])
      } else if (key === 'id' || key === 'user_id') {
        sanitized[key] = maskId(sanitized[key])
      } else if (key.includes('token') || key.includes('key')) {
        sanitized[key] = maskToken(sanitized[key])
      } else {
        sanitized[key] = '***'
      }
    }
  }

  return sanitized
}

/**
 * Fonction helper pour logger de manière sécurisée
 * @param {string} level - Niveau de log ('log', 'warn', 'error')
 * @param {string} message - Message de log
 * @param {Object} data - Données à logger (seront sanitizées)
 */
export function safeLog(level = 'log', message, data = {}) {
  const sanitizedData = sanitizeObject(data)

  if (level === 'error') {
    console.error(message, sanitizedData)
  } else if (level === 'warn') {
    console.warn(message, sanitizedData)
  } else {
    console.log(message, sanitizedData)
  }
}
