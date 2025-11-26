<template>
  <div
    class="glass-panel rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1"
    :title="tooltip"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <div
            :class="[
              'p-2.5 rounded-xl mr-3 flex-shrink-0',
              iconBgColor || 'bg-success-100 border border-success-500/20'
            ]"
          >
            <!-- Icône Currency/Money -->
            <svg
              v-if="icon === 'currency' || icon === 'money'"
              :class="['w-5 h-5', iconColor || 'text-success-500']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Icône Home -->
            <svg
              v-else-if="icon === 'home'"
              :class="['w-5 h-5', iconColor || 'text-violet-400']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>

            <!-- Icône Clock -->
            <svg
              v-else-if="icon === 'clock'"
              :class="['w-5 h-5', iconColor || 'text-rose-400']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <!-- Icône Chart -->
            <svg
              v-else-if="icon === 'chart'"
              :class="['w-5 h-5', iconColor || 'text-purple-500']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p class="text-sm text-zinc-300 font-medium">{{ label }}</p>
        </div>
        <p :class="['text-xl sm:text-2xl font-bold', valueColor || 'text-white']">
          {{ displayValue }}
        </p>
        <p v-if="subtitle" class="text-xs text-zinc-500 mt-1">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    default: 'money'
  },
  iconColor: {
    type: String,
    default: 'text-success-500'
  },
  iconBgColor: {
    type: String,
    default: 'bg-success-100'
  },
  valueColor: {
    type: String,
    default: 'text-white'
  },
  formatter: {
    type: Function,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  tooltip: {
    type: String,
    default: null
  }
})

const displayValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value)
  }
  return props.value
})
</script>
