import Tooltip from '@/components/common/Tooltip.vue'
import { createApp } from 'vue'

/**
 * Directive v-tooltip pour ajouter facilement des tooltips
 * @example
 * <button v-tooltip="'Cliquez pour supprimer'">Supprimer</button>
 * <button v-tooltip="{ text: 'Info', placement: 'bottom' }">Info</button>
 */
export default {
  mounted(el, binding) {
    const tooltipConfig =
      typeof binding.value === 'string' ? { text: binding.value } : binding.value

    // Crée une app Vue pour le composant Tooltip
    const app = createApp(Tooltip, {
      text: tooltipConfig.text || '',
      placement: tooltipConfig.placement || 'top',
      showArrow: tooltipConfig.showArrow !== false,
      delay: tooltipConfig.delay || 300
    })

    // Crée un conteneur pour le slot
    const container = document.createElement('span')
    container.style.display = 'inline-block'

    // Déplace l'élément original dans le conteneur
    el.parentNode?.insertBefore(container, el)
    container.appendChild(el)

    // Monte le composant Tooltip
    app.mount(container)
    el._tooltipApp = app
    el._tooltipContainer = container
  },

  unmounted(el) {
    if (el._tooltipApp) {
      el._tooltipApp.unmount()
    }
    if (el._tooltipContainer && el._tooltipContainer.parentNode) {
      // Restaure l'élément original
      el._tooltipContainer.parentNode.insertBefore(el, el._tooltipContainer)
      el._tooltipContainer.remove()
    }
  }
}
