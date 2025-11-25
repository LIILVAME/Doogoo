<template>
  <div
    class="min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200 font-sans"
  >
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Logo Typographique -->
          <span class="text-lg font-semibold tracking-tighter text-white">doogoo</span>
        </div>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <router-link to="/features" class="hover:text-white transition-colors"
            >Fonctionnalités</router-link
          >
          <router-link to="/pricing" class="hover:text-white transition-colors">Tarifs</router-link>
          <router-link to="/resources" class="hover:text-white transition-colors"
            >Ressources</router-link
          >
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Se connecter
          </router-link>
          <router-link
            to="/signup"
            class="text-sm font-medium bg-zinc-50 text-zinc-950 px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
          >
            Essayer gratuitement
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <!-- Background Glow -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] glow-bg pointer-events-none z-0"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300 mb-8"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Nouvelle fonctionnalité : Export comptable simplifié
        </div>

        <h1
          class="text-5xl md:text-7xl font-semibold tracking-tight mb-6 gradient-text leading-[1.1]"
        >
          L'immobilier géré<br />simplement par vous.
        </h1>

        <p
          class="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Doogoo offre aux propriétaires indépendants le pouvoir de piloter leurs biens, locataires
          et finances depuis une interface unique et élégante.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <router-link
            to="/signup"
            class="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Commencer maintenant <ArrowRight class="w-4 h-4" />
          </router-link>
          <button
            @click="scrollToDemo"
            class="h-12 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all w-full sm:w-auto"
          >
            Voir la démo
          </button>
        </div>

        <!-- Dashboard Mockup Abstract -->
        <div id="dashboard-preview" class="relative mx-auto max-w-5xl w-full perspective-1000">
          <div
            class="glass-panel rounded-xl border border-white/10 p-2 shadow-2xl shadow-violet-900/20"
          >
            <!-- Mockup Browser Header -->
            <div
              class="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-900/50 rounded-t-lg"
            >
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              </div>
              <div class="mx-auto text-xs text-zinc-500 font-mono">doogoo.app/dashboard</div>
            </div>

            <!-- Mockup Body -->
            <div
              class="flex h-[400px] md:h-[500px] bg-zinc-950 text-left overflow-hidden rounded-b-lg"
            >
              <!-- Sidebar -->
              <div
                class="w-16 md:w-64 border-r border-white/5 bg-zinc-900/30 p-4 flex flex-col gap-6 hidden md:flex"
              >
                <div class="space-y-1">
                  <div
                    class="h-8 flex items-center gap-3 px-2 text-zinc-100 bg-white/5 rounded-md text-sm font-medium cursor-pointer"
                  >
                    <LayoutDashboard class="w-4 h-4 text-violet-400" /> Vue d'ensemble
                  </div>
                  <div
                    class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors"
                  >
                    <Building2 class="w-4 h-4" /> Mes Biens
                  </div>
                  <div
                    class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors"
                  >
                    <Users class="w-4 h-4" /> Locataires
                  </div>
                  <div
                    class="h-8 flex items-center gap-3 px-2 text-zinc-500 hover:text-zinc-300 rounded-md text-sm font-medium cursor-pointer transition-colors"
                  >
                    <Wallet class="w-4 h-4" /> Paiements
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

              <!-- Main Content -->
              <div class="flex-1 p-6 md:p-8 overflow-hidden relative">
                <!-- Header Content -->
                <div class="flex justify-between items-end mb-8">
                  <div>
                    <p class="text-zinc-500 text-xs mb-1 uppercase tracking-wider font-medium">
                      Revenus (Octobre)
                    </p>
                    <h2 class="text-3xl font-semibold text-white tracking-tight">
                      12 450 000 FCFA
                    </h2>
                  </div>
                  <button
                    class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors"
                  >
                    <Download class="w-3 h-3" /> Exporter
                  </button>
                </div>

                <!-- Chart Area (Abstract) -->
                <div class="grid grid-cols-12 gap-2 h-32 items-end mb-8 opacity-90">
                  <div
                    class="col-span-1 bg-zinc-800 h-[40%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[60%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[45%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[70%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[55%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[80%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[65%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[90%] rounded-sm hover:bg-violet-500/50 transition-colors"
                  ></div>
                  <div
                    class="col-span-1 bg-violet-500 h-[100%] rounded-sm shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[20%] rounded-sm hover:bg-violet-500/50 transition-colors opacity-50"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[20%] rounded-sm hover:bg-violet-500/50 transition-colors opacity-50"
                  ></div>
                  <div
                    class="col-span-1 bg-zinc-800 h-[20%] rounded-sm hover:bg-violet-500/50 transition-colors opacity-50"
                  ></div>
                </div>

                <!-- Recent Activity Table -->
                <div class="space-y-3">
                  <p class="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">
                    Derniers mouvements
                  </p>

                  <!-- Item 1 -->
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors group"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"
                      >
                        <ArrowDownLeft class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-sm text-zinc-200 font-medium">Loyer - Apt 4B</p>
                        <p class="text-xs text-zinc-500">Thomas Dupont</p>
                      </div>
                    </div>
                    <span class="text-sm text-zinc-200 font-medium">+ 850,000 FCFA</span>
                  </div>

                  <!-- Item 2 -->
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors group"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20"
                      >
                        <Clock class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-sm text-zinc-200 font-medium">Retard - Studio 12</p>
                        <p class="text-xs text-zinc-500">Sarah Martin • 3 jours</p>
                      </div>
                    </div>
                    <span
                      class="text-sm text-zinc-400 group-hover:text-rose-400 transition-colors font-medium"
                      >En attente</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section class="py-24 border-t border-white/5 bg-zinc-950">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-white">
            Tout vos biens, au même endroit.
          </h2>
          <p class="text-zinc-400 font-light">
            Une suite d'outils conçue pour remplacer les feuilles de calcul complexes et les
            logiciels obsolètes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 mb-4 text-violet-400"
              >
                <Home class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-white mb-2">Gestion Multi-biens</h3>
              <p class="text-zinc-400 text-sm max-w-sm leading-relaxed">
                Appartements, maisons, parkings ou locaux commerciaux. Ajoutez et configurez vos
                propriétés en quelques clics avec des profils détaillés.
              </p>
            </div>
            <!-- Visual decorative -->
            <div
              class="absolute right-0 bottom-0 w-1/2 h-3/4 opacity-30 group-hover:opacity-50 transition-opacity"
            >
              <div
                class="w-full h-full border-t border-l border-white/10 bg-zinc-900/50 rounded-tl-xl p-4"
              >
                <div class="space-y-2">
                  <div class="h-2 w-1/2 bg-zinc-700 rounded-full"></div>
                  <div class="h-2 w-3/4 bg-zinc-800 rounded-full"></div>
                  <div class="h-20 w-full bg-zinc-800/50 rounded mt-4 border border-white/5"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 mb-4 text-emerald-400"
              >
                <UsersRound class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-white mb-2">Suivi Locataires</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">
                Centralisez les baux, les contacts et l'historique de chaque locataire.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 mb-4 text-rose-400"
              >
                <AlertCircle class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-white mb-2">Alertes Retards</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">
                Soyez notifié immédiatement en cas de retard de paiement. Relancez en un clic.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div
            class="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
          >
            <div class="flex-1 relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/10 mb-4 text-blue-400"
              >
                <BarChart3 class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-white mb-2">Vue Métrique &amp; Export</h3>
              <p class="text-zinc-400 text-sm leading-relaxed mb-6">
                Analysez votre rentabilité en temps réel. Besoin de transmettre à votre comptable ?
                Exportez toutes les données en CSV ou PDF instantanément.
              </p>
              <div class="flex gap-3">
                <span
                  class="text-xs border border-white/10 px-2 py-1 rounded text-zinc-400 bg-white/5"
                  >.CSV</span
                >
                <span
                  class="text-xs border border-white/10 px-2 py-1 rounded text-zinc-400 bg-white/5"
                  >.PDF</span
                >
                <span
                  class="text-xs border border-white/10 px-2 py-1 rounded text-zinc-400 bg-white/5"
                  >.XLS</span
                >
              </div>
            </div>
            <!-- Visual Graph -->
            <div
              class="w-full md:w-1/2 h-32 flex items-end justify-between gap-2 px-4 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
            >
              <div
                class="w-full bg-blue-500/20 h-[40%] rounded-t border-t border-x border-blue-500/30"
              ></div>
              <div
                class="w-full bg-blue-500/30 h-[60%] rounded-t border-t border-x border-blue-500/40"
              ></div>
              <div
                class="w-full bg-blue-500/50 h-[50%] rounded-t border-t border-x border-blue-500/60"
              ></div>
              <div
                class="w-full bg-blue-500/80 h-[90%] rounded-t border-t border-x border-blue-500"
              ></div>
              <div
                class="w-full bg-blue-500/40 h-[70%] rounded-t border-t border-x border-blue-500/50"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 relative overflow-hidden">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]"
      ></div>

      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
          Prêt à optimiser vos rendements ?
        </h2>
        <p class="text-zinc-400 text-lg mb-10 font-light">
          Rejoignez les propriétaires qui ont choisi la simplicité avec Doogoo.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link
            to="/signup"
            class="h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto flex items-center justify-center"
          >
            Créer un compte gratuit
          </router-link>
          <a
            href="mailto:support@doogoo.app?subject=Support%20Doogoo"
            class="h-12 px-8 text-zinc-400 hover:text-white font-medium transition-colors w-full sm:w-auto flex items-center justify-center"
          >
            Contacter le support
          </a>
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
              <li>
                <router-link to="/features" class="hover:text-white transition-colors"
                  >Fonctionnalités</router-link
                >
              </li>
              <li>
                <router-link to="/pricing" class="hover:text-white transition-colors"
                  >Tarifs</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Mises à jour</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Blog</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-white transition-colors"
                  >Guide du bailleur</router-link
                >
              </li>
              <li>
                <router-link to="/resources" class="hover:text-white transition-colors"
                  >Centre d'aide</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-white text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/privacy" class="hover:text-white transition-colors"
                  >Confidentialité</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:text-white transition-colors"
                  >CGU</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
          <div class="flex gap-4">
            <Twitter
              class="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors"
            />
            <Linkedin
              class="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors"
            />
            <Github
              class="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  ArrowRight,
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  Download,
  ArrowDownLeft,
  Clock,
  Home,
  UsersRound,
  AlertCircle,
  BarChart3,
  Twitter,
  Linkedin,
  Github
} from 'lucide-vue-next'

const scrollToDemo = () => {
  const element = document.getElementById('dashboard-preview')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glow-bg {
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
}

/* Hide scrollbar for clean UI in mockups */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
