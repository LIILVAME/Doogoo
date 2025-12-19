<template>
  <SettingsSection title="Profil utilisateur">
    <!-- État de chargement -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <form v-else @submit.prevent="saveProfile" class="space-y-6">
      <!-- Avatar / Photo de profil -->
      <div class="flex items-center gap-6">
        <div class="relative">
          <div
            class="w-20 h-20 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center overflow-hidden"
          >
            <img v-if="preview" :src="preview" alt="Avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-violet-500/10">
              <span class="text-2xl font-semibold text-violet-400">
                {{ avatarInitial }}
              </span>
            </div>
          </div>
          <div
            v-if="preview"
            class="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <label
            for="avatar-upload"
            class="btn-secondary inline-flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
          >
            <svg
              v-if="isUploading"
              class="animate-spin w-4 h-4 mr-2"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ isUploading ? 'Upload en cours...' : 'Changer la photo' }}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            @change="onFileChange"
            :disabled="isUploading"
            class="hidden"
          />
          <p class="text-xs text-zinc-400 mt-2">
            {{ isUploading ? 'Upload en cours...' : 'Formats acceptés : JPG, PNG (max 2MB)' }}
          </p>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Nom complet <span class="text-rose-400">*</span>
          </label>
          <input
            v-model="profile.name"
            type="text"
            required
            class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Email <span class="text-rose-400">*</span>
          </label>
          <input
            :value="profile.email"
            type="email"
            disabled
            class="w-full bg-white/5 border border-white/10 text-zinc-500 rounded-xl px-4 py-2 cursor-not-allowed opacity-60"
            placeholder="votre@email.com"
          />
          <p class="text-xs text-zinc-500 mt-1">L'email ne peut pas être modifié ici</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2"> Téléphone </label>
          <input
            v-model="profile.phone"
            type="tel"
            class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
            placeholder="06 12 34 56 78"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Entreprise (optionnel)
          </label>
          <input
            v-model="profile.company"
            type="text"
            class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
            placeholder="Nom de votre entreprise"
          />
        </div>
      </div>

      <!-- Adresse postale (pour l'en-tête des documents) -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">
          Adresse postale (optionnel)
        </label>
        <textarea
          v-model="profile.address"
          rows="3"
          class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors resize-none"
          placeholder="123 Rue de la République, 75001 Paris"
        ></textarea>
        <p class="text-xs text-zinc-500 mt-1">
          Cette adresse apparaîtra dans l'en-tête de vos quittances PDF
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-white/10">
        <button type="submit" :disabled="isSaving" class="btn-primary flex items-center">
          <svg
            v-if="isSaving"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isSaving ? 'Sauvegarde...' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SettingsSection from './SettingsSection.vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const authStore = useAuthStore()
const toastStore = useToastStore()

const profile = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  address: ''
})

const preview = ref(null)
const isSaving = ref(false)
const isLoading = ref(false)
const isUploading = ref(false)
const avatarFile = ref(null)

