import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// ============================================
// Types
// ============================================
type Rules = {
  staffJour: number
  staffNuit: number
  minPuerJour: number
  minPuerNuit: number
  maxConsecutiveShifts: number      // max 3
  maxConsecutiveNights: number      // max 2
  maxShiftsIn7Days: number          // interdit 5 en 7 → max 4
  forbidJourAfterNuit: boolean
  weekendFrequency: number          // 1 WE travaillé sur N
  weekendEnBloc: boolean
  vendrediForceSiWeekend: boolean
  favoriserConsecutifs: boolean
  respecterDeshydrata: boolean
  shiftDuration: number
  hoursPerDayRef: number
  maxConsecutiveOff: Record<number, number>
}

type AgentInfo = {
  id: string
  competence: string
  workPercentage: number
  targetShifts: number
}

type AgentState = {
  consecutiveShifts: number
  consecutiveNights: number
  consecutiveOff: number
  lastShiftType: 'JOUR' | 'NUIT' | null
  lastShiftDate: string | null
  totalShiftsThisMonth: number
  weekendWorkedThisMonth: number
  last7DaysShifts: string[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const body = await request.json()
    const { month, openBeds: requestedBeds } = body

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ message: 'Format invalide (YYYY-MM)' }, { status: 400 })
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)
    const daysInMonth = endDate.getDate()

    // ============================================
    // 1. Config
    // ============================================
    const configRows = await prisma.configuration.findMany()
    const cfg: Record<string, string> = {}
    for (const c of configRows) cfg[c.key] = c.value

    const openBeds = requestedBeds ?? parseInt(cfg.default_open_beds || '18')

    const rules: Rules = {
      staffJour: parseInt(cfg.staff_jour || '8'),
      staffNuit: parseInt(cfg.staff_nuit || '8'),
      minPuerJour: parseInt(cfg.min_puer_jour || '2'),
      minPuerNuit: parseInt(cfg.min_puer_nuit || '1'),
      maxConsecutiveShifts: parseInt(cfg.max_consecutive_shifts || '3'),
      maxConsecutiveNights: parseInt(cfg.max_consecutive_nights || '2'),
      maxShiftsIn7Days: parseInt(cfg.max_shifts_in_7_days || '4'),
      forbidJourAfterNuit: cfg.forbid_jour_after_nuit === 'true',
      weekendFrequency: parseInt(cfg.weekend_frequency || '3'),
      weekendEnBloc: cfg.weekend_en_bloc !== 'false',
      vendrediForceSiWeekend: cfg.vendredi_force_si_weekend !== 'false',
      favoriserConsecutifs: cfg.favoriser_consecutifs !== 'false',
      respecterDeshydrata: cfg.respecter_deshydrata !== 'false',
      shiftDuration: parseInt(cfg.shift_duration || '12'),
      hoursPerDayRef: parseFloat(cfg.hours_per_day_reference || '7.8'),
      maxConsecutiveOff: {
        100: parseInt(cfg.max_consecutive_off_100 || '4'),
        90: parseInt(cfg.max_consecutive_off_90 || '5'),
        80: parseInt(cfg.max_consecutive_off_80 || '5'),
        70: parseInt(cfg.max_consecutive_off_70 || '6'),
        60: parseInt(cfg.max_consecutive_off_60 || '7'),
        50: parseInt(cfg.max_consecutive_off_50 || '8'),
      },
    }

    // ============================================
    // 2. Agents + calcul gardes/mois variable
    // ============================================
    const agents = await prisma.user.findMany({
      where: { isActive: true, role: 'EMPLOYE' },
      select: { id: true, competence: true, workPercentage: true },
    })

    if (agents.length === 0) {
      return NextResponse.json({ message: 'Aucun agent actif' }, { status: 400 })
    }

    // Jours ouvrés du mois → heures dues → gardes
    // Mars 2026 = 22 jours ouvrés → 171.6h à 100% → ~14 gardes
    // Février 2026 = 20 jours ouvrés → 156h → ~13 gardes
    const workingDays = countWorkingDays(year, monthNum - 1)
    const hoursDueFullTime = workingDays * rules.hoursPerDayRef

    const agentInfos: AgentInfo[] = agents.map((a) => ({
      id: a.id,
      competence: a.competence,
      workPercentage: a.workPercentage,
      targetShifts: Math.round((hoursDueFullTime * (a.workPercentage / 100)) / rules.shiftDuration),
    }))

    // ============================================
    // 3. Congés + déshydrata
    // ============================================
    const [approvedLeaves, deshydrataList] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: { status: 'APPROUVE', startDate: { lte: endDate }, endDate: { gte: startDate } },
        select: { userId: true, startDate: true, endDate: true },
      }),
      rules.respecterDeshydrata
        ? prisma.deshydrata.findMany({
            where: { date: { gte: startDate, lte: endDate } },
            select: { userId: true, date: true },
          })
        : [],
    ])

    const unavailable = new Set<string>()
    for (const leave of approvedLeaves) {
      const s = leave.startDate > startDate ? leave.startDate : startDate
      const e = leave.endDate < endDate ? leave.endDate : endDate
      const cur = new Date(s)
      while (cur <= e) {
        unavailable.add(`${leave.userId}:${fmtDate(cur)}`)
        cur.setDate(cur.getDate() + 1)
      }
    }
    for (const d of deshydrataList) {
      unavailable.add(`${d.userId}:${fmtDate(d.date)}`)
    }

    // Supprimer PLANIFIE existants
    const deleted = await prisma.assignment.deleteMany({
      where: { date: { gte: startDate, lte: endDate }, status: 'PLANIFIE' },
    })

    // ============================================
    // 4. Génération
    // ============================================
    const assignments: { date: Date; userId: string; shiftTemplateId: string }[] = []
    const states: Map<string, AgentState> = new Map()

    for (const agent of agentInfos) {
      states.set(agent.id, {
        consecutiveShifts: 0, consecutiveNights: 0, consecutiveOff: 0,
        lastShiftType: null, lastShiftDate: null,
        totalShiftsThisMonth: 0, weekendWorkedThisMonth: 0,
        last7DaysShifts: [],
      })
    }

    const saturdayTeams: Map<string, string[]> = new Map()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day)
      const dateStr = fmtDate(date)
      const dow = date.getDay()
      const isSat = dow === 6
      const isSun = dow === 0
      const isFri = dow === 5
      const isWE = isSat || isSun

      // Purger fenêtre 7 jours
      const cutoff = fmtDate(new Date(year, monthNum - 1, day - 7))
      for (const st of states.values()) {
        st.last7DaysShifts = st.last7DaysShifts.filter((d) => d > cutoff)
      }

      for (const shiftType of ['JOUR', 'NUIT'] as const) {
        const templateId = shiftType === 'JOUR' ? 'shift-jour' : 'shift-nuit'
        const target = shiftType === 'JOUR' ? rules.staffJour : rules.staffNuit
        const minPuer = shiftType === 'JOUR' ? rules.minPuerJour : rules.minPuerNuit
        let forcedAgents: string[] = []

        // DIMANCHE → reprendre l'équipe du samedi
        if (isSun && rules.weekendEnBloc) {
          const satTeam = saturdayTeams.get(`${prevDate(dateStr)}_${shiftType}`) || []
          forcedAgents = satTeam.filter((id) => canWork(id, dateStr, shiftType, states, unavailable, rules, agentInfos))
        }

        for (const id of forcedAgents) {
          assignments.push({ date, userId: id, shiftTemplateId: templateId })
          bump(states.get(id)!, dateStr, shiftType, isSat)
        }

        const needed = target - forcedAgents.length
        if (needed > 0) {
          const puerInForced = forcedAgents.filter((id) => agentInfos.find((a) => a.id === id)?.competence === 'PUERICULTRCE').length
          const picked = pick(agentInfos, states, unavailable, dateStr, shiftType, rules, isWE, isFri, forcedAgents, needed, minPuer, puerInForced)

          for (const id of picked) {
            assignments.push({ date, userId: id, shiftTemplateId: templateId })
            bump(states.get(id)!, dateStr, shiftType, isSat)
          }

          if (isSat) saturdayTeams.set(`${dateStr}_${shiftType}`, [...forcedAgents, ...picked])
        } else if (isSat) {
          saturdayTeams.set(`${dateStr}_${shiftType}`, forcedAgents)
        }
      }

      // Incrémenter repos consécutifs
      for (const st of states.values()) {
        if (st.lastShiftDate !== dateStr) st.consecutiveOff++
      }
    }

    // ============================================
    // 5. Insert
    // ============================================
    const created = await prisma.assignment.createMany({
      data: assignments.map((a) => ({
        date: a.date, userId: a.userId, shiftTemplateId: a.shiftTemplateId,
        status: 'PLANIFIE', createdBy: session.id,
      })),
      skipDuplicates: true,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id, action: 'CREATE', entity: 'Planning', entityId: month,
        newValues: {
          month, openBeds, staffJour: rules.staffJour, staffNuit: rules.staffNuit,
          workingDays, hoursDueFullTime: Math.round(hoursDueFullTime * 10) / 10,
          totalAssignments: created.count, deletedPrevious: deleted.count,
        },
      },
    })

    return NextResponse.json({
      success: true, month, openBeds,
      staffJour: rules.staffJour, staffNuit: rules.staffNuit,
      workingDaysInMonth: workingDays,
      hoursDueFullTime: Math.round(hoursDueFullTime * 10) / 10,
      totalAssignments: created.count, deletedPrevious: deleted.count,
      daysGenerated: daysInMonth, agentsScheduled: agents.length,
    })
  } catch (error) {
    console.error('Planning generation error:', error)
    return NextResponse.json({ message: 'Erreur lors de la génération' }, { status: 500 })
  }
}

