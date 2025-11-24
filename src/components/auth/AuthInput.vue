<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-zinc-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete || undefined"
      :class="[
        'w-full border rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-zinc-500',
        'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none',
        'transition-all duration-200 ease-in-out',
        'hover:border-white/20 focus:shadow-sm focus:shadow-violet-500/10',
        error
          ? 'border-rose-500/50 bg-rose-500/10 focus:ring-rose-500/50 focus:border-rose-500'
          : 'border-white/10 bg-white/5',
        disabled ? 'bg-zinc-800 cursor-not-allowed opacity-60' : ''
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    />
    <transition name="slide-fade">
      <p v-if="error" class="mt-2 text-sm text-rose-400 flex items-start">
        <svg class="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        {{ error }}
      </p>
    </transition>
    <p v-if="hint && !error" class="mt-1 text-xs text-zinc-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
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
  autocomplete: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => `auth-input-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
