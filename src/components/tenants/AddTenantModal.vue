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
            class="relative w-full max-w-md transform overflow-hidden rounded-2xl glass-panel shadow-2xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 class="text-xl font-semibold text-white">{{ $t('tenants.addTenant') }}</h2>
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
                <!-- Nom du locataire -->
                <div>
                  <label for="tenant-name" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('tenants.tenantName') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="tenant-name"
                    v-model.trim="form.name"
                    type="text"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                    :placeholder="$t('tenants.placeholders.name')"
                  />
                </div>

                <!-- Bien associé -->
                <div>
                  <label for="tenant-property" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('tenants.associatedProperty') }} <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tenant-property"
                    v-model="form.propertyId"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                    @change="handlePropertyChange"
                  >
                    <option value="">{{ $t('tenants.selectProperty') }}</option>
                    <option
                      v-for="property in availableProperties"
                      :key="property.id"
                      :value="property.id"
                    >
                      {{ property.name }} - {{ property.city }}
                    </option>
                  </select>
                  <p v-if="form.propertyId && selectedProperty" class="text-xs text-zinc-400 mt-1">
                    {{ $t('properties.propertyRent') }} :
                    {{ formatCurrency(selectedProperty.rent) }}
                  </p>
                </div>

                <!-- Date d'entrée -->
                <div>
                  <label
                    for="tenant-entry-date"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('tenants.entryDate') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="tenant-entry-date"
                    v-model="form.entryDate"
                    type="date"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  />
                </div>

                <!-- Date de sortie (optionnelle) -->
                <div>
                  <label
                    for="tenant-exit-date"
                    class="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    {{ $t('tenants.exitDateOptional') }}
                    <span class="text-gray-400 text-xs">({{ $t('common.optional') }})</span>
                  </label>
                  <input
                    id="tenant-exit-date"
                    v-model="form.exitDate"
                    type="date"
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                  />
                </div>

                <!-- Loyer -->
                <div>
                  <label for="tenant-rent" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('tenants.monthlyRent') }} <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{{
                      CURRENCY_SYMBOLS[settingsStore?.currency] || '€'
                    }}</span>
                    <input
                      id="tenant-rent"
                      v-model.number="form.rent"
                      type="number"
                      required
                      min="0"
                      step="10"
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-14 pr-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      :placeholder="$t('tenants.placeholders.rent')"
                    />
                  </div>
                </div>

                <!-- Statut de paiement -->
                <div>
                  <label for="tenant-status" class="block text-sm font-medium text-zinc-300 mb-2">
                    {{ $t('tenants.paymentStatus') }} <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tenant-status"
                    v-model="form.status"
                    required
                    class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  >
                    <option value="">{{ $t('tenants.selectStatus') }}</option>
                    <option :value="PAYMENT_STATUS.ON_TIME">{{ $t('status.onTime') }}</option>
                    <option :value="PAYMENT_STATUS.LATE">{{ $t('status.late') }}</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isLoading"
                  class="px-4 py-2 border border-white/15 rounded-lg text-zinc-300 font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading || isSubmitting"
                  class="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                      d="M12 4v16m8-8H4"
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
import { ref, computed, watch } from 'vue'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useToastStore } from '@/stores/toastStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/formatters'
import { PAYMENT_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'
import { toNumber } from '@/utils/formDataConverters'
import { tenantSchema, validate } from '@/utils/validators'

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
const settingsStore = useSettingsStore()

const isSubmitting = ref(false)

const form = ref({
  name: '',
  propertyId: '',
  entryDate: '',
  exitDate: '',
  rent: null,
  status: 'on_time'
})

const validationErrors = ref({})

/**
 * Liste des biens disponibles (libres ou occupés - on peut remplacer le locataire)
 */
const availableProperties = computed(() => {
  return propertiesStore.properties
})

/**
 * Bien sélectionné
 */
const selectedProperty = computed(() => {
  if (!form.value.propertyId) return null
  return propertiesStore.properties.find(p => p.id === form.value.propertyId)
})

/**
 * Réinitialise le formulaire
 */
const resetForm = () => {
  form.value = {
    name: '',
    propertyId: '',
    entryDate: '',
    exitDate: '',
    rent: null,
    status: 'on_time'
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
 * Pré-remplit le loyer si un bien est sélectionné
 */
const handlePropertyChange = () => {
  if (selectedProperty.value) {
    form.value.rent = selectedProperty.value.rent || null
  } else {
    form.value.rent = null
  }
}

/**
 * Prépare les données du formulaire pour qu'elles soient conformes aux interfaces TypeScript
 * (CreateTenantData / UpdateTenantData)
 *
 * Règles de transformation :
 *
 * 1. **Champs obligatoires :**
 *    - `name` : Chaîne non vide (trimée)
 *    - `propertyId` : UUID valide (string)
 *    - `entryDate` : Date au format ISO (YYYY-MM-DD)
 *    - `rent` : Nombre positif strictement supérieur à 0 (converti via `toNumber`)
 *
 * 2. **Champs optionnels :**
 *    - `exitDate` : Date au format ISO ou null si non renseignée
 *    - `status` : Inclus seulement si défini ('on_time' | 'late' | 'pending' | 'paid')
 *
 * 3. **Validation :**
 *    - Lance une erreur si `rent` est manquant, invalide, ou ≤ 0
 *    - Valide que `propertyId` est présent et non vide
 *    - Valide que `entryDate` est au format correct
 *
 * @returns {Object} Objet conforme à CreateTenantData
 * @throws {Error} Si les champs obligatoires sont manquants ou invalides
 *
 * @example
 * // Formulaire complet
 * form.value = {
 *   name: 'Jean Dupont',
 *   propertyId: 'uuid-123',
 *   entryDate: '2024-01-01',
 *   exitDate: '',
 *   rent: '1200',
 *   status: 'on_time'
 * }
 * prepareTenantData() // → { name: 'Jean Dupont', propertyId: 'uuid-123', entryDate: '2024-01-01', exitDate: null, rent: 1200, status: 'on_time' }
 */
const prepareTenantData = () => {
  // Validation de base : propertyId doit être présent
  if (!form.value.propertyId || form.value.propertyId.trim() === '') {
    throw new Error('Le bien associé est requis')
  }

  // Validation : entryDate doit être présent
  if (!form.value.entryDate || form.value.entryDate.trim() === '') {
    throw new Error("La date d'entrée est requise")
  }

  // Validation : rent doit être un nombre valide
  const rentValue = toNumber(form.value.rent)
  if (rentValue === undefined || rentValue <= 0) {
    throw new Error('Le loyer est requis et doit être un montant positif')
  }

  // Prépare les données en convertissant tous les champs numériques
  const submitData = {
    name: form.value.name.trim(),
    propertyId: form.value.propertyId.trim(),
    entryDate: form.value.entryDate.trim(),
    rent: rentValue, // Toujours un number valide à ce stade
    status: form.value.status || 'on_time'
  }

  // Date de sortie : incluse seulement si renseignée
  if (form.value.exitDate && form.value.exitDate.trim()) {
    submitData.exitDate = form.value.exitDate.trim()
  } else {
    submitData.exitDate = null
  }

  return submitData
}

/**
 * Soumet le formulaire avec validation et gestion d'erreurs
 * Affiche un toast d'erreur en cas de problème de validation
 */
const handleSubmit = async () => {
  if (isSubmitting.value) {
    return // Évite les soumissions multiples
  }

  validationErrors.value = {}

  try {
    isSubmitting.value = true

    // Prépare les données en garantissant la conformité avec les interfaces TypeScript
    const preparedData = prepareTenantData()

    // Validation supplémentaire avec Zod pour les règles métier
    const validationResult = validate(tenantSchema, preparedData)

    if (!validationResult.success) {
      // Affiche les erreurs de validation Zod
      const errorMessage = validationResult.error || 'Erreur de validation'
      toastStore.error(`Validation échouée : ${errorMessage}`)

      // Mappe les erreurs par champ pour affichage dans le formulaire (si nécessaire)
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
      property: selectedProperty.value?.name || ''
    }

    emit('submit', finalData)

    resetForm()
    emit('close')
  } catch (error) {
    // Affiche l'erreur à l'utilisateur via le système de notification
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur lors de la préparation des données'

    // Messages d'erreur utilisateur-friendly
    let userMessage = errorMessage
    if (errorMessage.includes('loyer')) {
      userMessage = 'Le loyer doit être un montant positif'
    } else if (errorMessage.includes('bien associé')) {
      userMessage = 'Veuillez sélectionner un bien'
    } else if (errorMessage.includes("date d'entrée")) {
      userMessage = "La date d'entrée est requise"
    } else if (errorMessage.includes('Erreur lors de la préparation')) {
      userMessage =
        'Erreur lors de la validation des données. Vérifiez que tous les champs requis sont remplis.'
    }

    toastStore.error(userMessage)
    console.error('Erreur de validation du formulaire:', errorMessage)
  } finally {
    isSubmitting.value = false
  }
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
