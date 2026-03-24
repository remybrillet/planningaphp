import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN')
    const { configs } = await request.json()

    for (const config of configs) {
      await prisma.configuration.update({
        where: { id: config.id },
        data: { value: config.value },
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'Configuration',
        entityId: 'bulk',
        newValues: configs.reduce(
          (acc: Record<string, string>, c: { key: string; value: string }) => {
            acc[c.key] = c.value
            return acc
          },
          {}
        ),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Config update error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}
