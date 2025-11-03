<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar principale -->
    <Sidebar />

    <!-- Main Content -->
    <main id="main-content" ref="mainElement" class="flex-1 overflow-y-auto" role="main">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />
      <div class="flex flex-col md:flex-row min-h-full">
        <!-- Sous-sidebar de navigation (desktop) -->
        <aside class="hidden md:block w-64 shrink-0">
          <SettingsSidebar :active-section="activeSection" @change-section="handleSectionChange" />
        </aside>

        <!-- Menu déroulant (mobile) -->
        <div class="md:hidden w-full bg-white border-b border-gray-200 sticky top-0 z-10">
          <div class="px-4 sm:px-6 py-3">
            <select
              :value="activeSection"
              @change="handleSectionChange($event.target.value)"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
            >
              <option value="general">{{ $t('settings.sections.general') }}</option>
              <option value="notifications">{{ $t('settings.sections.notifications') }}</option>
              <option value="security">{{ $t('settings.sections.security') }}</option>
              <option value="language-currency">
                {{ $t('settings.sections.languageCurrency') }}
              </option>
            </select>
          </div>
        </div>

        <!-- Zone de contenu -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10">
            <!-- Header -->
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('settings.title') }}</h1>
              <p class="text-gray-600">{{ $t('settings.subtitle') }}</p>
            </div>

            <!-- Contenu dynamique selon la section active -->
            <div class="min-h-[400px]">
              <Transition name="fade" mode="out-in">
                <component :is="activeComponent" :key="activeSection" />
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured, onMounted, watch } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import Sidebar from '../components/Sidebar.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import SettingsSidebar from '../components/settings/SettingsSidebar.vue'
import SettingsGeneral from '../components/settings/SettingsGeneral.vue'
import SettingsNotifications from '../components/settings/SettingsNotifications.vue'
import SettingsSecurity from '../components/settings/SettingsSecurity.vue'
import SettingsLanguageCurrency from '../components/settings/SettingsLanguageCurrency.vue'
import { useAuthStore } from '@/stores/authStore'

// Capture les erreurs pour éviter que la page ne crash complètement
onErrorCaptured((err, instance, info) => {
  console.error('Erreur dans ParametresPage:', err, info)
  // Retourne true pour permettre à Vue de gérer l'erreur normalement
  // mais empêche le crash de l'application
  return true
})

// Pull-to-refresh
const mainElement = ref(null)
const authStore = useAuthStore()
const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  async () => {
    // Force le rafraîchissement du profil utilisateur
    if (authStore.user) {
      await authStore.fetchProfile(true)
    }
  },
  { threshold: 80 }
)

const activeSection = ref('general')

// Garde pour éviter les changements de section pendant les transitions
const isTransitioning = ref(false)

const activeComponent = computed(() => {
  const components = {
    general: SettingsGeneral,
    notifications: SettingsNotifications,
    security: SettingsSecurity,
    'language-currency': SettingsLanguageCurrency
  }
  return components[activeSection.value] || SettingsGeneral
})

// Gère le changement de section avec protection contre les transitions multiples
const handleSectionChange = newSection => {
  if (isTransitioning.value || newSection === activeSection.value) {
    return
  }

  isTransitioning.value = true
  activeSection.value = newSection

  // Réinitialise le flag après la transition
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

// Persiste la section active dans sessionStorage
onMounted(() => {
  const savedSection = sessionStorage.getItem('settings-active-section')
  const validSections = ['general', 'notifications', 'security', 'language-currency']

  // Réinitialise à 'general' si la section sauvegardée n'existe plus
  if (savedSection && validSections.includes(savedSection)) {
    activeSection.value = savedSection
  } else {
    // Si theme ou integrations était sauvegardé, réinitialise à general
    activeSection.value = 'general'
  }

  // Sauvegarde la section quand elle change
  const stopWatcher = watch(
    () => activeSection.value,
    newSection => {
      sessionStorage.setItem('settings-active-section', newSection)
    }
  )

  // Cleanup au démontage
  return () => {
    stopWatcher()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
