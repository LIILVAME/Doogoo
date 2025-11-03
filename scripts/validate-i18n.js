#!/usr/bin/env node

/**
 * Script de validation et correction des fichiers i18n
 * Détecte et corrige les erreurs de format Vue I18n
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const LOCALES_DIR = join(rootDir, 'src', 'locales', 'i18n')

/**
 * Analyse un fichier JSON de traduction
 */
function analyzeLocaleFile(filePath, allLocaleFiles = []) {
  const issues = []
  const fixes = []

  try {
    const content = readFileSync(filePath, 'utf-8')
    let json

    // Charge tous les fichiers de locale pour valider les références @:
    const allLocales = {}
    allLocaleFiles.forEach(localeFile => {
      try {
        const localeContent = readFileSync(localeFile, 'utf-8')
        allLocales[localeFile] = JSON.parse(localeContent)
      } catch {
        // Ignore les erreurs de lecture des autres fichiers
      }
    })

    // Teste la validité JSON
    try {
      json = JSON.parse(content)
    } catch (parseError) {
      issues.push({
        type: 'JSON_PARSE_ERROR',
        severity: 'CRITICAL',
        message: `Fichier JSON invalide : ${parseError.message}`,
        line: parseError.message.match(/position (\d+)/)?.[1]
      })
      return { issues, fixes, json: null, content }
    }

    // Fonction pour vérifier si une clé existe dans n'importe quel fichier de locale
    function keyExistsAnywhere(keyPath) {
      for (const localeName in allLocales) {
        if (keyExists(allLocales[localeName], keyPath)) {
          return true
        }
      }
      return keyExists(json, keyPath)
    }

    // Parcourt toutes les clés de traduction
    function traverse(obj, path = '') {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key
        const value = obj[key]

        if (typeof value === 'string') {
          // Détecte les références @: invalides
          const linkedRefs = value.match(/@:[a-zA-Z0-9_.-]+/g) || []
          linkedRefs.forEach(ref => {
            const targetKey = ref.substring(2) // Enlève '@:'
            if (!keyExistsAnywhere(targetKey)) {
              issues.push({
                type: 'INVALID_LINKED_REF',
                severity: 'ERROR',
                path: currentPath,
                value: value,
                issue: `Référence @:${targetKey} pointe vers une clé inexistante`,
                suggestion: value.replace(ref, `[${targetKey}]`)
              })

              fixes.push({
                path: currentPath,
                oldValue: value,
                newValue: value.replace(ref, `[${targetKey}]`),
                reason: 'Référence @: invalide remplacée par texte brut'
              })
            }
          })

          // Note: Les interpolations {variable} sont généralement valides, on les laisse

          // Détecte les caractères problématiques
          if (value.includes('{{') && !value.includes('}}')) {
            issues.push({
              type: 'MALFORMED_INTERPOLATION',
              severity: 'WARNING',
              path: currentPath,
              value: value,
              issue: 'Interpolation malformée : {{ sans }}'
            })
          }

          // Détecte les quotes non échappées dans les valeurs
          if (value.includes('"') && !value.match(/^".*"$/)) {
            // Vérifie si c'est vraiment un problème (peut être valide dans certains cas)
            if (value.includes('"') && !value.includes('\\"')) {
              issues.push({
                type: 'UNESCAPED_QUOTE',
                severity: 'WARNING',
                path: currentPath,
                value: value,
                issue: 'Guillemets non échappés détectés'
              })
            }
          }

          // Détecte les références @. invalides (format obsolète)
          if (value.includes('@.')) {
            issues.push({
              type: 'OBSOLETE_REF',
              severity: 'WARNING',
              path: currentPath,
              value: value,
              issue: 'Format @. est obsolète, utiliser @: ou {}'
            })
          }

          // Détecte les doubles espaces (problème de formatage)
          if (value.includes('  ') || value.includes('\t')) {
            issues.push({
              type: 'FORMATTING_ISSUE',
              severity: 'INFO',
              path: currentPath,
              value: value,
              issue: 'Double espace ou tabulation détecté'
            })
          }
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath)
        }
      }
    }

    traverse(json)

    return { issues, fixes, json, content }
  } catch (error) {
    issues.push({
      type: 'ANALYSIS_ERROR',
      severity: 'CRITICAL',
      message: error.message
    })
    return { issues, fixes, json: null, content: null }
  }
}

/**
 * Vérifie si une clé existe dans l'objet JSON
 */
function keyExists(obj, keyPath) {
  const keys = keyPath.split('.')
  let current = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return false
    }
  }

  return true
}

/**
 * Applique les corrections au JSON
 */
