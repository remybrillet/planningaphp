export type {
  User,
  ShiftTemplate,
  Assignment,
  LeaveRequest,
  Deshydrata,
  Configuration,
  Notification,
  AuditLog
} from '@prisma/client'

export type {
  Role,
  Competence,
  ShiftType,
  AssignmentStatus,
  LeaveType,
  LeaveStatus,
  NotificationType
} from '@prisma/client'

// View types (sans mot de passe)
export type SafeUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'GESTIONNAIRE' | 'EMPLOYE'
  competence: 'INF' | 'PUERICULTRCE'
  workPercentage: number
  phone: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type PlanningDay = {
  date: string
  assignments: AssignmentWithUser[]
  isWeekend: boolean
  isToday: boolean
}

export type AssignmentWithUser = {
  id: string
  date: Date
  status: 'PLANIFIE' | 'CONFIRME' | 'ANNULE' | 'REMPLACE'
  notes: string | null
  user: SafeUser
  shiftTemplate: {
    id: string
    name: string
    type: 'JOUR' | 'NUIT'
    startTime: string
    endTime: string
  }
}

export type StaffingAlert = {
  date: string
  shiftType: 'JOUR' | 'NUIT'
  current: number
  minimum: number
  maximum: number
  status: 'sous-effectif' | 'sur-effectif' | 'normal'
}

export type DashboardStats = {
  totalAgents: number
  activeAgents: number
  todayShifts: number
  pendingLeaves: number
  staffingAlerts: StaffingAlert[]
}
