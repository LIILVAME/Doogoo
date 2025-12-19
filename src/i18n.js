/**
 * Système de traduction compilé à build-time
 * Compatible avec vue-i18n mais sans parsing runtime
 */

// Import des traductions compilées à build-time
import enMessages from './locales/compiled/en.js'
import frMessages from './locales/compiled/fr.js'

// Cache des traductions par locale
const messages = {
  en: enMessages,
  fr: frMessages
}

// Locale active
let currentLocale = 'fr'

/**
 * Récupère une traduction par clé
 * Supporte les clés imbriquées: "auth.login.title"
 */
function getTranslation(key, locale = currentLocale, values = {}) {
  const localeMessages = messages[locale] || messages.en

  // Résout la clé imbriquée (ex: "auth.login.title")
  const keys = key.split('.')
  let translation = localeMessages

  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k]
    } else {
      // Fallback sur EN si la clé n'existe pas
      if (locale !== 'en') {
        return getTranslation(key, 'en', values)
      }
      // OPTIMISATION : On renvoie la clé sans spammer la console
      // Les traductions manquantes sont gérées silencieusement pour éviter le lag
      return key
    }
  }

  // Si c'est une string, on fait l'interpolation
  if (typeof translation === 'string') {
    return interpolate(translation, values)
  }

  return key
}

/**
 * Interpole les valeurs dans une string
 * Supporte {key} et {{key}} pour compatibilité vue-i18n
 */
function interpolate(text, values) {
  if (!values || Object.keys(values).length === 0) {
    return text
  }

  return text.replace(/\{\{?(\w+)\}\}?/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match
  })
}

/**
 * Change la locale active
 */
function setLocale(locale) {
  if (messages[locale]) {
    currentLocale = locale
    // Déclenche un événement pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }))
    }
  } else {
    // OPTIMISATION : Fallback silencieux pour éviter les logs en production
    // En dev, on peut activer le log si nécessaire
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Locale "${locale}" not found, falling back to "fr"`)
    }
    currentLocale = 'fr'
  }
}

// API compatible avec vue-i18n
const i18n = {
  // Fonction de traduction principale
  t: (key, values = {}) => getTranslation(key, currentLocale, values),

  // Gestion de la locale
  locale: {
    get value() {
      return currentLocale
    },
    set value(locale) {
      setLocale(locale)
    }
  },

  // Méthodes utilitaires
  te: (key, locale = currentLocale) => {
    const localeMessages = messages[locale] || messages.en
    const keys = key.split('.')
    let translation = localeMessages

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k]
      } else {
        return false
      }
    }

    return typeof translation === 'string'
  },

  // Messages pour compatibilité
  get messages() {
    return messages
  },

  // Compatibilité avec l'API globale
  global: {
    locale: {
      get value() {
        return currentLocale
      },
      set value(locale) {
        setLocale(locale)
      }
    },
    t: (key, values = {}) => getTranslation(key, currentLocale, values)
  }
}

export default i18n
