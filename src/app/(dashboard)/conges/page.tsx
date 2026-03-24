import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CongesView } from '@/components/conges/CongesView'

export const metadata: Metadata = {
  title: 'Congés',
  description: 'Gestion des congés — Réanimation Néonatale CHIPS',
}

export default async function CongesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const isManager = session.role === 'ADMIN' || session.role === 'GESTIONNAIRE'

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: isManager ? {} : { userId: session.id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          competence: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const formatted = leaveRequests.map((lr) => ({
    ...lr,
    startDate: lr.startDate.toISOString().split('T')[0],
    endDate: lr.endDate.toISOString().split('T')[0],
    createdAt: lr.createdAt.toISOString(),
    updatedAt: lr.updatedAt.toISOString(),
    reviewedAt: lr.reviewedAt?.toISOString() || null,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Gestion des congés
        </h1>
        <p className="mt-1 text-secondary-500">
          CP, RTT, maladie, formation et déshydrata
        </p>
      </div>
      <CongesView
        leaveRequests={formatted}
        isManager={isManager}
        currentUserId={session.id}
      />
    </div>
  )
}
