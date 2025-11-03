#!/usr/bin/env node

/**
 * Script de génération du rapport de santé global Doogoo
 * Compile tous les rapports d'audit et génère un rapport consolidé
 */

import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const docsDir = join(rootDir, 'docs')

/**
 * Lit un rapport JSON s'il existe
 */
function readJsonReport(filename) {
  const filepath = join(docsDir, filename)
  if (existsSync(filepath)) {
    try {
      return JSON.parse(readFileSync(filepath, 'utf-8'))
    } catch {
      return null
    }
  }
  return null
}

/**
 * Génère le rapport de santé global
 */
function generateHealthReport() {
  const timestamp = new Date().toISOString()

  // Lit les rapports existants
  const vercelReport = readJsonReport('VERCEL_ENV_AUDIT_REPORT.json')
  const connectivityReport = readJsonReport('SUPABASE_CONNECTIVITY_LOG.json')

  // Calcule le statut global
  let overallStatus = '✅ HEALTHY'
  let issues = []

  // Vérifie Vercel
  if (vercelReport) {
    if (vercelReport.summary.status !== '✅ OK') {
      overallStatus = '⚠️  ISSUES DETECTED'
      issues.push("Variables d'environnement Vercel manquantes ou non configurées")
    }
  } else {
    overallStatus = '⚠️  INCOMPLETE'
    issues.push('Rapport Vercel non généré - exécutez "npm run audit:vercel"')
  }

  // Vérifie Connectivité
  if (connectivityReport) {
    if (!connectivityReport.summary.allTestsPassed) {
      overallStatus = '❌ CRITICAL'
      issues.push('Tests de connectivité Supabase échoués')
    }
  } else {
    if (overallStatus === '✅ HEALTHY') {
      overallStatus = '⚠️  INCOMPLETE'
    }
    issues.push('Rapport de connectivité non généré - exécutez "npm run audit:supabase"')
  }

  // Génère le rapport Markdown
  let markdown = `# 🏥 Rapport de Santé - Déploiement Doogoo\n\n`
  markdown += `**Date** : ${timestamp}\n`
  markdown += `**Statut Global** : ${overallStatus}\n\n`

  markdown += `---\n\n`

  markdown += `## 📊 Résumé Exécutif\n\n`
  markdown += `Le statut global du déploiement Doogoo est **${overallStatus}**.\n\n`

  if (issues.length > 0) {
    markdown += `### ⚠️  Problèmes Détectés\n\n`
    issues.forEach((issue, index) => {
      markdown += `${index + 1}. ${issue}\n`
    })
    markdown += `\n`
  } else {
    markdown += `✅ Aucun problème détecté. Le déploiement est opérationnel.\n\n`
  }

  markdown += `---\n\n`

  // Section Vercel
  markdown += `## 1️⃣ Variables d'Environnement Vercel\n\n`
  if (vercelReport) {
    markdown += `**Statut** : ${vercelReport.summary.status}\n\n`
    markdown += `- Variables requises présentes : ${vercelReport.summary.requiredVarsPresent}/${vercelReport.summary.requiredVarsTotal}\n`

    if (vercelReport.localEnvironment.missingVars.length > 0) {
      markdown += `\n### ❌ Variables Manquantes\n\n`
      vercelReport.localEnvironment.missingVars.forEach(key => {
        markdown += `- \`${key}\`\n`
      })
    }

    if (vercelReport.recommendations.length > 0) {
      markdown += `\n### 💡 Recommandations\n\n`
      vercelReport.recommendations.forEach(rec => {
        const icon = rec.severity === 'CRITICAL' ? '🔴' : rec.severity === 'WARNING' ? '🟡' : '🔵'
        markdown += `${icon} **${rec.severity}** : ${rec.message}\n\n`
        markdown += `   → ${rec.action}\n\n`
      })
    }

    markdown += `\n📄 **Rapport complet** : [VERCEL_ENV_AUDIT_REPORT.md](./VERCEL_ENV_AUDIT_REPORT.md)\n\n`
  } else {
    markdown += `⚠️  **Rapport non disponible**\n\n`
    markdown += `Exécutez \`npm run audit:vercel\` pour générer le rapport.\n\n`
  }

  markdown += `---\n\n`

  // Section Connectivité
  markdown += `## 2️⃣ Connectivité Supabase\n\n`
  if (connectivityReport) {
    markdown += `**Statut** : ${connectivityReport.summary.allTestsPassed ? '✅ **SUCCÈS**' : '❌ **ÉCHEC**'}\n\n`
    markdown += `- Tests réussis : ${connectivityReport.summary.passedTests}/${connectivityReport.summary.totalTests}\n\n`

    markdown += `### Détails des Tests\n\n`

    // Test 1: Disponibilité
    const appTest = connectivityReport.tests.appAvailability
    markdown += `#### 1. Disponibilité de l'Application\n`
    markdown += `- **Statut** : ${appTest.success ? '✅ OK' : '❌ ÉCHEC'}\n`
    if (appTest.status) markdown += `- **HTTP Status** : ${appTest.status}\n`
    if (appTest.hasAppMount !== undefined) {
      markdown += `- **Point de montage** : ${appTest.hasAppMount ? '✅ Trouvé' : '❌ Non trouvé'}\n`
    }
    markdown += `\n`

    // Test 2: Variables dans bundle
    const envTest = connectivityReport.tests.envVarsInBundle
    markdown += `#### 2. Variables d'Environnement dans le Bundle\n`
    if (envTest.error) {
      markdown += `- **Statut** : ❌ Erreur\n`
      markdown += `- **Erreur** : ${envTest.error}\n`
    } else {
      markdown += `- **Statut** : ${envTest.success ? '✅ OK' : '⚠️  PARTIEL'}\n`
      markdown += `- **VITE_SUPABASE_URL** : ${envTest.hasSupabaseUrl ? '✅' : '❌'}\n`
      markdown += `- **VITE_SUPABASE_ANON_KEY** : ${envTest.hasSupabaseKey ? '✅' : '❌'}\n`
      if (envTest.hasUndefinedError) {
        markdown += `- ⚠️  **Erreurs 'undefined' détectées**\n`
      }
    }
    markdown += `\n`

    // Test 3: Supabase direct
    const supabaseTest = connectivityReport.tests.supabaseDirect
    markdown += `#### 3. Connexion Supabase Directe\n`
    if (supabaseTest.skipped) {
      markdown += `- **Statut** : ⚪ Ignoré\n`
      markdown += `- **Raison** : ${supabaseTest.reason}\n`
    } else {
      markdown += `- **Statut** : ${supabaseTest.success ? '✅ OK' : '❌ ÉCHEC'}\n`
      if (supabaseTest.status) markdown += `- **HTTP Status** : ${supabaseTest.status}\n`
    }
    markdown += `\n`

    markdown += `📄 **Rapport complet** : [SUPABASE_CONNECTIVITY_LOG.md](./SUPABASE_CONNECTIVITY_LOG.md)\n\n`
  } else {
    markdown += `⚠️  **Rapport non disponible**\n\n`
    markdown += `Exécutez \`npm run audit:supabase\` pour générer le rapport.\n\n`
  }

  markdown += `---\n\n`

  // Section Configuration Supabase
  markdown += `## 3️⃣ Configuration Supabase\n\n`
  markdown += `📄 **Guide de validation** : [SUPABASE_CONFIG_VALIDATION_REPORT.md](./SUPABASE_CONFIG_VALIDATION_REPORT.md)\n\n`
  markdown += `⚠️  **Action requise** : Compléter manuellement le guide de validation dans le Dashboard Supabase.\n\n`

  markdown += `### Checklist Rapide\n\n`
  markdown += `- [ ] Site URL = \`https://doogoo.vercel.app\`\n`
  markdown += `- [ ] Redirect URLs inclut \`https://doogoo.vercel.app/**\`\n`
  markdown += `- [ ] Templates email utilisent \`{{ .ConfirmationURL }}\`\n`
  markdown += `- [ ] Test OAuth Google réussi\n`
  markdown += `- [ ] Test OAuth Apple réussi\n`
  markdown += `\n`

  markdown += `---\n\n`

  // Actions Correctives
  if (overallStatus !== '✅ HEALTHY') {
    markdown += `## 🔧 Actions Correctives\n\n`

    if (vercelReport && vercelReport.localEnvironment.missingVars.length > 0) {
      markdown += `### 1. Variables Vercel Manquantes\n\n`
      markdown += `1. Aller dans [Vercel Dashboard](https://vercel.com/dashboard)\n`
      markdown += `2. Sélectionner le projet **Doogoo**\n`
      markdown += `3. **Settings → Environment Variables**\n`
      markdown += `4. Ajouter les variables manquantes :\n\n`
      vercelReport.localEnvironment.missingVars.forEach(key => {
        markdown += `   - \`${key}\`\n`
      })
      markdown += `\n`
      markdown += `5. **IMPORTANT** : Cocher **"Included in Build"** pour chaque variable\n`
      markdown += `6. Sauvegarder\n`
      markdown += `7. **Redeploy** le dernier déploiement\n\n`
    }

    if (connectivityReport && !connectivityReport.summary.allTestsPassed) {
      markdown += `### 2. Problèmes de Connectivité\n\n`

      if (!connectivityReport.tests.appAvailability.success) {
        markdown += `- **Application non disponible** : Vérifier les logs de déploiement Vercel\n\n`
      }

      if (
        !connectivityReport.tests.envVarsInBundle.success ||
        connectivityReport.tests.envVarsInBundle.hasUndefinedError
      ) {
        markdown += `- **Variables non injectées** :\n`
        markdown += `  1. Vérifier "Included in Build" dans Vercel\n`
        markdown += `  2. Forcer un nouveau build (commit vide)\n`
        markdown += `  3. Vérifier que les variables ne sont pas vides\n\n`
      }

      if (
        connectivityReport.tests.supabaseDirect &&
        !connectivityReport.tests.supabaseDirect.success
      ) {
        markdown += `- **Connexion Supabase échoue** :\n`
        markdown += `  1. Vérifier que \`VITE_SUPABASE_URL\` est correcte\n`
        markdown += `  2. Vérifier que \`VITE_SUPABASE_ANON_KEY\` est valide\n`
        markdown += `  3. Vérifier les logs Supabase pour erreurs\n\n`
      }
    }

    markdown += `### 3. Configuration Supabase\n\n`
    markdown += `1. Aller dans [Supabase Dashboard](https://app.supabase.com)\n`
    markdown += `2. **Authentication → URL Configuration**\n`
    markdown += `3. Vérifier **Site URL** = \`https://doogoo.vercel.app\`\n`
    markdown += `4. Ajouter **Redirect URLs** : \`https://doogoo.vercel.app/**\`\n`
    markdown += `5. Sauvegarder\n\n`
  }

  markdown += `---\n\n`

  // Commandes Utiles
  markdown += `## 📋 Commandes Utiles\n\n`
  markdown += `\`\`\`bash\n`
  markdown += `# Audit des variables Vercel\n`
  markdown += `npm run audit:vercel\n\n`
  markdown += `# Test de connectivité Supabase\n`
  markdown += `npm run audit:supabase\n\n`
  markdown += `# Tous les audits\n`
  markdown += `npm run audit:all\n\n`
  markdown += `# Générer le rapport de santé\n`
  markdown += `npm run audit:health\n`
  markdown += `\`\`\`\n\n`

  markdown += `---\n\n`

  markdown += `## 📊 Statut Final\n\n`
  markdown += `| Composant | Statut |\n`
  markdown += `|-----------|--------|\n`

  if (vercelReport) {
    markdown += `| Variables Vercel | ${vercelReport.summary.status} |\n`
  } else {
    markdown += `| Variables Vercel | ⚪ Non vérifié |\n`
  }

  if (connectivityReport) {
    markdown += `| Connectivité Supabase | ${connectivityReport.summary.allTestsPassed ? '✅ OK' : '❌ ÉCHEC'} |\n`
  } else {
    markdown += `| Connectivité Supabase | ⚪ Non vérifié |\n`
  }

  markdown += `| Configuration Supabase | ⚪ Validation manuelle requise |\n`

  markdown += `\n`
  markdown += `**Statut Global** : **${overallStatus}**\n\n`

  markdown += `---\n\n`
  markdown += `**Dernière mise à jour** : ${timestamp}\n`

  // Sauvegarde le rapport
  const reportPath = join(docsDir, 'DOOGOO_DEPLOYMENT_HEALTH_REPORT.md')
  writeFileSync(reportPath, markdown, 'utf-8')

  console.log('\n' + '═'.repeat(60))
  console.log('🏥 RAPPORT DE SANTÉ DOOGOO')
  console.log('═'.repeat(60))
  console.log(`\n📊 Statut Global : ${overallStatus}\n`)

  if (issues.length > 0) {
    console.log('⚠️  Problèmes détectés :')
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`)
    })
  } else {
    console.log('✅ Aucun problème détecté\n')
  }

  console.log(`\n✅ Rapport généré : ${reportPath}\n`)
  console.log('═'.repeat(60) + '\n')

  return { overallStatus, issues }
}

// Exécution
try {
  generateHealthReport()
  process.exit(0)
} catch (error) {
  console.error('\n❌ Erreur lors de la génération du rapport:', error.message)
  console.error(error.stack)
  process.exit(1)
}
