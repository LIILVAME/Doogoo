import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const iconsDir = path.join(__dirname, '..', 'public', 'icons')

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Tailles d'icônes requises pour PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// SVG de base avec logo Doogoo (icône maison verte)
const generateIconSVG = size => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#ffffff" rx="${size * 0.2}"/>
  <g transform="translate(${size * 0.25}, ${size * 0.25}) scale(${(size * 0.5) / 100})">
    <!-- Maison stylisée Doogoo -->
    <path d="M50 10 L90 40 L90 80 L70 80 L70 60 L50 60 L50 80 L10 80 L10 40 Z" 
          fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
    <!-- Porte -->
    <rect x="42" y="60" width="16" height="20" fill="#16a34a"/>
    <!-- Fenêtres -->
    <rect x="20" y="45" width="12" height="12" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
    <rect x="68" y="45" width="12" height="12" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
  </g>
</svg>`

console.log('🎨 Génération des icônes PWA...')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('⚠️  Sharp non installé, génération SVG uniquement')
  console.warn('   Installez avec: npm install --save-dev sharp')
}

for (const size of sizes) {
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`)
  const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`)

  // Générer SVG
  const svg = generateIconSVG(size)
  fs.writeFileSync(svgPath, svg)

  // Convertir en PNG si sharp est disponible
  if (sharp) {
    try {
      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pngPath)
      console.log(`✅ Icône ${size}x${size} PNG générée`)
    } catch (err) {
      console.warn(`⚠️  Erreur génération PNG ${size}x${size}:`, err.message)
      console.log(`✅ Icône ${size}x${size} SVG générée (PNG non disponible)`)
    }
  } else {
    console.log(`✅ Icône ${size}x${size} SVG générée (PNG nécessite sharp)`)
  }
}

console.log('\n✅ Icônes générées dans public/icons/')
