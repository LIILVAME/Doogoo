<template>
  <div class="mb-6">
    <!-- Barre de recherche -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="localSearchTerm"
          type="text"
          :placeholder="$t('properties.searchPlaceholder')"
          class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
          @input="$emit('search', localSearchTerm)"
        />
        <svg 
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Boutons de filtres -->
    <div class="flex flex-wrap items-center gap-3">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="handleFilterClick(filter.value)"
        :class="[
          'px-4 py-2 rounded-xl font-medium transition-all text-sm',
          activeFilter === filter.value
            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
            : 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
        ]"
      >
        {{ filter.label }}
        <span 
          v-if="filter.count !== undefined" 
          class="ml-2 px-2 py-0.5 rounded-full text-xs"
          :class="activeFilter === filter.value ? 'bg-violet-400/30' : 'bg-white/10'"
        >
          {{ filter.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { PROPERTY_STATUS } from '@/utils/constants'

const { t } = useI18n()

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  activeFilter: {
    type: String,
    default: 'all'
  },
  filterCounts: {
    type: Object,
    default: () => ({
      all: 0,
      occupied: 0,
      vacant: 0
    })
  }
})

const emit = defineEmits(['search', 'filter'])

const localSearchTerm = ref(props.searchTerm)

/**
 * Filtres avec compteurs dynamiques
 */
const filters = computed(() => [
  { label: t('common.all'), value: 'all', count: props.filterCounts.all },
  { label: t('properties.occupied'), value: PROPERTY_STATUS.OCCUPIED, count: props.filterCounts.occupied },
  { label: t('properties.free'), value: PROPERTY_STATUS.VACANT, count: props.filterCounts.vacant }
])

/**
 * Synchronise le terme de recherche local avec la prop
 */
watch(() => props.searchTerm, (newValue) => {
  localSearchTerm.value = newValue
})

/**
 * Gère le clic sur un filtre
 */
const handleFilterClick = (filterValue) => {
  emit('filter', filterValue)
}
</script>

