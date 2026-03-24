import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from './prisma'
import type { SafeUser } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret'
)

export type SessionUser = {
  id: string
  email: string
  role: 'ADMIN' | 'GESTIONNAIRE' | 'EMPLOYE'
  firstName: string
  lastName: string
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as SessionUser['role'],
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
    }
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error('Non authentifié')
  }
  return session
}

export async function requireRole(
  ...roles: SessionUser['role'][]
): Promise<SessionUser> {
  const session = await requireAuth()
  if (!roles.includes(session.role)) {
    throw new Error('Accès non autorisé')
  }
  return session
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      competence: true,
      workPercentage: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}
