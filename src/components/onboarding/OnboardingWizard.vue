<template>
  <div class="max-w-md w-full">
    <!-- Stepper Progress -->
    <div class="flex justify-center mb-8">
      <div v-for="i in 3" :key="i" class="mx-1">
        <div 
          :class="currentStep >= i ? 'bg-primary-500' : 'bg-zinc-700'"
          class="w-12 h-1 rounded-full transition-colors duration-300"
        />
      </div>
    </div>

    <!-- Étape 1 : Ajouter Bien -->
    <div v-if="currentStep === 1" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-2">Ajoutez votre premier bien</h2>
        <p class="text-zinc-400">Pour commencer, renseignez simplement le nom et le loyer.</p>
      </div>
      
      <form @submit.prevent="handleStep1Continue" class="space-y-4">
        <div>
          <label for="property-name" class="block text-sm font-medium text-zinc-300 mb-2">
            Nom du bien <span class="text-danger-400">*</span>
          </label>
          <input
            id="property-name"
            v-model="formData.propertyName"
            type="text"
            :class="[
              'w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 transition-colors focus:outline-none',
              errors.propertyName ? 'border-danger-500' : 'border-zinc-700 focus:border-primary-500'
            ]"
            placeholder="Ex: Appartement Paris 15e"
            autofocus
          />
          <p v-if="errors.propertyName" class="mt-1 text-sm text-danger-400">{{ errors.propertyName }}</p>
        </div>
        
        <div>
          <label for="property-rent" class="block text-sm font-medium text-zinc-300 mb-2">
            {{ $t('properties.monthlyRent') }} ({{ CURRENCY_SYMBOLS[settingsStore.currency] || '€' }}) <span class="text-danger-400">*</span>
          </label>
          <input
            id="property-rent"
            v-model="formData.propertyRent"
            type="number"
            step="0.01"
            min="0"
            :class="[
              'w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 transition-colors focus:outline-none',
              errors.propertyRent ? 'border-danger-500' : 'border-zinc-700 focus:border-primary-500'
            ]"
            placeholder="1200"
          />
          <p v-if="errors.propertyRent" class="mt-1 text-sm text-danger-400">{{ errors.propertyRent }}</p>
          <p v-else class="mt-1 text-xs text-zinc-500">Montant hors charges</p>
        </div>

        <p v-if="errors.general" class="p-4 bg-danger-500/10 border border-danger-500 rounded-xl text-danger-400 text-sm">
          {{ errors.general }}
        </p>
        
        <div class="flex gap-3">
          <Button variant="primary" type="submit" :loading="loading" full-width>
            Continuer
          </Button>
          <Button variant="ghost" @click="handleSkip" :disabled="loading">
            Passer
          </Button>
        </div>
      </form>
    </div>

    <!-- Étape 2 : Locataire -->
    <div v-if="currentStep === 2" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-2">Ce bien est-il occupé ?</h2>
        <p class="text-zinc-400">Ajoutez un locataire si le bien est déjà loué.</p>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <button
          type="button"
          @click="formData.hasTenant = false"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200',
            formData.hasTenant === false
              ? 'border-primary-500 bg-primary-500/10 text-white shadow-lg shadow-primary-500/20' 
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/50'
          ]"
        >
          <div class="text-4xl mb-2">🏠</div>
          <div class="font-medium text-sm">Bien libre</div>
        </button>
        
        <button
          type="button"
          @click="formData.hasTenant = true"
          :class="[
            'p-4 rounded-xl border-2 transition-all duration-200',
            formData.hasTenant === true
              ? 'border-primary-500 bg-primary-500/10 text-white shadow-lg shadow-primary-500/20' 
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900/50'
          ]"
        >
          <div class="text-4xl mb-2">👤</div>
          <div class="font-medium text-sm">J'ai un locataire</div>
        </button>
      </div>

      <transition name="slide-fade">
        <form v-if="formData.hasTenant === true" @submit.prevent="handleStep2Continue" class="space-y-4">
          <div>
            <label for="tenant-name" class="block text-sm font-medium text-zinc-300 mb-2">
              Nom du locataire
            </label>
            <input
              id="tenant-name"
              v-model="formData.tenantName"
              type="text"
              :class="[
                'w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 transition-colors focus:outline-none',
                errors.tenantName ? 'border-danger-500' : 'border-zinc-700 focus:border-primary-500'
              ]"
              placeholder="Ex: Jean Dupont"
            />
            <p v-if="errors.tenantName" class="mt-1 text-sm text-danger-400">{{ errors.tenantName }}</p>
          </div>
          
          <div>
            <label for="tenant-start-date" class="block text-sm font-medium text-zinc-300 mb-2">
              Date d'entrée
            </label>
            <input
              id="tenant-start-date"
              v-model="formData.tenantStartDate"
              type="date"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 transition-colors focus:outline-none focus:border-primary-500"
            />
            <p class="mt-1 text-xs text-zinc-500">Optionnel</p>
          </div>
        </form>
      </transition>
      
      <div class="flex gap-3">
        <Button variant="primary" @click="handleStep2Continue" :loading="loading" full-width>
          Continuer
        </Button>
        <Button variant="ghost" @click="handleSkip" :disabled="loading">
          Passer
        </Button>
      </div>
    </div>

    <!-- Étape 3 : Confirmation -->
    <div v-if="currentStep === 3" class="text-center space-y-6">
      <div class="w-16 h-16 bg-success-500/10 rounded-full flex items-center justify-center mx-auto animate-bounce-once">
        <svg class="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Votre dashboard est prêt ! 🎉</h2>
        <p class="text-zinc-400">Vous avez configuré votre premier bien. Accédez au tableau de bord pour suivre vos revenus.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
        <p class="text-white font-medium text-lg">{{ formData.propertyName }}</p>
        <p class="text-zinc-400 mt-1">Loyer : {{ formattedRent }}</p>
        <p v-if="formData.hasTenant && formData.tenantName" class="text-zinc-400 mt-1">
          Locataire : {{ formData.tenantName }}
        </p>
      </div>
      
      <Button variant="primary" @click="goToDashboard" full-width>
        Accéder au dashboard →
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { PROPERTY_STATUS, PAYMENT_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'
import { useTenantsStore } from '@/stores/tenantsStore'
import { useToastStore } from '@/stores/toastStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const tenantsStore = useTenantsStore()
const toastStore = useToastStore()

// État du wizard
const currentStep = ref(1)
const loading = ref(false)
const errors = ref({})

// Données du formulaire
const formData = ref({
  propertyName: '',
  propertyRent: '',
  hasTenant: null,
  tenantName: '',
  tenantStartDate: '',
  createdPropertyId: null
})

// Formatted rent pour affichage
const formattedRent = computed(() => {
  const rent = parseFloat(formData.value.propertyRent)
  return isNaN(rent) ? `${formatCurrency(0)} /mois` : `${formatCurrency(rent)} /mois`
})

/**
 * Validation Étape 1
 */
const validateStep1 = () => {
  errors.value = {}
  
  if (!formData.value.propertyName.trim()) {
    errors.value.propertyName = 'Le nom du bien est obligatoire'
    return false
  }
  
  const rent = parseFloat(formData.value.propertyRent)
  if (isNaN(rent) || rent <= 0) {
    errors.value.propertyRent = 'Le loyer doit être un nombre positif'
    return false
  }
  
  return true
}

/**
 * Validation Étape 2
 */
const validateStep2 = () => {
  errors.value = {}
  
  if (formData.value.hasTenant === true && !formData.value.tenantName.trim()) {
    errors.value.tenantName = 'Le nom du locataire est obligatoire'
    return false
  }
  
  return true
}

/**
 * Étape 1 → Créer Bien
 */
const handleStep1Continue = async () => {
  if (!validateStep1()) return
  
  loading.value = true
  errors.value = {}
  
  try {
    const property = await propertiesStore.createProperty({
      name: formData.value.propertyName,
      rent: parseFloat(formData.value.propertyRent),
      user_id: authStore.user.id
    })
    
    if (!property) {
      throw new Error('Échec création bien')
    }
    
    formData.value.createdPropertyId = property.id
    
    // Analytics
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      import('@/utils/analytics').then(({ trackDoogooEvent }) => {
        trackDoogooEvent('onboarding_step1_completed', {
          property_name: formData.value.propertyName,
          rent: formData.value.propertyRent
        })
      }).catch(() => {})
    }
    
    currentStep.value = 2
    toastStore.success('Bien créé avec succès !')
  } catch (error) {
    console.error('Erreur création bien:', error)
    toastStore.error('Échec création du bien. Vérifiez votre connexion.')
    errors.value.general = error.message
  } finally {
    loading.value = false
  }
}

