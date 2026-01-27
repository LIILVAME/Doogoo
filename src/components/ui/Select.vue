<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @change="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        class="w-full px-4 py-2 bg-bg-card border rounded-lg transition-all outline-none appearance-none pr-10"
        :class="[
          error
            ? 'border-danger text-danger focus:ring-2 focus:ring-danger focus:border-transparent'
            : 'border-border-strong text-text-primary focus:ring-2 focus:ring-brand focus:border-transparent hover:border-text-muted',
          disabled ? 'opacity-50 cursor-not-allowed bg-bg-subtle' : ''
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <slot />
      </select>

      <!-- Chevron Icon -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-danger">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-text-muted">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substr(2, 9)}`
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const focused = ref(false)
</script>
