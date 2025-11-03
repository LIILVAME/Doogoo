<template>
  <div
    class="card cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between min-h-[280px]"
  >
    <!-- Contenu principal -->
    <div class="flex-1">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ tenant.name }}</h3>
          <p class="text-sm text-gray-600 mb-1">{{ tenant.property }}</p>
          <p class="text-xs text-gray-400">{{ tenant.propertyCity }}</p>
        </div>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- Informations du locataire -->
      <div class="mt-4 space-y-3">
        <div>
          <p class="text-xs text-gray-500 mb-1">{{ $t('tenants.entryDate') }}</p>
          <p class="text-sm font-medium text-gray-900">
            {{ formatDate(tenant.entryDate, { shortMonth: true }) }}
          </p>
        </div>

        <div v-if="tenant.exitDate">
          <p class="text-xs text-gray-500 mb-1">{{ $t('tenants.exitDate') }}</p>
          <p class="text-sm font-medium text-gray-900">
            {{ formatDate(tenant.exitDate, { shortMonth: true }) }}
          </p>
        </div>

        <div class="pt-3 border-t border-gray-100">
          <p class="text-xs text-gray-500 mb-1">{{ $t('properties.monthlyRent') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatCurrency(tenant.rent) }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
      <button
        @click.stop="$emit('edit', tenant)"
        class="flex-1 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        {{ $t('common.edit') }}
      </button>
      <button
        @click.stop="$emit('delete', tenant.id)"
        class="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
      >
        <svg class="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {{ $t('common.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { PAYMENT_STATUS, STATUS_LABELS, STATUS_CLASSES } from '@/utils/constants'

// Utilise $t dans le template, pas besoin de t dans le script

const props = defineProps({
  tenant: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

/**
 * Classe CSS selon le statut de paiement
 */
const statusClass = computed(() => {
  return STATUS_CLASSES[props.tenant.status] || STATUS_CLASSES[PAYMENT_STATUS.ON_TIME]
})

/**
 * Texte du statut de paiement
 */
const statusText = computed(() => {
  return STATUS_LABELS[props.tenant.status] || STATUS_LABELS[PAYMENT_STATUS.ON_TIME]
})
</script>
