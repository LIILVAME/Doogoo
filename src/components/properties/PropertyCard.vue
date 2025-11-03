<template>
  <div
    class="card cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] lg:min-h-[350px]"
  >
    <!-- Contenu principal (flex-1 pour occuper l'espace disponible) -->
    <div class="flex-1 flex flex-col">
      <!-- En-tête avec nom, adresse, statut -->
      <div class="flex items-start justify-between mb-2 sm:mb-3">
        <div class="flex-1 min-w-0 pr-2">
          <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 truncate">
            {{ property.name }}
          </h3>
          <p class="text-xs text-gray-500 mb-1 truncate">{{ property.city }}</p>
          <p class="text-xs text-gray-400 mb-2 line-clamp-2 hidden sm:block">
            {{ property.address }}
          </p>
          <span
            class="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
            :class="statusClass"
          >
            {{ statusText }}
          </span>
        </div>
        <!-- Indicateur de retard de paiement -->
        <div v-if="property.tenant && property.tenant.status === 'late'" class="relative shrink-0">
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Informations locatives -->
      <div class="mt-2 sm:mt-4 mb-2 sm:mb-4 flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs text-gray-500 truncate pr-2">{{ $t('properties.monthlyRent') }}</p>
          <p class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">
            {{ formatCurrency(property.rent) }}
          </p>
        </div>

        <!-- Informations locataire ou placeholder -->
        <div class="flex-1 flex flex-col">
          <TenantInfo v-if="property.tenant" :tenant="property.tenant" />

          <!-- Placeholder pour les biens sans locataire (hauteur fixe pour alignement) -->
          <div
            v-else
            class="border-t border-gray-100 pt-2 sm:pt-4 mt-2 sm:mt-4 min-h-[60px] sm:min-h-[80px] flex items-center justify-center"
          >
            <p class="text-gray-400 text-xs sm:text-sm italic text-center px-2">
              {{ $t('tenants.noTenants') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions (toujours en bas grâce à justify-between) -->
    <div class="mt-auto pt-2 sm:pt-4 border-t border-gray-100 flex items-center gap-1.5 sm:gap-2">
      <button
        @click.stop="$emit('edit', property)"
        class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center"
      >
        <svg
          class="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span class="hidden sm:inline">{{ $t('common.edit') }}</span>
      </button>
      <button
        @click.stop="$emit('delete', property.id)"
        class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
      >
        <svg
          class="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span class="hidden sm:inline">{{ $t('common.delete') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import TenantInfo from '../dashboard/TenantInfo.vue'
import { formatCurrency } from '@/utils/formatters'
import { PROPERTY_STATUS, STATUS_CLASSES } from '@/utils/constants'

const { t } = useI18n()

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

/**
 * Classe CSS selon le statut d'occupation
 */
const statusClass = computed(() => {
  return STATUS_CLASSES[props.property.status] || STATUS_CLASSES[PROPERTY_STATUS.VACANT]
})

/**
 * Texte du statut d'occupation (traduit)
 */
const statusText = computed(() => {
  const statusKey =
    props.property.status === PROPERTY_STATUS.OCCUPIED ? 'properties.occupied' : 'properties.free'
  return t(statusKey)
})
</script>