/**
 * Étape 2 → Créer Locataire (si applicable)
 */
const handleStep2Continue = async () => {
  if (!validateStep2()) return
  
  loading.value = true
  errors.value = {}
  
  try {
    if (formData.value.hasTenant === true && formData.value.tenantName.trim()) {
      await tenantsStore.createTenant({
        name: formData.value.tenantName,
        property_id: formData.value.createdPropertyId,
        start_date: formData.value.tenantStartDate || new Date().toISOString().split('T')[0],
        user_id: authStore.user.id
      })
      
      // Analytics
      if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
        import('@/utils/analytics').then(({ trackDoogooEvent }) => {
          trackDoogooEvent('onboarding_step2_completed', {
            has_tenant: true,
            tenant_name: formData.value.tenantName
          })
        }).catch(() => {})
      }
    }
    
    currentStep.value = 3
    
    // Analytics onboarding completed
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      import('@/utils/analytics').then(({ trackDoogooEvent }) => {
        trackDoogooEvent('onboarding_completed', {
          property_id: formData.value.createdPropertyId,
          has_tenant: formData.value.hasTenant
        })
      }).catch(() => {})
    }
  } catch (error) {
    console.error('Erreur création locataire:', error)
    toastStore.error('Échec création du locataire. Vous pourrez l\'ajouter plus tard.')
    errors.value.general = error.message
  } finally {
    loading.value = false
  }
}

/**
 * Redirection Dashboard
 */
const goToDashboard = () => {
  router.push('/dashboard')
}

/**
 * Skip Wizard
 */
const handleSkip = () => {
  // Analytics
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    import('@/utils/analytics').then(({ trackDoogooEvent }) => {
      trackDoogooEvent('onboarding_skipped', {
        current_step: currentStep.value
      })
    }).catch(() => {})
  }
  
  router.push('/dashboard')
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-in-out;
}
</style>
