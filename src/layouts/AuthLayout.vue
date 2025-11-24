<template>
  <div>
    <!-- Skip Link pour navigation clavier -->
    <a href="#auth-content" class="skip-link">Aller au formulaire de connexion</a>
    
    <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-8 relative overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] glow-bg pointer-events-none z-0"></div>

      <div class="w-full max-w-md relative z-10">
        <!-- Logo avec animation -->
        <div class="text-center mb-8 opacity-0 animate-fade-in">
          <router-link to="/" class="inline-block">
            <div
              class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-zinc-900 border border-white/10 rounded-2xl mb-4 shadow-lg shadow-violet-500/10"
            >
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </div>
          </router-link>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">Doogoo</h1>
          <p class="text-zinc-400 text-xs sm:text-sm">{{ $t('auth.tagline') }}</p>
        </div>

        <!-- Contenu principal avec animation slide-up -->
        <div id="auth-content" class="opacity-0 animate-slide-up">
          <div class="glass-panel rounded-2xl p-6 sm:p-8 sm:p-10 w-full transform transition-all">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utilise $t dans le template, pas besoin de t dans le script
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glow-bg {
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out 0.2s forwards;
}
</style>
