import { describe, it, expect } from 'vitest'
import { normalizeApiError } from '@/utils/apiErrorHandler'

describe('normalizeApiError', () => {
  it('returns default message when error is unknown', () => {
    const result = normalizeApiError(null)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Erreur API inconnue')
    expect(result.error).toBeNull()
  })

  it('uses error.message when available', () => {
    const error = new Error('Custom error message')
    const result = normalizeApiError(error)

    expect(result.message).toBe('Custom error message')
    expect(result.error).toBe(error)
  })

  it('supports string errors', () => {
    const result = normalizeApiError('Plain string error')

    expect(result.message).toBe('Plain string error')
  })

  it('uses error_description when provided', () => {
    const result = normalizeApiError({ error_description: 'Detailed description' })

    expect(result.message).toBe('Detailed description')
  })

  it('maps known errors to friendly messages', () => {
    const result = normalizeApiError(new Error('Network request failed'))

    expect(result.message).toBe('Erreur réseau. Vérifiez votre connexion internet.')
  })

  it('preserves context in the normalized payload', () => {
    const result = normalizeApiError(new Error('Failure'), 'fetchData')

    expect(result.context).toBe('fetchData')
  })
})
