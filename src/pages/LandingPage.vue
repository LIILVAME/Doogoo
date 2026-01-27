<template>
  <div
    class="min-h-screen bg-white text-zinc-900 antialiased selection:bg-primary-500/30 selection:text-primary-800 font-sans scroll-smooth"
    style="scroll-padding-top: 80px"
  >
    <!-- Navigation -->
    <nav
      ref="navRef"
      class="fixed top-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md transition-all duration-300"
      :class="{ 'bg-white/95 shadow-lg': scrolled }"
    >
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-zinc-900">doogoo</span>
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
              activeSection === section.id
                ? 'text-primary-600'
                : 'text-zinc-500 hover:text-zinc-900'
            "
          >
            {{ section.label }}
            <span
              v-if="activeSection === section.id"
              class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
            ></span>
          </a>
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block"
          >
            Se connecter
          </router-link>
          <router-link to="/signup" class="hidden sm:block">
            <Button variant="primary" size="sm">Essayer gratuitement</Button>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main id="hero" class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 w-full h-full glow-bg-light pointer-events-none z-0"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/50 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-multiply"
      ></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="flex flex-col items-center text-center">
          <!-- Headline with Propal-style formatting -->
          <div class="h1-main mb-6 w-full">
            <div class="h1-wrapper is-violet">
              <h1 ref="createH1" class="h1 is-violet bubble-word bubble-violet">Gérez</h1>
            </div>
            <h1 ref="yourH1" class="h1 is-white">votre</h1>
            <div class="h1-wrapper is-emerald hide-mob">
              <h1 ref="patrimoineH1" class="h1 is-emerald bubble-word bubble-emerald">
                patrimoine
              </h1>
            </div>
            <div class="h1-wrapper is-emerald hide-pc">
              <h1 class="h1 is-emerald bubble-word bubble-emerald">patrimoine</h1>
            </div>
            <h1 ref="enH1" class="h1 is-white hide-mob">en</h1>
            <h1 ref="threeH1" class="h1 is-violet bubble-word bubble-violet">3</h1>
            <h1 ref="clicsH1" class="h1 is-white">clics</h1>
          </div>

          <!-- Subheadline -->
          <p
            class="text-lg md:text-xl text-zinc-600 max-w-3xl mx-auto mb-8 font-normal leading-relaxed"
          >
            Gagnez plus de clients avec une gestion locative moderne. Travaillez plus
            intelligemment, optimisez plus rapidement.
          </p>

          <!-- CTA Buttons -->
          <div class="cta-buttons-container mb-6">
            <router-link
              to="/signup"
              class="button auto-width bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm hover:shadow-md"
            >
              <div class="flex items-center justify-center gap-2">
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <div
                  ref="trialButtonText"
                  words-slide-from-right
                  text-split
                  class="text is-white"
                ></div>
              </div>
            </router-link>
            <button
              type="button"
              @click="handleGoogleSignup"
              class="button auto-width flex items-center justify-center gap-3 bg-white border-2 border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 hover:border-zinc-400 hover:shadow-md"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <div
                ref="googleButtonText"
                words-slide-from-right
                text-split
                class="text-2 is-dark"
              ></div>
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>7 jours d'essai gratuit</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>Annulation à tout moment</span>
            </div>
            <div class="flex items-center gap-2">
              <Check class="w-4 h-4 text-emerald-400" />
              <span>Configuration rapide</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Stats Section: Pourquoi Doogoo -->
    <section id="pourquoi" class="py-24 border-t border-zinc-100 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="pourquoiH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Vous perdez 18% de vos revenus
          </h2>
          <p class="text-zinc-500 font-light text-lg">
            La gestion manuelle vous coûte du temps, de l'argent et des locataires. Doogoo résout
            ces 3 problèmes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div
            class="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6"
            >
              <Building2 class="w-6 h-6" />
            </div>
            <div class="text-4xl md:text-5xl font-bold text-zinc-900 mb-2 tracking-tight">+134</div>
            <p class="text-zinc-500 font-medium">Biens gérés avec succès</p>
          </div>
          <div
            class="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 rounded-xl bg-success-50 text-success-600 flex items-center justify-center mb-6"
            >
              <Wallet class="w-6 h-6" />
            </div>
            <div class="text-4xl md:text-5xl font-bold text-zinc-900 mb-2 tracking-tight">
              +2.4M€
            </div>
            <p class="text-zinc-500 font-medium">De loyers sécurisés</p>
          </div>
          <div
            class="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6"
            >
              <Users class="w-6 h-6" />
            </div>
            <div class="text-4xl md:text-5xl font-bold text-zinc-900 mb-2 tracking-tight">98%</div>
            <p class="text-zinc-500 font-medium">De satisfaction client</p>
          </div>
        </div>

        <div class="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <!-- VS Badge (Desktop) -->
          <div
            class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-zinc-100 font-bold text-zinc-400 text-sm"
          >
            VS
          </div>

          <!-- Avant -->
          <div class="glass-panel-light rounded-2xl p-8 border-danger-100 bg-danger-50/30">
            <h3 class="text-xl font-semibold text-zinc-900 mb-6 flex items-center gap-2">
              <span
                class="w-8 h-8 rounded-full bg-danger-100 flex items-center justify-center text-danger-600"
              >
                <X class="w-5 h-5" />
              </span>
              Sans Doogoo
            </h3>
            <ul class="space-y-4 text-zinc-600">
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger-400 mt-2 shrink-0"></span>
                <span>Feuilles de calcul dispersées et erreurs manuelles</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger-400 mt-2 shrink-0"></span>
                <span>Retards de paiement non détectés immédiatement</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger-400 mt-2 shrink-0"></span>
                <span>Préparation comptable longue et fastidieuse</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-danger-400 mt-2 shrink-0"></span>
                <span>Aucune vision claire sur la rentabilité réelle</span>
              </li>
            </ul>
          </div>

          <!-- Après -->
          <div
            class="glass-panel-light rounded-2xl p-8 border-primary-200 bg-white shadow-xl scale-100 md:scale-105 relative z-10 ring-1 ring-primary-100"
          >
            <h3
              ref="avecH3"
              words-slide-from-right
              text-split
              class="text-xl font-semibold text-zinc-900 mb-6 flex items-center gap-2"
            >
              <span
                class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600"
              >
                <Check class="w-5 h-5" />
              </span>
              Avec Doogoo
            </h3>
            <ul class="space-y-4 text-zinc-600">
              <li class="flex items-start gap-3">
                <Check class="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span class="font-medium text-zinc-900">Interface unique centralisée</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span class="font-medium text-zinc-900">Alertes automatiques &amp; Relances</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span class="font-medium text-zinc-900"
                  >Comptabilité automatisée (Exports clairs)</span
                >
              </li>
              <li class="flex items-start gap-3">
                <Check class="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span class="font-medium text-zinc-900">Tableaux de bord temps réel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="comment" class="py-24 border-t border-zinc-100 bg-zinc-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="commentH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Vous êtes à 5 étapes de gérer votre patrimoine
          </h2>
          <p class="text-zinc-500 font-light">
            Créez, configurez et gérez vos biens immobiliers — en quelques minutes.
          </p>
        </div>

        <div class="space-y-12">
          <!-- Step 1 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl mb-4"
              >
                1
              </div>
              <h3
                ref="step1H3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-3"
              >
                Créer votre compte
              </h3>
              <p class="text-zinc-500 leading-relaxed">
                Inscrivez-vous en quelques secondes. Aucune carte bancaire requise pour commencer.
              </p>
            </div>
            <div class="glass-panel-light rounded-2xl p-8 h-64 flex items-center justify-center">
              <div class="text-center">
                <UserPlus class="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <p class="text-zinc-500 text-sm">Création de compte</p>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
              class="glass-panel-light rounded-2xl p-8 h-64 flex items-center justify-center order-2 md:order-1"
            >
              <div class="text-center">
                <Building2 class="w-16 h-16 text-success-500 mx-auto mb-4" />
                <p class="text-zinc-500 text-sm">Ajout de biens</p>
              </div>
            </div>
            <div class="order-1 md:order-2">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-100 text-success-600 font-bold text-xl mb-4"
              >
                2
              </div>
              <h3
                ref="step2H3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-3"
              >
                Ajouter vos biens
              </h3>
              <p class="text-zinc-500 leading-relaxed">
                Ajoutez vos propriétés : appartements, maisons, parkings ou locaux commerciaux.
                Configurez les détails en quelques clics.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4"
              >
                3
              </div>
              <h3
                ref="step3H3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-3"
              >
                Enregistrer vos locataires
              </h3>
              <p class="text-zinc-500 leading-relaxed">
                Créez les profils de vos locataires, liez-les à vos biens et configurez les baux.
                Tout est centralisé.
              </p>
            </div>
            <div class="glass-panel-light rounded-2xl p-8 h-64 flex items-center justify-center">
              <div class="text-center">
                <Users class="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p class="text-zinc-500 text-sm">Gestion locataires</p>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
              class="glass-panel-light rounded-2xl p-8 h-64 flex items-center justify-center order-2 md:order-1"
            >
              <div class="text-center">
                <Wallet class="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <p class="text-zinc-500 text-sm">Suivi paiements</p>
              </div>
            </div>
            <div class="order-1 md:order-2">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 font-bold text-xl mb-4"
              >
                4
              </div>
              <h3
                ref="step4H3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-3"
              >
                Suivre les paiements
              </h3>
              <p class="text-zinc-500 leading-relaxed">
                Enregistrez les paiements, recevez des alertes automatiques en cas de retard et
                générez des rapports en temps réel.
              </p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-danger-100 text-danger-600 font-bold text-xl mb-4"
              >
                5
              </div>
              <h3 class="text-2xl font-semibold text-zinc-900 mb-3">Analyser et exporter</h3>
              <p class="text-zinc-500 leading-relaxed">
                Visualisez vos métriques, analysez votre rentabilité et exportez vos données pour
                votre comptable en un clic.
              </p>
            </div>
            <div class="glass-panel-light rounded-2xl p-8 h-64 flex items-center justify-center">
              <div class="text-center">
                <BarChart3 class="w-16 h-16 text-danger-500 mx-auto mb-4" />
                <p class="text-zinc-500 text-sm">Analytics &amp; Export</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-16">
          <router-link to="/signup">
            <Button variant="primary" size="lg">Commencer maintenant</Button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="fonctionnalites" class="py-24 border-t border-zinc-100 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="fonctionnalitesH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Fonctionnalités intelligentes.
          </h2>
          <p class="text-zinc-500 font-light">
            Conçues pour simplifier. Tout ce dont vous avez besoin pour gérer, suivre et optimiser
            sans friction.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div
            class="md:col-span-2 glass-panel-light rounded-2xl p-8 relative overflow-hidden group"
          >
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center border border-primary-100 mb-4 text-primary-600"
              >
                <Home class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-medium text-zinc-900 mb-2">Gestion Multi-biens</h3>
              <p class="text-zinc-500 text-sm max-w-sm leading-relaxed">
                Appartements, maisons, parkings ou locaux commerciaux. Ajoutez et configurez vos
                propriétés en quelques clics avec des profils détaillés.
              </p>
            </div>
            <div
              class="absolute right-0 bottom-0 w-1/2 h-3/4 opacity-30 group-hover:opacity-50 transition-opacity"
            >
              <div
                class="w-full h-full border-t border-l border-zinc-200 bg-zinc-50 rounded-tl-xl p-4"
              >
                <div class="space-y-2">
                  <div class="h-2 w-1/2 bg-zinc-200 rounded-full"></div>
                  <div class="h-2 w-3/4 bg-zinc-100 rounded-full"></div>
                  <div class="h-20 w-full bg-zinc-100 rounded mt-4 border border-zinc-200"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="glass-panel-light rounded-2xl p-8 relative overflow-hidden group">
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center border border-success-100 mb-4 text-success-600"
              >
                <UsersRound class="w-5 h-5" />
              </div>
              <h3
                ref="feature2H3"
                words-slide-from-right
                text-split
                class="text-xl font-medium text-zinc-900 mb-2"
              >
                Suivi Locataires
              </h3>
              <p class="text-zinc-500 text-sm leading-relaxed">
                Centralisez les baux, les contacts et l'historique de chaque locataire.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="glass-panel-light rounded-2xl p-8 relative overflow-hidden group">
            <div class="relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center border border-danger-100 mb-4 text-danger-500"
              >
                <AlertCircle class="w-5 h-5" />
              </div>
              <h3
                ref="feature3H3"
                words-slide-from-right
                text-split
                class="text-xl font-medium text-zinc-900 mb-2"
              >
                Alertes Retards
              </h3>
              <p class="text-zinc-500 text-sm leading-relaxed">
                Soyez notifié immédiatement en cas de retard de paiement. Relancez en un clic.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div
            class="md:col-span-2 glass-panel-light rounded-2xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8"
          >
            <div class="flex-1 relative z-10">
              <div
                class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 mb-4 text-blue-500"
              >
                <BarChart3 class="w-5 h-5" />
              </div>
              <h3
                ref="feature4H3"
                words-slide-from-right
                text-split
                class="text-xl font-medium text-zinc-900 mb-2"
              >
                Vue Métrique &amp; Export
              </h3>
              <p class="text-zinc-500 text-sm leading-relaxed mb-6">
                Analysez votre rentabilité en temps réel. Besoin de transmettre à votre comptable ?
                Exportez toutes les données en CSV ou PDF instantanément.
              </p>
              <div class="flex gap-3">
                <span
                  class="text-xs border border-zinc-200 px-2 py-1 rounded text-zinc-500 bg-zinc-50"
                  >.CSV</span
                >
                <span
                  class="text-xs border border-zinc-200 px-2 py-1 rounded text-zinc-500 bg-zinc-50"
                  >.PDF</span
                >
                <span
                  class="text-xs border border-zinc-200 px-2 py-1 rounded text-zinc-500 bg-zinc-50"
                  >.XLS</span
                >
              </div>
            </div>
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

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 border-t border-zinc-100 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="pricingH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Des tarifs simples, transparents et justes
          </h2>
          <p class="text-zinc-500 font-light text-lg">
            Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          <!-- Free Plan -->
          <div class="glass-panel-light rounded-2xl p-8 relative flex flex-col h-full">
            <!-- Badge placeholder for alignment -->
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3
                ref="freePlanH3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-2"
              >
                Gratuit
              </h3>
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
                <Button variant="secondary" size="md" class="w-full">Commencer gratuitement</Button>
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Inclus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Jusqu'à <strong class="text-zinc-900">2 biens</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Gestion des locataires</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Suivi des paiements</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Alertes de retard</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Export PDF basique</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Export CSV &amp; Excel</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Rapports avancés</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Essentiel Plan (Popular) -->
          <div
            class="glass-panel-light rounded-2xl p-8 relative border-2 border-primary-500/50 shadow-2xl shadow-primary-500/20 flex flex-col h-full"
          >
            <div
              class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-medium"
            >
              Le plus populaire
            </div>
            <!-- Badge spacer for alignment -->
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3
                ref="essentielPlanH3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-2"
              >
                Essentiel
              </h3>
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
                <Button variant="primary" size="md" class="w-full"
                  >Commencer l'essai gratuit</Button
                >
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Tout du plan Gratuit, plus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Jusqu'à <strong class="text-zinc-900">10 biens</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Export CSV &amp; Excel</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Rapports mensuels simples</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Support email (48h)</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Graphiques d'analyse</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Stockage documents illimité</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-400 min-h-[24px]">
                  <X class="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Premium Plan -->
          <div class="glass-panel-light rounded-2xl p-8 relative flex flex-col h-full">
            <!-- Badge placeholder for alignment -->
            <div class="h-6 mb-2"></div>
            <div class="mb-6 h-[60px]">
              <h3
                ref="premiumPlanH3"
                words-slide-from-right
                text-split
                class="text-2xl font-semibold text-zinc-900 mb-2"
              >
                Premium
              </h3>
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
                <Button variant="secondary" size="md" class="w-full"
                  >Commencer l'essai gratuit</Button
                >
              </router-link>
            </div>
            <div class="space-y-4 flex-grow">
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider h-[20px]">
                Tout du plan Essentiel, plus :
              </p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span><strong class="text-zinc-900">Biens illimités</strong></span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Rapports avancés &amp; graphiques</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Stockage documents illimité</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Support prioritaire (24h)</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Notifications personnalisées</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Analytics prédictives</span>
                </li>
                <li class="flex items-start gap-3 text-sm text-zinc-600 min-h-[24px]">
                  <Check class="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                  <span>Export comptable avancé</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="temoignages" class="py-24 border-t border-zinc-100 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="temoignagesH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Utilisé par 100+ propriétaires
          </h2>
          <p class="text-zinc-500 font-light">
            Ils gèrent mieux. Gagnent plus. Passent moins de temps.
          </p>
        </div>

        <!-- Scrolling Testimonials Carousel -->
        <div class="relative overflow-hidden">
          <div class="testimonials-track">
            <div class="testimonials-inner">
              <!-- First set of testimonials -->
              <div
                v-for="testimonial in allTestimonials"
                :key="`first-${testimonial.id}`"
                class="testimonial-card glass-panel-light rounded-2xl p-6 flex-shrink-0 flex flex-col h-full"
              >
                <div class="flex flex-col flex-1">
                  <div class="text-2xl font-bold mb-2" :class="testimonial.colorClass">
                    {{ testimonial.metric }}
                  </div>
                  <p class="text-sm text-zinc-500 mb-4">{{ testimonial.metricLabel }}</p>
                  <p class="text-zinc-600 text-sm leading-relaxed mb-6 flex-1">
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

              <!-- Duplicate set for seamless loop -->
              <div
                v-for="testimonial in allTestimonials"
                :key="`second-${testimonial.id}`"
                class="testimonial-card glass-panel-light rounded-2xl p-6 flex-shrink-0 flex flex-col h-full"
              >
                <div class="flex flex-col flex-1">
                  <div class="text-2xl font-bold mb-2" :class="testimonial.colorClass">
                    {{ testimonial.metric }}
                  </div>
                  <p class="text-sm text-zinc-500 mb-4">{{ testimonial.metricLabel }}</p>
                  <p class="text-zinc-600 text-sm leading-relaxed mb-6 flex-1">
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

    <!-- FAQ Section -->
    <section class="py-24 border-t border-zinc-100 bg-zinc-50">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2
            ref="faqH2"
            words-slide-from-right
            text-split
            class="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-zinc-900"
          >
            Questions fréquentes
          </h2>
          <p class="text-zinc-500 font-light">
            Voici ce que la plupart des gens demandent avant de commencer.
          </p>
        </div>

        <div class="space-y-4">
          <details class="glass-panel-light rounded-2xl p-6 group">
            <summary
              class="cursor-pointer flex items-center justify-between text-zinc-900 font-medium"
            >
              <span>Y a-t-il un essai gratuit ?</span>
              <ChevronDown
                class="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform"
              />
            </summary>
            <p class="text-zinc-600 mt-4 leading-relaxed">
              Oui, nous proposons un essai gratuit de 7 jours. Aucune carte bancaire requise pour
              commencer.
            </p>
          </details>

          <details class="glass-panel-light rounded-2xl p-6 group">
            <summary
              class="cursor-pointer flex items-center justify-between text-zinc-900 font-medium"
            >
              <span>Puis-je exporter mes données ?</span>
              <ChevronDown
                class="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform"
              />
            </summary>
            <p class="text-zinc-600 mt-4 leading-relaxed">
              Absolument. Vous pouvez exporter toutes vos données en CSV, PDF ou XLS en un clic. Vos
              données vous appartiennent.
            </p>
          </details>

          <details class="glass-panel-light rounded-2xl p-6 group">
            <summary
              class="cursor-pointer flex items-center justify-between text-zinc-900 font-medium"
            >
              <span>Qu'est-ce qui différencie Doogoo d'Excel ou d'autres outils ?</span>
              <ChevronDown
                class="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform"
              />
            </summary>
            <p class="text-zinc-600 mt-4 leading-relaxed">
              Doogoo est conçu spécifiquement pour la gestion locative : alertes automatiques,
              exports comptables, suivi en temps réel, et interface mobile. Vous gérez tout depuis
              une seule plateforme, sans workflows fragmentés.
            </p>
          </details>

          <details class="glass-panel-light rounded-2xl p-6 group">
            <summary
              class="cursor-pointer flex items-center justify-between text-zinc-900 font-medium"
            >
              <span>Doogoo est-il pour les particuliers ou les professionnels ?</span>
              <ChevronDown
                class="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform"
              />
            </summary>
            <p class="text-zinc-600 mt-4 leading-relaxed">
              Les deux. Que vous gériez 2 biens ou 200, Doogoo vous donne les mêmes outils de
              gestion que les professionnels utilisent.
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 relative overflow-hidden bg-white">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.1),transparent_50%)]"
      ></div>

      <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2
          ref="ctaH2"
          words-slide-from-right
          text-split
          class="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-6"
        >
          Augmentez votre rentabilité de 20% — instantanément
        </h2>
        <p class="text-zinc-500 text-lg mb-10 font-light">
          Gagnez plus de temps avec une gestion locative moderne. Gérez mieux, optimisez plus vite.
          <strong class="text-zinc-900">Essayez gratuitement aujourd'hui.</strong>
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link to="/signup" class="w-full sm:w-auto">
            <Button variant="primary" size="lg" class="w-full">
              Envoyer votre première gestion <ArrowRight class="w-4 h-4" />
            </Button>
          </router-link>
        </div>
        <p class="text-sm text-zinc-500 mt-6">
          7 jours d'essai gratuit • Annulation à tout moment • Configuration rapide
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-100 bg-zinc-50 pt-16 pb-8">
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
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Mises à jour</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-zinc-900 text-sm font-medium mb-4">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Blog</router-link
                >
              </li>
              <li>
                <router-link to="/coming-soon" class="hover:text-zinc-900 transition-colors"
                  >Guide du bailleur</router-link
                >
              </li>
              <li>
                <router-link to="/resources" class="hover:text-zinc-900 transition-colors"
                  >Centre d'aide</router-link
                >
              </li>
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
          <div class="flex gap-4">
            <Twitter
              class="w-4 h-4 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors"
            />
            <Linkedin
              class="w-4 h-4 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors"
            />
            <Github
              class="w-4 h-4 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRight,
  Building2,
  Users,
  Wallet,
  Home,
  UsersRound,
  AlertCircle,
  BarChart3,
  Twitter,
  Linkedin,
  Github,
  X,
  Check,
  UserPlus,
  ChevronDown
} from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/authStore'

