<template>
  <div class="mb-8">
    <!-- Titre et bouton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
          {{ $t('properties.myProperties') }}
        </h1>
        <p class="text-zinc-400">{{ $t('properties.subtitle') }}</p>
      </div>
      <button
        @click="$emit('add-property')"
        class="btn-primary flex items-center justify-center shrink-0 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-white/5"
      >
        <Plus class="w-5 h-5 mr-2" />
        {{ $t('properties.addProperty') }}
      </button>
    </div>

    <!-- Statistiques globales -->
    <StatsGrid :stats="statsArray" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { formatCurrency } from '@/utils/formatters'
import { Building2, Users, Home, Wallet, Plus } from 'lucide-vue-next'

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalProperties: 0,
      occupiedProperties: 0,
      vacantProperties: 0,
      totalRent: 0
    })
  }
})

const { t } = useI18n()

const statsArray = computed(() => [
  {
    label: t('common.all'),
    value: props.stats.totalProperties.toString(),
    icon: Building2,
    glowColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
    iconBgColor: 'bg-opacity-10 bg-violet-500',
    iconColor: 'text-violet-200'
  },
  {
    label: t('properties.occupied'),
    value: props.stats.occupiedProperties.toString(),
    icon: Users,
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBgColor: 'bg-opacity-10 bg-emerald-500',
    iconColor: 'text-emerald-200'
  },
  {
    label: t('properties.free'),
    value: props.stats.vacantProperties.toString(),
    icon: Home,
    glowColor: 'bg-zinc-500/10 group-hover:bg-zinc-500/20',
    iconBgColor: 'bg-opacity-10 bg-zinc-500',
    iconColor: 'text-zinc-200'
  },
  {
    label: t('dashboard.rentCollected'),
    value: formatCurrency(props.stats.totalRent),
    icon: Wallet,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-200'
  }
])

defineEmits(['add-property'])
</script>
