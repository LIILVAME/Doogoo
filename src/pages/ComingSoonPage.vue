<template>
  <div
    class="min-h-screen bg-white text-zinc-50 antialiased selection:bg-violet-500/30 selection:text-violet-200 flex flex-col"
  >
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tighter text-zinc-900">doogoo</span>
        </router-link>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <router-link to="/features" class="hover:text-zinc-900 transition-colors"
            >Fonctionnalités</router-link
          >
          <router-link to="/pricing" class="hover:text-zinc-900 transition-colors"
            >Tarifs</router-link
          >
          <router-link to="/resources" class="hover:text-zinc-900 transition-colors"
            >Ressources</router-link
          >
        </div>

        <div class="flex items-center gap-4">
          <router-link
            to="/login"
            class="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:block"
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

    <!-- Content -->
    <div class="flex-1 flex items-center justify-center px-6 pt-24">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Glow Effect -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none"
        ></div>

        <!-- Icon -->
        <div
          class="relative z-10 mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-panel"
        >
          <Clock class="w-10 h-10 text-violet-400" />
        </div>

        <!-- Title -->
        <h1
          class="relative z-10 text-4xl md:text-5xl font-semibold tracking-tight mb-4 gradient-text"
        >
          Cette page arrive bientôt
        </h1>

        <!-- Subtitle -->
        <p class="relative z-10 text-lg md:text-xl text-zinc-600 mb-10 font-light leading-relaxed">
          Nous travaillons dessus. Revenez prochainement pour découvrir cette nouvelle
          fonctionnalité.
        </p>

        <!-- CTA Button -->
        <router-link
          to="/"
          class="relative z-10 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-all"
        >
          <ArrowLeft class="w-4 h-4" />
          Retour à l'accueil
        </router-link>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-zinc-200 bg-white pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2 md:col-span-1">
            <router-link to="/" class="text-lg font-semibold tracking-tighter text-zinc-900"
              >doogoo</router-link
            >
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
          <p class="text-xs text-zinc-600">© 2024 Doogoo Inc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Clock, ArrowLeft } from 'lucide-vue-next'
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(228, 228, 231, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.gradient-text {
  background: linear-gradient(to right, #18181b, #52525b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
