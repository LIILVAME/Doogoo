<template>
  <div class="space-y-4">
    <!-- Titre -->
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="text-lg font-semibold text-white">Documents (Baux, États des lieux...)</h3>
    </div>

    <!-- Zone d'upload (Drag & Drop) -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer',
        isDragging
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
      ]"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileSelect"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        multiple
      />
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-3 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="text-sm text-zinc-300 mb-1">
          Glissez-déposez vos documents ici ou
          <span class="text-blue-400 font-medium">cliquez pour sélectionner</span>
        </p>
        <p class="text-xs text-zinc-500">PDF, Word, Images (max 10MB)</p>
      </div>
    </div>

    <!-- Liste des documents -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <svg class="w-6 h-6 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <div v-else-if="documents.length === 0" class="text-center py-8">
      <svg
        class="w-12 h-12 mx-auto mb-3 text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-sm text-zinc-400">Aucun document pour ce locataire</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="doc in documents"
        :key="doc.name"
        class="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
      >
        <!-- Icône du type de fichier -->
        <div class="flex-shrink-0">
          <svg
            v-if="isPdf(doc.name)"
            class="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <svg
            v-else-if="isImage(doc.name)"
            class="w-8 h-8 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <svg
            v-else
            class="w-8 h-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <!-- Nom du fichier -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ extractDisplayName(doc.name) }}</p>
          <p class="text-xs text-zinc-400">
            {{ formatFileSize(doc.metadata?.size) }} •
            {{ formatDate(doc.created_at) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Bouton Voir -->
          <button
            @click.stop="handleViewDocument(doc)"
            :disabled="isLoadingUrl"
            class="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :title="$t('common.view') || 'Voir'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <!-- Bouton Supprimer -->
          <button
            @click.stop="handleDeleteClick(doc)"
            :disabled="isDeleting"
            class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :title="$t('common.delete') || 'Supprimer'"
          >
            <svg
              v-if="!isDeleting"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <DeleteConfirmationModal
      :show="showDeleteModal"
      :title="$t('common.confirmDelete') || 'Confirmer la suppression'"
      :message="
        $t('common.confirmDeleteMessage') ||
        'Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.'
      "
      @close="showDeleteModal = false"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTenantsStore } from '@/stores/tenantsStore'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue'

const props = defineProps({
  tenantId: {
    type: String,
    required: true
  }
})

const tenantsStore = useTenantsStore()

const fileInput = ref(null)
const isDragging = ref(false)
const documents = ref([])
const isLoading = ref(false)
const isUploading = ref(false)
const isDeleting = ref(false)
const isLoadingUrl = ref(false)
const showDeleteModal = ref(false)
const documentToDelete = ref(null)

/**
 * Extrait juste le nom du fichier (sans chemin)
 */
const getFileNameOnly = fullName => {
  return fullName.includes('/') ? fullName.split('/').pop() : fullName
}

/**
 * Vérifie si le fichier est un PDF
 */
const isPdf = fileName => {
  const name = getFileNameOnly(fileName)
  return name.toLowerCase().endsWith('.pdf')
}

/**
 * Vérifie si le fichier est une image
 */
const isImage = fileName => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const name = getFileNameOnly(fileName)
  const lower = name.toLowerCase()
  return imageExtensions.some(ext => lower.endsWith(ext))
}

/**
 * Formate la taille du fichier
 */
const formatFileSize = bytes => {
  if (!bytes) return 'Taille inconnue'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Formate la date
 */
const formatDate = dateString => {
  if (!dateString) return 'Date inconnue'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Déclenche le sélecteur de fichier
 */
const triggerFileInput = () => {
  fileInput.value?.click()
}

/**
 * Gère la sélection de fichier
 */
const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length > 0) {
    await uploadFiles(files)
  }
  // Reset l'input pour permettre de re-sélectionner le même fichier
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Gère le drop de fichiers
 */
const handleDrop = async event => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    await uploadFiles(files)
  }
}

/**
 * Upload les fichiers
 */
const uploadFiles = async files => {
  if (isUploading.value) return

  try {
    isUploading.value = true
    isDragging.value = false

    // Upload chaque fichier
    for (const file of files) {
      // Validation de la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`Fichier ${file.name} trop volumineux (max 10MB)`)
        continue
      }

      await tenantsStore.uploadDocument(props.tenantId, file)
    }

    // Rafraîchit la liste après upload
    await loadDocuments()
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
  } finally {
    isUploading.value = false
  }
}

/**
 * Charge la liste des documents
 */
const loadDocuments = async () => {
  if (!props.tenantId) return

  try {
    isLoading.value = true
    documents.value = await tenantsStore.fetchDocuments(props.tenantId)
  } catch (error) {
    console.error('Erreur lors du chargement des documents:', error)
    documents.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * Extrait le nom du fichier depuis le nom complet (pour l'affichage)
 * Le nom peut être le chemin complet (tenantId/timestamp_filename.ext) ou juste le nom
 */
const extractDisplayName = fullName => {
  // Si le nom contient un slash, extrait juste la partie après le dernier slash
  const fileName = fullName.includes('/') ? fullName.split('/').pop() : fullName
  // Enlève le préfixe timestamp si présent pour l'affichage
  const match = fileName.match(/^\d+_(.+)$/)
  return match ? match[1] : fileName
}

/**
 * Gère le clic sur "Voir"
 */
const handleViewDocument = async doc => {
  try {
    isLoadingUrl.value = true
    // Utilise le nom tel quel (peut être chemin complet ou juste le nom)
    // L'API gère les deux cas
    const url = await tenantsStore.getDocumentUrl(props.tenantId, doc.name)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL:", error)
  } finally {
    isLoadingUrl.value = false
  }
}

/**
 * Gère le clic sur "Supprimer"
 */
const handleDeleteClick = doc => {
  // Utilise le nom tel quel (peut être chemin complet ou juste le nom)
  // L'API gère les deux cas
  documentToDelete.value = doc.name
  showDeleteModal.value = true
}

/**
 * Confirme la suppression
 */
const handleDeleteConfirm = async () => {
  if (!documentToDelete.value) return

  try {
    isDeleting.value = true
    await tenantsStore.deleteDocument(props.tenantId, documentToDelete.value)
    // La liste est rafraîchie automatiquement par deleteDocument
    await loadDocuments()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
    documentToDelete.value = null
  }
}

// Charge les documents au montage et quand tenantId change
onMounted(() => {
  loadDocuments()
})

watch(
  () => props.tenantId,
  newId => {
    if (newId) {
      loadDocuments()
    }
  }
)
</script>
