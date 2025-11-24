<template>
  <AuthLayout>
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">
        {{ $t('auth.signup.title') }}
      </h2>
      <p class="text-center text-zinc-400 text-sm mb-6">{{ $t('auth.signup.subtitle') }}</p>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <!-- Nom complet -->
        <AuthInput
          :label="$t('auth.signup.fullName')"
          type="text"
          v-model="form.fullName"
          :placeholder="$t('auth.signup.fullName')"
          :error="fullNameError"
          required
        />

        <!-- Email -->
        <AuthInput
          :label="$t('auth.signup.email')"
          type="email"
          v-model="form.email"
          :placeholder="$t('auth.signup.emailPlaceholder')"
          :error="emailError"
          required
        />

        <!-- Téléphone (optionnel) -->
        <AuthInput
          :label="$t('auth.signup.phone')"
          type="tel"
          v-model="form.phone"
          :placeholder="$t('auth.signup.phonePlaceholder')"
          :hint="$t('common.optional')"
        />

        <!-- Mot de passe -->
        <div>
          <AuthInput
            :label="$t('auth.signup.password')"
            type="password"
            v-model="form.password"
            :placeholder="$t('auth.signup.passwordPlaceholder')"
            :error="passwordError"
            :hint="$t('auth.signup.passwordHint')"
            required
          />
          <!-- Indicateur de force -->
          <PasswordStrengthMeter v-if="form.password" :password="form.password" :show-tips="true" />
        </div>

        <!-- Confirmation mot de passe -->
        <AuthInput
          :label="$t('auth.signup.confirmPassword')"
          type="password"
          v-model="form.passwordConfirm"
          :placeholder="$t('auth.signup.passwordPlaceholder')"
          :error="passwordConfirmError"
          required
        />

        <!-- Message d'erreur global -->
        <transition name="slide-fade">
          <div
            v-if="
              authStore.error &&
              !fullNameError &&
              !emailError &&
              !passwordError &&
              !passwordConfirmError
            "
            class="p-4 bg-rose-500/10 border-l-4 border-rose-500/50 rounded-lg shadow-sm"
          >
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-rose-400 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p class="text-sm text-rose-400 flex-1">{{ authStore.error }}</p>
            </div>
          </div>
        </transition>

        <!-- Bouton d'inscription -->
        <AuthButton
          :label="$t('auth.signup.cta')"
          :loading="authStore.loading"
          type="submit"
          :disabled="
            !form.fullName ||
            !form.email ||
            !form.password ||
            form.password.length < 6 ||
            form.password !== form.passwordConfirm ||
            authStore.loading
          "
        />

        <!-- Boutons OAuth -->
        <AuthOAuth
          :loading="oauthLoading ? oauthProvider : false"
          :disabled="authStore.loading"
          :vertical="false"
          @oauth="handleOAuth"
        />

        <!-- Lien retour connexion -->
        <div class="mt-6 pt-6 border-t border-white/10 text-center">
          <p class="text-sm text-zinc-500">
            {{ $t('auth.signup.hasAccount') }}
            <router-link
              to="/login"
              class="text-violet-400 hover:text-violet-300 font-semibold transition-colors ml-1"
            >
              {{ $t('auth.login.title') }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { supabase } from '@/lib/supabaseClient'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthOAuth from '@/components/auth/AuthOAuth.vue'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
})

const oauthLoading = ref(false)
const oauthProvider = ref(null)

const fullNameError = computed(() => {
  if (!form.value.fullName && authStore.error) return null
  return ''
})

const emailError = computed(() => {
  if (!form.value.email && authStore.error) return null
  return ''
})

const passwordError = computed(() => {
  if (!form.value.password) {
    return authStore.error && authStore.error.toLowerCase().includes('password')
      ? authStore.error
      : ''
  }
  if (form.value.password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères'
  }
  return ''
})

const passwordConfirmError = computed(() => {
  if (!form.value.passwordConfirm) {
    return ''
  }
  if (form.value.password && form.value.password !== form.value.passwordConfirm) {
    return 'Les mots de passe ne correspondent pas'
  }
  return ''
})

/**
 * Gère l'inscription
 */
const handleSignUp = async () => {
  authStore.error = null

  // Vérification de la correspondance des mots de passe
  if (form.value.password !== form.value.passwordConfirm) {
    return
  }

  const result = await authStore.signUp(form.value.email, form.value.password, {
    fullName: form.value.fullName,
    phone: form.value.phone || null
  })

  if (result.success) {
    if (result.requiresConfirmation) {
      toastStore.success(t('auth.signup.ctaLoading'))
      form.value = {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: ''
      }
      // Optionnel : rediriger vers une page de confirmation
      // router.push('/confirm-email')
    } else {
      // Vérifier si utilisateur a des biens pour décider onboarding vs dashboard
      try {
        const { count, error } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', authStore.user.id)
        
        if (error) {
          console.warn('Erreur vérification biens (non bloquant):', error)
          router.push('/dashboard')
          return
        }
        
        // Si 0 bien → Onboarding, sinon → Dashboard
        const redirectTo = count === 0 ? '/onboarding' : '/dashboard'
        router.push(redirectTo)
      } catch (err) {
        console.error('Erreur check onboarding:', err)
        router.push('/dashboard') // Fallback
      }
    }
  }
}

/**
 * Gère la connexion OAuth
 */
const handleOAuth = async provider => {
  oauthLoading.value = true
  oauthProvider.value = provider

  try {
    const redirectTo = route.query.redirect || '/dashboard'
    if (provider === 'google') {
      await authStore.loginWithGoogle(redirectTo)
    } else if (provider === 'apple') {
      await authStore.loginWithApple(redirectTo)
    }
  } catch (error) {
    console.error(`Erreur connexion ${provider}:`, error)
    oauthLoading.value = false
    oauthProvider.value = null
  }
}
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
