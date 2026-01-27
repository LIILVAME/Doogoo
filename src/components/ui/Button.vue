<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 flex-shrink-0"
      :class="spinnerSizeClasses[size]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Slot for content -->
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { hapticMedium } from '@/composables/useHapticFeedback'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'ghost', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

/**
 * Classes de base pour tous les boutons
 */
const baseClasses = [
  'inline-flex items-center justify-center',
  'font-medium rounded-full',
  'transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
]

/**
 * Classes par variant
 */
const variantClasses = {
  primary: [
    'bg-brand hover:bg-brand-hover active:bg-violet-800',
    'text-white',
    'shadow-sm hover:shadow-md',
    'hover:scale-[1.02]',
    'focus-visible:ring-brand'
  ],
  secondary: [
    'border-2 border-brand',
    'bg-transparent hover:bg-brand-50',
    'text-brand hover:text-brand-hover',
    'focus-visible:ring-brand'
  ],
  ghost: [
    'bg-transparent hover:bg-brand-50',
    'text-brand hover:text-brand-hover',
    'focus-visible:ring-brand'
  ],
  danger: [
    'bg-danger hover:bg-danger-600 active:bg-danger-700',
    'text-white',
    'shadow-sm hover:shadow-md',
    'hover:scale-[1.02]',
    'focus-visible:ring-danger'
  ]
}

/**
 * Classes par taille
 */
const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg'
}

/**
 * Classes spinner par taille
 */
const spinnerSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

/**
 * Computed final classes
 */
const buttonClasses = computed(() => [
  ...baseClasses,
  ...variantClasses[props.variant],
  sizeClasses[props.size],
  props.fullWidth ? 'w-full' : ''
])

/**
 * Handle click event avec haptic feedback
 */
const handleClick = event => {
  if (props.type !== 'submit' && !props.disabled && !props.loading) {
    // Haptic feedback sur mobile
    hapticMedium()
    emit('click', event)
  }
}
</script>
