<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'w-full font-semibold rounded-xl px-4 py-3.5 text-sm sm:text-base',
      'flex items-center justify-center transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'primary'
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg'
        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-300 hover:-translate-y-0.5 disabled:hover:translate-y-0'
    ]"
    @click="handleClick"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
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
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

/**
 * Gère le clic sur le bouton
 * Pour les boutons de type submit, on ne fait rien car le formulaire gère la soumission
 * Pour les autres types, on émet l'événement click
 */
const handleClick = event => {
  // Si c'est un bouton submit, on laisse le formulaire gérer la soumission naturellement
  // Le formulaire utilise @submit.prevent pour gérer la soumission
  if (props.type !== 'submit') {
    emit('click', event)
  }
  // Pour les boutons submit, on ne fait rien - le formulaire déclenchera @submit
}
</script>
