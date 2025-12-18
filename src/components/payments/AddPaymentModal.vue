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
                  class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                >
                  <svg
                    class="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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
                    <option value="" class="bg-zinc-900">
                      {{ $t('payments.selectProperty') }}
                    </option>
                    <option
                      v-for="property in propertiesWithTenants"
                      :key="property.id"
                      :value="property.id"
                      class="bg-zinc-900"
                    >
                      {{ property.name }} - {{ property.city }}
                    </option>
                    <option value="custom" class="bg-zinc-900">
                      {{ $t('payments.otherProperty') }}
                    </option>
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
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">{{
                      CURRENCY_SYMBOLS[settingsStore?.currency] || '€'
                    }}</span>
                    <input
                      id="payment-amount"
                      v-model="form.amount"
                      type="text"
                      inputmode="decimal"
                      required
                      class="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-14 pr-4 py-2.5 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors placeholder-zinc-500"
                      :placeholder="$t('payments.placeholders.amount')"
                      pattern="[0-9]+([.,][0-9]{1,2})?"
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
                    <option :value="TRANSACTION_STATUS.PAID" class="bg-zinc-900">
                      {{ $t('status.paid') }}
                    </option>
                    <option :value="TRANSACTION_STATUS.PENDING" class="bg-zinc-900">
                      {{ $t('status.pending') }}
                    </option>
                    <option :value="TRANSACTION_STATUS.LATE" class="bg-zinc-900">
                      {{ $t('status.late') }}
                    </option>
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{
                    isLoading || isSubmitting
                      ? $t('common.saving') || 'Enregistrement...'
                      : $t('common.add')
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
import { TRANSACTION_STATUS, CURRENCY_SYMBOLS } from '@/utils/constants'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useToastStore } from '@/stores/toastStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { toNumber } from '@/utils/formDataConverters'
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
const settingsStore = useSettingsStore()

const isSubmitting = ref(false)

