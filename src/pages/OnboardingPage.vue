<template>
  <!-- Skip Link pour navigation clavier -->
  <a href="#onboarding-content" class="skip-link">Aller au formulaire</a>

  <div
    id="onboarding-content"
    class="min-h-screen bg-zinc-950 flex items-center justify-center p-6"
  >
    <OnboardingWizard />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard.vue'

const router = useRouter()
const authStore = useAuthStore()

/**
 * Vérifie si l'utilisateur a déjà complété l'onboarding
 * Si oui, redirige vers dashboard
 */
onMounted(async () => {
  try {
    if (!authStore.user) {
      router.replace('/login')
      return
    }

    // Vérifier si l'utilisateur a déjà des biens via l'API layer
    const result = await authApi.checkUserHasProperties(authStore.user.id)

    if (!result.success) {
      console.warn('Erreur vérification onboarding:', result.message)
      return
    }

    // Si au moins 1 bien → Utilisateur déjà activé → Dashboard
    if (result.data.count > 0) {
      router.replace('/dashboard')
    }
  } catch (err) {
    console.error('Erreur check onboarding:', err)
  }
})
</script>
