<template>
  <div>
    <!-- Overlay mobile -->
    <div
      v-if="isOpen"
      @click="closeSidebar"
      class="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 md:w-20 bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 ease-in-out h-screen shadow-xl md:relative md:translate-x-0',
        isOpen || isDesktop
          ? 'translate-x-0'
          : '-translate-x-full'
      ]"
      style="overflow-y: hidden !important; overflow-x: visible !important;"
    >
      <!-- Header (fixe en haut avec position absolute) -->
      <div class="absolute top-0 left-0 w-full h-20 flex items-center justify-center px-6 md:px-0 border-b border-white/5 bg-zinc-950/50 z-10" style="overflow-x: visible !important;">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 md:flex-col md:items-center"
          aria-label="Doogoo - Retour au tableau de bord"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight hidden md:hidden">Doogoo</h1>
        </router-link>
      </div>

      <!-- Menu (scrollable au milieu avec position absolute) -->
      <nav class="absolute top-20 w-full px-4 md:px-0 py-6 md:py-6 space-y-4 md:space-y-2 flex flex-col md:items-center" style="overflow-y: hidden !important; overflow-x: visible !important; bottom: 120px;">
        <!-- Section: GESTION -->
        <div class="w-full md:w-auto" style="overflow-x: visible !important;">
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-1.5 px-4 md:hidden tracking-wide">Gestion</h2>
          <div class="space-y-0.5 md:space-y-2">
            <router-link
              v-for="item in gestionItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2 md:py-0 rounded-xl transition-all duration-200 overflow-visible"
              :class="[
                isActive(item.path)
                  ? 'bg-indigo-500/20 text-indigo-400 md:bg-indigo-500/20 md:text-indigo-400'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hover:bg-white/10 md:hover:text-white'
              ]"
            >
              <!-- Indicateur actif (mobile uniquement) -->
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full md:hidden"></div>
              
              <!-- Icône -->
              <i :class="[item.iconClass, 'text-xl']"></i>
              
              <!-- Texte (mobile uniquement) -->
              <span class="font-medium flex-1 md:hidden ml-3">{{ item.name }}</span>

              <!-- Tooltip (desktop uniquement) -->
              <span class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 hidden md:block shadow-xl">
                {{ item.name }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- Section: ANALYSE -->
        <div class="border-t border-white/5 pt-4 md:pt-2 w-full md:w-auto" style="overflow-x: visible !important;">
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-1.5 px-4 md:hidden tracking-wide">Analyse</h2>
          <div class="space-y-0.5 md:space-y-2">
            <router-link
              v-for="item in analyseItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2 md:py-0 rounded-xl transition-all duration-200 overflow-visible"
              :class="[
                isActive(item.path)
                  ? 'bg-indigo-500/20 text-indigo-400 md:bg-indigo-500/20 md:text-indigo-400'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hover:bg-white/10 md:hover:text-white'
              ]"
            >
              <!-- Indicateur actif (mobile uniquement) -->
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full md:hidden"></div>
              
              <!-- Icône -->
              <i :class="[item.iconClass, 'text-xl']"></i>
              
              <!-- Texte (mobile uniquement) -->
              <span class="font-medium flex-1 md:hidden ml-3">{{ item.name }}</span>
              
              <!-- Badge alertes (mobile) -->
              <span
                v-if="item.path === '/alertes' && activeAlertsCount > 0"
                class="ml-2 md:hidden px-2.5 py-1 text-sm font-bold text-white bg-danger-500 rounded-full min-w-[28px] h-6 flex items-center justify-center shadow-sm shadow-danger-500/20 animate-pulse"
              >
                {{ activeAlertsCount > 99 ? '99+' : activeAlertsCount }}
              </span>
              
              <!-- Badge alertes (desktop - position absolue) -->
              <span
                v-if="item.path === '/alertes' && activeAlertsCount > 0"
                class="absolute -top-1 -right-1 md:block hidden px-1.5 py-0.5 text-xs font-bold text-white bg-danger-500 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-sm shadow-danger-500/20 animate-pulse"
              >
                {{ activeAlertsCount > 99 ? '99+' : activeAlertsCount }}
              </span>

              <!-- Tooltip simple (desktop uniquement) -->
              <span class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 hidden md:block shadow-xl">
                {{ item.name }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- Section: COMPTE -->
        <div class="border-t border-white/5 pt-4 md:pt-2 w-full md:w-auto" style="overflow-x: visible !important;">
          <h2 class="text-xs uppercase text-zinc-500 font-semibold mb-1.5 px-4 md:hidden tracking-wide">Compte</h2>
          <div class="space-y-0.5 md:space-y-2">
            <router-link
              v-for="item in compteItems"
              :key="item.name"
              :to="item.path"
              @click="closeSidebar"
              class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2 md:py-0 rounded-xl transition-all duration-200 overflow-visible"
              :class="[
                isActive(item.path)
                  ? 'bg-indigo-500/20 text-indigo-400 md:bg-indigo-500/20 md:text-indigo-400'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hover:bg-white/10 md:hover:text-white'
              ]"
            >
              <!-- Indicateur actif (mobile uniquement) -->
              <div v-if="isActive(item.path)" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full md:hidden"></div>
              
              <!-- Icône -->
              <i :class="[item.iconClass, 'text-xl']"></i>
              
              <!-- Texte (mobile uniquement) -->
              <span class="font-medium flex-1 md:hidden ml-3">{{ item.name }}</span>

              <!-- Menu déroulant Paramètres ou Tooltip simple -->
              <template v-if="item.path === '/parametres'">
                <!-- Menu déroulant Paramètres -->
                <div
                  class="absolute left-full ml-4 z-50 bg-gray-900 rounded-lg shadow-xl py-2 min-w-[200px] opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 hidden md:block"
                >
                  <router-link
                    v-for="subPage in settingsSubPages"
                    :key="subPage.id"
                    :to="`/parametres?section=${subPage.id}`"
                    @click="closeSidebar"
                    class="block px-4 py-2.5 text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer pointer-events-auto"
                  >
                    {{ subPage.label }}
                  </router-link>
                </div>
              </template>
              <!-- Tooltip simple pour les autres items -->
              <span v-else class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 hidden md:block shadow-xl">
                {{ item.name }}
              </span>
            </router-link>
          </div>
        </div>
      </nav>


      <!-- Footer (fixe en bas avec position absolute) -->
      <div class="absolute bottom-0 left-0 w-full border-t border-white/5 bg-zinc-950/50 z-10 flex items-center justify-center md:flex-col px-4 md:px-0" style="overflow-x: visible !important; padding-top: 1.25rem; padding-bottom: 1.5rem; min-height: 100px;">
        <!-- Mobile: Layout complet -->
        <div class="flex items-center gap-3 w-full md:hidden">
          <!-- Avatar utilisateur -->
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            <img
              v-if="authStore.profile?.avatar_url"
              :src="authStore.profile.avatar_url"
              :alt="userName"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <div class="flex items-center gap-3 mt-1">
              <!-- Sélecteur de langue -->
              <div class="relative flex-1">
                <select
                  :value="settingsStore.language"
                  @change="handleLanguageChange"
                  class="w-full appearance-none bg-white/5 border border-white/10 text-zinc-300 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all hover:bg-white/10 cursor-pointer"
                >
                  <option value="fr" class="bg-zinc-900">🇫🇷 Français</option>
                  <option value="en" class="bg-zinc-900">🇺🇸 English</option>
                </select>
                <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <!-- Bouton Logout -->
              <button
                @click="handleLogout"
                :disabled="authStore.loading"
                class="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>{{ authStore.loading ? $t('sidebar.loggingOut') : $t('sidebar.logout') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop: Layout compact (notifications + avatar + logout icon) -->
        <div class="hidden md:flex md:flex-col md:items-center md:gap-4">
          <!-- Notification Bell -->
          <div class="mb-2">
            <NotificationBell position="sidebar" />
          </div>
          <!-- Avatar utilisateur -->
          <div 
            class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm relative group cursor-pointer overflow-hidden"
          >
            <img
              v-if="authStore.profile?.avatar_url"
              :src="authStore.profile.avatar_url"
              :alt="userName"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userInitials }}</span>
            <!-- Tooltip avec nom -->
            <span class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 shadow-xl">
              {{ userName }}
            </span>
          </div>
          <!-- Bouton Logout (icône uniquement) -->
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="w-12 h-12 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative group"
          >
            <i class="ri-logout-box-line text-xl"></i>
            <!-- Tooltip -->
            <span class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 shadow-xl">
              {{ authStore.loading ? $t('sidebar.loggingOut') : $t('sidebar.logout') }}
            </span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAlertsStore } from '@/stores/alertsStore'
