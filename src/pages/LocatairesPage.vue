<template>
  <DashboardLayout>
    <div class="p-6 space-y-6 w-full">
      <PullToRefresh
        :is-pulling="isPulling"
        :pull-distance="pullDistance"
        :is-refreshing="isRefreshing"
        :threshold="80"
      />

      <!-- Header avec statistiques -->
      <PageHeader
        :title="$t('tenants.title')"
        :subtitle="$t('tenants.subtitle')"
      >
        <template #actions>
          <button
            @click="isModalOpen = true"
            class="btn-primary flex items-center justify-center shrink-0 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-white/5 hover:opacity-90"
          >
            <Plus class="w-5 h-5 mr-2" />
            {{ $t('tenants.addTenant') }}
          </button>
        </template>
      </PageHeader>

      <!-- Statistiques globales -->
      <StatsGrid :stats="statsArray" />

      <!-- Barre de recherche -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-zinc-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-zinc-400 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-all duration-200"
          :placeholder="$t('common.search')"
        />
      </div>

      <!-- Filtres -->
      <div class="mb-6 flex flex-wrap items-center gap-4">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm border',
            activeFilter === filter.value
              ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20'
              : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- État de chargement initial (première fois, pas de données) -->
      <div
        v-if="
          propertiesStore.loading &&
          propertiesStore.properties.length === 0 &&
          !propertiesStore.error
        "
        class="text-center py-16"
      >
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"
        ></div>
        <p class="text-zinc-400">{{ $t('tenants.loading') }}</p>
      </div>

      <!-- Erreur (uniquement si pas de données en cache) -->
      <div
        v-else-if="propertiesStore.error && propertiesStore.properties.length === 0"
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
            {{ $t('common.errorWithColon') }} {{ propertiesStore.error }}
          </p>
        </div>
      </div>

      <!-- Loader inline si données déjà chargées (refresh) -->
      <div v-else-if="propertiesStore.loading" class="text-center py-8">
        <InlineLoader />
      </div>

      <div v-else>
        <TenantsList
          :tenants="filteredTenants"
          :has-filters="hasActiveFilters"
          @edit-tenant="handleEditTenant"
          @delete-tenant="handleDeleteTenant"
          @generate-lease="handleGenerateLease"
          @clear-filters="clearFilters"
        />
      </div>

      <!-- Template de bail (caché, visible uniquement à l'impression) -->
      <LeaseTemplate
        v-if="leaseData"
        :owner-data="leaseData.owner"
        :tenant-data="leaseData.tenant"
        :property-data="leaseData.property"
      />

      <!-- Modal d'ajout de locataire -->
      <AddTenantModal
        :isOpen="isModalOpen"
        :isLoading="propertiesStore.loading"
        @close="isModalOpen = false"
        @submit="handleAddTenant"
      />

      <!-- Modal d'édition de locataire -->
      <EditTenantModal
        :isOpen="isEditModalOpen"
        :tenant="selectedTenant"
        :propertyName="selectedPropertyName"
        :isLoading="propertiesStore.loading"
        @close="closeEditTenantModal"
        @submit="handleUpdateTenant"
      />

      <!-- Modal de confirmation de suppression -->
      <ConfirmModal
        :isOpen="showDeleteConfirm"
        title="Supprimer ce locataire ?"
        :message="
          $t('tenants.confirmDelete') ||
          'Êtes-vous sûr de vouloir supprimer ce locataire ? Le bien sera libéré.'
        "
        confirm-label="Supprimer"
        cancel-label="Annuler"
        variant="danger"
        :isLoading="isDeletingTenant"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
        @update:isOpen="showDeleteConfirm = $event"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PullToRefresh from '../components/common/PullToRefresh.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatsGrid from '@/components/shared/StatsGrid.vue'
import TenantsList from '../components/tenants/TenantsList.vue'
import AddTenantModal from '../components/tenants/AddTenantModal.vue'
import EditTenantModal from '../components/tenants/EditTenantModal.vue'
import InlineLoader from '../components/common/InlineLoader.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import LeaseTemplate from '../components/documents/LeaseTemplate.vue'
import { useTenantsStore } from '@/stores/tenantsStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { useAuthStore } from '@/stores/authStore'
import { PAYMENT_STATUS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import { Users, CheckCircle, AlertCircle, Wallet, Plus, Search } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const tenantsStore = useTenantsStore()
const propertiesStore = usePropertiesStore()
const authStore = useAuthStore()

const searchQuery = ref('')

// Pull-to-refresh
const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  async () => {
    // Force le rafraîchissement des propriétés (les locataires sont dérivés)
    await propertiesStore.fetchProperties(true) // force = true pour bypasser le cache
  },
  { threshold: 80 }
)

/**
 * Charge les propriétés depuis Supabase au montage (les locataires sont dérivés des propriétés)
 * Initialise le temps réel pour les mises à jour automatiques
 */
onMounted(async () => {
  try {
    // Force le fetch si pas encore chargé OU si loading est bloqué
    if (propertiesStore.properties.length === 0) {
      if (propertiesStore.loading) {
        // Attend max 3 secondes que le fetch se termine
        let attempts = 0
        while (propertiesStore.loading && attempts < 30) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
      }

      // Si toujours pas de données après attente (que loading soit true ou false), force un nouveau fetch
      if (propertiesStore.properties.length === 0) {
        if (propertiesStore.loading) {
          // Force loading à false pour débloquer
          propertiesStore.loading = false
        }
        await propertiesStore.fetchProperties(true) // force = true pour bypasser le check loading
      }
    }

    // Note: Realtime est déjà initialisé globalement dans App.vue
    // Pas besoin de réinitialiser ici
  } catch (error) {
    console.error('❌ Erreur lors du chargement des locataires:', error)
    // Force loading à false en cas d'erreur
    propertiesStore.loading = false
  }
})

/**
 * Arrête le temps réel au démontage (optionnel)
 */
onUnmounted(() => {
  // propertiesStore.stopRealtime()
})

// Utilise les locataires du store Pinia (synchronisé avec propertiesStore)
const tenants = computed(() => tenantsStore.tenants)

// État local pour filtres et modals
const activeFilter = ref('all')
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedTenant = ref(null)
const selectedPropertyName = ref('')

const closeEditTenantModal = () => {
  isEditModalOpen.value = false
  selectedTenant.value = null
  selectedPropertyName.value = ''
}

/**
 * Statistiques globales depuis le store
 */
const stats = computed(() => ({
  totalTenants: tenants.value.length,
  onTimeTenants: tenantsStore.onTimeTenants.length,
  lateTenants: tenantsStore.lateTenants.length,
  totalRent: tenantsStore.totalTenantsRent
}))

/**
 * Statistiques formatées pour StatsGrid
 */
const statsArray = computed(() => [
  {
    label: t('common.all'),
    value: stats.value.totalTenants.toString(),
    icon: Users,
    glowColor: 'bg-violet-500/10 group-hover:bg-violet-500/20',
    iconBgColor: 'bg-opacity-10 bg-violet-500',
    iconColor: 'text-violet-200'
  },
  {
    label: t('status.onTime'),
    value: stats.value.onTimeTenants.toString(),
    icon: CheckCircle,
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    iconBgColor: 'bg-opacity-10 bg-emerald-500',
    iconColor: 'text-emerald-200'
  },
  {
    label: t('status.late'),
    value: stats.value.lateTenants.toString(),
    icon: AlertCircle,
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    iconBgColor: 'bg-opacity-10 bg-rose-500',
    iconColor: 'text-rose-200'
  },
  {
    label: t('tenants.totalRent'),
    value: formatCurrency(stats.value.totalRent),
    icon: Wallet,
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    iconBgColor: 'bg-opacity-10 bg-amber-500',
    iconColor: 'text-amber-200'
  }
])

/**
 * Filtres disponibles
 */
const filters = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('status.onTime'), value: PAYMENT_STATUS.ON_TIME },
  { label: t('status.late'), value: PAYMENT_STATUS.LATE }
])

