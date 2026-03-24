import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

// DELETE — Supprimer tout le planning prévisionnel d'un mois
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ message: 'Mois invalide' }, { status: 400 })
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    const deleted = await prisma.assignment.deleteMany({
      where: {
        date: { gte: startDate, lte: endDate },
        status: 'PLANIFIE',
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'DELETE',
        entity: 'Planning',
        entityId: month,
        newValues: { month, deletedCount: deleted.count },
      },
    })

    return NextResponse.json({
      success: true,
      month,
      deletedCount: deleted.count,
    })
  } catch (error) {
    console.error('Delete planning error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

// PATCH — Confirmer tout le planning prévisionnel d'un mois
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const body = await request.json()
    const { month } = body

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ message: 'Mois invalide' }, { status: 400 })
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    const confirmed = await prisma.assignment.updateMany({
      where: {
        date: { gte: startDate, lte: endDate },
        status: 'PLANIFIE',
      },
      data: { status: 'CONFIRME' },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'Planning',
        entityId: month,
        newValues: { month, confirmedCount: confirmed.count, status: 'CONFIRME' },
      },
    })

    return NextResponse.json({
      success: true,
      month,
      confirmedCount: confirmed.count,
    })
  } catch (error) {
    console.error('Confirm planning error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la confirmation' },
      { status: 500 }
    )
  }
}
