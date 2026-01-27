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
        'fixed inset-y-0 left-0 z-50 w-64 md:w-20 max-w-full bg-zinc-100 border-r border-zinc-300 transition-all duration-300 ease-in-out h-screen shadow-xl md:shadow-none md:relative md:translate-x-0 flex flex-col',
        isOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'
      ]"
      style="overflow: hidden; contain: layout"
    >
      <!-- Header (fixe en haut) -->
      <div
        class="flex-none w-full h-20 flex items-center justify-center px-6 md:px-0 border-b border-zinc-300 bg-zinc-100 z-10"
      >
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 md:flex-col md:items-center group/logo transition-transform duration-200 hover:scale-105"
          aria-label="Doogoo - Retour au tableau de bord"
        >
          <div
            class="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all duration-300 group-hover/logo:shadow-violet-500/50 group-hover/logo:scale-110"
          >
            <svg
              class="w-5 h-5 text-white transition-transform duration-300 group-hover/logo:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-xl bg-violet-500/20 blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <h1
            class="text-2xl font-bold text-zinc-900 tracking-tight hidden md:hidden transition-colors duration-200 group-hover/logo:text-primary-600"
          >
            Doogoo
          </h1>
        </router-link>
      </div>

      <!-- Menu (flexible, sans scroll) -->
      <nav
        class="flex-1 w-full px-4 md:px-0 py-4 md:py-3 space-y-4 md:space-y-2 flex flex-col md:items-center overflow-y-auto scrollbar-none min-h-0"
      >
        <!-- Section: GESTION -->
        <div class="w-full md:w-auto">
          <h2
            class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 md:hidden tracking-wide"
          >
            Gestion
          </h2>
          <div class="space-y-0.5 md:space-y-1.5">
            <router-link
              v-for="item in gestionItems"
              :key="item.name"
              :to="item.path"
              :title="item.name"
              @click="handleNavClick"
              class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2.5 md:py-0 rounded-xl transition-all duration-300 overflow-visible"
              :class="[
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-zinc-900 hover:bg-white hover:text-zinc-900 md:hover:scale-105'
              ]"
            >
              <!-- Indicateur actif (mobile) -->
              <div
                v-if="isActive(item.path)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-600 rounded-r-full md:hidden"
              ></div>

              <!-- Indicateur actif (desktop - glow) -->
              <div
                v-if="isActive(item.path)"
                class="absolute inset-0 rounded-xl bg-primary-100/50 -z-10 md:block hidden"
              ></div>

              <!-- Icône avec animation -->
              <i
                :class="[
                  item.iconClass,
                  'text-xl relative z-10 transition-transform duration-300',
                  isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                ]"
              ></i>

              <!-- Texte (mobile uniquement) -->
              <span class="font-medium flex-1 md:hidden ml-3 relative z-10">{{ item.name }}</span>
            </router-link>
          </div>
        </div>

        <!-- Section: ANALYSE -->
        <div class="relative w-full md:w-auto">
          <!-- Séparateur élégant -->
          <div
            class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:hidden"
          ></div>
          <div class="pt-4 md:pt-2">
            <h2
              class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 md:hidden tracking-wide"
            >
              Analyse
            </h2>
            <div class="space-y-0.5 md:space-y-1.5">
              <router-link
                v-for="item in analyseItems"
                :key="item.name"
                :to="item.path"
                :title="item.name"
                @click="handleNavClick"
                class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2.5 md:py-0 rounded-xl transition-all duration-300 overflow-visible"
                :class="[
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-zinc-900 hover:bg-white hover:text-zinc-900 md:hover:scale-105'
                ]"
              >
                <!-- Indicateur actif (mobile) -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-600 rounded-r-full md:hidden"
                ></div>

                <!-- Indicateur actif (desktop - glow) -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute inset-0 rounded-xl bg-primary-100/50 -z-10 md:block hidden"
                ></div>

                <!-- Icône avec animation -->
                <i
                  :class="[
                    item.iconClass,
                    'text-xl relative z-10 transition-transform duration-300',
                    isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                  ]"
                ></i>

                <!-- Texte (mobile uniquement) -->
                <span class="font-medium flex-1 md:hidden ml-3 relative z-10">{{ item.name }}</span>

                <!-- Badge alertes amélioré (mobile) -->
                <span
                  v-if="item.path === '/alertes' && activeAlertsCount > 0"
                  class="ml-2 md:hidden px-2.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-danger-500 to-red-600 rounded-full min-w-[28px] h-6 flex items-center justify-center shadow-lg shadow-danger-500/30 relative z-10 animate-pulse"
                >
                  {{ activeAlertsCount > 99 ? '99+' : activeAlertsCount }}
                  <!-- Glow effect -->
                  <div class="absolute inset-0 rounded-full bg-danger-500/30 blur-sm"></div>
                </span>

                <!-- Badge alertes amélioré (desktop) -->
                <span
                  v-if="item.path === '/alertes' && activeAlertsCount > 0"
                  class="absolute -top-1 -right-1 md:block hidden px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-danger-500 to-red-600 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-danger-500/30 relative z-10 animate-pulse"
                >
                  {{ activeAlertsCount > 99 ? '99+' : activeAlertsCount }}
                  <!-- Glow effect -->
                  <div class="absolute inset-0 rounded-full bg-danger-500/30 blur-sm"></div>
                </span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Section: COMPTE -->
        <div class="relative w-full md:w-auto">
          <!-- Séparateur élégant -->
          <div
            class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:hidden"
          ></div>
          <div class="pt-4 md:pt-2">
            <h2
              class="text-xs uppercase text-zinc-500 font-semibold mb-2 px-4 md:hidden tracking-wide"
            >
              Compte
            </h2>
            <div class="space-y-0.5 md:space-y-1.5">
              <router-link
                v-for="item in compteItems"
                :key="item.name"
                :to="item.path"
                :title="item.name"
                @click="handleNavClick"
                @mouseenter="
                  e => (item.path === '/parametres' ? handleFlyoutHover(e, 'parametres') : null)
                "
                @mouseleave="item.path === '/parametres' ? handleFlyoutLeave : null"
                class="relative group w-full md:w-12 md:h-12 flex items-center md:justify-center px-4 md:px-0 py-2.5 md:py-0 rounded-xl transition-all duration-300 overflow-visible"
                :class="[
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-zinc-900 hover:bg-white hover:text-zinc-900 md:hover:scale-105'
                ]"
              >
                <!-- Indicateur actif (mobile) -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-600 rounded-r-full md:hidden"
                ></div>

                <!-- Indicateur actif (desktop - glow) -->
                <div
                  v-if="isActive(item.path)"
                  class="absolute inset-0 rounded-xl bg-primary-100/50 -z-10 md:block hidden"
                ></div>

                <!-- Icône avec animation -->
                <i
                  :class="[
                    item.iconClass,
                    'text-xl relative z-10 transition-transform duration-300',
                    isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                  ]"
                ></i>

                <!-- Texte (mobile uniquement) -->
                <span class="font-medium flex-1 md:hidden ml-3 relative z-10">{{ item.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- Flyout Menu (Teleport) -->
      <FlyoutMenu
        :is-visible="activeFlyoutMenu !== null"
        :items="flyoutMenuItems"
        :icon-position="flyoutIconPosition"
        :sidebar-width="isDesktop ? 80 : 256"
        @close="closeFlyoutMenu"
        @item-click="handleFlyoutItemClick"
      />

      <!-- Footer (fixe en bas) -->
      <div
        class="flex-none w-full border-t border-zinc-300 bg-zinc-100 z-10 flex items-center justify-center md:flex-col px-4 md:px-0 py-3 md:py-3"
      >
        <!-- Mobile: Layout complet -->
        <div class="flex items-center gap-3 w-full md:hidden">
          <!-- Avatar utilisateur amélioré -->
          <div
            class="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden ring-2 ring-violet-500/20 transition-all duration-300 hover:ring-violet-500/50 hover:scale-105"
          >
            <img
              v-if="authStore.profile?.avatar_url"
              :src="authStore.profile.avatar_url"
              :alt="userName"
              class="w-full h-full object-cover"
            />
            <span v-else class="relative z-10">{{ userInitials }}</span>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-full bg-violet-500/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"
            ></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-zinc-900 truncate">{{ userName }}</p>
            <div class="flex items-center gap-3 mt-1">
              <!-- Sélecteur de langue -->
              <div class="relative flex-1">
                <select
                  :value="settingsStore.language"
                  @change="handleLanguageChange"
                  class="w-full appearance-none bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all hover:bg-zinc-100 cursor-pointer"
                >
                  <option value="fr" class="bg-zinc-900">🇫🇷 Français</option>
                  <option value="en" class="bg-zinc-900">🇺🇸 English</option>
                </select>
                <div
                  class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <!-- Bouton Logout -->
              <button
                @click="handleLogout"
                :disabled="authStore.loading"
                class="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>{{
                  authStore.loading ? $t('sidebar.loggingOut') : $t('sidebar.logout')
                }}</span>
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
          <!-- Avatar utilisateur amélioré -->
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm relative group cursor-pointer overflow-hidden ring-2 ring-violet-500/20 transition-all duration-300 hover:ring-violet-500/50 hover:scale-110"
          >
            <img
              v-if="authStore.profile?.avatar_url"
              :src="authStore.profile.avatar_url"
              :alt="userName"
              class="w-full h-full object-cover relative z-10"
            />
            <span v-else class="relative z-10">{{ userInitials }}</span>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-full bg-violet-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <!-- Tooltip amélioré avec nom -->
            <div
              class="absolute left-full ml-4 px-3 py-2 bg-zinc-900/95 backdrop-blur-md text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 shadow-2xl border border-white/10"
            >
              <span>{{ userName }}</span>
              <!-- Flèche -->
              <div
                class="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-zinc-900/95"
              ></div>
            </div>
          </div>
          <!-- Bouton Logout amélioré (icône uniquement) -->
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="w-12 h-12 flex items-center justify-center rounded-xl text-danger-500 hover:bg-danger-50 hover:text-danger-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative group hover:scale-110"
          >
            <i
              class="ri-logout-box-line text-xl relative z-10 transition-transform duration-300 group-hover:rotate-12"
            ></i>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 rounded-xl bg-red-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <!-- Tooltip amélioré -->
            <div
              class="absolute left-full ml-4 px-3 py-2 bg-zinc-900/95 backdrop-blur-md text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0 shadow-2xl border border-white/10"
            >
              <span>{{ authStore.loading ? $t('sidebar.loggingOut') : $t('sidebar.logout') }}</span>
              <!-- Flèche -->
              <div
                class="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-zinc-900/95"
              ></div>
            </div>
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
import FlyoutMenu from '@/components/layout/FlyoutMenu.vue'
import { hapticLight } from '@/composables/useHapticFeedback'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const alertsStore = useAlertsStore()

