<template>
  <div>
    <h2 v-if="showTitle" class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h2>
    <div v-if="loading" class="flex items-center justify-center h-[300px]">
      <InlineLoader />
    </div>
    <div v-else-if="!isMounted" class="flex items-center justify-center h-[300px]">
      <InlineLoader />
    </div>
    <div v-else ref="chartElement" class="chart-container">
      <Suspense>
        <component
          :is="VueApexCharts"
          :key="chartKey"
          :type="chartType"
          :height="height"
          :options="chartOptions"
          :series="normalizedSeries"
        />
        <template #fallback>
          <div class="flex items-center justify-center h-full">
            <InlineLoader />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, defineAsyncComponent } from 'vue'
import InlineLoader from '@/components/common/InlineLoader.vue'

// Lazy load ApexCharts pour améliorer les performances initiales
// Chargé uniquement quand le composant BaseChart est monté
const VueApexCharts = defineAsyncComponent(() =>
  import('vue3-apexcharts').then(module => module.default)
)

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'bar'
  },
  height: {
    type: [String, Number],
    default: 300
  },
  options: {
    type: Object,
    default: () => ({})
  },
  series: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const isMounted = ref(false)
const chartKey = ref(0)
const chartElement = ref(null)

onMounted(() => {
  // Attend que le DOM soit complètement rendu avant d'afficher le graphique
  // Utilise requestAnimationFrame pour s'assurer que le navigateur a fini de peindre
  requestAnimationFrame(() => {
    setTimeout(() => {
      isMounted.value = true
      chartKey.value++
    }, 200)
  })
})

// Normalise les séries pour ApexCharts (évite les erreurs de format)
const normalizedSeries = computed(() => {
  if (!props.series || props.series.length === 0) {
    return props.type === 'pie' || props.type === 'donut' || props.type === 'radialBar' ? [] : []
  }

  // Si c'est un graphique en donut/pie, les séries doivent être un tableau de nombres
  if (props.type === 'pie' || props.type === 'donut' || props.type === 'radialBar') {
    // Vérifie si c'est déjà un tableau de nombres
    if (
      Array.isArray(props.series) &&
      props.series.length > 0 &&
      typeof props.series[0] === 'number'
    ) {
      // S'assure que tous les nombres sont valides
      return props.series.map(val => {
        const num = Number(val)
        return isNaN(num) ? 0 : num
      })
    }
    // Sinon, extrait les valeurs d'un tableau d'objets
    if (
      Array.isArray(props.series) &&
      props.series.length > 0 &&
      typeof props.series[0] === 'object'
    ) {
      return props.series.map(s => {
        if (typeof s === 'object' && s !== null) {
          const val = s.value !== undefined ? s.value : s.data !== undefined ? s.data : 0
          const num = Number(val)
          return isNaN(num) ? 0 : num
        }
        const num = Number(s)
        return isNaN(num) ? 0 : num
      })
    }
    // Fallback : convertit en nombres
    return props.series.map(val => {
      const num = Number(val)
      return isNaN(num) ? 0 : num
    })
  }

  // Pour les autres types de graphiques (bar, line, area, etc.)
  // Les séries doivent être un tableau d'objets avec { name: string, data: number[] }
  return props.series.map(serie => {
    // Si c'est déjà un objet avec data
    if (typeof serie === 'object' && serie !== null && serie.data) {
      // Vérifie que les données sont bien formatées (tableau de nombres)
      const normalizedData = Array.isArray(serie.data)
        ? serie.data.map(item => {
            if (typeof item === 'number') {
              return isNaN(item) ? 0 : item
            }
            if (typeof item === 'object' && item !== null) {
              const val = item.y !== undefined ? item.y : item.value !== undefined ? item.value : 0
              const num = Number(val)
              return isNaN(num) ? 0 : num
            }
            const num = Number(item)
            return isNaN(num) ? 0 : num
          })
        : []

      return {
        name: serie.name || 'Série',
        data: normalizedData
      }
    }

    // Si c'est juste un tableau de nombres, le convertir en format série
    if (Array.isArray(serie)) {
      return {
        name: 'Série',
        data: serie.map(item => {
          const num = Number(item)
          return isNaN(num) ? 0 : num
        })
      }
    }

    // Fallback
    return serie
  })
})

const chartType = computed(() => props.type)

// Force la re-rendu si les séries changent
watch(
  () => props.series,
  () => {
    if (isMounted.value) {
      chartKey.value++
    }
  },
  { deep: true }
)

const chartOptions = computed(() => {
  const defaultOptions = {
    chart: {
      type: props.type,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: val => {
          if (props.type === 'pie' || props.type === 'donut' || props.type === 'radialBar') {
            return `${val}%`
          }
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(val)
        }
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: val => {
          if (props.type === 'radialBar') {
            return `${val}%`
          }
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            notation: 'compact',
            maximumFractionDigits: 0
          }).format(val)
        }
      }
    }
  }

  // Merge avec les options personnalisées
  return {
    ...defaultOptions,
    ...props.options
  }
})
</script>