// Initialise les valeurs depuis le store
onMounted(async () => {
  isLoading.value = true

  try {
    // Vérifie que l'utilisateur est connecté avant de charger le profil
    if (!authStore.user) {
      console.warn('ProfileSettings: User not authenticated')
      isLoading.value = false
      return
    }

    // Récupère le profil depuis Supabase
    const profileData = await authStore.fetchProfile()

    if (profileData) {
      profile.value = {
        name: profileData.full_name || '',
        email: authStore.user?.email || '',
        phone: profileData.phone || '',
        company: profileData.company || '',
        address: profileData.address || ''
      }

      // Affiche l'avatar s'il existe
      if (profileData.avatar_url) {
        preview.value = profileData.avatar_url
      }
    } else if (authStore.user) {
      // Si pas de profil mais utilisateur connecté, utilise les données de l'utilisateur
      profile.value = {
        name: authStore.user.user_metadata?.full_name || authStore.user.email?.split('@')[0] || '',
        email: authStore.user.email || '',
        phone: authStore.user.user_metadata?.phone || '',
        company: '',
        address: ''
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    // Ne bloque pas le rendu si le profil ne peut pas être chargé
    if (toastStore) {
      toastStore.error('Erreur lors du chargement du profil')
    }
  } finally {
    isLoading.value = false
  }
})

// Initiale pour l'avatar
const avatarInitial = computed(() => {
  if (profile.value.name) {
    return profile.value.name.charAt(0).toUpperCase()
  }
  if (profile.value.email) {
    return profile.value.email.charAt(0).toUpperCase()
  }
  return '?'
})

/**
 * Gère le changement de fichier pour l'upload de photo
 */
const onFileChange = async e => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validation de la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toastStore.error('Le fichier est trop volumineux (max 2MB)')
    // Réinitialise l'input
    e.target.value = ''
    return
  }

  // Validation du type
  if (!file.type.startsWith('image/')) {
    toastStore.error('Format de fichier non supporté. Veuillez choisir une image.')
    // Réinitialise l'input
    e.target.value = ''
    return
  }

  // Crée une prévisualisation immédiate
  preview.value = URL.createObjectURL(file)
  avatarFile.value = file

  // Upload immédiat vers Supabase Storage
  isUploading.value = true
  try {
    const avatarUrl = await authStore.uploadAvatar(file)
    // Met à jour la prévisualisation avec l'URL publique
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = avatarUrl
    avatarFile.value = null // Réinitialise car upload réussi
    toastStore.success('Photo de profil mise à jour avec succès')
  } catch (error) {
    // En cas d'erreur, garde la prévisualisation locale mais affiche l'erreur
    console.error('Erreur upload avatar:', error)
    // L'erreur est déjà affichée dans uploadAvatar via toastStore
  } finally {
    isUploading.value = false
    // Réinitialise l'input pour permettre de sélectionner le même fichier
    e.target.value = ''
  }
}

/**
 * Sauvegarde le profil utilisateur dans Supabase
 */
const saveProfile = async () => {
  isSaving.value = true

  try {
    // Validation : le nom ne peut pas être vide
    if (!profile.value.name || profile.value.name.trim() === '') {
      toastStore.error('Le nom complet est requis pour générer les quittances')
      isSaving.value = false
      return
    }

    // Si un fichier avatar est en attente (non uploadé), on l'upload d'abord
    if (avatarFile.value && !isUploading.value) {
      try {
        isUploading.value = true
        const avatarUrl = await authStore.uploadAvatar(avatarFile.value)
        // Met à jour la prévisualisation avec l'URL publique
        if (preview.value && preview.value.startsWith('blob:')) {
          URL.revokeObjectURL(preview.value)
        }
        preview.value = avatarUrl
        avatarFile.value = null
      } catch (error) {
        // L'erreur est déjà affichée dans uploadAvatar
        isSaving.value = false
        return
      } finally {
        isUploading.value = false
      }
    }

    // Récupère l'URL de l'avatar (soit depuis preview si c'est une URL publique, soit null)
    const avatarUrl =
      preview.value && !preview.value.startsWith('blob:') ? preview.value : null

    // Met à jour le profil dans Supabase avec toutes les données
    await authStore.updateProfile({
      fullName: profile.value.name.trim(),
      phone: profile.value.phone?.trim() || null,
      company: profile.value.company?.trim() || null,
      address: profile.value.address?.trim() || null,
      avatar_url: avatarUrl
    })

    // Recharge le profil pour avoir les données à jour (déjà fait dans updateProfile, mais on s'assure)
    await authStore.fetchProfile()

    // Nettoie les références locales
    avatarFile.value = null
  } catch (err) {
    console.error('Error saving profile:', err)
    // L'erreur est déjà gérée dans updateProfile avec un toast
  } finally {
    isSaving.value = false
  }
}
</script>
