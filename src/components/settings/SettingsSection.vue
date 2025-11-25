<template>
  <section class="glass-panel rounded-2xl p-6">
    <h2 v-if="title" class="text-lg font-semibold text-white mb-6">{{ title }}</h2>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

