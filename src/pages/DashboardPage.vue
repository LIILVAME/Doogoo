<template>
  <DashboardLayout>
    <div class="p-6 lg:p-10 max-w-7xl mx-auto">
      <DashboardHeader :stats="stats" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Liste des biens -->
        <div class="lg:col-span-2 space-y-6">
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
          <PaymentsSection :payments="recentPayments" />
          <!-- Vous pouvez ajouter d'autres widgets ici (ex: Activité récente) -->
        </div>
      </div>

      <!-- Modals -->
      <PropertyModal
        v-if="showPropertyModal"
        :show="showPropertyModal"
        :property="selectedProperty"
        @close="closePropertyModal"
        @save="handleSaveProperty"
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
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import PropertiesList from '@/components/dashboard/PropertiesList.vue'
import PaymentsSection from '@/components/dashboard/PaymentsSection.vue'
import PropertyModal from '@/components/properties/PropertyModal.vue'
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal.vue'

const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()

const showPropertyModal = ref(false)
const showDeleteModal = ref(false)
const selectedProperty = ref(null)
const propertyToDeleteId = ref(null)

onMounted(async () => {
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
