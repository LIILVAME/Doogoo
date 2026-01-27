<template>
  <div id="payments-section" data-section="payments" class="glass-panel rounded-2xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-zinc-900">{{ $t('dashboard.payments') }}</h3>
      <router-link
        v-if="showViewAllLink"
        to="/paiements"
        class="text-sm text-violet-600 hover:text-violet-700 transition-colors"
      >
        {{ $t('common.viewAll') }}
      </router-link>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100 animate-pulse"
      >
        <div class="flex-1">
          <div class="h-4 w-32 bg-white/10 rounded mb-2"></div>
          <div class="h-3 w-24 bg-white/10 rounded"></div>
        </div>
        <div class="text-right">
          <div class="h-6 w-20 bg-zinc-200 rounded mb-1 ml-auto"></div>
          <div class="h-4 w-16 bg-zinc-200 rounded ml-auto"></div>
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="payments.length === 0"
      :title="$t('payments.noPayments')"
      :description="''"
      illustration="none"
      class="bg-transparent"
    >
      <template #illustration>
        <div
          class="w-20 h-20 mx-auto flex items-center justify-center bg-zinc-100 rounded-full mb-4"
        >
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
        class="relative flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-colors group shadow-sm"
      >
        <div class="flex-1">
          <p class="font-semibold text-zinc-900">{{ payment.tenant }}</p>
          <p class="text-sm text-zinc-500">{{ payment.property }}</p>
          <p class="text-xs text-zinc-400 mt-1">
            {{ $t('payments.dueDate') }}: {{ formatDate(payment.dueDate, { shortMonth: false }) }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-lg font-bold text-zinc-900 mb-1">{{ formatCurrency(payment.amount) }}</p>
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
  },
  loading: {
    type: Boolean,
    default: false
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
    [TRANSACTION_STATUS.PAID]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [TRANSACTION_STATUS.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
    [TRANSACTION_STATUS.LATE]: 'bg-rose-50 text-rose-700 border-rose-200',
    [TRANSACTION_STATUS.PARTIAL]: 'bg-blue-50 text-blue-700 border-blue-200'
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
