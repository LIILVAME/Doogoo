import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  convertCurrency,
  aggregatePaymentsInCurrency,
  aggregateRentsInCurrency,
  formatWithCurrency,
  clearFXCache,
  CURRENCY_METADATA
} from '@/utils/currencyConverter'
import type { SupportedCurrency } from '@/types/api'

// Mock Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn()
            })),
            order: vi.fn(() => ({
              limit: vi.fn(() => ({
                single: vi.fn()
              }))
            }))
          }))
        }))
      }))
    }))
  }
}))

describe('currencyConverter', () => {
  beforeEach(() => {
    clearFXCache()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearFXCache()
  })

  describe('CURRENCY_METADATA', () => {
    it('should have metadata for all supported currencies', () => {
      const currencies: SupportedCurrency[] = ['EUR', 'USD', 'GBP', 'XOF']

      currencies.forEach(currency => {
        expect(CURRENCY_METADATA[currency]).toBeDefined()
        expect(CURRENCY_METADATA[currency].symbol).toBeDefined()
        expect(CURRENCY_METADATA[currency].name).toBeDefined()
        expect(CURRENCY_METADATA[currency].locale).toBeDefined()
      })
    })

    it('should have correct symbols', () => {
      expect(CURRENCY_METADATA.EUR.symbol).toBe('€')
      expect(CURRENCY_METADATA.USD.symbol).toBe('$')
      expect(CURRENCY_METADATA.GBP.symbol).toBe('£')
      expect(CURRENCY_METADATA.XOF.symbol).toBe('CFA')
    })
  })

  describe('formatWithCurrency', () => {
    it('should format EUR correctly', () => {
      const formatted = formatWithCurrency(1234.56, 'EUR')
      // French locale formats with space and comma
      expect(formatted).toMatch(/1.*234.*56/)
      expect(formatted).toContain('€')
    })

    it('should format USD correctly', () => {
      const formatted = formatWithCurrency(1234.56, 'USD')
      expect(formatted).toMatch(/1.*234.*56/)
      expect(formatted).toContain('$')
    })

    it('should format GBP correctly', () => {
      const formatted = formatWithCurrency(1234.56, 'GBP')
      expect(formatted).toMatch(/1.*234.*56/)
      expect(formatted).toContain('£')
    })

    it('should format XOF correctly', () => {
      const formatted = formatWithCurrency(1234, 'XOF')
      expect(formatted).toMatch(/1.*234/)
      expect(formatted).toContain('CFA')
    })

    it('should handle zero amounts', () => {
      const formatted = formatWithCurrency(0, 'EUR')
      expect(formatted).toContain('0')
      expect(formatted).toContain('€')
    })

    it('should handle negative amounts', () => {
      const formatted = formatWithCurrency(-500, 'USD')
      expect(formatted).toContain('-')
      expect(formatted).toContain('$')
    })
  })

  describe('convertCurrency', () => {
    it('should return same amount for same currency', async () => {
      const result = await convertCurrency(100, 'EUR', 'EUR', '2024-01-15')
      expect(result).toBe(100)
    })

    it('should return null when no rate is found', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock all rate lookups to return null
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
              })),
              order: vi.fn(() => ({
                limit: vi.fn(() => ({
                  single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
                }))
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const result = await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(result).toBeNull()
    })

    it('should convert using historical rate', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock successful rate lookup
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { rate: 1.1 }, error: null })
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const result = await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(result).toBeCloseTo(110, 2) // Allow floating point precision
    })

    it('should cache conversion rates', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      const mockSingle = vi.fn().mockResolvedValue({ data: { rate: 1.2 }, error: null })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: mockSingle
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      // First call
      await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(mockSingle).toHaveBeenCalledTimes(1)

      // Second call (should use cache)
      await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(mockSingle).toHaveBeenCalledTimes(1) // Still 1, not 2
    })
  })

  describe('aggregatePaymentsInCurrency', () => {
    it('should aggregate payments in same currency', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock rate lookup (not needed for same currency, but just in case)
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({ data: { rate: 1.0 }, error: null })
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const payments = [
        { amount: 100, currency: 'EUR' as SupportedCurrency, dueDate: '2024-01-15' },
        { amount: 200, currency: 'EUR' as SupportedCurrency, dueDate: '2024-01-20' },
        { amount: 300, currency: 'EUR' as SupportedCurrency, dueDate: '2024-01-25' }
      ]

      const total = await aggregatePaymentsInCurrency(payments, 'EUR')
      expect(total).toBe(600)
    })

    it('should aggregate payments in different currencies', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock different rates
      let callCount = 0
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockImplementation(() => {
                  callCount++
                  if (callCount === 1) {
                    // EUR to USD
                    return Promise.resolve({ data: { rate: 1.1 }, error: null })
                  } else {
                    // GBP to USD
                    return Promise.resolve({ data: { rate: 1.3 }, error: null })
                  }
                })
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const payments = [
        { amount: 100, currency: 'EUR' as SupportedCurrency, dueDate: '2024-01-15' },
        { amount: 100, currency: 'GBP' as SupportedCurrency, dueDate: '2024-01-20' }
      ]

      const total = await aggregatePaymentsInCurrency(payments, 'USD')
      expect(total).toBe(240) // 100*1.1 + 100*1.3
    })

    it('should handle empty payments array', async () => {
      const total = await aggregatePaymentsInCurrency([], 'USD')
      expect(total).toBe(0)
    })

    it('should skip failed conversions', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock: first conversion succeeds, second fails
      let callCount = 0
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockImplementation(() => {
                  callCount++
                  if (callCount === 1) {
                    return Promise.resolve({ data: { rate: 1.1 }, error: null })
                  } else {
                    return Promise.resolve({ data: null, error: { message: 'Not found' } })
                  }
                }),
                order: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    single: vi
                      .fn()
                      .mockResolvedValue({ data: null, error: { message: 'Not found' } })
                  }))
                }))
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const payments = [
        { amount: 100, currency: 'EUR' as SupportedCurrency, dueDate: '2024-01-15' },
        { amount: 100, currency: 'GBP' as SupportedCurrency, dueDate: '2024-01-20' }
      ]

      const total = await aggregatePaymentsInCurrency(payments, 'USD')
      expect(total).toBeCloseTo(110, 2) // Only first payment converted
    })
  })

  describe('aggregateRentsInCurrency', () => {
    it('should aggregate rents in same currency', async () => {
      const properties = [
        { rent: 500, currency: 'EUR' as SupportedCurrency },
        { rent: 700, currency: 'EUR' as SupportedCurrency },
        { rent: 900, currency: 'EUR' as SupportedCurrency }
      ]

      const total = await aggregateRentsInCurrency(properties, 'EUR')
      expect(total).toBe(2100)
    })

    it('should aggregate rents in different currencies', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      // Mock different rates
      let callCount = 0
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockImplementation(() => {
                  callCount++
                  if (callCount === 1) {
                    // EUR to USD
                    return Promise.resolve({ data: { rate: 1.1 }, error: null })
                  } else {
                    // GBP to USD
                    return Promise.resolve({ data: { rate: 1.3 }, error: null })
                  }
                })
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const properties = [
        { rent: 1000, currency: 'EUR' as SupportedCurrency },
        { rent: 1000, currency: 'GBP' as SupportedCurrency }
      ]

      const total = await aggregateRentsInCurrency(properties, 'USD')
      expect(total).toBe(2400) // 1000*1.1 + 1000*1.3
    })

    it('should handle empty properties array', async () => {
      const total = await aggregateRentsInCurrency([], 'USD')
      expect(total).toBe(0)
    })
  })

  describe('clearFXCache', () => {
    it('should clear the cache', async () => {
      const { supabase } = await import('@/lib/supabaseClient')

      const mockSingle = vi.fn().mockResolvedValue({ data: { rate: 1.2 }, error: null })

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: mockSingle
              }))
            }))
          }))
        }))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      // First call
      await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(mockSingle).toHaveBeenCalledTimes(1)

      // Clear cache
      clearFXCache()

      // Second call (should fetch again)
      await convertCurrency(100, 'EUR', 'USD', '2024-01-15')
      expect(mockSingle).toHaveBeenCalledTimes(2)
    })
  })
})
