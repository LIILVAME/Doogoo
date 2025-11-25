/**
 * Constantes partagées pour l'application Doogoo
 * Centralise les valeurs utilisées dans plusieurs composants
 */

/**
 * Statuts d'occupation d'un bien
 */
export const PROPERTY_STATUS = {
  OCCUPIED: 'occupied',
  VACANT: 'vacant'
}

/**
 * Statuts de paiement d'un locataire
 */
export const PAYMENT_STATUS = {
  ON_TIME: 'on_time',
  LATE: 'late',
  PENDING: 'pending',
  PAID: 'paid'
}

/**
 * Statuts de paiement pour les transactions
 */
export const TRANSACTION_STATUS = {
  PAID: 'paid',
  LATE: 'late',
  PENDING: 'pending'
}

/**
 * Labels des statuts (pour affichage)
 * NOTE: Ces labels sont maintenant gérés par i18n dans les composants
 * Conservés ici pour référence/compatibilité
 * @deprecated Utiliser les traductions i18n dans les composants
 */
export const STATUS_LABELS = {
  // Occupation
  [PROPERTY_STATUS.OCCUPIED]: 'Occupé',
  [PROPERTY_STATUS.VACANT]: 'Libre',

  // Paiement locataire
  [PAYMENT_STATUS.ON_TIME]: 'À jour',
  [PAYMENT_STATUS.LATE]: 'Défaut de paiement',
  [PAYMENT_STATUS.PENDING]: 'En attente',

  // Transaction
  [TRANSACTION_STATUS.PAID]: 'Payé',
  [TRANSACTION_STATUS.LATE]: 'En retard',
  [TRANSACTION_STATUS.PENDING]: 'En attente'
}

/**
 * Classes CSS selon le statut (pour badges)
 */
export const STATUS_CLASSES = {
  // Occupation
  [PROPERTY_STATUS.OCCUPIED]: 'bg-green-100 text-green-800',
  [PROPERTY_STATUS.VACANT]: 'bg-gray-100 text-gray-800',

  // Paiement locataire
  [PAYMENT_STATUS.ON_TIME]: 'bg-green-100 text-green-800',
  [PAYMENT_STATUS.LATE]: 'bg-red-100 text-red-800',
  [PAYMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',

  // Transaction
  [TRANSACTION_STATUS.PAID]: 'bg-green-100 text-green-800',
  [TRANSACTION_STATUS.LATE]: 'bg-red-100 text-red-800',
  [TRANSACTION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800'
}

/**
 * Symboles de devises
 */
export const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  XOF: 'CFA'
}

/**
 * Routes de l'application
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/dashboard/properties',
  PAYMENTS: '/dashboard/payments',
  TENANTS: '/dashboard/tenants',
  SETTINGS: '/dashboard/settings'
}

/**
 * Durée par défaut pour les notifications (en ms)
 */
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000
}

/**
 * Breakpoints Tailwind (pour référence)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

