import puppeteer from 'puppeteer'

const PREVIEW_URL = 'http://localhost:4173'

console.log('🧪 Test PWA - Installabilité et Mode Offline')
console.log('=============================================\n')

let browser
let page

try {
  // Vérifier que le serveur est accessible
  const response = await fetch(PREVIEW_URL)
  if (!response.ok) {
    throw new Error(`Serveur non accessible (${response.status})`)
  }
  console.log('✅ Serveur de preview accessible\n')

  // Lancer Puppeteer
  console.log('🌐 Lancement du navigateur...')
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  page = await browser.newPage()

  // Test 1: Vérifier le manifest
  console.log('\n📱 Test 1: Vérification du manifest...')
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle2' })

  const manifestLink = await page.$('link[rel="manifest"]')
  if (!manifestLink) {
    console.log('   ❌ Lien manifest introuvable')
  } else {
    const manifestHref = await manifestLink.evaluate(el => el.href)
    console.log(`   ✅ Manifest trouvé: ${manifestHref}`)

    // Récupérer le manifest
    const manifestResponse = await page.goto(manifestHref)
    const manifest = await manifestResponse.json()

    console.log(`   ✅ Nom: ${manifest.name}`)
    console.log(`   ✅ Short name: ${manifest.short_name}`)
    console.log(`   ✅ Start URL: ${manifest.start_url}`)
    console.log(`   ✅ Display: ${manifest.display}`)
    console.log(`   ✅ Theme color: ${manifest.theme_color}`)
    console.log(`   ✅ Background color: ${manifest.background_color}`)
    console.log(`   ✅ Icônes: ${manifest.icons?.length || 0} trouvées`)

    // Vérifier les icônes requises
    const requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512]
    const foundSizes =
      manifest.icons
        ?.map(icon => {
          const match = icon.sizes?.match(/(\d+)x\d+/)
          return match ? parseInt(match[1]) : null
        })
        .filter(Boolean) || []

    const missingSizes = requiredSizes.filter(size => !foundSizes.includes(size))
    if (missingSizes.length > 0) {
      console.log(`   ⚠️  Tailles manquantes: ${missingSizes.join(', ')}`)
    } else {
      console.log("   ✅ Toutes les tailles d'icônes requises sont présentes")
    }
  }

  // Test 2: Vérifier le service worker
  console.log('\n⚙️  Test 2: Vérification du Service Worker...')
  const serviceWorkers = await page.evaluate(() => {
    return navigator.serviceWorker.getRegistrations().then(regs =>
      regs.map(reg => ({
        scope: reg.scope,
        active: !!reg.active,
        installing: !!reg.installing,
        waiting: !!reg.waiting
      }))
    )
  })

  if (serviceWorkers.length === 0) {
    console.log('   ❌ Aucun service worker enregistré')
  } else {
    console.log(`   ✅ ${serviceWorkers.length} service worker(s) trouvé(s)`)
    serviceWorkers.forEach((sw, i) => {
      console.log(`      ${i + 1}. Scope: ${sw.scope}`)
      console.log(`         Active: ${sw.active ? '✅' : '❌'}`)
    })
  }

  // Test 3: Test mode offline
  console.log('\n📴 Test 3: Test du mode offline...')

  // Attendre que le cache soit rempli
  await page.waitForTimeout(3000)

  // Passer en mode offline
  await page.setOfflineMode(true)
  console.log('   ✅ Mode offline activé')

  // Essayer de recharger la page
  try {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 5000 })
    const pageTitle = await page.title()
    console.log(`   ✅ Page rechargée en offline: "${pageTitle}"`)
    console.log('   ✅ Le PWA fonctionne en mode offline')
  } catch (error) {
    console.log('   ❌ Erreur lors du rechargement offline:', error.message)
  }

  // Test 4: Vérifier l'installabilité
  console.log("\n📥 Test 4: Vérification de l'installabilité...")

  // Remettre en ligne pour les tests suivants
  await page.setOfflineMode(false)

  // Vérifier si l'événement beforeinstallprompt est disponible
  const installabilityCheck = await page.evaluate(() => {
    return new Promise(resolve => {
      const check = () => {
        // Vérifier les critères d'installabilité
        // eslint-disable-next-line no-undef
        const hasManifest = document.querySelector('link[rel="manifest"]') !== null
        const hasServiceWorker = 'serviceWorker' in navigator

        resolve({
          hasManifest,
          hasServiceWorker,
          // Autres vérifications...
          // eslint-disable-next-line no-undef
          isSecure: location.protocol === 'https:' || location.hostname === 'localhost'
        })
      }

      // Attendre un peu pour que le SW soit enregistré
      setTimeout(check, 2000)
    })
  })

  console.log(`   ✅ Manifest présent: ${installabilityCheck.hasManifest ? '✅' : '❌'}`)
  console.log(`   ✅ Service Worker support: ${installabilityCheck.hasServiceWorker ? '✅' : '❌'}`)
  console.log(`   ✅ Contexte sécurisé: ${installabilityCheck.isSecure ? '✅' : '❌'}`)

  if (
    installabilityCheck.hasManifest &&
    installabilityCheck.hasServiceWorker &&
    installabilityCheck.isSecure
  ) {
    console.log('   ✅ Le PWA est installable')
  } else {
    console.log('   ⚠️  Le PWA pourrait ne pas être installable (vérifiez les critères ci-dessus)')
  }

  console.log('\n✅ Tests terminés !\n')
} catch (error) {
  console.error('\n❌ Erreur lors des tests:', error.message)
  process.exit(1)
} finally {
  if (browser) {
    await browser.close()
  }
}
