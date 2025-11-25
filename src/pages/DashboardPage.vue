<template>
  <DashboardLayout>
    <div class="p-6 lg:p-10 max-w-7xl mx-auto">
      <!-- Welcome Message -->
      <div class="mb-8">
        <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2">
          Hey {{ userFirstName }} 👋
        </h1>
        <p class="text-zinc-400 text-lg">
          {{ welcomeMessage }}
        </p>
      </div>

      <DashboardHeader 
        :stats="stats" 
        :loading="propertiesStore.loading || paymentsStore.loading"
      />

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
          <PaymentsSection 
            :payments="recentPayments" 
            :loading="paymentsStore.loading"
          />
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
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import PropertiesList from '@/components/dashboard/PropertiesList.vue'
import PaymentsSection from '@/components/dashboard/PaymentsSection.vue'
import PropertyModal from '@/components/properties/PropertyModal.vue'
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue'

const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()
const authStore = useAuthStore()

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
  propertiesStore.initRealtime();
  await Promise.all([propertiesStore.fetchProperties(), paymentsStore.fetchPayments()])
})

const stats = computed(() => {
  const allProperties = propertiesStore.properties
  const occupied = allProperties.filter(p => p.status === 'occupied').length
  const vacant = allProperties.filter(p => p.status === 'vacant').length
  const totalRent = allProperties.reduce((sum, p) => sum + (Number(p.rent) || 0), 0)

  // Calcul des retards de paiement
  const latePayments = paymentsStore.payments.filter(p => p.status === 'late').length

  return {
    totalProperties: allProperties.length,
    occupiedProperties: occupied,
    vacantProperties: vacant,
    totalRent,
    latePayments
  }
})

const recentProperties = computed(() => {
  return propertiesStore.properties.slice(0, 4) // Affiche les 4 premiers biens
})

const recentPayments = computed(() => {
  return paymentsStore.payments.slice(0, 5) // Affiche les 5 derniers paiements
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