const form = ref({
  propertyId: '',
  propertyCustom: '',
  tenant: '',
  tenantId: '',
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
    tenantId: '',
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
 * Pré-remplit le nom du locataire, l'ID du locataire et le montant si un bien est sélectionné
 */
const handlePropertyChange = () => {
  if (form.value.propertyId && form.value.propertyId !== 'custom') {
    const selectedProperty = propertiesStore.properties.find(p => p.id === form.value.propertyId)

    if (selectedProperty) {
      form.value.tenant = selectedProperty.tenant?.name || ''
      form.value.tenantId = selectedProperty.tenant?.id || ''
      form.value.amount = selectedProperty.rent || null
    }
  } else {
    // Réinitialise si on sélectionne "custom" ou vide
    if (form.value.propertyId !== 'custom') {
      form.value.tenant = ''
      form.value.tenantId = ''
      form.value.amount = null
    }
  }
}

// Note: calculateDefaultEndDate pourrait être utilisé pour suggérer automatiquement une date de fin
// de période, mais n'est pas implémenté pour l'instant

/**
 * Prépare les données du formulaire pour qu'elles soient conformes aux interfaces TypeScript
 * (CreatePaymentData)
 *
 * Règles de transformation :
 *
 * 1. **Champs obligatoires :**
 *    - `propertyId` : UUID valide (string) ou null si custom
 *    - `amount` : Nombre positif strictement supérieur à 0 (converti via `toNumber`)
 *    - `dueDate` : Date au format ISO (YYYY-MM-DD)
 *
 * 2. **Champs optionnels :**
 *    - `tenantId` : UUID du locataire si bien sélectionné avec locataire
 *    - `tenant` : Nom du locataire (string, pour affichage)
 *    - `property` : Nom du bien (string, pour affichage)
 *    - `status` : Statut du paiement (défaut: 'pending')
 *
 * 3. **Validation :**
 *    - Lance une erreur si `amount` est manquant, invalide, ou ≤ 0
 *    - Lance une erreur si `propertyId` est manquant (sauf si custom avec nom)
 *    - Lance une erreur si `dueDate` est manquant ou invalide
 *
 * 4. **Logique métier :**
 *    - Si bien "custom", propertyId peut être null mais propertyName doit être fourni
 *    - Si bien sélectionné, récupère automatiquement tenantId si disponible
 *
 * @returns {Object} Objet conforme à CreatePaymentData
 * @throws {Error} Si les champs obligatoires sont manquants ou invalides
 *
 * @example
 * // Paiement avec bien existant
 * form.value = {
 *   propertyId: 'uuid-123',
 *   tenant: 'Jean Dupont',
 *   tenantId: 'tenant-uuid-456',
 *   amount: '1200',
 *   dueDate: '2024-12-31',
 *   status: 'pending'
 * }
 * preparePaymentData() // → { propertyId: 'uuid-123', tenantId: 'tenant-uuid-456', amount: 1200, dueDate: '2024-12-31', status: 'pending', ... }
 */
const preparePaymentData = () => {
  // Validation : propertyId doit être présent ou custom avec nom
  let propertyId = null
  let propertyName = ''

  if (form.value.propertyId === 'custom') {
    propertyName = form.value.propertyCustom.trim()
    if (!propertyName) {
      throw new Error('Le nom du bien est requis')
    }
    propertyId = null // Custom property n'a pas d'UUID
  } else if (form.value.propertyId) {
    const selectedProperty = propertiesStore.properties.find(p => p.id === form.value.propertyId)
    if (!selectedProperty) {
      throw new Error('Le bien sélectionné est introuvable')
    }
    propertyName = selectedProperty.name || ''
    propertyId = form.value.propertyId.trim()
  } else {
    throw new Error('Veuillez sélectionner un bien')
  }

  // Validation : tenant doit être présent
  if (!form.value.tenant || form.value.tenant.trim() === '') {
    throw new Error('Le nom du locataire est requis')
  }

  // Validation : amount doit être un nombre valide
  const amountValue = toNumber(form.value.amount)
  if (amountValue === undefined || amountValue <= 0) {
    throw new Error('Le montant est requis et doit être supérieur à 0')
  }

  // Validation : dueDate doit être présent
  if (!form.value.dueDate || form.value.dueDate.trim() === '') {
    throw new Error("La date d'échéance est requise")
  }

  // Prépare les données en convertissant tous les champs
  const submitData = {
    propertyId: propertyId || '00000000-0000-0000-0000-000000000000', // UUID temporaire pour custom (Zod requiert UUID)
    amount: amountValue, // Toujours un number valide à ce stade
    dueDate: form.value.dueDate.trim(),
    status: form.value.status || TRANSACTION_STATUS.PENDING
  }

  // Ajoute tenantId si disponible
  if (form.value.tenantId && form.value.tenantId.trim()) {
    submitData.tenantId = form.value.tenantId.trim()
  }

  // Ajoute les champs pour l'UI (non validés par Zod mais nécessaires pour l'affichage)
  submitData.property = propertyName
  submitData.tenant = form.value.tenant.trim()

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
    const preparedData = preparePaymentData()

    // Validation supplémentaire avec Zod pour les règles métier (UUID, format date, etc.)
    const validationResult = validate(paymentSchema, preparedData)

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

    // Les données sont validées et prêtes
    emit('submit', validationResult.data)

    resetForm()
    emit('close')
  } catch (error) {
    // Affiche l'erreur à l'utilisateur via le système de notification
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur lors de la préparation des données'

    // Messages d'erreur utilisateur-friendly
    let userMessage = errorMessage
    if (errorMessage.includes('montant')) {
      userMessage = 'Le montant doit être supérieur à 0'
    } else if (errorMessage.includes('bien')) {
      userMessage = 'Veuillez sélectionner un bien ou saisir un nom de bien'
    } else if (errorMessage.includes('locataire')) {
      userMessage = 'Le nom du locataire est requis'
    } else if (errorMessage.includes("date d'échéance") || errorMessage.includes('date')) {
      userMessage = "La date d'échéance est requise"
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
