import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

export const createUserSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  role: z.enum(['ADMIN', 'GESTIONNAIRE', 'EMPLOYE']),
  competence: z.enum(['INF', 'PUERICULTRCE']),
  workPercentage: z.number().int().min(50).max(100).multipleOf(10),
  phone: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial().omit({ password: true })

export const createAssignmentSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date invalide'),
  userId: z.string().min(1, 'L\'agent est requis'),
  shiftTemplateId: z.string().min(1, 'Le shift est requis'),
  notes: z.string().max(500).optional(),
})

export const createLeaveRequestSchema = z.object({
  type: z.enum(['CP', 'RTT', 'MALADIE', 'FORMATION', 'MATERNITE', 'PATERNITE', 'AUTRE']),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date de début invalide'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date de fin invalide'),
  reason: z.string().max(1000).optional(),
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  { message: 'La date de fin doit être postérieure à la date de début', path: ['endDate'] }
)

export const reviewLeaveSchema = z.object({
  status: z.enum(['APPROUVE', 'REFUSE']),
  reviewNote: z.string().max(500).optional(),
})

export const createDeshydrataSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date invalide'),
  priority: z.number().int().min(1).max(2),
  reason: z.string().max(500).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>
export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestSchema>
export type ReviewLeaveInput = z.infer<typeof reviewLeaveSchema>
export type CreateDeshydrataInput = z.infer<typeof createDeshydrataSchema>
