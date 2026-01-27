/**
 * Multi-Currency Feature Composable
 *
 * Provides reactive access to multi-currency feature flag
 * and graceful degradation when feature is disabled
 */

import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { isFeatureEnabled, trackFeatureFlagEvaluation } from '@/utils/featureFlags'
import type { SupportedCurrency } from '@/types/api'

export function useMultiCurrency() {
  const authStore = useAuthStore()
  const enabled = ref(false)
  const loading = ref(true)

  // Check feature flag on mount
  onMounted(async () => {
    try {
      const userId = authStore.user?.id
      enabled.value = await isFeatureEnabled('multi_currency', userId)

      // Track evaluation for analytics
      trackFeatureFlagEvaluation('multi_currency', userId, enabled.value)
    } catch (error) {
      console.error('Error checking multi-currency feature flag:', error)
      enabled.value = false
    } finally {
      loading.value = false
    }
  })

  return {
    /**
     * Whether multi-currency feature is enabled for current user
     */
    isMultiCurrencyEnabled: computed(() => enabled.value),

    /**
     * Whether feature flag is still loading
     */
    isLoading: computed(() => loading.value),

    /**
     * List of supported currencies (EUR only if feature disabled)
     */
    supportedCurrencies: computed((): SupportedCurrency[] => {
      return enabled.value ? ['EUR', 'USD', 'GBP', 'XOF'] : ['EUR']
    }),

    /**
     * Default currency for new properties
     */
    defaultCurrency: computed((): SupportedCurrency => {
      return 'EUR' // Always EUR for backward compatibility
    }),

    /**
     * Whether to show currency selector in UI
     */
    showCurrencySelector: computed(() => enabled.value)
  }
}
