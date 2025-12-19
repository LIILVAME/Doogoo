import { jsPDF } from 'jspdf'
import type { PaymentData } from '@/stores/paymentsStore'
import type { PropertyData } from '@/stores/propertiesStore'
import type { TenantData } from '@/stores/tenantsStore'
import { useAuthStore } from '@/stores/authStore'

/**
 * Helper pour nettoyer le formatage monétaire (espace simple vs insécable pour PDF)
 * jspdf ne gère pas bien les espaces insécables (\u00A0, \u202F) utilisés par Intl.NumberFormat
 */
const formatCurrencyClean = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })
    .format(amount)
    .replace(/\s/g, ' ') // Remplace les espaces insécables
}

/**
 * Interface pour les données nécessaires à la génération d'une quittance
 */
export interface RentReceiptData {
  payment: PaymentData
  tenant: TenantData | null
  property: PropertyData | null
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  ownerAddress?: string // Adresse postale du propriétaire (pour l'en-tête des documents)
}

/**
 * Génère une quittance de loyer au format PDF et déclenche son téléchargement
 *
 * @param data - Données nécessaires pour la quittance (paiement, locataire, propriété, propriétaire)
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * await generateRentReceipt({
 *   payment: paymentData,
 *   tenant: tenantData,
 *   property: propertyData,
 *   ownerName: 'Jean Dupont',
 *   ownerEmail: 'jean@example.com'
 * })
 * ```
 */
export async function generateRentReceipt(data: RentReceiptData): Promise<void> {
  const { payment, tenant, property } = data
  const authStore = useAuthStore()

  // Validation : le paiement doit être payé
  if (payment.status !== 'paid') {
    throw new Error('Une quittance ne peut être générée que pour un paiement avec le statut "paid"')
  }

  const doc = new jsPDF()

  // Données Propriétaire
  const ownerName = data.ownerName || authStore.profile?.full_name || authStore.user?.email || 'Propriétaire'
  const ownerEmail = data.ownerEmail || authStore.user?.email || ''
  const ownerPhone = data.ownerPhone || authStore.profile?.phone || ''
  const ownerAddress = data.ownerAddress || authStore.profile?.address || ''

  // Données Locataire
  const tenantName = tenant?.name || 'Locataire'
  const tenantAddress = property?.address || property?.name || ''

  // Période
  const paymentDate = payment.dueDate ? new Date(payment.dueDate) : new Date(payment.createdAt || new Date())
  const month = paymentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
  const startDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1)
  const endDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0)
  const periodStr = `du ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`

  // Montant
  const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount || 0

  // --- Mise en page ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPRIÉTAIRE', 20, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(ownerName, 20, 30)
  if (ownerEmail) {
    doc.text(ownerEmail, 20, 35)
  }
  if (ownerPhone) {
    doc.text(ownerPhone, 20, 40)
  }
  if (ownerAddress) {
    const addressLines = doc.splitTextToSize(ownerAddress, 80)
    doc.text(addressLines, 20, ownerPhone ? 45 : ownerEmail ? 40 : 35)
  }

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(79, 70, 229)
  doc.text('QUITTANCE DE LOYER', 105, 20, { align: 'center' })
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Document justificatif de paiement', 105, 28, { align: 'center' })
  doc.setTextColor(0)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('LOCATAIRE', 120, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(tenantName, 120, 50)
  if (tenantAddress) {
    const tenantAddrLines = doc.splitTextToSize(tenantAddress, 70)
    doc.text(tenantAddrLines, 120, 55)
  }

  doc.setDrawColor(200)
  doc.line(20, 75, 190, 75)

  let currentY = 90
  doc.setFont('helvetica', 'bold')
  doc.text('Période :', 20, currentY)
  doc.setFont('helvetica', 'normal')
  doc.text(periodStr, 60, currentY)

  currentY += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Bien loué :', 20, currentY)
  doc.setFont('helvetica', 'normal')
  doc.text(property?.name || '', 60, currentY)

  currentY += 20
  doc.setFillColor(245, 247, 250)
  doc.rect(20, currentY - 5, 170, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.text('Détail', 25, currentY + 1)
  doc.text('Montant', 160, currentY + 1)

  currentY += 15
  doc.setFont('helvetica', 'normal')
  doc.text('Loyer nu (hors charges)', 25, currentY)
  doc.text(formatCurrencyClean(amount), 160, currentY)

  currentY += 15
  doc.setDrawColor(0)
  doc.line(110, currentY - 5, 180, currentY - 5)
  doc.setFont('helvetica', 'bold')
  doc.text('Total payé :', 110, currentY + 5)
  doc.text(formatCurrencyClean(amount), 160, currentY + 5)

  currentY += 20
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(
    `Date du paiement : ${new Date(payment.createdAt || new Date()).toLocaleDateString('fr-FR')}`,
    20,
    currentY
  )

  // --- CORRECTION WRAPPING TEXTE LÉGAL ---
  currentY += 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 20
  const maxTextWidth = pageWidth - marginX * 2

  const legalText = `Je soussigné(e) ${ownerName} certifie avoir reçu la somme de ${formatCurrencyClean(amount)} au titre du loyer et des charges pour la période mentionnée ci-dessus. Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte.`

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  // Utilisation de splitTextToSize pour gérer le retour à la ligne
  const legalLines = doc.splitTextToSize(legalText, maxTextWidth)
  doc.text(legalLines, marginX, currentY)

  // Ajustement de Y pour la signature
  // Calcul de la hauteur : nombre de lignes * hauteur de ligne (environ 4.5mm par ligne pour font size 10)
  const lineHeight = 4.5
  const textHeight = legalLines.length * lineHeight
  currentY += textHeight + 15

  // Signature
  const cityMatch = ownerAddress.match(/\d{5}\s+([^,]+)/) || ownerAddress.split(',').pop()
  const city = cityMatch ? (Array.isArray(cityMatch) ? cityMatch[1] : cityMatch).trim() : property?.city || '...'

  doc.text(`Fait à ${city}, le ${new Date().toLocaleDateString('fr-FR')}`, 120, currentY)
  doc.text('Signature du propriétaire', 120, currentY + 10)

  const fileName = `Quittance_${tenantName.replace(/\s+/g, '_')}_${month}.pdf`
  doc.save(fileName)
}
