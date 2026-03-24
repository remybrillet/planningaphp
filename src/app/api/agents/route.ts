import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { createUserSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('ADMIN')
    const body = await request.json()

    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { password, ...data } = parsed.data

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return NextResponse.json(
        { message: 'Cette adresse email est déjà utilisée' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        newValues: { email: data.email, role: data.role, competence: data.competence },
      },
    })

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
