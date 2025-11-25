<template>
  <!-- Skip Link pour navigation clavier -->
  <a href="#onboarding-content" class="skip-link">Aller au formulaire</a>
  
  <div id="onboarding-content" class="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
    <OnboardingWizard />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabaseClient'
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

    // Vérifier si l'utilisateur a déjà des biens
    const { count, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authStore.user.id)

    if (error) {
      console.warn('Erreur vérification onboarding:', error)
      return
    }

    // Si au moins 1 bien → Utilisateur déjà activé → Dashboard
    if (count > 0) {
      router.replace('/dashboard')
    }
  } catch (err) {
    console.error('Erreur check onboarding:', err)
  }
})
</script>
