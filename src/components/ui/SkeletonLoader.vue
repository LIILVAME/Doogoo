<template>
  <div
    class="skeleton-shimmer"
    :class="[
      baseClass,
      {
        'rounded-lg': rounded,
        'rounded-full': circular
      }
    ]"
    :style="{
      width: width || '100%',
      height: height || '1rem',
      ...customStyle
    }"
  ></div>
</template>

<script setup>
/**
 * Composant SkeletonLoader générique
 * Affiche un placeholder animé avec effet shimmer pendant le chargement
 */
defineProps({
  /**
   * Classe CSS de base pour le style (couleur de fond)
   * @default 'bg-zinc-200 dark:bg-zinc-800'
   */
  baseClass: {
    type: String,
    default: 'bg-zinc-200 dark:bg-zinc-800'
  },
  /**
   * Largeur du skeleton
   */
  width: {
    type: String,
    default: null
  },
  /**
   * Hauteur du skeleton
   */
  height: {
    type: String,
    default: null
  },
  /**
   * Coins arrondis
   */
  rounded: {
    type: Boolean,
    default: true
  },
  /**
   * Forme circulaire
   */
  circular: {
    type: Boolean,
    default: false
  },
  /**
   * Styles personnalisés
   */
  customStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
/* Shimmer effect pour skeleton loader */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: var(--color-gray-200);
}

html.dark .skeleton-shimmer {
  background-color: #27272a;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 1.5s infinite;
}

html.dark .skeleton-shimmer::after {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Respecte prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer::after {
    animation: none;
  }
}
</style>