// Navigation sections
const navigationSections = [
  { id: 'pourquoi', label: 'Pourquoi ?' },
  { id: 'comment', label: 'Comment' },
  { id: 'fonctionnalites', label: 'Fonctionnalités' },
  { id: 'pricing', label: 'Tarifs' },
  { id: 'temoignages', label: 'Témoignages' }
]

// All testimonials for carousel
const allTestimonials = [
  {
    id: 1,
    metric: '+42%',
    metricLabel: 'Revenus locatifs',
    quote:
      "Doogoo m'a permis d'optimiser mes loyers et de réduire les vacances locatives. Un outil indispensable pour tout propriétaire sérieux.",
    name: 'James Mitchell',
    initials: 'JM',
    role: 'Propriétaire de 8 biens',
    colorClass: 'text-violet-400',
    avatarClass: 'bg-violet-500/20 text-violet-400'
  },
  {
    id: 2,
    metric: '0 retard',
    metricLabel: 'Paiements en temps',
    quote:
      "Grâce aux alertes automatiques, je n'ai plus aucun retard de paiement. La gestion est devenue un jeu d'enfant.",
    name: 'Sophie Martin',
    initials: 'SM',
    role: 'Propriétaire indépendante',
    colorClass: 'text-emerald-400',
    avatarClass: 'bg-emerald-500/20 text-emerald-400'
  },
  {
    id: 3,
    metric: '+28%',
    metricLabel: 'Rentabilité',
    quote:
      "Les tableaux de bord m'ont fait prendre conscience de plusieurs opportunités d'optimisation. Résultat : +28% de rentabilité.",
    name: 'David Thompson',
    initials: 'DT',
    role: 'Investisseur immobilier',
    colorClass: 'text-blue-400',
    avatarClass: 'bg-blue-500/20 text-blue-400'
  },
  {
    id: 4,
    metric: '-75%',
    metricLabel: 'Temps administratif',
    quote:
      'Fini les heures passées sur Excel. Doogoo automatise tout et me fait gagner 6h par semaine sur la gestion administrative.',
    name: 'Emma Wilson',
    initials: 'EW',
    role: 'Propriétaire multi-biens',
    colorClass: 'text-rose-400',
    avatarClass: 'bg-rose-500/20 text-rose-400'
  },
  {
    id: 5,
    metric: '100%',
    metricLabel: 'Satisfaction locataires',
    quote:
      'Mes locataires apprécient la transparence et la rapidité de traitement. Plus de réclamations, que du positif.',
    name: 'Pierre Dubois',
    initials: 'PD',
    role: 'Gestionnaire immobilier',
    colorClass: 'text-amber-400',
    avatarClass: 'bg-amber-500/20 text-amber-400'
  },
  {
    id: 6,
    metric: '+50K FCFA',
    metricLabel: 'Revenus mensuels',
    quote:
      "En optimisant mes loyers et en réduisant les vacances, j'ai augmenté mes revenus de 50K FCFA par mois. Impressionnant !",
    name: 'Carlos Rodriguez',
    initials: 'CR',
    role: 'Propriétaire de 5 studios',
    colorClass: 'text-cyan-400',
    avatarClass: 'bg-cyan-500/20 text-cyan-400'
  },
  {
    id: 7,
    metric: '24/7',
    metricLabel: 'Suivi en temps réel',
    quote:
      "Je peux suivre l'état de mes biens et paiements à tout moment, même en déplacement. C'est révolutionnaire pour moi.",
    name: 'Yuki Tanaka',
    initials: 'YT',
    role: 'Propriétaire expatrié',
    colorClass: 'text-indigo-400',
    avatarClass: 'bg-indigo-500/20 text-indigo-400'
  },
  {
    id: 8,
    metric: '+30%',
    metricLabel: "Taux d'occupation",
    quote:
      "Les alertes et le suivi proactif m'ont permis d'augmenter mon taux d'occupation de 30%. Doogoo paie pour lui-même.",
    name: 'Ahmed Al-Mansouri',
    initials: 'AM',
    role: 'Propriétaire de 15 biens',
    colorClass: 'text-pink-400',
    avatarClass: 'bg-pink-500/20 text-pink-400'
  },
  {
    id: 9,
    metric: '1 clic',
    metricLabel: 'Export comptable',
    quote:
      "L'export comptable en un clic m'a fait économiser des heures de travail. Mon comptable est ravi, et moi aussi !",
    name: 'Jennifer Anderson',
    initials: 'JA',
    role: 'Propriétaire indépendant',
    colorClass: 'text-teal-400',
    avatarClass: 'bg-teal-500/20 text-teal-400'
  },
  {
    id: 10,
    metric: '+20 biens',
    metricLabel: 'Portefeuille géré',
    quote:
      "J'ai pu passer de 5 à 20 biens sans embaucher. Doogoo me permet de gérer tout mon portefeuille seul, efficacement.",
    name: 'Olivia Chen',
    initials: 'OC',
    role: 'Investisseuse immobilière',
    colorClass: 'text-orange-400',
    avatarClass: 'bg-orange-500/20 text-orange-400'
  }
]

