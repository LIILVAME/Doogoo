<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="bg-white rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50"
    >
      <!-- Subtle Gradient background -->
      <div
        :class="[
          'absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700',
          stat.glowColor || 'bg-primary-500/10'
        ]"
      ></div>

      <div class="flex items-center justify-between relative z-10">
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            {{ stat.label }}
          </p>
          <div class="flex items-baseline gap-2">
            <p class="text-2xl font-bold text-zinc-900 tracking-tight">{{ stat.value }}</p>
            <!-- Mock trend if needed or potential stat.trend -->
            <span
              v-if="stat.trend"
              class="text-[10px] font-bold text-emerald-500 flex items-center"
            >
              <svg
                class="w-2.5 h-2.5 mr-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ stat.trend }}
            </span>
          </div>
        </div>
        <div
          :class="[
            'w-10 h-10 rounded-xl transition-all duration-500 group-hover:scale-110 flex-shrink-0 flex items-center justify-center border',
            stat.iconBgColor || 'bg-zinc-50 border-zinc-100 text-zinc-600',
            stat.iconColor ? `${stat.iconColor} border-current/10` : 'border-zinc-100'
          ]"
        >
          <component :is="stat.icon" class="w-5 h-5" />
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
    validator: stats => {
      return stats.every(
        stat => stat.label && stat.value !== undefined && stat.value !== null && stat.icon
      )
    }
  }
})
</script>
