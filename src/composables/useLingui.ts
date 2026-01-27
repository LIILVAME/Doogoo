import { computed, getCurrentInstance, ref, onMounted, onUnmounted } from 'vue'
import i18n from '@/i18n'

/**
 * Composable Vue pour utiliser le système de traduction
 * API compatible avec vue-i18n pour faciliter la migration
 */
export function useI18n() {
  const instance = getCurrentInstance()

  // Réactivité pour la locale
  const localeRef = ref(i18n.locale.value)

  // Écoute les changements de locale
  const handleLocaleChange = (event: CustomEvent<{ locale: string }>) => {
    localeRef.value = event.detail.locale
    // Force la mise à jour du composant
    if (instance) {
      instance.proxy?.$forceUpdate?.()
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('locale-changed', handleLocaleChange as EventListener)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('locale-changed', handleLocaleChange as EventListener)
    }
  })

  // Récupère la locale active (réactive)
  const locale = computed({
    get: () => localeRef.value,
    set: (value: string) => {
      i18n.locale.value = value
      localeRef.value = value
    }
  })

  /**
   * Fonction de traduction
   * @param key - Clé de traduction (ex: "auth.login.title")
   * @param values - Valeurs à interpoler (ex: { count: 5 })
   */
  const t = (key: string, values: any = {}) => {
    return i18n.t(key, values)
  }

  return {
    locale,
    t,
    tc: t, // Alias pour compatibilité
    tm: (key: string) => key, // Mode message (non utilisé ici)
    te: (key: string) => i18n.te(key) // Vérifie si la traduction existe
  }
}

/**
 * Plugin global pour utiliser $t dans les templates
 * Sera installé dans main.js
 */
export const i18nPlugin = {
  install(app: any) {
    // Ajoute $t globalement dans les templates
    app.config.globalProperties.$t = (key: string, values: any = {}) => {
      return i18n.t(key, values)
    }

    // Ajoute la locale réactive
    app.config.globalProperties.$locale = computed(() => i18n.locale.value)

    // Fournit l'instance i18n
    app.provide('i18n', i18n)
  }
}

export default i18n
