<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      <!-- Welcome Message -->
      <div class="mb-8">
        <h1 class="text-3xl lg:text-4xl font-bold text-zinc-900 mb-2">
          Hey {{ userFirstName }} 👋
        </h1>
        <p class="text-zinc-600 text-lg">
          {{ welcomeMessage }}
        </p>
      </div>

      <!-- Section Alertes (Actions requises) -->
      <div
        v-if="!propertiesStore.loading && !paymentsStore.loading && metrics.alerts.hasAlerts"
        class="mb-6 space-y-3"
      >
        <div
          v-if="metrics.alerts.latePaymentsCount > 0"
          class="bg-danger-light border border-danger-border rounded-xl p-4 flex items-center justify-between shadow-sm"
        >
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-danger mr-3"
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
            <div>
              <p class="font-semibold text-text-primary">
                {{ metrics.alerts.latePaymentsCount }}
                {{
                  metrics.alerts.latePaymentsCount > 1
                    ? 'paiements en retard'
                    : 'paiement en retard'
                }}
              </p>
              <p class="text-sm text-danger">
                Total à récupérer : {{ formatCurrency(metrics.financial.pendingRevenue) }}
              </p>
            </div>
          </div>
          <router-link
            to="/paiements"
            class="text-danger hover:text-danger-700 text-sm font-medium hover:underline"
          >
            Voir les paiements →
          </router-link>
        </div>

        <div
          v-if="metrics.alerts.expiringLeasesCount > 0"
          class="bg-warning-light border border-warning-border rounded-xl p-4 flex items-center justify-between shadow-sm"
        >
          <div class="flex items-center">
            <svg
              class="w-6 h-6 text-warning mr-3"
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
            <div>
              <p class="font-semibold text-text-primary">
                {{ metrics.alerts.expiringLeasesCount }}
                {{ metrics.alerts.expiringLeasesCount > 1 ? 'baux expirant' : 'bail expirant' }}
                dans moins de 30 jours
              </p>
              <p class="text-sm text-warning-700">Action requise : renouvellement ou libération</p>
            </div>
          </div>
          <router-link
            to="/locataires"
            class="text-warning-700 hover:text-warning-800 text-sm font-medium hover:underline"
          >
            Voir les locataires →
          </router-link>
        </div>
      </div>

      <!-- Statistiques globales -->
      <StatsGrid :stats="dashboardStatsArray" />

      <!-- Grille principale : Biens / Paiements -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Liste des biens -->
        <div class="lg:col-span-2 space-y-6 h-full flex flex-col">
          <PropertiesList
            :properties="recentProperties"
            :loading="propertiesStore.loading"
            @add-property="openAddPropertyModal"
            @edit-property="openEditPropertyModal"
            @delete-property="confirmDeleteProperty"
          />
        </div>

        <!-- Section Paiements & Activité -->
        <div class="space-y-8">
          <PaymentsSection :payments="recentPayments" :loading="paymentsStore.loading" />
          <!-- Vous pouvez ajouter d'autres widgets ici (ex: Activité récente) -->
        </div>
      </div>

      <!-- Modals -->
      <PropertyModal
        v-if="showPropertyModal"
        :is-open="showPropertyModal"
        :property="selectedProperty"
        @close="closePropertyModal"
        @saved="handleSaveProperty"
      />

      <DeleteConfirmationModal
        v-if="showDeleteModal"
        :show="showDeleteModal"
        title="Supprimer le bien"
        message="Êtes-vous sûr de vouloir supprimer ce bien ? Cette action est irréversible."
        @close="closeDeleteModal"
        @confirm="handleDeleteProperty"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardMetrics } from '@/composables/useDashboardMetrics'
import { formatCurrency } from '@/utils/formatters'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import PropertiesList from '@/components/properties/PropertiesList.vue'
import PaymentsSection from '@/components/dashboard/PaymentsSection.vue'
import PropertyModal from '@/components/properties/PropertyModal.vue'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue'
import { Building2, Users, Home, Wallet } from 'lucide-vue-next'

const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()
const authStore = useAuthStore()

// Utilise le composable de métriques pour calculer les KPIs en temps réel
const { metrics } = useDashboardMetrics()

const showPropertyModal = ref(false)
const showDeleteModal = ref(false)
const selectedProperty = ref(null)
const propertyToDeleteId = ref(null)

// Computed property for user's first name
const userFirstName = computed(() => {
  if (authStore.profile?.full_name) {
    return authStore.profile.full_name.split(' ')[0]
  }
  if (authStore.user?.user_metadata?.full_name) {
    return authStore.user.user_metadata.full_name.split(' ')[0]
  }
  if (authStore.user?.email) {
    return authStore.user.email.split('@')[0]
  }
  return 'là'
})

