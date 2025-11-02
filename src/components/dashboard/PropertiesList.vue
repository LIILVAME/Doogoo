<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4 sm:mb-6">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
        {{ $t('properties.myProperties') }}
      </h3>
      <!-- Bouton hybride : Modal en v0.1.0, redirection en v0.2.0 -->
      <button @click="handleAddClick" class="hidden lg:flex btn-primary items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ $t('properties.addProperty') }}
      </button>

      <!-- TODO v0.2.0 : Remplacer par redirection vers /biens?mode=add -->
      <!--
      <button 
        @click="$emit('redirect-to-add')"
        class="btn-primary flex items-center"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un bien
      </button>
      -->
    </div>

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
    <div v-else class="text-center py-8 text-gray-500">
      <p>{{ $t('properties.noPropertiesFound') }}</p>
    </div>
  </div>
</template>

<script setup>
import PropertyCard from '../properties/PropertyCard.vue'

defineProps({
  properties: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add-click', 'edit-property', 'delete-property'])

/**
 * Gère le clic sur le bouton "Ajouter un bien"
 * Émet un événement pour ouvrir le modal (v0.1.0)
 * TODO v0.2.0 : Remplacer par redirection vers /biens?mode=add
 */
const handleAddClick = () => {
  emit('add-click')
}
</script>
