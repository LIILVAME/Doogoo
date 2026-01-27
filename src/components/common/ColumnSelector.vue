<template>
  <div class="relative">
    <!-- Bouton trigger -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-colors"
      :aria-label="$t('common.selectColumns') || 'Sélectionner les colonnes'"
      :aria-expanded="isOpen"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <span class="text-sm font-medium hidden sm:inline">
        {{ $t('common.columns') || 'Colonnes' }}
      </span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
        @click.stop
      >
        <div class="p-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white">
              {{ $t('common.selectColumns') || 'Sélectionner les colonnes' }}
            </h3>
            <button
              @click="handleReset"
              class="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              {{ $t('common.reset') || 'Réinitialiser' }}
            </button>
          </div>

          <!-- Liste des colonnes -->
          <div class="space-y-2">
            <label
              v-for="column in allColumns"
              :key="column.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="column.visible"
                @change="handleToggle(column.id, $event.target.checked)"
                class="w-4 h-4 rounded border-white/20 bg-zinc-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-zinc-900"
              />
              <span class="flex-1 text-sm text-zinc-300">{{ column.label }}</span>
              <!-- Boutons de réorganisation -->
              <div class="flex items-center gap-1">
                <button
                  @click.stop="handleMove(column.id, 'up')"
                  :disabled="isFirst(column.id)"
                  class="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  :aria-label="$t('common.moveUp') || 'Déplacer vers le haut'"
                >
                  <svg
                    class="w-3 h-3 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  @click.stop="handleMove(column.id, 'down')"
                  :disabled="isLast(column.id)"
                  class="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  :aria-label="$t('common.moveDown') || 'Déplacer vers le bas'"
                >
                  <svg
                    class="w-3 h-3 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </label>
          </div>

          <!-- Footer avec statistiques -->
          <div class="mt-4 pt-4 border-t border-white/10">
            <p class="text-xs text-zinc-400 text-center">
              {{ visibleCount }} / {{ allColumns.length }}
              {{ $t('common.columnsVisible') || 'colonnes visibles' }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /**
   * Composable useTablePreferences avec colonnes et méthodes
   */
  preferences: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const isOpen = ref(false)
const dropdownRef = ref(null)

/**
 * Colonnes depuis le composable
 */
const allColumns = computed(() => props.preferences.allColumns || [])
const visibleCount = computed(() => props.preferences.visibleColumns?.length || 0)

/**
 * Vérifie si une colonne est la première
 */
const isFirst = columnId => {
  const index = allColumns.value.findIndex(col => col.id === columnId)
  return index === 0
}

/**
 * Vérifie si une colonne est la dernière
 */
const isLast = columnId => {
  const index = allColumns.value.findIndex(col => col.id === columnId)
  return index === allColumns.value.length - 1
}

/**
 * Gère le toggle de visibilité
 */
const handleToggle = (columnId, visible) => {
  props.preferences.setColumnVisibility(columnId, visible)
  emit('update')
}

/**
 * Gère le déplacement d'une colonne
 */
const handleMove = (columnId, direction) => {
  props.preferences.moveColumn(columnId, direction)
  emit('update')
}

/**
 * Réinitialise les préférences
 */
const handleReset = () => {
  props.preferences.resetPreferences()
  emit('update')
}

/**
 * Ferme le dropdown si on clique en dehors
 */
const handleClickOutside = event => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animation dropdown */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Respecte prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    transform: none;
  }
}
</style>
