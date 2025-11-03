<template>
  <!-- Bannière de connexion (offline/online) -->
  <ConnectionBanner />

  <!-- Bannière mode dégradé -->
  <DegradedModeBanner />

  <!-- Loader global pendant l'initialisation de la session -->
  <div
    v-if="authStore.loadingSession"
    class="flex justify-center items-center min-h-screen bg-gray-50"
  >
    <div class="text-center">
      <div
        class="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Chargement de l'application...</p>
      <p class="text-xs text-gray-400 mt-2">Initialisation de la session...</p>
    </div>
  </div>

  <!-- Application normale une fois la session initialisée -->
  <div v-else class="min-h-screen">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </div>
  <Toast />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/authStore'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { usePaymentsStore } from '@/stores/paymentsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useConnectionStore } from '@/stores/connectionStore'
import { useDiagnosticStore } from '@/stores/diagnosticStore'
import { setSettingsStoreCache } from '@/utils/formatters'
import { useSEO } from '@/composables/useSEO'
import { useKeyboardAvoidance } from '@/composables/useKeyboardAvoidance'
import Toast from '@/components/common/Toast.vue'
import ConnectionBanner from '@/components/common/ConnectionBanner.vue'
import DegradedModeBanner from '@/components/common/DegradedModeBanner.vue'

// Initialise le keyboard avoidance pour mobile
useKeyboardAvoidance()

const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()
const settingsStore = useSettingsStore()
const connectionStore = useConnectionStore()
const diagnosticStore = useDiagnosticStore()

// Initialise le SEO
const { initSEO } = useSEO()

// Initialise le cache du store settings pour formatCurrency
// Crée un proxy pour exposer currency et language comme propriétés
const storeForCache = {
  get currency() {
    return settingsStore.currency
  },
  get language() {
    return settingsStore.language
  }
}
setSettingsStoreCache(storeForCache)

/**
 * Gère les tokens de confirmation d'email dans le hash de l'URL
 * Supabase redirige vers l'URL avec les tokens dans le hash (#access_token=...)
 */
const handleAuthHash = async () => {
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

    if (accessToken && refreshToken) {
      // Nettoie l'URL en supprimant le hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search)

      // Échange les tokens avec Supabase pour créer une session
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        console.error("Erreur lors de l'échange des tokens:", error)
        router.push('/login?error=token_exchange_failed')
        return true
      }

      if (data.session) {
        // Met à jour le store auth
        authStore.user = data.user
        authStore.session = data.session

        // Redirige selon le type
        if (type === 'signup') {
          // Inscription : redirige vers la page de confirmation
          router.push('/confirm-email')
        } else if (type === 'recovery') {
          // Réinitialisation de mot de passe : reste sur /reset-password
          // La page ResetPasswordPage.vue gérera l'affichage du formulaire
          if (router.currentRoute.value.path !== '/reset-password') {
            router.push('/reset-password')
          }
        } else {
          // Autres cas : redirige vers login
          router.push('/login?confirmed=true')
        }
        return true
      }
    }

    return false
  } catch (error) {
    console.error('Erreur lors du traitement du hash auth:', error)
    router.push('/login?error=hash_processing_failed')
    return true
  }
}

/**
 * Initialise l'application de manière centralisée
 * - Étape 0 : Gère les tokens de confirmation dans le hash
 * - Étape 1 : Restaure la session Supabase
 * - Étape 2 : Charge les données si utilisateur connecté
 * - Étape 3 : Configure l'écouteur d'événements auth
 */
