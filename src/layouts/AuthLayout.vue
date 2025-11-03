<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8"
  >
    <div class="w-full max-w-md">
      <!-- Logo avec animation -->
      <div class="text-center mb-8 opacity-0 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg"
        >
          <svg
            class="w-8 h-8 sm:w-10 sm:h-10 text-white"
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
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Doogoo</h1>
        <p class="text-gray-600 text-xs sm:text-sm">{{ $t('auth.tagline') }}</p>
      </div>

      <!-- Contenu principal avec animation slide-up -->
      <div class="opacity-0 animate-slide-up">
        <div
          class="bg-white shadow-xl sm:shadow-2xl rounded-2xl p-6 sm:p-8 sm:p-10 w-full border border-gray-100 transform transition-all"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Utilise $t dans le template, pas besoin de t dans le script
</script>

<style scoped>
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

/* Optimisation mobile : réduire dégradé complexe */
@media (max-width: 640px) {
  .bg-gradient-to-br {
    background: #f9fafb;
  }
}
</style>
