<template>
  <div class="glass-panel rounded-2xl overflow-hidden">
    <div class="px-6 py-5 border-b border-white/10 bg-white/5">
      <h3 class="text-lg font-semibold text-white">{{ $t('reports.table.title') }}</h3>
    </div>

    <div
      class="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      <table class="min-w-full divide-y divide-white/10">
        <thead class="bg-white/5">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.property') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.city') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.rent') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.status') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.totalPaid') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.delayed') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {{ $t('reports.table.columns.occupancy') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-transparent divide-y divide-white/5">
          <tr
            v-for="(row, index) in tableData"
            :key="index"
            class="hover:bg-white/5 transition-colors"
            :class="{ 'bg-white/[0.02]': index % 2 === 0 }"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {{ row.property }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
              {{ row.city }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
              {{ formatCurrency(row.rent) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusClass(row.status)"
              >
                {{ getStatusText(row.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success-700">
              {{ formatCurrency(row.totalPaid) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span v-if="row.delayed > 0" class="text-red-600 font-medium">
                {{ row.delayed }} {{ $t('reports.table.days') }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ row.occupancy }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="tableData.length === 0" class="text-center py-12 text-zinc-400">
      <p>{{ $t('reports.table.noData') }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useLingui'
import { formatCurrency } from '@/utils/formatters'

const { t } = useI18n()

defineProps({
  tableData: {
    type: Array,
    required: true
  }
})

const getStatusClass = status => {
  if (status === 'occupied') return 'bg-success-100 text-success-700'
  if (status === 'vacant') return 'bg-gray-100 text-gray-800'
  return 'bg-warning-100 text-warning-700'
}

const getStatusText = status => {
  if (status === 'occupied') return t('properties.statusLabels.occupied')
  if (status === 'vacant') return t('properties.statusLabels.vacant')
  return t('common.unknown')
}
</script>
