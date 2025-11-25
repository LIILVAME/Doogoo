<template>
  <div class="space-y-6">
    <div class="glass-panel rounded-2xl p-6">
      <h3 class="text-lg font-semibold text-white mb-6">{{ $t('settings.notifications') }}</h3>
      
      <div class="space-y-4">
        <label class="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group border border-white/10">
          <div class="flex items-center">
            <input
              v-model="localPreferences.notifications.email"
              type="checkbox"
              class="w-4 h-4 text-violet-600 border-zinc-600 bg-zinc-800 rounded focus:ring-violet-500 focus:ring-offset-zinc-900"
            />
            <span class="ml-3 text-sm font-medium text-zinc-300 group-hover:text-white">
              {{ $t('settings.emailNotifications') }}
            </span>
          </div>
        </label>

        <label class="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group border border-white/10">
          <div class="flex items-center">
            <input
              v-model="localPreferences.notifications.payments"
              type="checkbox"
              class="w-4 h-4 text-violet-600 border-zinc-600 bg-zinc-800 rounded focus:ring-violet-500 focus:ring-offset-zinc-900"
            />
            <span class="ml-3 text-sm font-medium text-zinc-300 group-hover:text-white">
              {{ $t('settings.paymentAlerts') }}
            </span>
          </div>
        </label>

        <label class="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group border border-white/10">
          <div class="flex items-center">
            <input
              v-model="localPreferences.notifications.reminders"
              type="checkbox"
              class="w-4 h-4 text-violet-600 border-zinc-600 bg-zinc-800 rounded focus:ring-violet-500 focus:ring-offset-zinc-900"
            />
            <span class="ml-3 text-sm font-medium text-zinc-300 group-hover:text-white">
              {{ $t('settings.paymentReminders') }}
            </span>
          </div>
        </label>

        <label class="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group border border-white/10">
          <div class="flex items-center">
            <input
              v-model="localPreferences.notifications.maintenance"
              type="checkbox"
              class="w-4 h-4 text-violet-600 border-zinc-600 bg-zinc-800 rounded focus:ring-violet-500 focus:ring-offset-zinc-900"
            />
            <span class="ml-3 text-sm font-medium text-zinc-300 group-hover:text-white">
              {{ $t('settings.maintenanceNotifications') }}
            </span>
          </div>
        </label>
      </div>

      <div class="mt-8 pt-6 border-t border-white/10">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            {{ $t('settings.alertThreshold') }}
          </label>
          <input
            v-model.number="localPreferences.alertThreshold"
            type="number"
            min="0"
            max="30"
            class="w-full max-w-xs bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
            placeholder="5"
          />
          <p class="text-xs text-zinc-400 mt-2">{{ $t('settings.alertThresholdDescription') }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="savePreferences"
          :disabled="isSaving"
          class="btn-primary flex items-center"
        >
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? $t('settings.saving') : $t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { useSettingsStore } from '@/stores/settingsStore'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const toastStore = useToastStore()

const isSaving = ref(false)

const localPreferences = ref({
  alertThreshold: settingsStore.alertThreshold,
  notifications: { ...settingsStore.notifications }
})

watch(() => settingsStore.alertThreshold, (newVal) => {
  localPreferences.value.alertThreshold = newVal
})
watch(() => settingsStore.notifications, (newVal) => {
  localPreferences.value.notifications = { ...newVal }
}, { deep: true })

onMounted(() => {
  localPreferences.value = {
    alertThreshold: settingsStore.alertThreshold,
    notifications: { ...settingsStore.notifications }
  }
})

const savePreferences = async () => {
  isSaving.value = true
  try {
    settingsStore.setAlertThreshold(localPreferences.value.alertThreshold)
    settingsStore.setNotifications(localPreferences.value.notifications)
    if (toastStore) {
      toastStore.success(t('settings.preferencesSaved'))
    }
  } catch (error) {
    console.error('Erreur:', error)
    if (toastStore) {
      toastStore.error('Erreur lors de la sauvegarde')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

