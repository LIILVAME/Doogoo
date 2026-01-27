import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase pour l'authentification et la gestion des données
 * Configuration via variables d'environnement
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// En mode test (CI), on utilise des valeurs fictives pour éviter de bloquer les tests unitaires
const isTest = import.meta.env.MODE === 'test'

if (!supabaseUrl || !supabaseKey) {
  if (isTest) {
    console.warn('⚠️ Mode test détecté : Utilisation de valeurs fictives pour Supabase')
  } else {
    console.error('❌ Variables SUPABASE manquantes dans .env')
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
  }
}

// Valeurs par défaut pour les tests uniquement
const url = supabaseUrl || 'https://example.supabase.co'
const key = supabaseKey || 'public-anon-key'

export const supabase: SupabaseClient = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
