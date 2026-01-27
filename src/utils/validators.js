import { z } from 'zod'

/**
 * Schémas de validation Zod pour tous les formulaires de l'application
 * Centralise toutes les validations pour une sécurité renforcée
 */

/**
 * Schéma de validation pour un bien immobilier
 */
export const propertySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom du bien doit contenir au moins 2 caractères')
    .max(100, 'Le nom du bien ne peut pas dépasser 100 caractères'),
  address: z
    .string()
    .max(200, "L'adresse ne peut pas dépasser 200 caractères")
    .optional()
    .nullable(),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  rent: z
    .number()
    .min(0, 'Le loyer doit être positif')
    .max(1000000, 'Le loyer ne peut pas dépasser 1 000 000'),
  status: z.enum(['occupied', 'vacant'], {
    errorMap: () => ({ message: 'Le statut doit être "occupied" ou "vacant"' })
  }),
  tenant: z
    .object({
      name: z.string().min(2, 'Le nom du locataire doit contenir au moins 2 caractères'),
      entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
      exitDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD')
        .nullable()
        .optional(),
      rent: z.number().min(0, 'Le loyer du locataire doit être positif'),
      status: z.enum(['on_time', 'late', 'unpaid']).optional()
    })
    .optional()
    .nullable()
})

/**
 * Schéma de validation pour un locataire
 */
export const tenantSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom du locataire doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  propertyId: z.string().uuid("L'ID du bien doit être un UUID valide"),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
  exitDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD')
    .nullable()
    .optional(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La date de naissance doit être au format YYYY-MM-DD'),
  birthPlace: z.string().min(2, 'Le lieu de naissance doit contenir au moins 2 caractères'),
  rent: z
    .number()
    .min(0, 'Le loyer doit être positif')
    .max(1000000, 'Le loyer ne peut pas dépasser 1 000 000'),
  status: z.enum(['on_time', 'late', 'unpaid']).optional().default('on_time')
})

/**
 * Schéma de validation pour un paiement
 */
export const paymentSchema = z.object({
  propertyId: z.string().uuid("L'ID du bien doit être un UUID valide"),
  amount: z
    .number()
    .min(0.01, 'Le montant doit être supérieur à 0')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format YYYY-MM-DD'),
  status: z
    .enum(['pending', 'paid', 'late', 'unpaid'], {
      errorMap: () => ({ message: 'Le statut doit être "pending", "paid", "late" ou "unpaid"' })
    })
    .optional()
    .default('pending')
})

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères"),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

/**
 * Schéma de validation pour l'inscription
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email("Format d'email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères"),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  fullName: z
    .string()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide')
    .optional()
    .nullable()
})

/**
 * Schéma de validation pour le changement de mot de passe
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z
      .string()
      .min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'La confirmation du mot de passe est requise')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  })

/**
 * Schéma de validation pour le profil utilisateur (bailleur)
 * Conforme aux exigences de la Loi Alur pour les contrats de location
 */
