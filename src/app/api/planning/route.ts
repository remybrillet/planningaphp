import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { message: 'Dates de début et fin requises' },
      { status: 400 }
    )
  }

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            competence: true,
          },
        },
        shiftTemplate: {
          select: {
            id: true,
            name: true,
            type: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { shiftTemplate: { type: 'asc' } }],
    })

    // Format dates for JSON
    const formatted = assignments.map((a) => ({
      ...a,
      date: a.date.toISOString().split('T')[0],
    }))

    return NextResponse.json({ assignments: formatted })
  } catch (error) {
    console.error('Planning fetch error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du chargement du planning' },
      { status: 500 }
    )
  }
}
