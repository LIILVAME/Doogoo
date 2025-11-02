<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        :aria-label="message || 'Chargement en cours'"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
          <!-- Spinner -->
          <div class="flex justify-center mb-4">
            <div
              class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
            />
          </div>

          <!-- Message -->
          <p v-if="message" class="text-center text-gray-700 dark:text-gray-300 font-medium">
            {{ message }}
          </p>

          <!-- Description optionnelle -->
          <p v-if="description" class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ description }}
          </p>

          <!-- Progression (optionnelle) -->
          <div v-if="progress !== null" class="mt-4">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{{ progress }}%</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Chargement en cours...'
  },
  description: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: null,
    validator: value => value === null || (value >= 0 && value <= 100)
  }
})
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
