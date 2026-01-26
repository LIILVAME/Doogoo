import { describe, it, expect } from 'vitest'
import {
  propertySchema,
  tenantSchema,
  paymentSchema,
  loginSchema,
  signupSchema,
  changePasswordSchema,
  validate
} from '@/utils/validators'

describe('Validators', () => {
  describe('propertySchema', () => {
    it('should validate a valid property', () => {
      const data = {
        name: 'Appartement T3',
        address: '123 Rue de la Paix',
        city: 'Paris',
        rent: 1200,
        status: 'occupied'
      }
      const result = validate(propertySchema, data)
      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
    })

    it('should reject property with invalid name', () => {
      const data = {
        name: 'A', // Too short
        city: 'Paris',
        rent: 1200,
        status: 'occupied'
      }
      const result = validate(propertySchema, data)
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })

    it('should reject property with negative rent', () => {
      const data = {
        name: 'Appartement T3',
        city: 'Paris',
        rent: -100,
        status: 'occupied'
      }
      const result = validate(propertySchema, data)
      expect(result.success).toBe(false)
    })

    it('should reject property with invalid status', () => {
      const data = {
        name: 'Appartement T3',
        city: 'Paris',
        rent: 1200,
        status: 'invalid'
      }
      const result = validate(propertySchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('tenantSchema', () => {
    it('should validate a valid tenant', () => {
      const data = {
        name: 'John Doe',
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        entryDate: '2024-01-01',
        rent: 1200,
        status: 'on_time',
        birthDate: '1990-01-01',
        birthPlace: 'Paris'
      }
      const result = validate(tenantSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject tenant with invalid UUID', () => {
      const data = {
        name: 'John Doe',
        propertyId: 'invalid-uuid',
        entryDate: '2024-01-01',
        rent: 1200
      }
      const result = validate(tenantSchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('paymentSchema', () => {
    it('should validate a valid payment', () => {
      const data = {
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 1200,
        dueDate: '2024-12-31',
        status: 'pending'
      }
      const result = validate(paymentSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject payment with zero amount', () => {
      const data = {
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 0,
        dueDate: '2024-12-31'
      }
      const result = validate(paymentSchema, data)
      expect(result.success).toBe(false)
    })

    it('should reject payment with invalid date format', () => {
      const data = {
        propertyId: '123e4567-e89b-12d3-a456-426614174000',
        amount: 1200,
        dueDate: '31/12/2024' // Wrong format
      }
      const result = validate(paymentSchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('should validate a valid login', () => {
      const data = {
        email: 'user@example.com',
        password: 'password123'
      }
      const result = validate(loginSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123'
      }
      const result = validate(loginSchema, data)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const data = {
        email: 'user@example.com',
        password: '12345' // Too short
      }
      const result = validate(loginSchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('should validate a valid signup', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password123',
        fullName: 'John Doe',
        phone: '+33612345678'
      }
      const result = validate(signupSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject weak password', () => {
      const data = {
        email: 'user@example.com',
        password: 'password', // No uppercase, no number
        fullName: 'John Doe'
      }
      const result = validate(signupSchema, data)
      expect(result.success).toBe(false)
    })
  })

  describe('changePasswordSchema', () => {
    it('should validate matching passwords', () => {
      const data = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123'
      }
      const result = validate(changePasswordSchema, data)
      expect(result.success).toBe(true)
    })

    it('should reject non-matching passwords', () => {
      const data = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'DifferentPassword123'
      }
      const result = validate(changePasswordSchema, data)
      expect(result.success).toBe(false)
    })
  })
})