function applyFixes(json, fixes) {
  const newJson = JSON.parse(JSON.stringify(json)) // Deep clone

  fixes.forEach(fix => {
    const keys = fix.path.split('.')
    let current = newJson

    // Navigue jusqu'à la clé parente
    for (let i = 0; i < keys.length - 1; i++) {
      if (current && typeof current === 'object' && keys[i] in current) {
        current = current[keys[i]]
      } else {
        return // Clé non trouvée, on skip cette correction
      }
    }

    // Applique la correction
    const finalKey = keys[keys.length - 1]
    if (current && typeof current === 'object' && finalKey in current) {
      current[finalKey] = fix.newValue
    }
  })

  return newJson
}

/**
 * Valide un fichier i18n avec Vue I18n
 */
function validateWithVueI18n(filePath) {
  try {
    const json = JSON.parse(readFileSync(filePath, 'utf-8'))

    // Simulation basique : vérifie que le JSON est valide
    // Une vraie validation Vue I18n nécessiterait d'importer vue-i18n

    const testKeys = ['auth.login.title', 'auth.signup.title', 'auth.oauth.separator']

    const missingKeys = []
    testKeys.forEach(key => {
      if (!keyExists(json, key)) {
        missingKeys.push(key)
      }
    })

    return {
      valid: missingKeys.length === 0,
      missingKeys,
      error: null
    }
  } catch (error) {
    return {
      valid: false,
      missingKeys: [],
      error: error.message
    }
  }
}

/**
 * Génère le rapport d'audit
 */
function generateAuditReport(results) {
  const timestamp = new Date().toISOString()
  let report = `# 🔍 Rapport d'Audit i18n - Doogoo\n\n`
  report += `**Date** : ${timestamp}\n\n`

  report += `## 📊 Résumé\n\n`
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const totalFixes = results.reduce((sum, r) => sum + r.fixes.length, 0)
  const criticalIssues = results.reduce(
    (sum, r) => sum + r.issues.filter(i => i.severity === 'CRITICAL').length,
    0
  )

  report += `- **Fichiers analysés** : ${results.length}\n`
  report += `- **Total d'erreurs détectées** : ${totalIssues}\n`
  report += `- **Erreurs critiques** : ${criticalIssues}\n`
  report += `- **Corrections appliquées** : ${totalFixes}\n\n`

  report += `## 📁 Détails par Fichier\n\n`

  results.forEach(result => {
    const fileName = result.fileName
    report += `### ${fileName}\n\n`

    if (result.validation.valid) {
      report += `✅ **Validation JSON** : Réussi\n\n`
    } else {
      report += `❌ **Validation JSON** : Échoué\n`
      if (result.validation.error) {
        report += `- Erreur : ${result.validation.error}\n\n`
      }
      if (result.validation.missingKeys.length > 0) {
        report += `- Clés manquantes : ${result.validation.missingKeys.join(', ')}\n\n`
      }
    }

    if (result.issues.length === 0) {
      report += `✅ Aucun problème détecté\n\n`
    } else {
      report += `#### Problèmes Détectés (${result.issues.length})\n\n`

      // Groupe par sévérité
      const bySeverity = {
        CRITICAL: [],
        ERROR: [],
        WARNING: [],
        INFO: []
      }

      result.issues.forEach(issue => {
        bySeverity[issue.severity] = bySeverity[issue.severity] || []
        bySeverity[issue.severity].push(issue)
      })
      const severities = ['CRITICAL', 'ERROR', 'WARNING', 'INFO']
      severities.forEach(severity => {
        if (bySeverity[severity].length > 0) {
          const iconMap = {
            CRITICAL: '🔴',
            ERROR: '❌',
            WARNING: '⚠️',
            INFO: 'ℹ️'
          }
          const icon = iconMap[severity] || 'ℹ️'
          const header = `##### ${icon} ${severity} (${bySeverity[severity].length})\n\n`
          report += header

          bySeverity[severity].forEach(issue => {
            report += `- **Clé** : \`${issue.path || 'N/A'}\`\n`
            report += `  - **Problème** : ${issue.issue || issue.message}\n`
            if (issue.value) {
              report += `  - **Valeur** : \`${issue.value.substring(0, 100)}${issue.value.length > 100 ? '...' : ''}\`\n`
            }
            if (issue.suggestion) {
              report += `  - **Suggestion** : \`${issue.suggestion}\`\n`
            }
            report += `\n`
          })
        }
      })
    }

    if (result.fixes.length > 0) {
      report += `#### Corrections Appliquées (${result.fixes.length})\n\n`

      result.fixes.forEach((fix, index) => {
        report += `${index + 1}. **Clé** : \`${fix.path}\`\n`
        report += `   - **Avant** : \`${fix.oldValue.substring(0, 80)}${fix.oldValue.length > 80 ? '...' : ''}\`\n`
        report += `   - **Après** : \`${fix.newValue.substring(0, 80)}${fix.newValue.length > 80 ? '...' : ''}\`\n`
        report += `   - **Raison** : ${fix.reason}\n\n`
      })
    }

    report += `---\n\n`
  })

  report += `## ✅ Validation Finale\n\n`

  const allValid = results.every(
    r =>
      r.validation.valid &&
      r.issues.filter(i => i.severity === 'CRITICAL' || i.severity === 'ERROR').length === 0
  )

  if (allValid) {
    report += `✅ **Tous les fichiers sont valides et sans erreurs critiques.**\n\n`
  } else {
    report += `⚠️  **Des problèmes subsistent. Consultez les détails ci-dessus.**\n\n`
  }

  report += `## 💡 Recommandations\n\n`
  report += `1. Exécutez ce script avant chaque commit : \`npm run lint:i18n\`\n`
  report += `2. Ajoutez un pre-commit hook pour valider automatiquement\n`
  report += `3. Vérifiez les références @: après chaque ajout de traduction\n`
  report += `4. Testez l'affichage après chaque modification\n\n`

  return report
}

