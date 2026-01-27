/**
 * Currency Converter Utility
 * Handles multi-currency conversions using historical exchange rates
 */

import { supabase } from '@/lib/supabaseClient'
import type { ExchangeRate, SupportedCurrency } from '@/types/api'

/**
 * In-memory cache for FX rates
 * Key format: "EUR_USD_2024-01-01"
 */
interface CachedRate {
    rate: number
    expires: number
}

const fxCache = new Map<string, CachedRate>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Currency metadata for formatting and display
 */
export const CURRENCY_METADATA: Record<SupportedCurrency, { symbol: string; name: string; locale: string }> = {
    EUR: { symbol: '€', name: 'Euro', locale: 'fr-FR' },
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    XOF: { symbol: 'CFA', name: 'West African CFA Franc', locale: 'fr-FR' }
}

/**
 * Get the first day of the month for a given date
 * @param date - Date to extract month from
 * @returns ISO date string (YYYY-MM-01)
 */
function getMonthYear(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}-01`
}

/**
 * Fetch exchange rate from database
 * @param sourceCurrency - Source currency code
 * @param targetCurrency - Target currency code
 * @param monthYear - Month for historical rate (YYYY-MM-01)
 * @returns Exchange rate or null if not found
 */
async function fetchExchangeRate(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
    monthYear: string
): Promise<number | null> {
    try {
        const { data, error } = await supabase
            .from('exchange_rates')
            .select('rate')
            .eq('base_currency', sourceCurrency)
            .eq('target_currency', targetCurrency)
            .eq('month_year', monthYear)
            .single()

        if (error || !data) {
            console.warn(`FX rate not found: ${sourceCurrency}->${targetCurrency} for ${monthYear}`, error)
            return null
        }

        return Number(data.rate)
    } catch (err) {
        console.error('Error fetching exchange rate:', err)
        return null
    }
}

/**
 * Get current exchange rate (latest available)
 * @param sourceCurrency - Source currency code
 * @param targetCurrency - Target currency code
 * @returns Current exchange rate or null
 */
async function getCurrentExchangeRate(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency
): Promise<number | null> {
    try {
        const { data, error } = await supabase
            .from('exchange_rates')
            .select('rate')
            .eq('base_currency', sourceCurrency)
            .eq('target_currency', targetCurrency)
            .order('month_year', { ascending: false })
            .limit(1)
            .single()

        if (error || !data) {
            console.warn(`Current FX rate not found: ${sourceCurrency}->${targetCurrency}`, error)
            return null
        }

        return Number(data.rate)
    } catch (err) {
        console.error('Error fetching current exchange rate:', err)
        return null
    }
}

/**
 * Convert amount from source currency to target currency using historical rate
 * @param amount - Amount to convert
 * @param sourceCurrency - Source currency code (e.g., 'EUR')
 * @param targetCurrency - Target currency code (e.g., 'USD')
 * @param date - Date for historical rate (uses month of this date)
 * @returns Converted amount or null if rate not found
 */
export async function convertCurrency(
    amount: number,
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
    date: string | Date
): Promise<number | null> {
    // Same currency = no conversion
    if (sourceCurrency === targetCurrency) {
        return amount
    }

    const monthYear = getMonthYear(date)
    const cacheKey = `${sourceCurrency}_${targetCurrency}_${monthYear}`

    // Check cache
    const cached = fxCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
        return amount * cached.rate
    }

    // Fetch rate from database
    let rate = await fetchExchangeRate(sourceCurrency, targetCurrency, monthYear)

    // Fallback 1: Try previous month
    if (rate === null) {
        const prevMonth = new Date(monthYear)
        prevMonth.setMonth(prevMonth.getMonth() - 1)
        const prevMonthYear = getMonthYear(prevMonth)

        rate = await fetchExchangeRate(sourceCurrency, targetCurrency, prevMonthYear)

        if (rate !== null) {
            console.warn(`Using previous month rate for ${monthYear}: ${prevMonthYear}`)
        }
    }

    // Fallback 2: Use current rate
    if (rate === null) {
        rate = await getCurrentExchangeRate(sourceCurrency, targetCurrency)

        if (rate !== null) {
            console.warn(`Using current rate for historical conversion: ${sourceCurrency}->${targetCurrency}`)
        }
    }

    // Final fallback: Return null (caller should handle)
    if (rate === null) {
        console.error(`No exchange rate available: ${sourceCurrency}->${targetCurrency} for ${monthYear}`)
        return null
    }

    // Cache the rate
    fxCache.set(cacheKey, {
        rate,
        expires: Date.now() + CACHE_TTL_MS
    })

    return amount * rate
}

/**
 * Aggregate payments in a target currency with historical FX conversion
 * @param payments - Array of payments with currency metadata
 * @param targetCurrency - Currency to aggregate into (default: 'USD')
 * @returns Total amount in target currency
 */
export async function aggregatePaymentsInCurrency(
    payments: Array<{ amount: number; currency: SupportedCurrency; dueDate: string }>,
    targetCurrency: SupportedCurrency = 'USD'
): Promise<number> {
    const conversions = await Promise.all(
        payments.map(async (p) => {
            return await convertCurrency(p.amount, p.currency, targetCurrency, p.dueDate)
        })
    )

    // Filter out null values (failed conversions) and sum
    return conversions.reduce((sum, val) => sum + (val || 0), 0)
}

/**
 * Aggregate property rents in a target currency
 * @param properties - Array of properties with currency metadata
 * @param targetCurrency - Currency to aggregate into (default: 'USD')
 * @returns Total rent in target currency
 */
export async function aggregateRentsInCurrency(
    properties: Array<{ rent: number; currency: SupportedCurrency }>,
    targetCurrency: SupportedCurrency = 'USD'
): Promise<number> {
    // Use current month for rent aggregation
    const currentMonth = getMonthYear(new Date())

    const conversions = await Promise.all(
        properties.map(async (p) => {
            return await convertCurrency(p.rent, p.currency, targetCurrency, currentMonth)
        })
    )

    return conversions.reduce((sum, val) => sum + (val || 0), 0)
}

/**
 * Clear the FX rate cache (useful for testing or manual refresh)
 */
export function clearFXCache(): void {
    fxCache.clear()
}

/**
 * Format amount with currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted string (e.g., "€1,234.56")
 */
export function formatWithCurrency(amount: number, currency: SupportedCurrency): string {
    const metadata = CURRENCY_METADATA[currency]

    return new Intl.NumberFormat(metadata.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount)
}
