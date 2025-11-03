<template>
  <AuthLayout>
    <div>
      <!-- ÉTAPE 1 : Demande de réinitialisation (formulaire email) -->
      <div v-if="!hasResetToken && !emailSent">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">
          {{ $t('auth.reset.title') }}
        </h2>
        <p class="text-center text-gray-500 text-sm mb-6">{{ $t('auth.reset.subtitle') }}</p>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <AuthInput
            :label="$t('auth.reset.email')"
            type="email"
            v-model="form.email"
            :placeholder="$t('auth.reset.emailPlaceholder')"
            :error="emailError"
            required
          />

          <!-- Message d'erreur -->
          <transition name="slide-fade">
            <div
              v-if="authStore.error"
              class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p class="text-sm text-red-700 flex-1">{{ authStore.error }}</p>
              </div>
            </div>
          </transition>

          <AuthButton
            :label="$t('auth.reset.cta')"
            :loading="authStore.loading"
            type="submit"
            :disabled="!form.email"
          />

          <!-- Lien retour connexion -->
          <div class="mt-6 pt-6 border-t border-gray-200 text-center">
            <router-link
              to="/login"
              class="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              {{ $t('auth.reset.backToLogin') }}
            </router-link>
          </div>
        </form>
      </div>

      <!-- ÉTAPE 2 : Message de succès (email envoyé) -->
      <transition name="slide-fade">
        <div v-if="emailSent && !hasResetToken" class="text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ $t('auth.reset.successTitle') }}
          </h3>
          <p class="text-gray-600 mb-6">
            {{ $t('auth.reset.successMessage', { email: form.email }) }}
          </p>

          <AuthButton :label="$t('auth.reset.backToLogin')" @click="$router.push('/login')" />
        </div>
      </transition>

      <!-- ÉTAPE 3 : Formulaire de nouveau mot de passe (après clic sur le lien email) -->
      <div v-if="hasResetToken">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center text-gray-900">
          {{ $t('auth.reset.newPasswordTitle') }}
        </h2>
        <p class="text-center text-gray-500 text-sm mb-6">
          {{ $t('auth.reset.newPasswordSubtitle') }}
        </p>

        <form @submit.prevent="handleUpdatePassword" class="space-y-4">
          <!-- Nouveau mot de passe -->
          <div>
            <AuthInput
              :label="$t('auth.reset.newPassword')"
              type="password"
              v-model="form.newPassword"
              :placeholder="$t('auth.reset.newPasswordPlaceholder')"
              :error="newPasswordError"
              required
              minlength="6"
            />
            <!-- Indicateur de force -->
            <PasswordStrengthMeter
              v-if="form.newPassword"
              :password="form.newPassword"
              :show-tips="true"
            />
          </div>

          <!-- Confirmation -->
          <AuthInput
            :label="$t('auth.reset.confirmPassword')"
            type="password"
            v-model="form.confirmPassword"
            :placeholder="$t('auth.reset.confirmPasswordPlaceholder')"
            :error="confirmPasswordError"
            required
            minlength="6"
            :class="{
              'border-red-300':
                form.newPassword &&
                form.confirmPassword &&
                form.newPassword !== form.confirmPassword
            }"
          />
          <p
            v-if="
              form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword
            "
            class="text-xs text-red-600 -mt-2"
          >
            {{ $t('auth.reset.passwordMismatch') }}
          </p>

          <!-- Message d'erreur -->
          <transition name="slide-fade">
            <div
              v-if="errorMessage"
              class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p class="text-sm text-red-700 flex-1">{{ errorMessage }}</p>
              </div>
            </div>
          </transition>

          <AuthButton
            :label="$t('auth.reset.updateButton')"
            :loading="isUpdating"
            type="submit"
            :disabled="
              !form.newPassword ||
              !form.confirmPassword ||
              form.newPassword !== form.confirmPassword ||
              isUpdating
            "
          />

          <!-- Lien retour connexion -->
          <div class="mt-6 pt-6 border-t border-gray-200 text-center">
            <router-link
              to="/login"
              class="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              {{ $t('auth.reset.backToLogin') }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { supabase } from '@/lib/supabaseClient'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const emailSent = ref(false)
