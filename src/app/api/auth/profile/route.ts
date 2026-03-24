import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { phone } = await request.json()

    await prisma.user.update({
      where: { id: session.id },
      data: { phone: phone || null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}
