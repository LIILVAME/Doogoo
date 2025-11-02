<template>
  <div class="transition-all duration-200">
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('security.title') }}</h2>
        <p class="text-gray-600">{{ $t('security.subtitle') }}</p>
      </div>

      <!-- Carte 1: Mot de passe -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-start">
          <div
            class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4"
          >
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ $t('security.password.title') }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">{{ $t('security.password.description') }}</p>
            <button
              @click="isPasswordModalOpen = true"
              class="btn-primary inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              {{ $t('security.password.changeButton') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Carte 2: Authentification à deux facteurs -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-start">
          <div
            class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
          >
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('security.twoFactor.title') }}
              </h3>
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                  twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                <span
                  :class="[
                    'w-2 h-2 rounded-full mr-2',
                    twoFactorEnabled ? 'bg-green-500' : 'bg-gray-400'
                  ]"
                ></span>
                {{
                  twoFactorEnabled
                    ? $t('security.twoFactor.enabled')
                    : $t('security.twoFactor.disabled')
                }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ $t('security.twoFactor.description') }}</p>
            <button
              @click="toggleTwoFactor"
              :class="[
                'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors',
                twoFactorEnabled
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              ]"
            >
              {{
                twoFactorEnabled
                  ? $t('security.twoFactor.disable')
                  : $t('security.twoFactor.enable')
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Carte 3: Test de changement de mot de passe -->
      <div class="card hover:shadow-md transition-shadow">
        <PasswordChangeTest />
      </div>

      <!-- Carte 4: Sessions actives -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-start">
          <div
            class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4"
          >
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ $t('security.sessions.title') }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">{{ $t('security.sessions.description') }}</p>
            <button
              @click="handleSignOutAllDevices"
              :disabled="isSigningOut"
              class="btn-secondary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isSigningOut"
                class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {{
                isSigningOut
                  ? $t('security.sessions.signingOut')
                  : $t('security.sessions.signOutAll')
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de changement de mot de passe -->
    <ChangePasswordModal
      :isOpen="isPasswordModalOpen"
      @close="isPasswordModalOpen = false"
      @success="handlePasswordChanged"
    />

    <!-- Modal de confirmation de déconnexion -->
    <ConfirmModal
      :isOpen="showSignOutConfirm"
      title="Déconnexion de tous les appareils ?"
      :message="$t('security.sessions.confirmSignOut')"
      confirm-label="Déconnexion"
      cancel-label="Annuler"
      variant="danger"
      @confirm="confirmSignOut"
      @cancel="cancelSignOut"
      @update:isOpen="showSignOutConfirm = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import ChangePasswordModal from './ChangePasswordModal.vue'
import PasswordChangeTest from './PasswordChangeTest.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isPasswordModalOpen = ref(false)
const twoFactorEnabled = ref(false)
const isSigningOut = ref(false)
const showSignOutConfirm = ref(false)

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  if (toastStore) {
    toastStore.success(
      twoFactorEnabled.value
        ? t('security.twoFactor.enabledMessage')
        : t('security.twoFactor.disabledMessage')
    )
  }
}

const handlePasswordChanged = () => {
  // Le toast est déjà affiché dans ChangePasswordModal
  // On ne fait que fermer le modal si nécessaire
  // (il est déjà fermé dans ChangePasswordModal)
}

const handleSignOutAllDevices = () => {
  showSignOutConfirm.value = true
}

const confirmSignOut = async () => {
  showSignOutConfirm.value = false
  isSigningOut.value = true
  try {
    // TODO: Implémenter la déconnexion de tous les appareils via Supabase
    // Pour l'instant, on fait juste une déconnexion normale
    await authStore.logout()
    if (toastStore) {
      toastStore.success(t('security.sessions.signedOutSuccess'))
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    if (toastStore) {
      toastStore.error(t('security.sessions.signOutError'))
    }
  } finally {
    isSigningOut.value = false
  }
}

const cancelSignOut = () => {
  showSignOutConfirm.value = false
}
</script>
