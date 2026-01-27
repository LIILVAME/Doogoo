<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-zinc-100 safe-bottom shadow-lg shadow-zinc-200/50"
    aria-label="Navigation principale"
  >
    <div class="flex items-center justify-around h-16 px-2">
      <router-link
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :aria-label="item.label"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-all duration-200',
          isActive(item.path) ? 'text-primary-600' : 'text-zinc-400 hover:text-zinc-600'
        ]"
        @click="handleClick"
      >
        <!-- Icône -->
        <div class="relative flex items-center justify-center">
          <component
            :is="item.icon"
            class="w-6 h-6 transition-transform duration-200"
            :class="isActive(item.path) ? 'scale-110' : ''"
          />
          <!-- Badge de notification -->
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-semibold rounded-full ring-2 ring-white"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </div>
        <!-- Label -->
        <span class="text-[10px] font-medium truncate max-w-[60px]">
          {{ item.label }}
        </span>
        <!-- Indicateur actif (optionnel, peut-être redondant avec la couleur) -->
        <div
          v-if="isActive(item.path)"
          class="absolute bottom-1 w-1 h-1 bg-primary-600 rounded-full"
        ></div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, Building2, Users, Wallet, Settings } from 'lucide-vue-next'
import { usePaymentsStore } from '@/stores/paymentsStore'

const route = useRoute()
const paymentsStore = usePaymentsStore()

/**
 * Vérifie si une route est active
 */
const isActive = path => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

/**
 * Gère le clic sur un item de navigation
 */
const handleClick = () => {
  // Scroll vers le haut si on est déjà sur la page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Items de navigation avec icônes et badges
 */
const navigationItems = computed(() => {
  // Compte les paiements en retard pour le badge
  const latePaymentsCount = (paymentsStore.payments || []).filter(p => p.status === 'late').length

  return [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/biens',
      label: 'Biens',
      icon: Building2
    },
    {
      path: '/locataires',
      label: 'Locataires',
      icon: Users
    },
    {
      path: '/paiements',
      label: 'Paiements',
      icon: Wallet,
      badge: latePaymentsCount > 0 ? latePaymentsCount : null
    },
    {
      path: '/parametres',
      label: 'Paramètres',
      icon: Settings
    }
  ]
})
</script>

<style scoped>
/* Animation pour l'indicateur actif */
.router-link-active {
  position: relative;
}

/* Haptic feedback sur mobile (si supporté) */
@media (hover: none) and (pointer: coarse) {
  .router-link-active:active {
    transform: scale(0.95);
  }
}
</style>
