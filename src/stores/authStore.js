import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToastStore } from '@/stores/toastStore'
import { sanitizeObject } from '@/utils/sanitizeLogs'

/**
 * Store Pinia pour gérer l'authentification
 * Synchronisé avec Supabase Auth pour la persistance de session
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const loadingSession = ref(true) // État de chargement de la session au démarrage
  const error = ref(null)
  const session = ref(null)
  const profile = ref(null)
  let lastProfileFetchTime = 0
  let profileFetchInProgress = false
  const PROFILE_CACHE_MS = 5000 // Cache de 5 secondes

  /**
   * Computed : Vérifie si l'utilisateur est connecté
   */
  const isAuthenticated = computed(() => user.value !== null)

  /**
   * Connexion avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   */
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      // Timeout de 15 secondes pour éviter le chargement infini
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Délai de connexion dépassé. Vérifiez votre connexion Internet.')),
          15000
        )
      )

      const { data, error: authError } = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password
        }),
        timeoutPromise
      ])

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      user.value = data.user
      session.value = data.session
      loading.value = false

      // Track login event
      if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
        import('@/utils/analytics')
          .then(({ trackDoogooEvent, DoogooEvents }) => {
            trackDoogooEvent(DoogooEvents.USER_LOGGED_IN)
          })
          .catch(() => {})
      }

      return { success: true, user: data.user }
    } catch (err) {
      const networkMessage =
        'Impossible de contacter le service d’authentification. Vérifiez votre connexion Internet et les variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'
      const isNetworkError =
        err?.message?.includes('Failed to fetch') || err?.message?.includes('Name not resolved')
      error.value = isNetworkError ? networkMessage : err.message
      loading.value = false
      return { success: false, error: error.value }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @param {Object} metadata - Métadonnées utilisateur (fullName, phone, etc.)
   */
  const signUp = async (email, password, metadata = {}) => {
    loading.value = true
    error.value = null
    const toastStore = useToastStore()

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Redirige vers la racine, App.vue gérera la redirection vers /confirm-email
          emailRedirectTo: `${window.location.origin}`,
          data: {
            full_name: metadata.fullName || '',
            phone: metadata.phone || null
          }
        }
      })

      if (authError) {
        error.value = authError.message
        toastStore.error(`Erreur d'inscription : ${authError.message}`)
        loading.value = false
        return { success: false, error: authError.message }
      }

      // Si l'utilisateur est créé
      if (data?.user) {
        // Le trigger PostgreSQL créera automatiquement le profil dans la table profiles
        // On met à jour le profil avec les métadonnées (full_name, phone)
        try {
          // Utilise upsert pour créer ou mettre à jour le profil
          // Si confirmation email requise, le trigger créera le profil vide, qu'on met à jour ici
          // Si connexion automatique, le profil peut déjà exister ou non
          const phoneFromMetadata = metadata.phone || data.user.user_metadata?.phone || null
          const fullNameFromMetadata = metadata.fullName || data.user.user_metadata?.full_name || ''

          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              user_id: data.user.id,
              full_name: fullNameFromMetadata,
              phone: phoneFromMetadata
            },
            {
              onConflict: 'user_id'
            }
          )

          if (import.meta.env.DEV && phoneFromMetadata) {
            // Données sanitizées pour éviter l'exposition du téléphone
            console.debug('✅ Profil créé/mis à jour avec téléphone (masqué pour sécurité)')
          }
        } catch (profileError) {
          // Le trigger devrait déjà avoir créé le profil, donc cette erreur n'est pas critique
          console.warn(
            'Erreur lors de la mise à jour du profil:',
            sanitizeObject(profileError, ['message'])
          )
        }

        user.value = data.user
        session.value = data.session

        // Track signup event
        if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
          import('@/utils/analytics')
            .then(({ trackDoogooEvent, DoogooEvents }) => {
              trackDoogooEvent(DoogooEvents.USER_SIGNED_UP, {
                email: email
              })
            })
            .catch(() => {})
        }

        if (data.session) {
          toastStore.success('Compte créé avec succès !')
        } else {
          // Confirmation email requise - le trigger créera le profil à la confirmation
          toastStore.success('Compte créé ! Vérifie ton email pour confirmer ton compte.')
        }
        loading.value = false
        return { success: true, user: data.user, requiresConfirmation: !data.session }
      }

      loading.value = false
      return { success: false, error: 'Aucune donnée utilisateur retournée' }
    } catch (err) {
      error.value = err.message
      toastStore.error(`Erreur d'inscription : ${err.message}`)
      // Log sécurisé : on ne log que le message d'erreur, pas l'objet complet
      console.error('Erreur signup Supabase:', sanitizeObject(err, ['message']))
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Déconnexion
   * Nettoie tous les stores et redirige vers /login
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      // Étape 1 : Nettoie les abonnements Realtime AVANT de réinitialiser les stores
      try {
        const { usePropertiesStore } = await import('@/stores/propertiesStore')
        const { usePaymentsStore } = await import('@/stores/paymentsStore')
        const { useTenantsStore } = await import('@/stores/tenantsStore')
        const { useAlertsStore } = await import('@/stores/alertsStore')
        const { useAnalyticsStore } = await import('@/stores/analyticsStore')
        const { useReportsStore } = await import('@/stores/reportsStore')

        const propertiesStore = usePropertiesStore()
        const paymentsStore = usePaymentsStore()
        const tenantsStore = useTenantsStore()
        const alertsStore = useAlertsStore()
        const analyticsStore = useAnalyticsStore()
        const reportsStore = useReportsStore()

        // Arrête Realtime en premier pour éviter que les callbacks accèdent à null
        propertiesStore.stopRealtime()
        paymentsStore.stopRealtime()

        // Réinitialise tous les stores
        const stores = [
          propertiesStore,
          paymentsStore,
          tenantsStore,
          alertsStore,
          analyticsStore,
          reportsStore
        ]
        stores.forEach(store => {
          if (store.reset) {
            store.reset()
          } else if (store.$reset) {
            store.$reset()
          }
        })
      } catch (cleanupError) {
        console.warn('Erreur lors du nettoyage des stores (non bloquant):', cleanupError)
      }

      // Étape 2 : Réinitialise le profil utilisateur
      profile.value = null

      // Étape 3 : Déconnecte de Supabase
      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      // Étape 4 : Réinitialise l'état de session
      user.value = null
      session.value = null

      // Track logout event
      if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
        import('@/utils/analytics')
          .then(({ trackDoogooEvent, DoogooEvents }) => {
            trackDoogooEvent(DoogooEvents.USER_LOGGED_OUT)
          })
          .catch(() => {})
      }

      profile.value = null
      loading.value = false

      // Étape 5 : Redirection vers /login (via router)
      // La redirection se fait dans Sidebar.vue après le logout
      return { success: true }
    } catch (err) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Initialise et restaure la session Supabase au démarrage de l'application
   * Méthode principale appelée dans App.vue avant toute autre initialisation
   */
  const initSession = async () => {
    loadingSession.value = true
    error.value = null

    // Timeout de sécurité : force loadingSession à false après 10 secondes
    const timeoutId = setTimeout(() => {
      if (loadingSession.value) {
        console.warn('⚠️ initSession timeout après 10 secondes - forçage de loadingSession à false')
        loadingSession.value = false
      }
    }, 10000)

    try {
      const {
        data: { session: currentSession },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Erreur lors de la récupération de la session:', sessionError)
        user.value = null
        session.value = null
        loadingSession.value = false
        clearTimeout(timeoutId)
        return
      }

      if (currentSession?.user) {
        user.value = currentSession.user
        session.value = currentSession

        // Charge le profil utilisateur si disponible (ne bloque pas en cas d'erreur)
        try {
          await fetchProfile()
        } catch (err) {
          console.warn('Impossible de charger le profil (non bloquant):', err)
        }
      } else {
        user.value = null
        session.value = null
        // Pas d'erreur si pas de session (normal si l'utilisateur n'est pas connecté)
        error.value = null
      }
    } catch (err) {
      console.error('Erreur initSession:', err)
      // Ne définit l'erreur que si c'est une vraie erreur (pas juste une session absente)
      if (err.message && !err.message.toLowerCase().includes('session')) {
        error.value = err.message
      } else {
        error.value = null
      }
      user.value = null
      session.value = null
    } finally {
      clearTimeout(timeoutId)
      loadingSession.value = false
    }
  }

  /**
   * Récupère l'utilisateur actuel depuis Supabase
   * Utilisé pour restaurer la session au chargement de l'app (legacy, utilise initSession de préférence)
   */
  const fetchUser = async (silent = false) => {
    loading.value = true

    try {
      const {
        data: { user: currentUser },
        error: authError
      } = await supabase.auth.getUser()

      if (authError) {
        // Ne définit l'erreur que si pas en mode silencieux
        if (!silent) {
          error.value = authError.message
        }
        user.value = null
        session.value = null
        loading.value = false
        return null
      }

      user.value = currentUser

      // Récupère également la session
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession()
      session.value = currentSession

      // Charge le profil utilisateur si disponible (ne bloque pas en cas d'erreur)
      if (currentUser) {
        try {
          await fetchProfile()
        } catch (err) {
          console.warn('Impossible de charger le profil (non bloquant):', err)
        }
      }

      loading.value = false
      return currentUser
    } catch (err) {
      // Ne définit l'erreur que si pas en mode silencieux
      if (!silent) {
        error.value = err.message
      }
      user.value = null
      session.value = null
      loading.value = false
      return null
    }
  }

  /**
   * Connexion avec Google OAuth
   * @param {string} redirectTo - URL de redirection après authentification
   */
  const loginWithGoogle = async (redirectTo = null) => {
    loading.value = true
    error.value = null
    const toastStore = useToastStore()

    try {
      // Détermine l'URL de redirection
      const baseUrl = window.location.origin
      const redirectUrl = redirectTo || `${baseUrl}/dashboard`

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (oauthError) {
        error.value = oauthError.message
        toastStore.error(`❌ Connexion via Google échouée : ${oauthError.message}`)
        loading.value = false
        return { success: false, error: oauthError.message }
      }

      // La redirection se fait automatiquement par Supabase
      // On ne peut pas retourner de succès ici car la page va rediriger
      return { success: true, redirecting: true }
    } catch (err) {
      error.value = err.message
      toastStore.error(`❌ Erreur lors de la connexion Google : ${err.message}`)
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Connexion avec Apple OAuth
   * @param {string} redirectTo - URL de redirection après authentification
   */
  const loginWithApple = async (redirectTo = null) => {
    loading.value = true
    error.value = null
    const toastStore = useToastStore()

    try {
      // Détermine l'URL de redirection
      const baseUrl = window.location.origin
      const redirectUrl = redirectTo || `${baseUrl}/dashboard`

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl
        }
      })

      if (oauthError) {
        error.value = oauthError.message
        toastStore.error(`❌ Connexion via Apple échouée : ${oauthError.message}`)
        loading.value = false
        return { success: false, error: oauthError.message }
      }

      // La redirection se fait automatiquement par Supabase
      // On ne peut pas retourner de succès ici car la page va rediriger
      return { success: true, redirecting: true }
    } catch (err) {
      error.value = err.message
      toastStore.error(`❌ Erreur lors de la connexion Apple : ${err.message}`)
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Réinitialise le mot de passe
   * @param {string} email - Email pour recevoir le lien de réinitialisation
   */
  const resetPassword = async email => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (authError) {
        error.value = authError.message
        loading.value = false
        return { success: false, error: authError.message }
      }

      loading.value = false
      return { success: true }
    } catch (err) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Récupère le profil utilisateur depuis Supabase
   */
  const fetchProfile = async (force = false) => {
    // Évite les requêtes multiples si déjà en cours
    if (profileFetchInProgress && !force) {
      // Attend que la requête en cours se termine (max 5 secondes)
      let attempts = 0
      while (profileFetchInProgress && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      return profile.value
    }

    // Cache de 5 secondes
    const now = Date.now()
    if (!force && now - lastProfileFetchTime < PROFILE_CACHE_MS && profile.value !== undefined) {
      return profile.value
    }

    try {
      if (!user.value) {
        profile.value = null
        return null
      }

      profileFetchInProgress = true

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.value.id)
        .maybeSingle()

      // maybeSingle() retourne null au lieu d'erreur si aucun résultat
      if (profileError) {
        console.error('Error fetching profile:', sanitizeObject(profileError, ['message']))
        profile.value = null
        profileFetchInProgress = false
        return null
      }

      // Si profil existe mais téléphone manquant, synchronise depuis user_metadata
      if (data && !data.phone && user.value.user_metadata?.phone) {
        try {
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ phone: user.value.user_metadata.phone })
            .eq('user_id', user.value.id)
            .select()
            .single()

          if (!updateError && updatedProfile) {
            data.phone = updatedProfile.phone
            if (import.meta.env.DEV) {
              // Pas de log du téléphone pour éviter l'exposition de données sensibles
              console.debug('✅ Téléphone synchronisé depuis user_metadata vers profiles')
            }
          }
        } catch (syncError) {
          // Erreur non bloquante - on continue avec les données existantes
          console.warn('Erreur lors de la synchronisation du téléphone:', syncError)
        }
      }

      profile.value = data || null
      lastProfileFetchTime = Date.now()
      profileFetchInProgress = false
      
      // Retourne les préférences si disponibles
      return data || null
    } catch (err) {
      console.error('Error fetching profile:', sanitizeObject(err, ['message']))
      profile.value = null
      profileFetchInProgress = false
      return null
    }
  }

  /**
   * Upload un avatar vers Supabase Storage et met à jour le profil
   * @param {File} file - Fichier image à uploader
   * @returns {Promise<string>} URL publique de l'avatar
   */
  const uploadAvatar = async file => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    const toastStore = useToastStore()

    try {
      // 1. Générer un nom de fichier unique (ID User + Timestamp) pour éviter les conflits de cache
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}-${Date.now()}.${fileExt}`
      const filePath = fileName

      // 2. Upload vers le bucket 'avatars'
      // Note : Le bucket doit avoir les politiques RLS 'insert' activées pour les utilisateurs authentifiés
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Ne pas remplacer, créer un nouveau fichier unique
      })

      if (uploadError) {
        // Gestion des erreurs spécifiques
        let errorMessage = uploadError.message || "Erreur lors de l'upload de l'avatar"
        
        if (uploadError.message?.includes('Bucket not found')) {
          errorMessage = "Le bucket 'avatars' n'existe pas. Veuillez le créer dans Supabase Dashboard → Storage."
        } else if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          errorMessage = "Erreur de sécurité : Vérifiez que les politiques RLS du bucket 'avatars' sont correctement configurées."
        } else if (uploadError.message?.includes('already exists')) {
          // Si le fichier existe déjà (peu probable avec timestamp), on génère un nouveau nom
          const retryFileName = `${user.value.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const { error: retryError } = await supabase.storage.from('avatars').upload(retryFileName, file, {
            cacheControl: '3600',
            upsert: false
          })
          if (retryError) {
            errorMessage = retryError.message || "Erreur lors de la nouvelle tentative d'upload"
            throw new Error(errorMessage)
          }
          // Utilise le nouveau nom pour l'URL
          const { data } = supabase.storage.from('avatars').getPublicUrl(retryFileName)
          await updateProfile({ avatar_url: data.publicUrl })
          return data.publicUrl
        }
        
        throw new Error(errorMessage)
      }

      // 3. Récupérer l'URL publique
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

      // 4. Sauvegarder l'URL dans le profil
      await updateProfile({ avatar_url: data.publicUrl })

      return data.publicUrl
    } catch (error) {
      console.error('Erreur upload avatar:', sanitizeObject(error, ['message']))
      // Affiche l'erreur dans un toast
      if (toastStore) {
        toastStore.error(error.message || "Erreur lors de l'upload de l'avatar")
      }
      throw error // Propager l'erreur pour l'afficher dans l'UI
    }
  }

  /**
   * Met à jour le profil utilisateur dans Supabase
   * @param {Object} updates - Données du profil à mettre à jour
   *   Peut contenir : fullName (ou name), phone, company, address, avatar_url
   * @returns {Promise<boolean>}
   */
  const updateProfile = async updates => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    const toastStore = useToastStore()

    try {
      // Normalise les noms de champs (accepte fullName ou name)
      const normalizedUpdates = {
        full_name: updates.fullName || updates.name || updates.full_name || undefined,
        phone: updates.phone !== undefined ? (updates.phone || null) : undefined,
        company: updates.company !== undefined ? (updates.company || null) : undefined,
        address: updates.address !== undefined ? (updates.address || null) : undefined,
        avatar_url: updates.avatar_url !== undefined ? (updates.avatar_url || null) : undefined
      }

      // Supprime les champs undefined pour ne mettre à jour que ce qui est fourni
      Object.keys(normalizedUpdates).forEach(key => {
        if (normalizedUpdates[key] === undefined) {
          delete normalizedUpdates[key]
        }
      })

      // 1. Update Supabase
      const { error } = await supabase
        .from('profiles')
        .update(normalizedUpdates)
        .eq('id', user.value.id)

      if (error) {
        // Gestion des erreurs spécifiques
        if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
          throw new Error(
            "Erreur de sécurité : Vérifiez que les politiques RLS de la table 'profiles' sont correctement configurées."
          )
        }
        throw error
      }

      // 2. Update State Local (Réactivité immédiate)
      if (profile.value) {
        profile.value = { ...profile.value, ...normalizedUpdates }
      }

      // Met également à jour l'email dans auth.users si changé
      if (updates.email && updates.email !== user.value.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: updates.email
        })

        if (emailError) {
          console.warn('Error updating email:', emailError)
          // Ne pas bloquer si l'email ne peut pas être mis à jour
        }
      }

      toastStore.success('Profil mis à jour avec succès')
      return true
    } catch (error) {
      console.error('Erreur mise à jour profil:', sanitizeObject(error, ['message']))
      toastStore.error(`Erreur lors de la mise à jour : ${error.message}`)
      throw error
    }
  }

  /**
   * Met à jour les préférences utilisateur dans Supabase
   * @param {Object} newPrefs - Objet contenant les préférences (notifications, theme, currency, etc.)
   */
  const updatePreferences = async newPrefs => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    try {
      // Met à jour uniquement la colonne preferences dans la table profiles
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ preferences: newPrefs })
        .eq('user_id', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Met à jour le profil local avec les nouvelles préférences
      if (data && profile.value) {
        profile.value = { ...profile.value, preferences: data.preferences }
      }

      return { success: true, preferences: data.preferences }
    } catch (err) {
      console.error('Error updating preferences:', sanitizeObject(err, ['message']))
      throw err
    }
  }

  /**
   * Met à jour le mot de passe de l'utilisateur
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<{success: boolean}>}
   */
  const updatePassword = async newPassword => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (err) {
      console.error('Error updating password:', sanitizeObject(err, ['message']))
      throw err
    }
  }

  /**
   * Initialise les écouteurs d'événements Supabase Auth
   * Écoute les changements de session (login/logout)
   */
  const initAuthListener = () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        user.value = session?.user ?? null
        session.value = session
        // Charge le profil après connexion et synchronise téléphone si nécessaire
        if (session?.user) {
          try {
            await fetchProfile()
            // Synchronise le téléphone depuis user_metadata vers profiles si nécessaire
            if (session.user.user_metadata?.phone) {
              try {
                const { data: currentProfile } = await supabase
                  .from('profiles')
                  .select('phone')
                  .eq('user_id', session.user.id)
                  .single()

                // Si téléphone manquant dans profiles mais présent dans user_metadata, synchronise
                if (!currentProfile?.phone) {
                  await supabase
                    .from('profiles')
                    .update({ phone: session.user.user_metadata.phone })
                    .eq('user_id', session.user.id)

                  if (import.meta.env.DEV) {
                    // Pas de log du téléphone pour éviter l'exposition de données sensibles
                    console.debug('✅ Téléphone synchronisé au login depuis user_metadata')
                  }
                }
              } catch (syncError) {
                // Erreur non bloquante
                console.warn('Erreur lors de la synchronisation du téléphone au login:', syncError)
              }
            }
          } catch (err) {
            console.warn('Impossible de charger le profil après connexion (non bloquant):', err)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Nettoie proprement lors de la déconnexion
        try {
          // Réinitialise l'état de manière sécurisée
          if (user.value && user.value !== null) user.value = null
          if (session && session.value !== null) session.value = null
          if (profile.value && profile.value !== null) profile.value = null

          // Arrête les abonnements Realtime si les stores sont disponibles
          try {
            const { usePropertiesStore } = await import('@/stores/propertiesStore')
            const { usePaymentsStore } = await import('@/stores/paymentsStore')
            const propertiesStore = usePropertiesStore()
            const paymentsStore = usePaymentsStore()

            if (propertiesStore.stopRealtime) propertiesStore.stopRealtime()
            if (paymentsStore.stopRealtime) paymentsStore.stopRealtime()
          } catch {
            // Ignore les erreurs de nettoyage (stores peuvent être déjà nettoyés)
          }
        } catch (err) {
          console.warn('Erreur lors du nettoyage après SIGNED_OUT (non bloquant):', err)
        }
      }
    })
  }

  return {
    // State
    user,
    loading,
    loadingSession,
    error,
    session,
    profile,
    // Getters
    isAuthenticated,
    // Actions
    login,
    signUp,
    logout,
    initSession,
    fetchUser,
    resetPassword,
    initAuthListener,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    updatePreferences,
    updatePassword,
    loginWithGoogle,
    loginWithApple
  }
})
