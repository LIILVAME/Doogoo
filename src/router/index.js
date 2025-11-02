import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Pages publiques (chargées immédiatement pour éviter le flash de chargement)
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import ResetPasswordPage from '../pages/ResetPasswordPage.vue'
import ConfirmEmailPage from '../pages/ConfirmEmailPage.vue'

// Pages authentifiées (lazy loaded pour améliorer les performances)
const DashboardPage = () => import('../pages/DashboardPage.vue')
const BiensPage = () => import('../pages/BiensPage.vue')
const PaiementsPage = () => import('../pages/PaiementsPage.vue')
const LocatairesPage = () => import('../pages/LocatairesPage.vue')
const ParametresPage = () => import('../pages/ParametresPage.vue')
const StatsPage = () => import('../pages/StatsPage.vue')
const ReportsPage = () => import('../pages/ReportsPage.vue')
const AlertsPage = () => import('../pages/AlertsPage.vue')

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: {
      requiresAuth: false,
      seo: {
        title: 'Doogoo — Gestion Immobilière Simplifiée et Intelligente',
        description:
          'Plateforme de gestion et de suivi intelligent de biens immobiliers avec monitoring en temps réel. Gérez vos propriétés, locataires et paiements en un seul endroit.',
        ogTitle: 'Doogoo — Gestion Immobilière Simplifiée et Intelligente',
        ogDescription:
          'Plateforme de gestion et de suivi intelligent de biens immobiliers avec monitoring en temps réel.'
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      requiresAuth: false,
      seo: {
        title: 'Connexion — Doogoo',
        description:
          'Connectez-vous à votre compte Doogoo pour gérer vos biens immobiliers, locataires et paiements.',
        ogTitle: 'Connexion — Doogoo',
        ogDescription:
          'Connectez-vous à votre compte Doogoo pour accéder à votre dashboard de gestion immobilière.'
      }
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage,
    meta: {
      requiresAuth: false,
      seo: {
        title: 'Créer un compte — Doogoo',
        description:
          'Rejoignez Doogoo et commencez à gérer vos biens immobiliers en quelques secondes.',
        ogTitle: 'Créer un compte — Doogoo',
        ogDescription:
          'Rejoignez Doogoo et commencez à gérer vos biens immobiliers en quelques secondes.'
      }
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: {
      requiresAuth: false,
      seo: {
        title: 'Réinitialiser le mot de passe — Doogoo',
        description: 'Réinitialisez votre mot de passe Doogoo pour accéder à votre compte.',
        ogTitle: 'Réinitialiser le mot de passe — Doogoo',
        ogDescription: 'Réinitialisez votre mot de passe Doogoo.'
      }
    }
  },
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
    component: ConfirmEmailPage,
    meta: {
      requiresAuth: false,
      seo: {
        title: 'Confirmation email — Doogoo',
        description: 'Confirmez votre adresse email pour activer votre compte Doogoo.',
        ogTitle: 'Confirmation email — Doogoo',
        ogDescription: 'Confirmez votre adresse email pour activer votre compte.'
      }
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Tableau de bord — Suivez vos revenus et biens en temps réel | Doogoo',
        description:
          "Vue d'ensemble de vos biens immobiliers, revenus mensuels, propriétés occupées et paiements en attente. Suivez vos performances en temps réel.",
        ogTitle: 'Tableau de bord — Doogoo',
        ogDescription: "Vue d'ensemble de vos biens immobiliers et revenus en temps réel."
      }
    }
  },
  {
    path: '/biens',
    name: 'Biens',
    component: BiensPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Vos biens immobiliers — Suivi, locataires et performances | Doogoo',
        description:
          "Gérez tous vos biens immobiliers en un seul endroit. Ajoutez, modifiez et suivez l'état de vos propriétés, locataires et loyers.",
        ogTitle: 'Vos biens immobiliers — Doogoo',
        ogDescription: 'Gérez tous vos biens immobiliers en un seul endroit.'
      }
    }
  },
  {
    path: '/paiements',
    name: 'Paiements',
    component: PaiementsPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Paiements — Suivi des loyers et transactions | Doogoo',
        description:
          'Gérez tous vos paiements locatifs. Suivez les paiements en attente, en retard et payés ce mois.',
        ogTitle: 'Paiements — Doogoo',
        ogDescription: 'Gérez tous vos paiements locatifs en un seul endroit.'
      }
    }
  },
  {
    path: '/locataires',
    name: 'Locataires',
    component: LocatairesPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Locataires — Gestion de vos locataires | Doogoo',
        description:
          'Gérez vos locataires, leurs informations et leur statut de paiement. Suivez les locataires à jour et en retard.',
        ogTitle: 'Locataires — Doogoo',
        ogDescription: 'Gérez tous vos locataires en un seul endroit.'
      }
    }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: StatsPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Statistiques — Visualisez la rentabilité de votre portefeuille | Doogoo',
        description:
          "Analysez les performances de votre portefeuille immobilier avec des graphiques et statistiques détaillés. Revenus, taux d'occupation, revenus par bien.",
        ogTitle: 'Statistiques — Doogoo',
        ogDescription:
          'Visualisez la rentabilité de votre portefeuille immobilier avec des graphiques détaillés.'
      }
    }
  },
  {
    path: '/rapports',
    name: 'Rapports',
    component: ReportsPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Rapports — Rapports détaillés de votre activité | Doogoo',
        description:
          'Générez et exportez des rapports mensuels détaillés sur vos revenus, biens et paiements. Analysez vos performances sur différentes périodes.',
        ogTitle: 'Rapports — Doogoo',
        ogDescription: 'Générez et exportez des rapports détaillés sur votre activité immobilière.'
      }
    }
  },
  {
    path: '/alertes',
    name: 'Alertes',
    component: AlertsPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Alertes — Notifications et rappels importants | Doogoo',
        description:
          'Restez informé avec les alertes en temps réel : paiements en retard, contrats à renouveler, maintenance à prévoir.',
        ogTitle: 'Alertes — Doogoo',
        ogDescription: 'Restez informé avec les alertes en temps réel sur votre portefeuille.'
      }
    }
  },
  {
    path: '/parametres',
    name: 'Parametres',
    component: ParametresPage,
    meta: {
      requiresAuth: true,
      seo: {
        title: 'Paramètres — Configuration de votre compte | Doogoo',
        description:
          'Configurez votre profil, préférences de langue et devise, notifications et sécurité de votre compte Doogoo.',
        ogTitle: 'Paramètres — Doogoo',
        ogDescription: 'Configurez votre compte et vos préférences Doogoo.'
      }
    }
  },
  {
    path: '/diagnostics',
    name: 'Diagnostics',
    component: () =>
      import(
        /* webpackChunkName: "diagnostics" */
        '@/pages/DiagnosticPage.vue'
      ),
    meta: { requiresAuth: true }
  },
  {
    path: '/test-supabase',
    name: 'TestSupabase',
    component: () => import('@/components/dev/TestSupabase.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde pour éviter les imports répétés
let analyticsImported = false
let trackPageViewFn = null

// Initialise le SEO après la création du router
router.afterEach(async to => {
  // Le composable useSEO sera appelé dans App.vue après le montage
  // pour mettre à jour les meta tags dynamiquement

  // Track page view pour analytics (import une seule fois)
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      if (!analyticsImported) {
        const analytics = await import('@/utils/analytics')
        trackPageViewFn = analytics.trackPageView
        analyticsImported = true
      }
      if (trackPageViewFn) {
        trackPageViewFn(to.path, to.meta?.seo?.title || document.title)
      }
    } catch (error) {
      // Analytics non disponible, on continue sans
      console.warn('Analytics non disponible pour tracking:', error)
      analyticsImported = true // Marque comme importé pour éviter de réessayer
    }
  }
})

