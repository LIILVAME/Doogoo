import { supabase } from '@/lib/supabaseClient'
import { withErrorHandling } from '@/utils/apiErrorHandler'

/**
 * API centralisée pour les rapports
 * Toutes les interactions avec les données de rapports passent par ici
 */

/**
 * Génère les données pour un rapport mensuel
 * @param userId - ID de l'utilisateur
 * @param month - Format "YYYY-MM" ou "janv. 2025"
 * @returns {Promise<any>} { success: boolean, data?: Object, error?: Error }
 */
export async function generateMonthlyReport(userId: string, month: string) {
  if (!userId || !month) {
    return { success: false, message: 'User ID et mois requis' }
  }

  return withErrorHandling(
    async () => {
      // Parse le mois (format "janv. 2025" ou "YYYY-MM")
      let startDate: Date, endDate: Date
      if (month.includes('-')) {
        // Format "YYYY-MM"
        const [year, monthNum] = month.split('-')
        startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
        endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59)
      } else {
        // Format "janv. 2025"
        const [monthName, year] = month.split(' ')
        const monthMap: Record<string, number> = {
          'janv.': 0,
          'févr.': 1,
          mars: 2,
          'avr.': 3,
          mai: 4,
          juin: 5,
          'juil.': 6,
          août: 7,
          'sept.': 8,
          'oct.': 9,
          'nov.': 10,
          'déc.': 11
        }
        startDate = new Date(parseInt(year), monthMap[monthName] || 0, 1)
        endDate = new Date(parseInt(year), (monthMap[monthName] || 0) + 1, 0, 23, 59, 59)
      }

      // 1️⃣ & 2️⃣ Parallélise les appels pour améliorer les performances
      const [paymentsResult, propertiesResult] = await Promise.all([
        supabase
          .from('payments_view')
          .select(
            `
            *,
            properties (id, name, city),
            tenants (id, name)
          `
          )
          .eq('user_id', userId)
          .gte('due_date', startDate.toISOString().split('T')[0])
          .lte('due_date', endDate.toISOString().split('T')[0])
          .order('due_date', { ascending: false }),
        supabase.from('properties').select('*').eq('user_id', userId)
      ])

      const { data: payments, error: paymentsError } = paymentsResult
      const { data: properties, error: propertiesError } = propertiesResult

      if (paymentsError) {
        return { data: null, error: paymentsError }
      }

      if (propertiesError) {
        return { data: null, error: propertiesError }
      }

      // 3️⃣ Calcule les statistiques
      const paidPayments = payments?.filter(p => p.status === 'paid') || []
      const latePayments = payments?.filter(p => p.status === 'late') || []
      const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
      const occupiedProperties = properties?.filter(p => p.status === 'occupied').length || 0
      const occupancyRate =
        properties && properties.length > 0
          ? Math.round((occupiedProperties / properties.length) * 100)
          : 0

      // 4️⃣ Format les paiements pour le rapport
      const formattedPayments = (payments || []).map(p => ({
        property: p.properties?.name || 'N/A',
        tenant: p.tenants?.name || 'N/A',
        amount: Number(p.amount),
        dueDate: p.due_date,
        status: p.status
      }))

      // Retourne les données du rapport
      const reportData = {
        month,
        properties: properties || [],
        payments: formattedPayments,
        statistics: {
          totalRevenue,
          occupancyRate,
          paidPayments: paidPayments.length,
          latePayments: latePayments.length,
          totalPayments: payments?.length || 0
        }
      }

      return { data: reportData, error: null }
    },
    'generateMonthlyReport',
    { timeout: 20000 }
  ) // 20s pour les requêtes complexes avec plusieurs sous-requêtes
}

/**
 * Récupère les rapports récents (pour l'instant vide, sera implémenté en v0.3.0+)
 * @param userId - ID de l'utilisateur
 * @returns {Promise<any>} { success: boolean, data?: Array, error?: Error }
 */
export async function getRecentReports(userId: string) {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  // TODO v0.3.0+ : Implémenter le stockage des rapports dans Supabase
  return {
    success: true,
    data: []
  }
}

// Export de l'objet API (compatibilité avec les autres APIs)
export const reportsApi = {
  generateMonthlyReport,
  getRecentReports
}