/**
 * Vérifie si des filtres sont actifs
 */
const hasActiveFilters = computed(() => {
  return activeFilter.value !== 'all' || searchQuery.value.length > 0
})

/**
 * Filtre les locataires selon le filtre actif
 */
const filteredTenants = computed(() => {
  let result = tenants.value

  // Apply status filter
  if (activeFilter.value !== 'all') {
    result = result.filter(tenant => tenant.status === activeFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      t =>
        t.name.toLowerCase().includes(query) ||
        t.property.toLowerCase().includes(query) ||
        (t.email && t.email.toLowerCase().includes(query))
    )
  }

  return result
})

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

/**
 * Réinitialise tous les filtres
 */
const clearFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
}

/**
 * Gère l'ajout d'un nouveau locataire via le store Pinia (Supabase)
 */
const handleAddTenant = async newTenant => {
  try {
    await tenantsStore.addTenant(newTenant)
    isModalOpen.value = false
    // Le toast est géré dans le store
  } catch (error) {
    // Le toast d'erreur est géré dans le store
    console.error("Erreur lors de l'ajout du locataire:", error)
  }
}

/**
 * Gère l'édition d'un locataire
 * Ouvre le modal d'édition avec les données du locataire
 */
const handleEditTenant = tenant => {
  if (tenant && tenant.propertyId) {
    selectedTenant.value = tenant
    selectedPropertyName.value = tenant.property || ''
    isEditModalOpen.value = true
  } else {
    console.warn('⚠️ handleEditTenant: locataire sans propertyId', tenant)
  }
}

/**
 * Gère la mise à jour d'un locataire
 */
