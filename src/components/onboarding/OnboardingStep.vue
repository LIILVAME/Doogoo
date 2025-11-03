<template>
  <Teleport to="body">
    <Transition name="onboarding">
      <div v-if="isVisible" class="fixed inset-0 z-[9999] pointer-events-none">
        <!-- Overlay sombre -->
        <div
          class="absolute inset-0 bg-black/60 transition-opacity"
          :style="overlayStyle"
          @click="onOverlayClick"
        />

        <!-- Tooltip de l'étape -->
        <div
          v-if="step"
          ref="tooltipRef"
          class="absolute z-[10000] pointer-events-auto bg-white rounded-xl shadow-2xl p-6 max-w-sm"
          :style="tooltipStyle"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span
                  class="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary-600 rounded-full"
                >
                  {{ stepIndex + 1 }}
                </span>
                <h3 class="text-lg font-bold text-gray-900">{{ step.title }}</h3>
              </div>
            </div>
            <button
              @click="dismiss"
              class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              :aria-label="$t('onboarding.skip') || 'Passer'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <p class="text-gray-700 mb-6 leading-relaxed">{{ step.content }}</p>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-3">
            <button
              v-if="hasPrevious"
              @click="previous"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {{ $t('onboarding.previous') || 'Précédent' }}
            </button>
            <div v-else></div>

            <div class="flex items-center gap-2">
              <button
                v-if="!hasNext"
                @click="complete"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                {{ $t('onboarding.finish') || 'Terminer' }}
              </button>
              <button
                v-else
                @click="next"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                {{ $t('onboarding.next') || 'Suivant' }}
              </button>
            </div>
          </div>

          <!-- Progress dots -->
          <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-1.5">
            <span
              v-for="(s, index) in totalSteps"
              :key="s.id"
              class="w-1.5 h-1.5 rounded-full transition-colors"
              :class="index <= stepIndex ? 'bg-primary-600' : 'bg-gray-300'"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  step: {
    type: Object,
    default: null
  },
  stepIndex: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Array,
    default: () => []
  },
  hasNext: {
    type: Boolean,
    default: false
  },
  hasPrevious: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['next', 'previous', 'complete', 'dismiss'])

const tooltipRef = ref(null)
const isVisible = ref(false)
const targetElement = ref(null)

/**
 * Calcule la position du tooltip par rapport à l'élément cible
 */
const tooltipStyle = computed(() => {
  if (!targetElement.value || !props.step) return {}

  const rect = targetElement.value.getBoundingClientRect()
  const placement = props.step.placement || 'bottom'
  const offset = 16

  let top = 0
  let left = 0

  switch (placement) {
    case 'top':
      top = rect.top - offset
      left = rect.left + rect.width / 2
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(-50%, -100%)'
      }
    case 'bottom':
      top = rect.bottom + offset
      left = rect.left + rect.width / 2
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(-50%, 0)'
      }
    case 'left':
      top = rect.top + rect.height / 2
      left = rect.left - offset
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(-100%, -50%)'
      }
    case 'right':
      top = rect.top + rect.height / 2
      left = rect.right + offset
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translate(0, -50%)'
      }
    default:
      return {}
  }
})

/**
 * Calcule le style de l'overlay pour mettre en évidence l'élément cible
 */
const overlayStyle = computed(() => {
  if (!targetElement.value || !props.step) return {}

  const rect = targetElement.value.getBoundingClientRect()
  const padding = 8

  // Crée un "trou" dans l'overlay pour l'élément cible
  const maskImage = `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent ${Math.max(rect.width, rect.height) / 2 + padding}px, black ${Math.max(rect.width, rect.height) / 2 + padding + 8}px)`

  return {
    maskImage,
    WebkitMaskImage: maskImage
  }
})

/**
 * Trouve l'élément cible via son sélecteur
 */
const findTarget = async () => {
  if (!props.step?.target) {
    targetElement.value = null
    isVisible.value = false
    return
  }

  await nextTick()

  // Recherche par ID, classe, ou data attribute
  let element = null

  if (props.step.target.startsWith('#')) {
    element = document.querySelector(props.step.target)
  } else if (props.step.target.startsWith('.')) {
    element = document.querySelector(props.step.target)
  } else if (props.step.target.startsWith('[data-')) {
    element = document.querySelector(props.step.target)
  } else {
    // Assume c'est un ID sans le #
    element =
      document.getElementById(props.step.target) ||
      document.querySelector(`[data-onboarding="${props.step.target}"]`)
  }

  if (element) {
    targetElement.value = element

    // Ajoute une classe pour le highlight
    element.classList.add('onboarding-highlight')

    // Scroll pour s'assurer que l'élément est visible
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

    // Attend le scroll avant d'afficher
    setTimeout(() => {
      isVisible.value = true
    }, 300)
  } else {
    // Si l'élément n'existe pas, on passe à l'étape suivante
    if (import.meta.env.DEV) {
      console.warn(`⚠️ Onboarding target not found: ${props.step.target}`)
    }
    isVisible.value = false
    if (props.hasNext) {
      emit('next')
    } else {
      emit('complete')
    }
  }
}

/**
 * Nettoie les classes ajoutées
 */
const cleanup = () => {
  if (targetElement.value) {
    targetElement.value.classList.remove('onboarding-highlight')
  }
}

const next = () => {
  cleanup()
  emit('next')
}

const previous = () => {
  cleanup()
  emit('previous')
}

const complete = () => {
  cleanup()
  emit('complete')
}

const dismiss = () => {
  cleanup()
  emit('dismiss')
}

const onOverlayClick = () => {
  // Ne fait rien si on clique sur l'overlay (l'utilisateur doit utiliser les boutons)
}

watch(
  () => props.step,
  async newStep => {
    cleanup()
    if (newStep) {
      await findTarget()
    } else {
      isVisible.value = false
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.step) {
    findTarget()
  }
})

// Cleanup au unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.onboarding-enter-active,
.onboarding-leave-active {
  transition: opacity 0.3s ease;
}

.onboarding-enter-from,
.onboarding-leave-to {
  opacity: 0;
}

:global(.onboarding-highlight) {
  position: relative;
  z-index: 10001;
  outline: 2px solid #22c55e;
  outline-offset: 4px;
  border-radius: 0.5rem;
}
</style>
