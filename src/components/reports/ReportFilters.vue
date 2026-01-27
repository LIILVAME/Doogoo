<template>
  <div class="bg-white border border-zinc-100 rounded-2xl p-6 mb-8 shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
      <!-- Période (4 cols) -->
      <div class="md:col-span-3">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          {{ $t('reports.filters.period') }}
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400"
          >
            <Calendar class="w-4 h-4" />
          </div>
          <select
            :value="selectedMonth"
            @change="$emit('update:period', $event.target.value)"
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all appearance-none cursor-pointer hover:bg-white"
          >
            <option v-for="month in availableMonths" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400"
          >
            <ChevronDown class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Type de rapport (3 cols) -->
      <div class="md:col-span-3">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          {{ $t('reports.filters.type') }}
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400"
          >
            <FileText class="w-4 h-4" />
          </div>
          <select
            :value="reportType"
            @change="$emit('update:reportType', $event.target.value)"
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all appearance-none cursor-pointer hover:bg-white"
          >
            <option value="global">{{ $t('reports.types.global') }}</option>
            <option value="monthly">{{ $t('reports.types.monthly') }}</option>
            <option value="rental-status">
              {{ $t('reports.types.rentalStatus') }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400"
          >
            <ChevronDown class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Filtrer par bien (4 cols) -->
      <div class="md:col-span-4">
        <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          {{ $t('reports.filters.property') }}
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400"
          >
            <Building2 class="w-4 h-4" />
          </div>
          <select
            :value="selectedProperty"
            @change="$emit('update:property', $event.target.value)"
            class="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all appearance-none cursor-pointer hover:bg-white"
          >
            <option value="all">{{ $t('reports.filters.allProperties') }}</option>
            <option v-for="property in properties" :key="property.id" :value="property.id">
              {{ property.name }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400"
          >
            <ChevronDown class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Bouton Actualiser (2 cols) -->
      <div class="md:col-span-2">
        <Button
          class="w-full h-[42px] shadow-lg shadow-brand/10"
          variant="primary"
          :loading="loading"
          @click="$emit('refresh')"
        >
          <span v-if="!loading" class="flex items-center gap-2">
            <RefreshCw class="w-4 h-4" />
            {{ $t('reports.filters.refresh') }}
          </span>
          <span v-else>{{ $t('reports.loading') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utilise $t dans le template, pas besoin de t dans le script
import Button from '@/components/ui/Button.vue'
import { Calendar, FileText, Building2, ChevronDown, RefreshCw } from 'lucide-vue-next'

defineProps({
  selectedMonth: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    default: 'global'
  },
  selectedProperty: {
    type: String,
    default: 'all'
  },
  properties: {
    type: Array,
    default: () => []
  },
  availableMonths: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:period', 'update:reportType', 'update:property', 'refresh'])
</script>
