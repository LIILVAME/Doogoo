#!/usr/bin/env node

/**
 * Script de validation i18n pour CI/CD (Vercel, GitHub Actions, etc.)
 *
 * Ce script vérifie :
 * - Validité JSON des fichiers de traduction
 * - Absence d'emojis et caractères problématiques
 * - Cohérence des clés entre langues
 * - Absence d'erreurs de format qui causent "Invalid linked format"
 *
 * Exit code: 0 si succès, 1 si erreur
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const LOCALES_DIR = join(rootDir, 'src', 'locales', 'i18n')

const LOCALE_FILES = ['fr.json', 'en.json']

// Caractères interdits qui causent "Invalid linked format"
const FORBIDDEN_CHARS = [
  /✅/g, // Checkmark
  /❌/g, // Cross mark
  /⚠️/g, // Warning sign
  /[\u{1F300}-\u{1F9FF}]/gu // Emojis généraux (supplémentaire)
]

let hasError = false
let errors = []

console.log('\n🔍 VALIDATION I18N CI/CD\n')
console.log('═'.repeat(60))

/**
 * Vérifie la validité JSON d'un fichier
 */
function validateJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const json = JSON.parse(content)
    return { valid: true, json, content }
  } catch (error) {
    return { valid: false, error: error.message, json: null, content: null }
  }
}

/**
 * Détecte les caractères interdits dans une chaîne
 */
function detectForbiddenChars(text) {
  const found = []

  FORBIDDEN_CHARS.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      found.push({
        pattern: pattern.toString(),
        matches: matches,
        char: matches[0]
      })
    }
  })

  return found
}

/**
 * Parcourt récursivement un objet JSON pour détecter les problèmes
 */
function traverseJSON(obj, filePath, keyPath = '') {
  for (const key in obj) {
    const currentPath = keyPath ? `${keyPath}.${key}` : key
    const value = obj[key]

    if (typeof value === 'string') {
      // Détecte les caractères interdits
      const forbidden = detectForbiddenChars(value, filePath, currentPath)
      if (forbidden.length > 0) {
        forbidden.forEach(({ char }) => {
          errors.push({
            file: filePath,
            key: currentPath,
            value: value.substring(0, 100),
            issue: `Caractère interdit détecté: ${char} (emoji Unicode)`,
            severity: 'ERROR'
          })
          hasError = true
        })
      }

      // Détecte les références @: mal formées
      const invalidLinkedRef = /@:[^a-zA-Z0-9_.-]/
      if (invalidLinkedRef.test(value)) {
        errors.push({
          file: filePath,
          key: currentPath,
          value: value.substring(0, 100),
          issue: 'Référence @: mal formée détectée',
          severity: 'ERROR'
        })
        hasError = true
      }

      // Détecte les interpolations mal fermées
      const openBraces = (value.match(/\{/g) || []).length
      const closeBraces = (value.match(/\}/g) || []).length
      if (openBraces !== closeBraces) {
        errors.push({
          file: filePath,
          key: currentPath,
          value: value.substring(0, 100),
          issue: `Interpolation mal fermée: ${openBraces} '{' mais ${closeBraces} '}'`,
          severity: 'ERROR'
        })
        hasError = true
      }

      // Détecte les caractères de contrôle
      // eslint-disable-next-line no-control-regex
      const controlChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/
      if (controlChars.test(value)) {
        errors.push({
          file: filePath,
          key: currentPath,
          value: value.substring(0, 100),
          issue: 'Caractère de contrôle détecté',
          severity: 'WARNING'
        })
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      traverseJSON(value, filePath, currentPath)
    }
  }
}

/**
 * Vérifie la cohérence des clés entre les langues
 */
function checkKeyConsistency(locales) {
  const allKeys = new Set()
  const keysByLocale = {}

  // Collecte toutes les clés de chaque locale
  function collectKeys(obj, prefix = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        collectKeys(obj[key], fullKey)
      } else {
        allKeys.add(fullKey)
      }
    }
  }

  Object.keys(locales).forEach(locale => {
    keysByLocale[locale] = new Set()
    collectKeys(locales[locale], '', keysByLocale[locale])
  })

  // Vérifie que toutes les locales ont les mêmes clés
  const baseKeys = keysByLocale[Object.keys(keysByLocale)[0]]
  let inconsistent = false

  Object.keys(keysByLocale).forEach(locale => {
    const localeKeys = keysByLocale[locale]

    // Clés manquantes dans cette locale
    baseKeys.forEach(key => {
      if (!localeKeys.has(key)) {
        errors.push({
          file: `${locale}.json`,
          key: key,
          issue: `Clé manquante dans ${locale}.json (présente dans les autres locales)`,
          severity: 'WARNING'
        })
        inconsistent = true
      }
    })

    // Clés supplémentaires dans cette locale
    localeKeys.forEach(key => {
      if (!baseKeys.has(key)) {
        errors.push({
          file: `${locale}.json`,
          key: key,
          issue: `Clé supplémentaire dans ${locale}.json (absente des autres locales)`,
          severity: 'WARNING'
        })
        inconsistent = true
      }
    })
  })

  return !inconsistent
}

