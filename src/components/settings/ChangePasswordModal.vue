<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="handleClose">
        <!-- Overlay backdrop -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="handleClose"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative w-full max-w-md mx-4 md:mx-auto max-h-[90vh] overflow-y-auto transform rounded-xl bg-white shadow-xl transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ $t('security.password.modalTitle') }}
              </h2>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="px-6 py-4">
              <div class="space-y-4">
                <!-- Email (readonly) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('login.email') }}
                  </label>
                  <input
                    type="email"
                    :value="authStore.user?.email || ''"
                    disabled
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <!-- Ancien mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.currentPassword') }}
                  </label>
                  <input
                    v-model="form.currentPassword"
                    type="password"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('security.password.currentPasswordPlaceholder')"
                  />
                </div>

                <!-- Nouveau mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.newPassword') }}
                  </label>
                  <input
                    v-model="form.newPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :placeholder="$t('security.password.newPasswordPlaceholder')"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    {{ $t('security.password.passwordHint') }}
                  </p>
                </div>

                <!-- Confirmation -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('security.password.confirmPassword') }}
                  </label>
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    required
                    minlength="6"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    :class="{
                      'border-red-300':
                        form.newPassword &&
                        form.confirmPassword &&
                        form.newPassword !== form.confirmPassword
                    }"
                    :placeholder="$t('security.password.confirmPasswordPlaceholder')"
                  />
                  <p
                    v-if="
                      form.newPassword &&
                      form.confirmPassword &&
                      form.newPassword !== form.confirmPassword
                    "
                    class="text-xs text-red-600 mt-1"
                  >
                    {{ $t('security.password.passwordMismatch') }}
                  </p>
                </div>
              </div>

              <!-- Message d'erreur visible (si nécessaire) -->
              <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-start">
                  <svg
                    class="w-5 h-5 text-red-600 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isSubmitting"
                  class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="
                    isSubmitting ||
                    (form.newPassword &&
                      form.confirmPassword &&
                      form.newPassword !== form.confirmPassword)
                  "
                  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{
                    isSubmitting
                      ? $t('security.password.updating')
                      : $t('security.password.updateButton')
                  }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { authApi } from '@/api'

const { t } = useI18n()
const authStore = useAuthStore()
const toastStore = useToastStore()

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const errorMessage = ref('')
const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleClose = () => {
  // Réinitialise le formulaire et les erreurs
  form.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errorMessage.value = ''
  emit('close')
}

const handleSubmit = async () => {
  // Réinitialise le message d'erreur
  errorMessage.value = ''

  // Vérifie que les mots de passe correspondent
  if (form.value.newPassword !== form.value.confirmPassword) {
    const message = t('security.password.passwordMismatch')
    errorMessage.value = message
    toastStore.error(message)
    return
  }

  // Vérifie la longueur minimale
  if (form.value.newPassword.length < 6) {
    const message = t('security.password.passwordTooShort')
    errorMessage.value = message
    toastStore.error(message)
    return
  }

  // Vérifie que le nouveau mot de passe est différent de l'ancien
  if (form.value.newPassword === form.value.currentPassword) {
    const message = t('security.password.samePassword')
    errorMessage.value = message
    toastStore.error(message)
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Utilise l'API layer pour changer le mot de passe
    const result = await authApi.changePassword(
      authStore.user?.email || '',
      form.value.currentPassword,
      form.value.newPassword
    )

    if (!result.success) {
      throw new Error(result.message || t('security.password.changeError'))
    }

    // Succès : réinitialise le formulaire et ferme le modal
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Émet l'événement success avant de fermer
    emit('success')

    // Affiche le toast de succès avec mention de l'email
    toastStore.success(t('security.password.changedSuccess'), {
      timeout: 5000 // 5 secondes pour que l'utilisateur le voie bien
    })

    // Note: Supabase envoie automatiquement un email de confirmation
    // si le template "Password Changed Notification" est activé dans le dashboard

    // Ferme le modal après un court délai pour laisser voir le toast
    setTimeout(() => {
      handleClose()
    }, 100)
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)

    // Gestion des erreurs spécifiques
    let message = error.message || t('security.password.changeError')

    if (error.message?.includes('same')) {
      message = t('security.password.samePassword')
    } else if (error.message?.includes('weak') || error.message?.includes('strength')) {
      message = t('security.password.passwordTooWeak')
    }

    // Affiche le message d'erreur dans le formulaire et dans un toast
    errorMessage.value = message
    toastStore.error(message, {
      timeout: 6000 // 6 secondes pour les erreurs
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
