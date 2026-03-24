import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { reviewLeaveSchema } from '@/lib/validations'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const { id } = await params
    const body = await request.json()

    const parsed = reviewLeaveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }

    const { status, reviewNote } = parsed.data

    const existing = await prisma.leaveRequest.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { message: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    if (existing.status !== 'EN_ATTENTE') {
      return NextResponse.json(
        { message: 'Cette demande a déjà été traitée' },
        { status: 409 }
      )
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy: session.id,
        reviewedAt: new Date(),
        reviewNote: reviewNote || null,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'LeaveRequest',
        entityId: id,
        oldValues: { status: existing.status },
        newValues: { status, reviewNote },
      },
    })

    // Create notification for the employee
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        type: status === 'APPROUVE' ? 'CONGE_APPROUVE' : 'CONGE_REFUSE',
        title: status === 'APPROUVE' ? 'Congé approuvé' : 'Congé refusé',
        message: `Votre demande de congé du ${existing.startDate.toLocaleDateString('fr-FR')} au ${existing.endDate.toLocaleDateString('fr-FR')} a été ${status === 'APPROUVE' ? 'approuvée' : 'refusée'}.`,
        link: '/conges',
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Review leave error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du traitement' },
      { status: 500 }
    )
  }
}
