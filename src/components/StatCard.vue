<template>
  <div class="glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 group relative overflow-hidden">
    <!-- Glow effect on hover -->
    <div class="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500"></div>

    <div v-if="loading" class="flex items-center justify-between relative z-10 animate-pulse">
      <div>
        <div class="h-4 w-24 bg-white/10 rounded mb-2"></div>
        <div class="h-8 w-16 bg-white/10 rounded"></div>
      </div>
      <div class="w-12 h-12 rounded-xl bg-white/10"></div>
    </div>

    <div v-else class="flex items-center justify-between relative z-10">
      <div>
        <p class="text-sm font-medium text-zinc-400 mb-1">{{ label }}</p>
        <p class="text-2xl font-bold text-white tracking-tight">{{ value }}</p>
      </div>
      <div
        :class="[
          'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-lg',
          iconBgClass ? iconBgClass.replace('bg-', 'bg-opacity-10 bg-') : 'bg-white/5',
          iconColorClass || 'text-white'
        ]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  iconBgClass: {
    type: String,
    default: ''
  },
  iconColorClass: {
    type: String,
    default: 'text-green-600'
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