// State
const activeSection = ref('hero')
const scrolled = ref(false)
const navRef = ref(null)
let observer = null
let animationObserver = null
const animatedElements = new Set() // Track which elements have been animated

// Scroll to section
const scrollToSection = sectionId => {
  const element = document.getElementById(sectionId)
  if (element) {
    const navHeight = navRef.value?.offsetHeight || 64
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - navHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Handle scroll for nav background
const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

// Setup Intersection Observer
const setupObserver = () => {
  const options = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  // Observe all sections
  navigationSections.forEach(section => {
    const element = document.getElementById(section.id)
    if (element) {
      observer.observe(element)
    }
  })
}

// Handle Google signup
const authStore = useAuthStore()
const handleGoogleSignup = async () => {
  await authStore.loginWithGoogle('/dashboard')
}

// Refs for animated headlines
const createH1 = ref(null)
const yourH1 = ref(null)
const patrimoineH1 = ref(null)
const enH1 = ref(null)
const threeH1 = ref(null)
const clicsH1 = ref(null)

// Refs for animated button texts
const trialButtonText = ref(null)
const googleButtonText = ref(null)

// Refs for animated section headings
const pourquoiH2 = ref(null)
const avantH3 = ref(null)
const avecH3 = ref(null)
const commentH2 = ref(null)
const step1H3 = ref(null)
const step2H3 = ref(null)
const step3H3 = ref(null)
const step4H3 = ref(null)
const step5H3 = ref(null)
const fonctionnalitesH2 = ref(null)
const feature1H3 = ref(null)
const feature2H3 = ref(null)
const feature3H3 = ref(null)
const feature4H3 = ref(null)
const pricingH2 = ref(null)
const freePlanH3 = ref(null)
const essentielPlanH3 = ref(null)
const premiumPlanH3 = ref(null)
const temoignagesH2 = ref(null)
const faqH2 = ref(null)
const ctaH2 = ref(null)

// Split text into characters and animate
const splitTextIntoChars = (element, delay = 0) => {
  if (!element) return

  // Check if already animated
  if (animatedElements.has(element)) return

  const text = element.textContent
  if (!text || text.trim() === '') return

  const words = text.split(' ')
  element.innerHTML = ''

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span')
    wordSpan.className = 'word'
    wordSpan.style.display = 'inline-block'

    word.split('').forEach((char, charIndex) => {
      const charSpan = document.createElement('span')
      charSpan.className = 'char'
      charSpan.style.display = 'inline-block'
      charSpan.textContent = char === ' ' ? '\u00A0' : char
      charSpan.style.opacity = '0'
      charSpan.style.transform = 'translateX(30px)'
      wordSpan.appendChild(charSpan)

      // Animate character
      setTimeout(
        () => {
          charSpan.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          charSpan.style.opacity = '1'
          charSpan.style.transform = 'translateX(0)'
        },
        delay + wordIndex * 100 + charIndex * 30
      )
    })

    element.appendChild(wordSpan)
    if (wordIndex < words.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
  })

  // Mark as animated
  animatedElements.add(element)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  setupObserver()

  // Animate headlines
  setTimeout(() => {
    splitTextIntoChars(createH1.value, 0)
    splitTextIntoChars(yourH1.value, 200)
    splitTextIntoChars(patrimoineH1.value, 400)
    splitTextIntoChars(enH1.value, 600)
    splitTextIntoChars(threeH1.value, 700)
    splitTextIntoChars(clicsH1.value, 800)
  }, 100)

  // Animate button texts
  setTimeout(() => {
    if (trialButtonText.value) {
      trialButtonText.value.textContent = 'Start 7 Day Free Trial'
      splitTextIntoChars(trialButtonText.value, 1000)
    }
    if (googleButtonText.value) {
      googleButtonText.value.textContent = 'Sign up with Google'
      splitTextIntoChars(googleButtonText.value, 1200)
    }
  }, 100)

  // Setup animation observer for section headings
  setupAnimationObserver()
})