import NotificationBell from '@/components/common/NotificationBell.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const alertsStore = useAlertsStore()

const route = useRoute()
const authStore = useAuthStore()
const isScrollVisible = ref(true)
const lastScrollY = ref(0)
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 768 : false)

// Les tooltips utilisent maintenant le pattern group Tailwind, plus besoin de gestion d'état JavaScript

// Computed pour les initiales et le nom de l'utilisateur
const userInitials = computed(() => {
  if (authStore.profile?.full_name) {
    const names = authStore.profile.full_name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  if (authStore.user?.email) {
    return authStore.user.email[0].toUpperCase()
  }
  return 'U'
})

const userName = computed(() => {
  if (authStore.profile?.full_name) {
    return authStore.profile.full_name
  }
  if (authStore.user?.email) {
    return authStore.user.email
  }
  return 'Utilisateur'
})

// Récupère l'état de la sidebar depuis le parent (DashboardLayout) si disponible
const sidebarState = inject('sidebarState', null)
const isOpenLocal = ref(false)

// Computed pour unifier l'accès à l'état d'ouverture
const isOpen = computed({
  get: () => sidebarState ? sidebarState.isOpen.value : isOpenLocal.value,
  set: (value) => {
    if (sidebarState) {
      sidebarState.setOpen(value)
    } else {
      isOpenLocal.value = value
    }
  }
})

// Mapping des icônes RemixIcon
const iconMap = {
  home: 'ri-home-line',
  building: 'ri-building-line',
  currency: 'ri-wallet-3-line',
  users: 'ri-user-smile-line',
  chart: 'ri-bar-chart-line',
  report: 'ri-file-text-line',
  alert: 'ri-alert-line',
  cog: 'ri-settings-3-line'
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
  isDesktop.value = window.innerWidth >= 768

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
 * Note: Fonction conservée pour compatibilité future, actuellement gérée par closeSidebar
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

/**
 * Gère l'événement de toggle depuis le header mobile
 * Défini en dehors de onMounted pour être accessible dans onUnmounted
 */
const handleSidebarToggle = (event) => {
  isOpen.value = event.detail
}

onMounted(async () => {
  // Initialise la position de scroll
  lastScrollY.value = window.scrollY || window.pageYOffset
  isDesktop.value = window.innerWidth >= 768

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

  // Écoute l'événement de toggle depuis le header mobile
  window.addEventListener('sidebar-toggle', handleSidebarToggle)

  // Écouteurs d'événements
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('sidebar-toggle', handleSidebarToggle)
})

// Section GESTION
const gestionItems = computed(() => [
  {
    name: t('sidebar.dashboard'),
    path: '/dashboard',
    icon: 'home',
    iconClass: iconMap.home
  },
  {
    name: t('sidebar.properties'),
    path: '/biens',
    icon: 'building',
    iconClass: iconMap.building
  },
  {
    name: t('sidebar.payments'),
    path: '/paiements',
    icon: 'currency',
    iconClass: iconMap.currency
  },
  {
    name: t('sidebar.tenants'),
    path: '/locataires',
    icon: 'users',
    iconClass: iconMap.users
  }
])

// Section ANALYSE
const analyseItems = computed(() => [
  {
    name: t('sidebar.reports'),
    path: '/rapports',
    icon: 'chart',
    iconClass: iconMap.chart
  },
  {
    name: t('sidebar.alerts'),
    path: '/alertes',
    icon: 'alert',
    iconClass: iconMap.alert
  }
])

// Section COMPTE
const compteItems = computed(() => [
  {
    name: t('sidebar.settings'),
    path: '/parametres',
    icon: 'cog',
    iconClass: iconMap.cog
  }
])

// Sous-pages des Paramètres
const settingsSubPages = computed(() => [
  {
    id: 'general',
    label: t('settings.sections.general')
  },
  {
    id: 'notifications',
    label: t('settings.sections.notifications')
  },
  {
    id: 'security',
    label: t('settings.sections.security')
  },
  {
    id: 'language-currency',
    label: t('settings.sections.languageCurrency')
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

<style scoped>
/* Styles pour tooltips via Tailwind group pattern - plus besoin de styles personnalisés */
</style>
