<template>
  <DashboardLayout>
    <div class="p-6 lg:p-10 max-w-7xl mx-auto">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('alerts.title') }}</h1>
        <p class="text-zinc-400">{{ $t('alerts.subtitle') }}</p>
      </div>


      <!-- Statistiques des alertes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Alertes critiques -->
        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('alerts.criticalAlerts') }}</p>
              <p class="text-3xl font-bold text-white">
                {{ alertsStore.highSeverityAlerts.length }}
              </p>
            </div>
            <div class="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
              <AlertTriangle class="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </div>

        <!-- Alertes moyennes -->
        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('alerts.mediumAlerts') }}</p>
              <p class="text-3xl font-bold text-white">
                {{ alertsStore.mediumSeverityAlerts.length }}
              </p>
            </div>
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <AlertCircle class="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        <!-- Alertes faibles -->
        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('alerts.information') }}</p>
              <p class="text-3xl font-bold text-white">
                {{ alertsStore.lowSeverityAlerts.length }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Info class="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>


      <!-- État de chargement -->
      <div v-if="alertsStore.loading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"
        ></div>
        <p class="text-zinc-400">{{ $t('alerts.loading') }}</p>
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
      <div v-else-if="alertsStore.alerts.length > 0" class="space-y-4">
        <div
          v-for="alert in alertsStore.alerts"
          :key="alert.id"
          class="glass-panel rounded-2xl p-6"
          :class="{
            'border-rose-500/20': alert.severity === 'high',
            'border-amber-500/20': alert.severity === 'medium',
            'border-blue-500/20': alert.severity === 'low'
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20': alert.severity === 'high',
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20': alert.severity === 'medium',
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20': alert.severity === 'low'
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
                <h3 class="text-lg font-semibold text-white">{{ alert.title }}</h3>
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
              <router-link
                v-if="alert.actionUrl"
                :to="alert.actionUrl"
                class="px-4 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl text-sm font-medium transition-colors"
              >
                {{ $t('alerts.view') }}
              </router-link>
              <button
                @click="alertsStore.markAsResolved(alert.id)"
                class="px-4 py-2 bg-white/5 text-zinc-300 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-white/10"
              >
                {{ $t('alerts.markAsResolved') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune alerte -->
      <EmptyState
        v-else
        :title="$t('alerts.noAlerts')"
        :description="$t('alerts.allGood')"
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
import { onMounted } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import { useAlertsStore } from '@/stores/alertsStore'
import { formatDate } from '@/utils/formatters'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-vue-next'

const alertsStore = useAlertsStore()

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
