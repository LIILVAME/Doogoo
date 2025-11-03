<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main id="main-content" ref="mainElement" class="flex-1 overflow-y-auto" role="main">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />
      <div
        class="max-w-7xl mx-auto px-2 sm:px-3 lg:px-6 xl:px-8 pt-16 pb-8 md:px-10 md:pt-10 md:pb-10"
      >
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('alerts.title') }}</h1>
          <p class="text-gray-600">{{ $t('alerts.subtitle') }}</p>
        </div>

        <!-- Statistiques des alertes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Alertes critiques -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-red-600 mb-1">{{ $t('alerts.criticalAlerts') }}</p>
                <p class="text-3xl font-bold text-red-700">
                  {{ alertsStore.highSeverityAlerts.length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Alertes moyennes -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-orange-600 mb-1">{{ $t('alerts.mediumAlerts') }}</p>
                <p class="text-3xl font-bold text-orange-700">
                  {{ alertsStore.mediumSeverityAlerts.length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Alertes faibles -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 mb-1">{{ $t('alerts.information') }}</p>
                <p class="text-3xl font-bold text-blue-700">
                  {{ alertsStore.lowSeverityAlerts.length }}
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- État de chargement -->
        <div v-if="alertsStore.loading" class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"
          ></div>
          <p class="text-gray-500">{{ $t('alerts.loading') }}</p>
        </div>

        <!-- Erreur -->
        <div
          v-else-if="alertsStore.error"
          class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-red-700 font-medium">
              {{ $t('common.errorWithColon') }} {{ alertsStore.error }}
            </p>
          </div>
        </div>

        <!-- Liste des alertes -->
        <div v-else-if="alertsStore.alerts.length > 0" class="space-y-4">
          <div
            v-for="alert in alertsStore.alerts"
            :key="alert.id"
            class="bg-white rounded-lg shadow-sm border p-6"
            :class="{
              'border-red-300 bg-red-50': alert.severity === 'high',
              'border-orange-300 bg-orange-50': alert.severity === 'medium',
              'border-blue-300 bg-blue-50': alert.severity === 'low'
            }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-red-100 text-red-700': alert.severity === 'high',
                      'bg-orange-100 text-orange-700': alert.severity === 'medium',
                      'bg-blue-100 text-blue-700': alert.severity === 'low'
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
                  <h3 class="text-lg font-semibold text-gray-900">{{ alert.title }}</h3>
                </div>
                <p class="text-gray-700 mb-3">{{ alert.message }}</p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
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
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  {{ $t('alerts.view') }}
                </router-link>
                <button
                  @click="alertsStore.markAsResolved(alert.id)"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
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
              class="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-green-500 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </template>
        </EmptyState>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import Sidebar from '../components/Sidebar.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import { useAlertsStore } from '@/stores/alertsStore'
import { formatDate } from '@/utils/formatters'

const alertsStore = useAlertsStore()

// Pull-to-refresh
const mainElement = ref(null)
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
