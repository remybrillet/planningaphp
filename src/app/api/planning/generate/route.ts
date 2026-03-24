import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

type ScheduleRules = {
  // Capacité
  openBeds: number
  // Ratios — calculés à partir des lits
  staffJour: number   // effectif cible jour
  staffNuit: number   // effectif cible nuit
  maxStaffJour: number
  maxStaffNuit: number
  minPuerJour: number
  minPuerNuit: number
  // Repos
  maxConsecutiveShifts: number
  maxConsecutiveNights: number
  forbidJourAfterNuit: boolean
  maxHoursPerWeek: number
  minDaysOffPerWeek: number
  maxWeekendsPerMonth: number
}

type AgentInfo = {
  id: string
  competence: string
  workPercentage: number
  shiftsPerMonth: number
}

type AgentState = {
  consecutiveShifts: number
  consecutiveNights: number
  lastShiftType: 'JOUR' | 'NUIT' | null
  lastShiftDate: string | null
  totalShiftsThisMonth: number
  weekendShiftsThisMonth: number
  shiftsThisWeek: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const body = await request.json()
    const { month, openBeds: requestedBeds } = body

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { message: 'Format de mois invalide (attendu: YYYY-MM)' },
        { status: 400 }
      )
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)
    const daysInMonth = endDate.getDate()

    // ============================================
    // 1. Charger la configuration
    // ============================================
    const configRows = await prisma.configuration.findMany()
    const cfg: Record<string, string> = {}
    for (const c of configRows) cfg[c.key] = c.value

    const openBeds = requestedBeds ?? parseInt(cfg.default_open_beds || '12')

    if (openBeds < 1 || openBeds > parseInt(cfg.total_beds || '18')) {
      return NextResponse.json(
        { message: `Le nombre de lits doit être entre 1 et ${cfg.total_beds || 18}` },
        { status: 400 }
      )
    }

    // Calculer les effectifs à partir des ratios et du nombre de lits
    const ratioJour = parseInt(cfg.ratio_agent_beds_jour || '3')
    const ratioNuit = parseInt(cfg.ratio_agent_beds_nuit || '4')
    const minBaseJour = parseInt(cfg.min_staff_jour_base || '3')
    const minBaseNuit = parseInt(cfg.min_staff_nuit_base || '2')

    const staffJour = Math.max(minBaseJour, Math.ceil(openBeds / ratioJour))
    const staffNuit = Math.max(minBaseNuit, Math.ceil(openBeds / ratioNuit))

    const rules: ScheduleRules = {
      openBeds,
      staffJour,
      staffNuit,
      maxStaffJour: parseInt(cfg.max_staff_jour || '10'),
      maxStaffNuit: parseInt(cfg.max_staff_nuit || '8'),
      minPuerJour: parseInt(cfg.min_puer_jour || '2'),
      minPuerNuit: parseInt(cfg.min_puer_nuit || '1'),
      maxConsecutiveShifts: parseInt(cfg.max_consecutive_shifts || '3'),
      maxConsecutiveNights: parseInt(cfg.max_consecutive_nights || '2'),
      forbidJourAfterNuit: cfg.forbid_jour_after_nuit === 'true',
      maxHoursPerWeek: parseInt(cfg.max_hours_per_week || '48'),
      minDaysOffPerWeek: parseInt(cfg.min_days_off_per_week || '2'),
      maxWeekendsPerMonth: parseInt(cfg.max_weekends_per_month || '2'),
    }

    // ============================================
    // 2. Charger les agents
    // ============================================
    const agents = await prisma.user.findMany({
      where: { isActive: true, role: 'EMPLOYE' },
      select: { id: true, competence: true, workPercentage: true },
    })

    if (agents.length === 0) {
      return NextResponse.json({ message: 'Aucun agent actif trouvé' }, { status: 400 })
    }

    const agentInfos: AgentInfo[] = agents.map((a) => ({
      id: a.id,
      competence: a.competence,
      workPercentage: a.workPercentage,
      shiftsPerMonth: Math.round((a.workPercentage / 100) * parseInt(cfg.shifts_per_month_full_time || '13')),
    }))

    // ============================================
    // 3. Congés approuvés
    // ============================================
    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: {
        status: 'APPROUVE',
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      select: { userId: true, startDate: true, endDate: true },
    })

    const leaveDays = new Set<string>()
    for (const leave of approvedLeaves) {
      const s = leave.startDate > startDate ? leave.startDate : startDate
      const e = leave.endDate < endDate ? leave.endDate : endDate
      const cur = new Date(s)
      while (cur <= e) {
        leaveDays.add(`${leave.userId}:${fmtDate(cur)}`)
        cur.setDate(cur.getDate() + 1)
      }
    }

    // Supprimer les affectations PLANIFIE existantes pour ce mois
    const deleted = await prisma.assignment.deleteMany({
      where: {
        date: { gte: startDate, lte: endDate },
        status: 'PLANIFIE',
      },
    })

    // ============================================
    // 4. Générer le planning
    // ============================================
    const assignments: { date: Date; userId: string; shiftTemplateId: string }[] = []
    const states: Map<string, AgentState> = new Map()

    for (const agent of agentInfos) {
      states.set(agent.id, {
        consecutiveShifts: 0,
        consecutiveNights: 0,
        lastShiftType: null,
        lastShiftDate: null,
        totalShiftsThisMonth: 0,
        weekendShiftsThisMonth: 0,
        shiftsThisWeek: 0,
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day)
      const dateStr = fmtDate(date)
      const dow = date.getDay()
      const isWeekend = dow === 0 || dow === 6

      if (dow === 1) {
        for (const st of states.values()) st.shiftsThisWeek = 0
      }

      // JOUR
      const jourPicked = pickAgents(agentInfos, states, leaveDays, dateStr, 'JOUR', rules, isWeekend)
      for (const id of jourPicked) {
        assignments.push({ date, userId: id, shiftTemplateId: 'shift-jour' })
        bump(states.get(id)!, dateStr, 'JOUR', isWeekend)
      }

      // NUIT
      const nuitPicked = pickAgents(agentInfos, states, leaveDays, dateStr, 'NUIT', rules, isWeekend)
      for (const id of nuitPicked) {
        assignments.push({ date, userId: id, shiftTemplateId: 'shift-nuit' })
        bump(states.get(id)!, dateStr, 'NUIT', isWeekend)
      }
    }

    // ============================================
    // 5. Insertion en masse
    // ============================================
    const created = await prisma.assignment.createMany({
      data: assignments.map((a) => ({
        date: a.date,
        userId: a.userId,
        shiftTemplateId: a.shiftTemplateId,
        status: 'PLANIFIE',
        createdBy: session.id,
      })),
      skipDuplicates: true,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE',
        entity: 'Planning',
        entityId: month,
        newValues: {
          month,
          openBeds,
          staffJour,
          staffNuit,
          totalAssignments: created.count,
          deletedPrevious: deleted.count,
        },
      },
    })

    return NextResponse.json({
      success: true,
      month,
      openBeds,
      staffJour,
      staffNuit,
      totalAssignments: created.count,
      deletedPrevious: deleted.count,
      daysGenerated: daysInMonth,
      agentsScheduled: agents.length,
    })
  } catch (error) {
    console.error('Planning generation error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la génération du planning' },
      { status: 500 }
    )
  }
}

