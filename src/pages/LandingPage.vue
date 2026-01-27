<template>
  <div
    class="min-h-screen bg-white text-zinc-900 antialiased selection:bg-violet-500/30 selection:text-violet-700 font-sans scroll-smooth"
    style="scroll-padding-top: 80px"
  >
    <!-- Navigation -->
    <nav
      ref="navRef"
      class="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-all duration-300"
      :class="{ 'bg-white/95 shadow-lg shadow-zinc-100': scrolled }"
    >
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <router-link to="/" class="text-lg font-semibold tracking-tighter text-zinc-900"
            >doogoo</router-link
          >
        </div>

        <!-- Navigation Sections -->
        <div class="hidden lg:flex items-center gap-6 text-sm font-medium">
          <a
            v-for="section in navigationSections"
            :key="section.id"
            :href="`#${section.id}`"
            @click.prevent="scrollToSection(section.id)"
            class="transition-colors relative"
            :class="
              activeSection === section.id ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
            "
          >
            {{ section.label }}
            <span
              v-if="activeSection === section.id"
              class="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            ></span>
          </a>
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:block"
          >
            Se connecter
          </router-link>
          <router-link to="/signup" class="hidden sm:block">
            <button
              class="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full animate-gradient"
              ></div>
              <div
                class="relative bg-violet-600 hover:bg-violet-700 transition-colors rounded-full px-5 py-2"
              >
                <span
                  class="text-sm font-medium text-white group-hover:text-violet-200 transition-colors"
                >
                  Essayer gratuitement
                </span>
              </div>
            </button>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main id="hero" class="relative pt-24 pb-12 md:pt-36 md:pb-24 overflow-hidden">
      <!-- Background Effects -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[900px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_60%)] pointer-events-none z-0"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/3 rounded-full blur-[120px] pointer-events-none z-0"
      ></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="flex flex-col items-center text-center">
          <!-- Headline -->
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            <span class="block text-zinc-900 mb-2">Gérez votre patrimoine</span>
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600"
            >
              en toute sérénité
            </span>
          </h1>

          <!-- Subheadline -->
          <p
            class="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Gagnez plus de clients avec une gestion locative moderne. Travaillez plus
            intelligemment, optimisez plus rapidement.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <router-link
              to="/signup"
              class="h-12 px-8 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transform duration-200"
            >
              <span>Commencer maintenant</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>

            <button
              @click="handleVideoModal"
              class="h-12 px-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 font-medium transition-colors flex items-center gap-2"
            >
              <Play class="w-4 h-4 fill-current" />
              <span>Voir la démo</span>
            </button>
          </div>

          <!-- Trust Indicators -->
          <div
            class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-600"
          >
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>7 jours d'essai gratuit</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>Annulation sans frais</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>Support réactif</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Stats Section -->
    <section id="pourquoi" class="py-24 border-t border-zinc-200 relative bg-zinc-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900">
            Vous perdez 18% de vos revenus
          </h2>
          <p class="text-zinc-600 font-light text-lg">
            La gestion manuelle vous coûte du temps et de l'argent. Doogoo change la donne.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="text-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div class="text-4xl md:text-5xl font-bold text-violet-600 mb-2">+134</div>
            <p class="text-zinc-600">Biens gérés</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div class="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">+18%</div>
            <p class="text-zinc-600">Revenus optimisés</p>
          </div>
          <div class="text-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div class="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24/7</div>
            <p class="text-zinc-600">Disponibilité</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Problem -->
          <div
            class="bg-white border border-zinc-200 shadow-sm p-8 rounded-2xl relative overflow-hidden group"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <h3 class="text-xl font-semibold text-zinc-900 mb-6 relative z-10">Avant Doogoo...</h3>
            <ul class="space-y-4 relative z-10">
              <li class="flex items-start gap-3 text-zinc-600">
                <X class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Feuilles de calcul dispersées et erreurs</span>
              </li>
              <li class="flex items-start gap-3 text-zinc-600">
                <X class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Retards de paiement non détectés</span>
              </li>
              <li class="flex items-start gap-3 text-zinc-600">
                <X class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Stress administratif constant</span>
              </li>
            </ul>
          </div>

          <!-- Solution -->
          <div
            class="bg-white border border-zinc-200 shadow-sm p-8 rounded-2xl border-emerald-500/20 relative overflow-hidden group"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>
            <h3 class="text-xl font-semibold text-zinc-900 mb-6 relative z-10">Avec Doogoo</h3>
            <ul class="space-y-4 relative z-10">
              <li class="flex items-start gap-3 text-zinc-700">
                <Check class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Tout centralisé, accessible partout</span>
              </li>
              <li class="flex items-start gap-3 text-zinc-700">
                <Check class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Alertes automatiques et relances</span>
              </li>
              <li class="flex items-start gap-3 text-zinc-700">
                <Check class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Sérénité et gain de temps</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="comment" class="py-24 relative overflow-hidden bg-white">
      <!-- Background elements -->
      <div class="absolute inset-0 bg-white"></div>
      <div
        class="absolute top-1/2 left-0 w-full h-[500px] bg-violet-500/3 blur-[100px] -translate-y-1/2 pointer-events-none"
      ></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900">
            Comment ça marche ?
          </h2>
          <p class="text-zinc-600 font-light text-lg">
            Une mise en place simple et rapide. Importez vos données ou commencez de zéro en
            quelques minutes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Connecting Line (Desktop) -->
          <div
            class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0"
          ></div>

          <!-- Step 1 -->
          <div class="relative flex flex-col items-center text-center group">
            <div
              class="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-8 relative z-10 shadow-lg shadow-zinc-100 group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.10)] transition-all duration-300"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent rounded-2xl"
              ></div>
              <Building2
                class="w-10 h-10 text-zinc-700 group-hover:scale-110 transition-transform duration-300"
              />
              <div
                class="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm border-4 border-white"
              >
                1
              </div>
            </div>
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Ajoutez vos biens</h3>
            <p class="text-zinc-600 leading-relaxed px-4">
              Enregistrez vos appartements, maisons ou locaux. Importez vos photos et documents.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative flex flex-col items-center text-center group">
            <div
              class="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-8 relative z-10 shadow-lg shadow-zinc-100 group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.10)] transition-all duration-300"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent rounded-2xl"
              ></div>
              <Users
                class="w-10 h-10 text-zinc-700 group-hover:scale-110 transition-transform duration-300"
              />
              <div
                class="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm border-4 border-white"
              >
                2
              </div>
            </div>
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Assignez les locataires</h3>
            <p class="text-zinc-600 leading-relaxed px-4">
              Créez les baux, enregistrez les locataires et configurez les loyers récurrents.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative flex flex-col items-center text-center group">
            <div
              class="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-8 relative z-10 shadow-lg shadow-zinc-100 group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.10)] transition-all duration-300"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent rounded-2xl"
              ></div>
              <TrendingUp
                class="w-10 h-10 text-zinc-700 group-hover:scale-110 transition-transform duration-300"
              />
              <div
                class="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm border-4 border-white"
              >
                3
              </div>
            </div>
            <h3 class="text-xl font-medium text-zinc-900 mb-3">Pilotez et encaissez</h3>
            <p class="text-zinc-600 leading-relaxed px-4">
              Suivez les paiements, recevez des alertes et générez vos quittances automatiquement.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
      id="fonctionnalites"
      class="py-32 relative overflow-hidden border-t border-zinc-200 bg-zinc-50"
    >
      <div class="absolute inset-0 bg-zinc-50"></div>
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900">
            Fonctionnalités intelligentes
          </h2>
          <p class="text-zinc-600 font-light text-lg">
            Conçues pour simplifier. Tout ce dont vous avez besoin pour gérer, suivre et optimiser
            sans friction.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div
            class="md:col-span-2 bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative overflow-hidden group"
          >
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-6 text-violet-600"
              >
                <Home class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-zinc-900 mb-3">Gestion Multi-biens</h3>
              <p class="text-zinc-600 text-sm max-w-sm leading-relaxed">
                Appartements, maisons, parkings ou locaux commerciaux. Ajoutez et configurez vos
                propriétés en quelques clics avec des profils détaillés.
              </p>
            </div>
            <div
              class="absolute right-0 bottom-0 w-1/2 h-3/4 opacity-10 group-hover:opacity-30 transition-opacity duration-500"
            >
              <div
                class="w-full h-full border-t border-l border-zinc-300 bg-zinc-100 rounded-tl-xl p-4"
              >
                <div class="space-y-3">
                  <div class="h-2 w-1/2 bg-zinc-300 rounded-full"></div>
                  <div class="h-2 w-3/4 bg-zinc-200 rounded-full"></div>
                  <div class="h-20 w-full bg-zinc-200 rounded mt-4 border border-zinc-300"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div
            class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative overflow-hidden group"
          >
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 text-emerald-600"
              >
                <UsersRound class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-zinc-900 mb-3">Suivi Locataires</h3>
              <p class="text-zinc-600 text-sm leading-relaxed">
                Centralisez les baux, les contacts et l'historique de chaque locataire.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div
            class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative overflow-hidden group"
          >
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6 text-rose-600"
              >
                <AlertCircle class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-zinc-900 mb-3">Alertes Retards</h3>
              <p class="text-zinc-600 text-sm leading-relaxed">
                Soyez notifié immédiatement en cas de retard de paiement. Relancez en un clic.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div
            class="md:col-span-2 bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
          >
            <div class="flex-1 relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 text-blue-600"
              >
                <BarChart3 class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-zinc-900 mb-3">Vue Métrique &amp; Export</h3>
              <p class="text-zinc-600 text-sm leading-relaxed mb-6">
                Analysez votre rentabilité en temps réel. Besoin de transmettre à votre comptable ?
                Exportez toutes les données en CSV ou PDF instantanément.
              </p>
              <div class="flex gap-3">
                <span
                  class="text-xs border border-zinc-300 px-2 py-1 rounded text-zinc-600 bg-zinc-100"
                  >.CSV</span
                >
                <span
                  class="text-xs border border-zinc-300 px-2 py-1 rounded text-zinc-600 bg-zinc-100"
                  >.PDF</span
                >
                <span
                  class="text-xs border border-zinc-300 px-2 py-1 rounded text-zinc-600 bg-zinc-100"
                  >.XLS</span
                >
              </div>
            </div>
            <div
              class="w-full md:w-1/2 h-32 flex items-end justify-between gap-2 px-4 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"
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

    <!-- Pricing Section -->
    <section id="pricing" class="py-32 relative overflow-hidden bg-white border-t border-zinc-200">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900">
            Des tarifs simples et justes
          </h2>
          <p class="text-zinc-600 font-light text-lg">
            Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          <!-- Free Plan -->
          <div
            class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative flex flex-col h-full hover:border-zinc-300 transition-colors duration-300"
          >
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3 class="text-2xl font-semibold text-zinc-900 mb-2">Gratuit</h3>
              <p class="text-zinc-500 text-sm">Pour découvrir Doogoo</p>
            </div>
            <div class="mb-8 h-[72px] flex items-end">
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-semibold text-zinc-900">0€</span>
                <span class="text-zinc-500 text-sm">/mois</span>
              </div>
            </div>
            <div class="mb-8 h-[40px]">
              <router-link to="/signup" class="block">
                <button
                  class="w-full h-10 rounded-full border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-medium text-sm transition-colors"
                >
                  Commencer gratuitement
                </button>
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Inclus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Jusqu'à <strong class="text-zinc-900">2 biens</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Gestion des locataires</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Suivi des paiements</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Export CSV &amp; Excel</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Essentiel Plan -->
          <div
            class="bg-white rounded-2xl p-8 relative border-2 border-violet-500/50 shadow-2xl shadow-violet-500/10 flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300 z-10"
          >
            <div
              class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium shadow-lg shadow-violet-500/40"
            >
              Le plus populaire
            </div>
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3 class="text-2xl font-semibold text-zinc-900 mb-2">Essentiel</h3>
              <p class="text-zinc-500 text-sm">Parfait pour 3-10 biens</p>
            </div>
            <div class="mb-8 h-[72px] flex items-end">
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-semibold text-zinc-900">12€</span>
                <span class="text-zinc-500 text-sm">/mois</span>
              </div>
            </div>
            <div class="mb-8 h-[40px]">
              <router-link to="/signup" class="block">
                <button
                  class="w-full h-10 rounded-full bg-violet-600 text-white hover:bg-violet-700 font-semibold text-sm transition-colors"
                >
                  Commencer l'essai gratuit
                </button>
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Tout du plan Gratuit, plus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Jusqu'à <strong class="text-zinc-900">10 biens</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Export CSV &amp; Excel</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Support email (48h)</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Premium Plan -->
          <div
            class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative flex flex-col h-full hover:border-zinc-300 transition-colors duration-300"
          >
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3 class="text-2xl font-semibold text-zinc-900 mb-2">Premium</h3>
              <p class="text-zinc-500 text-sm">Pour les portefeuilles importants</p>
            </div>
            <div class="mb-8 h-[72px] flex items-end">
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-semibold text-zinc-900">24€</span>
                <span class="text-zinc-500 text-sm">/mois</span>
              </div>
            </div>
            <div class="mb-8 h-[40px]">
              <router-link to="/signup" class="block">
                <button
                  class="w-full h-10 rounded-full border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-medium text-sm transition-colors"
                >
                  Commencer l'essai gratuit
                </button>
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Tout du plan Essentiel, plus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong class="text-zinc-900">Biens illimités</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Rapports avancés</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Support prioritaire (24h)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="temoignages" class="py-32 border-t border-zinc-200 bg-zinc-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900">
            Utilisé par 100+ propriétaires
          </h2>
          <p class="text-zinc-600 font-light">
            Ils gèrent mieux. Gagnent plus. Passent moins de temps.
          </p>
        </div>

        <div class="relative overflow-hidden">
          <div class="testimonials-track">
            <div class="testimonials-inner">
              <!-- Loop will be handled by Vue v-for -->
              <div
                v-for="testimonial in allTestimonials"
                :key="`first-${testimonial.id}`"
                class="testimonial-card bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex-shrink-0 flex flex-col h-full"
              >
                <div class="flex flex-col flex-1">
                  <div class="text-2xl font-bold mb-2" :class="testimonial.colorClass">
                    {{ testimonial.metric }}
                  </div>
                  <p class="text-sm text-zinc-500 mb-4">{{ testimonial.metricLabel }}</p>
                  <p class="text-zinc-700 text-sm leading-relaxed mb-6 flex-1 italic">
                    "{{ testimonial.quote }}"
                  </p>
                </div>
                <div class="flex items-center gap-3 mt-auto">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                    :class="testimonial.avatarClass"
                  >
                    {{ testimonial.initials }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-zinc-900 truncate">{{ testimonial.name }}</p>
                    <p class="text-xs text-zinc-500 truncate">{{ testimonial.role }}</p>
                  </div>
                </div>
              </div>

              <!-- Duplicate for loop -->
              <div
                v-for="testimonial in allTestimonials"
                :key="`second-${testimonial.id}`"
                class="testimonial-card bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex-shrink-0 flex flex-col h-full"
              >
                <div class="flex flex-col flex-1">
                  <div class="text-2xl font-bold mb-2" :class="testimonial.colorClass">
                    {{ testimonial.metric }}
                  </div>
                  <p class="text-sm text-zinc-500 mb-4">{{ testimonial.metricLabel }}</p>
                  <p class="text-zinc-700 text-sm leading-relaxed mb-6 flex-1 italic">
                    "{{ testimonial.quote }}"
                  </p>
                </div>
                <div class="flex items-center gap-3 mt-auto">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                    :class="testimonial.avatarClass"
                  >
                    {{ testimonial.initials }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-zinc-900 truncate">{{ testimonial.name }}</p>
                    <p class="text-xs text-zinc-500 truncate">{{ testimonial.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-32 relative overflow-hidden border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.05),transparent_60%)]"
      ></div>
      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-6">
          Prêt à simplifier votre gestion ?
        </h2>
        <p class="text-zinc-600 text-lg mb-10 font-light">
          Rejoignez les propriétaires qui ont choisi Doogoo pour gérer leurs biens.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link
            to="/signup"
            class="h-12 px-8 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
          >
            Commencer gratuitement
            <ArrowRight class="w-4 h-4" />
          </router-link>
          <router-link
            to="/pricing"
            class="h-12 px-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 font-medium transition-colors w-full sm:w-auto"
          >
            Voir les tarifs
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-200 bg-white pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <span class="text-lg font-semibold tracking-tighter text-zinc-900">doogoo</span>
            <p class="text-zinc-500 text-sm mt-4 font-light">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/features" class="hover:text-zinc-900 transition-colors"
                  >Fonctionnalités</router-link
                >
              </li>
              <li>
                <router-link to="/pricing" class="hover:text-zinc-900 transition-colors"
                  >Tarifs</router-link
                >
              </li>
              <li><a href="#" class="hover:text-zinc-900 transition-colors">Mises à jour</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><a href="#" class="hover:text-zinc-900 transition-colors">Blog</a></li>
              <li>
                <a href="#" class="hover:text-zinc-900 transition-colors">Guide du bailleur</a>
              </li>
              <li><a href="#" class="hover:text-zinc-900 transition-colors">Centre d'aide</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/privacy" class="hover:text-zinc-900 transition-colors"
                  >Confidentialité</router-link
                >
              </li>
              <li>
                <router-link to="/terms" class="hover:text-zinc-900 transition-colors"
                  >CGU</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-xs text-zinc-500">© 2024 Doogoo Inc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>

    <!-- Video Modal Placeholder -->
    <div
      v-if="showVideoModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click="showVideoModal = false"
    >
      <div
        class="bg-white p-1 rounded-2xl max-w-4xl w-full aspect-video relative shadow-2xl"
        @click.stop
      >
        <button
          @click="showVideoModal = false"
          class="absolute -top-12 right-0 text-white hover:text-zinc-300"
        >
          Fermer
        </button>
        <div
          class="w-full h-full bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500"
        >
          <p>Vidéo de démonstration à intégrer ici</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRight,
  Check,
  Building2,
  Users,
  TrendingUp,
  X,
  Play,
  Home,
  UsersRound,
  AlertCircle,
  BarChart3
} from 'lucide-vue-next'

