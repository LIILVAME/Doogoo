import { jsPDF } from 'jspdf'
import type { PaymentData } from '@/stores/paymentsStore'
import type { PropertyData } from '@/stores/propertiesStore'
import type { TenantData } from '@/stores/tenantsStore'
import { formatCurrency, formatDate } from './formatters'

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
  const { payment, tenant, property, ownerName, ownerEmail, ownerPhone, ownerAddress } = data

  // Validation : le paiement doit être payé
  if (payment.status !== 'paid') {
    throw new Error('Une quittance ne peut être générée que pour un paiement avec le statut "paid"')
  }

  // Initialise le document PDF A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPosition = margin

  // Couleurs
  const primaryColor = [34, 197, 94] // Vert (emerald-500)
  const grayColor = [107, 114, 128] // Gray-500
  const darkGrayColor = [55, 65, 81] // Gray-700

  // ============================================
  // EN-TÊTE
  // ============================================

  // Titre principal
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, pageWidth, 35, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('QUITTANCE DE LOYER', pageWidth / 2, 20, { align: 'center' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Document justificatif de paiement', pageWidth / 2, 28, { align: 'center' })

  yPosition = 50

  // ============================================
  // COORDONNÉES DU PROPRIÉTAIRE (à gauche)
  // ============================================

  doc.setTextColor(...darkGrayColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPRIÉTAIRE', margin, yPosition)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  yPosition += 7

  if (ownerName) {
    doc.setFontSize(11)
    doc.text(ownerName, margin, yPosition)
    yPosition += 7
  }

  if (ownerEmail) {
    doc.setFontSize(9)
    doc.text(ownerEmail, margin, yPosition)
    yPosition += 5
  }

  if (ownerPhone) {
    doc.text(`Tél: ${ownerPhone}`, margin, yPosition)
    yPosition += 5
  }

  if (ownerAddress) {
    doc.setFontSize(9)
    // Découpe l'adresse en lignes si elle est longue
    const addressLines = doc.splitTextToSize(ownerAddress, 80) // 80mm de largeur
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPosition)
      yPosition += 5
    })
  }

  // ============================================
  // COORDONNÉES DU LOCATAIRE (à droite)
  // ============================================

  const rightColumnX = pageWidth - margin - 70
  let destY = 50

  doc.setTextColor(...darkGrayColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('LOCATAIRE', rightColumnX, destY)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  destY += 7

  const tenantName = tenant?.name || payment.tenant || 'Locataire'
  if (tenantName) {
    doc.setFontSize(11)
    doc.text(tenantName, rightColumnX, destY)
    destY += 7
  }

  // Adresse du bien loué (sous le nom du locataire)
  if (property) {
    const propertyAddress = property.address
      ? `${property.address}, ${property.city}`
      : property.city || property.name || 'Adresse non renseignée'

    doc.setFontSize(9)
    doc.text(propertyAddress, rightColumnX, destY)
  }

  yPosition = 90

  // ============================================
  // CORPS : DÉTAILS DE LA QUITTANCE
  // ============================================

  // Ligne de séparation
  doc.setDrawColor(229, 231, 235) // Gray-200
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 12

  // Période couverte
  const dueDate = payment.dueDate ? new Date(payment.dueDate) : new Date()
  const periodStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1)
  const periodEnd = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Période:', margin, yPosition)

  doc.setFont('helvetica', 'normal')
  const periodText = `du ${formatDate(periodStart.toISOString(), { day: 'numeric', month: 'long', year: 'numeric' })} au ${formatDate(periodEnd.toISOString(), { day: 'numeric', month: 'long', year: 'numeric' })}`
  doc.text(periodText, margin + 22, yPosition)
  yPosition += 10

  // Adresse du bien loué (détail)
  if (property) {
    doc.setFontSize(9)
    doc.setTextColor(...grayColor)
    doc.text('Bien loué:', margin, yPosition)
    doc.setTextColor(0, 0, 0)
    const fullAddress = property.address
      ? `${property.address}, ${property.city}`
      : property.city || property.name
    doc.text(fullAddress, margin + 22, yPosition)
    yPosition += 8
  }

  yPosition += 5

  // Tableau des détails
  doc.setFillColor(249, 250, 251) // Gray-50
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F')

  yPosition += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Détail', margin + 5, yPosition)
  doc.text('Montant', pageWidth - margin - 35, yPosition, { align: 'right' })

  yPosition += 10
  doc.setDrawColor(229, 231, 235)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  // Ligne : Loyer nu
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const rentAmount = payment.amount || 0
  const charges = 0 // Charges non gérées pour l'instant (peut être ajouté plus tard)
  const totalAmount = rentAmount + charges

  doc.text('Loyer nu (hors charges)', margin + 5, yPosition)
  doc.text(formatCurrency(rentAmount), pageWidth - margin - 5, yPosition, { align: 'right' })
  yPosition += 8

  // Ligne : Charges (si > 0)
  if (charges > 0) {
    doc.text('Charges', margin + 5, yPosition)
    doc.text(formatCurrency(charges), pageWidth - margin - 5, yPosition, { align: 'right' })
    yPosition += 8
  }

  yPosition += 5
  doc.setDrawColor(200, 200, 200)
  doc.line(pageWidth - margin - 60, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  // Total payé
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...primaryColor)
  doc.text('Total payé:', pageWidth - margin - 45, yPosition)
  doc.text(formatCurrency(totalAmount), pageWidth - margin - 5, yPosition, { align: 'right' })

  yPosition += 12

  // Date du paiement
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  const paymentDateText = payment.dueDate
    ? formatDate(payment.dueDate, { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Non spécifiée'
  doc.text(`Date du paiement: ${paymentDateText}`, margin, yPosition)

  yPosition += 7
  // Mode de règlement (non disponible dans PaymentData, peut être ajouté plus tard)
  doc.text('Mode de règlement: Non spécifié', margin, yPosition)

  yPosition += 20

  // ============================================
  // PIED DE PAGE : PHRASE LÉGALE
  // ============================================

  doc.setDrawColor(229, 231, 235)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 12

  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')

  // Phrase légale
  const ownerNameText = ownerName || 'le propriétaire'
  const amountText = formatCurrency(totalAmount)
  const legalText = `Je soussigné(e) ${ownerNameText} certifie avoir reçu la somme de ${amountText} au titre du loyer et des charges pour la période mentionnée ci-dessus. Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte.`

  // Découpe le texte en lignes pour qu'il s'adapte à la largeur de la page
  // jsPDF gère automatiquement les accents UTF-8 dans les versions récentes (v3.0+)
  const splitLegalText = doc.splitTextToSize(legalText, pageWidth - 2 * margin)
  doc.text(splitLegalText, margin, yPosition, { align: 'justify' })

  yPosition += splitLegalText.length * 6 + 15

  // Date de génération
  const today = new Date()
  const generationDate = formatDate(today.toISOString(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  doc.text(`Fait à ${property?.city || ''}, le ${generationDate}`, margin, yPosition)

  yPosition += 20

  // Espace pour la signature
  doc.setDrawColor(150, 150, 150)
  doc.line(margin, yPosition, margin + 50, yPosition)
  doc.setFontSize(8)
  doc.setTextColor(...grayColor)
  doc.text('Signature du propriétaire', margin, yPosition + 4)

  // ============================================
  // TÉLÉCHARGEMENT
  // ============================================

  // Génère le nom de fichier
  const sanitizeName = (name: string): string => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
  }

  const tenantSanitized = sanitizeName(tenantName)
  const monthName = formatDate(periodStart.toISOString(), { month: 'short', year: 'numeric' })
  const filename = `Quittance_${tenantSanitized}_${monthName}.pdf`

  // Sauvegarde le PDF
  doc.save(filename)
}
