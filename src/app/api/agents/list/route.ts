import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const agents = await prisma.user.findMany({
    where: { isActive: true, role: 'EMPLOYE' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      competence: true,
    },
    orderBy: { lastName: 'asc' },
  })

  return NextResponse.json({ agents })
}
