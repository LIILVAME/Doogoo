#!/usr/bin/env node

/**
 * Script d'audit des variables d'environnement Vercel
 * Vérifie que les variables requises sont présentes et correctement configurées
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const REQUIRED_ENV_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

const OPTIONAL_ENV_VARS = ['VITE_APP_NAME', 'VITE_ADMIN_EMAIL', 'VITE_SENTRY_DSN']

/**
 * Vérifie si un fichier .env existe localement
 */
function checkLocalEnv() {
  const envFiles = ['.env', '.env.local', '.env.production']
  const found = envFiles.filter(file => existsSync(join(rootDir, file)))

  return {
    hasEnvFiles: found.length > 0,
    envFiles: found
  }
}

/**
 * Extrait les variables d'environnement d'un fichier .env
 */
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  const content = readFileSync(filePath, 'utf-8')
  const vars = {}

  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        vars[key.trim()] = valueParts
          .join('=')
          .trim()
          .replace(/^["']|["']$/g, '')
      }
    }
  })

  return vars
}

/**
 * Vérifie les variables d'environnement locales
 */
function checkLocalEnvVars() {
  const envFiles = ['.env', '.env.local', '.env.production']
  let allVars = {}

  envFiles.forEach(file => {
    const filePath = join(rootDir, file)
    if (existsSync(filePath)) {
      const vars = parseEnvFile(filePath)
      allVars = { ...allVars, ...vars }
    }
  })

  const required = {}
  const missing = []
  const optional = {}

  REQUIRED_ENV_VARS.forEach(key => {
    if (allVars[key]) {
      required[key] = allVars[key] ? '✓ Définie' : '✗ Manquante'
    } else {
      missing.push(key)
      required[key] = '✗ Manquante'
    }
  })

  OPTIONAL_ENV_VARS.forEach(key => {
    optional[key] = allVars[key] ? '✓ Définie' : '○ Optionnelle (non définie)'
  })

  return { required, missing, optional, allVars }
}

/**
 * Vérifie le dernier commit et le statut Git
 */
