<template>
  <SettingsSection title="Profil utilisateur">
    <!-- État de chargement -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
    </div>

    <form v-else @submit.prevent="saveProfile" class="space-y-6">
      <!-- Avatar / Photo de profil -->
      <div class="flex items-center gap-6 pb-6 border-b border-white/10">
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
        </div>
        <div class="flex-1">
          <label
            for="avatar-upload"
            class="inline-flex items-center px-4 py-2 rounded-xl font-medium transition-colors border-2 border-violet-500 bg-transparent hover:bg-violet-500/10 text-violet-400 hover:text-violet-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

      <!-- Sélection Type de Bailleur -->
      <div class="mb-6 pb-6 border-b border-white/10">
        <label class="block text-sm font-medium text-zinc-300 mb-3">
          Je suis <span class="text-rose-400">*</span>
        </label>
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            @click="profile.landlord_type = 'individual'"
            :class="[
              'px-4 py-3 rounded-xl border-2 transition-all',
              profile.landlord_type === 'individual'
                ? 'border-violet-500 bg-violet-500/10 text-white'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Particulier</span>
            </div>
          </button>
          <button
            type="button"
            @click="profile.landlord_type = 'company'"
            :class="[
              'px-4 py-3 rounded-xl border-2 transition-all',
              profile.landlord_type === 'company'
                ? 'border-violet-500 bg-violet-500/10 text-white'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Société</span>
            </div>
          </button>
        </div>
        <p class="text-xs text-zinc-400 mt-2">
          Cette information est utilisée pour adapter les contrats de bail à votre situation
        </p>
      </div>

      <!-- Sections organisées avec accordéon -->
      <div class="space-y-4">
        <!-- Section 1: Identité -->
        <ProfileSection
          :is-open="openSections.identity"
          @toggle="openSections.identity = !openSections.identity"
          title="Identité"
          description="Prénom, nom et coordonnées"
          icon="user"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">
                Prénom <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="profile.first_name"
                type="text"
                required
                class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                :class="{ 'border-red-500/50': errors.first_name }"
                placeholder="Jean"
                @blur="validateField('first_name')"
              />
              <p v-if="errors.first_name" class="text-xs text-red-400 mt-1">
                {{ errors.first_name }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">
                Nom <span class="text-rose-400">*</span>
              </label>
              <input
                v-model="profile.last_name"
                type="text"
                required
                class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                :class="{ 'border-red-500/50': errors.last_name }"
                placeholder="Dupont"
                @blur="validateField('last_name')"
              />
              <p v-if="errors.last_name" class="text-xs text-red-400 mt-1">
                {{ errors.last_name }}
              </p>
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
                :class="{ 'border-red-500/50': errors.phone }"
                placeholder="06 12 34 56 78"
                @blur="validateField('phone')"
              />
              <p v-if="errors.phone" class="text-xs text-red-400 mt-1">{{ errors.phone }}</p>
              <p v-else class="text-xs text-zinc-500 mt-1">
                Format: 06 12 34 56 78 ou +33 6 12 34 56 78
              </p>
            </div>
          </div>
        </ProfileSection>

        <!-- Section 2: Adresse -->
        <ProfileSection
          :is-open="openSections.address"
          @toggle="openSections.address = !openSections.address"
          title="Adresse postale"
          description="Pour l'en-tête des contrats et quittances"
          icon="map"
        >
          <div class="space-y-4 pt-4">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">
                Adresse (ligne 1)
              </label>
              <input
                v-model="profile.address_line"
                type="text"
                class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                placeholder="123 Rue de la République"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-1">
                <label class="block text-sm font-medium text-zinc-300 mb-2"> Code postal </label>
                <input
                  v-model="profile.postal_code"
                  type="text"
                  maxlength="5"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  :class="{ 'border-red-500/50': errors.postal_code }"
                  placeholder="75001"
                  @blur="validateField('postal_code')"
                />
                <p v-if="errors.postal_code" class="text-xs text-red-400 mt-1">
                  {{ errors.postal_code }}
                </p>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-zinc-300 mb-2"> Ville </label>
                <input
                  v-model="profile.city"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  :class="{ 'border-red-500/50': errors.city }"
                  placeholder="Paris"
                  @blur="validateField('city')"
                />
                <p v-if="errors.city" class="text-xs text-red-400 mt-1">{{ errors.city }}</p>
              </div>
            </div>
          </div>
        </ProfileSection>

        <!-- Section 3: Entreprise / Juridique (uniquement si société) -->
        <ProfileSection
          v-if="profile.landlord_type === 'company'"
          :is-open="openSections.company"
          @toggle="openSections.company = !openSections.company"
          title="Informations juridiques"
          description="Société, SIRET, RCS, Capital social"
          icon="briefcase"
        >
          <div class="space-y-4 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">
                  Nom de l'entreprise / Société
                </label>
                <input
                  v-model="profile.company"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  placeholder="SCI Dupont, SARL..."
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">
                  Forme juridique
                </label>
                <select
                  v-model="profile.legal_form"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                >
                  <option value="" class="bg-zinc-900">Sélectionnez...</option>
                  <option value="SCI" class="bg-zinc-900">SCI (Société Civile Immobilière)</option>
                  <option value="SARL" class="bg-zinc-900">SARL</option>
                  <option value="SAS" class="bg-zinc-900">SAS</option>
                  <option value="SA" class="bg-zinc-900">SA</option>
                  <option value="SNC" class="bg-zinc-900">SNC</option>
                  <option value="Autre" class="bg-zinc-900">Autre</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2"> SIRET </label>
                <input
                  v-model="profile.siret"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  :class="{ 'border-red-500/50': errors.siret }"
                  placeholder="12345678901234"
                  @blur="validateField('siret')"
                />
                <p v-if="errors.siret" class="text-xs text-red-400 mt-1">{{ errors.siret }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2"> RCS </label>
                <input
                  v-model="profile.rcs"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  placeholder="RCS Paris B 123 456 789"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2"> Capital social </label>
              <input
                v-model="profile.capital_social"
                type="text"
                class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                placeholder="10 000 €"
              />
              <p class="text-xs text-zinc-500 mt-1">
                Montant du capital social de la société (ex: "10 000 €", "50 000 EUR")
              </p>
            </div>
          </div>
        </ProfileSection>

        <!-- Section 4: Informations bancaires -->
        <ProfileSection
          :is-open="openSections.banking"
          @toggle="openSections.banking = !openSections.banking"
          title="Informations bancaires"
          description="IBAN, BIC pour l'encaissement des loyers"
          icon="credit-card"
        >
          <div class="space-y-4 pt-4">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2"> IBAN </label>
              <input
                v-model="profile.iban"
                type="text"
                class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors uppercase"
                :class="{ 'border-red-500/50': errors.iban }"
                placeholder="FR76 1234 5678 9012 3456 7890 123"
                @blur="validateField('iban')"
              />
              <p v-if="errors.iban" class="text-xs text-red-400 mt-1">{{ errors.iban }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2"> BIC </label>
                <input
                  v-model="profile.bic"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors uppercase"
                  :class="{ 'border-red-500/50': errors.bic }"
                  placeholder="BNPAFRPP"
                  @blur="validateField('bic')"
                />
                <p v-if="errors.bic" class="text-xs text-red-400 mt-1">{{ errors.bic }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">
                  Nom de la banque
                </label>
                <input
                  v-model="profile.bank_name"
                  type="text"
                  class="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-colors"
                  placeholder="Banque Populaire, Crédit Agricole..."
                />
              </div>
            </div>
          </div>
        </ProfileSection>

        <!-- Section 5: Signature -->
        <ProfileSection
          :is-open="openSections.signature"
          @toggle="openSections.signature = !openSections.signature"
          title="Signature"
          description="Uploader votre signature ou tampon pour les contrats"
          icon="pen"
        >
          <div class="pt-4">
            <div v-if="profile.signature_url" class="mb-4">
              <img
                :src="profile.signature_url"
                alt="Signature"
                class="max-w-xs border border-white/10 rounded-lg p-4 bg-white/5"
              />
            </div>
            <label
              for="signature-upload"
              class="inline-flex items-center px-4 py-2 rounded-xl font-medium transition-colors border-2 border-violet-500 bg-transparent hover:bg-violet-500/10 text-violet-400 hover:text-violet-300 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': isUploadingSignature }"
            >
              <svg
                v-if="isUploadingSignature"
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
              <svg
                v-else
                class="w-4 h-4 mr-2"
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
              {{
                isUploadingSignature
                  ? 'Upload en cours...'
                  : profile.signature_url
                    ? 'Changer la signature'
                    : 'Uploader une signature'
              }}
            </label>
            <input
              id="signature-upload"
              type="file"
              accept="image/*"
              @change="onSignatureChange"
              :disabled="isUploadingSignature"
              class="hidden"
            />
            <p class="text-xs text-zinc-400 mt-2">
              Formats acceptés : JPG, PNG (recommandé: fond transparent, max 2MB)
            </p>
            <button
              v-if="profile.signature_url"
              type="button"
              @click="removeSignature"
              class="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Supprimer la signature
            </button>
          </div>
        </ProfileSection>
      </div>

      <!-- Message de succès/erreur global -->
      <div v-if="globalError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p class="text-sm text-red-400">{{ globalError }}</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-white/10">
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center px-4 py-2.5 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
          {{ isSaving ? 'Sauvegarde...' : 'Enregistrer le profil' }}
        </button>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import SettingsSection from './SettingsSection.vue'
import ProfileSection from './ProfileSection.vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { profileSchema, validate } from '@/utils/validators'
import { authApi } from '@/api'

const authStore = useAuthStore()
const toastStore = useToastStore()

// État du profil
const profile = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  landlord_type: 'individual', // Par défaut: particulier
  company: '',
  legal_form: '',
  capital_social: '',
  address_line: '',
  postal_code: '',
  city: '',
  siret: '',
  rcs: '',
  iban: '',
  bic: '',
  bank_name: '',
  signature_url: null
})

// État de l'interface
const preview = ref(null)
const isSaving = ref(false)
const isLoading = ref(false)
const isUploading = ref(false)
const isUploadingSignature = ref(false)
const avatarFile = ref(null)
const signatureFile = ref(null)
const globalError = ref(null)
const errors = reactive({})

// Sections pliables (toutes ouvertes par défaut la première fois, ensuite mémorisées)
const openSections = reactive({
  identity: true,
  address: false,
  company: false,
  banking: false,
  signature: false
})

// Initialise les valeurs depuis le store
onMounted(async () => {
  isLoading.value = true

  try {
    if (!authStore.user) {
      console.warn('ProfileSettings: User not authenticated')
      isLoading.value = false
      return
    }

    // Charge le profil depuis Supabase
    const profileData = await authStore.fetchProfile()

    if (profileData) {
      // Remplit tous les champs avec les données du profil
      profile.first_name = profileData.first_name || ''
      profile.last_name = profileData.last_name || ''
      profile.email = authStore.user?.email || ''
      profile.phone = profileData.phone || ''
      profile.landlord_type =
        profileData.landlord_type || (profileData.company ? 'company' : 'individual')
      profile.company = profileData.company || ''
      profile.legal_form = profileData.legal_form || ''
      profile.capital_social = profileData.capital_social || ''
      profile.address_line = profileData.address_line || ''
      profile.postal_code = profileData.postal_code || ''
      profile.city = profileData.city || ''
      profile.siret = profileData.siret || ''
      profile.rcs = profileData.rcs || ''
      profile.iban = profileData.iban || ''
      profile.bic = profileData.bic || ''
      profile.bank_name = profileData.bank_name || ''
      profile.signature_url = profileData.signature_url || null

      // Si first_name/last_name sont vides mais full_name existe, on essaie de les extraire
      if ((!profile.first_name || !profile.last_name) && profileData.full_name) {
        const parts = profileData.full_name.trim().split(' ')
        if (parts.length >= 2) {
          profile.first_name = parts[0]
          profile.last_name = parts.slice(1).join(' ')
        }
      }

      // Affiche l'avatar s'il existe
      if (profileData.avatar_url) {
        preview.value = profileData.avatar_url
      }

      // Restaure l'état des sections depuis sessionStorage
      const savedSections = sessionStorage.getItem('profile-sections-state')
      if (savedSections) {
        try {
          const parsed = JSON.parse(savedSections)
          Object.assign(openSections, parsed)
        } catch (e) {
          console.warn('Erreur lors de la restauration des sections:', e)
        }
      }
    } else if (authStore.user) {
      // Si pas de profil mais utilisateur connecté, utilise les données de l'utilisateur
      profile.email = authStore.user.email || ''
      profile.first_name = authStore.user.user_metadata?.first_name || ''
      profile.last_name = authStore.user.user_metadata?.last_name || ''
      profile.phone = authStore.user.user_metadata?.phone || ''
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    toastStore.error('Erreur lors du chargement du profil')
  } finally {
    isLoading.value = false
  }
})

// Sauvegarde l'état des sections
const saveSectionsState = () => {
  sessionStorage.setItem('profile-sections-state', JSON.stringify(openSections))
}

// Surveille les changements d'état des sections avec watch
watch(
  () => openSections,
  () => {
    saveSectionsState()
  },
  { deep: true }
)

// Nettoie les champs société si on passe de "company" à "individual"
watch(
  () => profile.landlord_type,
  (newType, oldType) => {
    if (oldType === 'company' && newType === 'individual') {
      // Nettoie les champs société
      profile.company = ''
      profile.legal_form = ''
      profile.capital_social = ''
      profile.siret = ''
      profile.rcs = ''
    }
  }
)

// Initiale pour l'avatar
const avatarInitial = computed(() => {
  if (profile.first_name) {
    return profile.first_name.charAt(0).toUpperCase()
  }
  if (profile.last_name) {
    return profile.last_name.charAt(0).toUpperCase()
  }
  if (profile.email) {
    return profile.email.charAt(0).toUpperCase()
  }
  return '?'
})

/**
 * Valide un champ individuel en temps réel
 */
const validateField = fieldName => {
  delete errors[fieldName]

  const result = validate(profileSchema, {
    ...profile,
    full_name:
      profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null
  })

  if (!result.success && result.errors) {
    const fieldError = result.errors.find(err => err.includes(fieldName))
    if (fieldError) {
      errors[fieldName] = fieldError.split(': ')[1] || fieldError
    }
  }
}

/**
 * Upload une image vers Supabase Storage via l'API layer
 */
const uploadImage = async (file, bucket, prefix = '') => {
  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  // Utilise l'API layer selon le type d'upload
  if (bucket === 'avatars') {
    const result = await authApi.uploadAvatar(authStore.user.id, file)
    if (!result.success) {
      throw new Error(result.message || "Erreur lors de l'upload de l'avatar")
    }
    return result.data
  } else if (bucket === 'signatures' || prefix === 'signature-') {
    const result = await authApi.uploadSignature(authStore.user.id, file)
    if (!result.success) {
      throw new Error(result.message || "Erreur lors de l'upload de la signature")
    }
    return result.data
  }

  // Fallback pour autres buckets (ne devrait pas arriver)
  throw new Error(`Bucket non supporté: ${bucket}`)
}

/**
 * Gère le changement de fichier pour l'upload d'avatar
 */
const onFileChange = async e => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toastStore.error('Le fichier est trop volumineux (max 2MB)')
    e.target.value = ''
    return
  }

  if (!file.type.startsWith('image/')) {
    toastStore.error('Format de fichier non supporté. Veuillez choisir une image.')
    e.target.value = ''
    return
  }

  preview.value = URL.createObjectURL(file)
  avatarFile.value = file

  // Upload immédiat
  isUploading.value = true
  try {
    const avatarUrl = await uploadImage(file, 'avatars')
    if (preview.value && preview.value.startsWith('blob:')) {
      URL.revokeObjectURL(preview.value)
    }
    preview.value = avatarUrl
    avatarFile.value = null
    toastStore.success('Photo de profil mise à jour avec succès')
  } catch (error) {
    // Log sécurisé : ne pas exposer les détails sensibles
    const { sanitizeObject } = await import('@/utils/sanitizeLogs')
    console.error('Erreur upload avatar:', sanitizeObject(error, ['message']))
    toastStore.error(error.message || "Erreur lors de l'upload de l'avatar")
  } finally {
    isUploading.value = false
    e.target.value = ''
  }
}

/**
 * Gère le changement de fichier pour l'upload de signature
 */
const onSignatureChange = async e => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    toastStore.error('Le fichier est trop volumineux (max 2MB)')
    e.target.value = ''
    return
  }

  if (!file.type.startsWith('image/')) {
    toastStore.error('Format de fichier non supporté. Veuillez choisir une image.')
    e.target.value = ''
    return
  }

  signatureFile.value = file
  isUploadingSignature.value = true

  try {
    // Upload vers un bucket 'signatures' (ou 'avatars' si le bucket signatures n'existe pas)
    const signatureUrl = await uploadImage(file, 'signatures', 'signature-').catch(async () => {
      // Fallback vers avatars si signatures n'existe pas
      return await uploadImage(file, 'avatars', 'signature-')
    })

    profile.signature_url = signatureUrl
    signatureFile.value = null
    toastStore.success('Signature uploadée avec succès')
  } catch (error) {
    // Log sécurisé : ne pas exposer les détails sensibles
    const { sanitizeObject } = await import('@/utils/sanitizeLogs')
    console.error('Erreur upload signature:', sanitizeObject(error, ['message']))
    toastStore.error(error.message || "Erreur lors de l'upload de la signature")
  } finally {
    isUploadingSignature.value = false
    e.target.value = ''
  }
}

