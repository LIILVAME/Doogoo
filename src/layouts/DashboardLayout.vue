<template>
  <div>
    <!-- Skip Link pour navigation clavier -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <div class="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main id="main-content" class="flex-1 overflow-y-auto relative">
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
import Sidebar from '@/components/Sidebar.vue'
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
