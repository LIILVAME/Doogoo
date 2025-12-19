<template>
  <!-- Menu hamburger mobile (toujours visible) -->
  <button
    @click="toggleSidebar"
    class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-transform duration-300 ease-in-out"
    :aria-label="isOpen ? $t('common.closeMenu') : $t('common.openMenu')"
    :aria-expanded="isOpen"
  >
    <svg
      class="w-6 h-6 text-zinc-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        v-if="!isOpen"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  <!-- Overlay mobile (opacity augmentée pour meilleur focus) -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'w-64 shrink-0 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 min-h-screen fixed left-0 top-0 z-40 lg:static lg:z-auto transition-transform duration-300 ease-in-out flex flex-col',
      isDesktop || (isOpen && isScrollVisible)
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="p-6 flex-1 flex flex-col overflow-y-auto">
      <router-link
        to="/dashboard"
        class="block mb-10 flex items-center gap-3"
        aria-label="Doogoo - Retour au tableau de bord"
      >
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Doogoo</h1>
      </router-link>

      <nav class="space-y-6 flex-1">
        <!-- Section: GESTION -->
        <div>
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 tracking-wide">Gestion</h2>
          <div class="space-y-1">
            <router-link
              v-for="item in gestionItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden"
              :class="[
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              ]"
            >
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>
              <span class="w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200" :class="isActive(item.path) ? 'text-primary-400' : 'text-zinc-500 group-hover:text-zinc-300'">
                <svg v-if="iconConfigs[item.icon]" class="w-5 h-5" fill="none" stroke="currentColor" :viewBox="iconConfigs[item.icon].viewBox">
                  <path v-for="(path, index) in iconConfigs[item.icon].paths" :key="`${item.icon}-${index}`" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" />
                </svg>
              </span>
              <span class="font-medium flex-1">{{ item.name }}</span>
            </router-link>
          </div>
        </div>

        <!-- Section: ANALYSE -->
        <div class="border-t border-white/5 pt-6">
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 tracking-wide">Analyse</h2>
          <div class="space-y-1">
            <router-link
              v-for="item in analyseItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden"
              :class="[
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              ]"
            >
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>
              <span class="w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200" :class="isActive(item.path) ? 'text-primary-400' : 'text-zinc-500 group-hover:text-zinc-300'">
                <svg v-if="iconConfigs[item.icon]" class="w-5 h-5" fill="none" stroke="currentColor" :viewBox="iconConfigs[item.icon].viewBox">
                  <path v-for="(path, index) in iconConfigs[item.icon].paths" :key="`${item.icon}-${index}`" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" />
                </svg>
              </span>
              <span class="font-medium flex-1">{{ item.name }}</span>
              
              <!-- Badge alertes (visibilité améliorée +40%) -->
              <span
                v-if="item.path === '/alertes' && activeAlertsCount > 0"
                class="ml-2 px-2.5 py-1 text-sm font-bold text-white bg-danger-500 rounded-full min-w-[28px] h-6 flex items-center justify-center shadow-sm shadow-danger-500/20 animate-pulse"
              >
                {{ activeAlertsCount > 99 ? '99+' : activeAlertsCount }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- Section: COMPTE -->
        <div class="border-t border-white/5 pt-6">
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 tracking-wide">Compte</h2>
          <div class="space-y-1">
            <router-link
              v-for="item in compteItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden"
              :class="[
                isActive(item.path)
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              ]"
            >
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>
              <span class="w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200" :class="isActive(item.path) ? 'text-primary-400' : 'text-zinc-500 group-hover:text-zinc-300'">
                <svg v-if="iconConfigs[item.icon]" class="w-5 h-5" fill="none" stroke="currentColor" :viewBox="iconConfigs[item.icon].viewBox">
                  <path v-for="(path, index) in iconConfigs[item.icon].paths" :key="`${item.icon}-${index}`" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="path" />
                </svg>
              </span>
              <span class="font-medium flex-1">{{ item.name }}</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Sélecteur de langue + Logout -->
      <div class="mt-8 pt-6 border-t border-white/5">
        <!-- Sélecteur de langue -->
        <div class="mb-4">
          <div class="relative">
            <select
              :value="settingsStore.language"
              @change="handleLanguageChange"
              class="w-full appearance-none bg-white/5 border border-white/10 text-zinc-300 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all hover:bg-white/10 cursor-pointer"
            >
              <option value="fr" class="bg-zinc-900">🇫🇷 Français</option>
              <option value="en" class="bg-zinc-900">🇺🇸 English</option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          @click="handleLogout"
          :disabled="authStore.loading"
          class="flex items-center w-full px-4 py-3 text-zinc-400 rounded-xl transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <svg class="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="font-medium">{{
            authStore.loading ? $t('sidebar.loggingOut') : $t('sidebar.logout')
          }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAlertsStore } from '@/stores/alertsStore'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const alertsStore = useAlertsStore()

const route = useRoute()
const authStore = useAuthStore()
const isOpen = ref(false)
const isScrollVisible = ref(true)
const lastScrollY = ref(0)
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)

