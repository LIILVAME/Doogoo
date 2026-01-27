/**
 * Feature Flags System
 *
 * Enables gradual rollout and A/B testing of new features
 * Supports user-based and percentage-based rollouts
 */

import { supabase } from '@/lib/supabaseClient'

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  id: string
  flag_name: string
  enabled: boolean
  rollout_percentage: number
  allowed_users: string[]
  allowed_organizations: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Supported feature flags
 */
export type FeatureFlagName = 'multi_currency' | 'advanced_analytics' | 'ai_insights'

/**
 * In-memory cache for feature flags
 */
interface CachedFlag {
  enabled: boolean
  rollout_percentage: number
  allowed_users: string[]
  expires: number
}

const flagCache = new Map<string, CachedFlag>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Hash function for deterministic user bucketing
 * @param input - String to hash (user ID)
 * @returns Number between 0-99
 */
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100
}

/**
 * Fetch feature flag from database
 * @param flagName - Name of the feature flag
 * @returns Feature flag data or null
 */
async function fetchFeatureFlag(flagName: FeatureFlagName): Promise<FeatureFlag | null> {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('flag_name', flagName)
      .single()

    if (error || !data) {
      console.warn(`Feature flag not found: ${flagName}`, error)
      return null
    }

    return data as FeatureFlag
  } catch (err) {
    console.error('Error fetching feature flag:', err)
    return null
  }
}

/**
 * Check if a feature is enabled for a specific user
 * @param flagName - Name of the feature flag
 * @param userId - Optional user ID for user-based rollout
 * @returns True if feature is enabled for this user
 */
export async function isFeatureEnabled(
  flagName: FeatureFlagName,
  userId?: string
): Promise<boolean> {
  // Check cache first
  const cacheKey = `${flagName}_${userId || 'anonymous'}`
  const cached = flagCache.get(cacheKey)

  if (cached && cached.expires > Date.now()) {
    // Use cached decision
    return cached.enabled
  }

  // Fetch from database
  const flag = await fetchFeatureFlag(flagName)

  if (!flag) {
    // Feature flag not found - default to disabled
    return false
  }

  if (!flag.enabled) {
    // Feature is globally disabled
    flagCache.set(cacheKey, {
      enabled: false,
      rollout_percentage: 0,
      allowed_users: [],
      expires: Date.now() + CACHE_TTL_MS
    })
    return false
  }

  // Check if user is in allowlist
  if (userId && flag.allowed_users.includes(userId)) {
    flagCache.set(cacheKey, {
      enabled: true,
      rollout_percentage: flag.rollout_percentage,
      allowed_users: flag.allowed_users,
      expires: Date.now() + CACHE_TTL_MS
    })
    return true
  }

  // Percentage-based rollout (deterministic)
  const userHash = hashString(userId || 'anonymous')
  const isInRollout = userHash < flag.rollout_percentage

  // Cache the decision
  flagCache.set(cacheKey, {
    enabled: isInRollout,
    rollout_percentage: flag.rollout_percentage,
    allowed_users: flag.allowed_users,
    expires: Date.now() + CACHE_TTL_MS
  })

  return isInRollout
}

/**
 * Get all feature flags (for admin dashboard)
 * @returns Array of all feature flags
 */
export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      console.error('Error fetching feature flags:', error)
      return []
    }

    return data as FeatureFlag[]
  } catch (err) {
    console.error('Error fetching all feature flags:', err)
    return []
  }
}

/**
 * Update a feature flag (admin only)
 * @param flagName - Name of the feature flag
 * @param updates - Partial updates to apply
 * @returns Updated feature flag or null
 */
export async function updateFeatureFlag(
  flagName: FeatureFlagName,
  updates: Partial<Pick<FeatureFlag, 'enabled' | 'rollout_percentage' | 'allowed_users'>>
): Promise<FeatureFlag | null> {
  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .update(updates)
      .eq('flag_name', flagName)
      .select()
      .single()

    if (error || !data) {
      console.error('Error updating feature flag:', error)
      return null
    }

    // Clear cache for this flag
    flagCache.clear()

    return data as FeatureFlag
  } catch (err) {
    console.error('Error updating feature flag:', err)
    return null
  }
}

/**
 * Clear the feature flag cache
 */
export function clearFeatureFlagCache(): void {
  flagCache.clear()
}

/**
 * Track feature flag evaluation (for analytics)
 * @param flagName - Name of the feature flag
 * @param userId - User ID
 * @param enabled - Whether the feature was enabled
 */
export function trackFeatureFlagEvaluation(
  flagName: FeatureFlagName,
  userId: string | undefined,
  enabled: boolean
): void {
  // Send to analytics (e.g., PostHog, Mixpanel)
  console.debug('[Feature Flag]', {
    flag: flagName,
    user: userId || 'anonymous',
    enabled,
    timestamp: new Date().toISOString()
  })

  // TODO: Integrate with analytics service
  // posthog.capture('feature_flag_evaluated', { flagName, userId, enabled })
}