const route = useRoute()
const authStore = useAuthStore()
const isScrollVisible = ref(true)
const lastScrollY = ref(0)
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 768 : false)

// Flyout Menu State
const activeFlyoutMenu = ref(null)
const flyoutIconPosition = ref({ top: 0, left: 0 })
let flyoutHoverTimeout = null
let flyoutCloseTimeout = null

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
  get: () => (sidebarState ? sidebarState.isOpen.value : isOpenLocal.value),
  set: value => {
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
 * Gère le clic sur un item de navigation avec haptic feedback
 */
const handleNavClick = () => {
  hapticLight()
  closeSidebar()
}

/**
 * Gère l'événement de toggle depuis le header mobile
 * Défini en dehors de onMounted pour être accessible dans onUnmounted
 */
const handleSidebarToggle = event => {
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

  // Nettoie les timeouts du flyout menu
  if (flyoutHoverTimeout) clearTimeout(flyoutHoverTimeout)
  if (flyoutCloseTimeout) clearTimeout(flyoutCloseTimeout)
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
    name: t('sidebar.tenants'),
    path: '/locataires',
    icon: 'users',
    iconClass: iconMap.users
  },
  {
    name: t('sidebar.payments'),
    path: '/paiements',
    icon: 'currency',
    iconClass: iconMap.currency
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

// Sous-pages des Paramètres avec icônes
const settingsSubPages = computed(() => [
  {
    id: 'general',
    label: t('settings.sections.general'),
    icon: 'ri-user-settings-line',
    path: '/parametres?section=general'
  },
  {
    id: 'notifications',
    label: t('settings.sections.notifications'),
    icon: 'ri-notification-line',
    path: '/parametres?section=notifications'
  },
  {
    id: 'security',
    label: t('settings.sections.security'),
    icon: 'ri-shield-check-line',
    path: '/parametres?section=security'
  },
  {
    id: 'language-currency',
    label: t('settings.sections.languageCurrency'),
    icon: 'ri-global-line',
    path: '/parametres?section=language-currency'
  },
  {
    id: 'theme',
    label: t('settings.sections.theme'),
    icon: 'ri-palette-line',
    path: '/parametres?section=theme'
  }
])

// Items du flyout menu (dynamique selon l'item survolé)
const flyoutMenuItems = computed(() => {
  if (activeFlyoutMenu.value === 'parametres') {
    return settingsSubPages.value
  }
  return []
})

const handleLanguageChange = event => {
  settingsStore.setLanguage(event.target.value)
}

const isActive = path => {
  return route.path === path || route.path.startsWith(path + '/')
}

/**
 * Gère l'ouverture du flyout menu au hover
 */
const handleFlyoutHover = (event, menuId) => {
  // Uniquement sur desktop
  if (!isDesktop.value) return

  // Annule toute fermeture programmée
  if (flyoutCloseTimeout) {
    clearTimeout(flyoutCloseTimeout)
    flyoutCloseTimeout = null
  }

  // Debounce de 100ms pour éviter les clignotements
  if (flyoutHoverTimeout) {
    clearTimeout(flyoutHoverTimeout)
  }

  const target = event.currentTarget

  flyoutHoverTimeout = setTimeout(() => {
    if (!target) return
    const rect = target.getBoundingClientRect()

    // Calcule la position du centre de l'icône
    flyoutIconPosition.value = {
      top: rect.top + rect.height / 2,
      left: rect.left
    }

    activeFlyoutMenu.value = menuId
  }, 100)
}

/**
 * Gère la fermeture du flyout menu
 */
const handleFlyoutLeave = () => {
  // Debounce de 150ms pour permettre le mouvement vers la modale
  if (flyoutCloseTimeout) {
    clearTimeout(flyoutCloseTimeout)
  }

  flyoutCloseTimeout = setTimeout(() => {
    activeFlyoutMenu.value = null
  }, 150)
}

/**
 * Ferme le flyout menu
 */
const closeFlyoutMenu = () => {
  if (flyoutCloseTimeout) {
    clearTimeout(flyoutCloseTimeout)
    flyoutCloseTimeout = null
  }
  activeFlyoutMenu.value = null
}

/**
 * Gère le clic sur un item du flyout menu
 */
const handleFlyoutItemClick = () => {
  closeSidebar()
  closeFlyoutMenu()
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
/* Animation pour les icônes au hover */
@keyframes icon-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Respecte prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