// ============================================
// Sélection des agents pour un shift
// ============================================
function pickAgents(
  agents: AgentInfo[],
  states: Map<string, AgentState>,
  leaveDays: Set<string>,
  dateStr: string,
  shiftType: 'JOUR' | 'NUIT',
  rules: ScheduleRules,
  isWeekend: boolean,
): string[] {
  const target = shiftType === 'JOUR' ? rules.staffJour : rules.staffNuit
  const maxStaff = shiftType === 'JOUR' ? rules.maxStaffJour : rules.maxStaffNuit
  const minPuer = shiftType === 'JOUR' ? rules.minPuerJour : rules.minPuerNuit
  const capped = Math.min(target, maxStaff)

  type Candidate = { id: string; score: number; competence: string }
  const candidates: Candidate[] = []

  for (const agent of agents) {
    const st = states.get(agent.id)!

    // --- Contraintes dures ---
    if (leaveDays.has(`${agent.id}:${dateStr}`)) continue
    if (st.lastShiftDate === dateStr) continue
    if (st.consecutiveShifts >= rules.maxConsecutiveShifts) continue
    if (shiftType === 'NUIT' && st.consecutiveNights >= rules.maxConsecutiveNights) continue
    if (rules.forbidJourAfterNuit && shiftType === 'JOUR' && st.lastShiftType === 'NUIT') continue
    if (st.lastShiftType === 'NUIT' && st.lastShiftDate === prevDate(dateStr) && shiftType === 'JOUR') continue
    if (isWeekend && st.weekendShiftsThisMonth >= rules.maxWeekendsPerMonth) continue
    if (st.shiftsThisWeek * 12 >= rules.maxHoursPerWeek) continue
    if (st.totalShiftsThisMonth >= agent.shiftsPerMonth + 2) continue

    // --- Score (plus bas = meilleur) ---
    let score = st.totalShiftsThisMonth * 10
    score -= (agent.shiftsPerMonth - st.totalShiftsThisMonth) * 5
    if (isWeekend) score += st.weekendShiftsThisMonth * 20
    if (st.consecutiveShifts > 0 && st.consecutiveShifts < rules.maxConsecutiveShifts) score -= 3
    score += Math.random() * 8

    candidates.push({ id: agent.id, score, competence: agent.competence })
  }

  candidates.sort((a, b) => a.score - b.score)

  const selected: string[] = []
  let puerCount = 0

  // D'abord les puéricultrices requises
  for (const c of candidates.filter((c) => c.competence === 'PUERICULTRCE')) {
    if (puerCount >= minPuer) break
    if (selected.length >= maxStaff) break
    selected.push(c.id)
    puerCount++
  }

  // Puis compléter jusqu'à l'effectif cible
  for (const c of candidates) {
    if (selected.length >= capped) break
    if (selected.includes(c.id)) continue
    selected.push(c.id)
  }

  return selected
}

// ============================================
// Helpers
// ============================================
function bump(st: AgentState, dateStr: string, type: 'JOUR' | 'NUIT', isWeekend: boolean) {
  if (st.lastShiftDate === prevDate(dateStr) || st.lastShiftDate === dateStr) {
    st.consecutiveShifts++
  } else {
    st.consecutiveShifts = 1
  }
  if (type === 'NUIT') {
    if (st.lastShiftType === 'NUIT' && (st.lastShiftDate === prevDate(dateStr) || st.lastShiftDate === dateStr)) {
      st.consecutiveNights++
    } else {
      st.consecutiveNights = 1
    }
  } else {
    st.consecutiveNights = 0
  }
  st.lastShiftType = type
  st.lastShiftDate = dateStr
  st.totalShiftsThisMonth++
  st.shiftsThisWeek++
  if (isWeekend) st.weekendShiftsThisMonth++
}

function fmtDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function prevDate(s: string): string {
  const d = new Date(s)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}