export const profileSchema = z
  .object({
    // Identité
    first_name: z
      .string()
      .min(1, 'Le prénom est requis')
      .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
      .optional()
      .nullable(),
    last_name: z
      .string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères')
      .optional()
      .nullable(),
    full_name: z
      .string()
      .min(2, 'Le nom complet doit contenir au moins 2 caractères')
      .max(200, 'Le nom complet ne peut pas dépasser 200 caractères')
      .optional()
      .nullable(),
    email: z.string().email("Format d'email invalide").optional().nullable(),
    phone: z
      .string()
      .regex(
        /^[\d\s+\-()]+$/,
        'Format de téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)'
      )
      .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
      .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
      .optional()
      .nullable(),
    company: z
      .string()
      .max(200, "Le nom de l'entreprise ne peut pas dépasser 200 caractères")
      .optional()
      .nullable(),

    // Type de bailleur
    landlord_type: z
      .enum(['individual', 'company'], {
        errorMap: () => ({ message: 'Le type de bailleur doit être "Particulier" ou "Société"' })
      })
      .optional()
      .nullable(),

    // Adresse
    address_line: z
      .string()
      .max(200, "L'adresse ne peut pas dépasser 200 caractères")
      .optional()
      .nullable(),
    postal_code: z
      .string()
      .regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres')
      .optional()
      .nullable(),
    city: z
      .string()
      .min(2, 'La ville doit contenir au moins 2 caractères')
      .max(100, 'La ville ne peut pas dépasser 100 caractères')
      .optional()
      .nullable(),

    // Informations juridiques (optionnelles)
    siret: z
      .string()
      .regex(/^[\d\s]{9,14}$/, 'Le SIRET doit contenir entre 9 et 14 chiffres')
      .optional()
      .nullable(),
    rcs: z.string().max(50, 'Le RCS ne peut pas dépasser 50 caractères').optional().nullable(),
    capital_social: z
      .string()
      .max(50, 'Le capital social ne peut pas dépasser 50 caractères')
      .optional()
      .nullable(),
    legal_form: z
      .string()
      .max(20, 'La forme juridique ne peut pas dépasser 20 caractères')
      .optional()
      .nullable(),

    // Informations bancaires (optionnelles)
    iban: z
      .string()
      .regex(
        /^[A-Z]{2}[\dA-Z\s]{15,34}$/i,
        'Format IBAN invalide (ex: FR76 1234 5678 9012 3456 7890 123)'
      )
      .optional()
      .nullable(),
    bic: z
      .string()
      .regex(/^[A-Z0-9]{8,11}$/i, 'Format BIC invalide (ex: BNPAFRPP)')
      .optional()
      .nullable(),
    bank_name: z
      .string()
      .max(100, 'Le nom de la banque ne peut pas dépasser 100 caractères')
      .optional()
      .nullable(),

    // Signature (optionnelle)
    signature_url: z
      .string()
      .url("L'URL de la signature doit être une URL valide")
      .optional()
      .nullable(),

    // Avatar (optionnel)
    avatar_url: z.string().url("L'URL de l'avatar doit être une URL valide").optional().nullable()
  })
  .refine(
    data => {
      // Si first_name ou last_name est fourni, l'autre doit aussi l'être (ou full_name)
      if (data.first_name || data.last_name) {
        return (data.first_name && data.last_name) || data.full_name
      }
      return true
    },
    {
      message:
        'Si vous renseignez le prénom ou le nom, veuillez renseigner les deux ou utilisez le nom complet',
      path: ['first_name']
    }
  )
  .refine(
    data => {
      // Si IBAN est fourni, BIC devrait aussi l'être (recommandation, pas obligatoire)
      if (data.iban && !data.bic) {
        return false
      }
      return true
    },
    {
      message: "Le BIC est recommandé lorsque l'IBAN est renseigné",
      path: ['bic']
    }
  )
  .refine(
    data => {
      // Si company est renseigné, landlord_type devrait être 'company'
      if (
        data.company &&
        data.company.trim() &&
        data.landlord_type &&
        data.landlord_type !== 'company'
      ) {
        return false
      }
      return true
    },
    {
      message: 'Si vous renseignez une société, le type de bailleur doit être "Société"',
      path: ['landlord_type']
    }
  )

/**
 * Fonction helper pour valider et formater les erreurs Zod
 * @param {ZodSchema} schema - Le schéma Zod à utiliser
 * @param {Object} data - Les données à valider
 * @returns {Object} { success: boolean, data?: Object, errors?: Array<string> }
 */
export function validate(schema, data) {
  try {
    const validated = schema.parse(data)
    return {
      success: true,
      data: validated
    }
  } catch (error) {
    if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
      const errors = error.errors.map(err => {
        const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path || '')
        return `${path ? `${path}: ` : ''}${err.message || 'Erreur de validation'}`
      })

      return {
        success: false,
        errors,
        error: errors.join('; ')
      }
    }

    return {
      success: false,
      errors: [error?.message || 'Erreur de validation'],
      error: error?.message || 'Erreur de validation'
    }
  }
}

/**
 * Fonction helper pour valider de manière sécurisée (safe parse)
 * @param {ZodSchema} schema - Le schéma Zod à utiliser
 * @param {Object} data - Les données à valider
 * @returns {Object} { success: boolean, data?: Object, error?: ZodError }
 */
export function safeValidate(schema, data) {
  const result = schema.safeParse(data)
  return result
}
