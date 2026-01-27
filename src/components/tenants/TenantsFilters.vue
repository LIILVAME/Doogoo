<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
    <!-- Barre de recherche Premium -->
    <div class="relative flex-1 max-w-md group">
      <div
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-brand text-zinc-400"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        v-model="localSearchTerm"
        :placeholder="$t('common.search')"
        @input="$emit('search', localSearchTerm)"
        class="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all shadow-sm hover:border-zinc-200"
      />
    </div>

    <!-- Segmented Control Filtres -->
    <div
      class="flex p-1 bg-zinc-100/50 rounded-2xl self-start md:self-center border border-zinc-100"
    >
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="handleFilterClick(filter.value)"
        class="px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
        :class="
          activeFilter === filter.value
            ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100'
            : 'text-zinc-500 hover:text-zinc-700'
        "
      >
        {{ filter.label }}
        <span
          v-if="filter.count !== undefined"
          class="px-1.5 py-0.5 rounded-md text-[10px] transition-colors"
          :class="
            activeFilter === filter.value
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-transparent text-zinc-400'
          "
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
import { PAYMENT_STATUS } from '@/utils/constants'

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
      onTime: 0,
      late: 0
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
  {
    label: t('status.onTime'),
    value: PAYMENT_STATUS.ON_TIME,
    count: props.filterCounts.onTime
  },
  { label: t('status.late'), value: PAYMENT_STATUS.LATE, count: props.filterCounts.late }
])

/**
 * Synchronise le terme de recherche local avec la prop
 */
watch(
  () => props.searchTerm,
  newValue => {
    localSearchTerm.value = newValue
  }
)

/**
 * Gère le clic sur un filtre
 */
const handleFilterClick = filterValue => {
  emit('filter', filterValue)
}
</script>
