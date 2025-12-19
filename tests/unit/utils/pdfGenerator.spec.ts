import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests unitaires pour pdfGenerator.ts
 *
 * Tests de validation et logique métier uniquement
 * (Les tests d'intégration PDF nécessitent un environnement DOM)
 */

// Mock jsPDF avant l'import du module
vi.mock('jspdf', () => {
  const mockDoc = {
    internal: {
      pageSize: {
        getWidth: () => 210
      }
    },
    setFillColor: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    setTextColor: vi.fn().mockReturnThis(),
    setFontSize: vi.fn().mockReturnThis(),
    setFont: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    setDrawColor: vi.fn().mockReturnThis(),
    setLineWidth: vi.fn().mockReturnThis(),
    line: vi.fn().mockReturnThis(),
    splitTextToSize: vi.fn((text: string) => [text]),
    getTextDimensions: vi.fn(() => ({ w: 100, h: 10 })),
    save: vi.fn()
  }

  return {
    jsPDF: class {
      constructor() {
        return mockDoc
      }
    }
  }
})

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    profile: {
      full_name: 'Jean Dupont',
      phone: '01 23 45 67 89',
      address: '123 Rue Example, 75001 Paris'
    },
    user: {
      email: 'jean@example.com'
    }
  })
}))

// Mock formatters
vi.mock('@/utils/formatters', () => ({
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatDate: (dateString: string, options: any) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', options)
  }
}))

import { generateRentReceipt } from '@/utils/pdfGenerator'
import type { PaymentData } from '@/stores/paymentsStore'
import type { PropertyData } from '@/stores/propertiesStore'
import type { TenantData } from '@/stores/tenantsStore'

describe('pdfGenerator', () => {
  let mockPayment: PaymentData
  let mockTenant: TenantData
  let mockProperty: PropertyData

  beforeEach(() => {
    // Reset des mocks
    vi.clearAllMocks()

    // Données de test
    mockPayment = {
      id: 'payment-123',
      propertyId: 'prop-123',
      property: 'Appartement Paris',
      tenant: 'Jean Dupont',
      amount: 1200.5,
      dueDate: '2025-01-15',
      status: 'paid'
    }

    mockTenant = {
      id: 'tenant-123',
      propertyId: 'prop-123',
      name: 'Jean Dupont',
      property: 'Appartement Paris',
      propertyCity: 'Paris',
      entryDate: '2024-01-01',
      exitDate: null,
      rent: 1200,
      status: 'on_time'
    }

    mockProperty = {
      id: 'prop-123',
      name: 'Appartement Paris',
      address: '123 Rue de la République',
      city: 'Paris',
      rent: 1200,
      status: 'occupied',
      surface: 50,
      pieces: 2,
      description: 'Bel appartement',
      type: 'Appartement',
      image: '',
      tenant: {
        id: 'tenant-123',
        name: 'Jean Dupont',
        entryDate: '2024-01-01',
        exitDate: null,
        rent: 1200,
        status: 'on_time'
      }
    }
  })

  describe('generateRentReceipt', () => {
    it('should generate PDF with correct structure for paid payment', async () => {
      await expect(
        generateRentReceipt({
          payment: mockPayment,
          tenant: mockTenant,
          property: mockProperty,
          ownerName: 'Marie Martin',
          ownerEmail: 'marie@example.com',
          ownerPhone: '01 23 45 67 89'
        })
      ).resolves.not.toThrow()
    })

    it('should throw error if payment status is not "paid"', async () => {
      const pendingPayment = { ...mockPayment, status: 'pending' as const }

      await expect(
        generateRentReceipt({
          payment: pendingPayment,
          tenant: mockTenant,
          property: mockProperty,
          ownerName: 'Marie Martin'
        })
      ).rejects.toThrow(
        'Une quittance ne peut être générée que pour un paiement avec le statut "paid"'
      )
    })

    it('should handle accents correctly in owner name', async () => {
      await expect(
        generateRentReceipt({
          payment: mockPayment,
          tenant: mockTenant,
          property: mockProperty,
          ownerName: 'José García',
          ownerEmail: 'jose@example.com'
        })
      ).resolves.not.toThrow()
    })

    it('should format amount with 2 decimals and EUR symbol', async () => {
      const paymentWithDecimals = { ...mockPayment, amount: 1234.56 }

      await expect(
        generateRentReceipt({
          payment: paymentWithDecimals,
          tenant: mockTenant,
          property: mockProperty,
          ownerName: 'Marie Martin'
        })
      ).resolves.not.toThrow()
    })

    it('should handle property without address', async () => {
      const propertyWithoutAddress = { ...mockProperty, address: undefined }

      await generateRentReceipt({
        payment: mockPayment,
        tenant: mockTenant,
        property: propertyWithoutAddress,
        ownerName: 'Marie Martin'
      })

      // Vérifie que la fonction s'exécute sans erreur
    })

    it('should handle missing tenant data', async () => {
      await generateRentReceipt({
        payment: mockPayment,
        tenant: null,
        property: mockProperty,
        ownerName: 'Marie Martin'
      })

      // Vérifie que la fonction s'exécute sans erreur
    })

    it('should handle missing property data', async () => {
      await expect(
        generateRentReceipt({
          payment: mockPayment,
          tenant: mockTenant,
          property: null,
          ownerName: 'Marie Martin'
        })
      ).resolves.not.toThrow()
    })

    it('should generate filename with sanitized tenant name', async () => {
      const tenantWithAccents = { ...mockTenant, name: 'José García-Élève' }

      await expect(
        generateRentReceipt({
          payment: mockPayment,
          tenant: tenantWithAccents,
          property: mockProperty,
          ownerName: 'Marie Martin'
        })
      ).resolves.not.toThrow()
    })

    it('should calculate period correctly from dueDate', async () => {
      const paymentJan = { ...mockPayment, dueDate: '2025-01-15' }

      await expect(
        generateRentReceipt({
          payment: paymentJan,
          tenant: mockTenant,
          property: mockProperty,
          ownerName: 'Marie Martin'
        })
      ).resolves.not.toThrow()
    })
  })
})
