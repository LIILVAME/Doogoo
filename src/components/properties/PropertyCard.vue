<template>
<template>
  <div
    class="glass-panel rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] group relative overflow-hidden"
  >
    <!-- Glow effect on hover -->
    <div class="absolute -right-20 -top-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

    <!-- Contenu principal (flex-1 pour occuper l'espace disponible) -->
    <div class="flex-1 flex flex-col p-6 relative z-10">
      <!-- En-tête avec nom, adresse, statut -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0 pr-4">
          <h3 class="text-lg font-bold text-white mb-1 truncate group-hover:text-violet-300 transition-colors">
            {{ property.name }}
          </h3>
          <p class="text-sm text-zinc-400 mb-1 truncate">{{ property.city }}</p>
          <p class="text-xs text-zinc-500 mb-3 line-clamp-2 hidden sm:block">
            {{ property.address }}
          </p>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            :class="statusClass"
          >
            {{ statusText }}
          </span>
        </div>
        <!-- Indicateur de retard de paiement -->
        <div v-if="property.tenant && property.tenant.status === 'late'" class="relative shrink-0">
          <div
            class="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 animate-pulse"
          >
            <svg
              class="w-5 h-5 text-rose-500"
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
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <p class="text-xs text-zinc-500 uppercase tracking-wider">{{ $t('properties.monthlyRent') }}</p>
          <p class="text-xl font-bold text-white whitespace-nowrap">
            {{ formatCurrency(property.rent) }}
          </p>
        </div>

        <!-- Informations locataire ou placeholder -->
        <div class="flex-1 flex flex-col">
          <TenantInfo v-if="property.tenant" :tenant="property.tenant" />

          <!-- Placeholder pour les biens sans locataire (hauteur fixe pour alignement) -->
          <div
            v-else
            class="border border-dashed border-white/10 rounded-xl bg-white/5 pt-2 sm:pt-4 mt-2 sm:mt-4 min-h-[60px] sm:min-h-[80px] flex items-center justify-center"
          >
            <p class="text-zinc-500 text-xs sm:text-sm italic text-center px-2">
              {{ $t('tenants.noTenants') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions (toujours en bas grâce à justify-between) -->
    <div class="mt-auto px-6 py-4 border-t border-white/5 flex items-center gap-3 bg-black/20">
      <button
        @click.stop="$emit('edit', property)"
        class="flex-1 px-3 py-2 text-sm font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center"
      >
        <svg
          class="w-4 h-4 mr-2"
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
        class="flex-1 px-3 py-2 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center"
      >
        <svg
          class="w-4 h-4 mr-2"
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
