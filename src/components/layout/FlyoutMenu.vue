<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-[-8px]"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-[-8px]"
    >
      <div
        v-if="isVisible && items.length > 0"
        ref="flyoutRef"
        :style="flyoutStyle"
        class="fixed z-[60] pointer-events-auto"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- Zone de liaison invisible (pont entre icône et modale) -->
        <div
          v-if="bridgeZone"
          :style="bridgeZoneStyle"
          class="absolute pointer-events-auto"
          @mouseenter="handleMouseEnter"
        ></div>

        <!-- Modale flottante -->
        <div
          class="bg-white rounded-xl shadow-xl border border-zinc-100 min-w-[220px] py-2 overflow-hidden"
        >
          <router-link
            v-for="item in items"
            :key="item.id"
            :to="item.path"
            @click="handleItemClick"
            class="block px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-200 cursor-pointer rounded-lg mx-1 relative group/item"
          >
            <div class="flex items-center gap-3">
              <!-- Icône (si disponible) -->
              <i
                v-if="item.icon"
                :class="[
                  item.icon,
                  'text-base text-zinc-400 group-hover/item:text-primary-600 transition-colors duration-200'
                ]"
              ></i>
              <!-- Texte -->
              <span class="group-hover/item:text-primary-700 transition-colors duration-200 flex-1">
                {{ item.label }}
              </span>
            </div>

            <!-- Indicateur hover (barre verticale à gauche) -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
            ></div>
          </router-link>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  iconPosition: {
    type: Object,
    default: () => ({ top: 0, left: 0 })
  },
  sidebarWidth: {
    type: Number,
    default: 80 // md:w-20 = 80px
  },
  bridgeZone: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'item-click'])

const flyoutRef = ref(null)
const isHovered = ref(false)
let hoverTimeout = null
let closeTimeout = null

const flyoutStyle = computed(() => {
  const gap = 8 // 8px entre sidebar et modale
  const left = props.sidebarWidth + gap

  return {
    left: `${left}px`,
    top: `${props.iconPosition.top}px`,
    transform: 'translateY(-50%)' // Centre verticalement par rapport à l'icône
  }
})

const bridgeZoneStyle = computed(() => {
  // Zone invisible de liaison entre l'icône et la modale
  // Positionnée à gauche de la modale pour combler l'espace
  return {
    left: `-${props.sidebarWidth + 4}px`,
    top: '-50%',
    width: `${props.sidebarWidth + 4}px`,
    height: '200%',
    cursor: 'default',
    pointerEvents: 'auto'
  }
})

const handleMouseEnter = () => {
  // Annule toute fermeture programmée
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
  // Délai avant fermeture pour permettre le retour de la souris
  closeTimeout = setTimeout(() => {
    if (!isHovered.value) {
      emit('close')
    }
  }, 150)
}

const handleItemClick = () => {
  emit('item-click')
  emit('close')
}

// Nettoie les timeouts au démontage
onUnmounted(() => {
  if (hoverTimeout) clearTimeout(hoverTimeout)
  if (closeTimeout) clearTimeout(closeTimeout)
})

// Surveille la visibilité pour nettoyer les timeouts
watch(
  () => props.isVisible,
  newVal => {
    if (!newVal) {
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      isHovered.value = false
    }
  }
)
</script>

<style scoped>
/* Assure que la modale est au-dessus de tout */
.fixed {
  z-index: 60;
}
</style>
