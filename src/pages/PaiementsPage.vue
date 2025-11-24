<template>
  <DashboardLayout>
    <div class="p-6 lg:p-10 max-w-7xl mx-auto">
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
          <button
            @click="isModalOpen = true"
            class="btn-primary flex items-center justify-center shrink-0 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-white/5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ $t('payments.addPayment') }}
          </button>
        </div>
      </div>

      <!-- Résumé des paiements -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('payments.pending') }}</p>
              <p class="text-2xl font-bold text-white">{{ pendingPayments.length }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <svg
                class="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('payments.late') }}</p>
              <p class="text-2xl font-bold text-rose-500">{{ latePayments.length }}</p>
            </div>
            <div class="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
              <svg
                class="w-6 h-6 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="glass-panel rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-zinc-400 mb-1">{{ $t('payments.paidThisMonth') }}</p>
              <p class="text-2xl font-bold text-emerald-500">{{ paidPayments.length }}</p>
            </div>
            <div class="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <svg
                class="w-6 h-6 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import PaymentsSection from '../components/dashboard/PaymentsSection.vue'
import AddPaymentModal from '../components/payments/AddPaymentModal.vue'
import EditPaymentModal from '../components/payments/EditPaymentModal.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import { usePaymentsStore } from '@/stores/paymentsStore'

const paymentsStore = usePaymentsStore()

// Pull-to-refresh
const mainElement = ref(null)
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
 * Gère la suppression d'un paiement
 */
const handleDeletePayment = async paymentId => {
  try {
    await paymentsStore.removePayment(paymentId)
    // Le toast est géré dans le store
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error('Erreur lors de la suppression du paiement:', error)
  }
}
</script>
