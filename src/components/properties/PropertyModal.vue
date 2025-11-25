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
            class="relative w-full max-w-lg transform overflow-hidden rounded-2xl glass-panel shadow-2xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20"
                >
                  <svg
                    class="w-5 h-5 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-white">
                  {{ property ? $t('properties.editProperty') : $t('properties.addProperty') }}
                </h2>
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
                <!-- Nom du bien -->
                <div>
                  <label
                    for="edit-property-name"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('properties.name') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-property-name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('properties.placeholders.name')"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Type de bien -->
                  <div>
                    <label class="block text-sm font-medium text-zinc-300 mb-2">
                      Type <span class="text-rose-400">*</span>
                    </label>
                    <select
                      v-model="form.type"
                      required
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                    >
                      <option value="apartment" class="bg-zinc-900">Appartement</option>
                      <option value="house" class="bg-zinc-900">Maison</option>
                      <option value="parking" class="bg-zinc-900">Parking</option>
                      <option value="commercial" class="bg-zinc-900">Local commercial</option>
                      <option value="other" class="bg-zinc-900">Autre</option>
                    </select>
                  </div>

                  <!-- Surface -->
                  <div>
                    <label class="block text-sm font-medium text-zinc-300 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      v-model.number="form.surface"
                      type="number"
                      min="0"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      placeholder="Ex: 45"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Pièces -->
                  <div>
                    <label class="block text-sm font-medium text-zinc-300 mb-2"> Pièces </label>
                    <input
                      v-model.number="form.pieces"
                      type="number"
                      min="0"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2"> Description </label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500 resize-none"
                    placeholder="Description du bien..."
                  ></textarea>
                </div>

                <!-- Adresse -->
                <div>
                  <label
                    for="edit-property-address"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('properties.address') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-property-address"
                    v-model="form.address"
                    type="text"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('properties.placeholders.address')"
                  />
                </div>

                <!-- Ville -->
                <div>
                  <label
                    for="edit-property-city"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('properties.city') }} <span class="text-rose-400">*</span>
                  </label>
                  <input
                    id="edit-property-city"
                    v-model="form.city"
                    type="text"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('properties.placeholders.city')"
                  />
                </div>

                <!-- Loyer -->
                <div>
                  <label
                    for="edit-property-rent"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('properties.monthlyRent') }} <span class="text-rose-400">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">{{
                      CURRENCY_SYMBOLS[settingsStore?.currency] || '€'
                    }}</span>
                    <input
                      id="edit-property-rent"
                      v-model.number="form.rent"
                      type="number"
                      required
                      min="0"
                      step="10"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-14 pr-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      :placeholder="$t('payments.placeholders.amount')"
                    />
                  </div>
                </div>

                <!-- Statut -->
                <div>
                  <label
                    for="edit-property-status"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('properties.status') }} <span class="text-rose-400">*</span>
                  </label>
                  <select
                    id="edit-property-status"
                    v-model="form.status"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  >
                    <option value="" class="bg-zinc-900">
                      {{ $t('properties.selectStatus') }}
                    </option>
                    <option value="vacant" class="bg-zinc-900">{{ $t('properties.free') }}</option>
                    <option value="occupied" class="bg-zinc-900">
                      {{ $t('properties.occupied') }}
                    </option>
                  </select>
                </div>

                <!-- Informations du locataire (affiché uniquement si bien occupé) -->
                <div
                  v-if="form.status === PROPERTY_STATUS.OCCUPIED"
                  class="border-t border-white/10 pt-5 mt-2"
                >
                  <div class="flex items-center gap-2 mb-4">
                    <div
                      class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
                    >
                      <svg
                        class="w-4 h-4 text-blue-400"
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
                    <h3 class="text-sm font-semibold text-white">
                      {{ $t('properties.tenantInfo') }}
                    </h3>
                  </div>

                  <div class="space-y-4">
                    <!-- Nom du locataire -->
                    <div>
                      <label
                        for="edit-tenant-name"
                        class="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        {{ $t('properties.tenantName') }} <span class="text-rose-400">*</span>
                      </label>
                      <input
                        id="edit-tenant-name"
                        v-model="form.tenant.name"
                        type="text"
                        required
                        class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                        :placeholder="$t('payments.placeholders.tenant')"
                      />
                    </div>

                    <!-- Date d'entrée -->
                    <div>
                      <label
                        for="edit-tenant-entry-date"
                        class="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        {{ $t('tenants.entryDate') }} <span class="text-rose-400">*</span>
                      </label>
                      <input
                        id="edit-tenant-entry-date"
                        v-model="form.tenant.entryDate"
                        type="date"
                        required
                        class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                      />
                    </div>

                    <!-- Statut de paiement -->
                    <div>
                      <label
                        for="edit-tenant-status"
                        class="block text-sm font-medium text-zinc-300 mb-2"
                      >
                        {{ $t('tenants.paymentStatus') }} <span class="text-rose-400">*</span>
                      </label>
                      <select
                        id="edit-tenant-status"
                        v-model="form.tenant.status"
                        required
                        class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                      >
                        <option value="on_time" class="bg-zinc-900">
                          {{ $t('status.onTime') }}
                        </option>
                        <option value="late" class="bg-zinc-900">{{ $t('status.late') }}</option>
                      </select>
                    </div>
                  </div>
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
import { PROPERTY_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'

import { useSettingsStore } from '@/stores/settingsStore'
const settingsStore = useSettingsStore()
// Utilise $t dans le template, pas besoin de t dans le script

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  property: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  name: '',
  address: '',
  city: '',
  type: 'apartment',
  surface: null,
  pieces: null,
  description: '',
  rent: null,
  status: '',
  tenant: {
    name: '',
    entryDate: '',
    status: 'on_time'
  }
})

