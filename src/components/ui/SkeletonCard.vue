<template>
  <div class="animate-pulse bg-white border border-gray-100 rounded-lg shadow-sm p-6">
    <!-- Header (nom) -->
    <div class="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
    
    <!-- Adresse / Ville -->
    <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div class="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
    
    <!-- Statut badge -->
    <div class="h-6 bg-gray-200 rounded-full w-20 mb-4"></div>
    
    <!-- Loyer -->
    <div class="flex items-center justify-between mb-4">
      <div class="h-3 bg-gray-200 rounded w-24"></div>
      <div class="h-6 bg-gray-200 rounded w-24"></div>
    </div>
    
    <!-- Locataire (placeholder) -->
    <div class="border-t border-gray-100 pt-4 space-y-2">
      <div class="h-3 bg-gray-200 rounded w-full"></div>
      <div class="h-3 bg-gray-200 rounded w-3/4"></div>
      <div class="h-6 bg-gray-200 rounded-full w-16 mt-2"></div>
    </div>
    
    <!-- Actions -->
    <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
      <div class="h-10 bg-gray-200 rounded-lg flex-1"></div>
      <div class="h-10 bg-gray-200 rounded-lg flex-1"></div>
    </div>
  </div>
</template>

<script setup>
// Skeleton card pour les propriétés
// Animation automatique via animate-pulse de Tailwind
</script>

