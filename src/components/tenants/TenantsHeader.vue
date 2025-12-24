<template>
  <div class="mb-8">
    <!-- Titre et bouton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ $t('tenants.title') }}</h1>
        <p class="text-zinc-400">{{ $t('tenants.subtitle') }}</p>
      </div>
      <button
        @click="$emit('add-tenant')"
        class="btn-primary flex items-center justify-center shrink-0 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-white/5"
      >
        <Plus class="w-5 h-5 mr-2" />
        {{ $t('tenants.addTenant') }}
      </button>
    </div>

    <!-- Statistiques globales -->
    <StatsGrid :stats="statsArray" />

    <!-- Barre de recherche -->
    <div class="mt-6 relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search class="h-5 w-5 text-zinc-400" />
      </div>
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-zinc-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-colors"
        :placeholder="$t('common.search')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { formatCurrency } from '@/utils/formatters'
import { Users, CheckCircle, AlertCircle, Wallet, Plus, Search } from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalTenants: 0,
      onTimeTenants: 0,
      lateTenants: 0,
      totalRent: 0
    })
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()

const statsArray = computed(() => [
  {
    label: t('common.all'),
    value: props.stats.totalTenants.toString(),
    icon: Users,
    glowColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
    iconBgColor: 'bg-opacity-10 bg-violet-500',
    iconColor: 'text-violet-200'
  },
  {
    label: t('status.onTime'),
    value: props.stats.onTimeTenants.toString(),
    icon: CheckCircle,
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBgColor: 'bg-opacity-10 bg-emerald-500',
    iconColor: 'text-emerald-200'
  },
  {
    label: t('status.late'),
    value: props.stats.lateTenants.toString(),
    icon: AlertCircle,
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    iconBgColor: 'bg-opacity-10 bg-rose-500',
    iconColor: 'text-rose-200'
  },
  {
    label: t('tenants.totalRent'),
    value: formatCurrency(props.stats.totalRent),
    icon: Wallet,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-200'
  }
])

defineEmits(['add-tenant', 'update:searchQuery'])
</script>