const hasResetToken = ref(false)
const isUpdating = ref(false)
const errorMessage = ref('')

/**
 * Vérifie si un token de réinitialisation est présent dans le hash de l'URL
 * Si oui, échange le token avec Supabase pour créer une session temporaire
 */
const checkResetToken = async () => {
  try {
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) {
      return false
    }

    // Extrait les paramètres du hash
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    // Vérifie que c'est bien un token de réinitialisation
    if (type === 'recovery' && accessToken && refreshToken) {
      // Nettoie l'URL en supprimant le hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search)

      // Échange les tokens avec Supabase pour créer une session temporaire
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        console.error("Erreur lors de l'échange des tokens de réinitialisation:", error)
        errorMessage.value = t('auth.reset.tokenError')
        return false
      }

      if (data.session) {
        // Met à jour le store auth avec la session temporaire
        authStore.user = data.user
        authStore.session = data.session
        hasResetToken.value = true
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    errorMessage.value = t('auth.reset.tokenError')
    return false
  }
}

const emailError = computed(() => {
  if (!form.value.email && authStore.error) return null
  return ''
})

const newPasswordError = computed(() => {
  if (!form.value.newPassword) {
    return errorMessage.value && errorMessage.value.toLowerCase().includes('password')
      ? errorMessage.value
      : ''
  }
  if (form.value.newPassword.length < 6) {
    return t('auth.reset.passwordTooShort')
  }
  return ''
})

const confirmPasswordError = computed(() => {
  if (form.value.confirmPassword && form.value.newPassword !== form.value.confirmPassword) {
    return t('auth.reset.passwordMismatch')
  }
  return ''
})

/**
 * Gère la demande de réinitialisation (étape 1 : demande d'email)
 */
const handleResetPassword = async () => {
  authStore.error = null
  const result = await authStore.resetPassword(form.value.email)

  if (result.success) {
    emailSent.value = true
    toastStore.success(t('auth.reset.successMessage', { email: form.value.email }))
  }
}

/**
 * Gère la mise à jour du mot de passe (étape 3 : après clic sur le lien email)
 */
const handleUpdatePassword = async () => {
  // Réinitialise les erreurs
  errorMessage.value = ''
  authStore.error = null

  // Validations
  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMessage.value = t('auth.reset.passwordMismatch')
    toastStore.error(t('auth.reset.passwordMismatch'))
    return
  }

  if (form.value.newPassword.length < 6) {
    errorMessage.value = t('auth.reset.passwordTooShort')
    toastStore.error(t('auth.reset.passwordTooShort'))
    return
  }

  if (!authStore.session) {
    errorMessage.value = t('auth.reset.noSession')
    toastStore.error(t('auth.reset.noSession'))
    router.push('/reset-password')
    return
  }

  isUpdating.value = true

  try {
    // Met à jour le mot de passe via Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: form.value.newPassword
    })

    if (updateError) {
      let errorMsg = t('auth.reset.updateError')

      if (updateError.message.includes('weak') || updateError.message.includes('strength')) {
        errorMsg = t('auth.reset.passwordTooWeak')
      } else {
        errorMsg = updateError.message || errorMsg
      }

      errorMessage.value = errorMsg
      toastStore.error(errorMsg)
      isUpdating.value = false
      return
    }

    // Succès : affiche un toast et redirige vers login
    toastStore.success(t('auth.reset.updateSuccess'))

    // Attend un court instant pour laisser voir le toast
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirige vers login
    router.push('/login?passwordReset=true')
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error)
    errorMessage.value = error.message || t('auth.reset.updateError')
    toastStore.error(errorMessage.value)
  } finally {
    isUpdating.value = false
  }
}

// Vérifie le token au montage
onMounted(async () => {
  await checkResetToken()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
