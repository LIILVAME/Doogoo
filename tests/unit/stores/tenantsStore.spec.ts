import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref, type Ref } from 'vue'
import { useTenantsStore } from '@/stores/tenantsStore'
import { PROPERTY_STATUS, PAYMENT_STATUS } from '@/utils/constants'
import type { PropertyData } from '@/stores/propertiesStore'

/**
 * Tests unitaires pour tenantsStore
 *
 * Ce store est particulier : il est dérivé de propertiesStore.
 * Il n'a pas de state propre mais calcule les locataires via des computed
 * basés sur propertiesStore.properties.
 *
 * IMPORTANT : Tous les tests mockent propertiesStore pour injecter
 * des données de test et vérifier que le store dérivé réagit correctement.
 */

// Mock du propertiesStore
const mockProperties: Ref<PropertyData[]> = ref([])
const mockUpdateProperty = vi.fn()

const mockFetchProperties = vi.fn()

const mockPropertiesStore = {
  get properties() {
    return mockProperties.value
  },
  updateProperty: mockUpdateProperty,
  fetchProperties: mockFetchProperties
}

// Mock du toastStore
const mockToastStore = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

// Mock de authStore
const mockAuthStore = {
  user: { id: 'user-1' }
}

// Mock des stores dépendants
vi.mock('@/stores/propertiesStore', () => ({
  usePropertiesStore: () => mockPropertiesStore
}))

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => mockToastStore
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore
}))

// Mock des APIs (factory function pour créer les mocks)
vi.mock('@/api', () => ({
  tenantsApi: {
    updateTenant: vi.fn(),
    createTenant: vi.fn()
  },
  documentsApi: {
    uploadDocument: vi.fn(),
    listDocuments: vi.fn(),
    getDocumentUrl: vi.fn(),
    deleteDocument: vi.fn()
  }
}))

// Références aux mocks pour utilisation dans les tests
let mockTenantsApi: {
  updateTenant: ReturnType<typeof vi.fn>
  createTenant: ReturnType<typeof vi.fn>
}

// Mock de l'environnement pour éviter les logs de debug dans les tests
vi.mock('import.meta', () => ({
  env: {
    DEV: false // Désactive les logs de debug dans les tests
  }
}))

