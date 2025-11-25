const analyticsLoader = {
  promise: null
}

const loadAnalytics = async () => {
  if (!analyticsLoader.promise) {
    analyticsLoader.promise = import('@/utils/analytics')
  }

  return analyticsLoader.promise
}

const isAnalyticsEnabled = () => import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

const safeTrack = (eventName, payload = {}) => {
  if (!isAnalyticsEnabled()) return

  loadAnalytics()
    .then(({ trackDoogooEvent }) => {
      trackDoogooEvent(eventName, payload)
    })
    .catch(error => {
      console.warn('[OnboardingAnalytics] Événement ignoré', error)
    })
}

export function useOnboardingAnalytics() {
  const trackStep1Completed = payload => safeTrack('onboarding_step1_completed', payload)
  const trackStep2Completed = payload => safeTrack('onboarding_step2_completed', payload)
  const trackOnboardingCompleted = payload => safeTrack('onboarding_completed', payload)
  const trackOnboardingSkipped = payload => safeTrack('onboarding_skipped', payload)

  return {
    trackStep1Completed,
    trackStep2Completed,
    trackOnboardingCompleted,
    trackOnboardingSkipped
  }
}
