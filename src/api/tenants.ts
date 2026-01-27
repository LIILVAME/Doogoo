import { supabase } from '@/lib/supabaseClient'

import { withErrorHandling } from '@/utils/apiErrorHandler'
import type { PostgrestError } from '@supabase/supabase-js'

export interface TenantParams {
  propertyId?: string
  name: string
  entryDate: string
  exitDate?: string | null
  rent: number | string
  status?: string
  birthDate?: string | null
  birthPlace?: string | null
  email?: string | null
}

export interface TenantUpdateParams {
  name?: string
  entryDate?: string
  exitDate?: string | null
  rent?: number | string
  status?: string
  birthDate?: string | null
  birthPlace?: string | null
  email?: string | null
  // Champs techniques
  id?: string
  property_id?: string
  created_at?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: PostgrestError | Error | null
  message?: string
}

/**
 * Récupère tous les locataires d'un utilisateur
 */
export async function getTenants(userId: string): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  }, 'getTenants')
}

/**
 * Récupère un locataire par son ID
 */
export async function getTenantById(tenantId: string, userId: string): Promise<ApiResponse> {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .eq('user_id', userId)
      .single()

    return { data, error }
  }, 'getTenantById')
}

/**
 * Crée un nouveau locataire
 */
export async function createTenant(tenantData: TenantParams, userId: string): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'User ID requis' }
  }

  return withErrorHandling(async () => {
    const insertData: Record<string, any> = {
      property_id: tenantData.propertyId || null,
      user_id: userId, // CRITIQUE : requis pour RLS
      name: tenantData.name,
      entry_date: tenantData.entryDate,
      exit_date: tenantData.exitDate || null,
      rent: Number(tenantData.rent) || 0,
      status: tenantData.status || 'on_time',
      birth_date: tenantData.birthDate || null,
      birth_place: tenantData.birthPlace || null
    }

    // Ajoute l'email si fourni
    if (tenantData.email !== undefined) {
      insertData.email = tenantData.email || null
    }

    const { data, error } = await supabase.from('tenants').insert([insertData]).select().single()

    return { data, error }
  }, 'createTenant')
}

/**
 * Met à jour un locataire existant
 */
export async function updateTenant(
  tenantId: string,
  updates: TenantUpdateParams,
  userId: string
): Promise<ApiResponse> {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Prépare les données de mise à jour avec mapping camelCase -> snake_case
    const updateData: Record<string, any> = {
      name: updates.name,
      entry_date: updates.entryDate,
      exit_date: updates.exitDate,
      status: updates.status
    }

    // Convertit le loyer en nombre si présent
    if (updates.rent !== undefined) {
      updateData.rent = Number(updates.rent)
    }

    if (updates.birthDate !== undefined) {
      updateData.birth_date = updates.birthDate
    }
    if (updates.birthPlace !== undefined) {
      updateData.birth_place = updates.birthPlace
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email
    }

    // Supprime les champs undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single()

    // Vérifie que la propriété associée appartient à l'utilisateur
    if (data) {
      const { data: property } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', data.property_id)
        .single()

      if (!property || property.user_id !== userId) {
        return { data: null, error: { message: 'Action non autorisée' } }
      }
    }

    return { data, error }
  }, 'updateTenant')
}

/**
 * Supprime un locataire
 */
export async function deleteTenant(tenantId: string, userId: string): Promise<ApiResponse> {
  if (!tenantId || !userId) {
    return { success: false, message: 'Tenant ID et User ID requis' }
  }

  return withErrorHandling(async () => {
    // Vérifie que le locataire appartient à l'utilisateur
    const { data: tenant } = await supabase
      .from('tenants')
      .select('property_id, properties(user_id)')
      .eq('id', tenantId)
      .single()

    // @ts-expect-error - nested query typing is tricky
    if (!tenant || !tenant.properties || tenant.properties.user_id !== userId) {
      return { data: null, error: { message: 'Action non autorisée' } }
    }

    const { error } = await supabase.from('tenants').delete().eq('id', tenantId)

    return { data: null, error }
  }, 'deleteTenant')
}
