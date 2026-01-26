<template>
  <DashboardLayout>
    <div class="p-6 lg:p-8 xl:p-10 w-full">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />

      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">{{ $t('payments.title') }}</h1>
            <p class="text-zinc-400">{{ $t('payments.subtitle') }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="handleGenerateMonthlyRents"
              :disabled="paymentsStore.loading || isGenerating"
              class="flex items-center justify-center shrink-0 bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/40 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw :class="['w-5 h-5 mr-2', isGenerating ? 'animate-spin' : '']" />
              {{ isGenerating ? 'Génération...' : '🔄 Générer les loyers' }}
            </button>
            <button
              @click="isModalOpen = true"
              class="btn-primary flex items-center justify-center shrink-0 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-white/5"
            >
              <Plus class="w-5 h-5 mr-2" />
              {{ $t('payments.addPayment') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Résumé des paiements -->
      <StatsGrid :stats="paymentStatsArray" />

      <!-- État de chargement (uniquement si aucune donnée) -->
      <div
        v-if="paymentsStore.loading && paymentsStore.payments.length === 0"
        class="text-center py-16"
      >
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"
        ></div>
        <p class="text-zinc-400">
          {{ $t('common.loading') }} {{ $t('payments.title').toLowerCase() }}...
        </p>
      </div>

      <!-- Erreur (uniquement si aucune donnée en cache) -->
      <div
        v-else-if="paymentsStore.error && paymentsStore.payments.length === 0"
        class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-rose-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-rose-400 font-medium">
            {{ $t('common.errorWithColon') }} {{ paymentsStore.error }}
          </p>
        </div>
      </div>

      <!-- Contenu principal (s'affiche même si loading en arrière-plan) -->
      <div v-else>
        <!-- Loader inline si refresh en cours ET données déjà présentes -->
        <div
          v-if="paymentsStore.loading && paymentsStore.payments.length > 0"
          class="text-center py-4 mb-4"
        >
          <InlineLoader />
        </div>

        <!-- Liste complète des paiements -->
        <PaymentsSection
          :payments="payments"
          :show-view-all="false"
          @edit-payment="handleEditPayment"
          @delete-payment="handleDeletePayment"
        />
      </div>

      <!-- Modal d'ajout de paiement -->
      <AddPaymentModal
        :isOpen="isModalOpen"
        :isLoading="paymentsStore.loading"
        @close="isModalOpen = false"
        @submit="handleAddPayment"
      />

      <!-- Modal d'édition de paiement -->
      <EditPaymentModal
        :isOpen="isEditModalOpen"
        :payment="selectedPayment"
        :isLoading="paymentsStore.loading"
        @close="isEditModalOpen = false"
        @submit="handleUpdatePayment"
      />

      <!-- Modal de confirmation de suppression -->
      <ConfirmModal
        :isOpen="showDeleteConfirm"
        title="Supprimer ce paiement ?"
        :message="deleteConfirmMessage"
        confirm-label="Supprimer"
        cancel-label="Annuler"
        variant="danger"
        :isLoading="isDeletingPayment"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
        @update:isOpen="showDeleteConfirm = $event"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import PaymentsSection from '../components/dashboard/PaymentsSection.vue'
import AddPaymentModal from '../components/payments/AddPaymentModal.vue'
import EditPaymentModal from '../components/payments/EditPaymentModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { formatCurrency } from '@/utils/formatters'
import { Plus, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-vue-next'

const { t } = useI18n()

const paymentsStore = usePaymentsStore()

// Pull-to-refresh
const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  async () => {
    // Force le rafraîchissement des paiements
    await paymentsStore.fetchPayments(true) // force = true pour bypasser le cache
  },
  { threshold: 80 }
)

/**
 * Charge les paiements depuis Supabase au montage
 * Note: App.vue charge déjà les données au démarrage, on ne recharge jamais ici
 * pour éviter les conflits et les états loading bloqués
 */
onMounted(() => {
  // App.vue gère déjà le chargement initial et le realtime
  // On fait confiance au store pour les données déjà chargées
})

/**
 * Arrête le temps réel au démontage (optionnel)
 */
onUnmounted(() => {
  // paymentsStore.stopRealtime() // Décommenter si nécessaire
})

// Utilise les paiements du store Pinia (synchronisé avec DashboardPage)
const payments = computed(() => paymentsStore.payments)

// État des modals
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedPayment = ref(null)

// État pour la suppression
const showDeleteConfirm = ref(false)
const paymentToDelete = ref(null)
const isDeletingPayment = ref(false)

// État pour la génération mensuelle
const isGenerating = ref(false)

/**
 * Paiements en attente
 */
const pendingPayments = computed(() => {
  return paymentsStore.pendingPayments
})

/**
 * Paiements en retard
 */
const latePayments = computed(() => {
  return paymentsStore.latePayments
})

/**
 * Paiements effectués
 */
const paidPayments = computed(() => {
  return paymentsStore.paidPayments
})

/**
 * Stats pour StatsGrid
 */
const paymentStatsArray = computed(() => [
  {
    label: t('payments.pending'),
    value: pendingPayments.value.length.toString(),
    icon: Clock,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-500'
  },
  {
    label: t('payments.late'),
    value: latePayments.value.length.toString(),
    icon: AlertCircle,
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    iconBgColor: 'bg-opacity-10 bg-rose-500',
    iconColor: 'text-rose-500'
  },
  {
    label: t('payments.paidThisMonth'),
    value: paidPayments.value.length.toString(),
    icon: CheckCircle,
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBgColor: 'bg-opacity-10 bg-emerald-500',
    iconColor: 'text-emerald-500'
  }
])

/**
 * Gère l'ajout d'un nouveau paiement via le store Pinia (Supabase)
 */
const handleAddPayment = async newPayment => {
  try {
    await paymentsStore.addPayment(newPayment)
    isModalOpen.value = false
    // Le toast est géré dans le store
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error("Erreur lors de l'ajout du paiement:", error)
  }
}

/**
 * Gère l'édition d'un paiement
 */
const handleEditPayment = payment => {
  selectedPayment.value = payment
  isEditModalOpen.value = true
}

/**
 * Gère la mise à jour d'un paiement
 */
const handleUpdatePayment = async updatedData => {
  if (!selectedPayment.value) return

  try {
    await paymentsStore.updatePayment(selectedPayment.value.id, updatedData)
    isEditModalOpen.value = false
    selectedPayment.value = null
    // Le toast est géré dans le store
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error('Erreur lors de la mise à jour du paiement:', error)
  }
}

/**
 * Gère la suppression d'un paiement (ouvre la modal de confirmation)
 */
const handleDeletePayment = paymentId => {
  paymentToDelete.value = paymentsStore.payments.find(p => p.id === paymentId)
  showDeleteConfirm.value = true
}

/**
 * Message de confirmation avec le montant
 */
const deleteConfirmMessage = computed(() => {
  if (!paymentToDelete.value) return 'Êtes-vous sûr de vouloir supprimer ce paiement ?'
  return (
    t('payments.confirmDelete', { amount: formatCurrency(paymentToDelete.value.amount) }) ||
    `Êtes-vous sûr de vouloir supprimer ce paiement de ${formatCurrency(paymentToDelete.value.amount)} ?`
  )
})

/**
 * Confirme et supprime le paiement
 */
const confirmDelete = async () => {
  if (!paymentToDelete.value) return

  isDeletingPayment.value = true
  try {
    await paymentsStore.removePayment(paymentToDelete.value.id)
    paymentToDelete.value = null
    showDeleteConfirm.value = false
    // Le toast est géré dans le store
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error('Erreur lors de la suppression du paiement:', error)
  } finally {
    isDeletingPayment.value = false
  }
}

/**
 * Annule la suppression
 */
const cancelDelete = () => {
  paymentToDelete.value = null
  showDeleteConfirm.value = false
}

/**
 * Génère automatiquement les paiements mensuels pour tous les locataires actifs
 */
const handleGenerateMonthlyRents = async () => {
  if (isGenerating.value) return

  isGenerating.value = true
  try {
    const result = await paymentsStore.generateMonthlyRents()
    // Le toast est géré dans le store
    if (import.meta.env.DEV) {
      console.log('Génération terminée:', result)
    }
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error('Erreur lors de la génération des loyers:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>
