<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icône -->
    <div class="mb-4">
      <i :class="[icon, 'text-6xl text-gray-400/50']"></i>
    </div>

    <!-- Titre -->
    <h3 v-if="title" class="text-lg font-semibold text-white mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="text-sm text-gray-400 mb-6 max-w-md mx-auto">
      {{ description }}
    </p>

    <!-- Action (slot) -->
    <div v-if="$slots.action" class="flex items-center justify-center">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'ri-inbox-line'
  }
})
</script>
