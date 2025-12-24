<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-white mb-4">Métriques Financières</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
      <!-- Revenu Total du Mois -->
      <StatCard
        :value="formatCurrency(metrics.financial.totalRevenue)"
        label="Revenu du mois"
        :icon="TrendingUp"
        icon-bg-class="bg-emerald-500"
        icon-color-class="text-emerald-200"
        :loading="loading"
        trend="up"
        trend-value="Ce mois"
      />
      <!-- Revenu en Attente -->
      <StatCard
        :value="formatCurrency(metrics.financial.pendingRevenue)"
        label="Revenu en attente"
        :icon="Clock"
        icon-bg-class="bg-amber-500"
        icon-color-class="text-amber-200"
        :loading="loading"
        trend="neutral"
        trend-value="En cours"
      />
      <!-- Taux d'Occupation -->
      <StatCard
        :value="`${metrics.property.occupancyRate}%`"
        label="Taux d'occupation"
        :icon="BarChart3"
        icon-bg-class="bg-violet-500"
        icon-color-class="text-violet-200"
        :loading="loading"
        :trend="metrics.property.occupancyRate >= 80 ? 'up' : 'neutral'"
        :trend-value="metrics.property.occupancyRate >= 80 ? 'Excellent' : 'À améliorer'"
      />
    </div>
  </div>
</template>

<script setup>
import { useDashboardMetrics } from '@/composables/useDashboardMetrics'
import { formatCurrency } from '@/utils/formatters'
import StatCard from '@/components/ui/StatCard.vue'
import { TrendingUp, Clock, BarChart3 } from 'lucide-vue-next'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const { metrics } = useDashboardMetrics()
</script>
