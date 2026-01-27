/**
 * Composable pour gérer les préférences d'affichage des tableaux
 * Permet de sauvegarder les colonnes visibles, l'ordre, et la largeur
 */

import { ref, computed, watch } from 'vue'

/**
 * @typedef {Object} ColumnPreference
 * @property {string} id - Identifiant unique de la colonne
 * @property {boolean} visible - Si la colonne est visible
 * @property {number} order - Ordre d'affichage (0 = première)
 * @property {number} width - Largeur en pixels (optionnel)
 */

/**
 * Crée un composable pour gérer les préférences d'un tableau spécifique
 * @param {string} tableId - Identifiant unique du tableau (ex: 'reports-table', 'payments-table')
 * @param {Array<ColumnPreference>} defaultColumns - Colonnes par défaut
 * @returns {Object} Composable avec méthodes pour gérer les préférences
 */
export function useTablePreferences(tableId, defaultColumns = []) {
  const STORAGE_KEY = `table_preferences_${tableId}`

  // État des colonnes
  const columns = ref([])

  /**
   * Charge les préférences depuis localStorage
   */
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Fusionne avec les colonnes par défaut pour gérer les nouvelles colonnes
        const defaultMap = new Map(defaultColumns.map(col => [col.id, col]))
        const storedMap = new Map(parsed.map(col => [col.id, col]))

        // Combine : stored a priorité, mais on ajoute les nouvelles colonnes par défaut
        const combined = []
        const allIds = new Set([...defaultMap.keys(), ...storedMap.keys()])

        allIds.forEach(id => {
          if (storedMap.has(id)) {
            combined.push(storedMap.get(id))
          } else if (defaultMap.has(id)) {
            combined.push(defaultMap.get(id))
          }
        })

        // Trie par ordre
        combined.sort((a, b) => (a.order || 0) - (b.order || 0))
        columns.value = combined
      } else {
        // Utilise les colonnes par défaut
        columns.value = [...defaultColumns].sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    } catch (error) {
      console.warn(`Erreur lors du chargement des préférences pour ${tableId}:`, error)
      columns.value = [...defaultColumns].sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  }

  /**
   * Sauvegarde les préférences dans localStorage
   */
  const savePreferences = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns.value))
    } catch (error) {
      console.warn(`Erreur lors de la sauvegarde des préférences pour ${tableId}:`, error)
    }
  }

  /**
   * Colonnes visibles triées par ordre
   */
  const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible).sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  /**
   * Toutes les colonnes (visibles et invisibles) triées par ordre
   */
  const allColumns = computed(() => {
    return [...columns.value].sort((a, b) => (a.order || 0) - (b.order || 0))
  })

  /**
   * Active ou désactive une colonne
   * @param {string} columnId - ID de la colonne
   * @param {boolean} visible - Visibilité
   */
  const setColumnVisibility = (columnId, visible) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      column.visible = visible
      savePreferences()
    }
  }

  /**
   * Change l'ordre d'une colonne
   * @param {string} columnId - ID de la colonne
   * @param {number} newOrder - Nouvel ordre
   */
  const setColumnOrder = (columnId, newOrder) => {
    const column = columns.value.find(col => col.id === columnId)
    if (column) {
      column.order = newOrder
      savePreferences()
    }
  }

  /**
   * Réinitialise les préférences aux valeurs par défaut
   */
  const resetPreferences = () => {
    columns.value = [...defaultColumns].sort((a, b) => (a.order || 0) - (b.order || 0))
    savePreferences()
  }

  /**
   * Ajoute une nouvelle colonne (si elle n'existe pas)
   * @param {ColumnPreference} column - Colonne à ajouter
   */
  const addColumn = column => {
    if (!columns.value.find(col => col.id === column.id)) {
      columns.value.push(column)
      savePreferences()
    }
  }

  /**
   * Déplace une colonne (change l'ordre)
   * @param {string} columnId - ID de la colonne
   * @param {'up'|'down'} direction - Direction du déplacement
   */
  const moveColumn = (columnId, direction) => {
    const index = columns.value.findIndex(col => col.id === columnId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= columns.value.length) return

    // Échange les ordres
    const temp = columns.value[index].order
    columns.value[index].order = columns.value[newIndex].order
    columns.value[newIndex].order = temp

    savePreferences()
  }

  // Charge les préférences au démarrage
  loadPreferences()

  // Sauvegarde automatique quand les colonnes changent
  watch(
    columns,
    () => {
      savePreferences()
    },
    { deep: true }
  )

  return {
    // State
    columns,
    visibleColumns,
    allColumns,
    // Actions
    setColumnVisibility,
    setColumnOrder,
    resetPreferences,
    addColumn,
    moveColumn,
    loadPreferences,
    savePreferences
  }
}
