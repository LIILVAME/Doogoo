<template>
  <div class="mb-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('dashboard.title') }}</h2>
    <p class="text-gray-600">{{ $t('dashboard.subtitle') }}</p>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6">
      <StatCard
        :value="stats.totalProperties.toString()"
        :label="$t('dashboard.totalProperties')"
        :icon="PropertiesIcon"
        icon-bg-class="bg-blue-100"
        icon-color-class="text-blue-600"
      />
      <StatCard
        :value="stats.occupiedProperties.toString()"
        :label="$t('dashboard.occupied')"
        :icon="OccupiedIcon"
        icon-bg-class="bg-green-100"
        icon-color-class="text-green-600"
      />
      <StatCard
        :value="stats.vacantProperties.toString()"
        :label="$t('dashboard.vacant')"
        :icon="VacantIcon"
        icon-bg-class="bg-gray-100"
        icon-color-class="text-gray-600"
      />
      <StatCard
        :value="formatCurrency(stats.totalRent || 0)"
        :label="$t('dashboard.monthlyRent')"
        :icon="RentIcon"
        icon-bg-class="bg-yellow-100"
        icon-color-class="text-yellow-600"
      />
    </div>

    <!-- Alerte retards -->
    <div
      v-if="stats.latePayments > 0"
      class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"
    >
      <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p class="font-semibold text-red-900">
          {{ $t('stats.alerts.latePayments.message', { count: stats.latePayments }) }}
        </p>
        <p class="text-sm text-red-700">{{ $t('stats.alerts.latePayments.link') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import StatCard from '../StatCard.vue'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  stats: {
    type: Object,
    required: true
  }
})

// Icône : Appartements
const PropertiesIcon = () =>
  h(
    'svg',
    {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'w-full h-full'
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      })
    ]
  )

// Icône : Occupé
const OccupiedIcon = () =>
  h(
    'svg',
    {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'w-full h-full'
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]
  )

// Icône : Libre
const VacantIcon = () =>
  h(
    'svg',
    {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'w-full h-full'
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
      })
    ]
  )

// Icône : Loyers
const RentIcon = () =>
  h(
    'svg',
    {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
      class: 'w-full h-full'
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z'
      })
    ]
  )
</script>
