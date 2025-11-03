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
            ref="modalRef"
            class="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
            @click.stop
            role="dialog"
            aria-modal="true"
            :aria-labelledby="'modal-title-add-property'"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 id="modal-title-add-property" class="text-xl font-semibold text-gray-900">
                {{ $t('properties.addProperty') }}
              </h2>
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
                <!-- Nom du bien -->
                <div>
                  <label for="property-name" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('properties.name') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="property-name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('properties.placeholders.name')"
                  />
                </div>

                <!-- Adresse -->
                <div>
                  <label
                    for="property-address"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {{ $t('properties.address') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="property-address"
                    v-model="form.address"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('properties.placeholders.address')"
                  />
                </div>

                <!-- Ville -->
                <div>
                  <label for="property-city" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('properties.city') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="property-city"
                    v-model="form.city"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('properties.placeholders.city')"
                  />
                </div>

                <!-- Loyer -->
                <div>
                  <label for="property-rent" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('properties.monthlyRent') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="property-rent"
                    v-model.number="form.rent"
                    type="number"
                    required
                    min="0"
                    step="10"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('payments.placeholders.amount')"
                  />
                </div>

                <!-- Statut -->
                <div>
                  <label for="property-status" class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('properties.status') }} <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="property-status"
                    v-model="form.status"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  >
                    <option value="">{{ $t('properties.selectStatus') }}</option>
                    <option value="vacant">{{ $t('properties.free') }}</option>
                    <option value="occupied">{{ $t('properties.occupied') }}</option>
                  </select>
                </div>

                <!-- Informations du locataire (affiché uniquement si bien occupé) -->
                <div
                  v-if="form.status === PROPERTY_STATUS.OCCUPIED"
                  class="border-t border-gray-200 pt-4 mt-4"
                >
                  <h3 class="text-sm font-semibold mb-3 text-gray-700">
                    {{ $t('properties.tenantInfo') }}
                  </h3>

                  <div class="space-y-3">
                    <!-- Nom du locataire -->
                    <div>
                      <label for="tenant-name" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('properties.tenantName') }} <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="tenant-name"
                        v-model="form.tenant.name"
                        type="text"
                        required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                        :placeholder="$t('payments.placeholders.tenant')"
                      />
                    </div>

                    <!-- Date d'entrée -->
                    <div>
                      <label
                        for="tenant-entry-date"
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {{ $t('tenants.entryDate') }} <span class="text-red-500">*</span>
                      </label>
                      <input
                        id="tenant-entry-date"
                        v-model="form.tenant.entryDate"
                        type="date"
                        required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      />
                    </div>

                    <!-- Statut de paiement -->
                    <div>
                      <label
                        for="tenant-status"
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {{ $t('tenants.paymentStatus') }} <span class="text-red-500">*</span>
                      </label>
                      <select
                        id="tenant-status"
                        v-model="form.tenant.status"
                        required
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                      >
                        <option value="on_time">{{ $t('status.onTime') }}</option>
                        <option value="late">{{ $t('status.late') }}</option>
                      </select>
                    </div>
                  </div>
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
import { ref, watch, toRef } from 'vue'
import { useModalFocusTrap } from '@/composables/useModalFocusTrap'
import { useToastStore } from '@/stores/toastStore'
import { PROPERTY_STATUS } from '@/utils/constants'
import { propertySchema, validate } from '@/utils/validators'

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

const toastStore = useToastStore()

// Focus trap pour accessibilité
const { modalRef } = useModalFocusTrap(toRef(() => props.isOpen))

const form = ref({
  name: '',
  address: '',
  city: '',
  rent: null,
  status: '',
  tenant: {
    name: '',
    entryDate: '',
    status: 'on_time'
  }
})

const validationErrors = ref({})

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    name: '',
    address: '',
    city: '',
    rent: null,
    status: '',
    tenant: {
      name: '',
      entryDate: '',
      status: 'on_time'
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
  validationErrors.value = {}

  // Prépare les données à soumettre
  const submitData = {
    name: form.value.name.trim(),
    address: form.value.address.trim() || null,
    city: form.value.city.trim(),
    rent: Number(form.value.rent),
    status: form.value.status,
    // Ajoute les informations du locataire seulement si le bien est occupé
    tenant:
      form.value.status === PROPERTY_STATUS.OCCUPIED
        ? {
            name: form.value.tenant.name.trim(),
            entryDate: form.value.tenant.entryDate,
            status: form.value.tenant.status || 'on_time',
            rent: Number(form.value.rent)
          }
        : null
  }

  // Validation avec Zod
  const validationResult = validate(propertySchema, submitData)

  if (!validationResult.success) {
    // Affiche les erreurs de validation
    if (toastStore) {
      toastStore.error(`Validation échouée : ${validationResult.error}`)
    }

    // Mappe les erreurs par champ pour l'affichage inline (optionnel)
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

  emit('submit', validationResult.data)

  resetForm()
  emit('close')
}

/**
 * Réinitialise les champs locataire si on change le statut de "occupé" à "libre"
 */
watch(
  () => form.value.status,
  newStatus => {
    if (newStatus !== PROPERTY_STATUS.OCCUPIED) {
      form.value.tenant = {
        name: '',
        entryDate: '',
        status: 'on_time'
      }
    }
  }
)

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
