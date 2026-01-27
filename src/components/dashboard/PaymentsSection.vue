<template>
  <div id="payments-section" data-section="payments" class="glass-panel rounded-2xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-text-primary">{{ $t('dashboard.payments') }}</h3>
      <router-link
        v-if="showViewAllLink"
        to="/paiements"
        class="text-sm text-brand hover:text-brand-hover transition-colors"
      >
        {{ $t('common.viewAll') }}
      </router-link>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center justify-between p-4 bg-bg-subtle rounded-xl border border-border-subtle animate-pulse"
      >
        <div class="flex-1">
          <div class="h-4 w-32 bg-bg-muted rounded mb-2"></div>
          <div class="h-3 w-24 bg-bg-muted rounded"></div>
        </div>
        <div class="text-right">
          <div class="h-6 w-20 bg-bg-muted rounded mb-1 ml-auto"></div>
          <div class="h-4 w-16 bg-bg-muted rounded ml-auto"></div>
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
          class="w-20 h-20 mx-auto flex items-center justify-center bg-bg-subtle rounded-full mb-4"
        >
          <svg
            class="w-10 h-10 text-text-muted"
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
        class="relative flex items-center justify-between p-4 bg-bg-card rounded-xl border border-border-subtle hover:bg-bg-subtle transition-colors group shadow-sm"
      >
        <div class="flex-1">
          <p class="font-semibold text-text-primary">{{ payment.tenant }}</p>
          <p class="text-sm text-text-secondary">{{ payment.property }}</p>
          <p class="text-xs text-text-muted mt-1">
            {{ $t('payments.dueDate') }}: {{ formatDate(payment.dueDate, { shortMonth: false }) }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-lg font-bold text-text-primary mb-1">
              {{ formatCurrency(payment.amount) }}
            </p>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getStatusClass(payment.status)"
            >
              {{ getStatusText(payment.status) }}
            </span>
          </div>
          <!-- Actions -->
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

const showViewAllLink = computed(() => {
  return props.showViewAll && route.path !== '/paiements'
})

const getStatusClass = status => {
  const classes = {
    [TRANSACTION_STATUS.PAID]: 'bg-success-light text-success-700 border-success-border',
    [TRANSACTION_STATUS.PENDING]: 'bg-warning-light text-warning-700 border-warning-border',
    [TRANSACTION_STATUS.LATE]: 'bg-danger-light text-danger-700 border-danger-border',
    [TRANSACTION_STATUS.PARTIAL]: 'bg-info-light text-info-700 border-info-border'
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
