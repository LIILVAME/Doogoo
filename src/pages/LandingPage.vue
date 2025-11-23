<template>
  <div class="bg-zinc-950 text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200">
    <nav class="fixed top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div class="flex items-center gap-2">
          <router-link to="/" class="text-lg font-semibold tracking-tighter text-white">doogoo</router-link>
        </div>

        <div class="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          <button class="transition-colors hover:text-white" @click="scrollTo('features')">
            {{ t('landing.features') }}
          </button>
          <button class="transition-colors hover:text-white" @click="scrollTo('pricing')">
            {{ t('landing.pricing', { defaultMessage: 'Tarifs' }) }}
          </button>
          <button class="transition-colors hover:text-white" @click="scrollTo('resources')">
            {{ t('landing.resources', { defaultMessage: 'Ressources' }) }}
          </button>
        </div>

        <div class="flex items-center gap-4">
          <button
            class="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
            @click="navigateToLogin"
          >
            {{ t('auth.login.cta') }}
          </button>
          <button
            class="rounded-full bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            @click="navigateToSignup"
          >
            {{ t('landing.tryFree') }}
          </button>
        </div>
      </div>
    </nav>

    <main class="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
      <div class="glow-bg pointer-events-none absolute left-1/2 top-0 z-0 h-[800px] w-full -translate-x-1/2"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div
          class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
          </span>
          {{ t('landing.newFeatureBadge', { defaultMessage: 'Nouvelle fonctionnalité : Export comptable simplifié' }) }}
        </div>

        <h1 class="gradient-text mb-6 text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
          {{ t('landing.heroTitle') }}
        </h1>

        <p class="mb-10 max-w-2xl mx-auto text-lg font-light leading-relaxed text-zinc-400 md:text-xl">
          {{ t('landing.heroDescription') }}
        </p>

        <div class="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            class="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-zinc-200 sm:w-auto"
            @click="navigateToSignup"
          >
            {{ t('landing.getStarted') }}
            <i class="h-4 w-4" data-lucide="arrow-right"></i>
          </button>
          <button
            class="h-12 w-full rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white transition-all hover:bg-white/10 sm:w-auto"
            @click="scrollTo('demo')"
          >
            {{ t('landing.viewDemo', { defaultMessage: 'Voir la démo' }) }}
          </button>
        </div>

        <div class="perspective-1000 relative mx-auto w-full max-w-5xl">
          <div class="glass-panel rounded-xl border border-white/10 p-2 shadow-2xl shadow-violet-900/20">
            <div class="flex items-center gap-2 rounded-t-lg border-b border-white/5 bg-zinc-900/50 px-4 py-3">
              <div class="flex gap-1.5">
                <div class="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                <div class="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                <div class="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
              </div>
              <div class="mx-auto text-xs font-mono text-zinc-500">doogoo.app/dashboard</div>
            </div>

            <div class="flex h-[400px] overflow-hidden rounded-b-lg bg-zinc-950 text-left md:h-[500px]">
              <div class="hidden w-16 flex-col gap-6 border-r border-white/5 bg-zinc-900/30 p-4 md:flex md:w-64">
                <div class="space-y-1">
                  <div class="flex h-8 cursor-pointer items-center gap-3 rounded-md bg-white/5 px-2 text-sm font-medium text-zinc-100">
                    <i class="h-4 w-4 text-violet-400" data-lucide="layout-dashboard"></i>
                    Vue d'ensemble
                  </div>
                  <div
                    class="flex h-8 cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    <i class="h-4 w-4" data-lucide="building-2"></i>
                    Mes Biens
                  </div>
                  <div
                    class="flex h-8 cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    <i class="h-4 w-4" data-lucide="users"></i>
                    Locataires
                  </div>
                  <div
                    class="flex h-8 cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    <i class="h-4 w-4" data-lucide="wallet"></i>
                    Paiements
                  </div>
                </div>

                <div class="mt-auto space-y-4">
                  <div class="rounded-lg border border-white/5 bg-zinc-900/50 p-3">
                    <p class="mb-1 text-xs text-zinc-500">Taux d'occupation</p>
                    <p class="text-sm font-medium text-white">92%</p>
                    <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div class="h-full w-[92%] bg-violet-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative flex-1 overflow-hidden p-6 md:p-8">
                <div class="mb-8 flex items-end justify-between">
                  <div>
                    <p class="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500">Revenus (Octobre)</p>
                    <h2 class="text-3xl font-semibold tracking-tight text-white">12 450,00 €</h2>
                  </div>
                  <button
                    class="flex items-center gap-2 rounded px-3 py-1.5 text-xs text-white transition-colors bg-white/10 hover:bg-white/20"
                  >
                    <i class="h-3 w-3" data-lucide="download"></i>
                    Exporter
                  </button>
                </div>

                <div class="mb-8 grid h-32 grid-cols-12 items-end gap-2 opacity-90">
                  <div class="col-span-1 h-[40%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[60%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[45%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[70%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[55%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[80%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[65%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[90%] rounded-sm bg-zinc-800 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[100%] rounded-sm bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                  <div class="col-span-1 h-[20%] rounded-sm bg-zinc-800 opacity-50 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[20%] rounded-sm bg-zinc-800 opacity-50 transition-colors hover:bg-violet-500/50"></div>
                  <div class="col-span-1 h-[20%] rounded-sm bg-zinc-800 opacity-50 transition-colors hover:bg-violet-500/50"></div>
                </div>

                <div class="space-y-3">
                  <p class="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Derniers mouvements</p>

                  <div
                    class="group flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/20 p-3 transition-colors hover:bg-zinc-900/40"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                      >
                        <i class="h-4 w-4" data-lucide="arrow-down-left"></i>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-200">Loyer - Apt 4B</p>
                        <p class="text-xs text-zinc-500">Thomas Dupont</p>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-zinc-200">+ 850,00 €</span>
                  </div>

                  <div
                    class="group flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/20 p-3 transition-colors hover:bg-zinc-900/40"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500"
                      >
                        <i class="h-4 w-4" data-lucide="clock"></i>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-zinc-200">Retard - Studio 12</p>
                        <p class="text-xs text-zinc-500">Sarah Martin • 3 jours</p>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-zinc-400 transition-colors group-hover:text-rose-400">En attente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section id="features" class="bg-zinc-950 border-t border-white/5 py-24">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <h2 class="mb-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">Tout vos biens, au même endroit.</h2>
          <p class="font-light text-zinc-400">Une suite d'outils conçue pour remplacer les feuilles de calcul complexes et les logiciels obsolètes.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div class="glass-panel group relative overflow-hidden rounded-2xl p-8 md:col-span-2">
            <div class="relative z-10">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-violet-400">
                <i class="h-5 w-5" data-lucide="home"></i>
              </div>
              <h3 class="mb-2 text-xl font-medium text-white">Gestion Multi-biens</h3>
              <p class="max-w-sm text-sm leading-relaxed text-zinc-400">
                Appartements, maisons, parkings ou locaux commerciaux. Ajoutez et configurez vos propriétés en quelques clics avec des profils détaillés.
              </p>
            </div>
            <div class="absolute bottom-0 right-0 h-3/4 w-1/2 opacity-30 transition-opacity group-hover:opacity-50">
              <div class="h-full w-full rounded-tl-xl border-l border-t border-white/10 bg-zinc-900/50 p-4">
                <div class="space-y-2">
                  <div class="h-2 w-1/2 rounded-full bg-zinc-700"></div>
                  <div class="h-2 w-3/4 rounded-full bg-zinc-800"></div>
                  <div class="mt-4 h-20 w-full rounded border border-white/5 bg-zinc-800/50"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="glass-panel group relative overflow-hidden rounded-2xl p-8">
            <div class="relative z-10">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-emerald-400">
                <i class="h-5 w-5" data-lucide="users"></i>
              </div>
              <h3 class="mb-2 text-xl font-medium text-white">Suivi Locataires</h3>
              <p class="text-sm leading-relaxed text-zinc-400">Centralisez les baux, les contacts et l'historique de chaque locataire.</p>
            </div>
          </div>

          <div class="glass-panel group relative overflow-hidden rounded-2xl p-8">
            <div class="relative z-10">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-rose-400">
                <i class="h-5 w-5" data-lucide="alert-circle"></i>
              </div>
              <h3 class="mb-2 text-xl font-medium text-white">Alertes Retards</h3>
              <p class="text-sm leading-relaxed text-zinc-400">Soyez notifié immédiatement en cas de retard de paiement. Relancez en un clic.</p>
            </div>
          </div>

          <div class="glass-panel group relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl p-8 md:col-span-2 md:flex-row">
            <div class="relative z-10 flex-1">
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-blue-400">
                <i class="h-5 w-5" data-lucide="bar-chart-3"></i>
              </div>
              <h3 class="mb-2 text-xl font-medium text-white">Vue Métrique & Export</h3>
              <p class="mb-6 text-sm leading-relaxed text-zinc-400">
                Analysez votre rentabilité en temps réel. Besoin de transmettre à votre comptable ? Exportez toutes les données en CSV ou PDF instantanément.
              </p>
              <div class="flex gap-3">
                <span class="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400">.CSV</span>
                <span class="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400">.PDF</span>
                <span class="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400">.XLS</span>
              </div>
            </div>
            <div
              class="w-full px-4 opacity-60 transition-all duration-500 grayscale group-hover:grayscale-0 md:w-1/2"
            >
              <div class="flex h-32 items-end gap-2">
                <div class="h-[40%] w-full rounded-t border-x border-t border-blue-500/30 bg-blue-500/20"></div>
                <div class="h-[60%] w-full rounded-t border-x border-t border-blue-500/40 bg-blue-500/30"></div>
                <div class="h-[50%] w-full rounded-t border-x border-t border-blue-500/60 bg-blue-500/50"></div>
                <div class="h-[90%] w-full rounded-t border-x border-t border-blue-500 bg-blue-500/80"></div>
                <div class="h-[70%] w-full rounded-t border-x border-t border-blue-500/50 bg-blue-500/40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pricing" class="border-t border-white/5 bg-zinc-950/90 py-16">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-semibold tracking-tight text-white md:text-4xl">Tarification transparente</h2>
          <p class="mt-3 text-zinc-400">Choisissez la formule adaptée à votre portefeuille immobilier.</p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div class="glass-panel rounded-2xl p-6">
            <p class="text-sm font-medium text-zinc-400">Essentiel</p>
            <h3 class="mt-3 text-3xl font-semibold text-white">0 €</h3>
            <p class="text-sm text-zinc-500">Pour démarrer en douceur avec vos premiers biens.</p>
          </div>
          <div class="glass-panel rounded-2xl border border-violet-500/50 p-6 shadow-lg shadow-violet-900/20">
            <p class="text-sm font-medium text-violet-300">Propriétaire</p>
            <h3 class="mt-3 text-3xl font-semibold text-white">24 €</h3>
            <p class="text-sm text-zinc-300">Gestion complète pour un portefeuille en croissance.</p>
          </div>
          <div class="glass-panel rounded-2xl p-6">
            <p class="text-sm font-medium text-zinc-400">Expert</p>
            <h3 class="mt-3 text-3xl font-semibold text-white">Sur-mesure</h3>
            <p class="text-sm text-zinc-500">Accompagnement dédié et fonctionnalités avancées.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="demo" class="relative overflow-hidden py-32">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 class="mb-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">Prêt à optimiser vos rendements ?</h2>
        <p class="mb-10 text-lg font-light text-zinc-400">Rejoignez les propriétaires qui ont choisi la simplicité avec Doogoo.</p>
        <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            class="h-12 w-full rounded-full bg-white px-8 font-medium text-zinc-950 transition-colors hover:bg-zinc-200 sm:w-auto"
            @click="navigateToSignup"
          >
            Créer un compte gratuit
          </button>
          <button
            class="h-12 w-full text-zinc-400 transition-colors hover:text-white sm:w-auto"
            @click="navigateToSupport"
          >
            Contacter le support
          </button>
        </div>
      </div>
    </section>

    <footer id="resources" class="border-t border-white/5 bg-zinc-950 pb-8 pt-16">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="col-span-2 md:col-span-1">
            <span class="text-lg font-semibold tracking-tighter text-white">doogoo</span>
            <p class="mt-4 text-sm font-light text-zinc-500">
              L'outil de gestion locative nouvelle génération pour les propriétaires exigeants.
            </p>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-medium text-white">Produit</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><button class="transition-colors hover:text-white" @click="scrollTo('features')">Fonctionnalités</button></li>
              <li><button class="transition-colors hover:text-white" @click="scrollTo('pricing')">Tarifs</button></li>
              <li><button class="transition-colors hover:text-white" @click="scrollTo('resources')">Mises à jour</button></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-medium text-white">Ressources</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><button class="transition-colors hover:text-white" @click="navigateToBlog">Blog</button></li>
              <li><button class="transition-colors hover:text-white" @click="navigateToGuide">Guide du bailleur</button></li>
              <li><button class="transition-colors hover:text-white" @click="navigateToHelp">Centre d'aide</button></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 text-sm font-medium text-white">Légal</h4>
            <ul class="space-y-2 text-sm text-zinc-500">
              <li><button class="transition-colors hover:text-white" @click="navigateToPrivacy">Confidentialité</button></li>
              <li><button class="transition-colors hover:text-white" @click="navigateToTerms">CGU</button></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
          <div class="flex gap-4 text-zinc-600">
            <a class="transition-colors hover:text-white" href="https://twitter.com" target="_blank" rel="noreferrer">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22 5.92a6.94 6.94 0 0 1-1.96.54 3.43 3.43 0 0 0 1.52-1.88 6.86 6.86 0 0 1-2.18.82 3.44 3.44 0 0 0-5.92 2.35c0 .27.03.53.08.78A9.76 9.76 0 0 1 3.11 4.6a3.44 3.44 0 0 0 1.07 4.59 3.4 3.4 0 0 1-1.56-.43v.04a3.45 3.45 0 0 0 2.76 3.37c-.3.08-.62.12-.95.12-.23 0-.45-.02-.66-.06a3.45 3.45 0 0 0 3.21 2.39A6.9 6.9 0 0 1 2 17.52 9.72 9.72 0 0 0 7.29 19c6.9 0 10.67-5.71 10.67-10.67 0-.16 0-.31-.01-.46A7.64 7.64 0 0 0 22 5.92Z"
                />
              </svg>
            </a>
            <a class="transition-colors hover:text-white" href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.45 20.45h-3.56v-5.39c0-1.28-.02-2.93-1.79-2.93-1.8 0-2.07 1.4-2.07 2.84v5.48H9.47V9h3.42v1.56h.05c.48-.91 1.65-1.87 3.39-1.87 3.62 0 4.29 2.38 4.29 5.47v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z"
                />
              </svg>
            </a>
            <a class="transition-colors hover:text-white" href="https://github.com" target="_blank" rel="noreferrer">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.26-1.69-1.26-1.69-1.03-.71.08-.7.08-.7 1.14.08 1.74 1.17 1.74 1.17 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.52-2.55-.29-5.23-1.27-5.23-5.68 0-1.26.45-2.3 1.17-3.12-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.19a10.9 10.9 0 0 1 5.74 0c2.18-1.5 3.14-1.19 3.14-1.19.62 1.59.23 2.76.12 3.05.73.82 1.17 1.86 1.17 3.12 0 4.42-2.69 5.38-5.25 5.67.42.37.8 1.1.8 2.23 0 1.61-.02 2.9-.02 3.29 0 .31.21.67.8.55A10.53 10.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'

