import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { i18nPlugin } from './composables/useLingui'
import { useSettingsStore } from '@/stores/settingsStore'
import persistedState from '@/plugins/piniaPersistedState'
import { initGoogleAnalytics, initPlausible } from '@/utils/analytics'
import './style.css'
import './assets/accessibility.css' // Accessibilité WCAG 2.1 AA

const app = createApp(App)
const pinia = createPinia()

// Ajoute le plugin de persistance Pinia
pinia.use(persistedState)

app.use(pinia)
app.use(router)
app.use(i18nPlugin)

// Initialise Sentry si DSN configuré (optionnel)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  import('@sentry/vue')
    .then(Sentry => {
      Sentry.init({
        app,
        dsn: sentryDsn,
        integrations: [
          new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router)
          })
        ],
        tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
        environment: import.meta.env.MODE,
        beforeSend(event) {
          // Ne pas envoyer les erreurs non critiques en production
          if (import.meta.env.MODE === 'production' && !event.level) {
            return null
          }
          return event
        }
      })

      // Expose Sentry globalement pour l'utiliser dans apiErrorHandler
      window.Sentry = Sentry
    })
    .catch(() => {
      // Sentry non disponible, on continue sans
      console.warn('Sentry initialization failed')
    })
}

// Gestion d'erreur globale pour éviter l'écran blanc
app.config.errorHandler = (err, instance, info) => {
  // Ignorer les erreurs provenant d'extensions de navigateur (comme Google Translate)
  const errMessage = err?.message || err?.toString() || ''
  const errStack = err?.stack || ''

  // Détecter les erreurs causées par des extensions de navigateur
  const isExtensionError =
    errMessage.includes('Invalid linked format') ||
    errMessage.includes('RestoreOriginal') ||
    errMessage.includes('Can not RestoreOriginal') ||
    errStack.includes('content.bundle.js') ||
    errStack.includes('extension') ||
    errStack.includes('chrome-extension://') ||
    errStack.includes('moz-extension://') ||
    (err instanceof SyntaxError && errMessage.includes('linked'))

  if (isExtensionError) {
    // Ne pas logger ces erreurs non critiques causées par les extensions
    // (Google Translate, AdBlock, etc.)
    return // Ignorer silencieusement cette erreur
  }

  console.error('🚨 Erreur Vue globale:', err)
  console.error('📍 Info:', info)
  console.error('🎭 Instance:', instance?.$options?.name || 'Unknown')
  console.error('📚 Stack:', errStack)

  // Affiche un message visible dans le DOM pour debug
  if (typeof document !== 'undefined') {
    const errorDiv = document.createElement('div')
    errorDiv.style.cssText =
      'position:fixed;top:0;left:0;right:0;background:#ef4444;color:white;padding:16px;z-index:99999;font-family:monospace;'
    errorDiv.innerHTML = `
      <strong>Erreur Vue détectée:</strong><br>
      ${errMessage}<br>
      <small>Voir console pour détails</small>
      <button onclick="this.parentElement.remove()" style="float:right;background:white;color:#ef4444;border:none;padding:4px 8px;cursor:pointer;border-radius:4px;">×</button>
    `
    document.body.appendChild(errorDiv)
  }

  // Capture l'erreur dans Sentry si disponible (seulement si non ignorée)
  if (window.Sentry) {
    window.Sentry.captureException(err, {
      contexts: {
        vue: {
          componentName: instance?.$options?.name || 'Unknown',
          propsData: instance?.$props,
          lifecycleHook: info
        }
      }
    })
  }

  // Enregistre dans le diagnosticStore (asynchrone mais ne bloque pas)
  import('@/stores/diagnosticStore')
    .then(({ useDiagnosticStore }) => {
      try {
        const diagnosticStore = useDiagnosticStore()
        diagnosticStore.recordError(err, { context: 'vue-global-error', info })
      } catch {
        // DiagnosticStore non disponible, on continue
      }
    })
    .catch(() => {
      // Import échoué, on continue
    })

  // Ne pas bloquer le rendu
}

app.mount('#app')

// Enregistrement du Service Worker pour PWA (vite-plugin-pwa autoUpdate)
// Avec registerType: 'autoUpdate', le plugin injecte automatiquement le code,
// mais on l'importe explicitement ici pour plus de contrôle
if (import.meta.env.PROD) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          // Une nouvelle version est disponible
          console.log('🔄 Nouvelle version disponible')
        },
        onOfflineReady() {
          // L'application est prête à fonctionner hors ligne
          console.log('✅ Application prête hors ligne')
        },
        onRegistered(registration) {
          console.log('✅ Service Worker enregistré:', registration)
        },
        onRegisterError(error) {
          console.error('❌ Erreur enregistrement Service Worker:', error)
        }
      })
    })
    .catch(() => {
      // PWA non disponible en développement ou erreur
      if (import.meta.env.MODE === 'production') {
        console.warn('⚠️  PWA registration non disponible')
      }
    })
}

// Initialise la langue et le thème depuis le store settings après le montage de Pinia
// Utilise nextTick pour s'assurer que Pinia est complètement initialisé
nextTick(() => {
  try {
    const settingsStore = useSettingsStore()

    // Initialise la langue
    if (i18n.locale.value !== settingsStore.language) {
      i18n.locale.value = settingsStore.language
    }

    // Initialise le thème (le store le fait déjà dans loadSettings, mais on s'assure ici)
    settingsStore.applyTheme(settingsStore.theme)
  } catch (error) {
    console.warn('Impossible de charger settingsStore (non bloquant):', error)
  }

  // Initialise les analytics (après le chargement initial de l'app)
  try {
    // Initialise Google Analytics 4 si configuré
    if (import.meta.env.VITE_GA4_MEASUREMENT_ID) {
      initGoogleAnalytics()
    }

    // Initialise Plausible Analytics si configuré
    if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
      initPlausible()
    }
  } catch (error) {
    console.warn("Impossible d'initialiser les analytics (non bloquant):", error)
  }
})
