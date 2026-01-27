import { supabase } from '@/lib/supabaseClient'
// @ts-expect-error - utils might not be typed
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour l'authentification et les opérations utilisateur
 * Toutes les interactions avec Supabase Auth et Storage passent par ici
 */

/**
 * Upload un avatar utilisateur vers Supabase Storage
 * @param {string} userId - ID de l'utilisateur
 * @param {File} file - Fichier image à uploader
 * @returns {Promise<Object>} { success: boolean, data?: string (URL), message?: string }
 */
export async function uploadAvatar(userId: string, file: File) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  if (!file) {
    return { success: false, message: 'Fichier requis' }
  }

  // Validation de la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, message: 'Le fichier est trop volumineux (max 2MB)' }
  }

  // Validation du type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Format de fichier non supporté. Veuillez choisir une image.'
    }
  }

  return withErrorHandling(
    async () => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // Upload vers le bucket 'avatars'
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (uploadError) {
        let errorMessage = uploadError.message || "Erreur lors de l'upload de l'avatar"

        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage =
            "Le bucket 'avatars' n'existe pas. Veuillez le créer dans Supabase Dashboard → Storage."
        } else if (
          uploadError.message?.includes('row-level security') ||
          uploadError.message?.includes('RLS')
        ) {
          errorMessage =
            "Erreur de sécurité : Vérifiez que les politiques RLS du bucket 'avatars' sont correctement configurées."
        }

        throw new Error(errorMessage)
      }

      // Récupère l'URL publique
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      return { data: data.publicUrl, error: null }
    },
    'uploadAvatar',
    { timeout: 15000 }
  )
}

/**
 * Upload une image de propriété vers Supabase Storage
 * @param {string} propertyId - ID de la propriété (optionnel, utilisé pour le nom du fichier)
 * @param {File} file - Fichier image à uploader
 * @param {string} userId - ID de l'utilisateur (pour le chemin)
 * @returns {Promise<Object>} { success: boolean, data?: string (URL), message?: string }
 */
export async function uploadPropertyImage(propertyId: string | null, file: File, userId: string) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  if (!file) {
    return { success: false, message: 'Fichier requis' }
  }

  // Validation de la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: 'Le fichier est trop volumineux (max 5MB)' }
  }

  // Validation du type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Format de fichier non supporté. Veuillez choisir une image.'
    }
  }

  return withErrorHandling(
    async () => {
      const fileExt = file.name.split('.').pop()
      const suffix = propertyId ? `-${propertyId}` : ''
      const fileName = `properties/${userId}/${Date.now()}${suffix}.${fileExt}`
      const filePath = fileName

      // Upload vers le bucket 'properties'
      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        let errorMessage = uploadError.message || "Erreur lors de l'upload de l'image"

        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage =
            "Le bucket 'properties' n'existe pas. Veuillez le créer dans Supabase Dashboard → Storage."
        } else if (
          uploadError.message?.includes('row-level security') ||
          uploadError.message?.includes('RLS')
        ) {
          errorMessage =
            "Erreur de sécurité : Vérifiez que les politiques RLS du bucket 'properties' sont correctement configurées."
        }

        throw new Error(errorMessage)
      }

      // Récupère l'URL publique
      const { data } = supabase.storage.from('properties').getPublicUrl(filePath)

      return { data: data.publicUrl, error: null }
    },
    'uploadPropertyImage',
    { timeout: 15000 }
  )
}

/**
 * Upload une signature vers Supabase Storage
 * @param {string} userId - ID de l'utilisateur
 * @param {File} file - Fichier image à uploader
 * @returns {Promise<Object>} { success: boolean, data?: string (URL), message?: string }
 */
export async function uploadSignature(userId: string, file: File) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  if (!file) {
    return { success: false, message: 'Fichier requis' }
  }

  // Validation de la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, message: 'Le fichier est trop volumineux (max 2MB)' }
  }

  // Validation du type
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      message: 'Format de fichier non supporté. Veuillez choisir une image.'
    }
  }

  return withErrorHandling(
    async () => {
      const fileExt = file.name.split('.').pop()
      const fileName = `signature-${userId}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // Essaie d'abord le bucket 'signatures', puis fallback vers 'avatars'
      let uploadError = null
      let bucket = 'signatures'

      const { error: error1 } = await supabase.storage.from('signatures').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error1) {
        // Fallback vers avatars si signatures n'existe pas
        bucket = 'avatars'
        const { error: error2 } = await supabase.storage.from('avatars').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
        uploadError = error2
      }

      if (uploadError) {
        let errorMessage = uploadError.message || "Erreur lors de l'upload de la signature"

        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage = `Le bucket '${bucket}' n'existe pas. Veuillez le créer dans Supabase Dashboard → Storage.`
        } else if (
          uploadError.message?.includes('row-level security') ||
          uploadError.message?.includes('RLS')
        ) {
          errorMessage = `Erreur de sécurité : Vérifiez que les politiques RLS du bucket '${bucket}' sont correctement configurées.`
        }

        throw new Error(errorMessage)
      }

      // Récupère l'URL publique
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return { data: data.publicUrl, error: null }
    },
    'uploadSignature',
    { timeout: 15000 }
  )
}

