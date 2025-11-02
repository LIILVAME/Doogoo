<template>
  <div>
    <!-- Liste des locataires en grille responsive -->
    <div v-if="tenants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TenantCard
        v-for="tenant in tenants"
        :key="tenant.id"
        :tenant="tenant"
        @edit="$emit('edit-tenant', tenant)"
        @delete="$emit('delete-tenant', tenant.id)"
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <p class="text-gray-500 text-lg font-medium mb-2">Aucun locataire trouvé</p>
      <p class="text-gray-400 text-sm mb-4">
        <span v-if="hasFilters">Essayez de modifier vos filtres</span>
        <span v-else>Commencez par ajouter votre premier locataire</span>
      </p>
      <button
        v-if="hasFilters"
        @click="$emit('clear-filters')"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        Réinitialiser les filtres
      </button>
    </div>
  </div>
</template>

<script setup>
import TenantCard from './TenantCard.vue'

defineProps({
  tenants: {
    type: Array,
    required: true,
    default: () => []
  },
  hasFilters: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit-tenant', 'delete-tenant', 'clear-filters'])
</script>