/**
 * Initialise le formulaire avec les données du bien à modifier
 */
const initializeForm = () => {
  if (props.property) {
    form.value = {
      name: props.property.name || '',
      address: props.property.address || '',
      city: props.property.city || '',

      type: props.property.type || 'apartment',
      surface: props.property.surface || null,
      pieces: props.property.pieces || null,
      description: props.property.description || '',
      rent: props.property.rent || null,
      status: props.property.status || '',
      tenant: props.property.tenant
        ? {
            name: props.property.tenant.name || '',
            entryDate: props.property.tenant.entryDate || '',
            status: props.property.tenant.status || 'on_time'
          }
        : {
            name: '',
            entryDate: '',
            status: 'on_time'
          }
    }
  } else {
    resetForm()
  }
}

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    name: '',
    address: '',
    city: '',
    type: 'apartment',
    surface: null,
    pieces: null,
    description: '',
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
 * Soumet le formulaire
 */
const handleSubmit = () => {
  // TODO v0.2.0 : Valider les données avec un schéma (Zod, Yup, etc.)

  // Prépare les données à soumettre
  const submitData = {
    name: form.value.name,
    address: form.value.address,
    city: form.value.city,
    type: form.value.type,
    surface: form.value.surface,
    pieces: form.value.pieces,
    description: form.value.description,
    rent: Number(form.value.rent),
    status: form.value.status,
    // Ajoute les informations du locataire seulement si le bien est occupé
    tenant:
      form.value.status === PROPERTY_STATUS.OCCUPIED
        ? {
            name: form.value.tenant.name,
            entryDate: form.value.tenant.entryDate,
            status: form.value.tenant.status
          }
        : null
  }

  emit('saved', submitData)

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
 * Initialise le formulaire quand le modal s'ouvre ou quand le bien change
 */
watch(
  [() => props.isOpen, () => props.property],
  ([isOpen, property]) => {
    if (isOpen && property) {
      initializeForm()
    } else if (!isOpen) {
      resetForm()
    }
  },
  { immediate: true }
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