/**
 * Main function
 */
function main() {
  console.log('\n🔍 AUDIT DES FICHIERS I18N\n')
  console.log('═'.repeat(60))

  // Trouve tous les fichiers JSON dans locales/i18n/
  const localeFiles = ['fr.json', 'en.json']
  const results = []

  // Collecte tous les chemins de fichiers pour validation croisée
  const allLocaleFilePaths = localeFiles
    .map(fileName => join(LOCALES_DIR, fileName))
    .filter(filePath => existsSync(filePath))

  localeFiles.forEach(fileName => {
    const filePath = join(LOCALES_DIR, fileName)

    if (!existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé : ${fileName}`)
      return
    }

    console.log(`\n📄 Analyse de ${fileName}...`)

    const analysis = analyzeLocaleFile(filePath, allLocaleFilePaths)
    const validation = validateWithVueI18n(filePath, fileName.replace('.json', ''))

    let fixedJson = analysis.json
    let modified = false

    // Applique les corrections si nécessaire
    if (analysis.fixes.length > 0) {
      console.log(`   🔧 ${analysis.fixes.length} correction(s) à appliquer`)
      fixedJson = applyFixes(analysis.json, analysis.fixes)
      modified = true
    }

    // Sauvegarde le fichier corrigé si des modifications ont été faites
    if (modified && fixedJson) {
      const fixedContent = JSON.stringify(fixedJson, null, 2) + '\n'
      writeFileSync(filePath, fixedContent, 'utf-8')
      console.log(`   ✅ Fichier corrigé et sauvegardé`)
    }

    // Affiche un résumé
    console.log(`   📊 Problèmes détectés : ${analysis.issues.length}`)
    console.log(`   🔧 Corrections appliquées : ${analysis.fixes.length}`)

    if (analysis.issues.length > 0) {
      const critical = analysis.issues.filter(i => i.severity === 'CRITICAL').length
      const errors = analysis.issues.filter(i => i.severity === 'ERROR').length
      if (critical > 0) console.log(`   🔴 Critiques : ${critical}`)
      if (errors > 0) console.log(`   ❌ Erreurs : ${errors}`)
    }

    results.push({
      fileName,
      filePath,
      issues: analysis.issues,
      fixes: analysis.fixes,
      validation,
      modified
    })
  })

  // Génère le rapport
  const docsDir = join(rootDir, 'docs')
  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true })
  }

  const report = generateAuditReport(results)
  const reportPath = join(docsDir, 'I18N_AUDIT_REPORT.md')
  writeFileSync(reportPath, report, 'utf-8')

  console.log('\n' + '═'.repeat(60))
  console.log(`\n✅ Rapport généré : ${reportPath}\n`)

  // Résumé final
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const totalFixes = results.reduce((sum, r) => sum + r.fixes.length, 0)
  const criticalIssues = results.reduce(
    (sum, r) => sum + r.issues.filter(i => i.severity === 'CRITICAL').length,
    0
  )

  console.log(`📊 Résumé Global :`)
  console.log(`   - Fichiers analysés : ${results.length}`)
  console.log(`   - Problèmes détectés : ${totalIssues}`)
  console.log(`   - Corrections appliquées : ${totalFixes}`)
  if (criticalIssues > 0) {
    console.log(`   🔴 Erreurs critiques : ${criticalIssues}`)
  }

  console.log('\n')

  // Exit avec code d'erreur si des erreurs critiques
  process.exit(criticalIssues > 0 ? 1 : 0)
}

main()