/**
 * Change le mot de passe de l'utilisateur
 * Vérifie d'abord que l'ancien mot de passe est correct
 * @param {string} email - Email de l'utilisateur
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} { success: boolean, message?: string }
 */
export async function changePassword(email: string, currentPassword: string, newPassword: string) {
  if (!email || !currentPassword || !newPassword) {
    return { success: false, message: 'Email, mot de passe actuel et nouveau mot de passe requis' }
  }

  // Vérifie la longueur minimale
  if (newPassword.length < 6) {
    return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' }
  }

  // Vérifie que le nouveau mot de passe est différent de l'ancien
  if (newPassword === currentPassword) {
    return { success: false, message: "Le nouveau mot de passe doit être différent de l'ancien" }
  }

  return withErrorHandling(
    async () => {
      // Vérifie d'abord que l'ancien mot de passe est correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Le mot de passe actuel est incorrect')
      }

      // Si la vérification réussit, met à jour le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        let errorMessage = updateError.message || 'Erreur lors de la mise à jour du mot de passe'

        if (updateError.message?.includes('weak') || updateError.message?.includes('strength')) {
          errorMessage =
            'Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.'
        }

        throw new Error(errorMessage)
      }

      return { data: { success: true }, error: null }
    },
    'changePassword',
    { timeout: 15000 }
  )
}

/**
 * Demande de réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, message?: string }
 */
export async function resetPassword(email: string) {
  if (!email) {
    return { success: false, message: 'Email requis' }
  }

  return withErrorHandling(
    async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw new Error(error.message || 'Erreur lors de la demande de réinitialisation')
      }

      return { data: { success: true }, error: null }
    },
    'resetPassword',
    { timeout: 10000 }
  )
}

/**
 * Met à jour le mot de passe après réinitialisation (avec session temporaire)
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} { success: boolean, message?: string }
 */
export async function updatePasswordAfterReset(newPassword: string) {
  if (!newPassword) {
    return { success: false, message: 'Nouveau mot de passe requis' }
  }

  // Vérifie la longueur minimale
  if (newPassword.length < 6) {
    return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' }
  }

  return withErrorHandling(
    async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        let errorMessage = error.message || 'Erreur lors de la mise à jour du mot de passe'

        if (error.message?.includes('weak') || error.message?.includes('strength')) {
          errorMessage =
            'Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.'
        }

        throw new Error(errorMessage)
      }

      return { data: { success: true }, error: null }
    },
    'updatePasswordAfterReset',
    { timeout: 15000 }
  )
}

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @param {Object} metadata - Métadonnées utilisateur (fullName, phone, etc.)
 * @returns {Promise<Object>} { success: boolean, data?: { user, session }, message?: string, requiresConfirmation?: boolean }
 */
export async function signup(email: string, password: string, metadata: any = {}) {
  if (!email || !password) {
    return { success: false, message: 'Email et mot de passe requis' }
  }

  // Vérifie la longueur minimale
  if (password.length < 6) {
    return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' }
  }

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName || null,
            phone: metadata.phone || null,
            first_name: metadata.fullName?.split(' ')[0] || null,
            last_name: metadata.fullName?.split(' ').slice(1).join(' ') || null
          }
        }
      })

      if (error) {
        throw new Error(error.message || "Erreur lors de l'inscription")
      }

      // Vérifie si une confirmation email est requise
      const requiresConfirmation = !data.session && data.user && !data.user.email_confirmed_at

      return {
        data: {
          user: data.user,
          session: data.session,
          requiresConfirmation
        },
        error: null
      }
    },
    'signup',
    { timeout: 15000 }
  )
}

/**
 * Vérifie si un utilisateur a déjà des propriétés
 * Utilisé pour décider entre onboarding et dashboard
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} { success: boolean, data?: { hasProperties: boolean, count: number }, message?: string }
 */
export async function checkUserHasProperties(userId: string) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(
    async () => {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message || 'Erreur lors de la vérification des propriétés')
      }

      return {
        data: {
          hasProperties: (count || 0) > 0,
          count: count || 0
        },
        error: null
      }
    },
    'checkUserHasProperties',
    { timeout: 10000 }
  )
}

/**
 * Échange les tokens de réinitialisation pour créer une session temporaire
 * @param {string} accessToken - Token d'accès depuis l'URL
 * @param {string} refreshToken - Token de rafraîchissement depuis l'URL
 * @returns {Promise<Object>} { success: boolean, data?: { user, session }, message?: string }
 */
export async function setSessionFromResetToken(accessToken: string, refreshToken: string) {
  if (!accessToken || !refreshToken) {
    return { success: false, message: 'Tokens requis' }
  }

  return withErrorHandling(
    async () => {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        throw new Error(error.message || "Erreur lors de l'échange des tokens")
      }

      if (!data.session) {
        throw new Error('Session non créée après échange des tokens')
      }

      return {
        data: {
          user: data.user,
          session: data.session
        },
        error: null
      }
    },
    'setSessionFromResetToken',
    { timeout: 10000 }
  )
}
