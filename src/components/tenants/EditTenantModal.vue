<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
        <!-- Overlay backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            ref="modalRef"
            class="relative w-full max-w-md mx-4 md:mx-auto max-h-[90vh] overflow-y-auto transform rounded-2xl glass-panel shadow-2xl transition-all"
            @click.stop
            role="dialog"
            aria-modal="true"
            :aria-labelledby="'edit-tenant-modal-title'"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
                >
                  <svg
                    class="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 id="edit-tenant-modal-title" class="text-xl font-semibold text-zinc-900">
                  {{ $t('tenants.editTenant') }}
                </h2>
              </div>
              <button
                @click="handleClose"
                class="text-zinc-500 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-lg"
                :aria-label="$t('common.close')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <form @submit.prevent="handleSubmit" class="px-6 py-5">
              <div class="space-y-5">
                <!-- Nom du locataire -->
                <div>
                  <label
                    for="edit-tenant-name"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('tenants.tenantName') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-tenant-name"
                    v-model.trim="form.name"
                    type="text"
                    required
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('tenants.placeholders.name')"
                  />
                </div>

                <!-- Bien associé (lecture seule) -->
                <div>
                  <label class="block text-sm font-medium text-zinc-600 mb-2">
                    {{ $t('tenants.associatedProperty') }}
                  </label>
                  <div
                    class="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-600"
                  >
                    {{ propertyName }}
                  </div>
                  <p class="text-xs text-zinc-500 mt-1">
                    {{ $t('properties.propertyRent') }} : {{ formatCurrency(form.rent) }}
                  </p>
                </div>

                <!-- Date d'entrée -->
                <div>
                  <label
                    for="edit-tenant-entry-date"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('tenants.entryDate') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-tenant-entry-date"
                    v-model="form.entryDate"
                    type="date"
                    required
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  />
                </div>

                <!-- Date de sortie (optionnelle) -->
                <div>
                  <label
                    for="edit-tenant-exit-date"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('tenants.exitDateOptional') }}
                    <span class="text-zinc-500 text-xs">({{ $t('common.optional') }})</span>
                  </label>
                  <input
                    id="edit-tenant-exit-date"
                    v-model="form.exitDate"
                    type="date"
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  />
                </div>

                <!-- Date de naissance -->
                <div>
                  <label
                    for="edit-tenant-birth-date"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('common.birthDate') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-tenant-birth-date"
                    v-model="form.birthDate"
                    type="date"
                    required
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  />
                </div>

                <!-- Lieu de naissance -->
                <div>
                  <label
                    for="edit-tenant-birth-place"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('common.birthPlace') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-tenant-birth-place"
                    v-model.trim="form.birthPlace"
                    type="text"
                    required
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('common.placeholders.birthPlace')"
                  />
                </div>

                <!-- Loyer -->
                <div>
                  <label
                    for="edit-tenant-rent"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('tenants.monthlyRent') }} <span class="text-rose-400">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{{
                      CURRENCY_SYMBOLS[settingsStore?.currency] || '€'
                    }}</span>
                    <input
                      id="edit-tenant-rent"
                      v-model.number="form.rent"
                      type="number"
                      required
                      min="0"
                      step="10"
                      class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl pl-14 pr-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      :placeholder="$t('tenants.placeholders.rent')"
                    />
                  </div>
                </div>

                <!-- Statut de paiement -->
                <div>
                  <label
                    for="edit-tenant-status"
                    class="block text-sm font-medium text-zinc-600 mb-2"
                  >
                    {{ $t('tenants.paymentStatus') }} <span class="text-rose-400">*</span>
                  </label>
                  <select
                    id="edit-tenant-status"
                    v-model="form.status"
                    required
                    class="w-full bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  >
                    <option value="" class="bg-white">{{ $t('tenants.selectStatus') }}</option>
                    <option :value="PAYMENT_STATUS.ON_TIME" class="bg-white">
                      {{ $t('status.onTime') }}
                    </option>
                    <option :value="PAYMENT_STATUS.LATE" class="bg-white">
                      {{ $t('status.late') }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Section Documents -->
              <div class="mt-6 pt-5 border-t border-zinc-200">
                <TenantDocuments v-if="tenant?.id" :tenant-id="tenant.id" />
              </div>

              <!-- Actions -->
              <div class="mt-6 flex items-center justify-end gap-3 border-t border-zinc-200 pt-5">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isLoading"
                  class="px-5 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || isSubmitting"
                  class="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                >
                  <svg
                    v-if="isLoading || isSubmitting"
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
                  {{
                    isLoading || isSubmitting
                      ? $t('common.saving') || 'Enregistrement...'
                      : $t('common.save')
                  }}
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
import { ref, watch, toRef } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'
import { PAYMENT_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'
import TenantDocuments from './TenantDocuments.vue'
import { useModalFocusTrap } from '@/composables/useModalFocusTrap'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  tenant: {
    type: Object,
    default: null
  },
  propertyName: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// Focus trap pour accessibilité
const { modalRef } = useModalFocusTrap(toRef(() => props.isOpen))

const settingsStore = useSettingsStore()

const isSubmitting = ref(false)

const form = ref({
  name: '',
  entryDate: '',
  exitDate: '',
  rent: null,
  status: 'on_time',
  birthDate: '',
  birthPlace: ''
})

/**
 * Initialise le formulaire avec les données du locataire
 */
const initForm = () => {
  if (props.tenant) {
    form.value = {
      name: props.tenant.name || '',
      entryDate: props.tenant.entryDate || '',
      exitDate: props.tenant.exitDate || '',
      rent: props.tenant.rent || null,
      status: props.tenant.status || 'on_time',
      birthDate: props.tenant.birthDate || '',
      birthPlace: props.tenant.birthPlace || ''
    }
  }
}

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    name: '',
    entryDate: '',
    exitDate: '',
    rent: null,
    status: 'on_time',
    birthDate: '',
    birthPlace: ''
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
 * Soumet le formulaire
 */
const handleSubmit = async () => {
  if (isSubmitting.value) {
    return // Évite les soumissions multiples
  }

  try {
    isSubmitting.value = true

    const submitData = {
      name: form.value.name.trim(),
      entryDate: form.value.entryDate,
      exitDate: form.value.exitDate || null,
      rent: Number(form.value.rent),
      status: form.value.status || 'on_time',
      birthDate: form.value.birthDate || null,
      birthPlace: form.value.birthPlace || null
    }

    emit('submit', submitData)
    resetForm()
    emit('close')
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error)
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Initialise le formulaire quand le modal s'ouvre
 */
watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      initForm()
    } else {
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