describe('TenantsStore Unit Tests', () => {
  let store: ReturnType<typeof useTenantsStore>

  // Données de test mockées
  const createMockProperty = (
    id: string,
    name: string,
    city: string,
    rent: number,
    status: 'occupied' | 'vacant',
    tenant: {
      id: string
      name: string
      entryDate: string
      exitDate: string | null
      rent: number
      status: 'on_time' | 'late' | 'pending' | 'paid'
    } | null
  ): PropertyData => {
    return {
      id,
      name,
      address: `${name} Address`,
      city,
      rent,
      status,
      tenant,
      surface: 50,
      pieces: 2,
      description: '',
      type: 'apartment',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    }
  }

  const mockPropertyWithOnTimeTenant = createMockProperty(
    'prop-1',
    'Appartement Paris',
    'Paris',
    1000,
    PROPERTY_STATUS.OCCUPIED,
    {
      id: 'tenant-1',
      name: 'Jean Dupont',
      entryDate: '2024-01-01',
      exitDate: null,
      rent: 1000,
      status: PAYMENT_STATUS.ON_TIME
    }
  )

  const mockPropertyWithLateTenant = createMockProperty(
    'prop-2',
    'Studio Lyon',
    'Lyon',
    800,
    PROPERTY_STATUS.OCCUPIED,
    {
      id: 'tenant-2',
      name: 'Marie Martin',
      entryDate: '2024-02-01',
      exitDate: null,
      rent: 800,
      status: PAYMENT_STATUS.LATE
    }
  )

  const mockPropertyVacant = createMockProperty(
    'prop-3',
    'Maison Marseille',
    'Marseille',
    1500,
    PROPERTY_STATUS.VACANT,
    null
  )

  beforeEach(async () => {
    // Réinitialise Pinia pour chaque test
    setActivePinia(createPinia())

    // Importe les mocks depuis le module mocké
    const { tenantsApi } = await import('@/api')
    mockTenantsApi = tenantsApi as {
      updateTenant: ReturnType<typeof vi.fn>
      createTenant: ReturnType<typeof vi.fn>
    }

    store = useTenantsStore()

    // Réinitialise tous les mocks
    vi.clearAllMocks()

    // Reset des données mockées
    mockProperties.value = []
  })

  afterEach(() => {
    // Nettoyage après chaque test
    vi.clearAllMocks()
  })

  describe('Initialisation', () => {
    it('should initialize with empty tenants when properties are empty', () => {
      expect(store.tenants).toEqual([])
      expect(store.onTimeTenants).toEqual([])
      expect(store.lateTenants).toEqual([])
      expect(store.totalTenantsRent).toBe(0)
    })
  })

  describe('Computed: tenants', () => {
    it('should extract tenants from occupied properties only', () => {
      // Arrange
      mockProperties.value = [
        mockPropertyWithOnTimeTenant,
        mockPropertyWithLateTenant,
        mockPropertyVacant // Cette propriété ne doit pas apparaître dans les locataires
      ]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants).toHaveLength(2)
      expect(tenants.find(t => t.id === 'tenant-1')).toBeDefined()
      expect(tenants.find(t => t.id === 'tenant-2')).toBeDefined()
      expect(tenants.find(t => t.propertyId === 'prop-3')).toBeUndefined()
    })

    it('should transform property data to tenant data correctly', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants[0]).toMatchObject({
        id: 'tenant-1',
        propertyId: 'prop-1',
        name: 'Jean Dupont',
        property: 'Appartement Paris',
        propertyCity: 'Paris',
        entryDate: '2024-01-01',
        exitDate: null,
        rent: 1000,
        status: PAYMENT_STATUS.ON_TIME
      })
    })

    it('should use property.id as fallback if tenant.id is missing', () => {
      // Arrange
      const propertyWithoutTenantId = createMockProperty(
        'prop-fallback',
        'Test Property',
        'Paris',
        900,
        PROPERTY_STATUS.OCCUPIED,
        {
          id: '', // ID vide, doit utiliser property.id
          name: 'Tenant Without ID',
          entryDate: '2024-01-01',
          exitDate: null,
          rent: 900,
          status: PAYMENT_STATUS.ON_TIME
        }
      )
      mockProperties.value = [propertyWithoutTenantId]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants[0].id).toBe('prop-fallback') // Utilise property.id comme fallback
    })

    it('should filter out properties with null tenant even if status is occupied', () => {
      // Arrange
      const propertyWithNullTenant = createMockProperty(
        'prop-null',
        'Property Null Tenant',
        'Paris',
        700,
        PROPERTY_STATUS.OCCUPIED,
        null // Tenant null malgré status OCCUPIED
      )
      mockProperties.value = [mockPropertyWithOnTimeTenant, propertyWithNullTenant]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants).toHaveLength(1)
      expect(tenants[0].id).toBe('tenant-1')
    })

    it('should return empty array when no occupied properties with tenants', () => {
      // Arrange
      mockProperties.value = [mockPropertyVacant]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants).toEqual([])
    })

    it('should reactively update when properties change', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant]

      // Act - Initial state
      expect(store.tenants).toHaveLength(1)

      // Act - Add a new property with tenant
      mockProperties.value = [mockPropertyWithOnTimeTenant, mockPropertyWithLateTenant]

      // Assert - Should reactively update
      expect(store.tenants).toHaveLength(2)
    })
  })

  describe('Computed: onTimeTenants', () => {
    it('should filter tenants with on_time status', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant, mockPropertyWithLateTenant]

      // Act
      const onTimeTenants = store.onTimeTenants

      // Assert
      expect(onTimeTenants).toHaveLength(1)
      expect(onTimeTenants[0].status).toBe(PAYMENT_STATUS.ON_TIME)
      expect(onTimeTenants[0].id).toBe('tenant-1')
    })

    it('should return empty array when no on_time tenants', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithLateTenant]

      // Act
      const onTimeTenants = store.onTimeTenants

      // Assert
      expect(onTimeTenants).toEqual([])
    })
  })

  describe('Computed: lateTenants', () => {
    it('should filter tenants with late status', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant, mockPropertyWithLateTenant]

      // Act
      const lateTenants = store.lateTenants

      // Assert
      expect(lateTenants).toHaveLength(1)
      expect(lateTenants[0].status).toBe(PAYMENT_STATUS.LATE)
      expect(lateTenants[0].id).toBe('tenant-2')
    })

    it('should return empty array when no late tenants', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant]

      // Act
      const lateTenants = store.lateTenants

      // Assert
      expect(lateTenants).toEqual([])
    })
  })

  describe('Computed: totalTenantsRent', () => {
    it('should sum all tenant rents correctly', () => {
      // Arrange
      mockProperties.value = [
        mockPropertyWithOnTimeTenant, // rent: 1000
        mockPropertyWithLateTenant // rent: 800
      ]

      // Act
      const totalRent = store.totalTenantsRent

      // Assert
      expect(totalRent).toBe(1800)
    })

    it('should return 0 when no tenants', () => {
      // Arrange
      mockProperties.value = [mockPropertyVacant]

      // Act
      const totalRent = store.totalTenantsRent

      // Assert
      expect(totalRent).toBe(0)
    })

    it('should handle tenants with rent = 0', () => {
      // Arrange
      const propertyWithZeroRent = createMockProperty(
        'prop-zero',
        'Property Zero',
        'Paris',
        0,
        PROPERTY_STATUS.OCCUPIED,
        {
          id: 'tenant-zero',
          name: 'Tenant Zero',
          entryDate: '2024-01-01',
          exitDate: null,
          rent: 0,
          status: PAYMENT_STATUS.ON_TIME
        }
      )
      mockProperties.value = [
        mockPropertyWithOnTimeTenant, // rent: 1000
        propertyWithZeroRent // rent: 0
      ]

      // Act
      const totalRent = store.totalTenantsRent

      // Assert
      expect(totalRent).toBe(1000)
    })
  })

  describe('Action: addTenant', () => {
    beforeEach(() => {
      // Setup: Add properties for addTenant tests
      mockProperties.value = [mockPropertyVacant]
    })

    it('should call tenantsApi.createTenant and update property status when propertyId is provided', async () => {
      // Arrange
      const newTenantData = {
        propertyId: 'prop-3',
        name: 'Nouveau Locataire',
        entryDate: '2024-12-01',
        exitDate: null,
        rent: 1500,
        status: PAYMENT_STATUS.ON_TIME as const
      }
      mockTenantsApi.createTenant.mockResolvedValue({
        success: true,
        data: {
          id: 'new-tenant-id',
          property_id: 'prop-3',
          name: 'Nouveau Locataire',
          entry_date: '2024-12-01',
          exit_date: null,
          rent: 1500,
          status: PAYMENT_STATUS.ON_TIME
        }
      })
      mockUpdateProperty.mockResolvedValue(undefined)
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.addTenant(newTenantData)

      // Assert
      expect(mockTenantsApi.createTenant).toHaveBeenCalledWith(
        {
          propertyId: 'prop-3',
          name: 'Nouveau Locataire',
          entryDate: '2024-12-01',
          exitDate: null,
          rent: 1500,
          status: PAYMENT_STATUS.ON_TIME
        },
        'user-1'
      )
      expect(mockUpdateProperty).toHaveBeenCalledWith('prop-3', {
        status: PROPERTY_STATUS.OCCUPIED
      })
      expect(mockFetchProperties).toHaveBeenCalledWith(true)
      expect(mockToastStore.success).toHaveBeenCalledWith(
        'Locataire "Nouveau Locataire" ajouté avec succès'
      )
    })

    it('should find property by name when propertyId is not provided', async () => {
      // Arrange
      const newTenantData = {
        property: 'Maison Marseille', // Utilise le nom au lieu de l'ID
        name: 'Nouveau Locataire',
        entryDate: '2024-12-01',
        rent: 1500
      }
      mockTenantsApi.createTenant.mockResolvedValue({
        success: true,
        data: {
          id: 'new-tenant-id',
          property_id: 'prop-3',
          name: 'Nouveau Locataire',
          entry_date: '2024-12-01',
          rent: 1500,
          status: PAYMENT_STATUS.ON_TIME
        }
      })
      mockUpdateProperty.mockResolvedValue(undefined)
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.addTenant(newTenantData)

      // Assert
      expect(mockTenantsApi.createTenant).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyId: 'prop-3',
          name: 'Nouveau Locataire',
          entryDate: '2024-12-01',
          rent: 1500,
          status: PAYMENT_STATUS.ON_TIME // Status par défaut
        }),
        'user-1'
      )
    })

    it('should convert rent to number when provided as string', async () => {
      // Arrange
      const newTenantData = {
        propertyId: 'prop-3',
        name: 'Locataire Test',
        entryDate: '2024-12-01',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rent: '1200' as any, // String au lieu de number (test de conversion)
        status: PAYMENT_STATUS.ON_TIME as const
      }
      mockTenantsApi.createTenant.mockResolvedValue({
        success: true,
        data: { id: 'new-tenant-id', property_id: 'prop-3', rent: 1200 }
      })
      mockUpdateProperty.mockResolvedValue(undefined)
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.addTenant(newTenantData)

      // Assert
      expect(mockTenantsApi.createTenant).toHaveBeenCalledWith(
        expect.objectContaining({
          rent: 1200 // Doit être converti en number
        }),
        'user-1'
      )
    })

    it('should return null and show error toast when property is not found', async () => {
      // Arrange
      const newTenantData = {
        propertyId: 'non-existent-id',
        name: 'Locataire Test',
        entryDate: '2024-12-01',
        rent: 1000
      }

      // Act
      const result = await store.addTenant(newTenantData)

      // Assert
      expect(result).toBe(null)
      expect(mockTenantsApi.createTenant).not.toHaveBeenCalled()
      expect(mockUpdateProperty).not.toHaveBeenCalled()
      expect(mockToastStore.error).toHaveBeenCalledWith('Bien non trouvé pour le locataire')
      expect(mockToastStore.success).not.toHaveBeenCalled()
    })

    it('should throw error when createTenant API fails', async () => {
      // Arrange
      const newTenantData = {
        propertyId: 'prop-3',
        name: 'Locataire Test',
        entryDate: '2024-12-01',
        rent: 1000
      }
      const errorMessage = 'Erreur de création'
      mockTenantsApi.createTenant.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(store.addTenant(newTenantData)).rejects.toThrow(errorMessage)
      expect(mockToastStore.error).toHaveBeenCalledWith(
        `Erreur lors de l'ajout du locataire : ${errorMessage}`
      )
    })
  })

  describe('Action: updateTenant', () => {
    beforeEach(() => {
      // Setup: Add properties with tenants for updateTenant tests
      mockProperties.value = [mockPropertyWithOnTimeTenant]
    })

    it('should call tenantsApi.updateTenant with correct data and refresh properties', async () => {
      // Arrange
      const updates = {
        name: 'Jean Dupont Modifié',
        rent: 1100,
        status: PAYMENT_STATUS.LATE as const
      }
      mockTenantsApi.updateTenant.mockResolvedValue({
        success: true,
        data: {
          id: 'tenant-1',
          name: 'Jean Dupont Modifié',
          entry_date: '2024-01-01',
          exit_date: null,
          rent: 1100,
          status: PAYMENT_STATUS.LATE
        }
      })
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.updateTenant('tenant-1', updates)

      // Assert
      expect(mockTenantsApi.updateTenant).toHaveBeenCalledWith(
        'tenant-1',
        {
          name: 'Jean Dupont Modifié',
          entry_date: undefined, // Pas dans les updates
          exit_date: undefined, // Pas dans les updates
          rent: 1100, // Converti en number
          status: PAYMENT_STATUS.LATE
        },
        'user-1'
      )
      expect(mockFetchProperties).toHaveBeenCalledWith(true)
      expect(mockToastStore.success).toHaveBeenCalledWith('Locataire mis à jour avec succès')
    })

    it('should convert rent to number when provided as string', async () => {
      // Arrange
      const updates = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rent: '1200' as any // String (test de conversion)
      }
      mockTenantsApi.updateTenant.mockResolvedValue({
        success: true,
        data: { id: 'tenant-1', rent: 1200 }
      })
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.updateTenant('tenant-1', updates)

      // Assert
      expect(mockTenantsApi.updateTenant).toHaveBeenCalledWith(
        'tenant-1',
        expect.objectContaining({
          rent: 1200 // Doit être converti en number
        }),
        'user-1'
      )
    })

    it('should not include rent in API call if rent is not in updates', async () => {
      // Arrange
      const updates = {
        name: 'Nouveau Nom'
        // Pas de rent dans les updates
      }
      mockTenantsApi.updateTenant.mockResolvedValue({
        success: true,
        data: { id: 'tenant-1', name: 'Nouveau Nom' }
      })
      mockFetchProperties.mockResolvedValue(undefined)

      // Act
      await store.updateTenant('tenant-1', updates)

      // Assert
      expect(mockTenantsApi.updateTenant).toHaveBeenCalledWith(
        'tenant-1',
        {
          name: 'Nouveau Nom'
          // rent ne doit pas être présent
        },
        'user-1'
      )
    })

    it('should handle API error when tenant is not found', async () => {
      // Arrange
      const updates = { name: 'Nouveau Nom' }
      mockTenantsApi.updateTenant.mockResolvedValue({
        success: false,
        error: { message: 'Tenant not found' },
        message: 'Tenant not found'
      })

      // Act & Assert
      await expect(store.updateTenant('non-existent-tenant-id', updates)).rejects.toThrow(
        'Tenant not found'
      )
      expect(mockTenantsApi.updateTenant).toHaveBeenCalled()
      expect(mockFetchProperties).not.toHaveBeenCalled()
      expect(mockToastStore.success).not.toHaveBeenCalled()
      expect(mockToastStore.error).toHaveBeenCalledWith('Tenant not found')
    })

    it('should throw error when updateTenant API fails', async () => {
      // Arrange
      const updates = { name: 'Nouveau Nom' }
      const errorMessage = 'Erreur de mise à jour'
      mockTenantsApi.updateTenant.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(store.updateTenant('tenant-1', updates)).rejects.toThrow(errorMessage)
      expect(mockToastStore.error).toHaveBeenCalledWith(
        `Erreur lors de la mise à jour : ${errorMessage}`
      )
    })
  })

  describe('Action: removeTenant', () => {
    beforeEach(() => {
      // Setup: Add properties with tenants for removeTenant tests
      mockProperties.value = [mockPropertyWithOnTimeTenant]
    })

    it('should call propertiesStore.updateProperty to set property as vacant and remove tenant', async () => {
      // Arrange
      mockUpdateProperty.mockResolvedValue(undefined)

      // Act
      await store.removeTenant('tenant-1')

      // Assert
      expect(mockUpdateProperty).toHaveBeenCalledWith('prop-1', {
        status: PROPERTY_STATUS.VACANT,
        tenant: null
      })
      expect(mockToastStore.success).toHaveBeenCalledWith('Locataire supprimé avec succès')
    })

    it('should not call updateProperty if tenant is not found', async () => {
      // Act
      await store.removeTenant('non-existent-tenant-id')

      // Assert
      expect(mockUpdateProperty).not.toHaveBeenCalled()
      expect(mockToastStore.success).not.toHaveBeenCalled()
    })

    it('should throw error when updateProperty fails', async () => {
      // Arrange
      const errorMessage = 'Erreur de suppression'
      mockUpdateProperty.mockRejectedValue(new Error(errorMessage))

      // Act & Assert
      await expect(store.removeTenant('tenant-1')).rejects.toThrow(errorMessage)
      expect(mockToastStore.error).toHaveBeenCalledWith(
        `Erreur lors de la suppression : ${errorMessage}`
      )
    })
  })

  describe('Action: reset', () => {
    it('should do nothing (no-op) since store is derived', () => {
      // Arrange
      mockProperties.value = [mockPropertyWithOnTimeTenant]

      // Act
      store.reset()

      // Assert
      // Reset ne fait rien car le store est dérivé
      // Les tenants sont toujours calculés depuis propertiesStore.properties
      expect(store.tenants).toHaveLength(1)
    })
  })

  describe('Edge Cases & Error Handling', () => {
    it('should handle empty properties array gracefully', () => {
      // Arrange
      mockProperties.value = []

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants).toEqual([])
      expect(store.onTimeTenants).toEqual([])
      expect(store.lateTenants).toEqual([])
      expect(store.totalTenantsRent).toBe(0)
    })

    it('should handle properties with undefined tenant gracefully', () => {
      // Arrange
      const propertyWithUndefinedTenant = {
        ...mockPropertyVacant,
        status: PROPERTY_STATUS.OCCUPIED as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tenant: undefined as any
      }
      mockProperties.value = [propertyWithUndefinedTenant]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants).toEqual([]) // Devrait filtrer les undefined
    })

    it('should handle exitDate correctly (null or string)', () => {
      // Arrange
      const propertyWithExitDate = createMockProperty(
        'prop-exit',
        'Property Exit',
        'Paris',
        900,
        PROPERTY_STATUS.OCCUPIED,
        {
          id: 'tenant-exit',
          name: 'Tenant Exit',
          entryDate: '2024-01-01',
          exitDate: '2024-12-31', // Date de sortie
          rent: 900,
          status: PAYMENT_STATUS.ON_TIME
        }
      )
      mockProperties.value = [propertyWithExitDate]

      // Act
      const tenants = store.tenants

      // Assert
      expect(tenants[0].exitDate).toBe('2024-12-31')
    })
  })
})