// ============================================
// Vérifie si un agent peut travailler un jour donné
// ============================================
function canWork(
  id: string, dateStr: string, shiftType: 'JOUR' | 'NUIT',
  states: Map<string, AgentState>, unavailable: Set<string>,
  rules: Rules, agents: AgentInfo[],
): boolean {
  if (unavailable.has(`${id}:${dateStr}`)) return false
  const st = states.get(id)!
  if (st.lastShiftDate === dateStr) return false
  if (st.consecutiveShifts >= rules.maxConsecutiveShifts) return false
  if (shiftType === 'NUIT' && st.consecutiveNights >= rules.maxConsecutiveNights) return false
  if (rules.forbidJourAfterNuit && shiftType === 'JOUR' && st.lastShiftType === 'NUIT') return false
  if (st.last7DaysShifts.length >= rules.maxShiftsIn7Days) return false
  const agent = agents.find((a) => a.id === id)
  if (agent && st.totalShiftsThisMonth >= agent.targetShifts + 1) return false
  return true
}

// ============================================
// Sélection des agents
// ============================================
function pick(
  agents: AgentInfo[], states: Map<string, AgentState>, unavailable: Set<string>,
  dateStr: string, shiftType: 'JOUR' | 'NUIT', rules: Rules,
  isWE: boolean, isFri: boolean, alreadyAssigned: string[],
  needed: number, minPuer: number, puerAlready: number,
): string[] {
  type C = { id: string; score: number; competence: string }
  const candidates: C[] = []

  for (const agent of agents) {
    if (alreadyAssigned.includes(agent.id)) continue
    if (!canWork(agent.id, dateStr, shiftType, states, unavailable, rules, agents)) continue

    const st = states.get(agent.id)!

    // 1 WE sur N
    if (isWE) {
      const maxWE = Math.ceil(4.33 / rules.weekendFrequency)
      if (st.weekendWorkedThisMonth >= maxWE) continue
    }

    const maxOff = rules.maxConsecutiveOff[agent.workPercentage] || rules.maxConsecutiveOff[100] || 4

    let score = 0
    const remaining = agent.targetShifts - st.totalShiftsThisMonth
    score -= remaining * 10

    // Forcer si trop de repos consécutifs
    if (st.consecutiveOff >= maxOff) score -= 50
    else if (st.consecutiveOff >= maxOff - 1) score -= 25

    // Favoriser consécutifs (2 jours de suite)
    if (rules.favoriserConsecutifs && st.lastShiftDate === prevDate(dateStr)) score -= 30

    // WE en bloc
    if (isWE && rules.weekendEnBloc && st.lastShiftDate === prevDate(dateStr)) score -= 25
    if (isFri && rules.vendrediForceSiWeekend) score -= 15

    // Pénalité WE
    if (isWE) score += st.weekendWorkedThisMonth * 30

    score += Math.random() * 8
    candidates.push({ id: agent.id, score, competence: agent.competence })
  }

  candidates.sort((a, b) => a.score - b.score)
  const selected: string[] = []
  let puerCount = puerAlready

  // Puéricultrices d'abord
  if (puerCount < minPuer) {
    for (const c of candidates.filter((c) => c.competence === 'PUERICULTRCE')) {
      if (selected.length >= needed || puerCount >= minPuer) break
      selected.push(c.id)
      puerCount++
    }
  }

  for (const c of candidates) {
    if (selected.length >= needed) break
    if (selected.includes(c.id)) continue
    selected.push(c.id)
  }

  return selected
}

