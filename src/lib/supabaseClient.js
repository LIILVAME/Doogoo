import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase pour l'authentification et la gestion des données
 * Fournit un client de secours en environnement Preview/marketing (pas de variables .env)
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingConfigError = new Error(
  'Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY pour activer les fonctionnalités dynamiques.'
)

const buildMockResponse = () => ({
  data: null,
  error: missingConfigError,
  count: null
})

const createMockQueryBuilder = () => {
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    lt: () => builder,
    lte: () => builder,
    gt: () => builder,
    gte: () => builder,
    in: () => builder,
    ilike: () => builder,
    like: () => builder,
    or: () => builder,
    filter: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => Promise.resolve(buildMockResponse()),
    maybeSingle: () => Promise.resolve(buildMockResponse()),
    throwOnError: () => builder,
    then: (resolve, reject) => Promise.resolve(buildMockResponse()).then(resolve, reject)
  }

  return builder
}

const createMockChannel = () => {
  const channel = {
    on: () => channel,
    subscribe: async () => ({ data: { subscription: channel }, error: missingConfigError }),
    unsubscribe: () => {},
    send: () => channel,
    track: () => channel,
    presenceState: () => ({})
  }

  return channel
}

const createMockSupabase = () => {
  const mockAuthResponse = data => ({ data, error: missingConfigError })

  return {
    auth: {
      signInWithPassword: async () => buildMockResponse(),
      signUp: async () => buildMockResponse(),
      signOut: async () => buildMockResponse(),
      setSession: async () => mockAuthResponse({ session: null, user: null }),
      getSession: async () => mockAuthResponse({ session: null }),
      getUser: async () => mockAuthResponse({ user: null }),
      updateUser: async () => buildMockResponse(),
      resetPasswordForEmail: async () => buildMockResponse(),
      signInWithOAuth: async () => buildMockResponse(),
      onAuthStateChange: callback => {
        const subscription = { unsubscribe: () => {} }
        try {
          callback?.('SIGNED_OUT', null)
        } catch (error) {
          console.warn('Callback auth mock échoué:', error)
        }

        return { data: { subscription } }
      }
    },
    from: () => createMockQueryBuilder(),
    channel: () => createMockChannel(),
    removeChannel: () => {},
    storage: {
      from: () => ({
        upload: async () => buildMockResponse(),
        getPublicUrl: () => ({ data: null, error: missingConfigError })
      })
    }
  }
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : (() => {
        console.warn('⚠️  Supabase non configuré - fonctionnement en mode démonstration (landing seulement).')
        return createMockSupabase()
      })()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

