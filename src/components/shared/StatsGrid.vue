<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
    >
      <!-- Glow effect background -->
      <div
        :class="[
          'absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500',
          stat.glowColor || 'bg-violet-500/10 group-hover:bg-violet-500/20'
        ]"
      ></div>

      <div class="flex items-center justify-between relative z-10 min-h-[60px]">
        <div class="min-w-0 flex-1 pr-3">
          <p class="text-sm font-medium text-zinc-400 mb-1 truncate">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-white tracking-tight truncate">{{ stat.value }}</p>
        </div>
        <div
          :class="[
            'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg flex-shrink-0 flex items-center justify-center',
            stat.iconBgColor || 'bg-violet-500/10',
            stat.iconColor || 'text-violet-200'
          ]"
        >
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
    validator: (stats) => {
      return stats.every(
        stat =>
          stat.label &&
          (stat.value !== undefined && stat.value !== null) &&
          stat.icon
      )
    }
  }
})
</script>
