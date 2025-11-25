<template>
  <DashboardLayout>
    <div class="p-6 lg:p-10 max-w-7xl mx-auto">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />

      <div class="flex flex-col md:flex-row gap-6 md:gap-8">
        <!-- Sous-sidebar de navigation (desktop) -->
        <aside class="hidden md:block w-64 shrink-0">
          <SettingsSidebar :active-section="activeSection" @change-section="handleSectionChange" />
        </aside>

        <!-- Menu déroulant (mobile) -->
        <div class="md:hidden w-full">
          <select
            :value="activeSection"
            @change="handleSectionChange($event.target.value)"
            class="w-full bg-white/5 border border-white/10 text-zinc-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all hover:bg-white/10 cursor-pointer appearance-none"
          >
            <option value="general" class="bg-zinc-900">{{ $t('settings.sections.general') }}</option>
            <option value="notifications" class="bg-zinc-900">{{ $t('settings.sections.notifications') }}</option>
            <option value="security" class="bg-zinc-900">{{ $t('settings.sections.security') }}</option>
            <option value="language-currency" class="bg-zinc-900">
              {{ $t('settings.sections.languageCurrency') }}
            </option>
          </select>
        </div>

        <!-- Zone de contenu -->
        <div class="flex-1">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">{{ $t('settings.title') }}</h1>
            <p class="text-zinc-400">{{ $t('settings.subtitle') }}</p>
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
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onErrorCaptured, onMounted, watch } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
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