function checkGitStatus() {
  try {
    const lastCommit = execSync('git log -1 --oneline', { cwd: rootDir, encoding: 'utf-8' }).trim()
    const branch = execSync('git branch --show-current', { cwd: rootDir, encoding: 'utf-8' }).trim()
    const hasUncommitted =
      execSync('git status --porcelain', { cwd: rootDir, encoding: 'utf-8' }).trim().length > 0

    return {
      lastCommit,
      branch,
      hasUncommitted,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

/**
 * Vérifie le build local
 */
function checkLocalBuild() {
  try {
    // Vérifie si dist/ existe
    const distExists = existsSync(join(rootDir, 'dist'))

    if (!distExists) {
      return {
        hasBuild: false,
        message: 'Aucun build trouvé. Exécutez "npm run build"'
      }
    }

    // Vérifie si index.html existe dans dist/
    const indexExists = existsSync(join(rootDir, 'dist', 'index.html'))

    // Vérifie si les assets existent
    const assetsDir = join(rootDir, 'dist', 'assets')
    const hasAssets = existsSync(assetsDir)

    return {
      hasBuild: true,
      hasIndex: indexExists,
      hasAssets,
      buildDate: distExists ? statSync(join(rootDir, 'dist')).mtime.toISOString() : null
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

/**
 * Génère le rapport d'audit
 */
function generateReport() {
  const localEnv = checkLocalEnv()
  const envVars = checkLocalEnvVars()
  const gitStatus = checkGitStatus()
  const buildStatus = checkLocalBuild()

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      status: envVars.missing.length === 0 ? '✅ OK' : '⚠️ VARIABLES MANQUANTES',
      requiredVarsPresent: REQUIRED_ENV_VARS.length - envVars.missing.length,
      requiredVarsTotal: REQUIRED_ENV_VARS.length
    },
    localEnvironment: {
      hasEnvFiles: localEnv.hasEnvFiles,
      envFiles: localEnv.envFiles,
      requiredVars: envVars.required,
      optionalVars: envVars.optional,
      missingVars: envVars.missing
    },
    git: gitStatus,
    build: buildStatus,
    recommendations: []
  }

  // Génère les recommandations
  if (envVars.missing.length > 0) {
    report.recommendations.push({
      severity: 'CRITICAL',
      message: `Variables manquantes : ${envVars.missing.join(', ')}`,
      action:
        'Ajouter ces variables dans Vercel Dashboard → Settings → Environment Variables et cocher "Included in Build"'
    })
  }

  if (!localEnv.hasEnvFiles) {
    report.recommendations.push({
      severity: 'WARNING',
      message: 'Aucun fichier .env trouvé localement',
      action: 'Créer un fichier .env.local avec les variables requises pour le développement local'
    })
  }

  if (!buildStatus.hasBuild) {
    report.recommendations.push({
      severity: 'INFO',
      message: 'Aucun build trouvé',
      action: 'Exécutez "npm run build" pour générer un build local'
    })
  }

  if (gitStatus.hasUncommitted) {
    report.recommendations.push({
      severity: 'WARNING',
      message: 'Modifications non commitées détectées',
      action: 'Commit et push vos changements avant de déployer'
    })
  }

  return report
}

// Exécution
try {
  const report = generateReport()

  console.log("\n🔍 AUDIT DES VARIABLES D'ENVIRONNEMENT VERCEL\n")
  console.log('═'.repeat(60))
  console.log(`📅 Date: ${report.timestamp}\n`)

  console.log('📊 RÉSUMÉ:')
  console.log(`   Statut: ${report.summary.status}`)
  console.log(
    `   Variables requises présentes: ${report.summary.requiredVarsPresent}/${report.summary.requiredVarsTotal}\n`
  )

  console.log('📁 VARIABLES REQUISES:')
  Object.entries(report.localEnvironment.requiredVars).forEach(([key, value]) => {
    console.log(`   ${value} ${key}`)
  })

  console.log('\n📁 VARIABLES OPTIONNELLES:')
  Object.entries(report.localEnvironment.optionalVars).forEach(([key, value]) => {
    console.log(`   ${value} ${key}`)
  })

  if (report.localEnvironment.missingVars.length > 0) {
    console.log('\n❌ VARIABLES MANQUANTES:')
    report.localEnvironment.missingVars.forEach(key => {
      console.log(`   ✗ ${key}`)
    })
  }

  console.log('\n📝 GIT:')
  if (report.git.error) {
    console.log(`   ⚠️  Erreur: ${report.git.error}`)
  } else {
    console.log(`   Branche: ${report.git.branch}`)
    console.log(`   Dernier commit: ${report.git.lastCommit}`)
    if (report.git.hasUncommitted) {
      console.log(`   ⚠️  Modifications non commitées`)
    }
  }

  console.log('\n🏗️  BUILD:')
  if (report.build.error) {
    console.log(`   ⚠️  Erreur: ${report.build.error}`)
  } else {
    console.log(`   Build existant: ${report.build.hasBuild ? '✅ Oui' : '❌ Non'}`)
    if (report.build.hasBuild) {
      console.log(`   index.html: ${report.build.hasIndex ? '✅' : '❌'}`)
      console.log(`   Assets: ${report.build.hasAssets ? '✅' : '❌'}`)
      if (report.build.buildDate) {
        console.log(`   Date du build: ${report.build.buildDate}`)
      }
    }
  }

  if (report.recommendations.length > 0) {
    console.log('\n💡 RECOMMANDATIONS:')
    report.recommendations.forEach(rec => {
      const icon = rec.severity === 'CRITICAL' ? '🔴' : rec.severity === 'WARNING' ? '🟡' : '🔵'
      console.log(`\n   ${icon} ${rec.severity}: ${rec.message}`)
      console.log(`      Action: ${rec.action}`)
    })
  }

  console.log('\n' + '═'.repeat(60))
  console.log('\n⚠️  IMPORTANT: Ce script vérifie uniquement la configuration locale.')
  console.log(
    '   Pour vérifier Vercel, allez dans le Dashboard → Settings → Environment Variables\n'
  )

  // Assure que le dossier docs existe
  const docsDir = join(rootDir, 'docs')
  if (!existsSync(docsDir)) {
    mkdirSync(docsDir, { recursive: true })
  }

  // Sauvegarde le rapport JSON
  const reportPath = join(docsDir, 'VERCEL_ENV_AUDIT_REPORT.md')

  // Génère le rapport Markdown
  let markdown = `# 🔍 Rapport d'Audit - Variables d'Environnement Vercel\n\n`
  markdown += `**Date** : ${report.timestamp}\n\n`

  markdown += `## 📊 Résumé\n\n`
  markdown += `- **Statut** : ${report.summary.status}\n`
  markdown += `- **Variables requises présentes** : ${report.summary.requiredVarsPresent}/${report.summary.requiredVarsTotal}\n\n`

  markdown += `## 📁 Variables d'Environnement\n\n`
  markdown += `### Requises\n\n`
  Object.entries(report.localEnvironment.requiredVars).forEach(([key, value]) => {
    markdown += `- ${value} \`${key}\`\n`
  })

  markdown += `\n### Optionnelles\n\n`
  Object.entries(report.localEnvironment.optionalVars).forEach(([key, value]) => {
    markdown += `- ${value} \`${key}\`\n`
  })

  if (report.localEnvironment.missingVars.length > 0) {
    markdown += `\n### ❌ Manquantes\n\n`
    report.localEnvironment.missingVars.forEach(key => {
      markdown += `- \`${key}\`\n`
    })
  }

  markdown += `\n## 📝 Git\n\n`
  if (report.git.error) {
    markdown += `⚠️ Erreur: ${report.git.error}\n\n`
  } else {
    markdown += `- **Branche** : ${report.git.branch}\n`
    markdown += `- **Dernier commit** : ${report.git.lastCommit}\n`
    if (report.git.hasUncommitted) {
      markdown += `- ⚠️ **Modifications non commitées**\n`
    }
  }

  markdown += `\n## 🏗️ Build Local\n\n`
  if (report.build.error) {
    markdown += `⚠️ Erreur: ${report.build.error}\n\n`
  } else {
    markdown += `- **Build existant** : ${report.build.hasBuild ? '✅ Oui' : '❌ Non'}\n`
    if (report.build.hasBuild) {
      markdown += `- **index.html** : ${report.build.hasIndex ? '✅' : '❌'}\n`
      markdown += `- **Assets** : ${report.build.hasAssets ? '✅' : '❌'}\n`
      if (report.build.buildDate) {
        markdown += `- **Date du build** : ${report.build.buildDate}\n`
      }
    }
  }

  if (report.recommendations.length > 0) {
    markdown += `\n## 💡 Recommandations\n\n`
    report.recommendations.forEach(rec => {
      const icon = rec.severity === 'CRITICAL' ? '🔴' : rec.severity === 'WARNING' ? '🟡' : '🔵'
      markdown += `### ${icon} ${rec.severity}\n\n`
      markdown += `**Message** : ${rec.message}\n\n`
      markdown += `**Action** : ${rec.action}\n\n`
    })
  }

  markdown += `\n## ⚠️ Actions Requises dans Vercel\n\n`
  markdown += `1. Aller dans [Vercel Dashboard](https://vercel.com/dashboard)\n`
  markdown += `2. Sélectionner le projet **Doogoo**\n`
  markdown += `3. Aller dans **Settings → Environment Variables**\n`
  markdown += `4. Vérifier que chaque variable requise existe\n`
  markdown += `5. **IMPORTANT** : Cocher **"Included in Build"** pour chaque variable\n`
  markdown += `6. Sauvegarder et **Redeploy** le dernier déploiement\n\n`

  markdown += `## 📋 Checklist Vercel\n\n`
  REQUIRED_ENV_VARS.forEach(key => {
    markdown += `- [ ] \`${key}\` présente et "Included in Build" ✅\n`
  })
  OPTIONAL_ENV_VARS.forEach(key => {
    markdown += `- [ ] \`${key}\` (optionnel)\n`
  })

  writeFileSync(reportPath, markdown, 'utf-8')
  console.log(`\n✅ Rapport sauvegardé: ${reportPath}\n`)

  // Sauvegarde aussi le JSON pour traitement ultérieur
  const jsonPath = join(rootDir, 'docs', 'VERCEL_ENV_AUDIT_REPORT.json')
  writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8')

  process.exit(report.localEnvironment.missingVars.length > 0 ? 1 : 0)
} catch (error) {
  console.error("\n❌ Erreur lors de l'audit:", error.message)
  console.error(error.stack)
  process.exit(1)
}
