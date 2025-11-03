<template>
  <AuthLayout>
    <div class="text-center">
      <!-- Icône de succès -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <!-- Titre -->
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
        {{ $t('auth.confirm.title') }}
      </h2>

      <!-- Message -->
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        {{ $t('auth.confirm.message') }}
      </p>

      <!-- Bouton vers la connexion ou le dashboard -->
      <AuthButton
        :label="authStore.user ? $t('common.goToDashboard') : $t('auth.confirm.cta')"
        @click="authStore.user ? $router.push('/dashboard') : $router.push('/login')"
      />
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

const authStore = useAuthStore()

// Charge le profil si l'utilisateur est connecté
onMounted(async () => {
  if (authStore.user && !authStore.profile) {
    try {
      await authStore.fetchProfile()
    } catch (err) {
      console.warn('Impossible de charger le profil:', err)
    }
  }

  // Si l'utilisateur est connecté et a un profil, on peut le rediriger vers le dashboard
  // après quelques secondes (ou lui laisser cliquer sur le bouton)
  if (authStore.user && authStore.profile) {
    // Optionnel : auto-redirection après 3 secondes
    // setTimeout(() => {
    //   router.push('/dashboard')
    // }, 3000)
  }
})
</script>
