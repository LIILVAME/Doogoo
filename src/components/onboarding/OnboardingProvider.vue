<template>
  <div>
    <slot />
    <OnboardingStep
      v-if="shouldShow && currentStep"
      :step="currentStep"
      :step-index="currentStepIndex"
      :total-steps="onboardingStepsList"
      :has-next="hasNext"
      :has-previous="hasPrevious"
      @next="next"
      @previous="previous"
      @complete="complete"
      @dismiss="dismiss"
    />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useOnboarding } from '@/composables/useOnboarding'
import OnboardingStep from './OnboardingStep.vue'

const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  autoStart: {
    type: Boolean,
    default: false
  }
})

const {
  shouldShow,
  currentStep,
  currentStepIndex,
  steps: onboardingStepsList,
  hasNext,
  hasPrevious,
  init,
  next,
  previous,
  complete,
  dismiss
} = useOnboarding()

// Initialise l'onboarding quand les steps sont fournis
watch(
  () => props.steps,
  newSteps => {
    if (newSteps && newSteps.length > 0 && (props.autoStart || !shouldShow.value)) {
      init(newSteps)
    }
  },
  { immediate: true }
)

// Expose les méthodes pour contrôle externe
defineExpose({
  start: () => init(props.steps),
  next,
  previous,
  complete,
  dismiss
})
</script>
