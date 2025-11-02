import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * Utilitaires pour l'export de données en PDF et Excel
 */

// Couleurs Doogoo
const DOOGOO_COLORS = {
  primary: [34, 197, 94], // #22c55e (vert Doogoo)
  dark: [22, 163, 74], // #16a34a
  light: [220, 252, 231], // #dcfce7
  text: [15, 23, 42], // #0f172a (slate-900)
  gray: [148, 163, 184], // #94a3b8
  bg: [249, 250, 251] // #f9fafb
}

/**
 * Formate un montant pour le PDF avec séparateurs de milliers (format français)
 * @param {number|string} amount - Montant à formater
 * @param {Object} options - Options de formatage
 * @returns {string} Montant formaté (ex: "2 210 €")
 */
function formatCurrencyForPDF(amount, options = {}) {
  if (amount === null || amount === undefined || amount === '') {
    return '0 €'
  }

  // Convertit en nombre si ce n'est pas déjà le cas
  let numValue
  if (typeof amount === 'string') {
    // Nettoie la chaîne : enlève tout sauf chiffres, points, virgules, signes moins
    const cleaned = amount.replace(/[^\d,.-]/g, '').replace(',', '.')
    numValue = parseFloat(cleaned)
  } else {
    numValue = Number(amount)
  }

  if (isNaN(numValue) || !isFinite(numValue)) {
    return '0 €'
  }

  // Format avec séparateurs de milliers (espaces) comme en français
  const decimals = options.decimals !== undefined ? options.decimals : numValue % 1 === 0 ? 0 : 2
  const rounded = Math.round(numValue * Math.pow(10, decimals)) / Math.pow(10, decimals)

  // Partie entière avec séparateurs de milliers (espaces)
  const integerPart = Math.floor(Math.abs(rounded))
  const integerStr = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  // Partie décimale
  let decimalStr = ''
  if (decimals > 0) {
    const decimalPart = rounded % 1
    if (decimalPart !== 0) {
      decimalStr = decimalPart.toFixed(decimals).substring(1).replace('.', ',')
    }
  }

  // Gère le signe négatif
  const sign = rounded < 0 ? '-' : ''

  // Combine : signe + partie entière + partie décimale
  const formatted = `${sign}${integerStr}${decimalStr}`

  // Ajoute le symbole € avec un espace
  return `${formatted} €`
}

/**
 * Formate un pourcentage pour le PDF
 * @param {number|string} value - Valeur à formater
 * @param {number} decimals - Nombre de décimales (défaut: 1)
 * @returns {string} Pourcentage formaté (ex: "67,0 %")
 */
function formatPercentageForPDF(value, decimals = 1) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const numValue =
    typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : Number(value)

  if (isNaN(numValue)) {
    return '-'
  }

  const formatted = numValue.toFixed(decimals).replace('.', ',')
  return `${formatted} %`
}

/**
 * Exporte un rapport complet en PDF avec design amélioré
 * @param {string} title - Titre du document
 * @param {Array} data - Tableau d'objets à exporter
 * @param {Array} columns - Configuration des colonnes (optionnel)
 * @param {string} filename - Nom du fichier (optionnel)
 * @param {Object} options - Options additionnelles (KPIs, période, etc.)
 */
