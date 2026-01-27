<template>
  <div class="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-zinc-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-zinc-500">{{ description }}</p>
    </div>

    <div class="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
      <BaseChart :type="chartType" :series="series" :options="chartOptions" :show-title="false" />
    </div>
  </div>
</template>

<script setup>
import BaseChart from '@/components/charts/BaseChart.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  series: {
    type: Array,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
})
</script>
