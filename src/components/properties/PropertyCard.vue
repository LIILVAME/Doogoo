<template>
  <div
    @click="navigateToDetails"
    class="bg-white rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-zinc-100 group relative overflow-hidden flex flex-col h-full"
  >
    <!-- Property Image Overlay Actions -->
    <div
      class="absolute top-3 right-3 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <button
        @click.stop="handleEdit"
        class="p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 text-zinc-700 hover:text-brand hover:scale-110 transition-all"
        :title="$t('common.edit')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        @click.stop="handleDelete"
        class="p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 text-zinc-700 hover:text-danger hover:scale-110 transition-all"
        :title="$t('common.delete')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>

    <!-- Property Image -->
    <div class="relative h-44 w-full overflow-hidden">
      <img
        :src="
          property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
        "
        :alt="property.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-60"
      ></div>

      <!-- Status Badge -->
      <div class="absolute bottom-3 left-3">
        <span
          class="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md"
          :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- Late Payment Indicator -->
      <div
        v-if="property.tenant && property.tenant.status === 'late'"
        class="absolute top-3 left-3"
      >
        <div
          class="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg flex items-center animate-pulse"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
          {{ $t('status.late') }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col p-4">
      <!-- Header -->
      <div class="mb-3">
        <div class="flex justify-between items-start gap-2 mb-1">
          <h3 class="text-base font-bold text-zinc-900 truncate flex-1">
            {{ property.name }}
          </h3>
          <span class="text-sm font-bold text-brand shrink-0">
            {{ formatCurrency(property.rent) }}
          </span>
        </div>
        <p class="text-xs text-zinc-500 truncate flex items-center">
          <svg
            class="w-3 h-3 mr-1 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          {{ property.city }}
        </p>
      </div>

      <!-- Specs & Info Row -->
      <div class="flex items-center gap-2 mb-4 overflow-hidden">
        <span
          class="px-2 py-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-md whitespace-nowrap"
        >
          {{ getTypeName(property.type) }}
        </span>
        <span
          v-if="property.surface"
          class="px-2 py-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-md whitespace-nowrap"
        >
          {{ property.surface }} m²
        </span>
        <span
          v-if="property.pieces"
          class="px-2 py-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-md whitespace-nowrap"
        >
          {{ property.pieces }} p.
        </span>
      </div>

      <!-- Tenant Section (Simplified) -->
      <div class="mt-auto border-t border-zinc-50 pt-4">
        <div v-if="property.tenant" class="flex items-center justify-between group/tenant">
          <div class="flex items-center min-w-0 flex-1 mr-2">
            <div
              class="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mr-2 shrink-0 border border-zinc-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div class="min-w-0">
              <p
                class="text-xs font-bold text-zinc-900 truncate hover:text-brand transition-colors cursor-pointer"
                @click.stop="handleTenantClick(property.tenant)"
              >
                {{ property.tenant.name }}
              </p>
              <p class="text-[10px] text-zinc-500 leading-none mt-0.5">
                {{ $t('tenants.entryDate') }} {{ formatDateShort(property.tenant.entryDate) }}
              </p>
            </div>
          </div>
          <span
            class="px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0"
            :class="getTenantStatusClass(property.tenant.status)"
          >
            {{ getTenantStatusText(property.tenant.status) }}
          </span>
        </div>
        <div
          v-else
          class="flex items-center justify-center py-2 bg-zinc-50 rounded-xl border border-dashed border-zinc-200"
        >
          <span class="text-[10px] font-medium text-zinc-400 italic">{{
            $t('tenants.noTenants')
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useLingui'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { PROPERTY_STATUS, PAYMENT_STATUS, STATUS_CLASSES } from '@/utils/constants'
import { hapticLight, hapticMedium } from '@/composables/useHapticFeedback'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

/**
 * Property Status logic for the overlay badge
 */
const statusClass = computed(() => {
  if (props.property.status === PROPERTY_STATUS.OCCUPIED) {
    return 'bg-emerald-500 text-white'
  }
  return 'bg-zinc-100 text-zinc-600'
})

const statusText = computed(() => {
  const statusKey =
    props.property.status === PROPERTY_STATUS.OCCUPIED ? 'properties.occupied' : 'properties.free'
  return t(statusKey)
})

/**
 * Tenant Status helpers
 */
const getTenantStatusClass = status => {
  return STATUS_CLASSES[status] || 'bg-zinc-100 text-zinc-600'
}

const getTenantStatusText = status => {
  const statusMap = {
    [PAYMENT_STATUS.ON_TIME]: 'status.onTime',
    [PAYMENT_STATUS.LATE]: 'status.late',
    [PAYMENT_STATUS.PENDING]: 'status.pending',
    [PAYMENT_STATUS.PAID]: 'status.paid'
  }
  return t(statusMap[status] || 'status.pending')
}

const formatDateShort = date => {
  if (!date) return ''
  return formatDate(date, { month: 'short', year: 'numeric' })
}

/**
 * Event Handlers
 */
const navigateToDetails = () => {
  hapticLight()
  router.push({ path: '/biens', query: { mode: 'edit', id: props.property.id } })
}

const handleTenantClick = tenant => {
  hapticLight()
  router.push({ path: '/locataires', query: { search: tenant.name } })
}

const handleEdit = () => {
  hapticMedium()
  emit('edit', props.property)
}

const handleDelete = () => {
  hapticMedium()
  emit('delete', props.property.id)
}

const getTypeName = type => {
  const types = {
    apartment: 'Appartement',
    house: 'Maison',
    parking: 'Parking',
    commercial: 'Local',
    other: 'Autre'
  }
  return types[type] || 'Appartement'
}
</script>
