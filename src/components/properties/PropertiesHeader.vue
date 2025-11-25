<template>
  <div class="mb-8">
    <!-- Titre et bouton -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ $t('properties.myProperties') }}</h1>
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
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <!-- Total -->
      <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-400 mb-1 truncate">{{ $t('common.all') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.totalProperties }}</p>
          </div>
          <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-violet-500 text-violet-200">
            <Building2 class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Occupés -->
      <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-400 mb-1 truncate">{{ $t('properties.occupied') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.occupiedProperties }}</p>
          </div>
          <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-emerald-500 text-emerald-200">
            <Users class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Libres -->
      <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-zinc-500/10 rounded-full blur-3xl group-hover:bg-zinc-500/20 transition-all duration-500"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-400 mb-1 truncate">{{ $t('properties.free') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.vacantProperties }}</p>
          </div>
          <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-zinc-500 text-zinc-200">
            <Home class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Loyers totaux -->
      <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-400 mb-1 truncate">{{ $t('dashboard.monthlyRent') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight truncate">{{ formatCurrency(stats.totalRent) }}</p>
          </div>
          <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-amber-500 text-amber-200">
            <Wallet class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters'
import { Building2, Users, Home, Wallet, Plus } from 'lucide-vue-next'

defineProps({
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

defineEmits(['add-property'])
</script>

