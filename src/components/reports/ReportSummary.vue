<template>
  <div class="glass-panel rounded-2xl p-6 mt-6">
    <div class="flex items-start gap-4">
      <!-- Icône -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <!-- Texte de synthèse -->
      <div class="flex-1">
        <p class="text-zinc-300 text-sm leading-relaxed">
          {{ summaryText }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 flex gap-2">
        <button
          @click="$emit('export-pdf')"
          :disabled="loading"
          class="px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $t('reports.actions.exportPDF') }}
        </button>
        
        <button
          @click="$emit('send-email')"
          :disabled="true"
          class="px-4 py-2.5 bg-white/5 border border-white/10 text-zinc-400 rounded-xl cursor-not-allowed text-sm font-medium flex items-center gap-2 opacity-50 hover:bg-white/10 transition-colors"
          :title="$t('reports.actions.comingSoon')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ $t('reports.actions.sendEmail') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'
import { formatCurrency, formatDate } from '@/utils/formatters'

const { t } = useI18n()

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  },
  period: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['export-pdf', 'send-email'])

const summaryText = computed(() => {
  const startDate = formatDate(props.period.startDate, { day: '2-digit', month: '2-digit', year: 'numeric' })
  const endDate = formatDate(props.period.endDate, { day: '2-digit', month: '2-digit', year: 'numeric' })
  const revenue = formatCurrency(props.statistics.totalRevenue || 0)
  const occupancy = props.statistics.occupancyRate || 0

  return t('reports.summary.text', {
    startDate,
    endDate,
    revenue,
    occupancy
  })
})
</script>