const iconConfigs = {
  home: {
    viewBox: '0 0 24 24',
    paths: [
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    ]
  },
  building: {
    viewBox: '0 0 24 24',
    paths: [
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    ]
  },
  currency: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z'
    ]
  },
  users: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    ]
  },
  chart: {
    viewBox: '0 0 24 24',
    paths: [
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    ]
  },
  report: {
    viewBox: '0 0 24 24',
    paths: [
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    ]
  },
  alert: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    ]
  },
  cog: {
    viewBox: '0 0 24 24',
    paths: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    ]
  }
}

// Compte les alertes actives
const activeAlertsCount = computed(() => {
  if (!alertsStore.alerts || alertsStore.alerts.length === 0) return 0
  // Compte uniquement les alertes actives (non résolues, non dismissées)
  return alertsStore.alerts.filter(
    alert => alert.status === 'active' || !alert.status || alert.status === 'open'
  ).length
})

/**
 * Détecte le scroll pour cacher/afficher la sidebar sur mobile
 */
const handleScroll = () => {
  // Ne gère le scroll que sur mobile (pas desktop)
  if (isDesktop.value) {
    return
  }

  const currentScrollY = window.scrollY || window.pageYOffset

  // Seuil pour déclencher le comportement (évite les micro-mouvements)
  const SCROLL_THRESHOLD = 100

  // Scroll vers le bas → cacher (si on est assez bas)
  if (currentScrollY > lastScrollY.value && currentScrollY > SCROLL_THRESHOLD) {
    isScrollVisible.value = false
  }
  // Scroll vers le haut → afficher
  else if (currentScrollY < lastScrollY.value) {
    isScrollVisible.value = true
  }
  // En haut de page → toujours visible
  else if (currentScrollY <= SCROLL_THRESHOLD) {
    isScrollVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

/**
 * Détecte le redimensionnement pour gérer desktop/mobile
 */
const handleResize = () => {
  const wasDesktop = isDesktop.value
  isDesktop.value = window.innerWidth >= 1024

  // Si on passe en desktop, réinitialiser l'état du menu
  if (isDesktop.value && !wasDesktop) {
    isOpen.value = false
    isScrollVisible.value = true
  }

  // Si on passe en mobile, réinitialiser le scroll
  if (!isDesktop.value && wasDesktop) {
    isScrollVisible.value = true
    lastScrollY.value = window.scrollY || window.pageYOffset
  }
}

/**
 * Bascule l'état d'ouverture du menu mobile
 */
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
  // Quand on ouvre manuellement, on force la visibilité
  if (isOpen.value) {
    isScrollVisible.value = true
    lastScrollY.value = window.scrollY || window.pageYOffset
  }
}

/**
 * Ferme le menu mobile
 */
const closeSidebar = () => {
  isOpen.value = false
}

onMounted(async () => {
  // Initialise la position de scroll
  lastScrollY.value = window.scrollY || window.pageYOffset
  isDesktop.value = window.innerWidth >= 1024

  // DÉSACTIVÉ V1 : fetchAlerts bloque l'app avec des timeouts en cascade
  // Les alertes seront chargées uniquement depuis AlertsPage.vue
  // TODO V1.1 : Réactiver avec un système de cache et timeout plus court
  // if (authStore.user) {
  //   alertsStore.fetchAlerts().catch(error => {
  //     console.debug(
  //       'Impossible de charger les alertes pour le badge (non bloquant):',
  //       error.message
  //     )
  //   })
  // }

  // Écouteurs d'événements
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

// Section GESTION
const gestionItems = computed(() => [
  {
    name: t('sidebar.dashboard'),
    path: '/dashboard',
    icon: 'home'
  },
  {
    name: t('sidebar.properties'),
    path: '/biens',
    icon: 'building'
  },
  {
    name: t('sidebar.payments'),
    path: '/paiements',
    icon: 'currency'
  },
  {
    name: t('sidebar.tenants'),
    path: '/locataires',
    icon: 'users'
  }
])

// Section ANALYSE
const analyseItems = computed(() => [
  {
    name: t('sidebar.reports'),
    path: '/rapports',
    icon: 'chart'
  },
  {
    name: t('sidebar.alerts'),
    path: '/alertes',
    icon: 'alert'
  }
])

// Section COMPTE
const compteItems = computed(() => [
  {
    name: t('sidebar.settings'),
    path: '/parametres',
    icon: 'cog'
  }
])

const handleLanguageChange = event => {
  settingsStore.setLanguage(event.target.value)
}

const isActive = path => {
  return route.path === path || route.path.startsWith(path + '/')
}

/**
 * Gère la déconnexion
 */
const handleLogout = async () => {
  try {
    const result = await authStore.logout()

    if (result?.success) {
      // Ferme la sidebar
      closeSidebar()

      // Redirection immédiate vers /login
      // Utilise window.location pour forcer un rechargement complet et éviter les états résiduels
      window.location.href = '/login'
    } else {
      // En cas d'erreur, affiche un message (le toast est géré dans authStore)
      console.error('Erreur lors de la déconnexion:', result?.error)
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Redirige quand même vers login en cas d'erreur
    window.location.href = '/login'
  }
}
</script>