const handleUpdateTenant = async updatedData => {
  if (!selectedTenant.value) return

  try {
    await tenantsStore.updateTenant(selectedTenant.value.id, updatedData)
    isEditModalOpen.value = false
    selectedTenant.value = null
    selectedPropertyName.value = ''
    // Le toast est géré dans le store
  } catch (error) {
    console.error('Erreur lors de la mise à jour du locataire:', error)
    // Le toast d'erreur est géré dans le store
  }
}

/**
 * Gère la suppression d'un locataire (libère le bien) via Supabase
 */
const confirmDeleteId = ref(null)
const showDeleteConfirm = ref(false)

const handleDeleteTenant = tenantId => {
  confirmDeleteId.value = tenantId
  showDeleteConfirm.value = true
}

const isDeletingTenant = ref(false)

const confirmDelete = async () => {
  if (!confirmDeleteId.value) return

  isDeletingTenant.value = true
  try {
    await tenantsStore.removeTenant(confirmDeleteId.value)
    confirmDeleteId.value = null
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('Erreur lors de la suppression du locataire:', error)
  } finally {
    isDeletingTenant.value = false
  }
}

const cancelDelete = () => {
  confirmDeleteId.value = null
  showDeleteConfirm.value = false
}

/**
 * Données du bail à générer
 */
const leaseData = ref(null)

/**
 * Génère le bail pour un locataire
 */
const handleGenerateLease = async tenant => {
  try {
    // 1. Récupère les données du propriétaire (bailleur)
    const profile = await authStore.fetchProfile(true) // force = true pour avoir les dernières données
    
    // Construction du nom complet depuis first_name + last_name (ou fallback sur full_name legacy)
    const fullName = profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.full_name || authStore.user?.user_metadata?.full_name || authStore.user?.email || 'Non renseigné'
    
    // Construction de l'adresse structurée (ou fallback sur address legacy)
    const addressFull = [
      profile?.address_line,
      profile?.postal_code && profile?.city
        ? `${profile.postal_code} ${profile.city}`
        : profile?.city || profile?.postal_code
    ].filter(Boolean).join(', ') || profile?.address || ''
    
    const ownerData = {
      fullName,
      name: fullName,
      // Adresse structurée (nouveaux champs)
      address: addressFull,
      addressLine: profile?.address_line || '',
      postalCode: profile?.postal_code || '',
      city: profile?.city || '',
      phone: profile?.phone || '',
      email: authStore.user?.email || '',
      // Type de bailleur
      landlordType: profile?.landlord_type || 'individual',
      // Informations juridiques (si société)
      company: profile?.landlord_type === 'company' ? (profile?.company || '') : '',
      legalForm: profile?.landlord_type === 'company' ? (profile?.legal_form || '') : '',
      siret: profile?.landlord_type === 'company' ? (profile?.siret || '') : '',
      rcs: profile?.landlord_type === 'company' ? (profile?.rcs || '') : '',
      capitalSocial: profile?.landlord_type === 'company' ? (profile?.capital_social || '') : '',
      // Informations bancaires
      iban: profile?.iban || '',
      bic: profile?.bic || '',
      bankName: profile?.bank_name || '',
      // Signature
      signatureUrl: profile?.signature_url || null
    }

    // 2. Récupère les données de la propriété
    const property = propertiesStore.properties.find(p => p.id === tenant.propertyId)
    if (!property) {
      const toastStore = (await import('@/stores/toastStore')).useToastStore()
      toastStore.error('Propriété introuvable pour ce locataire')
      return
    }

    // 3. Prépare les données du locataire
    const tenantData = {
      name: tenant.name,
      birthDate: tenant.birthDate || null,
      birthPlace: tenant.birthPlace || null,
      entryDate: tenant.entryDate,
      email: tenant.email || ''
    }

    // 4. Prépare les données de la propriété
    const propertyData = {
      address: property.address || '',
      zip: property.zip || '',
      city: property.city || '',
      type: property.type || 'apartment',
      surface: property.surface || null,
      pieces: property.pieces || null,
      heatingType: property.heatingType || 'Individuel',
      description: property.description || '',
      rentAmount: property.rent || 0,
      rent: property.rent || 0,
      chargesAmount: property.chargesAmount || null
    }

    // 5. Stocke les données du bail
    leaseData.value = {
      owner: ownerData,
      tenant: tenantData,
      property: propertyData
    }

    // 6. Attend un tick pour que Vue rende le template
    await new Promise(resolve => setTimeout(resolve, 100))

    // 7. Lance l'impression
    window.print()

    // 8. Affiche un toast de succès
    const toastStore = (await import('@/stores/toastStore')).useToastStore()
    toastStore.success('Bail généré avec succès')

    // 9. Nettoie après impression (optionnel, pour permettre plusieurs impressions)
    // leaseData.value = null
  } catch (error) {
    console.error('Erreur lors de la génération du bail:', error)
    const toastStore = (await import('@/stores/toastStore')).useToastStore()
    toastStore.error('Erreur lors de la génération du bail')
  }
}
</script>
