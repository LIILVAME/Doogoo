import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from './useLingui'

/**
 * Composable pour gérer les métadonnées SEO dynamiques
 * Mise à jour automatique du titre, description, et Open Graph selon la route
 */
export function useSEO() {
  const route = useRoute()
  const { t, locale } = useI18n()

  const siteName = 'Doogoo'
  const siteUrl = 'https://doogoo.vercel.app'
  const siteDescription =
    'Plateforme de gestion et de suivi intelligent de biens immobiliers avec monitoring en temps réel'

  /**
   * Met à jour les métadonnées de la page
   */
  const updateMetaTags = (meta: any = {}) => {
    const title = meta.title || `${siteName} — ${t('common.dashboard')}`
    const description = meta.description || siteDescription
    const ogTitle = meta.ogTitle || title
    const ogDescription = meta.ogDescription || description
    const ogImage = meta.ogImage || `${siteUrl}/icons/icon-512x512.png`
    const currentUrl = `${siteUrl}${route.path}`

    // Mise à jour du titre
    document.title = title

    // Mise à jour ou création des meta tags
    const updateMetaTag = (name: string, content: string, attribute = 'name') => {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // Meta description
    updateMetaTag('description', description)

    // Open Graph
    updateMetaTag('og:title', ogTitle, 'property')
    updateMetaTag('og:description', ogDescription, 'property')
    updateMetaTag('og:image', ogImage, 'property')
    updateMetaTag('og:url', currentUrl, 'property')
    updateMetaTag('og:type', 'website', 'property')
    updateMetaTag('og:site_name', siteName, 'property')
    updateMetaTag('og:locale', locale.value === 'fr' ? 'fr_FR' : 'en_US', 'property')

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', ogTitle)
    updateMetaTag('twitter:description', ogDescription)
    updateMetaTag('twitter:image', ogImage)

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', currentUrl)

    // Hreflang (alternate languages)
    const updateHreflang = (lang: string, href: string) => {
      let link = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', lang)
        document.head.appendChild(link)
      }
      link.setAttribute('href', href)
    }

    // Ajoute les liens hreflang pour FR et EN
    updateHreflang('fr', `${siteUrl}${route.path}?lang=fr`)
    updateHreflang('en', `${siteUrl}${route.path}?lang=en`)
    updateHreflang('x-default', `${siteUrl}${route.path}`)
  }

  // Garde pour éviter plusieurs watchers
  let seoWatcherInitialized = false

  /**
   * Initialise le watcher pour mettre à jour automatiquement les meta tags
   */
  const initSEO = () => {
    // Évite de créer plusieurs watchers
    if (seoWatcherInitialized) {
      // Mise à jour immédiate si déjà initialisé
      if (route.meta?.seo) {
        updateMetaTags(route.meta.seo)
      } else {
        updateMetaTags()
      }
      return
    }

    // Mise à jour initiale
    if (route.meta?.seo) {
      updateMetaTags(route.meta.seo)
    }

    // Watcher pour les changements de route (créé une seule fois)
    watch(
      () => [route.path, route.meta?.seo],
      ([path, seo], [oldPath, oldSeo]) => {
        // Évite les mises à jour inutiles si rien n'a changé
        if (path === oldPath && seo === oldSeo) {
          return
        }

        if (seo) {
          updateMetaTags(seo)
        } else {
          // Meta par défaut si pas de meta spécifique
          updateMetaTags()
        }
      },
      { immediate: false } // Ne pas déclencher immédiatement, déjà fait au-dessus
    )

    seoWatcherInitialized = true
  }

  return {
    updateMetaTags,
    initSEO,
    siteName,
    siteUrl,
    siteDescription
  }
}
