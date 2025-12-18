<template>
  <AuthLayout>
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-center text-white">
        {{ $t('auth.login.title') }}
      </h2>
      <p class="text-center text-zinc-400 text-sm mb-6">{{ $t('auth.login.subtitle') }}</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <AuthInput
          :label="$t('auth.login.email')"
          type="email"
          v-model="form.email"
          :placeholder="$t('auth.login.emailPlaceholder')"
          :error="emailError"
          required
          autocomplete="email"
        />

        <!-- Mot de passe -->
        <AuthInput
          :label="$t('auth.login.password')"
          type="password"
          v-model="form.password"
          :placeholder="$t('auth.login.passwordPlaceholder')"
          :error="passwordError"
          required
          autocomplete="current-password"
        />

        <!-- Lien mot de passe oublié -->
        <div class="flex items-center justify-end">
          <router-link
            to="/reset-password"
            class="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            {{ $t('auth.login.forgotPassword') }}
          </router-link>
        </div>

        <!-- Message de succès réinitialisation -->
        <transition name="slide-fade">
          <div
            v-if="route.query.passwordReset === 'true'"
            class="p-4 bg-emerald-500/10 border-l-4 border-emerald-500/50 rounded-lg shadow-sm mb-4"
          >
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p class="text-sm text-emerald-400 flex-1">
                {{ $t('auth.reset.updateSuccess') }} Vous pouvez maintenant vous connecter.
              </p>
            </div>
          </div>
        </transition>

        <!-- Message d'erreur global -->
        <transition name="slide-fade">
          <div
            v-if="authStore.error && !emailError && !passwordError"
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

        <!-- Bouton de connexion -->
        <AuthButton
          :label="$t('auth.login.cta')"
          :loading="authStore.loading"
          type="submit"
          :disabled="isSubmitDisabled"
        />

        <!-- Lien d'inscription -->
        <div class="mt-6 pt-6 border-t border-white/10 text-center">
          <p class="text-sm text-zinc-500">
            {{ $t('auth.login.noAccount') }}
            <router-link
              to="/signup"
              class="text-violet-400 hover:text-violet-300 font-semibold transition-colors ml-1"
            >
              {{ $t('auth.signup.title') }}
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted, onErrorCaptured, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

// Capture les erreurs de rendu pour éviter l'écran blanc
onErrorCaptured((err, instance, info) => {
  // Log sécurisé : on ne log que le message d'erreur et les infos non sensibles
  console.error('🔴 Erreur dans LoginPage:', sanitizeObject(err, ['message', 'stack']))
  console.error('📍 Info:', info)
  console.error('🎭 Instance:', instance?.$options?.name)
  // Stack peut contenir des infos sensibles, on le sanitize
  if (err?.stack) {
    console.error('📚 Stack:', err.stack.substring(0, 200) + '...') // Limite la longueur
  }
  // Ne propage pas l'erreur pour éviter l'écran blanc complet
  return false
})

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  email: '',
  password: ''
})

const emailError = computed(() => {
  if (!form.value.email) {
    // Affiche l'erreur seulement si elle concerne l'email
    if (
      authStore.error &&
      (authStore.error.toLowerCase().includes('email') ||
        authStore.error.toLowerCase().includes('utilisateur') ||
        authStore.error.toLowerCase().includes('user'))
    ) {
      return authStore.error
    }
  }
  // Validation basique du format email
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    return 'Veuillez entrer une adresse email valide'
  }
  return ''
})

const passwordError = computed(() => {
  if (!form.value.password) {
    // Affiche l'erreur seulement si elle concerne le mot de passe
    if (
      authStore.error &&
      (authStore.error.toLowerCase().includes('password') ||
        authStore.error.toLowerCase().includes('mot de passe'))
    ) {
      return authStore.error
    }
  }
  return ''
})

const isSubmitDisabled = computed(() => {
  const hasEmailError = Boolean(emailError.value)
  const hasPasswordError = Boolean(passwordError.value)
  return (
    !form.value.email ||
    !form.value.password ||
    authStore.loading ||
    hasEmailError ||
    hasPasswordError
  )
})

// Nettoie le query param passwordReset après affichage
watch(
  () => route.query.passwordReset,
  value => {
    if (value === 'true') {
      // Nettoie l'URL après un court délai
      setTimeout(() => {
        router.replace({ query: {} })
      }, 5000) // 5 secondes pour laisser voir le message
    }
  }
)

/**
 * Gère la connexion
 */
const handleLogin = async () => {
  authStore.error = null
  const result = await authStore.login(form.value.email, form.value.password)

  if (result.success) {
    const redirectTo = route.query.redirect || '/dashboard'
    router.push(redirectTo)
  }
}

/**
 * Gère la connexion OAuth
 */

/**
 * Vérifie si l'utilisateur est déjà connecté
 * Gère aussi le callback OAuth depuis l'URL
 */
onMounted(async () => {
  if (import.meta.env.DEV) {
    console.debug('🔵 LoginPage onMounted')
  }

  try {
    authStore.error = null

    // Attendre que loadingSession soit terminé avant de faire quoi que ce soit
    let attempts = 0
    while (authStore.loadingSession && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    // Vérifie s'il y a un token OAuth dans l'URL (callback)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const error = hashParams.get('error')

    if (error) {
      if (import.meta.env.DEV) {
        // Ne pas logger le token OAuth en clair
        console.debug('🔵 LoginPage - Erreur OAuth détectée')
      }
      toastStore.error(`Erreur d'authentification : ${error}`)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (accessToken) {
      if (import.meta.env.DEV) {
        // Ne pas logger le token OAuth en clair (données sensibles)
        console.debug('🔵 LoginPage - Token OAuth détecté (masqué pour sécurité)')
      }
      setTimeout(async () => {
        try {
          const user = await authStore.fetchUser(true)
          if (user) {
            const redirectTo = route.query.redirect || '/dashboard'
            router.push(redirectTo)
            toastStore.success(t('login.oauthSuccess'))
          }
        } catch (err) {
          console.error('🔴 Erreur lors du callback OAuth:', sanitizeObject(err, ['message']))
        }
      }, 500)
    }

    // Si l'utilisateur est déjà connecté, redirige vers le dashboard
    if (authStore.user) {
      if (import.meta.env.DEV) {
        console.debug('🔵 LoginPage - Utilisateur connecté, redirection')
      }
      router.push('/dashboard')
    } else {
      try {
        const user = await authStore.fetchUser(true)
        if (user) {
          if (import.meta.env.DEV) {
            console.debug('🔵 LoginPage - Session trouvée, redirection')
          }
          router.push('/dashboard')
        }
      } catch (err) {
        // Erreur silencieuse - l'utilisateur peut simplement se connecter
        console.warn(
          '⚠️ LoginPage - Impossible de récupérer la session:',
          sanitizeObject(err, ['message'])
        )
      }
    }
  } catch (err) {
    console.error(
      '🔴 ERREUR CRITIQUE dans onMounted de LoginPage:',
      sanitizeObject(err, ['message'])
    )
    // Stack peut contenir des infos sensibles, on le limite
    if (err?.stack) {
      console.error('Stack:', err.stack.substring(0, 200) + '...')
    }
    // Ne pas bloquer le rendu en cas d'erreur
  }
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