// Computed property for dynamic welcome message based on time of day
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  const propertyCount = propertiesStore.properties.length

  if (hour < 12) {
    return propertyCount > 0
      ? `Bon début de journée ! Vous gérez ${propertyCount} bien${propertyCount > 1 ? 's' : ''} 🏡`
      : 'Bon début de journée ! Commencez par ajouter votre premier bien 🏡'
  } else if (hour < 18) {
    return propertyCount > 0
      ? `Bon après-midi ! ${propertyCount} bien${propertyCount > 1 ? 's' : ''} sous votre gestion 🏡`
      : 'Bon après-midi ! Prêt à gérer votre patrimoine immobilier ? 🏡'
  } else {
    return propertyCount > 0
      ? `Bonne soirée ! Votre portefeuille compte ${propertyCount} bien${propertyCount > 1 ? 's' : ''} 🏡`
      : 'Bonne soirée ! Ajoutez vos biens pour commencer 🏡'
  }
})

onMounted(async () => {
  // Initialize realtime subscription for properties
  propertiesStore.initRealtime()
  await Promise.all([propertiesStore.fetchProperties(), paymentsStore.fetchPayments()])
})

/**
 * Statistiques enrichies avec les métriques du Dashboard
 * Combine les métriques calculées avec les stats de base
 */
const stats = computed(() => {
  const allProperties = propertiesStore.properties
  const occupied = allProperties.filter(p => p.status === 'occupied').length
  const vacant = allProperties.filter(p => p.status === 'vacant').length
  const totalRent = allProperties.reduce((sum, p) => sum + (p.rent || 0), 0)

  // Utilise les métriques calculées depuis le composable
  const dashboardMetrics = metrics.value

  return {
    totalProperties: allProperties.length,
    occupiedProperties: occupied,
    vacantProperties: vacant,
    totalRent,
    latePayments: dashboardMetrics.alerts.latePaymentsCount,
    // Métriques financières
    totalRevenue: dashboardMetrics.financial.totalRevenue,
    pendingRevenue: dashboardMetrics.financial.pendingRevenue,
    // Métriques immobilières
    occupancyRate: dashboardMetrics.property.occupancyRate,
    // Alertes
    hasAlerts: dashboardMetrics.alerts.hasAlerts,
    expiringLeasesCount: dashboardMetrics.alerts.expiringLeasesCount
  }
})

const recentProperties = computed(() => {
  return propertiesStore.properties.slice(0, 4) // Affiche les 4 premiers biens
})

const recentPayments = computed(() => {
  return paymentsStore.payments.slice(0, 5) // Affiche les 5 derniers paiements
})

/**
 * Statistiques formatées pour StatsGrid
 */
const dashboardStatsArray = computed(() => {
  const isLoading = propertiesStore.loading || paymentsStore.loading
  const m = metrics.value

  return [
    {
      label: 'Total de biens',
      value: isLoading ? '...' : stats.value.totalProperties.toString(),
      trend: isLoading ? null : m.property.propertyTrend,
      icon: Building2,
      glowColor: 'bg-primary-500/5 group-hover:bg-primary-500/10',
      iconBgColor: 'bg-primary-50 border-primary-100',
      iconColor: 'text-primary-600'
    },
    {
      label: 'Biens occupés',
      value: isLoading ? '...' : stats.value.occupiedProperties.toString(),
      // trend: '100%', // Removed hardcoded trend
      icon: Users,
      glowColor: 'bg-success-500/5 group-hover:bg-success-500/10',
      iconBgColor: 'bg-success-50 border-success-100',
      iconColor: 'text-success-600'
    },
    {
      label: 'Biens libres',
      value: isLoading ? '...' : stats.value.vacantProperties.toString(),
      icon: Home,
      glowColor: 'bg-zinc-500/5 group-hover:bg-zinc-500/10',
      iconBgColor: 'bg-zinc-50 border-zinc-100',
      iconColor: 'text-zinc-600'
    },
    {
      label: 'Loyers mensuels',
      value: isLoading ? '...' : formatCurrency(stats.value.totalRent || 0),
      trend: isLoading ? null : m.financial.revenueTrend,
      icon: Wallet,
      glowColor: 'bg-warning-500/5 group-hover:bg-warning-500/10',
      iconBgColor: 'bg-warning-50 border-warning-100',
      iconColor: 'text-warning-600'
    }
  ]
})

const openAddPropertyModal = () => {
  selectedProperty.value = null
  showPropertyModal.value = true
}

const openEditPropertyModal = property => {
  selectedProperty.value = { ...property }
  showPropertyModal.value = true
}

const closePropertyModal = () => {
  showPropertyModal.value = false
  selectedProperty.value = null
}

const handleSaveProperty = async propertyData => {
  if (selectedProperty.value) {
    await propertiesStore.updateProperty(selectedProperty.value.id, propertyData)
  } else {
    await propertiesStore.addProperty(propertyData)
  }
  closePropertyModal()
}

const confirmDeleteProperty = propertyId => {
  propertyToDeleteId.value = propertyId
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  propertyToDeleteId.value = null
}

const handleDeleteProperty = async () => {
  if (propertyToDeleteId.value) {
    await propertiesStore.removeProperty(propertyToDeleteId.value)
    closeDeleteModal()
  }
}
</script>
