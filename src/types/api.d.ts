/**
 * Types pour la couche API
 * Définitions TypeScript pour les réponses API et erreurs
 */

/**
 * Réponse standardisée de l'API
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Erreur API standardisée
 */
export interface ApiError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, unknown>
}

/**
 * Propriété immobilière
 */
export interface Property {
  id: string
  name: string
  address?: string
  city: string
  status: 'occupied' | 'vacant'
  rent: number
  currency: 'EUR' | 'USD' | 'GBP' | 'XOF' // ISO 4217 currency code
  tenant?: Tenant | null
  image?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Locataire
 */
export interface Tenant {
  id: string
  name: string
  entryDate: string
  exitDate?: string | null
  rent: number
  status: 'on_time' | 'late' | 'pending' | 'paid'
  propertyId: string
}

/**
 * Paiement
 */
export interface Payment {
  id: string
  propertyId: string
  property?: string
  tenant?: string
  amount: number
  dueDate: string
  status: 'paid' | 'pending' | 'late'
  created_at?: string
  updated_at?: string
}

/**
 * Taux de change historique
 */
export interface ExchangeRate {
  id: string
  base_currency: 'EUR' | 'USD' | 'GBP' | 'XOF'
  target_currency: 'EUR' | 'USD' | 'GBP' | 'XOF'
  rate: number
  month_year: string // ISO date string (YYYY-MM-01)
  created_at?: string
  updated_at?: string
}

/**
 * Profil utilisateur
 */
export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  phone?: string
  company?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

/**
 * Paramètres utilisateur
 */
export interface UserSettings {
  language: 'fr' | 'en'
  currency: 'EUR' | 'USD' | 'GBP' | 'XOF'
  theme: 'light' | 'dark' | 'system'
  alertThreshold: number
  notifications: {
    email: boolean
    payments: boolean
    reminders: boolean
    maintenance: boolean
  }
}

/**
 * Type helper pour les devises supportées
 */
export type SupportedCurrency = 'EUR' | 'USD' | 'GBP' | 'XOF'

/**
 * Métadonnées de devise avec symbole et locale
 */
export interface CurrencyMetadata {
  code: SupportedCurrency
  symbol: string
  name: string
  locale: string
}
