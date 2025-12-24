<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="w-full p-6 lg:p-8 xl:p-10">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">🔍 Diagnostic & Monitoring</h1>
        <p class="text-gray-600">Surveillez les performances et les erreurs de l'application</p>
      </div>

      <!-- Section 1: Résumé -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Dernière synchro</div>
          <div class="text-lg font-semibold text-gray-900">
            {{ lastSyncFormatted }}
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Erreurs totales</div>
          <div class="text-lg font-semibold text-red-600">
            {{ diagnosticStore.metrics.apiErrors }}
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Latence moyenne</div>
          <div class="text-lg font-semibold text-gray-900">{{ globalAverageLatency }}ms</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Succès API</div>
          <div class="text-lg font-semibold text-success-700">
            {{ diagnosticStore.metrics.apiSuccess }}
          </div>
        </div>
      </div>

      <!-- Section 2: Filtres et export -->
      <div
        class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200 flex flex-wrap items-center gap-4"
      >
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Filtrer par type:</label>
          <select
            v-model="selectedLogType"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous</option>
            <option value="error">Erreurs</option>
            <option value="warning">Avertissements</option>
            <option value="info">Infos</option>
            <option value="success">Succès</option>
          </select>
        </div>

        <button
          type="button"
          @click="exportDiagnostics"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          📥 Exporter diagnostic
        </button>

        <button
          type="button"
          @click="resetDiagnostics"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          🗑️ Réinitialiser
        </button>
      </div>

      <!-- Section 3: Table des logs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Logs ({{ filteredLogs.length }})</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contexte
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getLogTypeClass(log.type)"
                  >
                    {{ log.type }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ log.message }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  <pre class="text-xs">{{ formatContext(log.context) }}</pre>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ formatDate(log.timestamp) }}
                </td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                  Aucun log à afficher
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 4: Graphique de latence -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Latence moyenne par endpoint</h2>
        <div v-if="latencyChartData.series && latencyChartData.series[0]?.data?.length > 0">
          <BaseChart
            type="bar"
            :series="latencyChartData.series"
            :options="latencyChartOptions"
            :show-title="false"
          />
        </div>
        <div v-else class="text-center text-gray-500 py-8">Aucune donnée de latence disponible</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDiagnosticStore } from '@/stores/diagnosticStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import BaseChart from '@/components/charts/BaseChart.vue'

const diagnosticStore = useDiagnosticStore()
const authStore = useAuthStore()
const router = useRouter()

const selectedLogType = ref('')

// Vérifie que l'utilisateur est autorisé (email admin)
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'

onMounted(() => {
  if (!authStore.user || authStore.user.email !== adminEmail) {
    router.push('/dashboard')
  }
})

// Filtre les logs selon le type sélectionné
const filteredLogs = computed(() => {
  if (!selectedLogType.value) {
    return diagnosticStore.logs
  }
  return diagnosticStore.getLogsByType(selectedLogType.value)
})

// Formatage de la date de dernière synchro
const lastSyncFormatted = computed(() => {
  if (!diagnosticStore.metrics.lastSync) return 'Jamais'
  const date = new Date(diagnosticStore.metrics.lastSync)
  return date.toLocaleString('fr-FR')
})

// Latence moyenne globale
const globalAverageLatency = computed(() => {
  return diagnosticStore.getGlobalAverageLatency()
})

// Données du graphique de latence
const latencyChartData = computed(() => {
  const metricsByEndpoint = diagnosticStore.getMetricsByEndpoint()
  const endpoints = Object.keys(metricsByEndpoint)
  const latencies = endpoints.map(endpoint => metricsByEndpoint[endpoint].avgLatency)

  return {
    series: [
      {
        name: 'Latence moyenne (ms)',
        data: latencies
      }
    ],
    categories: endpoints
  }
})

// Options du graphique de latence
const latencyChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      dataLabels: {
        position: 'right'
      }
    }
  },
  xaxis: {
    categories: latencyChartData.value.categories,
    title: {
      text: 'Latence (ms)'
    }
  },
  yaxis: {
    title: {
      text: 'Endpoint'
    }
  },
  dataLabels: {
    enabled: true,
    formatter: val => `${val}ms`
  },
  colors: ['#6366f1'],
  tooltip: {
    y: {
      formatter: val => `${val}ms`
    }
  }
}))

// Style pour les types de logs
const getLogTypeClass = type => {
  const classes = {
    error: 'bg-danger-100 text-danger-700',
    warning: 'bg-warning-100 text-warning-700',
    info: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

// Formatage du contexte
const formatContext = context => {
  if (!context || Object.keys(context).length === 0) return '-'
  return JSON.stringify(context, null, 2)
}

// Formatage de la date
const formatDate = timestamp => {
  const date = new Date(timestamp)
  return date.toLocaleString('fr-FR')
}

// Export des diagnostics
const exportDiagnostics = () => {
  const diagnostics = diagnosticStore.exportDiagnostics()
  const dataStr = JSON.stringify(diagnostics, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `doogoo-diagnostics-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// Réinitialisation des diagnostics
const resetDiagnostics = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les diagnostics ?')) {
    diagnosticStore.reset()
  }
}
</script>
