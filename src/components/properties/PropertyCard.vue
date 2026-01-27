<template>
  <div
    @click="navigateToDetails"
    class="glass-panel glass-panel-hover rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex flex-col min-h-[320px] sm:min-h-[350px] lg:min-h-[380px] min-w-[280px] sm:min-w-[320px] group relative overflow-hidden"
  >
    <!-- Glow effect on hover -->
    <div
      class="absolute -right-20 -top-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
    ></div>

    <!-- Property Image -->
    <div class="relative h-48 w-full overflow-hidden">
      <img
        :src="
          property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
        "
        :alt="property.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"
      ></div>

      <!-- Status Badge (Overlay) -->
      <div class="absolute top-3 right-3">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md shadow-lg"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- Late Payment Indicator (Overlay) -->
      <div
        v-if="property.tenant && property.tenant.status === 'late'"
        class="absolute top-3 left-3"
      >
        <div
          class="px-2.5 py-0.5 bg-rose-500/90 text-white text-xs font-medium rounded-full border border-rose-400/50 shadow-lg backdrop-blur-md animate-pulse flex items-center"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Retard
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col p-5 relative z-10 -mt-12">
      <!-- En-tête avec nom, adresse -->
      <div class="mb-4">
        <h3
          class="text-lg font-bold text-white mb-1 truncate group-hover:text-violet-300 transition-colors drop-shadow-md"
        >
          {{ property.name }}
        </h3>
        <p class="text-sm text-zinc-300 mb-2 truncate drop-shadow-sm">{{ property.city }}</p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            class="px-2 py-1 text-xs font-medium text-white bg-black/40 backdrop-blur-md rounded-md flex items-center"
          >
            <i class="ri-building-line mr-1"></i>
            {{ getTypeName(property.type) }}
          </span>
          <span
            v-if="property.surface"
            class="px-2 py-1 text-xs font-medium text-white bg-black/40 backdrop-blur-md rounded-md flex items-center"
          >
            <i class="ri-ruler-line mr-1"></i>
            {{ property.surface }} m²
          </span>
          <span
            v-if="property.pieces"
            class="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-800 rounded-md flex items-center"
          >
            <i class="ri-layout-grid-line mr-1"></i>
            {{ property.pieces }} p.
          </span>
        </div>
      </div>

      <!-- Informations locatives -->
      <div class="flex-1 flex flex-col">
        <div class="flex items-end justify-between mb-4">
          <span class="text-sm text-zinc-500 uppercase font-semibold">{{
            $t('properties.monthlyRent')
          }}</span>
          <span class="text-2xl font-bold text-zinc-900">{{ formatCurrency(property.rent) }}</span>
        </div>

        <!-- Informations locataire ou placeholder -->
        <div class="flex-1 flex flex-col">
          <TenantInfo
            v-if="property.tenant"
            :tenant="property.tenant"
            clickable
            @click-tenant="handleTenantClick"
          />

          <!-- Placeholder pour les biens sans locataire -->
          <div
            v-else
            class="border border-dashed border-zinc-200 rounded-xl bg-zinc-50 pt-2 sm:pt-4 mt-1 min-h-[60px] flex items-center justify-center"
          >
            <p class="text-zinc-500 text-xs sm:text-sm italic text-center px-2">
              {{ $t('tenants.noTenants') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="px-4 sm:px-5 py-3 border-t border-zinc-100 flex items-center gap-2 sm:gap-3 bg-zinc-50/50"
    >
      <button
        @click.stop="handleEdit"
        class="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-violet-600 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center min-w-0"
      >
        <svg
          class="w-4 h-4 sm:mr-2 flex-shrink-0"
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
        <span class="hidden sm:inline whitespace-nowrap">{{ $t('common.edit') }}</span>
      </button>
      <button
        @click.stop="handleDelete"
        class="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center min-w-0"
      >
        <svg
          class="w-4 h-4 sm:mr-2 flex-shrink-0"
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
        <span class="hidden sm:inline whitespace-nowrap">{{ $t('common.delete') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import TenantInfo from '@/components/tenants/TenantInfo.vue'
import { formatCurrency } from '@/utils/formatters'
import { PROPERTY_STATUS, STATUS_CLASSES } from '@/utils/constants'
import { hapticLight, hapticMedium } from '@/composables/useHapticFeedback'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

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

const navigateToDetails = () => {
  // Pas de page détail dédiée : on ouvre la modale d'édition via query param
  hapticLight()
  router.push({ path: '/biens', query: { mode: 'edit', id: props.property.id } })
}

const handleTenantClick = tenant => {
  hapticLight()
  router.push({ path: '/locataires', query: { search: tenant.name } })
}

const handleEdit = () => {
  hapticMedium()
  emit('edit', props.property)
}

const handleDelete = () => {
  hapticMedium()
  emit('delete', props.property.id)
}

const getTypeName = type => {
  const types = {
    apartment: 'Appartement',
    house: 'Maison',
    parking: 'Parking',
    commercial: 'Local commercial',
    other: 'Autre'
  }
  return types[type] || 'Appartement'
}
</script>