onMounted(async () => {
  try {
    // Initialise le SEO pour les métadonnées dynamiques
    initSEO()

    // Initialise le watcher de connexion en premier
    connectionStore.initConnectionWatcher()

    // Étape 0 — Gère les tokens de confirmation d'email dans le hash
    const hashHandled = await handleAuthHash()
    if (hashHandled) {
      // Si le hash a été traité, on attend un peu pour laisser la redirection se faire
      // puis on initialise la session normalement
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Étape 1 — Restaurer la session Supabase
    await authStore.initSession()

    // Met à jour la session dans le diagnosticStore
    if (authStore.user) {
      diagnosticStore.setUserSession({ user: authStore.user })
    }

    // Étape 2 — Si session active, charger les données des stores
    if (authStore.user) {
      await Promise.all([propertiesStore.fetchProperties(), paymentsStore.fetchPayments()])

      // Initialise le realtime après avoir chargé les données
      propertiesStore.initRealtime()
      paymentsStore.initRealtime()
    }

    // Étape 3 — Surveiller les changements de session (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      authStore.user = session?.user ?? null
      authStore.session = session

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Connexion ou rafraîchissement de token
        if (session?.user) {
          // Charge le profil après connexion
          try {
            await authStore.fetchProfile()
          } catch (err) {
            console.warn('Impossible de charger le profil après connexion (non bloquant):', err)
          }

          // Charge les données des stores
          await Promise.all([propertiesStore.fetchProperties(), paymentsStore.fetchPayments()])

          // Réactive le realtime
          propertiesStore.initRealtime()
          paymentsStore.initRealtime()
        }
      } else if (event === 'USER_UPDATED') {
        // Mise à jour du profil utilisateur (ex: changement de mot de passe)
        // Le toast est déjà géré dans ChangePasswordModal, donc pas besoin de re-notifier ici
        // On met juste à jour la session si nécessaire
        if (session?.user) {
          authStore.user = session.user
          authStore.session = session

          // Log pour debugging (peut être retiré en production)
          // Log sécurisé (données masquées)
          import('@/utils/sanitizeLogs')
            .then(({ sanitizeUser }) => {
              console.log('✅ USER_UPDATED: Session utilisateur mise à jour', {
                user: sanitizeUser(session.user),
                timestamp: new Date().toISOString()
              })
            })
            .catch(() => {
              // Fallback si sanitizeLogs non disponible
              console.log('✅ USER_UPDATED: Session utilisateur mise à jour')
            })

          // Rafraîchit le profil si nécessaire
          try {
            await authStore.fetchProfile()
          } catch (err) {
            console.warn(
              'Impossible de rafraîchir le profil après mise à jour (non bloquant):',
              err
            )
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Déconnexion : nettoie tous les stores
        try {
          // Arrête le realtime en premier
          propertiesStore.stopRealtime()
          paymentsStore.stopRealtime()

          // Réinitialise tous les stores (déjà fait dans logout(), mais on s'assure ici aussi)
          try {
            const { useTenantsStore } = await import('@/stores/tenantsStore')
            const { useAlertsStore } = await import('@/stores/alertsStore')
            const { useAnalyticsStore } = await import('@/stores/analyticsStore')
            const { useReportsStore } = await import('@/stores/reportsStore')

            const tenantsStore = useTenantsStore()
            const alertsStore = useAlertsStore()
            const analyticsStore = useAnalyticsStore()
            const reportsStore = useReportsStore()

            propertiesStore.$reset()
            paymentsStore.$reset()
            tenantsStore.$reset()
            alertsStore.$reset()
            analyticsStore.$reset()
            reportsStore.$reset()
          } catch (resetError) {
            // Si certains stores n'existent pas, continue quand même
            console.warn(
              'Erreur lors de la réinitialisation des stores (non bloquant):',
              resetError
            )
          }

          // Réinitialise le profil
          authStore.profile = null

          // Redirige vers /login si on n'y est pas déjà
          const currentRoute = router.currentRoute.value
          if (currentRoute.path !== '/login' && currentRoute.path !== '/') {
            router.push('/login')
          }
        } catch (err) {
          console.warn('Erreur lors du nettoyage après SIGNED_OUT (non bloquant):', err)
        }
      }
    })

    // Initialise aussi l'écouteur legacy pour compatibilité
    authStore.initAuthListener()
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application:", error)
    // Ne pas bloquer le rendu même en cas d'erreur
    authStore.loadingSession = false
  }
})
</script>

<style>
/* Transitions fade pour la navigation entre pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
