import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre'
    ),
})

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = passwordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { message: 'Mot de passe actuel incorrect' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedPassword },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'UPDATE',
        entity: 'User',
        entityId: session.id,
        newValues: { field: 'password' },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { message: 'Erreur lors du changement' },
      { status: 500 }
    )
  }
}
