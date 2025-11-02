<template>
  <div>
    <!-- Liste des biens en grille responsive -->
    <div
      v-if="properties.length > 0"
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
    >
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        @edit="$emit('edit-property', property)"
        @delete="$emit('delete-property', property.id)"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <svg
        class="w-20 h-20 mx-auto mb-4 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <p class="text-gray-500 text-lg font-medium mb-2">{{ $t('properties.noPropertiesFound') }}</p>
      <p class="text-gray-400 text-sm mb-4">
        <span v-if="hasFilters">{{ $t('properties.noPropertiesFoundWithFilters') }}</span>
        <span v-else>{{ $t('properties.noPropertiesDescription') }}</span>
      </p>
      <button
        v-if="hasFilters"
        @click="$emit('clear-filters')"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        {{ $t('common.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import PropertyCard from './PropertyCard.vue'

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

defineEmits(['edit-property', 'delete-property', 'clear-filters'])
</script>