export const exportToPDF = (title, data, columns = null, filename = null, options = {}) => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const fileTitle = filename || title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

  let yPos = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14

  // ============================================
  // EN-TÊTE AVEC BRANDING
  // ============================================

  // Bandeau vert Doogoo
  doc.setFillColor(...DOOGOO_COLORS.primary)
  doc.rect(0, 0, pageWidth, 25, 'F')

  // Titre principal
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('DOOGOO', margin, 15)

  // Sous-titre
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Rapports & Synthèses', margin, 22)

  // Date et heure d'export
  yPos = 35
  doc.setTextColor(...DOOGOO_COLORS.text)
  doc.setFontSize(9)
  const exportDate = new Date()
  const dateStr = formatDate(exportDate, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Généré le ${dateStr}`, margin, yPos)

  yPos += 8

  // Ligne de séparation
  doc.setDrawColor(...DOOGOO_COLORS.primary)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)

  yPos += 10

  // ============================================
  // TITRE DU RAPPORT
  // ============================================

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DOOGOO_COLORS.text)
  doc.text(title, margin, yPos)

  yPos += 10

  // ============================================
  // SECTION KPIs (si fournis)
  // ============================================

  if (options.kpis && Object.keys(options.kpis).length > 0) {
    const kpis = options.kpis
    const kpiBoxWidth = (pageWidth - margin * 2 - 6) / 4 // 4 KPIs avec espacement

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DOOGOO_COLORS.text)
    doc.text('Indicateurs Clés', margin, yPos)
    yPos += 8

    // KPI Cards
    const kpiLabels = {
      totalRevenue: 'Revenus totaux',
      occupancyRate: "Taux d'occupation",
      latePaymentsAmount: 'Paiements en retard',
      averageRent: 'Loyer moyen'
    }

    let kpiIndex = 0
    const kpiEntries = Object.entries(kpis).filter(([key]) => kpiLabels[key])

    kpiEntries.forEach(([key, value]) => {
      const xPos = margin + (kpiIndex % 2) * (kpiBoxWidth * 2 + 6)
      const currentY = yPos + Math.floor(kpiIndex / 2) * 25

      // Box avec bordure verte
      doc.setDrawColor(...DOOGOO_COLORS.primary)
      doc.setFillColor(...DOOGOO_COLORS.light)
      doc.roundedRect(xPos, currentY - 12, kpiBoxWidth * 2, 20, 2, 2, 'FD')

      // Label
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...DOOGOO_COLORS.gray)
      doc.text(kpiLabels[key] || key, xPos + 4, currentY - 4)

      // Valeur
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DOOGOO_COLORS.text)
      let formattedValue = value
      if (key.includes('Revenue') || key.includes('Amount') || key.includes('Rent')) {
        // Format spécifique PDF
        formattedValue = formatCurrencyForPDF(value, { decimals: 0 })
      } else if (key.includes('Rate') || key.includes('occupancy')) {
        formattedValue = formatPercentageForPDF(value, 1)
      } else {
        const numVal = Number(value)
        formattedValue = isNaN(numVal)
          ? String(value)
          : numVal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
      }
      doc.text(formattedValue, xPos + 4, currentY + 6)

      kpiIndex++
    })

    yPos += Math.ceil(kpiEntries.length / 2) * 25 + 10

    // Ligne de séparation
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10
  }

  // ============================================
  // PÉRIODE (si fournie)
  // ============================================

  if (options.period) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...DOOGOO_COLORS.gray)
    doc.text(`Période : ${options.period}`, margin, yPos)
    yPos += 8
  }

  // ============================================
  // TABLEAU PRINCIPAL
  // ============================================

  // Configuration des colonnes
  let headers = []
  let rows = []

  if (columns) {
    // Utilisation des colonnes personnalisées
    headers = columns.map(col => col.header)
    rows = data.map(item =>
      columns.map(col => {
        // Récupère toujours la valeur BRUTE depuis l'objet
        const rawValue = col.accessor ? col.accessor(item) : item[col.key]

        // Détection du type de colonne pour formatage automatique
        const key = col.key || ''

        // Colonnes à EXCLURE du formatage monétaire (même si elles contiennent "paid" ou "amount")
        const excludeFromAmount =
          key.includes('delayed') ||
          key.includes('id') ||
          key === 'paymentStatus' ||
          key === 'status'

        const isAmount =
          !excludeFromAmount &&
          (key.includes('rent') ||
            (key.includes('Amount') && !key.includes('delayed')) ||
            (key.includes('Paid') && !key.includes('delayed') && key.includes('total')) ||
            key.includes('totalPaid') ||
            key.toLowerCase().includes('montant') ||
            key.toLowerCase().includes('revenu') ||
            (key.toLowerCase().includes('loyer') && !key.includes('delayed')))

        const isPercentage =
          key.includes('occupancy') ||
          (key.includes('Rate') && !key.includes('delayed')) ||
          (key.includes('rate') && !key.includes('delayed')) ||
          key.toLowerCase().includes('pourcentage') ||
          key.toLowerCase().includes('taux')

        // Formatage spécifique pour PDF selon le type de colonne
        if (isAmount) {
          // Pour les montants : utilise TOUJOURS la valeur brute (number)
          let numValue = rawValue

          // Si ce n'est pas déjà un nombre, convertit en nettoyant
          if (typeof numValue !== 'number') {
            const cleaned = String(numValue || '0')
              .replace(/[^\d,.-]/g, '') // Enlève tout sauf chiffres, virgules, points, signes
              .replace(',', '.') // Convertit virgule en point
            numValue = parseFloat(cleaned) || 0
          }

          // Formate pour PDF (sans décimales pour les montants entiers)
          if (!isNaN(numValue) && isFinite(numValue)) {
            return formatCurrencyForPDF(numValue, { decimals: 0 })
          }
          return '0 €'
        }

        if (isPercentage) {
          // Pour les pourcentages
          let numValue = rawValue

          if (typeof numValue !== 'number') {
            const cleaned = String(numValue || '0')
              .replace(/[^\d,.-]/g, '')
              .replace(',', '.')
            numValue = parseFloat(cleaned) || 0
          }

          if (!isNaN(numValue) && isFinite(numValue)) {
            return formatPercentageForPDF(numValue, 1)
          }
          return '-'
        }

        // Pour les colonnes avec formatter personnalisé (statut, date, etc.)
        // On applique le formatter APRÈS avoir vérifié qu'il ne s'agit pas d'un montant ou pourcentage
        if (col.formatter) {
          return col.formatter(rawValue)
        }

        // Pour les nombres non monétaires (ex: delayed, compteurs)
        // La colonne "delayed" doit être affichée comme un nombre simple
        if (key === 'delayed' && typeof rawValue === 'number') {
          return String(rawValue) // Pas de formatage avec séparateurs pour les retards
        }

        if (typeof rawValue === 'number' && !key.includes('id')) {
          return rawValue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
        }

        // Pour les dates (détection basique)
        if (
          rawValue instanceof Date ||
          (typeof rawValue === 'string' && rawValue.match(/\d{4}-\d{2}-\d{2}/))
        ) {
          return formatDate(rawValue)
        }

        // Sinon, affiche la valeur brute formatée en string
        return rawValue !== null && rawValue !== undefined ? String(rawValue) : '-'
      })
    )
  } else {
    // Auto-détection des colonnes
    if (data.length > 0) {
      headers = Object.keys(data[0])
      rows = data.map(item =>
        headers.map(key => {
          const value = item[key]
          // Formatage basique
          if (
            typeof value === 'number' &&
            (key.includes('amount') || key.includes('rent') || key.includes('price'))
          ) {
            return formatCurrencyForPDF(value, { decimals: 0 })
          }
          if (
            value instanceof Date ||
            (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/))
          ) {
            return formatDate(value)
          }
          return value !== null && value !== undefined ? String(value) : '-'
        })
      )
    }
  }

  // Configuration autoTable avec style Doogoo
  // Calcul des largeurs de colonnes pour éviter les coupures
  const columnWidths = columns
    ? columns.map((col, _idx) => {
        // Largeurs personnalisées selon le type de colonne
        if (col.key === 'property') return 40
        if (col.key === 'city') return 30
        if (col.key === 'rent' || col.key === 'totalPaid') return 30
        if (col.key === 'status') return 25
        if (col.key === 'paymentDate') return 35
        return null // Auto-width pour les autres
      })
    : null

  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: rows,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: DOOGOO_COLORS.text,
      font: 'helvetica',
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: {
      fillColor: DOOGOO_COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    alternateRowStyles: {
      fillColor: DOOGOO_COLORS.bg
    },
    margin: {
      top: yPos,
      left: margin,
      right: margin
    },
    columnStyles: {
      // Fusionne les largeurs et les alignements
      ...(columnWidths
        ? columnWidths.reduce((acc, width, idx) => {
            if (width) acc[idx] = { cellWidth: width }
            return acc
          }, {})
        : {}),
      // Alignement numérique pour les colonnes de montant et pourcentage
      ...(columns
        ? columns.reduce((acc, col, idx) => {
            const key = col.key || ''
            const excludeFromAmount =
              key.includes('delayed') ||
              key.includes('id') ||
              key === 'paymentStatus' ||
              key === 'status' ||
              key === 'property' ||
              key === 'city' ||
              key === 'paymentDate'

            const isAmount =
              !excludeFromAmount &&
              (key.includes('rent') ||
                (key.includes('Amount') && !key.includes('delayed')) ||
                (key.includes('Paid') && !key.includes('delayed') && key.includes('total')) ||
                key.includes('totalPaid') ||
                key.toLowerCase().includes('montant') ||
                key.toLowerCase().includes('revenu') ||
                (key.toLowerCase().includes('loyer') && !key.includes('delayed')))

            const isPercentage =
              key.includes('occupancy') ||
              (key.includes('Rate') && !key.includes('delayed')) ||
              (key.includes('rate') && !key.includes('delayed')) ||
              key.toLowerCase().includes('pourcentage') ||
              key.toLowerCase().includes('taux')

            // Pour "delayed", c'est un nombre simple (pas monétaire, pas pourcentage)
            const isSimpleNumber =
              key === 'delayed' &&
              typeof (col.accessor ? col.accessor(data[0] || {}) : (data[0] || {})[col.key]) ===
                'number'

            if (isAmount || isPercentage || isSimpleNumber) {
              acc[idx] = {
                ...(acc[idx] || {}),
                halign: 'right'
              }
            }
            return acc
          }, {})
        : {})
    },
    didDrawPage: data => {
      // Footer sur chaque page
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(7)
      doc.setTextColor(...DOOGOO_COLORS.gray)
      doc.setFont('helvetica', 'normal')

      // Footer gauche
      doc.text('Doogoo - Gestion Immobilière', margin, pageHeight - 10)

      // Footer droite
      const footerText = `Page ${data.pageNumber} sur ${pageCount}`
      const footerWidth = doc.getTextWidth(footerText)
      doc.text(footerText, pageWidth - margin - footerWidth, pageHeight - 10)

      // Ligne de séparation footer
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12)
    }
  })

  // ============================================
  // RÉSUMÉ EN BAS DE PAGE (si dernière page)
  // ============================================

  const finalY = doc.lastAutoTable.finalY || yPos
  if (finalY < pageHeight - 40 && data.length > 0) {
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin, finalY + 10, pageWidth - margin, finalY + 10)

    // Résumé
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DOOGOO_COLORS.text)
    doc.text('Résumé', margin, finalY + 18)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DOOGOO_COLORS.gray)

    // Total lignes
    const totalRows = data.length
    doc.text(`Total : ${totalRows} ${totalRows > 1 ? 'lignes' : 'ligne'}`, margin, finalY + 25)

    // Totaux calculés si colonnes numériques
    if (columns) {
      let summaryY = finalY + 18
      columns.forEach(col => {
        if (
          col.key &&
          (col.key.includes('rent') || col.key.includes('Amount') || col.key.includes('Paid'))
        ) {
          const values = data.map(item => {
            let val = col.accessor ? col.accessor(item) : item[col.key]
            // Convertit en nombre si nécessaire
            if (typeof val !== 'number') {
              val = parseFloat(String(val).replace(/[^\d.-]/g, ''))
            }
            return isNaN(val) ? 0 : val
          })
          const total = values.reduce((sum, val) => sum + val, 0)
          if (total > 0) {
            // Format PDF propre
            const totalFormatted = formatCurrencyForPDF(total, { decimals: 0 })
            doc.text(`${col.header} total : ${totalFormatted}`, pageWidth - margin - 60, summaryY)
            summaryY += 6
          }
        }
      })
    }
  }

  // Enregistrement
  doc.save(`${fileTitle}.pdf`)
}

/**
 * Exporte un tableau de données en CSV/Excel
 * @param {string} filename - Nom du fichier (sans extension)
 * @param {Array} data - Tableau d'objets à exporter
 * @param {string} sheetName - Nom de l'onglet (optionnel, pour Excel)
 * @param {boolean} asCSV - Si true, exporte en CSV, sinon en Excel (défaut: CSV)
 */
export const exportToExcel = (filename, data, sheetName = 'Données', asCSV = true) => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter')
    return
  }

  try {
    if (asCSV) {
      // Export CSV
      const headers = Object.keys(data[0])
      const csvRows = [headers.join(',')]

      // Ajoute les lignes
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header]
          // Formate les valeurs pour CSV (escape les guillemets et les virgules)
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvRows.push(values.join(','))
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, `${filename}.csv`)
    } else {
      // Export Excel (format XLSX)
      const ws = XLSX.utils.json_to_sheet(data)

      // Définit la largeur des colonnes
      const wscols = []
      if (data.length > 0) {
        const firstRow = data[0]
        Object.keys(firstRow).forEach(key => {
          const maxLength = Math.max(
            key.length,
            ...data.map(row => {
              const value = row[key]
              return value !== null && value !== undefined ? String(value).length : 0
            })
          )
          wscols.push({ wch: Math.min(maxLength + 2, 50) })
        })
      }
      ws['!cols'] = wscols

      // Crée le workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, sheetName)

      // Génère le fichier
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      saveAs(blob, `${filename}.xlsx`)
    }
  } catch (error) {
    console.error("Erreur lors de l'export:", error)
    throw error
  }
}

/**
 * Exporte un rapport mensuel complet en PDF
 * @param {Object} reportData - Données du rapport
 */
export const exportMonthlyReport = reportData => {
  const doc = new jsPDF()
  const { month, payments, statistics } = reportData

  // En-tête
  doc.setFontSize(20)
  doc.text('Rapport Mensuel - Doogoo', 14, 20)

  doc.setFontSize(12)
  doc.text(`Période : ${month}`, 14, 30)
  doc.text(
    `Généré le ${formatDate(new Date(), { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    14,
    38
  )

  let yPos = 50

  // Statistiques
  doc.setFontSize(14)
  doc.text('Statistiques', 14, yPos)
  yPos += 10

  doc.setFontSize(10)
  autoTable(doc, {
    startY: yPos,
    head: [['Indicateur', 'Valeur']],
    body: [
      ['Revenu total', formatCurrency(statistics.totalRevenue)],
      ["Taux d'occupation", `${statistics.occupancyRate}%`],
      ['Paiements reçus', statistics.paidPayments],
      ['Paiements en retard', statistics.latePayments]
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    margin: { top: yPos }
  })

  yPos = doc.lastAutoTable.finalY + 20

  // Paiements
  if (payments && payments.length > 0) {
    doc.setFontSize(14)
    doc.text('Paiements', 14, yPos)
    yPos += 10

    const paymentRows = payments.map(p => [
      p.property || 'N/A',
      p.tenant || 'N/A',
      formatCurrencyForPDF(p.amount, { decimals: 0 }),
      formatDate(p.dueDate),
      p.status === 'paid' ? 'Payé' : p.status === 'pending' ? 'En attente' : 'En retard'
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Bien', 'Locataire', 'Montant', 'Date', 'Statut']],
      body: paymentRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      margin: { top: yPos }
    })

    yPos = doc.lastAutoTable.finalY + 20
  }

  // Sauvegarde
  const filename = `rapport_mensuel_${month.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
  doc.save(filename)
}