/**
 * Navigation guard : vérifie l'authentification avant d'accéder aux routes protégées
 * Note: L'initialisation de la session est gérée dans App.vue
 */
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()

    // Attend que l'initialisation de la session soit terminée
    // Cela évite les problèmes de race condition lors du refresh
    if (authStore.loadingSession) {
      // Attend que loadingSession passe à false (max 5 secondes)
      let attempts = 0
      while (authStore.loadingSession && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }

      // Timeout de sécurité : si loadingSession reste true, on continue quand même
      if (authStore.loadingSession) {
        console.warn('Timeout: loadingSession reste true, continuation de la navigation')
        authStore.loadingSession = false
      }
    }

    // Si la route nécessite une authentification
    if (to.meta.requiresAuth) {
      // Si pas d'utilisateur après initialisation, redirige vers login
      if (!authStore.user) {
        next({
          path: '/login',
          query: { redirect: to.fullPath } // Sauvegarde l'URL de destination
        })
        return
      }
    }

    // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth, redirige vers le dashboard
    // Exception : /reset-password si c'est une session temporaire de réinitialisation (détectée via hash)
    if (to.path === '/reset-password' && authStore.user) {
      // Vérifie si c'est une session de réinitialisation (hash avec type=recovery)
      const hash = window.location.hash
      const isPasswordRecovery = hash && hash.includes('type=recovery')

      // Si ce n'est pas une réinitialisation, redirige vers dashboard
      if (!isPasswordRecovery) {
        next('/dashboard')
        return
      }
      // Sinon, laisse passer (la page ResetPasswordPage gérera le formulaire)
    } else if ((to.path === '/login' || to.path === '/signup') && authStore.user) {
      next('/dashboard')
      return
    }

    next()
  } catch (error) {
    console.error('Erreur dans le router guard:', error)
    // En cas d'erreur, redirige vers login si route protégée
    if (to.meta.requiresAuth) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
})

export default router
