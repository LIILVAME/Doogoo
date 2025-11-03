import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PREVIEW_URL = 'http://localhost:4173'
const AUDITS_DIR = path.join(__dirname, '..', 'docs', 'audits')
const DATE = new Date().toISOString().replace(/:/g, '-').slice(0, 19).replace('T', '-')

// Créer le dossier audits
if (!fs.existsSync(AUDITS_DIR)) {
  fs.mkdirSync(AUDITS_DIR, { recursive: true })
}

const REPORT_HTML = path.join(AUDITS_DIR, `lighthouse-${DATE}.html`)
const REPORT_JSON = path.join(AUDITS_DIR, `lighthouse-${DATE}.json`)

console.log('🚀 Audit Lighthouse PWA Doogoo')
console.log('==============================\n')

// Vérifier que le serveur répond
try {
  const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${PREVIEW_URL}`, {
    encoding: 'utf-8'
  })
  if (response.trim() !== '200') {
    throw new Error(`Serveur non accessible (HTTP ${response.trim()})`)
  }
  console.log('✅ Serveur de preview accessible\n')
} catch {
  console.error("❌ Erreur: Le serveur de preview n'est pas accessible")
  console.error(`   Assurez-vous que "npm run preview" est en cours`)
  console.error(`   URL attendue: ${PREVIEW_URL}`)
  process.exit(1)
}

// Exécuter Lighthouse
console.log('📊 Exécution de Lighthouse...\n')

try {
  execSync(
    `npx lighthouse "${PREVIEW_URL}" ` +
      `--output=html,json ` +
      `--output-path="${AUDITS_DIR}/lighthouse-${DATE}" ` +
      `--chrome-flags="--headless --no-sandbox" ` +
      `--quiet=false`,
    { stdio: 'inherit' }
  )

  // Renommer les fichiers
  const tempHtml = path.join(AUDITS_DIR, `lighthouse-${DATE}.html`)
  const tempJson = path.join(AUDITS_DIR, `lighthouse-${DATE}.json`)

  if (fs.existsSync(tempHtml)) {
    fs.renameSync(tempHtml, REPORT_HTML)
  }
  if (fs.existsSync(tempJson)) {
    fs.renameSync(tempJson, REPORT_JSON)
  }

  console.log('\n✅ Audit terminé !\n')
  console.log(`📄 Rapport HTML: ${REPORT_HTML}`)
  console.log(`📊 Rapport JSON: ${REPORT_JSON}\n`)

  // Extraire les scores
  if (fs.existsSync(REPORT_JSON)) {
    const report = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf-8'))
    const categories = report.categories || {}

    console.log('📊 Scores Lighthouse:\n')
    console.log(`   Performance:      ${Math.round((categories.performance?.score || 0) * 100)}`)
    console.log(`   Accessibilité:    ${Math.round((categories.accessibility?.score || 0) * 100)}`)
    console.log(
      `   Bonnes pratiques: ${Math.round((categories['best-practices']?.score || 0) * 100)}`
    )
    console.log(`   SEO:              ${Math.round((categories.seo?.score || 0) * 100)}`)
    console.log(`   PWA:              ${Math.round((categories.pwa?.score || 0) * 100)}\n`)

    // Vérifier les critères PWA
    const audits = report.audits || {}
    console.log('📱 Critères PWA:\n')
    console.log(`   Installable:      ${audits['installable-manifest']?.score === 1 ? '✅' : '❌'}`)
    console.log(`   Service Worker:   ${audits['service-worker']?.score === 1 ? '✅' : '❌'}`)
    console.log(`   Manifest:         ${audits['manifest-exists']?.score === 1 ? '✅' : '❌'}`)
    console.log(`   Offline:          ${audits['offline-start-url']?.score === 1 ? '✅' : '❌'}\n`)
  }

  console.log(`💡 Ouvrez ${REPORT_HTML} dans votre navigateur pour voir les détails complets`)
} catch (error) {
  console.error("\n❌ Erreur lors de l'audit:", error.message)
  process.exit(1)
}
