<template>
  <SettingsSection :title="$t('settings.appPreferences')">
    <form @submit.prevent="savePreferences" class="space-y-6">
      <!-- Thème -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('settings.theme') }}
        </label>
        <select
          v-model="localPreferences.theme"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="light">{{ $t('settings.light') }}</option>
          <option value="dark">{{ $t('settings.dark') }}</option>
          <option value="auto">{{ $t('settings.auto') }}</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Choisissez le thème d'affichage de l'application</p>
      </div>

      <!-- Devise -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('settings.currency') }}
        </label>
        <select
          v-model="localPreferences.currency"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="EUR">{{ $t('currency.EUR') }}</option>
          <option value="USD">{{ $t('currency.USD') }}</option>
          <option value="GBP">{{ $t('currency.GBP') }}</option>
          <option value="XOF">{{ $t('currency.XOF') }}</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">Les montants seront affichés dans cette devise</p>
      </div>

      <!-- Langue -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('settings.language') }}
        </label>
        <select
          v-model="localPreferences.language"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        >
          <option value="fr">{{ $t('language.fr') }}</option>
          <option value="en">{{ $t('language.en') }}</option>
        </select>
        <p class="text-xs text-gray-500 mt-1">{{ $t('settings.languageDescription') }}</p>
      </div>

      <!-- Seuil d'alerte -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('settings.alertThreshold') }}
        </label>
        <input
          v-model.number="localPreferences.alertThreshold"
          type="number"
          min="0"
          max="30"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="5"
        />
        <p class="text-xs text-gray-500 mt-1">{{ $t('settings.alertThresholdDescription') }}</p>
      </div>

      <!-- Notifications -->
      <div class="border-t border-gray-100 pt-4">
        <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ $t('settings.notifications') }}</h3>
        
        <div class="space-y-3">
          <label class="flex items-center cursor-pointer group">
            <input
              v-model="localPreferences.notifications.email"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{{ $t('settings.emailNotifications') }}</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="localPreferences.notifications.payments"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{{ $t('settings.paymentAlerts') }}</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="localPreferences.notifications.reminders"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{{ $t('settings.paymentReminders') }}</span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              v-model="localPreferences.notifications.maintenance"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{{ $t('settings.maintenanceNotifications') }}</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSaving"
          class="btn-primary flex items-center"
        >
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? $t('settings.saving') : $t('settings.savePreferences') }}
        </button>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import SettingsSection from './SettingsSection.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isSaving = ref(false)

// Préférences locales (copie du store pour éviter les mutations directes)
const localPreferences = ref({
  theme: settingsStore.theme,
  currency: settingsStore.currency,
  language: settingsStore.language,
  alertThreshold: settingsStore.alertThreshold,
  notifications: { ...settingsStore.notifications }
})

// Synchronise avec le store quand il change
watch(() => settingsStore.theme, (newVal) => {
  localPreferences.value.theme = newVal
})
watch(() => settingsStore.currency, (newVal) => {
  localPreferences.value.currency = newVal
})
watch(() => settingsStore.language, (newVal) => {
  localPreferences.value.language = newVal
})
watch(() => settingsStore.alertThreshold, (newVal) => {
  localPreferences.value.alertThreshold = newVal
})
watch(() => settingsStore.notifications, (newVal) => {
  localPreferences.value.notifications = { ...newVal }
}, { deep: true })

// Recharge les préférences depuis le store au montage
onMounted(() => {
  localPreferences.value = {
    theme: settingsStore.theme,
    currency: settingsStore.currency,
    language: settingsStore.language,
    alertThreshold: settingsStore.alertThreshold,
    notifications: { ...settingsStore.notifications }
  }
})

/**
 * Sauvegarde les préférences dans le store ET dans Supabase
 */
const savePreferences = async () => {
  isSaving.value = true
  
  try {
    // Sauvegarde dans le store (qui persiste automatiquement dans localStorage)
    settingsStore.setTheme(localPreferences.value.theme)
    settingsStore.setCurrency(localPreferences.value.currency)
    
    // La langue est gérée séparément car elle nécessite un rechargement
    if (localPreferences.value.language !== settingsStore.language) {
      settingsStore.setLanguage(localPreferences.value.language)
      // Le setLanguage() fait déjà le rechargement, donc pas besoin de continuer
      return
    }
    
    settingsStore.setAlertThreshold(localPreferences.value.alertThreshold)
    settingsStore.setNotifications(localPreferences.value.notifications)
    
    // Sauvegarde également dans Supabase si l'utilisateur est connecté
    if (authStore.isAuthenticated && authStore.user) {
      try {
        const preferencesToSave = {
          theme: localPreferences.value.theme,
          currency: localPreferences.value.currency,
          language: localPreferences.value.language,
          alertThreshold: localPreferences.value.alertThreshold,
          notifications: localPreferences.value.notifications
        }
        
        await authStore.updatePreferences(preferencesToSave)
        
        if (import.meta.env.DEV) {
          console.debug('✅ Préférences sauvegardées dans Supabase')
        }
      } catch (supabaseError) {
        // Erreur non bloquante - les préférences sont déjà dans localStorage
        console.warn('Erreur lors de la sauvegarde Supabase (non bloquant):', supabaseError)
      }
    }
    
    // Toast de confirmation
    if (toastStore) {
      toastStore.success(t('settings.preferencesSaved'))
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des préférences:', error)
    if (toastStore) {
      toastStore.error('Erreur lors de la sauvegarde')
    }
  } finally {
    isSaving.value = false
  }
}
</script>