const navRef = ref(null)
const scrolled = ref(false)
const activeSection = ref('')
const showVideoModal = ref(false)

const navigationSections = [
  { id: 'pourquoi', label: 'Pourquoi Doogoo' },
  { id: 'comment', label: 'Comment ça marche' },
  { id: 'fonctionnalites', label: 'Fonctionnalités' },
  { id: 'pricing', label: 'Tarifs' },
  { id: 'temoignages', label: 'Témoignages' }
]

const allTestimonials = [
  {
    id: 1,
    name: 'Thomas R.',
    role: 'Propriétaire de 8 appartements',
    initials: 'TR',
    metric: '+15h',
    metricLabel: 'Gagnées par mois',
    quote:
      "Avant je passais mes weekends sur Excel. Maintenant, tout se fait automatiquement. C'est bluffant d'efficacité.",
    avatarClass: 'bg-violet-500/10 text-violet-400',
    colorClass: 'text-violet-400'
  },
  {
    id: 2,
    name: 'Sarah L.',
    role: 'Investisseuse (3 biens)',
    initials: 'SL',
    metric: '0',
    metricLabel: 'Retard de paiement',
    quote:
      "Les relances automatiques ont changé ma vie. Plus besoin de courir après les loyers, Doogoo s'en occupe.",
    avatarClass: 'bg-emerald-500/10 text-emerald-400',
    colorClass: 'text-emerald-400'
  },
  {
    id: 3,
    name: 'Marc B.',
    role: 'SCI Familiale',
    initials: 'MB',
    metric: '+450€',
    metricLabel: 'Revenus optimisés',
    quote:
      "La vue sur la rentabilité m'a permis d'ajuster mes loyers et d'optimiser mes charges. L'outil se paie tout seul.",
    avatarClass: 'bg-blue-500/10 text-blue-400',
    colorClass: 'text-blue-400'
  },
  {
    id: 4,
    name: 'Julie D.',
    role: 'Propriétaire bailleur',
    initials: 'JD',
    metric: '100%',
    metricLabel: 'Conformité légale',
    quote:
      "Générer des quittances et des baux conformes en un clic, c'est une sécurité juridique inestimable pour moi.",
    avatarClass: 'bg-amber-500/10 text-amber-400',
    colorClass: 'text-amber-400'
  }
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 20

  // Simple active section detection
  const sections = navigationSections.map(section => document.getElementById(section.id))
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    if (
      section &&
      section.offsetTop <= scrollPosition &&
      section.offsetTop + section.offsetHeight > scrollPosition
    ) {
      activeSection.value = section.id
    }
  }
}

const scrollToSection = id => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

const handleVideoModal = () => {
  showVideoModal.value = true
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Testimonials Carousel Animation */
.testimonials-track {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.testimonials-inner {
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: scroll 60s linear infinite;
}

.testimonial-card {
  width: 350px;
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
