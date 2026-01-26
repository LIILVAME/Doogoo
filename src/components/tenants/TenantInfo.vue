<template>
  <div v-if="tenant" class="tenant-info">
    <div class="flex items-start justify-between mb-2 sm:mb-3">
      <div class="flex-1 min-w-0 pr-2">
        <p class="text-xs text-zinc-400 mb-1">{{ $t('payments.tenant') }}</p>
        <p
          class="font-semibold text-white text-sm sm:text-base truncate transition-colors"
          :class="{ 'cursor-pointer hover:text-violet-400': clickable }"
          @click="handleClick"
        >
          {{ tenant.name }}
        </p>
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
        <p class="text-xs text-zinc-400 mb-1">{{ $t('tenants.entryDate') }}</p>
        <p class="font-medium text-zinc-200">
          {{ formatDate(tenant.entryDate) }}
        </p>
      </div>
      <div v-if="tenant.exitDate">
        <p class="text-xs text-zinc-400 mb-1">{{ $t('tenants.exitDate') }}</p>
        <p class="font-medium text-zinc-200">
          {{ formatDate(tenant.exitDate) }}
        </p>
      </div>
      <div v-else>
        <p class="text-xs text-zinc-400 mb-1">{{ $t('tenants.exitDate') }}</p>
        <p class="font-medium text-zinc-500">{{ $t('tenants.inProgress') }}</p>
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
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-tenant'])

const handleClick = e => {
  if (props.clickable) {
    e.stopPropagation()
    emit('click-tenant', props.tenant)
  }
}

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
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

@media (min-width: 640px) {
  .tenant-info {
    margin-top: 1rem;
    padding-top: 1rem;
  }
}
</style>