// Setup Intersection Observer for text animations
const setupAnimationObserver = () => {
  const options = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: 0.1
  }

  animationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedElements.has(entry.target)) {
        // Animate directly on the observed element
        splitTextIntoChars(entry.target, 0)
      }
    })
  }, options)

  // Observe all animated headings
  const elementsToObserve = [
    pourquoiH2,
    avantH3,
    avecH3,
    commentH2,
    step1H3,
    step2H3,
    step3H3,
    step4H3,
    step5H3,
    fonctionnalitesH2,
    feature1H3,
    feature2H3,
    feature3H3,
    feature4H3,
    pricingH2,
    freePlanH3,
    essentielPlanH3,
    premiumPlanH3,
    temoignagesH2,
    faqH2,
    ctaH2
  ]

  // Wait for DOM to be ready, then observe elements
  setTimeout(() => {
    elementsToObserve.forEach(ref => {
      if (ref.value && !animatedElements.has(ref.value)) {
        animationObserver.observe(ref.value)
      }
    })
  }, 300)
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
  if (animationObserver) {
    animationObserver.disconnect()
  }
})
</script>

<style scoped>
/* Global button border-radius */
button,
[type='button'],
[type='submit'],
[type='reset'] {
  border-radius: 9999px;
}

/* CTA Buttons Container */
.cta-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

