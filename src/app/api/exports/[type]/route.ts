import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    await requireRole('ADMIN', 'GESTIONNAIRE')
    const { type } = await params
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)
    const format = searchParams.get('format') || 'pdf'

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    let data: string

    switch (type) {
      case 'planning-mensuel': {
        const assignments = await prisma.assignment.findMany({
          where: {
            date: { gte: startDate, lte: endDate },
            status: { not: 'ANNULE' },
          },
          include: {
            user: { select: { firstName: true, lastName: true, competence: true } },
            shiftTemplate: { select: { name: true, type: true } },
          },
          orderBy: [{ date: 'asc' }],
        })

        if (format === 'excel') {
          // CSV export as Excel alternative
          const header = 'Date,Agent,Compétence,Shift,Statut\n'
          const rows = assignments.map((a) =>
            `${a.date.toLocaleDateString('fr-FR')},${a.user.firstName} ${a.user.lastName},${a.user.competence},${a.shiftTemplate.name},${a.status}`
          ).join('\n')
          data = header + rows

          return new NextResponse(data, {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="planning-${month}.csv"`,
            },
          })
        }

        // Simple text-based PDF-like export
        data = `PLANNING MENSUEL — ${month}\n${'='.repeat(50)}\n\n`
        data += `Service : Réanimation Néonatale CHIPS Poissy\n`
        data += `Période : ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}\n\n`

        assignments.forEach((a) => {
          data += `${a.date.toLocaleDateString('fr-FR')} | ${a.shiftTemplate.name} | ${a.user.firstName} ${a.user.lastName} (${a.user.competence})\n`
        })

        return new NextResponse(data, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="planning-${month}.txt"`,
          },
        })
      }

      case 'heures-travaillees': {
        const assignments = await prisma.assignment.findMany({
          where: {
            date: { gte: startDate, lte: endDate },
            status: { in: ['PLANIFIE', 'CONFIRME'] },
          },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
            shiftTemplate: { select: { duration: true } },
          },
        })

        // Aggregate by user
        const userHours: Record<string, { name: string; hours: number }> = {}
        assignments.forEach((a) => {
          const key = a.user.id
          if (!userHours[key]) {
            userHours[key] = { name: `${a.user.firstName} ${a.user.lastName}`, hours: 0 }
          }
          userHours[key].hours += a.shiftTemplate.duration
        })

        if (format === 'excel') {
          const header = 'Agent,Heures travaillées\n'
          const rows = Object.values(userHours)
            .map((u) => `${u.name},${u.hours}`)
            .join('\n')

          return new NextResponse(header + rows, {
            headers: {
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': `attachment; filename="heures-${month}.csv"`,
            },
          })
        }

        data = `HEURES TRAVAILLÉES — ${month}\n${'='.repeat(50)}\n\n`
        Object.values(userHours).forEach((u) => {
          data += `${u.name} : ${u.hours}h\n`
        })

        return new NextResponse(data, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="heures-${month}.txt"`,
          },
        })
      }

      case 'solde-conges': {
        const leaves = await prisma.leaveRequest.findMany({
          where: {
            status: 'APPROUVE',
            startDate: { gte: new Date(year, 0, 1) },
            endDate: { lte: new Date(year, 11, 31) },
          },
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        })

        const header = 'Agent,Type,Du,Au,Jours\n'
        const rows = leaves.map((l) => {
          const days = Math.ceil((l.endDate.getTime() - l.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
          return `${l.user.firstName} ${l.user.lastName},${l.type},${l.startDate.toLocaleDateString('fr-FR')},${l.endDate.toLocaleDateString('fr-FR')},${days}`
        }).join('\n')

        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="conges-${month}.csv"`,
          },
        })
      }

      default:
        return NextResponse.json({ message: 'Type de rapport non supporté' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}
