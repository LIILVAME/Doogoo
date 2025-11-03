<template>
  <div v-if="show" class="mt-2">
    <!-- Barre de force -->
    <div class="flex items-center gap-2 mb-1">
      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          :class="['h-full transition-all duration-300', strengthColor]"
          :style="{ width: `${strengthWidth}%` }"
        />
      </div>
      <span class="text-xs font-medium" :class="strengthTextColor">
        {{ strengthLabel }}
      </span>
    </div>

    <!-- Conseils (optionnel, affichés si faible) -->
    <transition name="slide-fade">
      <div v-if="showTips && strength < 3" class="mt-2 text-xs text-gray-600 space-y-1">
        <p class="font-medium mb-1">Conseils pour renforcer votre mot de passe :</p>
        <ul class="list-disc list-inside space-y-0.5">
          <li v-if="password.length < 8" class="text-orange-600">Utilisez au moins 8 caractères</li>
          <li v-if="!/[a-z]/.test(password) || !/[A-Z]/.test(password)" class="text-orange-600">
            Mélangez majuscules et minuscules
          </li>
          <li v-if="!/[0-9]/.test(password)" class="text-orange-600">Ajoutez des chiffres</li>
          <li v-if="!/[^a-zA-Z0-9]/.test(password)" class="text-orange-600">
            Ajoutez des caractères spéciaux (!@#$%...)
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePasswordStrength } from '@/composables/usePasswordStrength'

const props = defineProps({
  password: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  },
  showTips: {
    type: Boolean,
    default: false
  }
})

const password = computed(() => props.password || '')

const { strength, strengthLabel, strengthColor, strengthWidth } = usePasswordStrength({
  value: password
})

const strengthTextColor = computed(() => {
  const colors = {
    0: 'text-red-600',
    1: 'text-orange-600',
    2: 'text-yellow-600',
    3: 'text-blue-600',
    4: 'text-green-600'
  }
  return colors[strength.value] || 'text-gray-600'
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-5px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}
</style>
