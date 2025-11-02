import { ref } from 'vue'

/**
 * Composable pour gérer facilement les modals de confirmation
 * @example
 * const { showConfirm, confirmModal } = useConfirmModal()
 *
 * const handleDelete = () => {
 *   showConfirm({
 *     title: 'Supprimer ce bien ?',
 *     message: 'Cette action est irréversible.',
 *     onConfirm: async () => {
 *       await deleteProperty(id)
 *     }
 *   })
 * }
 */
export function useConfirmModal() {
  const isOpen = ref(false)
  const config = ref({
    title: '',
    message: '',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    variant: 'danger',
    onConfirm: null,
    onCancel: null
  })

  const showConfirm = (options = {}) => {
    config.value = {
      ...config.value,
      ...options
    }
    isOpen.value = true
  }

  const handleConfirm = () => {
    if (config.value.onConfirm) {
      config.value.onConfirm()
    }
    isOpen.value = false
  }

  const handleCancel = () => {
    if (config.value.onCancel) {
      config.value.onCancel()
    }
    isOpen.value = false
  }

  const confirmModal = {
    isOpen,
    config,
    handleConfirm,
    handleCancel
  }

  return {
    showConfirm,
    confirmModal
  }
}
