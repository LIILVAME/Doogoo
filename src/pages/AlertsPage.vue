<template>
  <DashboardLayout>
    <div class="p-6 lg:p-8 xl:p-10 w-full">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />

      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">{{ $t('alerts.title') }}</h1>
            <p class="text-zinc-400">{{ $t('alerts.subtitle') }}</p>
          </div>
          <button
            v-if="filteredAlerts.length > 0 && unreadCount > 0"
            @click="alertsStore.markAllAsRead()"
            class="px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 rounded-xl text-sm font-medium transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap items-center gap-2 mb-6">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="
              activeFilter === filter.id
                ? filter.activeClass
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
            "
          >
            {{ filter.label }}
            <span
              v-if="filter.count > 0"
              class="ml-2 px-1.5 py-0.5 rounded-full text-xs"
              :class="
                activeFilter === filter.id
                  ? filter.badgeActiveClass
                  : 'bg-white/10 text-zinc-500'
              "
            >
              {{ filter.count }}
            </span>
          </button>
        </div>

        <!-- Statistiques des alertes -->
        <StatsGrid :stats="alertStatsArray" />
      </div>

      <!-- État de chargement avec skeletons -->
      <div v-if="alertsStore.loading" class="space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="glass-panel rounded-2xl p-6 animate-pulse"
        >
          <!-- Header skeleton -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="h-4 bg-zinc-800 rounded w-24 mb-3"></div>
              <div class="h-6 bg-zinc-800 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
            <div class="h-8 bg-zinc-800 rounded w-20"></div>
          </div>
          <!-- Content skeleton -->
          <div class="space-y-2 mt-4">
            <div class="h-3 bg-zinc-800 rounded w-full"></div>
            <div class="h-3 bg-zinc-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Erreur -->
      <div
        v-else-if="alertsStore.error"
        class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6"
      >
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-rose-500 mr-2" />
          <p class="text-rose-400 font-medium">
            {{ $t('common.errorWithColon') }} {{ alertsStore.error }}
          </p>
        </div>
      </div>

      <!-- Liste des alertes -->
      <div v-else-if="filteredAlerts.length > 0" class="space-y-4">
        <div
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="glass-panel rounded-2xl p-6 transition-all"
          :class="{
            'border-rose-500/20 bg-rose-500/5': alert.severity === 'high' && !alertsStore.isRead(alert.id),
            'border-amber-500/20 bg-amber-500/5': alert.severity === 'medium' && !alertsStore.isRead(alert.id),
            'border-blue-500/20 bg-blue-500/5': alert.severity === 'low' && !alertsStore.isRead(alert.id),
            'border-white/5 opacity-75': alertsStore.isRead(alert.id)
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20':
                      alert.severity === 'high',
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20':
                      alert.severity === 'medium',
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20':
                      alert.severity === 'low'
                  }"
                >
                  {{
                    alert.severity === 'high'
                      ? $t('alerts.severity.critical')
                      : alert.severity === 'medium'
                        ? $t('alerts.severity.important')
                        : $t('alerts.severity.info')
                  }}
                </span>
                <h3
                  class="text-lg font-semibold text-white flex items-center gap-2"
                  :class="{
                    'font-bold': !alertsStore.isRead(alert.id),
                    'text-zinc-400': alertsStore.isRead(alert.id)
                  }"
                >
                  {{ alert.title }}
                  <span
                    v-if="!alertsStore.isRead(alert.id)"
                    class="w-2 h-2 rounded-full bg-violet-500"
                  ></span>
                </h3>
              </div>
              <p class="text-zinc-300 mb-3">{{ alert.message }}</p>
              <div class="flex items-center gap-4 text-sm text-zinc-400">
                <span v-if="alert.date">
                  {{ $t('common.date') }} : {{ formatDate(alert.date) }}
                </span>
                <span v-if="alert.daysLate !== undefined">
                  {{ $t('alerts.daysLate') }} : {{ alert.daysLate }} {{ $t('common.days') }}
                </span>
                <span v-if="alert.daysOverdue !== undefined">
                  {{ $t('alerts.daysOverdue') }} : {{ alert.daysOverdue }} {{ $t('common.days') }}
                </span>
                <span v-if="alert.daysUntilExit !== undefined">
                  {{ $t('alerts.daysUntil') }} : {{ alert.daysUntilExit }} {{ $t('common.days') }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button
                v-if="!alertsStore.isRead(alert.id)"
                @click="alertsStore.markAsRead(alert.id)"
                class="px-3 py-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                title="Marquer comme lu"
              >
                Marquer comme lu
              </button>
              <router-link
                v-if="alert.actionUrl"
                :to="alert.actionUrl"
                class="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl text-sm font-medium transition-colors"
              >
                {{ $t('alerts.view') }}
              </router-link>
              <Button variant="secondary" size="sm" @click="alertsStore.markAsResolved(alert.id)">
                {{ $t('alerts.markAsResolved') }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune alerte -->
      <EmptyState
        v-else
        :title="activeFilter === 'all' ? $t('alerts.noAlerts') : 'Aucune alerte dans cette catégorie'"
        :description="activeFilter === 'all' ? $t('alerts.allGood') : 'Essayez un autre filtre'"
        illustration="default"
      >
        <template #illustration>
          <div
            class="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20"
          >
            <CheckCircle class="w-12 h-12 text-emerald-500" />
          </div>
        </template>
      </EmptyState>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import Button from '@/components/ui/Button.vue'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { useAlertsStore } from '@/stores/alertsStore'
import { formatDate } from '@/utils/formatters'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-vue-next'

const { t } = useI18n()

const alertsStore = useAlertsStore()

// Filtre actif
const activeFilter = ref('all')

/**
 * Computed : Alertes filtrées et triées chronologiquement
 */
const filteredAlerts = computed(() => {
  let filtered = [...alertsStore.alerts]

  // Applique le filtre
  if (activeFilter.value === 'critical') {
    filtered = filtered.filter(a => a.severity === 'high')
  } else if (activeFilter.value === 'info') {
    filtered = filtered.filter(a => a.severity === 'low')
  }
  // 'all' : pas de filtre

  // Trie par date (plus récentes en premier)
  filtered.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA // Plus récentes en premier
  })

  return filtered
})

