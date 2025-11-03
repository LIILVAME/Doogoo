<template>
  <div v-if="tenant" class="tenant-info">
    <div class="flex items-start justify-between mb-2 sm:mb-3">
      <div class="flex-1 min-w-0 pr-2">
        <p class="text-xs text-gray-500 mb-1">{{ $t('payments.tenant') }}</p>
        <p class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ tenant.name }}</p>
      </div>
      <span
        class="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
      <div>
        <p class="text-xs text-gray-500 mb-1">{{ $t('tenants.entryDate') }}</p>
        <p class="font-medium text-gray-900">
          {{ formatDate(tenant.entryDate, { shortMonth: true }) }}
        </p>
      </div>
      <div v-if="tenant.exitDate">
        <p class="text-xs text-gray-500 mb-1">{{ $t('tenants.exitDate') }}</p>
        <p class="font-medium text-gray-900">
          {{ formatDate(tenant.exitDate, { shortMonth: true }) }}
        </p>
      </div>
      <div v-else>
        <p class="text-xs text-gray-500 mb-1">{{ $t('tenants.exitDate') }}</p>
        <p class="font-medium text-gray-400">{{ $t('tenants.inProgress') }}</p>
      </div>
    </div>
  </div>

  <div v-else class="tenant-info">
    <p class="text-sm text-gray-500 italic">{{ $t('tenants.noTenants') }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { formatDate } from '@/utils/formatters'
import { PAYMENT_STATUS, STATUS_CLASSES } from '@/utils/constants'

const { t } = useI18n()

const props = defineProps({
  tenant: {
    type: Object,
    default: null
  }
})

/**
 * Classe CSS selon le statut de paiement
 */
const statusClass = computed(() => {
  if (!props.tenant) return STATUS_CLASSES[PAYMENT_STATUS.PENDING]
  return STATUS_CLASSES[props.tenant.status] || STATUS_CLASSES[PAYMENT_STATUS.PENDING]
})

/**
 * Texte du statut de paiement (traduit)
 */
const statusText = computed(() => {
  if (!props.tenant) return t('status.pending')

  const status = props.tenant.status
  const statusMap = {
    [PAYMENT_STATUS.ON_TIME]: 'status.onTime',
    [PAYMENT_STATUS.LATE]: 'status.late',
    [PAYMENT_STATUS.PENDING]: 'status.pending',
    [PAYMENT_STATUS.PAID]: 'status.paid'
  }

  return t(statusMap[status] || 'status.pending')
})
</script>

<style scoped>
.tenant-info {
  @apply mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-100;
}
</style>
