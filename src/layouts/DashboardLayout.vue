<template>
  <div>
    <!-- Skip Link pour navigation clavier -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <div
      class="flex bg-zinc-50 text-zinc-900 font-sans selection:bg-primary-500/30 h-screen overflow-hidden"
    >
      <!-- Note: Sidebar width is md:w-20 (80px) for compact mini sidebar -->
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main id="main-content" class="flex-1 w-full relative overflow-y-auto">
        <!-- Header Mobile (visible uniquement sur mobile) -->
        <header
          class="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-4 py-3 flex items-center justify-between"
        >
          <router-link
            to="/dashboard"
            class="flex items-center gap-3"
            aria-label="Doogoo - Retour au tableau de bord"
          >
            <div
              class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
            >
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-zinc-900 tracking-tight">Doogoo</h1>
          </router-link>
          <div class="flex items-center gap-2">
            <NotificationBell />
            <button
              @click="toggleSidebar"
              class="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-zinc-200 transition-transform duration-300 ease-in-out"
              :aria-label="isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
              :aria-expanded="isSidebarOpen"
            >
              <svg
                class="w-6 h-6 text-zinc-700"
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
        <header
          class="hidden md:flex sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-6 py-4 items-center justify-end"
        >
          <NotificationBell />
        </header>
        <!-- Glow effect background -->
        <div class="fixed inset-0 pointer-events-none z-0">
          <div
            class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px]"
          ></div>
          <div
            class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"
          ></div>
        </div>

        <div class="relative z-10">
          <slot />
        </div>
      </main>

      <!-- Bottom Navigation (Mobile only) -->
      <BottomNavigation />

      <!-- Command Palette -->
      <CommandPalette
        :is-open="isCommandPaletteOpen"
        @update:is-open="isCommandPaletteOpen = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import NotificationBell from '@/components/common/NotificationBell.vue'
import CommandPalette from '@/components/common/CommandPalette.vue'

// État de la sidebar pour le header mobile
const isSidebarOpen = ref(false)

// État de la command palette
const isCommandPaletteOpen = ref(false)

// Fonction pour basculer la sidebar (sera utilisée par le header mobile)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  // Émet un événement personnalisé pour que la Sidebar écoute
  window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: isSidebarOpen.value }))
}

// Provide pour que la Sidebar puisse mettre à jour l'état
provide('sidebarState', {
  isOpen: isSidebarOpen,
  setOpen: value => {
    isSidebarOpen.value = value
  }
})
</script>

<style>
/* Global Glassmorphism Utilities - Light Mode */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.glass-panel-hover:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.02);
}
</style>
