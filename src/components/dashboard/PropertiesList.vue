<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-bold text-white">{{ $t('dashboard.properties') }}</h3>
      <button
        @click="$emit('add-property')"
        class="btn-primary flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ $t('properties.add') }}
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="h-[320px] bg-white/5 rounded-2xl animate-pulse border border-white/5"
      ></div>
    </div>

    <div v-else-if="properties.length === 0" class="glass-panel rounded-2xl p-12 text-center">
      <div class="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">{{ $t('properties.noProperties') }}</h3>
      <p class="text-zinc-400 mb-6">{{ $t('properties.startAdding') }}</p>
      <button
        @click="$emit('add-property')"
        class="text-violet-400 hover:text-violet-300 font-medium transition-colors"
      >
        {{ $t('properties.addFirst') }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        @edit="$emit('edit-property', $event)"
        @delete="$emit('delete-property', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import PropertyCard from '../properties/PropertyCard.vue'

defineProps({
  properties: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})


</script>
