<template>
  <div id="payments-section" data-section="payments" class="glass-panel rounded-2xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-white">{{ $t('dashboard.payments') }}</h3>
      <router-link
        v-if="showViewAllLink"
        to="/paiements"
        class="text-sm text-violet-400 hover:text-violet-300 transition-colors"
      >
        {{ $t('common.viewAll') }}
      </router-link>
    </div>

    <EmptyState
      v-if="payments.length === 0"
      :title="$t('payments.noPayments')"
      :description="''"
      illustration="none"
      class="bg-transparent"
    >
      <template #illustration>
        <div class="w-20 h-20 mx-auto flex items-center justify-center bg-white/5 rounded-full mb-4">
          <svg
            class="w-10 h-10 text-zinc-500"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z"
            />
          </svg>
        </div>
      </template>
    </EmptyState>

    <div v-else class="space-y-3">
      <div
        v-for="payment in payments"
        :key="payment.id"
        class="relative flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group"
      >
        <div class="flex-1">
          <p class="font-semibold text-white">{{ payment.tenant }}</p>
          <p class="text-sm text-zinc-400">{{ payment.property }}</p>
          <p class="text-xs text-zinc-500 mt-1">
            {{ $t('payments.dueDate') }}: {{ formatDate(payment.dueDate, { shortMonth: false }) }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-lg font-bold text-white mb-1">{{ formatCurrency(payment.amount) }}</p>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getStatusClass(payment.status)"
            >
              {{ getStatusText(payment.status) }}
            </span>
          </div>
          <!-- Bouton d'actions pour modifier, supprimer ou télécharger la facture -->
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <PaymentActions
              :payment="payment"
              @edit="$emit('edit-payment', payment)"
              @delete="$emit('delete-payment', payment.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { TRANSACTION_STATUS, STATUS_LABELS } from '@/utils/constants'
import { useRoute } from 'vue-router'
import PaymentActions from '@/components/payments/PaymentActions.vue'
import EmptyState from '@/components/common/EmptyState.vue'

defineEmits(['edit-payment', 'delete-payment'])

const { t } = useI18n()

const route = useRoute()

const props = defineProps({
  payments: {
    type: Array,
    required: true
  },
  showViewAll: {
    type: Boolean,
    default: true
  }
})

/**
 * Affiche le lien "Voir tout" seulement si on n'est pas déjà sur la page paiements
 */
const showViewAllLink = computed(() => {
  return props.showViewAll && route.path !== '/paiements'
})

/**
 * Classe CSS selon le statut de paiement (Dark Theme)
 */
const getStatusClass = status => {
  const classes = {
    [TRANSACTION_STATUS.PAID]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [TRANSACTION_STATUS.PENDING]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [TRANSACTION_STATUS.LATE]: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    [TRANSACTION_STATUS.PARTIAL]: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
  return classes[status] || classes[TRANSACTION_STATUS.PENDING]
}

/**
 * Texte du statut de paiement
 */
const getStatusText = status => {
  return STATUS_LABELS[status] || t('common.unknown')
}
</script>
