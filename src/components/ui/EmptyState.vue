<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icône style "Scale-up" -->
    <div
      class="mb-6 w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 shadow-inner"
    >
      <i :class="[icon, 'text-3xl']"></i>
    </div>

    <!-- Titre -->
    <h3 v-if="title" class="text-lg font-bold text-zinc-900 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="text-sm text-zinc-500 mb-8 max-w-sm mx-auto leading-relaxed">
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
