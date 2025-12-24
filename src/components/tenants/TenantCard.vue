<template>
  <div
    class="glass-panel rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex flex-col justify-between min-h-[280px] group overflow-hidden"
  >
    <!-- Glow -->
    <div
      class="absolute -right-16 -top-16 w-36 h-36 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
    ></div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col p-5 relative z-10">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1 min-w-0 pr-3">
          <h3
            class="text-lg font-semibold text-white mb-1 truncate group-hover:text-violet-300 transition-colors"
          >
            {{ tenant.name }}
          </h3>
          <p
            class="text-sm text-zinc-300 mb-1 hover:text-violet-300 cursor-pointer transition-colors flex items-center gap-1 truncate"
            @click.stop="navigateToProperty"
          >
            {{ tenant.property }}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </p>
          <p class="text-xs text-zinc-500 uppercase tracking-wide">{{ tenant.propertyCity }}</p>
        </div>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 backdrop-blur-md border border-white/10"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- Informations du locataire -->
      <div class="mt-3 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-zinc-500 mb-1">{{ $t('tenants.entryDate') }}</p>
            <p class="text-sm font-medium text-white">
              {{ formatDate(tenant.entryDate, { shortMonth: true }) }}
            </p>
          </div>
          <div v-if="tenant.exitDate">
            <p class="text-xs text-zinc-500 mb-1">{{ $t('tenants.exitDate') }}</p>
            <p class="text-sm font-medium text-white">
              {{ formatDate(tenant.exitDate, { shortMonth: true }) }}
            </p>
          </div>
          <div v-else>
            <p class="text-xs text-zinc-500 mb-1">{{ $t('tenants.exitDate') }}</p>
            <p class="text-sm font-medium text-zinc-400">{{ $t('tenants.inProgress') }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-white/10">
          <p class="text-xs text-zinc-500 mb-1">{{ $t('properties.monthlyRent') }}</p>
          <p class="text-xl font-bold text-white">{{ formatCurrency(tenant.rent) }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-auto px-5 py-3 border-t border-white/10 flex flex-col gap-2 bg-black/20">
      <!-- Bouton Générer le Bail -->
      <button
        @click.stop="$emit('generate-lease', tenant)"
        class="w-full px-3 py-2 text-sm font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {{ $t('tenants.generateLease') || '📄 Générer le Bail' }}
      </button>
      
      <!-- Actions secondaires -->
      <div class="flex items-center gap-3">
        <button
          @click.stop="$emit('edit', tenant)"
          class="flex-1 px-3 py-2 text-sm font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="flex-1 px-3 py-2 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 active:scale-95 transition-all duration-150 flex items-center justify-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { PAYMENT_STATUS, STATUS_LABELS, STATUS_CLASSES } from '@/utils/constants'

// Utilise $t dans le template, pas besoin de t dans le script

const router = useRouter()

const props = defineProps({
  tenant: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'generate-lease'])

const navigateToProperty = () => {
  if (props.tenant.propertyId) {
    router.push({ path: '/biens', query: { mode: 'edit', id: props.tenant.propertyId } })
  }
}

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
