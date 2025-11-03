<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
        <!-- Overlay backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-900">{{ $t('payments.editPayment') }}</h2>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                :aria-label="$t('common.close')"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="px-6 py-4">
              <div class="space-y-4">
                <!-- Bien concerné (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('payments.relatedProperty') }}
                  </label>
                  <input
                    type="text"
                    :value="payment?.property || 'N/A'"
                    disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <!-- Locataire (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('payments.tenant') }}
                  </label>
                  <input
                    type="text"
                    :value="payment?.tenant || 'N/A'"
                    disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <!-- Montant -->
                <div>
                  <label
                    for="edit-payment-amount"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {{ $t('payments.amountEuro') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-payment-amount"
                    v-model.number="form.amount"
                    type="number"
                    required
                    min="0"
                    step="10"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('payments.placeholders.amount')"
                  />
                </div>

                <!-- Date d'échéance -->
                <div>
                  <label
                    for="edit-payment-due-date"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {{ $t('payments.dueDate') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-payment-due-date"
                    v-model="form.dueDate"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>

                <!-- Statut -->
                <div>
                  <label
                    for="edit-payment-status"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {{ $t('payments.status') }} <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-payment-status"
                    v-model="form.status"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  >
                    <option :value="TRANSACTION_STATUS.PAID">{{ $t('status.paid') }}</option>
                    <option :value="TRANSACTION_STATUS.PENDING">{{ $t('status.pending') }}</option>
                    <option :value="TRANSACTION_STATUS.LATE">{{ $t('status.late') }}</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isLoading"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="isLoading"
                    class="w-5 h-5 mr-2 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ isLoading ? $t('common.saving') || 'Enregistrement...' : $t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { TRANSACTION_STATUS } from '@/utils/constants'
import { paymentSchema, validate } from '@/utils/validators'
import { useToastStore } from '@/stores/toastStore'

const { t } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  payment: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const toastStore = useToastStore()

const form = ref({
  amount: null,
  dueDate: '',
  status: TRANSACTION_STATUS.PENDING
})

/**
 * Réinitialise le formulaire avec les données du paiement
 */
const resetForm = () => {
  if (props.payment) {
    // Convertit la date en format YYYY-MM-DD pour l'input date
    const dueDate = props.payment.dueDate
      ? new Date(props.payment.dueDate).toISOString().split('T')[0]
      : ''

    form.value = {
      amount: props.payment.amount || null,
      dueDate: dueDate,
      status: props.payment.status || TRANSACTION_STATUS.PENDING
    }
  } else {
    form.value = {
      amount: null,
      dueDate: '',
      status: TRANSACTION_STATUS.PENDING
    }
  }
}

/**
 * Ferme le modal
 */
const handleClose = () => {
  resetForm()
  emit('close')
}

/**
 * Soumet le formulaire avec validation Zod
 */
const handleSubmit = () => {
  if (!props.payment) {
    if (toastStore) {
      toastStore.error(t('payments.noPaymentSelected'))
    }
    return
  }

  // Prépare les données à soumettre
  const submitData = {
    propertyId: props.payment.propertyId || '00000000-0000-0000-0000-000000000000',
    amount: Number(form.value.amount),
    dueDate: form.value.dueDate,
    status: form.value.status || 'pending'
  }

  // Validation avec Zod
  const validationResult = validate(paymentSchema, submitData)

  if (!validationResult.success) {
    if (toastStore) {
      toastStore.error(`Validation échouée : ${validationResult.error}`)
    }
    return
  }

  emit('submit', validationResult.data)
  resetForm()
  emit('close')
}

/**
 * Réinitialise le formulaire quand le modal s'ouvre ou que le paiement change
 */
watch(
  () => props.isOpen,
  newValue => {
    if (newValue && props.payment) {
      resetForm()
    } else if (!newValue) {
      resetForm()
    }
  }
)

watch(
  () => props.payment,
  () => {
    if (props.isOpen && props.payment) {
      resetForm()
    }
  }
)
</script>

<style scoped>
/* Transitions pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s ease;
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  transform: scale(0.95);
}
</style>
