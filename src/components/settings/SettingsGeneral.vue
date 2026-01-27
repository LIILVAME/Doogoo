<template>
  <div class="space-y-6">
    <ProfileSettings />

    <!-- Section Guide de démarrage -->
    <SettingsSection title="Guide de démarrage">
      <div class="glass-panel rounded-2xl p-6 border border-blue-100 bg-blue-50/50">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-zinc-900 mb-1">
              {{ $t('settings.onboarding.title') }}
            </h3>
            <p class="text-xs text-zinc-600 mb-3">
              {{ $t('settings.onboarding.description') }}
            </p>
            <button
              @click="restartOnboarding"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-xl hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ $t('onboarding.restart') }}
            </button>
          </div>
          <div class="ml-4 flex-shrink-0">
            <svg
              class="w-8 h-8 text-blue-600 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
    </SettingsSection>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ProfileSettings from './ProfileSettings.vue'
import SettingsSection from './SettingsSection.vue'

const router = useRouter()

/**
 * Redémarre l'onboarding et redirige vers le dashboard
 */
const restartOnboarding = () => {
  // Réinitialise l'état d'onboarding dans localStorage
  localStorage.removeItem('onboarding_completed')
  localStorage.removeItem('onboarding_dismissed')
  localStorage.removeItem('onboarding_current_step')

  // Supprime aussi les flags par utilisateur
  // (on va les nettoyer via une boucle sur toutes les clés)
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('onboarding_seen_')) {
      localStorage.removeItem(key)
    }
  })

  // Redirige vers le dashboard où l'onboarding se déclenchera
  router.push('/dashboard')
}
</script>
