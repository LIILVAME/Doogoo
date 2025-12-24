<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="errorStore.isNetworkError"
        class="fixed inset-0 z-[100] overflow-y-auto"
        @click.self="handleRetry"
      >
        <!-- Overlay backdrop (non cliquable pour forcer l'action) -->
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>

        <!-- Modal centré -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md mx-auto transform rounded-2xl glass-panel shadow-2xl transition-all"
            @click.stop
          >
            <!-- Contenu -->
            <div class="px-6 py-8 text-center">
              <!-- Icône d'erreur réseau -->
              <div
                class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20"
              >
                <svg
                  class="w-8 h-8 text-amber-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>

              <!-- Titre -->
              <h2 class="text-2xl font-bold text-white mb-3">
                Connexion au serveur interrompue
              </h2>

              <!-- Message -->
              <p class="text-zinc-300 mb-6 leading-relaxed">
                {{ errorStore.errorMessage || 'Le serveur semble endormi ou inaccessible. Tentative de reconnexion...' }}
              </p>

              <!-- Indicateur de reconnexion -->
              <div class="mb-6 flex items-center justify-center gap-2 text-sm text-zinc-400">
                <svg
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Tentative de reconnexion automatique...</span>
              </div>

              <!-- Bouton Réessayer -->
              <button
                @click="handleRetry"
                :disabled="isRetrying"
                class="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isRetrying"
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="-ml-1 mr-2 h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{ isRetrying ? 'Reconnexion en cours...' : '🔄 Réessayer maintenant' }}
              </button>

              <!-- Message d'aide -->
              <p class="mt-4 text-xs text-zinc-500">
                Si le problème persiste, vérifiez votre connexion internet ou réessayez dans quelques instants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useErrorStore } from '@/stores/errorStore'
import { useConnectionStore } from '@/stores/connectionStore'

const errorStore = useErrorStore()
const connectionStore = useConnectionStore()
const isRetrying = ref(false)

/**
 * Gère le clic sur le bouton "Réessayer"
 * Tente de recharger la page ou relancer les fetchs
 */
const handleRetry = async () => {
  if (isRetrying.value) return

  isRetrying.value = true

  try {
    // 1. Vérifie la connexion réseau
    const isOnline = await connectionStore.checkConnection()

    if (!isOnline) {
      // Pas de connexion internet, on ne peut pas continuer
      errorStore.triggerNetworkError(
        'Pas de connexion internet. Vérifiez votre réseau et réessayez.',
        errorStore.errorContext
      )
      isRetrying.value = false
      return
    }

    // 2. Réinitialise l'erreur pour permettre de nouveaux appels
    errorStore.resetError()

    // 3. Recharge la page pour réinitialiser l'état de l'application
    // Cela permet de réinitialiser tous les stores et refaire les fetchs initiaux
    window.location.reload()
  } catch (error) {
    console.error('Erreur lors de la tentative de reconnexion:', error)
    // En cas d'erreur, on garde le modal ouvert
    errorStore.triggerNetworkError(
      'Erreur lors de la tentative de reconnexion. Veuillez réessayer.',
      errorStore.errorContext
    )
    isRetrying.value = false
  }
}
</script>

<style scoped>
/* Transition pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-panel,
.modal-leave-active .glass-panel {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .glass-panel,
.modal-leave-to .glass-panel {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
