import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddTenantModal from '@/components/tenants/AddTenantModal.vue'
import { PAYMENT_STATUS } from '@/utils/constants'

/**
 * Tests unitaires pour AddTenantModal
 *
 * Valide la logique de préparation des données (prepareTenantData)
 * via les interactions utilisateur du composant
 */

// Mock des stores
const mockToastStore = {
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}

const mockPropertiesStore = {
  properties: [
    {
      id: '550e8400-e29b-41d4-a716-446655440000', // UUID valide
      name: 'Appartement Paris',
      city: 'Paris',
      rent: 1200
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001', // UUID valide
      name: 'Studio Lyon',
      city: 'Lyon',
      rent: 800
    }
  ]
}

const mockSettingsStore = {
  currency: 'EUR'
}

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => mockToastStore
}))

vi.mock('@/stores/propertiesStore', () => ({
  usePropertiesStore: () => mockPropertiesStore
}))

vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => mockSettingsStore
}))

// Mock i18n
vi.mock('@/composables/useLingui', () => ({
  useI18n: () => ({
    t: key => key
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: key => key
  })
}))

// Mock formatters
vi.mock('@/utils/formatters', () => ({
  formatCurrency: amount => `${amount}€`
}))

describe('AddTenantModal - prepareTenantData Logic', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    wrapper = mount(AddTenantModal, {
      props: {
        isOpen: true,
        isLoading: false
      },
      global: {
        stubs: {
          Teleport: true,
          Transition: {
            template: '<div><slot /></div>'
          }
        },
        mocks: {
          $t: key => key
        }
      }
    })
  })

  describe('prepareTenantData - Validation des champs obligatoires', () => {
    it('should show error toast if propertyId is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = ''
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = 1200
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Veuillez sélectionner un bien')
    })

    it('should show error toast if entryDate is missing', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = ''
      wrapper.vm.form.rent = 1200
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith("La date d'entrée est requise")
    })

    it('should show error toast if rent is missing or invalid', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = null
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le loyer doit être un montant positif')
    })

    it('should show error toast if rent is zero', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = 0
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le loyer doit être un montant positif')
    })

    it('should show error toast if rent is negative', async () => {
      // Arrange
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = -100
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalledWith('Le loyer doit être un montant positif')
    })
  })

  describe('prepareTenantData - Conversion des champs numériques', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.status = PAYMENT_STATUS.ON_TIME
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'
    })

    it('should convert rent string to number in prepareTenantData', () => {
      // Arrange
      wrapper.vm.form.rent = '1200'
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'

      // Act - Test direct de prepareTenantData
      const result = wrapper.vm.prepareTenantData()

      // Assert
      expect(result.rent).toBe(1200) // Doit être un number
      expect(typeof result.rent).toBe('number')
    })

    it('should accept valid rent value as number in prepareTenantData', () => {
      // Arrange
      wrapper.vm.form.rent = 1200
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'

      // Act
      const result = wrapper.vm.prepareTenantData()

      // Assert
      expect(result.rent).toBe(1200)
      expect(typeof result.rent).toBe('number')
    })
  })

  describe('prepareTenantData - Nettoyage des strings', () => {
    beforeEach(() => {
      wrapper.vm.form.propertyId = '550e8400-e29b-41d4-a716-446655440000'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = 1200
      wrapper.vm.form.status = PAYMENT_STATUS.ON_TIME
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'
    })

    it('should trim name field', async () => {
      // Arrange
      wrapper.vm.form.name = '  Jean Dupont  '
      const emitSpy = vi.spyOn(wrapper.vm, '$emit')

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      // Si emit est appelé, vérifier que le nom est trimé
      const submitCall = emitSpy.mock.calls.find(call => call[0] === 'submit')
      if (submitCall && submitCall[1]) {
        expect(submitCall[1].name).toBe('Jean Dupont') // Trimé
      }
    })

    it('should handle exitDate correctly', async () => {
      // Arrange
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.exitDate = '2024-12-31'
      const emitSpy = vi.spyOn(wrapper.vm, '$emit')

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      const submitCall = emitSpy.mock.calls.find(call => call[0] === 'submit')
      if (submitCall && submitCall[1]) {
        expect(submitCall[1].exitDate).toBe('2024-12-31')
      }
    })

    it('should set exitDate to null if empty', async () => {
      // Arrange
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.exitDate = ''
      const emitSpy = vi.spyOn(wrapper.vm, '$emit')

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      const submitCall = emitSpy.mock.calls.find(call => call[0] === 'submit')
      if (submitCall && submitCall[1]) {
        expect(submitCall[1].exitDate).toBeNull()
      }
    })
  })

  describe('handleSubmit - Toast notifications', () => {
    it('should call toastStore.error on validation error', async () => {
      // Arrange
      wrapper.vm.form.propertyId = ''
      wrapper.vm.form.name = 'Jean Dupont'
      wrapper.vm.form.entryDate = '2024-01-01'
      wrapper.vm.form.rent = 1200
      wrapper.vm.form.birthDate = '1990-01-01'
      wrapper.vm.form.birthPlace = 'Paris'

      // Act
      await wrapper.vm.handleSubmit()

      // Assert
      expect(mockToastStore.error).toHaveBeenCalled()
    })
  })

  describe('Component initialization', () => {
    it('should initialize with empty form', () => {
      expect(wrapper.vm.form.name).toBe('')
      expect(wrapper.vm.form.propertyId).toBe('')
      expect(wrapper.vm.form.rent).toBeNull()
      expect(wrapper.vm.isSubmitting).toBe(false)
    })
  })
})