@media (min-width: 640px) {
  .cta-buttons-container {
    flex-direction: row;
  }
}

/* Button Auto Width */
.button.auto-width {
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 8px 16px;
  text-decoration: none;
  transition: all 0.35s;
  display: flex;
  border-radius: 9999px !important;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

/* Button text animation */
.text.is-white {
  color: white;
}

.text-2.is-dark {
  color: #1f2937;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 228, 231, 0.6); /* zinc-200 */
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}

.glass-panel-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 228, 231, 0.6);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.glass-panel-light:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.05),
    0 10px 10px -5px rgba(0, 0, 0, 0.01);
  border-color: rgba(99, 102, 241, 0.2); /* primary-500/20 */
}

.gradient-text {
  background: linear-gradient(to right, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glow-bg {
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
}

.glow-bg-light {
  background:
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(167, 139, 250, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(52, 211, 153, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
  filter: blur(40px);
  animation: pulse-glow 8s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Propal-style Hero Headlines */
/* Britti Sans Font - Commenté car les fichiers ne sont pas présents
   Utilise Space Grotesk comme fallback (déjà chargée via Google Fonts)
   
   Pour activer Britti Sans, ajoutez les fichiers dans /public/fonts/ :
   - BrittiSans-Regular.woff2
   - BrittiSans-Regular.woff
   - BrittiSans-Bold.woff2
   - BrittiSans-Bold.woff
   
@font-face {
  font-family: 'Britti Sans';
  src:
    url('/fonts/BrittiSans-Regular.woff2') format('woff2'),
    url('/fonts/BrittiSans-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Britti Sans';
  src:
    url('/fonts/BrittiSans-Bold.woff2') format('woff2'),
    url('/fonts/BrittiSans-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
*/

/* Apply Space Grotesk to all headings (Britti Sans non disponible) */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family:
    'Space Grotesk',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-feature-settings:
    'kern' 1,
    'liga' 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.h1-main {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  font-family:
    'Space Grotesk',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: clamp(1.75rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-feature-settings:
    'kern' 1,
    'liga' 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
  flex-wrap: nowrap;
}

.h1-holder {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0.25em;
  white-space: nowrap;
}

.h1-wrapper {
  display: inline-block;
}

.h1 {
  display: inline-block;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  margin: 0;
  padding: 0;
}

.h1.is-violet {
  color: #a78bfa;
}

.h1.is-white {
  color: #18181b; /* zinc-900 */
}

.h1.is-emerald {
  color: #34d399;
}

.h1.is-black {
  color: #000000;
}

.word {
  display: inline-block;
  white-space: nowrap;
}

.char {
  display: inline-block;
}

/* Bubble effect for highlighted words */
.bubble-word {
  position: relative;
  display: inline-block;
  padding: 0.15em 0.4em;
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.bubble-violet {
  background: rgba(167, 139, 250, 0.15);
  box-shadow: 0 0 0 0 rgba(167, 139, 250, 0);
}

.bubble-emerald {
  background: rgba(52, 211, 153, 0.15);
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
}

.bubble-word:hover {
  transform: rotate(-7deg) translate(-10px, -10px) scale(1.1);
}

.bubble-violet:hover {
  background: rgba(167, 139, 250, 0.25);
  box-shadow:
    0 0 20px rgba(167, 139, 250, 0.4),
    0 0 40px rgba(167, 139, 250, 0.2);
}

.bubble-emerald:hover {
  background: rgba(52, 211, 153, 0.25);
  box-shadow:
    0 0 20px rgba(52, 211, 153, 0.4),
    0 0 40px rgba(52, 211, 153, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hide-mob {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .hide-pc {
    display: none !important;
  }
}

/* Testimonials Carousel */
.testimonials-track {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.testimonials-inner {
  display: flex;
  gap: 1.5rem;
  width: fit-content;
  animation: scroll-testimonials 60s linear infinite;
}

.testimonial-card {
  width: 380px;
  min-width: 380px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

@keyframes scroll-testimonials {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause on hover */
.testimonials-track:hover .testimonials-inner {
  animation-play-state: paused;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .testimonial-card {
    width: 320px;
    min-width: 320px;
  }
}
</style>
