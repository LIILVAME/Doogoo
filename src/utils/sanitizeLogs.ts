/**
 * Utilitaires pour masquer les informations sensibles dans les logs
 */

/**
 * Masque les informations sensibles d'un objet utilisateur
 */
export function sanitizeUser(user: any): Record<string, any> | null {
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
 */
export function sanitizeSession(session: any): Record<string, any> | null {
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
 */
export function maskId(id: unknown): string {
  if (!id || typeof id !== 'string') return '***'
  if (id.length <= 8) return '***'
  return id.substring(0, 8) + '-****'
}

/**
 * Masque un email (garde le préfixe et le domaine)
 */
export function maskEmail(email: unknown): string {
  if (!email || typeof email !== 'string') return '***'
  const parts = email.split('@')
  const local = parts[0]
  const domain = parts[1]

  if (!domain) return '***'

  if (local.length <= 2) {
    return `**@${domain}`
  }
  return `${local.substring(0, 2)}**@${domain}`
}

/**
 * Masque un token (garde les 10 premiers caractères)
 */
export function maskToken(token: unknown): string {
  if (!token || typeof token !== 'string') return '***'
  if (token.length <= 20) return '***'
  return token.substring(0, 20) + '...'
}

/**
 * Masque les informations sensibles d'un objet pour les logs
 */
export function sanitizeObject(obj: unknown, sensitiveKeys: string[] = []): unknown {
  if (!obj || typeof obj !== 'object' || obj === null) return obj

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

  // Cast explicite car on sait que c'est un objet non-null
  const sanitized = { ...(obj as Record<string, unknown>) }

  for (const key of keysToMask) {
    if (key in sanitized) {
      const val = sanitized[key]
      if (key === 'email') {
        sanitized[key] = maskEmail(val)
      } else if (key === 'id' || key === 'user_id') {
        sanitized[key] = maskId(val)
      } else if (key.includes('token') || key.includes('key')) {
        sanitized[key] = maskToken(val)
      } else {
        sanitized[key] = '***'
      }
    }
  }

  return sanitized
}

/**
 * Fonction helper pour logger de manière sécurisée
 */
export function safeLog(
  level: 'log' | 'warn' | 'error' = 'log',
  message: string,
  data: Record<string, unknown> = {}
): void {
  const sanitizedData = sanitizeObject(data)

  if (level === 'error') {
    console.error(message, sanitizedData)
  } else if (level === 'warn') {
    console.warn(message, sanitizedData)
  } else {
    console.log(message, sanitizedData)
  }
}
