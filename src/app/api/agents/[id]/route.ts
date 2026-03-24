import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('ADMIN')
    const { id } = await params
    const body = await request.json()

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id },
      data: body,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: id,
        oldValues: { isActive: user.isActive },
        newValues: body,
      },
    })

    return NextResponse.json({ id: updated.id, isActive: updated.isActive })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
