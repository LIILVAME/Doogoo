<template>
  <div class="space-y-6">
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">
        {{ $t('settings.sections.languageCurrency') }}
      </h3>

      <div class="space-y-6">
        <!-- Langue -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('settings.language') }}
          </label>
          <select
            :value="settingsStore.language"
            @change="handleLanguageChange"
            class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="fr">🇫🇷 {{ $t('language.fr') }}</option>
            <option value="en">🇺🇸 {{ $t('language.en') }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">{{ $t('settings.languageDescription') }}</p>
        </div>

        <!-- Devise -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t('settings.currency') }}
          </label>
          <select
            v-model="localCurrency"
            @change="handleCurrencyChange"
            class="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            <option value="EUR">{{ $t('currency.EUR') }}</option>
            <option value="USD">{{ $t('currency.USD') }}</option>
            <option value="GBP">{{ $t('currency.GBP') }}</option>
            <option value="XOF">{{ $t('currency.XOF') }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">{{ $t('settings.currencyDescription') }}</p>
        </div>

        <!-- Aperçu en direct -->
        <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm font-medium text-green-900 mb-2">{{ $t('settings.preview') }}</p>
          <p class="text-sm text-green-700">
            {{ $t('settings.previewExample') }}:
            <span class="font-semibold">{{ formatCurrency(1200) }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'

// Utilise $t dans le template, pas besoin de t dans le script
const settingsStore = useSettingsStore()

// Utilise directement la valeur du store avec une ref locale pour le v-model
const localCurrency = ref(settingsStore.currency || 'EUR')

// Synchronise avec le store au montage
onMounted(() => {
  localCurrency.value = settingsStore.currency || 'EUR'
})

// Watch pour synchroniser si le store change (mais ne devrait pas changer de l'extérieur)
watch(
  () => settingsStore.currency,
  newVal => {
    if (newVal && newVal !== localCurrency.value) {
      localCurrency.value = newVal
    }
  },
  { immediate: true }
)

const handleLanguageChange = async event => {
  const newLanguage = event.target.value
  if (newLanguage === settingsStore.language) return

  try {
    settingsStore.setLanguage(newLanguage)
    // setLanguage peut déclencher un reload, donc on attend un peu
    await nextTick()
  } catch (error) {
    console.error('Erreur lors du changement de langue:', error)
  }
}

const handleCurrencyChange = () => {
  if (localCurrency.value && localCurrency.value !== settingsStore.currency) {
    settingsStore.setCurrency(localCurrency.value)
  }
}
</script>