// ============================================
// Helpers
// ============================================
function bump(st: AgentState, dateStr: string, type: 'JOUR' | 'NUIT', isSat: boolean) {
  if (st.lastShiftDate === prevDate(dateStr) || st.lastShiftDate === dateStr) {
    st.consecutiveShifts++
  } else {
    st.consecutiveShifts = 1
  }
  if (type === 'NUIT') {
    st.consecutiveNights = (st.lastShiftType === 'NUIT' && (st.lastShiftDate === prevDate(dateStr) || st.lastShiftDate === dateStr))
      ? st.consecutiveNights + 1 : 1
  } else {
    st.consecutiveNights = 0
  }
  st.lastShiftType = type
  st.lastShiftDate = dateStr
  st.totalShiftsThisMonth++
  st.consecutiveOff = 0
  st.last7DaysShifts.push(dateStr)
  if (isSat) st.weekendWorkedThisMonth++
}

function countWorkingDays(year: number, month: number): number {
  const end = new Date(year, month + 1, 0)
  let count = 0
  const cur = new Date(year, month, 1)
  while (cur <= end) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function fmtDate(d: Date): string { return d.toISOString().split('T')[0] }
function prevDate(s: string): string { const d = new Date(s); d.setDate(d.getDate() - 1); return fmtDate(d) }
