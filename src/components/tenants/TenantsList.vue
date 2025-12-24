<template>
  <div>
    <!-- Liste des locataires en grille responsive avec transition -->
      <TransitionGroup
        v-if="tenants.length > 0"
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
      <TenantCard
        v-for="tenant in tenants"
        :key="tenant.id"
        :tenant="tenant"
        @edit="$emit('edit-tenant', tenant)"
        @delete="$emit('delete-tenant', tenant.id)"
        @generate-lease="$emit('generate-lease', tenant)"
      />
    </TransitionGroup>

    <!-- Empty state -->
    <EmptyState
      v-else
      title="Aucun locataire trouvé"
      :description="hasFilters ? 'Essayez de modifier vos filtres' : 'Commencez par ajouter votre premier locataire'"
      icon="ri-user-line"
    >
      <template v-if="hasFilters" #action>
        <button
          @click="$emit('clear-filters')"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-indigo-500 text-white hover:bg-indigo-600 hover:opacity-90"
        >
          Réinitialiser les filtres
        </button>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import TenantCard from './TenantCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

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

defineEmits(['edit-tenant', 'delete-tenant', 'generate-lease', 'clear-filters'])
</script>
