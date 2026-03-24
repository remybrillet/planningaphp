import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { createAssignmentSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN', 'GESTIONNAIRE')
    const body = await request.json()

    const parsed = createAssignmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { date, userId, shiftTemplateId, notes } = parsed.data

    // Check for duplicate assignment
    const existing = await prisma.assignment.findFirst({
      where: {
        date: new Date(date),
        userId,
        shiftTemplateId,
        status: { not: 'ANNULE' },
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Cet agent est déjà affecté à ce shift ce jour-là' },
        { status: 409 }
      )
    }

    // Check minimum rest time
    const shiftTemplate = await prisma.shiftTemplate.findUnique({
      where: { id: shiftTemplateId },
    })

    if (!shiftTemplate) {
      return NextResponse.json(
        { message: 'Shift non trouvé' },
        { status: 404 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        date: new Date(date),
        userId,
        shiftTemplateId,
        notes: notes || null,
        createdBy: session.id,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, competence: true },
        },
        shiftTemplate: {
          select: { id: true, name: true, type: true, startTime: true, endTime: true },
        },
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE',
        entity: 'Assignment',
        entityId: assignment.id,
        newValues: { date, userId, shiftTemplateId },
      },
    })

    // Notify the agent
    await prisma.notification.create({
      data: {
        userId,
        type: 'NOUVELLE_AFFECTATION',
        title: 'Nouvelle affectation',
        message: `Vous avez été affecté(e) au shift ${shiftTemplate.name} le ${new Date(date).toLocaleDateString('fr-FR')}.`,
        link: '/planning',
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
