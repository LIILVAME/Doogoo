<template>
  <div class="mb-6">
    <!-- Barre de recherche -->
    <div class="mb-4">
      <Input
        v-model="localSearchTerm"
        :placeholder="$t('properties.searchPlaceholder')"
        @update:model-value="$emit('search', $event)"
      >
        <template #icon>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </template>
      </Input>
    </div>

    <!-- Boutons de filtres -->
    <div class="flex flex-wrap items-center gap-3">
      <Button
        v-for="filter in filters"
        :key="filter.value"
        @click="handleFilterClick(filter.value)"
        :variant="activeFilter === filter.value ? 'primary' : 'ghost'"
        size="sm"
        class="rounded-xl"
        :class="activeFilter !== filter.value ? 'bg-bg-card border border-border-default' : ''"
      >
        {{ filter.label }}
        <span
          v-if="filter.count !== undefined"
          class="ml-2 px-2 py-0.5 rounded-full text-xs transition-colors"
          :class="
            activeFilter === filter.value
              ? 'bg-white/20 text-white'
              : 'bg-bg-subtle text-text-muted'
          "
        >
          {{ filter.count }}
        </span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { PROPERTY_STATUS } from '@/utils/constants'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

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
  {
    label: t('properties.occupied'),
    value: PROPERTY_STATUS.OCCUPIED,
    count: props.filterCounts.occupied
  },
  { label: t('properties.free'), value: PROPERTY_STATUS.VACANT, count: props.filterCounts.vacant }
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