// ==================== EXECUTION PRINCIPALE ====================

const locales = {}

// Étape 1: Validation JSON et détection des problèmes
LOCALE_FILES.forEach(fileName => {
  const filePath = join(LOCALES_DIR, fileName)

  if (!existsSync(filePath)) {
    console.error(`\n❌ Fichier non trouvé: ${filePath}`)
    hasError = true
    return
  }

  console.log(`\n📄 Validation de ${fileName}...`)

  const validation = validateJSON(filePath)

  if (!validation.valid) {
    console.error(`   ❌ JSON invalide: ${validation.error}`)
    errors.push({
      file: fileName,
      issue: `JSON invalide: ${validation.error}`,
      severity: 'CRITICAL'
    })
    hasError = true
    return
  }

  console.log(`   ✅ JSON valide`)

  // Stocke pour vérification de cohérence
  locales[fileName] = validation.json

  // Parcourt pour détecter les problèmes
  traverseJSON(validation.json, fileName)

  const keyCount = Object.keys(validation.json).length
  console.log(`   📊 ${keyCount} clés racines`)
})

// Étape 2: Vérification de cohérence des clés
if (Object.keys(locales).length > 0) {
  console.log(`\n🔍 Vérification de cohérence des clés...`)
  const isConsistent = checkKeyConsistency(locales)
  if (isConsistent) {
    console.log(`   ✅ Toutes les clés sont cohérentes entre les langues`)
  } else {
    console.log(`   ⚠️  Incohérences détectées (voir détails ci-dessous)`)
  }
}

// ==================== RAPPORT FINAL ====================

console.log('\n' + '═'.repeat(60))

if (errors.length > 0) {
  console.log(`\n❌ ERREURS DÉTECTÉES (${errors.length}):\n`)

  // Groupe par sévérité
  const bySeverity = {
    CRITICAL: [],
    ERROR: [],
    WARNING: []
  }

  errors.forEach(err => {
    bySeverity[err.severity] = bySeverity[err.severity] || []
    bySeverity[err.severity].push(err)
  })

  // Affiche les erreurs critiques en premier
  if (bySeverity.CRITICAL.length > 0) {
    console.log('🔴 CRITIQUE:\n')
    bySeverity.CRITICAL.forEach(err => {
      console.log(`   • ${err.file || 'Unknown'}: ${err.issue}`)
      if (err.key) console.log(`     Clé: ${err.key}`)
      if (err.value) console.log(`     Valeur: ${err.value}...`)
    })
    console.log('')
  }

  // Puis les erreurs
  if (bySeverity.ERROR.length > 0) {
    console.log('❌ ERREURS:\n')
    bySeverity.ERROR.forEach(err => {
      console.log(`   • ${err.file || 'Unknown'}: ${err.issue}`)
      if (err.key) console.log(`     Clé: ${err.key}`)
      if (err.value) console.log(`     Valeur: ${err.value}...`)
    })
    console.log('')
  }

  // Enfin les warnings
  if (bySeverity.WARNING.length > 0) {
    console.log('⚠️  AVERTISSEMENTS:\n')
    bySeverity.WARNING.slice(0, 10).forEach(err => {
      // Limite à 10 warnings
      console.log(`   • ${err.file || 'Unknown'}: ${err.issue}`)
      if (err.key) console.log(`     Clé: ${err.key}`)
    })
    if (bySeverity.WARNING.length > 10) {
      console.log(`   ... et ${bySeverity.WARNING.length - 10} autres avertissements`)
    }
    console.log('')
  }
}

if (hasError) {
  console.log('\n❌ Validation échouée — corrigez les erreurs avant de déployer\n')
  process.exit(1)
} else {
  console.log('\n✅ Validation réussie — aucun problème détecté\n')
  process.exit(0)
}
