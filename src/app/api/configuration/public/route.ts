import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET — retourne toutes les configurations pour le frontend (user connecté)
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const configs = await prisma.configuration.findMany()
  const shiftTemplates = await prisma.shiftTemplate.findMany({
    where: { isActive: true },
    orderBy: { type: 'asc' },
  })

  const map: Record<string, string> = {}
  for (const c of configs) {
    map[c.key] = c.value
  }

  return NextResponse.json({ config: map, shiftTemplates })
}
