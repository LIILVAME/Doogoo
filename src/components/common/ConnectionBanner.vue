<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="!connectionStore.isOnline"
      class="fixed top-0 left-0 right-0 w-full z-50 text-center py-2 text-sm font-medium bg-yellow-50 text-yellow-700 border-b border-yellow-200 shadow-sm"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{{ $t('connection.offline') }}</span>
      </div>
    </div>
  </Transition>

  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="connectionStore.isOnline && showOnlineBanner"
      class="fixed top-0 left-0 right-0 w-full z-50 text-center py-2 text-sm font-medium bg-green-50 text-green-700 border-b border-green-200 shadow-sm"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>{{ $t('connection.online') }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useConnectionStore } from '@/stores/connectionStore'

// Utilise $t dans le template, pas besoin de t dans le script
const connectionStore = useConnectionStore()

// Affiche la bannière "en ligne" pendant 3 secondes après reconnexion
const showOnlineBanner = ref(false)
let onlineBannerTimeout = null

watch(
  () => connectionStore.isOnline,
  isOnline => {
    if (isOnline) {
      // Affiche la bannière "en ligne" pendant 3 secondes
      showOnlineBanner.value = true

      if (onlineBannerTimeout) {
        clearTimeout(onlineBannerTimeout)
      }

      onlineBannerTimeout = setTimeout(() => {
        showOnlineBanner.value = false
      }, 3000)
    } else {
      // Cache la bannière "en ligne" si on passe en offline
      showOnlineBanner.value = false
      if (onlineBannerTimeout) {
        clearTimeout(onlineBannerTimeout)
      }
    }
  }
)

onMounted(() => {
  // Initialise le watcher de connexion
  connectionStore.initConnectionWatcher()
})
</script>
