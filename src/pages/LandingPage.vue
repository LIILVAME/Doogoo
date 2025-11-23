<template>
  <div class="bg-zinc-950 text-zinc-50 min-h-screen antialiased">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <router-link to="/" class="text-lg font-semibold tracking-tighter text-white">doogoo</router-link>
        </div>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button type="button" class="hover:text-white transition-colors" @click="scrollToSection('features')">
            Fonctionnalités
          </button>
          <button type="button" class="hover:text-white transition-colors" @click="scrollToSection('pricing')">
            Tarifs
          </button>
          <button type="button" class="hover:text-white transition-colors" @click="scrollToSection('resources')">
            Ressources
          </button>
        </div>

        <div class="flex items-center gap-4">
          <button
            type="button"
            class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
            @click="goToLogin"
          >
            Se connecter
          </button>
          <button
            type="button"
            class="text-sm font-medium bg-zinc-50 text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
            @click="goToApp"
          >
            Essayer gratuitement
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <main class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] glow-bg pointer-events-none z-0"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300 mb-8"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Nouvelle fonctionnalité : Export comptable simplifié
        </div>

        <h1 class="text-5xl md:text-7xl font-semibold tracking-tight mb-6 gradient-text leading-[1.1]">
          L'immobilier géré<br />
          simplement par vous.
        </h1>

        <p class="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Doogoo offre aux propriétaires indépendants le pouvoir de piloter leurs biens, locataires et finances depuis une
          interface unique et élégante.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            type="button"
            class="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            @click="goToApp"
          >
            Commencer maintenant
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </button>
          <button
            type="button"
            class="h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all w-full sm:w-auto"
            @click="openDemo"
          >
            Voir la démo
          </button>
        </div>

        <div id="demo" class="relative mx-auto max-w-5xl w-full perspective-1000">
          <div class="glass-panel rounded-xl border border-white/10 p-2 shadow-2xl shadow-violet-900/20">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-900/50 rounded-t-lg">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              </div>
              <div class="mx-auto text-xs text-zinc-500 font-mono">doogoo.app/dashboard</div>
            </div>
            <div class="flex h-[400px] md:h-[500px] bg-zinc-950 text-left overflow-hidden rounded-b-lg">
              <div class="w-16 md:w-64 border-r border-white/5 bg-zinc-900/30 p-4 flex flex-col gap-6 hidden md:flex">
                <div class="space-y-1">
                  <div class="h-8 flex items-center gap-3 px-2 text-zinc-100 bg-white/5 rounded-md text-sm font-medium">
                    <span class="w-4 h-4 inline-flex items-center justify-center text-violet-400">▤</span>
                    Vue d'ensemble
                  </div>
                  <div class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors">
                    <span class="w-4 h-4 inline-flex items-center justify-center">🏢</span>
                    Mes Biens
                  </div>
                  <div class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors">
                    <span class="w-4 h-4 inline-flex items-center justify-center">👥</span>
                    Locataires
                  </div>
                  <div class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors">
                    <span class="w-4 h-4 inline-flex items-center justify-center">💳</span>
                    Paiements
                  </div>
                </div>
                <div class="mt-auto space-y-4">
                  <div class="p-3 rounded-lg border border-white/5 bg-zinc-900/50">
                    <p class="text-xs text-zinc-500 mb-1">Taux d'occupation</p>
                    <p class="text-sm font-medium text-white">92%</p>
                    <div class="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                      <div class="bg-violet-500 h-full w-[92%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-1 p-6 md:p-8 overflow-hidden relative">
                <div class="flex justify-between items-end mb-8">
                  <div>
                    <p class="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-medium">Revenus (Octobre)</p>
                    <h2 class="text-3xl font-semibold text-white tracking-tight">12 450,00 €</h2>
                  </div>
                  <button class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                    ⬇️ Exporter
                  </button>
                </div>
                <div class="grid grid-cols-12 gap-2 h-32 items-end mb-8 opacity-90">
                  <div v-for="(height, index) in chartHeights" :key="index" :class="['col-span-1 rounded-sm transition-colors',
                    index === 8 ? 'bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-zinc-800 hover:bg-violet-500/50',
                    index >= 9 ? 'opacity-50' : ''
                  ]" :style="{ height }"></div>
                </div>
                <div class="space-y-3">
                  <p class="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">Derniers mouvements</p>
                  <div class="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors group">
                    <div class="flex items-center gap-4">
                      <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        ↙
                      </div>
                      <div>
                        <p class="text-sm text-zinc-200 font-medium">Loyer - Apt 4B</p>
                        <p class="text-xs text-zinc-500">Thomas Dupont</p>
                      </div>
                    </div>
                    <span class="text-sm text-zinc-200 font-medium">+ 850,00 €</span>
                  </div>
                  <div class="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors group">
                    <div class="flex items-center gap-4">
                      <div class="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                        ⏱
                      </div>
                      <div>
                        <p class="text-sm text-zinc-200 font-medium">Retard - Studio 12</p>
                        <p class="text-xs text-zinc-500">Sarah Martin • 3 jours</p>
                      </div>
                    </div>
                    <span class="text-sm text-zinc-400 group-hover:text-rose-400 transition-colors font-medium">En attente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features -->
    <section id="features" class="py-24 border-t border-white/5 bg-zinc-950">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-white">Tout vos biens, au même endroit.</h2>
          <p class="text-zinc-400 font-light">
            Une suite d'outils conçue pour remplacer les feuilles de calcul complexes et les logiciels obsolètes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="feature in primaryFeatures"
            :key="feature.title"
            :class="['glass-panel rounded-2xl p-8 relative overflow-hidden group', feature.span2 ? 'md:col-span-2' : '']"
          >
            <div class="relative z-10 space-y-3">
              <div
                class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 mb-2"
                :class="feature.iconColor"
              >
                <span class="text-xl">{{ feature.icon }}</span>
              </div>
              <h3 class="text-xl font-medium text-white">{{ feature.title }}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed" v-html="feature.description"></p>
              <div v-if="feature.tags?.length" class="flex gap-3 mt-4">
                <span
                  v-for="tag in feature.tags"
                  :key="tag"
                  class="text-xs border border-white/10 px-2 py-1 rounded text-zinc-400 bg-white/5"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div v-if="feature.visual" class="absolute right-0 bottom-0 w-1/2 h-3/4 opacity-30 group-hover:opacity-50 transition-opacity">
              <div class="w-full h-full border-t border-l border-white/10 bg-zinc-900/50 rounded-tl-xl p-4">
                <div class="space-y-2">
                  <div class="h-2 w-1/2 bg-zinc-700 rounded-full"></div>
                  <div class="h-2 w-3/4 bg-zinc-800 rounded-full"></div>
                  <div class="h-20 w-full bg-zinc-800/50 rounded mt-4 border border-white/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing / CTA anchor -->
    <section id="pricing" class="py-16 border-t border-white/5 bg-zinc-900/30">
      <div class="max-w-5xl mx-auto px-6 grid gap-6 md:grid-cols-3 items-center">
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-3xl font-semibold text-white">Tarifs simples et transparents</h3>
          <p class="text-zinc-400">
            Commencez gratuitement et payez uniquement lorsque vous gérez vos loyers au quotidien. Export comptable inclus.
          </p>
          <div class="flex flex-wrap gap-3 text-sm text-zinc-300">
            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10">Essai gratuit 14 jours</span>
            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10">Sans engagement</span>
            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10">Support prioritaire</span>
          </div>
        </div>
        <div class="glass-panel rounded-2xl p-6 border border-white/10">
          <p class="text-sm text-zinc-400 mb-2">Plan Pro</p>
          <p class="text-3xl font-semibold text-white mb-4">19 € <span class="text-base text-zinc-400">/mois</span></p>
          <ul class="space-y-2 text-sm text-zinc-300 mb-6">
            <li class="flex items-center gap-2">✔ Gestion multi-biens</li>
            <li class="flex items-center gap-2">✔ Alertes retards & rappels</li>
            <li class="flex items-center gap-2">✔ Exports CSV / PDF / XLS</li>
          </ul>
          <button
            type="button"
            class="w-full h-11 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            @click="goToApp"
          >
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>

    <!-- Resources / Social proof -->
    <section id="resources" class="py-20 border-t border-white/5 bg-zinc-950">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid gap-8 md:grid-cols-2">
          <div class="space-y-4">
            <p class="text-sm uppercase tracking-widest text-violet-300">Ressources</p>
            <h3 class="text-3xl font-semibold text-white">Guides, mises à jour et centre d'aide.</h3>
            <p class="text-zinc-400">
              Retrouvez toutes nos ressources pour gérer vos biens sereinement : guides bailleurs, mises à jour produits et support
              dédié.
            </p>
            <div class="flex gap-3 flex-wrap">
              <a
                class="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
                href="#pricing"
                @click.prevent="scrollToSection('pricing')"
              >
                Voir les tarifs
              </a>
              <button
                type="button"
                class="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
                @click="contactSupport"
              >
                Contacter le support
              </button>
            </div>
          </div>
          <div class="grid gap-4">
            <div v-for="resource in resources" :key="resource.title" class="glass-panel border border-white/10 rounded-xl p-5">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-violet-300 text-lg">
                  {{ resource.icon }}
                </div>
                <div>
                  <p class="text-white font-medium">{{ resource.title }}</p>
                  <p class="text-sm text-zinc-400">{{ resource.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="py-32 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]"></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
          Prêt à optimiser vos rendements ?
        </h2>
        <p class="text-zinc-400 text-lg mb-10 font-light">
          Rejoignez les propriétaires qui ont choisi la simplicité avec Doogoo.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            type="button"
            class="h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto"
            @click="goToApp"
          >
            Créer un compte gratuit
          </button>
          <button
            type="button"
            class="h-12 px-8 text-zinc-400 hover:text-white font-medium transition-colors w-full sm:w-auto"
            @click="contactSupport"
          >
            Contacter le support
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/5 bg-zinc-950 pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <span class="text-lg font-semibold tracking-tighter text-white">doogoo</span>
            <p class="text-zinc-500 text-sm mt-4 font-light">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('features')">Fonctionnalités</button></li>
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('pricing')">Tarifs</button></li>
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('resources')">Mises à jour</button></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('resources')">Blog</button></li>
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('resources')">Guide du bailleur</button></li>
              <li><button type="button" class="hover:text-white transition-colors" @click="scrollToSection('resources')">Centre d'aide</button></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><router-link to="/cgu" class="hover:text-white transition-colors">CGU</router-link></li>
              <li><router-link to="/privacy" class="hover:text-white transition-colors">Confidentialité</router-link></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
          <div class="flex gap-4 text-zinc-600">
            <a
              class="hover:text-white transition-colors"
              href="https://twitter.com/doogooapp"
              target="_blank"
              rel="noreferrer"
            >
              <span class="sr-only">Twitter</span>𝕏
            </a>
            <a
              class="hover:text-white transition-colors"
              href="https://www.linkedin.com/company/doogoo"
              target="_blank"
              rel="noreferrer"
            >
              <span class="sr-only">LinkedIn</span>in
            </a>
            <a
              class="hover:text-white transition-colors"
              href="https://github.com/doogoo-app"
              target="_blank"
              rel="noreferrer"
            >
              <span class="sr-only">GitHub</span>GH
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => Boolean(authStore.user))

const chartHeights = [
  '40%',
  '60%',
  '45%',
  '70%',
  '55%',
  '80%',
  '65%',
  '90%',
  '100%',
  '20%',
  '20%',
  '20%'
]

const primaryFeatures = [
  {
    title: 'Gestion Multi-biens',
    description:
      "Appartements, maisons, parkings ou locaux commerciaux. Ajoutez et configurez vos propriétés en quelques clics avec des profils détaillés.",
    icon: '🏠',
    iconColor: 'text-violet-400',
    span2: true,
    visual: true
  },
  {
    title: 'Suivi Locataires',
    description: 'Centralisez les baux, les contacts et l\'historique de chaque locataire.',
    icon: '👥',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'Alertes Retards',
    description: 'Soyez notifié immédiatement en cas de retard de paiement. Relancez en un clic.',
    icon: '⚠️',
    iconColor: 'text-rose-400'
  },
  {
    title: 'Vue Métrique & Export',
    description:
      'Analysez votre rentabilité en temps réel. Besoin de transmettre à votre comptable ? Exportez toutes les données en CSV, PDF ou XLS instantanément.',
    icon: '📊',
    iconColor: 'text-blue-400',
    span2: true,
    tags: ['.CSV', '.PDF', '.XLS']
  }
]

const resources = [
  {
    title: 'Blog & mises à jour',
    description: 'Découvrez nos nouveautés produit et bonnes pratiques de gestion locative.',
    icon: '📰'
  },
  {
    title: 'Guide du bailleur',
    description: 'Toutes les étapes clés pour piloter vos biens en autonomie.',
    icon: '📘'
  },
  {
    title: "Centre d'aide & support",
    description: 'Une équipe disponible pour vous accompagner rapidement.',
    icon: '🤝'
  }
]

const goToLogin = () => {
  router.push('/login')
}

const goToSignup = () => {
  router.push('/signup')
}

const goToApp = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    goToSignup()
  }
}

const openDemo = () => {
  scrollToSection('demo')
}

const contactSupport = () => {
  if (typeof window !== 'undefined') {
    window.location.href = 'mailto:support@doogoo.app?subject=Demande%20de%20d%C3%A9mo&body=Bonjour%20Doogoo%2C%20je%20souhaite%20planifier%20une%20d%C3%A9mo.'
  }
}

const scrollToSection = id => {
  if (typeof window === 'undefined') return

  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    router.push({ hash: `#${id}` })
  }
}
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-text {
  background: linear-gradient(to right, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glow-bg {
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
}
</style>
