import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToastStore } from '@/stores/toastStore'
import { sanitizeObject } from '@/utils/sanitizeLogs'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Types pour le profil utilisateur
 */
export interface UserProfile {
  id: string
  user_id: string
  // Champs standards
  full_name?: string
  first_name?: string | null
  last_name?: string | null
  email?: string
  phone?: string | null
  avatar_url?: string | null

  // Champs business / légaux
  company?: string | null
  address?: string | null
  address_line?: string | null
  postal_code?: string | null
  city?: string | null
  siret?: string | null
  rcs?: string | null
  iban?: string | null
  bic?: string | null
  bank_name?: string | null
  signature_url?: string | null

  // Champs bailleur
  landlord_type?: string | null
  capital_social?: string | null
  legal_form?: string | null

  // Préférences
  preferences?: Record<string, any> | null

  created_at?: string
  updated_at?: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  loadingSession: boolean
  error: string | null
}

export interface AuthResponse {
  success: boolean
  user?: User | null
  error?: string
  requiresConfirmation?: boolean
  redirecting?: boolean
  preferences?: Record<string, any>
}

/**
 * Store Pinia pour gérer l'authentification
 * Synchronisé avec Supabase Auth pour la persistance de session
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user: Ref<User | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const loadingSession: Ref<boolean> = ref(true) // État de chargement de la session au démarrage
  const error: Ref<string | null> = ref(null)
  const session: Ref<Session | null> = ref(null)
  const profile: Ref<UserProfile | null> = ref(null)

  let lastProfileFetchTime = 0
  let profileFetchInProgress = false
  const PROFILE_CACHE_MS = 5000 // Cache de 5 secondes

  /**
   * Computed : Vérifie si l'utilisateur est connecté
   */
  const isAuthenticated: ComputedRef<boolean> = computed(() => user.value !== null)

  /**
   * Connexion avec email et mot de passe
   */
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      // Timeout de 15 secondes pour éviter le chargement infini
      const timeoutPromise = new Promise<any>((_, reject) =>
        setTimeout(
          () => reject(new Error('Délai de connexion dépassé. Vérifiez votre connexion Internet.')),
          15000
        )
      )

      const result = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password
        }),
        timeoutPromise
      ])

      const { data, error: authError } = result

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
    } catch (err: any) {
      const networkMessage =
        'Impossible de contacter le service d’authentification. Vérifiez votre connexion Internet et les variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.'
      const isNetworkError =
        err?.message?.includes('Failed to fetch') || err?.message?.includes('Name not resolved')
      error.value = isNetworkError ? networkMessage : err.message
      loading.value = false
      return { success: false, error: error.value || 'Erreur inconnue' }
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  const signUp = async (
    email: string,
    password: string,
    metadata: { fullName?: string; phone?: string } = {}
  ): Promise<AuthResponse> => {
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
        } catch (profileError: any) {
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
          // @ts-expect-error - Dynamic import
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
    } catch (err: any) {
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
  const logout = async (): Promise<AuthResponse> => {
    loading.value = true
    error.value = null

    try {
      // Étape 1 : Nettoie les abonnements Realtime AVANT de réinitialiser les stores
      try {
        const { usePropertiesStore } = await import('@/stores/propertiesStore')
        const { usePaymentsStore } = await import('@/stores/paymentsStore')
        const { useTenantsStore } = await import('@/stores/tenantsStore')

        const { useAlertsStore } = await import('@/stores/alertsStore')
        // @ts-expect-error - Dynamic import
        const { useAnalyticsStore } = await import('@/stores/analyticsStore')

        const { useReportsStore } = await import('@/stores/reportsStore')

        const propertiesStore = usePropertiesStore()
        const paymentsStore = usePaymentsStore()
        const tenantsStore = useTenantsStore()
        const alertsStore = useAlertsStore()
        const analyticsStore = useAnalyticsStore()
        const reportsStore = useReportsStore()

        // Arrête Realtime en premier pour éviter que les callbacks accèdent à null
        // @ts-expect-error - Dynamic import typing is tricky
        if (propertiesStore.stopRealtime) propertiesStore.stopRealtime()
        // @ts-expect-error - Dynamic import typing is tricky
        if (paymentsStore.stopRealtime) paymentsStore.stopRealtime()

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
          // @ts-expect-error - Pinia stores have $reset
          if (store.reset) {
            // @ts-expect-error - Reset method might be missing in type
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
        // @ts-expect-error - Dynamic import
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
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Initialise et restaure la session Supabase au démarrage de l'application
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
    } catch (err: any) {
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
   */
  const fetchUser = async (silent = false): Promise<User | null> => {
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
    } catch (err: any) {
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
   */
  const loginWithGoogle = async (redirectTo: string | null = null): Promise<AuthResponse> => {
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
    } catch (err: any) {
      error.value = err.message
      toastStore.error(`❌ Erreur lors de la connexion Google : ${err.message}`)
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Connexion avec Apple OAuth
   */
  const loginWithApple = async (redirectTo: string | null = null): Promise<AuthResponse> => {
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
    } catch (err: any) {
      error.value = err.message
      toastStore.error(`❌ Erreur lors de la connexion Apple : ${err.message}`)
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Réinitialise le mot de passe
   */
  const resetPassword = async (email: string): Promise<AuthResponse> => {
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
    } catch (err: any) {
      error.value = err.message
      loading.value = false
      return { success: false, error: err.message }
    }
  }

  /**
   * Récupère le profil utilisateur depuis Supabase
   */
  const fetchProfile = async (force = false): Promise<UserProfile | null> => {
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
    if (!force && now - lastProfileFetchTime < PROFILE_CACHE_MS && profile.value !== null) {
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

      profile.value = (data as UserProfile) || null
      lastProfileFetchTime = Date.now()
      profileFetchInProgress = false

      return profile.value
    } catch (err: any) {
      console.error('Error fetching profile:', sanitizeObject(err, ['message']))
      profile.value = null
      profileFetchInProgress = false
      return null
    }
  }

  /**
   * Upload un avatar vers Supabase Storage et met à jour le profil
   */
  const uploadAvatar = async (file: File): Promise<string> => {
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
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Ne pas remplacer, créer un nouveau fichier unique
      })

      if (uploadError) {
        // Gestion des erreurs spécifiques
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
        } else if (uploadError.message?.includes('already exists')) {
          // Si le fichier existe déjà (peu probable avec timestamp), on génère un nouveau nom
          const retryFileName = `${user.value.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const { error: retryError } = await supabase.storage
            .from('avatars')
            .upload(retryFileName, file, {
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
    } catch (error: any) {
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
   */
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    const toastStore = useToastStore()

    try {
      // Normalise les noms de champs (accepte fullName ou name, et tous les nouveaux champs)
      const normalizedUpdates: Record<string, any> = {
        full_name:
          updates.full_name || (updates as any).fullName || (updates as any).name || undefined,
        first_name: updates.first_name ?? undefined,
        last_name: updates.last_name ?? undefined,
        phone: updates.phone ?? undefined,
        company: updates.company ?? undefined,
        address: updates.address ?? undefined,
        address_line: updates.address_line ?? undefined,
        postal_code: updates.postal_code ?? undefined,
        city: updates.city ?? undefined,
        siret: updates.siret ?? undefined,
        rcs: updates.rcs ?? undefined,
        iban: updates.iban ?? undefined,
        bic: updates.bic ?? undefined,
        bank_name: updates.bank_name ?? undefined,
        signature_url: updates.signature_url ?? undefined,
        avatar_url: updates.avatar_url ?? undefined,
        landlord_type: updates.landlord_type ?? undefined,
        capital_social: updates.capital_social ?? undefined,
        legal_form: updates.legal_form ?? undefined
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
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', sanitizeObject(error, ['message']))
      toastStore.error(`Erreur lors de la mise à jour : ${error.message}`)
      throw error
    }
  }

  /**
   * Met à jour les préférences utilisateur dans Supabase
   */
  const updatePreferences = async (newPrefs: Record<string, any>): Promise<AuthResponse> => {
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
    } catch (err: any) {
      console.error('Error updating preferences:', sanitizeObject(err, ['message']))
      throw err
    }
  }

  /**
   * Met à jour le mot de passe de l'utilisateur
   */
  const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
    if (!user.value) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (err: any) {
      console.error('Error updating password:', sanitizeObject(err, ['message']))
      throw err
    }
  }

  /**
   * Initialise l'écouteur d'événements d'authentification (compatibilité)
   */
  const initAuthListener = () => {
    // Cette méthode est appelée dans App.vue mais la logique est déjà gérée
    // par l'écouteur global dans App.vue. On la garde pour la compatibilité.
    console.debug('AuthStore: initAuthListener called')

    supabase.auth.onAuthStateChange(async (_event, sessionData) => {
      if (sessionData?.user) {
        user.value = sessionData.user
        session.value = sessionData
        // fetchProfile(true) // On peut re-charger le profil si besoin
      }
    })
  }

  return {
    // State
    user,
    session,
    profile,
    loading,
    loadingSession,
    error,

    // Computed
    isAuthenticated,

    // Actions
    login,
    signUp,
    logout,
    initSession,
    fetchUser,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    loginWithGoogle,
    loginWithApple,
    resetPassword,
    updatePreferences,
    updatePassword,
    initAuthListener
  }
})
