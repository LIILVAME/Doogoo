<template>
  <div>
    <!-- Liste des biens en grille responsive avec transition -->
    <TransitionGroup
      v-if="properties.length > 0"
      name="list"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        @edit="$emit('edit-property', property)"
        @delete="$emit('delete-property', property.id)"
      />
    </TransitionGroup>

    <!-- Empty state -->
    <EmptyState
      v-else
      :title="$t('properties.noPropertiesFound')"
      :description="
        hasFilters
          ? $t('properties.noPropertiesFoundWithFilters')
          : $t('properties.noPropertiesDescription')
      "
      icon="ri-building-line"
    >
      <template v-if="hasFilters" #action>
        <button
          @click="$emit('clear-filters')"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-indigo-500 text-white hover:bg-indigo-600 hover:opacity-90"
        >
          {{ $t('common.reset') }}
        </button>
      </template>
      <template v-else #action>
        <button
          @click="$emit('add-property')"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-indigo-500 text-white hover:bg-indigo-600 hover:opacity-90"
        >
          {{ $t('properties.addProperty') }}
        </button>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import PropertyCard from './PropertyCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

defineProps({
  properties: {
    type: Array,
    required: true,
    default: () => []
  },
  hasFilters: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit-property', 'delete-property', 'clear-filters', 'add-property'])
</script>
