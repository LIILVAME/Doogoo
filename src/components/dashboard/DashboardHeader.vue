<template>
  <div>
    <h2 class="text-3xl font-bold text-white mb-2">{{ $t('dashboard.title') }}</h2>
    <p class="text-zinc-400">{{ $t('dashboard.subtitle') }}</p>

    <!-- Statistiques globales -->
    <StatsGrid :stats="statsArray" />

    <!-- Alerte retards -->
    <div
      v-if="!loading && stats.latePayments > 0"
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
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { formatCurrency } from '@/utils/formatters'
import { Building2, Users, Home, Wallet, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()

const statsArray = computed(() => [
  {
    label: t('dashboard.totalProperties'),
    value: props.loading ? '...' : props.stats.totalProperties.toString(),
    icon: Building2,
    glowColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
    iconBgColor: 'bg-opacity-10 bg-violet-500',
    iconColor: 'text-violet-200'
  },
  {
    label: t('dashboard.occupied'),
    value: props.loading ? '...' : props.stats.occupiedProperties.toString(),
    icon: Users,
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBgColor: 'bg-opacity-10 bg-emerald-500',
    iconColor: 'text-emerald-200'
  },
  {
    label: t('dashboard.vacant'),
    value: props.loading ? '...' : props.stats.vacantProperties.toString(),
    icon: Home,
    glowColor: 'bg-zinc-500/10 group-hover:bg-zinc-500/20',
    iconBgColor: 'bg-opacity-10 bg-zinc-500',
    iconColor: 'text-zinc-200'
  },
  {
    label: t('dashboard.monthlyRent'),
    value: props.loading ? '...' : formatCurrency(props.stats.totalRent || 0),
    icon: Wallet,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-200'
  }
])
</script>
