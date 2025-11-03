<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation moderne avec backdrop blur -->
    <header>
      <nav
        class="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <router-link to="/" aria-label="Doogoo - Accueil" class="group">
                  <h1
                    class="text-2xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors"
                  >
                    Doogoo
                  </h1>
                </router-link>
              </div>
            </div>
            <div class="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {{ $t('landing.features') }}
              </a>
              <a
                href="#testimonials"
                class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {{ $t('landing.testimonials') }}
              </a>
              <button
                @click="goToDashboard"
                class="btn-primary shadow-md hover:shadow-lg transition-all"
              >
                {{ $t('landing.getStarted') }}
              </button>
            </div>
            <button
              @click="goToDashboard"
              class="md:hidden btn-primary text-sm px-4 py-2 shadow-md"
            >
              {{ $t('landing.tryIt') }}
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section moderne avec gradient -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-primary-100/20"
    >
      <!-- Effet de background décoratif -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
        ></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <!-- Badge -->
            <div
              class="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
            >
              <span class="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
              Plateforme de gestion immobilière
            </div>

            <h2
              class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
            >
              {{ $t('landing.heroTitle') }}
            </h2>
            <p class="text-xl text-gray-600 leading-relaxed max-w-xl">
              {{ $t('landing.heroDescription') }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="goToDashboard"
                class="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {{ $t('landing.getStarted') }}
                <svg
                  class="inline-block w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                class="btn-secondary text-lg px-8 py-4 border-2 hover:border-primary-600 hover:text-primary-600 transition-all"
              >
                {{ $t('landing.tryFree') }}
              </button>
            </div>

            <!-- Stats rapides -->
            <div class="flex flex-wrap gap-6 pt-4">
              <div class="flex items-center space-x-2">
                <div class="flex -space-x-2">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-700">
                  <span class="font-bold text-primary-600">500+</span> propriétaires
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-700">Sans engagement</span>
              </div>
            </div>
          </div>

          <!-- Image Hero avec effet 3D -->
          <div class="relative">
            <div class="relative transform hover:scale-105 transition-transform duration-500">
              <!-- Glow effect -->
              <div
                class="absolute -inset-4 bg-gradient-to-r from-primary-400 to-green-400 rounded-2xl blur-2xl opacity-30"
              ></div>
              <!-- Card avec shadow -->
              <div class="relative card p-2 shadow-2xl border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Tableau de bord Doogoo - Interface moderne de gestion immobilière avec graphiques et statistiques"
                  class="rounded-lg w-full"
                  loading="lazy"
                  @error="handleImageError"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <!-- Fallback gradient si l'image ne charge pas -->
                <div
                  class="hidden w-full h-full min-h-[400px] rounded-lg bg-gradient-to-br from-primary-100 via-green-100 to-blue-100 flex items-center justify-center"
                >
                  <div class="text-center p-8">
                    <svg
                      class="w-24 h-24 mx-auto text-primary-600 opacity-50 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p class="text-gray-600 font-medium">Dashboard Doogoo</p>
                  </div>
                </div>
                <!-- Badge flottant -->
                <div
                  class="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                >
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm font-semibold text-gray-900">Temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section modernisée -->
    <section id="features" class="bg-gray-50 py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4"
          >
            Fonctionnalités
          </div>
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {{ $t('landing.featuresTitle') }}
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ $t('landing.featuresDescription') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="group card text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div
              class="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <div v-html="feature.icon" class="w-10 h-10 text-primary-600"></div>
            </div>
            <h4 class="text-xl font-bold mb-3 text-gray-900">{{ feature.title }}</h4>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview Section avec gradient -->
    <section class="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Gérez vos propriétés et revenus locatifs
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Suivez vos biens immobiliers, vos locataires et vos revenus depuis une seule plateforme
          </p>
        </div>
        <div class="relative transform hover:scale-[1.02] transition-transform duration-500">
          <div
            class="absolute -inset-4 bg-gradient-to-r from-primary-400 via-green-400 to-blue-400 rounded-2xl blur-2xl opacity-20"
          ></div>
          <div class="relative card p-4 shadow-2xl border border-gray-100">
            <!-- Composition avec propriétés et données -->
            <div
              class="relative bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden"
            >
              <!-- Image de propriétés immobilières en arrière-plan -->
              <div class="absolute inset-0 opacity-10">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80&fit=crop"
                  alt="Propriétés immobilières"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleImageError"
                  onerror="this.style.display='none';"
                />
                <!-- Fallback gradient si l'image ne charge pas -->
                <div class="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
              </div>
              <!-- Overlay avec interface de gestion -->
              <div class="relative p-8">
                <div class="grid md:grid-cols-3 gap-6 mb-6">
                  <!-- Carte Propriété -->
                  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-bold text-gray-900">Appartement T2</h4>
                      <span
                        class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                        >Occupé</span
                      >
                    </div>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-600 text-sm">Loyer</span>
                        <span class="font-bold text-gray-900">950 €</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600 text-sm">Locataire</span>
                        <span class="font-medium text-gray-900">Marie D.</span>
                      </div>
                      <div class="pt-2 border-t border-gray-100">
                        <span class="text-xs text-gray-500">Statut paiement</span>
                        <div class="flex items-center mt-1">
                          <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span class="text-sm font-medium text-gray-700">À jour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Statistiques -->
                  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h4 class="font-bold text-gray-900 mb-4">Revenus mensuels</h4>
                    <div class="text-3xl font-bold text-primary-600 mb-2">3 650 €</div>
                    <div class="flex items-center text-sm text-gray-600">
                      <svg
                        class="w-4 h-4 text-green-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      +12% vs mois dernier
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-100">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">4 propriétés</span>
                        <span class="text-gray-600">3 occupées</span>
                      </div>
                    </div>
                  </div>
                  <!-- Graphique simple -->
                  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h4 class="font-bold text-gray-900 mb-4">Évolution</h4>
                    <div class="flex items-end space-x-2 h-24 mb-4">
                      <div class="flex-1 bg-primary-200 rounded-t" style="height: 60%"></div>
                      <div class="flex-1 bg-primary-300 rounded-t" style="height: 75%"></div>
                      <div class="flex-1 bg-primary-400 rounded-t" style="height: 85%"></div>
                      <div class="flex-1 bg-primary-500 rounded-t" style="height: 100%"></div>
                    </div>
                    <div class="text-xs text-gray-600 flex justify-between">
                      <span>Sept</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Déc</span>
                    </div>
                  </div>
                </div>
                <!-- Liste des paiements -->
                <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 class="font-bold text-gray-900 mb-4">Paiements récents</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div class="font-medium text-gray-900">Appartement T2 - Paris</div>
                        <div class="text-sm text-gray-600">Marie Dubois • 05 déc</div>
                      </div>
                      <div class="text-right">
                        <div class="font-bold text-gray-900">950 €</div>
                        <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                          >Payé</span
                        >
                      </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div class="font-medium text-gray-900">T3 - Marseille</div>
                        <div class="text-sm text-gray-600">Jean Martin • 05 nov</div>
                      </div>
                      <div class="text-right">
                        <div class="font-bold text-gray-900">1 200 €</div>
                        <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full"
                          >En retard</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section modernisée -->
    <section id="testimonials" class="bg-gray-50 py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4"
          >
            Témoignages
          </div>
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {{ $t('landing.testimonialsTitle') }}
          </h3>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="group card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div class="flex items-start mb-6">
              <div class="relative">
                <img
                  :src="testimonial.avatar"
                  :alt="testimonial.name"
                  class="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                ></div>
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-bold text-gray-900 mb-1">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                <div class="flex mt-2">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed relative pl-4">
              <span class="absolute left-0 top-0 text-4xl text-primary-200 font-serif leading-none">
                "
              </span>
              <span class="relative">{{ testimonial.text }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section avec gradient moderne -->
    <section
      class="relative bg-gradient-to-r from-primary-600 via-primary-700 to-green-600 py-20 lg:py-28 overflow-hidden"
    >
      <!-- Effet de background -->
      <div class="absolute inset-0">
        <div
          class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay opacity-10 filter blur-3xl"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay opacity-10 filter blur-3xl"
        ></div>
      </div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {{ $t('landing.ctaTitle') }}
        </h3>
        <p class="text-xl text-primary-50 mb-10 max-w-2xl mx-auto">
          {{ $t('landing.ctaDescription') }}
        </p>
        <button
          @click="goToDashboard"
          class="bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:bg-gray-50 hover:scale-105 transform transition-all duration-200"
        >
          {{ $t('landing.tryFree') }}
          <svg
            class="inline-block w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- Footer modernisé -->
    <footer class="bg-gray-900 text-gray-400 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 class="text-white text-2xl font-bold mb-4">Doogoo</h4>
            <p class="text-sm leading-relaxed mb-4">
              La solution complète pour le monitoring de vos biens immobiliers.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h5 class="text-white font-bold mb-4">Produit</h5>
            <ul class="space-y-3 text-sm">
              <li>
                <a href="#features" class="hover:text-white transition-colors inline-block">
                  {{ $t('landing.features') }}
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors inline-block">Tarifs</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors inline-block">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-bold mb-4">Entreprise</h5>
            <ul class="space-y-3 text-sm">
              <li>
                <a href="#" class="hover:text-white transition-colors inline-block">À propos</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors inline-block">Blog</a>
              </li>
              <li>
                <a href="#" class="hover:text-white transition-colors inline-block">Carrières</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-white font-bold mb-4">Contact</h5>
            <ul class="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:contact@doogoo.app"
                  class="hover:text-white transition-colors inline-block"
                >
                  contact@doogoo.app
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" class="hover:text-white transition-colors inline-block">
                  +33 1 23 45 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm"
        >
          <p>&copy; 2024 Doogoo. Tous droits réservés.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" class="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" class="hover:text-white transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { mockTestimonials } from '../data/mockData'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const testimonials = ref(mockTestimonials)

const features = computed(() => [
  {
    title: t('landing.featureMonitoring'),
    description: t('landing.featureMonitoringDesc'),
    icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`
  },
  {
    title: t('landing.featureAlerts'),
    description: t('landing.featureAlertsDesc'),
    icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>`
  },
  {
    title: t('landing.featurePayments'),
    description: t('landing.featurePaymentsDesc'),
    icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9.001 9.001 0 11-18 0 9.001 9.001 0 0118 0z" />
    </svg>`
  },
  {
    title: 'Sécurité renforcée',
    description: 'Protection avancée de vos données et de vos biens immobiliers',
    icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>`
  }
])

const goToDashboard = () => {
  // Redirige vers login si non connecté, dashboard si connecté
  if (authStore.user) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

/**
 * Gère les erreurs de chargement d'images
 */
const handleImageError = event => {
  // L'image est déjà cachée via onerror, on peut logger en dev
  if (import.meta.env.DEV) {
    console.debug('⚠️ Image failed to load:', event.target.src)
  }
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
