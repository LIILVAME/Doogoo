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
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <!-- Total -->
      <div
        class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
      >
        <div
          class="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div>
            <p class="text-sm font-medium text-zinc-400 mb-1">Total</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.totalTenants }}</p>
          </div>
          <div
            class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-violet-500 text-violet-200"
          >
            <Users class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- À jour -->
      <div
        class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
      >
        <div
          class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div>
            <p class="text-sm font-medium text-zinc-400 mb-1">{{ $t('status.onTime') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.onTimeTenants }}</p>
          </div>
          <div
            class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-emerald-500 text-emerald-200"
          >
            <CheckCircle class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- En retard -->
      <div
        class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
      >
        <div
          class="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-500"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div>
            <p class="text-sm font-medium text-zinc-400 mb-1">{{ $t('status.late') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">{{ stats.lateTenants }}</p>
          </div>
          <div
            class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-rose-500 text-rose-200"
          >
            <AlertCircle class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- Loyers totaux -->
      <div
        class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
      >
        <div
          class="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"
        ></div>
        <div class="flex items-center justify-between relative z-10">
          <div>
            <p class="text-sm font-medium text-zinc-400 mb-1">{{ $t('tenants.totalRent') }}</p>
            <p class="text-2xl font-bold text-white tracking-tight">
              {{ formatCurrency(stats.totalRent) }}
            </p>
          </div>
          <div
            class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg bg-opacity-10 bg-amber-500 text-amber-200"
          >
            <Wallet class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

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
import { formatCurrency } from '@/utils/formatters'
import { Users, CheckCircle, AlertCircle, Wallet, Plus, Search } from 'lucide-vue-next'

defineProps({
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

defineEmits(['add-tenant', 'update:searchQuery'])
</script>