/**
 * Computed : Nombre d'alertes non lues
 */
const unreadCount = computed(() => {
  return alertsStore.alerts.filter(alert => !alertsStore.isRead(alert.id)).length
})

/**
 * Filtres disponibles
 */
const filters = computed(() => [
  {
    id: 'all',
    label: 'Toutes',
    count: alertsStore.alerts.length,
    activeClass: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    badgeActiveClass: 'bg-violet-500/20 text-violet-300'
  },
  {
    id: 'critical',
    label: 'Critiques',
    count: alertsStore.highSeverityAlerts.length,
    activeClass: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    badgeActiveClass: 'bg-rose-500/20 text-rose-300'
  },
  {
    id: 'info',
    label: 'Informations',
    count: alertsStore.lowSeverityAlerts.length,
    activeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    badgeActiveClass: 'bg-blue-500/20 text-blue-300'
  }
])

/**
 * Stats pour StatsGrid
 */
const alertStatsArray = computed(() => [
  {
    label: t('alerts.criticalAlerts'),
    value: alertsStore.highSeverityAlerts.length.toString(),
    icon: AlertTriangle,
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    iconBgColor: 'bg-opacity-10 bg-rose-500',
    iconColor: 'text-rose-500'
  },
  {
    label: t('alerts.mediumAlerts'),
    value: alertsStore.mediumSeverityAlerts.length.toString(),
    icon: AlertCircle,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-500'
  },
  {
    label: t('alerts.information'),
    value: alertsStore.lowSeverityAlerts.length.toString(),
    icon: Info,
    glowColor: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    iconBgColor: 'bg-opacity-10 bg-blue-500',
    iconColor: 'text-blue-500'
  }
])

const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  async () => {
    // Force le rafraîchissement des alertes
    await alertsStore.fetchAlerts()
  },
  { threshold: 80 }
)

/**
 * Charge les alertes au montage
 */
onMounted(async () => {
  await alertsStore.fetchAlerts()
})
</script>
