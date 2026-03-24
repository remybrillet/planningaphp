import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createLeaveRequestSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createLeaveRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { type, startDate, endDate, reason } = parsed.data

    // Check for overlapping leave requests
    const overlap = await prisma.leaveRequest.findFirst({
      where: {
        userId: session.id,
        status: { in: ['EN_ATTENTE', 'APPROUVE'] },
        OR: [
          { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } },
        ],
      },
    })

    if (overlap) {
      return NextResponse.json(
        { message: 'Une demande de congé existe déjà sur cette période' },
        { status: 409 }
      )
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: session.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || null,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE',
        entity: 'LeaveRequest',
        entityId: leaveRequest.id,
        newValues: { type, startDate, endDate, reason },
      },
    })

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error('Create leave error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la demande' },
      { status: 500 }
    )
  }
}
