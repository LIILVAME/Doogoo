<template>
  <div>
    <div
      class="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-8 relative overflow-hidden"
    >
      <!-- Background Glow -->
      <div class="absolute inset-0 w-full h-full glow-bg-light pointer-events-none z-0"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[80px] pointer-events-none z-0 mix-blend-multiply"
      ></div>

      <div class="w-full max-w-md relative z-10">
        <!-- Logo avec animation -->
        <div class="text-center mb-8 opacity-0 animate-fade-in">
          <router-link to="/" class="inline-block">
            <div
              class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white border border-zinc-100 rounded-2xl mb-4 shadow-xl shadow-primary-500/10"
            >
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600"
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
          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 mb-1 tracking-tight">Doogoo</h1>
          <p class="text-zinc-500 text-xs sm:text-sm">{{ $t('auth.tagline') }}</p>
        </div>

        <!-- Contenu principal avec animation slide-up -->
        <div id="auth-content" class="opacity-0 animate-slide-up">
          <div
            class="glass-panel-light rounded-2xl p-6 sm:p-8 sm:p-10 w-full transform transition-all shadow-xl ring-1 ring-black/5"
          >
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
.glass-panel-light {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
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
