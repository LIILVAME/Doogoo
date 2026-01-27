<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
            class="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all hover:bg-zinc-50 cursor-pointer appearance-none shadow-sm"
          >
            <option value="general" class="bg-white text-zinc-900">
              {{ $t('settings.sections.general') }}
            </option>
            <option value="notifications" class="bg-white text-zinc-900">
              {{ $t('settings.sections.notifications') }}
            </option>
            <option value="security" class="bg-white text-zinc-900">
              {{ $t('settings.sections.security') }}
            </option>
            <option value="language-currency" class="bg-white text-zinc-900">
              {{ $t('settings.sections.languageCurrency') }}
            </option>
            <option value="theme" class="bg-white text-zinc-900">
              {{ $t('settings.sections.theme') }}
            </option>
          </select>
        </div>

        <!-- Zone de contenu -->
        <div class="flex-1">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-zinc-900 mb-2">{{ $t('settings.title') }}</h1>
            <p class="text-zinc-500">{{ $t('settings.subtitle') }}</p>
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
import { useRoute } from 'vue-router'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import SettingsSidebar from '../components/settings/SettingsSidebar.vue'
import SettingsGeneral from '../components/settings/SettingsGeneral.vue'
import SettingsNotifications from '../components/settings/SettingsNotifications.vue'
import SettingsSecurity from '../components/settings/SettingsSecurity.vue'
import SettingsLanguageCurrency from '../components/settings/SettingsLanguageCurrency.vue'
import SettingsTheme from '../components/settings/SettingsTheme.vue'
import { useAuthStore } from '@/stores/authStore'

// Capture les erreurs pour éviter que la page ne crash complètement
onErrorCaptured((err, instance, info) => {
  console.error('Erreur dans SettingsPage:', err, info)
  // Retourne true pour permettre à Vue de gérer l'erreur normalement
  // mais empêche le crash de l'application
  return true
})

// Pull-to-refresh
const route = useRoute()
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
    'language-currency': SettingsLanguageCurrency,
    theme: SettingsTheme
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
  // Vérifie d'abord les query params pour la section
  if (route.query.section) {
    // route.query.section peut être une string ou un array, on prend le premier élément
    const querySection = Array.isArray(route.query.section)
      ? route.query.section[0]
      : route.query.section
    const validSections = ['general', 'notifications', 'security', 'language-currency', 'theme']
    if (validSections.includes(querySection)) {
      activeSection.value = querySection
      return
    }
  }

  const savedSection = sessionStorage.getItem('settings-active-section')
  const validSections = ['general', 'notifications', 'security', 'language-currency', 'theme']

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

  // Watch les query params pour changer la section
  const stopQueryWatcher = watch(
    () => route.query.section,
    newSection => {
      if (newSection) {
        // route.query.section peut être une string ou un array, on prend le premier élément
        const section = Array.isArray(newSection) ? newSection[0] : newSection
        const validSections = ['general', 'notifications', 'security', 'language-currency', 'theme']
        if (validSections.includes(section)) {
          activeSection.value = section
        }
      }
    },
    { immediate: true }
  )

  // Cleanup au démontage
  return () => {
    stopWatcher()
    stopQueryWatcher()
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
