import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Supabase Edge Function: Fetch Exchange Rates
 *
 * This function fetches monthly historical exchange rates from Open Exchange Rates API
 * and stores them in the exchange_rates table.
 *
 * Triggered by:
 * - Cron job (monthly on 1st at 2 AM)
 * - Manual invocation for backfilling historical data
 *
 * Environment variables required:
 * - OPENEXCHANGERATES_API_KEY: API key for openexchangerates.org
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key for bypassing RLS
 */

const OPENEXCHANGERATES_API_KEY = Deno.env.get('OPENEXCHANGERATES_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Supported currencies
const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP', 'XOF'] as const
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

interface ExchangeRateRecord {
  base_currency: SupportedCurrency
  target_currency: SupportedCurrency
  rate: number
  month_year: string
}

/**
 * Generate all currency pair combinations (excluding same-currency pairs)
 */
function generateCurrencyPairs(): Array<[SupportedCurrency, SupportedCurrency]> {
  const pairs: Array<[SupportedCurrency, SupportedCurrency]> = []

  for (const base of SUPPORTED_CURRENCIES) {
    for (const target of SUPPORTED_CURRENCIES) {
      if (base !== target) {
        pairs.push([base, target])
      }
    }
  }

  return pairs
}

interface OpenExchangeRatesResponse {
  disclaimer: string
  license: string
  timestamp: number
  base: string
  rates: Record<string, number>
}

/**
 * Fetch exchange rates from Open Exchange Rates API
 * @param date - Date for historical rates (YYYY-MM-DD format)
 * @param baseCurrency - Base currency (default: USD)
 * @returns Exchange rates object
 */
async function fetchRatesFromAPI(
  date: string,
  baseCurrency: string = 'USD'
): Promise<OpenExchangeRatesResponse> {
  const url = `https://openexchangerates.org/api/historical/${date}.json?app_id=${OPENEXCHANGERATES_API_KEY}&base=${baseCurrency}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Calculate cross rates for all currency pairs
 * @param usdRates - Rates with USD as base
 * @returns Array of exchange rate records
 */
function calculateCrossRates(
  usdRates: OpenExchangeRatesResponse,
  monthYear: string
): ExchangeRateRecord[] {
  const records: ExchangeRateRecord[] = []
  const pairs = generateCurrencyPairs()

  for (const [base, target] of pairs) {
    let rate: number

    if (base === 'USD') {
      // USD -> other currency (direct from API)
      rate = usdRates.rates[target]
    } else if (target === 'USD') {
      // Other currency -> USD (inverse)
      rate = 1 / usdRates.rates[base]
    } else {
      // Cross rate: base -> USD -> target
      // Example: EUR -> GBP = (1 / EUR_USD) * USD_GBP
      const baseToUSD = 1 / usdRates.rates[base]
      const usdToTarget = usdRates.rates[target]
      rate = baseToUSD * usdToTarget
    }

    records.push({
      base_currency: base,
      target_currency: target,
      rate: Number(rate.toFixed(6)), // Round to 6 decimal places
      month_year: monthYear
    })
  }

  return records
}

/**
 * Main handler
 */
serve(async req => {
  try {
    // Validate environment variables
    if (!OPENEXCHANGERATES_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENEXCHANGERATES_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ error: 'Supabase credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request body (optional: allows specifying custom month)
    let targetMonth = ''

    if (req.method === 'POST') {
      const body = await req.json()
      targetMonth = body.month || ''
    }

    // Default: fetch rates for last month
    if (!targetMonth) {
      const now = new Date()
      now.setMonth(now.getMonth() - 1) // Previous month
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      targetMonth = `${year}-${month}-01`
    }

    console.log(`Fetching exchange rates for: ${targetMonth}`)

    // Fetch rates from Open Exchange Rates (USD as base)
    const apiData = await fetchRatesFromAPI(targetMonth, 'USD')

    // Calculate all cross rates
    const records = calculateCrossRates(apiData, targetMonth)

    console.log(`Calculated ${records.length} exchange rate records`)

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Upsert records into database
    const { error } = await supabase.from('exchange_rates').upsert(records, {
      onConflict: 'base_currency,target_currency,month_year'
    })

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Successfully upserted ${records.length} exchange rates`)

    return new Response(
      JSON.stringify({
        success: true,
        month: targetMonth,
        records_count: records.length,
        message: `Exchange rates for ${targetMonth} updated successfully`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)

    return new Response(
      JSON.stringify({
        error: (error as Error).message || 'Unknown error occurred'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
