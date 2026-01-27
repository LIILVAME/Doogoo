<template>
  <Teleport to="body">
    <Transition name="command-palette">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
        @click.self="close"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="close" />

        <!-- Command Palette -->
        <div
          ref="paletteRef"
          class="relative w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <svg
              class="w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un bien, locataire ou paiement..."
              class="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-sm"
              @keydown="handleKeydown"
            />
            <kbd
              class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 border border-white/10 rounded"
            >
              <span>Esc</span>
            </kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- Loading -->
            <div v-if="isLoading" class="px-4 py-8 text-center text-zinc-400 text-sm">
              Recherche en cours...
            </div>

            <!-- No results -->
            <div
              v-else-if="!isLoading && searchQuery.trim() && filteredResults.length === 0"
              class="px-4 py-8 text-center text-zinc-400 text-sm"
            >
              Aucun résultat pour "{{ searchQuery }}"
            </div>

            <!-- Results list -->
            <div v-else-if="filteredResults.length > 0" class="py-2">
              <div
                v-for="(result, index) in filteredResults"
                :key="`${result.type}-${result.id}`"
                :ref="el => setResultRef(el, index)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                  'hover:bg-white/5',
                  selectedIndex === index ? 'bg-violet-500/10 border-l-2 border-violet-500' : ''
                ]"
                @click="handleSelect(result)"
                @mouseenter="selectedIndex = index"
              >
                <!-- Icon -->
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    result.type === 'property'
                      ? 'bg-violet-500/10 text-violet-400'
                      : result.type === 'tenant'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                  ]"
                >
                  <component :is="result.icon" class="w-5 h-5" />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <p class="font-medium text-white truncate">{{ result.title }}</p>
                    <span
                      :class="[
                        'px-2 py-0.5 text-xs font-medium rounded',
                        result.type === 'property'
                          ? 'bg-violet-500/20 text-violet-300'
                          : result.type === 'tenant'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                      ]"
                    >
                      {{ result.typeLabel }}
                    </span>
                  </div>
                  <p class="text-sm text-zinc-400 truncate">{{ result.subtitle }}</p>
                </div>

                <!-- Arrow -->
                <svg
                  class="w-4 h-4 text-zinc-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            <!-- Empty state (no search) -->
            <div v-else class="px-4 py-8 text-center text-zinc-400 text-sm space-y-2">
              <p>Tapez pour rechercher...</p>
              <div class="flex items-center justify-center gap-4 mt-4 text-xs">
                <kbd class="px-2 py-1 bg-zinc-800 border border-white/10 rounded">Ctrl+K</kbd>
                <span>ou</span>
                <kbd class="px-2 py-1 bg-zinc-800 border border-white/10 rounded">/</kbd>
                <span>pour ouvrir</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, Users, Wallet } from 'lucide-vue-next'
import { usePropertiesStore } from '@/stores/propertiesStore'
import { usePaymentsStore } from '@/stores/paymentsStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update:isOpen'])

const router = useRouter()
const propertiesStore = usePropertiesStore()
const paymentsStore = usePaymentsStore()

const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref(null)
const paletteRef = ref(null)
const resultRefs = ref([])

const isLoading = computed(() => propertiesStore.loading || paymentsStore.loading)

/**
 * Définit une référence pour un résultat
 */
const setResultRef = (el, index) => {
  if (el) {
    resultRefs.value[index] = el
  }
}

/**
 * Résultats filtrés selon la recherche
 */
const filteredResults = computed(() => {
  if (!searchQuery.value.trim()) {
    return []
  }

  const query = searchQuery.value.toLowerCase()
  const results = []

  // Recherche dans les biens
  const properties = propertiesStore.properties || []
  properties.forEach(property => {
    const matchName = property.name?.toLowerCase().includes(query)
    const matchCity = property.city?.toLowerCase().includes(query)
    const matchAddress = property.address?.toLowerCase().includes(query)

    if (matchName || matchCity || matchAddress) {
      results.push({
        type: 'property',
        typeLabel: 'Bien',
        id: property.id,
        title: property.name,
        subtitle: `${property.city}${property.address ? ` - ${property.address}` : ''}`,
        icon: Building2,
        path: '/biens',
        query: { id: property.id }
      })
    }
  })

  // Recherche dans les locataires (via les biens)
  properties.forEach(property => {
    if (property.tenant) {
      const matchName = property.tenant.name?.toLowerCase().includes(query)
      const matchProperty = property.name?.toLowerCase().includes(query)

      if (matchName || matchProperty) {
        results.push({
          type: 'tenant',
          typeLabel: 'Locataire',
          id: property.tenant.id || property.id,
          title: property.tenant.name,
          subtitle: `Locataire de ${property.name}`,
          icon: Users,
          path: '/locataires',
          query: { search: property.tenant.name }
        })
      }
    }
  })

  // Recherche dans les paiements
  const payments = paymentsStore.payments || []
  payments.forEach(payment => {
    const matchProperty = payment.property?.toLowerCase().includes(query)
    const matchTenant = payment.tenant?.toLowerCase().includes(query)
    const matchAmount = payment.amount?.toString().includes(query)

    if (matchProperty || matchTenant || matchAmount) {
      results.push({
        type: 'payment',
        typeLabel: 'Paiement',
        id: payment.id,
        title: `${payment.property || 'N/A'} - ${payment.tenant || 'N/A'}`,
        subtitle: `${
          payment.amount
            ? new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(payment.amount)
            : 'N/A'
        } - ${payment.dueDate || 'N/A'}`,
        icon: Wallet,
        path: '/paiements',
        query: { id: payment.id }
      })
    }
  })

  return results.slice(0, 10) // Limite à 10 résultats
})

/**
 * Gère la navigation au clavier
 */
const handleKeydown = e => {
  if (e.key === 'Escape') {
    close()
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredResults.value.length - 1)
    scrollToSelected()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    scrollToSelected()
  } else if (e.key === 'Enter' && filteredResults.value[selectedIndex.value]) {
    e.preventDefault()
    handleSelect(filteredResults.value[selectedIndex.value])
  }
}

/**
 * Fait défiler vers l'élément sélectionné
 */
const scrollToSelected = () => {
  nextTick(() => {
    const selectedEl = resultRefs.value[selectedIndex.value]
    if (selectedEl && paletteRef.value) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

/**
 * Gère la sélection d'un résultat
 */
const handleSelect = result => {
  router.push({
    path: result.path,
    query: result.query
  })
  close()
}

/**
 * Ferme la command palette
 */
const close = () => {
  searchQuery.value = ''
  selectedIndex.value = 0
  emit('close')
  emit('update:isOpen', false)
}

/**
 * Gère les raccourcis clavier globaux
 */
const handleGlobalKeydown = e => {
  // Ctrl+K ou / pour ouvrir
  if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.matches('input, textarea'))) {
    e.preventDefault()
    if (!props.isOpen) {
      emit('update:isOpen', true)
    }
  }
}

/**
 * Focus sur l'input quand la palette s'ouvre
 */
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      nextTick(() => {
        inputRef.value?.focus()
        searchQuery.value = ''
        selectedIndex.value = 0
      })
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
/* Transitions */
.command-palette-enter-active,
.command-palette-leave-active {
  transition: opacity 0.2s ease;
}

.command-palette-enter-active .bg-zinc-900,
.command-palette-leave-active .bg-zinc-900 {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}

.command-palette-enter-from .bg-zinc-900,
.command-palette-leave-to .bg-zinc-900 {
  transform: scale(0.95);
  opacity: 0;
}
</style>
