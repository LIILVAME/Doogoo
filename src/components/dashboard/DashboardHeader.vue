<template>
  <div class="mb-8">
    <h2 class="text-3xl font-bold text-white mb-2">{{ $t('dashboard.title') }}</h2>
    <p class="text-zinc-400">{{ $t('dashboard.subtitle') }}</p>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6">
      <StatCard
        :value="stats.totalProperties.toString()"
        :label="$t('dashboard.totalProperties')"
        :icon="Building2"
        icon-bg-class="bg-violet-500"
        icon-color-class="text-violet-200"
      />
      <StatCard
        :value="stats.occupiedProperties.toString()"
        :label="$t('dashboard.occupied')"
        :icon="Users"
        icon-bg-class="bg-emerald-500"
        icon-color-class="text-emerald-200"
      />
      <StatCard
        :value="stats.vacantProperties.toString()"
        :label="$t('dashboard.vacant')"
        :icon="Home"
        icon-bg-class="bg-zinc-500"
        icon-color-class="text-zinc-200"
      />
      <StatCard
        :value="formatCurrency(stats.totalRent || 0)"
        :label="$t('dashboard.monthlyRent')"
        :icon="Wallet"
        icon-bg-class="bg-amber-500"
        icon-color-class="text-amber-200"
      />
    </div>

    <!-- Alerte retards -->
    <div
      v-if="stats.latePayments > 0"
      class="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center"
    >
      <AlertCircle class="w-6 h-6 text-rose-400 mr-3" />
      <div>
        <p class="font-semibold text-rose-200">
          {{ $t('stats.alerts.latePayments.message', { count: stats.latePayments }) }}
        </p>
        <p class="text-sm text-rose-300/80 hover:text-rose-200 cursor-pointer transition-colors">{{ $t('stats.alerts.latePayments.link') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import StatCard from '../StatCard.vue'
import { formatCurrency } from '@/utils/formatters'
import { Building2, Users, Home, Wallet, AlertCircle } from 'lucide-vue-next'

defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>
