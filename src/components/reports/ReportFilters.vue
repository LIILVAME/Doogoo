<template>
  <div class="glass-panel rounded-2xl p-5 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Période -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">
          {{ $t('reports.filters.period') }}
        </label>
        <select
          :value="selectedMonth"
          @change="$emit('update:period', $event.target.value)"
          class="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
        >
          <option v-for="month in availableMonths" :key="month.value" :value="month.value" class="bg-zinc-900">
            {{ month.label }}
          </option>
        </select>
      </div>

      <!-- Type de rapport -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">
          {{ $t('reports.filters.type') }}
        </label>
        <select
          :value="reportType"
          @change="$emit('update:reportType', $event.target.value)"
          class="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
        >
          <option value="global" class="bg-zinc-900">{{ $t('reports.types.global') }}</option>
          <option value="monthly" class="bg-zinc-900">{{ $t('reports.types.monthly') }}</option>
          <option value="rental-status" class="bg-zinc-900">{{ $t('reports.types.rentalStatus') }}</option>
        </select>
      </div>

      <!-- Filtrer par bien -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">
          {{ $t('reports.filters.property') }}
        </label>
        <select
          :value="selectedProperty"
          @change="$emit('update:property', $event.target.value)"
          class="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors"
        >
          <option value="all" class="bg-zinc-900">{{ $t('reports.filters.allProperties') }}</option>
          <option v-for="property in properties" :key="property.id" :value="property.id" class="bg-zinc-900">
            {{ property.name }}
          </option>
        </select>
      </div>

      <!-- Bouton Actualiser -->
      <div class="flex items-end">
        <button
          @click="$emit('refresh')"
          :disabled="loading"
          class="w-full px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
        >
          <span v-if="!loading">{{ $t('reports.filters.refresh') }}</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t('reports.loading') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utilise $t dans le template, pas besoin de t dans le script

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
