<template>
  <div class="relative" ref="containerRef">
    <!-- Bouton cloche avec badge -->
    <button
      @click="toggleDropdown"
      ref="bellButtonRef"
      class="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
      :aria-label="`${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`"
      :aria-expanded="isDropdownOpen"
    >
      <Bell class="w-5 h-5 text-zinc-300" />
      <!-- Badge rouge avec nombre -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-zinc-950"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown des notifications -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isDropdownOpen"
        ref="dropdownRef"
        :class="[
          'absolute w-80 md:w-96 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col',
          props.position === 'sidebar' 
            ? 'left-full top-0 ml-4' 
            : 'right-0 top-full mt-2'
        ]"
      >
        <!-- Header du dropdown -->
        <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-zinc-900/95 backdrop-blur-sm">
          <h3 class="text-sm font-semibold text-white">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>

        <!-- Liste des notifications -->
        <div class="overflow-y-auto flex-1">
          <div v-if="alertsStore.loading" class="p-4 text-center">
            <div class="inline-block w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-zinc-400 text-sm mt-2">Chargement...</p>
          </div>

          <div v-else-if="recentAlerts.length === 0" class="p-6 text-center">
            <CheckCircle class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p class="text-zinc-400 text-sm">Aucune notification</p>
          </div>

          <div v-else class="divide-y divide-white/5">
            <button
              v-for="alert in recentAlerts"
              :key="alert.id"
              @click="handleAlertClick(alert)"
              class="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors group"
              :class="{
                'bg-rose-500/5': alert.severity === 'high' && !isRead(alert.id),
                'bg-amber-500/5': alert.severity === 'medium' && !isRead(alert.id),
                'bg-blue-500/5': alert.severity === 'low' && !isRead(alert.id)
              }"
            >
              <div class="flex items-start gap-3">
                <!-- Icône de sévérité -->
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="{
                    'bg-rose-500/10 text-rose-400': alert.severity === 'high',
                    'bg-amber-500/10 text-amber-400': alert.severity === 'medium',
                    'bg-blue-500/10 text-blue-400': alert.severity === 'low'
                  }"
                >
                  <AlertCircle
                    v-if="alert.severity === 'high'"
                    class="w-4 h-4"
                  />
                  <AlertTriangle
                    v-else-if="alert.severity === 'medium'"
                    class="w-4 h-4"
                  />
                  <Info
                    v-else
                    class="w-4 h-4"
                  />
                </div>

                <!-- Contenu -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <p
                      class="text-sm font-medium text-white truncate"
                      :class="{
                        'font-semibold': !isRead(alert.id)
                      }"
                    >
                      {{ alert.title }}
                    </p>
                    <!-- Indicateur non lu -->
                    <span
                      v-if="!isRead(alert.id)"
                      class="flex-shrink-0 w-2 h-2 rounded-full bg-violet-500"
                    ></span>
                  </div>
                  <p class="text-xs text-zinc-400 line-clamp-2">{{ alert.message }}</p>
                  <p v-if="alert.date" class="text-xs text-zinc-500 mt-1">
                    {{ formatRelativeTime(alert.date) }}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer avec lien vers toutes les alertes -->
        <div class="px-4 py-3 border-t border-white/10 bg-zinc-900/95 backdrop-blur-sm">
          <router-link
            to="/alertes"
            @click="closeDropdown"
            class="block text-center text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Voir toutes les alertes
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-vue-next'
import { useAlertsStore } from '@/stores/alertsStore'
import { formatDate } from '@/utils/formatters'

/**
 * Props pour personnaliser le positionnement du dropdown
 */
const props = defineProps({
  /**
   * Position du dropdown : 'header' (droite, en dessous) ou 'sidebar' (gauche, à côté)
   */
  position: {
    type: String,
    default: 'header',
    validator: (value) => ['header', 'sidebar'].includes(value)
  }
})

const router = useRouter()
const alertsStore = useAlertsStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const containerRef = ref(null)
const bellButtonRef = ref(null)

/**
 * Computed : 5 dernières alertes non lues
 */
const recentAlerts = computed(() => {
  return alertsStore.alerts
    .filter(alert => !alertsStore.isRead(alert.id))
    .slice(0, 5)
})

/**
 * Computed : Nombre d'alertes non lues
 */
const unreadCount = computed(() => {
  return alertsStore.alerts.filter(alert => !alertsStore.isRead(alert.id)).length
})

/**
 * Toggle le dropdown
 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value && alertsStore.alerts.length === 0) {
    // Charge les alertes si le dropdown s'ouvre et qu'il n'y en a pas
    alertsStore.fetchAlerts()
  }
}

/**
 * Ferme le dropdown
 */
const closeDropdown = () => {
  isDropdownOpen.value = false
}

/**
 * Vérifie si une alerte est lue (utilise directement le store)
 */
const isRead = (alertId) => alertsStore.isRead(alertId)

/**
 * Gère le clic sur une alerte
 */
const handleAlertClick = async (alert) => {
  // Marque comme lue
  await alertsStore.markAsRead(alert.id)
  
  // Ferme le dropdown
  closeDropdown()
  
  // Navigue vers l'URL d'action si disponible
  if (alert.actionUrl) {
    router.push(alert.actionUrl)
  }
}

/**
 * Marque toutes les alertes comme lues
 */
const markAllAsRead = async () => {
  const unreadAlerts = alertsStore.alerts.filter(alert => !alertsStore.isRead(alert.id))
  for (const alert of unreadAlerts) {
    await alertsStore.markAsRead(alert.id)
  }
}

/**
 * Formate la date en temps relatif
 */
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return formatDate(date)
}


/**
 * Charge les alertes au montage
 */
onMounted(async () => {
  await alertsStore.fetchAlerts()
})

/**
 * Gère les clics en dehors du dropdown
 */
const handleClickOutside = (event) => {
  if (!isDropdownOpen.value) return
  
  // Vérifie si le clic est en dehors du conteneur (bouton + dropdown)
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closeDropdown()
  }
}

/**
 * Initialise les écouteurs d'événements
 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

/**
 * Nettoie les écouteurs d'événements
 */
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
