import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

const updateShiftSchema = z.object({
  id: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM requis'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM requis'),
  duration: z.number().int().min(1).max(24),
  breakTime: z.number().int().min(0).max(120),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN')
    const body = await request.json()
    const { shifts } = body

    if (!Array.isArray(shifts)) {
      return NextResponse.json({ message: 'Format invalide' }, { status: 400 })
    }

    for (const shift of shifts) {
      const parsed = updateShiftSchema.safeParse(shift)
      if (!parsed.success) {
        return NextResponse.json(
          { message: `Shift invalide: ${parsed.error.errors[0].message}` },
          { status: 400 }
        )
      }

      await prisma.shiftTemplate.update({
        where: { id: parsed.data.id },
        data: {
          startTime: parsed.data.startTime,
          endTime: parsed.data.endTime,
          duration: parsed.data.duration,
          breakTime: parsed.data.breakTime,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'ShiftTemplate',
        entityId: 'bulk',
        newValues: shifts,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Shift update error:', error)
    return NextResponse.json({ message: 'Erreur' }, { status: 500 })
  }
}
