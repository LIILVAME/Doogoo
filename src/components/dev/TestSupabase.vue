<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { PROPERTY_STATUS } from '@/utils/constants'

const status = ref('⏳ Test en cours...')
const results = ref([])
const error = ref(null)

const addResult = (step, success, data = null, errorMsg = null) => {
  results.value.push({
    step,
    success,
    data,
    error: errorMsg,
    timestamp: new Date().toLocaleTimeString()
  })
}

onMounted(async () => {
  try {
    console.group('🔍 TEST SUPABASE CONNECTION')

    // 1️⃣ Vérifie la configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    console.log('📋 Configuration:')
    console.log('URL:', supabaseUrl)
    console.log('KEY:', supabaseKey ? supabaseKey.slice(0, 20) + '...' : 'MANQUANTE')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variables d'environnement Supabase manquantes")
    }

    addResult('Configuration', true, { url: supabaseUrl, keyPresent: !!supabaseKey })

    // 2️⃣ Test de connexion basique
    console.log('\n🔌 Test de connexion...')
    const { error: healthError } = await supabase
      .from('properties')
      .select('count', { count: 'exact', head: true })

    if (healthError) {
      console.warn('⚠️ Erreur de connexion (peut être normal si RLS activé):', healthError)
      addResult(
        'Connexion réseau',
        true,
        { message: 'Connexion établie, RLS peut bloquer les requêtes' },
        healthError.message
      )
    } else {
      console.log('✅ Connexion réussie')
      addResult('Connexion réseau', true, { message: 'Connexion établie avec succès' })
    }

    // 3️⃣ Test SELECT sur properties (sans user_id pour voir si RLS bloque)
    console.log('\n📖 Test SELECT sur properties...')
    const { data: properties, error: selectError } = await supabase
      .from('properties')
      .select('*')
      .limit(5)

    if (selectError) {
      console.warn('⚠️ Erreur SELECT (attendu si RLS activé et non authentifié):', selectError)
      addResult(
        'SELECT properties',
        selectError.code === 'PGRST116' || selectError.message?.includes('RLS'),
        { message: 'Erreur RLS attendue si non authentifié' },
        selectError.message
      )
    } else {
      console.log('✅ SELECT réussi:', properties)
      addResult('SELECT properties', true, { count: properties?.length || 0, data: properties })
    }

    // 4️⃣ Test INSERT (temporaire, rollback après)
    console.log('\n✍️ Test INSERT sur properties...')
    const testProperty = {
      name: 'TEST_CONNEXION',
      address: '123 Test Street',
      city: 'Lyon',
      rent: 1000,
      status: PROPERTY_STATUS.VACANT
    }

    const { data: inserted, error: insertError } = await supabase
      .from('properties')
      .insert([testProperty])
      .select()

    if (insertError) {
      console.warn('⚠️ Erreur INSERT (attendu si RLS activé et non authentifié):', insertError)
      addResult(
        'INSERT properties',
        insertError.code === 'PGRST301' ||
          insertError.message?.includes('RLS') ||
          insertError.message?.includes('permission'),
        { message: 'Erreur RLS attendue si non authentifié' },
        insertError.message
      )
    } else {
      console.log('✅ INSERT réussi:', inserted)
      addResult('INSERT properties', true, { data: inserted })

      // 5️⃣ Suppression du test
      if (inserted && inserted.length > 0) {
        console.log('\n🗑️ Suppression du test...')
        const { error: deleteError } = await supabase
          .from('properties')
          .delete()
          .eq('name', 'TEST_CONNEXION')

        if (deleteError) {
          console.warn('⚠️ Erreur lors de la suppression:', deleteError)
          addResult('DELETE test', false, null, deleteError.message)
        } else {
          console.log('✅ Suppression réussie')
          addResult('DELETE test', true, { message: 'Donnée de test supprimée' })
        }
      }
    }

    // 6️⃣ Test vérification des tables
    console.log('\n📊 Vérification des tables...')
    const tables = ['properties', 'tenants', 'payments']
    const tableChecks = {}

    for (const table of tables) {
      const { count, error: tableError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (tableError) {
        tableChecks[table] = { exists: false, error: tableError.message }
      } else {
        tableChecks[table] = { exists: true, accessible: true, count: count || 0 }
      }
    }

    console.log('📊 État des tables:', tableChecks)
    addResult('Vérification tables', true, tableChecks)

    // Résultat final
    const allSuccess = results.value.filter(r => r.success).length
    const allTests = results.value.length

    status.value = `✅ Tests terminés : ${allSuccess}/${allTests} réussis`
    console.log(`\n✅ Tests terminés : ${allSuccess}/${allTests} réussis`)
    console.groupEnd()
  } catch (e) {
    console.error('❌ Erreur fatale:', e)
    status.value = '❌ Erreur de connexion Supabase'
    error.value = e.message
    addResult('Test général', false, null, e.message)
    console.groupEnd()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-2">🔍 Test de connexion Supabase</h2>
        <p class="text-gray-600 mb-4">{{ status }}</p>

        <!-- Résultats détaillés -->
        <div class="space-y-4 mt-6">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="border rounded-lg p-4"
            :class="result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold mb-1">
                  {{ result.success ? '✅' : '❌' }} {{ result.step }}
                </h3>
                <p class="text-sm text-gray-600">{{ result.timestamp }}</p>

                <div v-if="result.data" class="mt-2">
                  <pre class="text-xs bg-white border p-2 rounded overflow-x-auto">{{
                    JSON.stringify(result.data, null, 2)
                  }}</pre>
                </div>

                <div v-if="result.error" class="mt-2">
                  <p class="text-sm text-red-600 font-medium">Erreur:</p>
                  <p class="text-sm text-red-700">{{ result.error }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Erreur générale -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 font-semibold">Erreur fatale:</p>
          <p class="text-red-700">{{ error }}</p>
        </div>

        <!-- Instructions -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Note:</strong> Les erreurs RLS (Row Level Security) sont normales si vous n'êtes
            pas authentifié. Ces tests vérifient que la connexion réseau fonctionne et que Supabase
            répond correctement.
          </p>
        </div>
      </div>

      <!-- Retour -->
      <div class="text-center">
        <router-link
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Retour au dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>
