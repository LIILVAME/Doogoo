<template>
  <div
    ref="tooltipRef"
    class="tooltip-container relative inline-block"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
  >
    <slot />

    <!-- Tooltip -->
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="isVisible"
          :class="[
            'absolute z-[100] px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-nowrap',
            placementClasses,
            arrowClasses
          ]"
          :style="tooltipStyles"
          role="tooltip"
        >
          {{ text }}
          <!-- Flèche -->
          <div
            v-if="showArrow"
            :class="['absolute w-2 h-2 bg-gray-900 transform rotate-45', arrowPosition]"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    default: 'top', // top, bottom, left, right
    validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  delay: {
    type: Number,
    default: 300
  }
})

const tooltipRef = ref(null)
const isVisible = ref(false)
let showTimeout = null

const placementClasses = computed(() => {
  const classes = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
  return classes[props.placement] || classes.top
})

const arrowClasses = computed(() => {
  return {
    top: 'after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:-mt-1 after:border-4 after:border-transparent after:border-t-gray-900',
    bottom:
      'after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:-mb-1 after:border-4 after:border-transparent after:border-b-gray-900',
    left: 'after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 after:-mr-1 after:border-4 after:border-transparent after:border-l-gray-900',
    right:
      'after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:-ml-1 after:border-4 after:border-transparent after:border-r-gray-900'
  }[props.placement]
})

const arrowPosition = computed(() => {
  const positions = {
    top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-full top-1/2 translate-x-1/2 -translate-y-1/2'
  }
  return positions[props.placement] || positions.top
})

const tooltipStyles = computed(() => {
  if (!tooltipRef.value || !isVisible.value) return {}

  const rect = tooltipRef.value.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX

  let top = 0
  let left = 0

  switch (props.placement) {
    case 'top':
      top = rect.top + scrollY - 8
      left = rect.left + scrollX + rect.width / 2
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-50%, -100%)' }
    case 'bottom':
      top = rect.bottom + scrollY + 8
      left = rect.left + scrollX + rect.width / 2
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-50%, 0)' }
    case 'left':
      top = rect.top + scrollY + rect.height / 2
      left = rect.left + scrollX - 8
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(-100%, -50%)' }
    case 'right':
      top = rect.top + scrollY + rect.height / 2
      left = rect.right + scrollX + 8
      return { top: `${top}px`, left: `${left}px`, transform: 'translate(0, -50%)' }
    default:
      return {}
  }
})

const showTooltip = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
  }
  showTimeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hideTooltip = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  isVisible.value = false
}

onUnmounted(() => {
  if (showTimeout) {
    clearTimeout(showTimeout)
  }
})
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.tooltip-enter-from {
  opacity: 0;
  transform: translate(-50%, -8px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
