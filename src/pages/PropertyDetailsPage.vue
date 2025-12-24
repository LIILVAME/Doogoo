<template>
  <DashboardLayout>
    <div class="p-6 lg:p-8 xl:p-10 w-full">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !property" class="text-center py-20">
        <div class="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 inline-block mb-4">
          <svg
            class="w-12 h-12 text-rose-400 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 class="text-lg font-medium text-white mb-1">Bien introuvable</h3>
          <p class="text-zinc-400">{{ error || "Ce bien n'existe pas ou a été supprimé." }}</p>
        </div>
        <br />
        <router-link
          to="/biens"
          class="inline-flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour aux biens
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <router-link
              to="/biens"
              class="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">{{ property.name }}</h1>
              <div class="flex items-center gap-2 text-zinc-400 text-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ property.address }}, {{ property.city }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              class="flex items-center gap-2"
              @click="isEditModalOpen = true"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Modifier
            </Button>
            <Button
              variant="danger"
              size="md"
              class="flex items-center gap-2"
              @click="showDeleteConfirm = true"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Overview Card -->
            <div class="glass-panel rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Vue d'ensemble</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p class="text-zinc-400 text-sm mb-1">Loyer</p>
                  <p class="text-xl font-bold text-white">{{ formatCurrency(property.rent) }}</p>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p class="text-zinc-400 text-sm mb-1">Surface</p>
                  <p class="text-xl font-bold text-white">
                    {{ property.surface ? property.surface + ' m²' : '-' }}
                  </p>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p class="text-zinc-400 text-sm mb-1">Pièces</p>
                  <p class="text-xl font-bold text-white">{{ property.pieces || '-' }}</p>
                </div>
                <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p class="text-zinc-400 text-sm mb-1">Type</p>
                  <p class="text-xl font-bold text-white capitalize">
                    {{ getTypeName(property.type) }}
                  </p>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-sm font-medium text-zinc-300 mb-2">Description</h3>
                <p class="text-zinc-400 leading-relaxed">
                  {{ property.description || 'Aucune description disponible pour ce bien.' }}
                </p>
              </div>
            </div>

            <!-- Photos (Placeholder) -->
            <div class="glass-panel rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-white">Photos</h2>
                <button type="button" class="text-sm text-violet-400 hover:text-violet-300">
                  Ajouter
                </button>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  class="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <!-- Placeholder for more photos -->
              </div>
            </div>
          </div>

          <!-- Sidebar Info -->
          <div class="space-y-6">
            <!-- Status Card -->
            <div class="glass-panel rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Statut</h2>
              <div
                class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
              >
                <span class="text-zinc-300">État actuel</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="statusClass"
                >
                  {{ statusText }}
                </span>
              </div>
            </div>

            <!-- Tenant Info (if occupied) -->
            <div v-if="property.tenant" class="glass-panel rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Locataire</h2>
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg"
                >
                  {{ property.tenant.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-white">{{ property.tenant.name }}</p>
                  <p class="text-xs text-zinc-400">
                    Depuis le {{ formatDate(property.tenant.entryDate) }}
                  </p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-zinc-400">Paiement</span>
                  <span
                    :class="
                      property.tenant.status === 'late' ? 'text-rose-400' : 'text-emerald-400'
                    "
                  >
                    {{ property.tenant.status === 'late' ? 'En retard' : 'À jour' }}
                  </span>
                </div>
                <button
                  type="button"
                  class="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-zinc-300 transition-colors"
                >
                  Voir profil locataire
                </button>
              </div>
            </div>

            <!-- Documents (Placeholder) -->
            <div class="glass-panel rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-white">Documents</h2>
                <button type="button" class="text-sm text-violet-400 hover:text-violet-300">
                  Ajouter
                </button>
              </div>
              <div class="space-y-2">
                <div
                  class="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center gap-3"
                >
                  <svg
                    class="w-5 h-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span class="text-sm text-zinc-300">Bail.pdf</span>
                </div>
                <!-- Placeholder -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <PropertyModal
        :is-open="isEditModalOpen"
        :property="property"
        @close="isEditModalOpen = false"
        @saved="handlePropertySaved"
      />

      <ConfirmModal
        :isOpen="showDeleteConfirm"
        title="Supprimer ce bien ?"
        message="Cette action est irréversible. Toutes les données associées seront supprimées."
        confirm-label="Supprimer"
        cancel-label="Annuler"
        variant="danger"
        :isLoading="isDeleting"
        @confirm="handleDelete"
        @cancel="showDeleteConfirm = false"
        @update:isOpen="showDeleteConfirm = $event"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/propertiesStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PropertyModal from '@/components/properties/PropertyModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import Button from '@/components/ui/Button.vue'
import { formatCurrency } from '@/utils/formatters'
import { PROPERTY_STATUS, STATUS_CLASSES } from '@/utils/constants'
import { useI18n } from '@/composables/useLingui'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()
const { t } = useI18n()

const propertyId = route.params.id
const property = ref(null)
const loading = ref(true)
const error = ref(null)

const isEditModalOpen = ref(false)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

// Fetch property data
const loadProperty = async () => {
  loading.value = true
  error.value = null

  // Check if property is already in store
  const existing = propertiesStore.properties.find(p => p.id === propertyId)
  if (existing) {
    property.value = existing
    loading.value = false
  } else {
    // If not, fetch all properties (since we don't have a single fetch method exposed in store yet, or we can rely on fetchProperties)
    // Ideally store should have getPropertyById but for now we fetch all
    await propertiesStore.fetchProperties()
    const found = propertiesStore.properties.find(p => p.id === propertyId)
    if (found) {
      property.value = found
    } else {
      error.value = 'Bien non trouvé'
    }
    loading.value = false
  }
}

onMounted(() => {
  loadProperty()
})

// Watch for store changes (e.g. after edit)
watch(
  () => propertiesStore.properties,
  () => {
    const found = propertiesStore.properties.find(p => p.id === propertyId)
    if (found) {
      property.value = found
    }
  },
  { deep: true }
)

// Helpers
const statusClass = computed(() => {
  if (!property.value) return ''
  return STATUS_CLASSES[property.value.status] || STATUS_CLASSES[PROPERTY_STATUS.VACANT]
})

const statusText = computed(() => {
  if (!property.value) return ''
  return property.value.status === PROPERTY_STATUS.OCCUPIED
    ? t('properties.occupied')
    : t('properties.free')
})

const formatDate = dateStr => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const getTypeName = type => {
  const types = {
    apartment: 'Appartement',
    house: 'Maison',
    parking: 'Parking',
    commercial: 'Local commercial',
    other: 'Autre'
  }
  return types[type] || type || 'Non spécifié'
}

// Actions
const handlePropertySaved = async data => {
  try {
    await propertiesStore.updateProperty(property.value.id, data)
    isEditModalOpen.value = false
    // Property will update via watch
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await propertiesStore.removeProperty(property.value.id)
    router.push('/biens')
  } catch (e) {
    console.error(e)
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}
</script>
