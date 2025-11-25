<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
        <!-- Overlay backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="handleClose"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-lg transform overflow-hidden rounded-2xl glass-panel shadow-2xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-white">{{ $t('payments.addPayment') }}</h2>
              </div>
              <button
                @click="handleClose"
                class="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
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
                <!-- Bien concerné -->
                <div>
                  <label
                    for="payment-property"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('payments.relatedProperty') }} <span class="text-rose-400">*</span>
                  </label>
                  <select
                    id="payment-property"
                    v-model="form.propertyId"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                    @change="handlePropertyChange"
                  >
                    <option value="" class="bg-zinc-900">{{ $t('payments.selectProperty') }}</option>
                    <option
                      v-for="property in propertiesWithTenants"
                      :key="property.id"
                      :value="property.id"
                      class="bg-zinc-900"
                    >
                      {{ property.name }} - {{ property.city }}
                    </option>
                    <option value="custom" class="bg-zinc-900">{{ $t('payments.otherProperty') }}</option>
                  </select>
                  <!-- Champ texte libre si "Autre" sélectionné -->
                  <div v-if="form.propertyId === 'custom'" class="mt-2">
                    <input
                      v-model="form.propertyCustom"
                      type="text"
                      :placeholder="$t('payments.propertyName')"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      required
                    />
                  </div>
                </div>

                <!-- Locataire (pré-rempli si bien sélectionné) -->
                <div>
                  <label for="payment-tenant" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('payments.tenant') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="payment-tenant"
                    v-model="form.tenant"
                    type="text"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('payments.placeholders.tenant')"
                  />
                </div>

                <!-- Montant -->
                <div>
                  <label for="payment-amount" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('payments.amountEuro') }} <span class="text-rose-400">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">{{ CURRENCY_SYMBOLS[settingsStore?.currency] || '€' }}</span>
                    <input
                      id="payment-amount"
                      v-model.number="form.amount"
                      type="number"
                      required
                      min="0"
                      step="10"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-14 pr-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      :placeholder="$t('payments.placeholders.amount')"
                    />
                  </div>
                </div>

                <!-- Date d'échéance -->
                <div>
                  <label
                    for="payment-due-date"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('payments.dueDate') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="payment-due-date"
                    v-model="form.dueDate"
                    type="date"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  />
                </div>

                <!-- Statut -->
                <div>
                  <label for="payment-status" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('payments.status') }} <span class="text-rose-400">*</span>
                  </label>
                  <select
                    id="payment-status"
                    v-model="form.status"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  >
                    <option value="" class="bg-zinc-900">{{ $t('payments.selectStatus') }}</option>
                    <option :value="TRANSACTION_STATUS.PAID" class="bg-zinc-900">{{ $t('status.paid') }}</option>
                    <option :value="TRANSACTION_STATUS.PENDING" class="bg-zinc-900">{{ $t('status.pending') }}</option>
                    <option :value="TRANSACTION_STATUS.LATE" class="bg-zinc-900">{{ $t('status.late') }}</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isLoading"
                  class="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-zinc-300 font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{ isLoading ? $t('common.saving') || 'Enregistrement...' : $t('common.add') }}
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
import { ref, computed, watch } from 'vue'
import { TRANSACTION_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useToastStore } from '@/stores/toastStore'
import { paymentSchema, validate } from '@/utils/validators'

// Utilise $t dans le template, pas besoin de t dans le script

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const propertiesStore = usePropertiesStore()
const toastStore = useToastStore()

const form = ref({
  propertyId: '',
  propertyCustom: '',
  tenant: '',
  amount: null,
  dueDate: '',
  status: TRANSACTION_STATUS.PENDING
})

const validationErrors = ref({})

/**
 * Liste des biens occupés (pour la sélection)
 */
const propertiesWithTenants = computed(() => {
  return propertiesStore.properties.filter(p => p.tenant !== null)
})

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    propertyId: '',
    propertyCustom: '',
    tenant: '',
    amount: null,
    dueDate: '',
    status: TRANSACTION_STATUS.PENDING
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
 * Gère le changement de sélection du bien
 * Pré-remplit le nom du locataire et le montant si un bien est sélectionné
 */
const handlePropertyChange = () => {
  if (form.value.propertyId && form.value.propertyId !== 'custom') {
    const selectedProperty = propertiesStore.properties.find(p => p.id === form.value.propertyId)

    if (selectedProperty) {
      form.value.tenant = selectedProperty.tenant?.name || ''
      form.value.amount = selectedProperty.rent || null
    }
  } else {
    // Réinitialise si on sélectionne "custom" ou vide
    if (form.value.propertyId !== 'custom') {
      form.value.tenant = ''
      form.value.amount = null
    }
  }
}

/**
 * Soumet le formulaire avec validation Zod
 */
const handleSubmit = () => {
  validationErrors.value = {}

  // Détermine le nom du bien
  let propertyName = ''
  let propertyId = null

  if (form.value.propertyId === 'custom') {
    propertyName = form.value.propertyCustom.trim()
    if (!propertyName) {
      if (toastStore) {
        toastStore.error('Le nom du bien est requis')
      }
      return
    }
    propertyId = null
  } else if (form.value.propertyId) {
    const selectedProperty = propertiesStore.properties.find(p => p.id === form.value.propertyId)
    propertyName = selectedProperty?.name || ''
    propertyId = form.value.propertyId // UUID, pas besoin de conversion
  } else {
    if (toastStore) {
      toastStore.error('Veuillez sélectionner un bien')
    }
    return
  }

  // Prépare les données à soumettre (convertit propertyId en UUID ou génère un UUID temporaire)
  const submitData = {
    propertyId: propertyId || '00000000-0000-0000-0000-000000000000', // UUID temporaire si custom
    amount: Number(form.value.amount),
    dueDate: form.value.dueDate,
    status: form.value.status || 'pending'
  }

  // Validation avec Zod
  const validationResult = validate(paymentSchema, submitData)

  if (!validationResult.success) {
    // Affiche les erreurs de validation
    if (toastStore) {
      toastStore.error(`Validation échouée : ${validationResult.error}`)
    }

    // Mappe les erreurs par champ
    if (validationResult.errors) {
      validationResult.errors.forEach(error => {
        const match = error.match(/^([^.]+):/)
        if (match) {
          const field = match[1]
          if (!validationErrors.value[field]) {
            validationErrors.value[field] = []
          }
          validationErrors.value[field].push(error.replace(/^[^:]+:\s*/, ''))
        }
      })
    }

    return
  }

  // Ajoute les champs additionnels non validés par Zod mais nécessaires pour l'UI
  const finalData = {
    ...validationResult.data,
    property: propertyName,
    tenant: form.value.tenant?.trim() || ''
  }

  emit('submit', finalData)

  resetForm()
  emit('close')
}

/**
 * Réinitialise le formulaire quand le modal se ferme
 */
watch(
  () => props.isOpen,
  newValue => {
    if (!newValue) {
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
