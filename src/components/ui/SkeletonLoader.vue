<template>
  <div
    class="animate-pulse"
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
 * Affiche un placeholder animé pendant le chargement
 */
defineProps({
  /**
   * Classe CSS de base pour le style (couleur de fond)
   * @default 'bg-zinc-800'
   */
  baseClass: {
    type: String,
    default: 'bg-zinc-800'
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
