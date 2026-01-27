import { supabase } from '@/lib/supabaseClient'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour les documents (Supabase Storage)
 * Toutes les interactions avec le bucket 'documents' passent par ici
 */

/**
 * Nettoie le nom de fichier (enlève accents, remplace espaces par _)
 * @param fileName - Nom du fichier à nettoyer
 * @returns {string} Nom de fichier nettoyé
 */
function cleanFileName(fileName: string): string {
  // Supprime l'extension pour la traiter séparément
  const lastDotIndex = fileName.lastIndexOf('.')
  const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : ''

  // Normalise les accents (é -> e, à -> a, etc.)
  const normalized = nameWithoutExt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  // Remplace tous les caractères non alphanumériques (sauf points et tirets) par _
  const cleaned = normalized.replace(/[^a-z0-9._-]/g, '_')

  return cleaned + extension
}

/**
 * Upload un document pour un locataire
 * @param tenantId - ID du locataire
 * @param file - Fichier à uploader
 * @param userId - ID de l'utilisateur (pour la sécurité via RLS)
 * @returns {Promise<any>} { success: boolean, data?: Object, error?: Error }
 */
export async function uploadDocument(tenantId: string, file: File, userId: string) {
  if (!tenantId || !file || !userId) {
    return { success: false, message: 'Tenant ID, file et User ID requis' }
  }

  return withErrorHandling(
    async () => {
      // Nettoie le nom de fichier et ajoute un timestamp pour éviter les doublons
      const cleanName = cleanFileName(file.name)
      const timestamp = Date.now()
      const filePath = `${tenantId}/${timestamp}_${cleanName}`

      const { error } = await supabase.storage.from('documents').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Ne pas écraser les fichiers existants
      })

      if (error) {
        return { data: null, error }
      }

      return { data: { path: filePath, name: cleanName }, error: null }
    },
    'uploadDocument',
    { timeout: 30000 } // 30s pour les uploads de fichiers
  )
}

/**
 * Récupère la liste des documents d'un locataire
 * @param tenantId - ID du locataire
 * @param userId - ID de l'utilisateur (pour la sécurité via RLS)
 * @returns {Promise<any>} { success: boolean, data?: Array, error?: Error }
 */
export async function listDocuments(tenantId: string, userId: string) {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase.storage.from('documents').list(tenantId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

      if (error) {
        return { data: null, error }
      }

      // Filtre pour ne retourner que les fichiers (pas les dossiers)
      const files = (data || []).filter(item => (item as any).id !== null)

      return { data: files, error: null }
    },
    'listDocuments',
    { timeout: 10000 }
  )
}

/**
 * Génère une URL signée pour télécharger un document (bucket privé)
 * @param tenantId - ID du locataire
 * @param fileName - Nom du fichier
 * @param userId - ID de l'utilisateur (pour la sécurité via RLS)
 * @param expiresIn - Durée de validité en secondes (défaut: 3600 = 1h)
 * @returns {Promise<any>} { success: boolean, data?: { signedUrl: string }, error?: Error }
 */
export async function getDocumentUrl(
  tenantId: string,
  fileName: string,
  userId: string,
  expiresIn: number = 3600
) {
  if (!tenantId || !fileName || !userId) {
    return { success: false, message: 'Tenant ID, file name et User ID requis' }
  }

  return withErrorHandling(
    async () => {
      // Si le fileName contient déjà le préfixe tenantId/, on l'utilise tel quel
      // Sinon, on l'ajoute
      const filePath = fileName.startsWith(`${tenantId}/`) ? fileName : `${tenantId}/${fileName}`

      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        return { data: null, error }
      }

      return { data: { signedUrl: data.signedUrl }, error: null }
    },
    'getDocumentUrl',
    { timeout: 5000 }
  )
}

/**
 * Supprime un document
 * @param tenantId - ID du locataire
 * @param fileName - Nom du fichier à supprimer
 * @param userId - ID de l'utilisateur (pour la sécurité via RLS)
 * @returns {Promise<any>} { success: boolean, error?: Error }
 */
export async function deleteDocument(tenantId: string, fileName: string, userId: string) {
  if (!tenantId || !fileName || !userId) {
    return { success: false, message: 'Tenant ID, file name et User ID requis' }
  }

  return withErrorHandling(
    async () => {
      // Si le fileName contient déjà le préfixe tenantId/, on l'utilise tel quel
      // Sinon, on l'ajoute
      const filePath = fileName.startsWith(`${tenantId}/`) ? fileName : `${tenantId}/${fileName}`

      const { error } = await supabase.storage.from('documents').remove([filePath])

      if (error) {
        return { data: null, error }
      }

      return { data: { success: true }, error: null }
    },
    'deleteDocument',
    { timeout: 10000 }
  )
}
