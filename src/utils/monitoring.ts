/**
 * Monitoring and Observability Utilities
 *
 * Provides instrumentation for tracking performance, errors, and business metrics
 * Integrates with Sentry for error tracking and custom dashboards for metrics
 */

/**
 * Currency conversion metrics
 */
export interface CurrencyConversionMetric {
  from: string
  to: string
  amount: number
  success: boolean
  latency: number
  timestamp: string
  userId?: string
  cacheHit?: boolean
}

/**
 * Aggregation performance metrics
 */
export interface AggregationMetric {
  type: 'payments' | 'rents'
  itemCount: number
  targetCurrency: string
  latency: number
  success: boolean
  timestamp: string
}

/**
 * FX rate fetch metrics
 */
export interface FXRateFetchMetric {
  source: 'cache' | 'database' | 'api'
  baseCurrency: string
  targetCurrency: string
  monthYear: string
  success: boolean
  latency: number
  timestamp: string
}

/**
 * In-memory metrics buffer (flush periodically)
 */
const metricsBuffer: {
  conversions: CurrencyConversionMetric[]
  aggregations: AggregationMetric[]
  fxFetches: FXRateFetchMetric[]
} = {
  conversions: [],
  aggregations: [],
  fxFetches: []
}

const MAX_BUFFER_SIZE = 100
const FLUSH_INTERVAL_MS = 60 * 1000 // 1 minute

/**
 * Track a currency conversion
 */
export function trackCurrencyConversion(
  from: string,
  to: string,
  amount: number,
  success: boolean,
  latency: number,
  options?: { userId?: string; cacheHit?: boolean }
): void {
  const metric: CurrencyConversionMetric = {
    from,
    to,
    amount,
    success,
    latency,
    timestamp: new Date().toISOString(),
    userId: options?.userId,
    cacheHit: options?.cacheHit
  }

  metricsBuffer.conversions.push(metric)

  // Log to console in development
  if (import.meta.env.DEV) {
    console.debug('[Currency Conversion]', metric)
  }

  // Send to Sentry if failed
  if (!success && typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage('Currency conversion failed', {
      level: 'warning',
      tags: { from, to },
      extra: { amount, latency }
    })
  }

  // Flush if buffer is full
  if (metricsBuffer.conversions.length >= MAX_BUFFER_SIZE) {
    flushMetrics()
  }
}

/**
 * Track an aggregation operation
 */
export function trackAggregation(
  type: 'payments' | 'rents',
  itemCount: number,
  targetCurrency: string,
  latency: number,
  success: boolean
): void {
  const metric: AggregationMetric = {
    type,
    itemCount,
    targetCurrency,
    latency,
    success,
    timestamp: new Date().toISOString()
  }

  metricsBuffer.aggregations.push(metric)

  // Log to console in development
  if (import.meta.env.DEV) {
    console.debug('[Aggregation]', metric)
  }

  // Alert if slow
  if (latency > 2000 && typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage('Slow aggregation detected', {
      level: 'warning',
      tags: { type, targetCurrency },
      extra: { itemCount, latency }
    })
  }

  // Flush if buffer is full
  if (metricsBuffer.aggregations.length >= MAX_BUFFER_SIZE) {
    flushMetrics()
  }
}

/**
 * Track an FX rate fetch
 */
export function trackFXRateFetch(
  source: 'cache' | 'database' | 'api',
  baseCurrency: string,
  targetCurrency: string,
  monthYear: string,
  success: boolean,
  latency: number
): void {
  const metric: FXRateFetchMetric = {
    source,
    baseCurrency,
    targetCurrency,
    monthYear,
    success,
    latency,
    timestamp: new Date().toISOString()
  }

  metricsBuffer.fxFetches.push(metric)

  // Log to console in development
  if (import.meta.env.DEV) {
    console.debug('[FX Rate Fetch]', metric)
  }

  // Flush if buffer is full
  if (metricsBuffer.fxFetches.length >= MAX_BUFFER_SIZE) {
    flushMetrics()
  }
}

/**
 * Flush metrics to backend/analytics service
 */
async function flushMetrics(): Promise<void> {
  if (
    metricsBuffer.conversions.length === 0 &&
    metricsBuffer.aggregations.length === 0 &&
    metricsBuffer.fxFetches.length === 0
  ) {
    return
  }

  // Clone and clear buffer
  const metrics = {
    conversions: [...metricsBuffer.conversions],
    aggregations: [...metricsBuffer.aggregations],
    fxFetches: [...metricsBuffer.fxFetches]
  }

  metricsBuffer.conversions = []
  metricsBuffer.aggregations = []
  metricsBuffer.fxFetches = []

  // TODO: Send to analytics backend
  // await fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metrics)
  // })

  console.debug('[Metrics Flushed]', {
    conversions: metrics.conversions.length,
    aggregations: metrics.aggregations.length,
    fxFetches: metrics.fxFetches.length
  })
}

/**
 * Calculate cache hit rate
 */
export function calculateCacheHitRate(): number {
  const total = metricsBuffer.conversions.length
  if (total === 0) return 0

  const cacheHits = metricsBuffer.conversions.filter(m => m.cacheHit).length
  return (cacheHits / total) * 100
}

/**
 * Calculate conversion success rate
 */
export function calculateConversionSuccessRate(): number {
  const total = metricsBuffer.conversions.length
  if (total === 0) return 100

  const successes = metricsBuffer.conversions.filter(m => m.success).length
  return (successes / total) * 100
}

/**
 * Get aggregation latency percentiles
 */
export function getAggregationLatencyPercentiles(): {
  p50: number
  p95: number
  p99: number
} {
  const latencies = metricsBuffer.aggregations.map(m => m.latency).sort((a, b) => a - b)

  if (latencies.length === 0) {
    return { p50: 0, p95: 0, p99: 0 }
  }

  const p50Index = Math.floor(latencies.length * 0.5)
  const p95Index = Math.floor(latencies.length * 0.95)
  const p99Index = Math.floor(latencies.length * 0.99)

  return {
    p50: latencies[p50Index] || 0,
    p95: latencies[p95Index] || 0,
    p99: latencies[p99Index] || 0
  }
}

/**
 * Initialize monitoring (call on app startup)
 */
export function initializeMonitoring(): void {
  // Flush metrics periodically
  setInterval(flushMetrics, FLUSH_INTERVAL_MS)

  // Flush on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      flushMetrics()
    })
  }

  console.info('[Monitoring] Initialized')
}

/**
 * Get current metrics snapshot (for debugging)
 */
export function getMetricsSnapshot() {
  return {
    buffer: {
      conversions: metricsBuffer.conversions.length,
      aggregations: metricsBuffer.aggregations.length,
      fxFetches: metricsBuffer.fxFetches.length
    },
    stats: {
      cacheHitRate: calculateCacheHitRate(),
      conversionSuccessRate: calculateConversionSuccessRate(),
      latencyPercentiles: getAggregationLatencyPercentiles()
    }
  }
}
