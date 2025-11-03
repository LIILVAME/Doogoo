<template>
  <Teleport to="body">
    <!-- ARIA live region pour screen readers -->
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      class="sr-only"
      :aria-label="`${items.length} notification${items.length > 1 ? 's' : ''}`"
    >
      <span v-for="toast in items" :key="toast.id" class="sr-only">
        {{
          toast.type === 'success' ? 'Succès' : toast.type === 'error' ? 'Erreur' : 'Information'
        }}:
        {{ toast.message }}
      </span>
    </div>

    <div class="fixed top-4 right-4 z-[60] space-y-2 max-w-sm w-full safe-top safe-right">
      <TransitionGroup name="toast">
        <div
          v-for="toast in items"
          :key="toast.id"
          class="rounded-lg px-4 py-3 shadow-lg border text-sm flex items-start gap-3 bg-white animate-slide-in-right"
          :class="{
            'border-green-200': toast.type === 'success',
            'border-red-200': toast.type === 'error',
            'border-blue-200': toast.type === 'info'
          }"
          role="alert"
          aria-live="polite"
        >
          <!-- Icône -->
          <div
            class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            :class="{
              'bg-green-100 text-green-600': toast.type === 'success',
              'bg-red-100 text-red-600': toast.type === 'error',
              'bg-blue-100 text-blue-600': toast.type === 'info'
            }"
          >
            <svg
              v-if="toast.type === 'success'"
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p
              class="font-medium"
              :class="{
                'text-green-800': toast.type === 'success',
                'text-red-800': toast.type === 'error',
                'text-blue-800': toast.type === 'info'
              }"
            >
              {{ toast.message }}
            </p>

            <!-- Action (optionnelle) -->
            <button
              v-if="toast.action"
              @click="handleAction(toast)"
              class="mt-2 text-xs font-medium underline hover:no-underline"
              :class="{
                'text-green-700': toast.type === 'success',
                'text-red-700': toast.type === 'error',
                'text-blue-700': toast.type === 'info'
              }"
            >
              {{ toast.action.label }}
            </button>
          </div>

          <!-- Bouton fermer -->
          <button
            @click="remove(toast.id)"
            class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors opacity-60 hover:opacity-100"
            aria-label="Fermer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
const { items } = storeToRefs(toastStore)
const { remove } = toastStore

/**
 * Gère le clic sur une action dans le toast
 */
const handleAction = toast => {
  if (toast.action?.onClick) {
    toast.action.onClick()
  }
  remove(toast.id)
}
</script>

<style scoped>
/* Animations pour les toasts */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>
