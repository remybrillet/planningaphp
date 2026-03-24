import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const month = searchParams.get('month') // YYYY-MM

  if (!userId || !month) {
    return NextResponse.json({ message: 'userId et month requis' }, { status: 400 })
  }

  const [year, monthNum] = month.split('-').map(Number)
  const startDate = new Date(year, monthNum - 1, 1)
  const endDate = new Date(year, monthNum, 0)

  try {
    // Load shifts_per_month from config
    const shiftsConfig = await prisma.configuration.findUnique({ where: { key: 'shifts_per_month_full_time' } })
    const shiftsPerMonthBase = parseInt(shiftsConfig?.value || '13')

    const [user, assignments, leaves] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          competence: true,
          workPercentage: true,
          email: true,
        },
      }),
      prisma.assignment.findMany({
        where: {
          userId,
          date: { gte: startDate, lte: endDate },
          status: { not: 'ANNULE' },
        },
        include: {
          shiftTemplate: { select: { name: true, type: true, duration: true } },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.leaveRequest.findMany({
        where: {
          userId,
          status: { in: ['APPROUVE', 'EN_ATTENTE'] },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      }),
    ])

    if (!user) {
      return NextResponse.json({ message: 'Agent non trouvé' }, { status: 404 })
    }

    const jourShifts = assignments.filter((a) => a.shiftTemplate.type === 'JOUR')
    const nuitShifts = assignments.filter((a) => a.shiftTemplate.type === 'NUIT')
    const totalHours = assignments.reduce((sum, a) => sum + a.shiftTemplate.duration, 0)
    const weekendShifts = assignments.filter((a) => {
      const dow = a.date.getDay()
      return dow === 0 || dow === 6
    })

    const targetShifts = Math.round((user.workPercentage / 100) * shiftsPerMonthBase)

    return NextResponse.json({
      user,
      stats: {
        totalShifts: assignments.length,
        jourShifts: jourShifts.length,
        nuitShifts: nuitShifts.length,
        totalHours,
        weekendShifts: weekendShifts.length,
        targetShifts,
        leaves: leaves.length,
      },
      assignments: assignments.map((a) => ({
        id: a.id,
        date: a.date.toISOString().split('T')[0],
        status: a.status,
        shift: a.shiftTemplate.name,
        type: a.shiftTemplate.type,
      })),
    })
  } catch (error) {
    console.error('Agent stats error:', error)
    return NextResponse.json({ message: 'Erreur' }, { status: 500 })
  }
}