const router = useRouter()
const { t } = useI18n()

const navigateToSignup = () => router.push('/signup')
const navigateToLogin = () => router.push('/login')
const navigateToSupport = () => {
  window.location.href = 'mailto:support@doogoo.app'
}

const navigateToExternal = url => window.open(url, '_blank', 'noopener,noreferrer')
const navigateToBlog = () => navigateToExternal('https://doogoo.app/blog')
const navigateToGuide = () => navigateToExternal('https://doogoo.app/guide')
const navigateToHelp = () => navigateToExternal('https://doogoo.app/help')
const navigateToPrivacy = () => navigateToExternal('https://doogoo.app/privacy')
const navigateToTerms = () => navigateToExternal('https://doogoo.app/terms')

const scrollTo = id => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

let lucideScript
let lucideLoadPromise

const loadLucide = () => {
  if (window.lucide) {
    return Promise.resolve(window.lucide)
  }

  if (lucideLoadPromise) return lucideLoadPromise

  lucideLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-lucide-cdn]')

    if (existingScript) {
      lucideScript = existingScript
      existingScript.addEventListener('load', () => resolve(window.lucide))
      existingScript.addEventListener('error', reject)
      return
    }

    lucideScript = document.createElement('script')
    lucideScript.src = 'https://unpkg.com/lucide@latest'
    lucideScript.async = true
    lucideScript.dataset.lucideCdn = 'true'
    lucideScript.onload = () => resolve(window.lucide)
    lucideScript.onerror = reject
    document.body.appendChild(lucideScript)
  })

  return lucideLoadPromise
}

onMounted(async () => {
  await loadLucide()
  await nextTick()
  window.lucide?.createIcons()
})

onUnmounted(() => {
  if (!window.lucide && lucideScript?.parentNode) {
    lucideScript.parentNode.removeChild(lucideScript)
  }

  lucideLoadPromise = undefined
  lucideScript = undefined
})
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

.perspective-1000 {
  perspective: 1000px;
}
</style>
