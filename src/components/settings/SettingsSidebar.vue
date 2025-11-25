<template>
  <aside class="w-64 shrink-0">
    <div class="glass-panel rounded-2xl p-4">
      <nav class="space-y-1">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="$emit('change-section', section.id)"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
            activeSection === section.id
              ? 'bg-white/10 text-white shadow-lg shadow-black/20'
              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
          ]"
        >
          <span class="mr-3" :class="activeSection === section.id ? 'text-violet-400' : 'text-zinc-500'" aria-hidden="true">
            <svg
              v-if="iconConfigs[section.icon]"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              :viewBox="iconConfigs[section.icon].viewBox"
            >
              <path
                v-for="(path, index) in iconConfigs[section.icon].paths"
                :key="`${section.id}-${index}`"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="path"
              />
            </svg>
          </span>
          <span>{{ section.label }}</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useLingui'

const { t } = useI18n()

defineProps({
  activeSection: {
    type: String,
    required: true
  }
})

defineEmits(['change-section'])

const iconConfigs = {
  user: {
    viewBox: '0 0 24 24',
    paths: ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z']
  },
  bell: {
    viewBox: '0 0 24 24',
    paths: [
      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    ]
  },
  lock: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    ]
  },
  globe: {
    viewBox: '0 0 24 24',
    paths: [
      'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    ]
  },
  palette: {
    viewBox: '0 0 24 24',
    paths: [
      'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
    ]
  },
  puzzle: {
    viewBox: '0 0 24 24',
    paths: [
      'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
    ]
  }
}

const sections = computed(() => [
  {
    id: 'general',
    label: t('settings.sections.general'),
    icon: 'user'
  },
  {
    id: 'notifications',
    label: t('settings.sections.notifications'),
    icon: 'bell'
  },
  {
    id: 'security',
    label: t('settings.sections.security'),
    icon: 'lock'
  },
  {
    id: 'language-currency',
    label: t('settings.sections.languageCurrency'),
    icon: 'globe'
  }
])
</script>