/**
 * Supprime la signature
 */
const removeSignature = () => {
  profile.signature_url = null
  signatureFile.value = null
}

/**
 * Sauvegarde le profil utilisateur
 */
const saveProfile = async () => {
  isSaving.value = true
  globalError.value = null

  try {
    // Validation complète avec Zod
    const fullName =
      profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : null

    const validationData = {
      ...profile,
      full_name: fullName
    }

    const validation = validate(profileSchema, validationData)

    if (!validation.success) {
      // Affiche toutes les erreurs
      validation.errors.forEach(err => {
        const parts = err.split(': ')
        if (parts.length >= 2) {
          const field = parts[0]
          const message = parts.slice(1).join(': ')
          errors[field] = message
        }
      })
      globalError.value = 'Veuillez corriger les erreurs avant de sauvegarder'
      isSaving.value = false
      return
    }

    // Upload avatar en attente si nécessaire
    if (avatarFile.value && !isUploading.value) {
      try {
        isUploading.value = true
        const avatarUrl = await uploadImage(avatarFile.value, 'avatars')
        if (preview.value && preview.value.startsWith('blob:')) {
          URL.revokeObjectURL(preview.value)
        }
        preview.value = avatarUrl
        avatarFile.value = null
      } catch (error) {
        toastStore.error(error.message || "Erreur lors de l'upload de l'avatar")
        isSaving.value = false
        return
      } finally {
        isUploading.value = false
      }
    }

    // Récupère l'URL de l'avatar final
    const avatarUrl = preview.value && !preview.value.startsWith('blob:') ? preview.value : null

    // Préparation des données pour Supabase
    const updates = {
      first_name: profile.first_name?.trim() || null,
      last_name: profile.last_name?.trim() || null,
      full_name: fullName,
      phone: profile.phone?.trim() || null,
      landlord_type: profile.landlord_type || 'individual',
      company: profile.landlord_type === 'company' ? profile.company?.trim() || null : null,
      legal_form: profile.landlord_type === 'company' ? profile.legal_form?.trim() || null : null,
      capital_social:
        profile.landlord_type === 'company' ? profile.capital_social?.trim() || null : null,
      address_line: profile.address_line?.trim() || null,
      postal_code: profile.postal_code?.trim() || null,
      city: profile.city?.trim() || null,
      siret:
        profile.landlord_type === 'company'
          ? profile.siret?.trim()?.replace(/\s/g, '') || null
          : null,
      rcs: profile.landlord_type === 'company' ? profile.rcs?.trim() || null : null,
      iban: profile.iban?.trim()?.replace(/\s/g, '').toUpperCase() || null,
      bic: profile.bic?.trim()?.toUpperCase() || null,
      bank_name: profile.bank_name?.trim() || null,
      signature_url: profile.signature_url || null,
      avatar_url: avatarUrl
    }

    // Met à jour le profil dans Supabase
    await authStore.updateProfile(updates)

    // Recharge le profil pour avoir les données à jour
    await authStore.fetchProfile(true)

    // Nettoie les références
    avatarFile.value = null
    signatureFile.value = null

    // Efface les erreurs
    Object.keys(errors).forEach(key => delete errors[key])
    globalError.value = null

    toastStore.success('Profil mis à jour avec succès')
  } catch (err) {
    // Log sécurisé : ne pas exposer les détails sensibles
    const { sanitizeObject } = await import('@/utils/sanitizeLogs')
    console.error('Error saving profile:', sanitizeObject(err, ['message']))
    globalError.value = err.message || 'Erreur lors de la sauvegarde du profil'
  } finally {
    isSaving.value = false
  }
}
</script>
