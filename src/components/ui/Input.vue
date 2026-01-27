<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="relative">
      <!-- Icon Slot -->
      <div
        v-if="$slots.icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors pointer-events-none"
        :class="{ 'text-danger': error, 'text-brand': focused }"
      >
        <slot name="icon" />
      </div>

      <input
        :id="id"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
        class="w-full px-4 py-2 bg-bg-card border rounded-lg transition-all outline-none"
        :class="[
          $slots.icon ? 'pl-10' : '',
          error
            ? 'border-danger text-danger focus:ring-2 focus:ring-danger focus:border-transparent'
            : 'border-border-strong text-text-primary focus:ring-2 focus:ring-brand focus:border-transparent placeholder-text-muted hover:border-text-muted',
          disabled ? 'opacity-50 cursor-not-allowed bg-bg-subtle' : ''
        ]"
      />
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
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  type: {
    type: String,
    default: 'text'
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

const inputRef = ref(null)
const focused = ref(false)

defineExpose({ focus: () => inputRef.value?.focus() })
</script>
