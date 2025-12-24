<template>
  <div>
    <!-- Skip Link pour navigation clavier -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <div class="flex bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30" style="overflow-y: hidden !important; overflow-x: visible !important; max-width: 100vw; max-height: 100vh; width: 100vw; height: 100vh;">
      <!-- Note: Sidebar width is md:w-20 (80px) for compact mini sidebar -->
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main id="main-content" class="flex-1 w-full relative" style="overflow: hidden !important;">
        <!-- Header Mobile (visible uniquement sur mobile) -->
        <header class="md:hidden sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <router-link
            to="/dashboard"
            class="flex items-center gap-3"
            aria-label="Doogoo - Retour au tableau de bord"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">Doogoo</h1>
          </router-link>
          <div class="flex items-center gap-2">
            <NotificationBell />
            <button
              @click="toggleSidebar"
              class="p-2 bg-zinc-900/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-transform duration-300 ease-in-out"
              :aria-label="isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
              :aria-expanded="isSidebarOpen"
            >
              <svg
                class="w-6 h-6 text-zinc-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="!isSidebarOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>
        
        <!-- Header Desktop (visible uniquement sur desktop) -->
        <header class="hidden md:flex sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 items-center justify-end">
          <NotificationBell />
        </header>
        <!-- Glow effect background -->
        <div class="fixed inset-0 pointer-events-none z-0">
          <div
            class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]"
          ></div>
          <div
            class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"
          ></div>
        </div>

        <div class="relative z-10">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import NotificationBell from '@/components/common/NotificationBell.vue'

// État de la sidebar pour le header mobile
const isSidebarOpen = ref(false)

// Fonction pour basculer la sidebar (sera utilisée par le header mobile)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  // Émet un événement personnalisé pour que la Sidebar écoute
  window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: isSidebarOpen.value }))
}

// Provide pour que la Sidebar puisse mettre à jour l'état
provide('sidebarState', {
  isOpen: isSidebarOpen,
  setOpen: (value) => {
    isSidebarOpen.value = value
  }
})
</script>

<style>
/* Global Glassmorphism Utilities */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-panel-hover:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
