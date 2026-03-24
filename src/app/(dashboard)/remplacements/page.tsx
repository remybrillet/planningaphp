import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { RemplacementsView } from '@/components/remplacements/RemplacementsView'

export const metadata: Metadata = {
  title: 'Remplacements',
  description: 'Gestion des remplacements — Réanimation Néonatale CHIPS',
}

export default async function RemplacementsPage() {
  await requireRole('ADMIN', 'GESTIONNAIRE')

  const agents = await prisma.user.findMany({
    where: { isActive: true, role: 'EMPLOYE' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      competence: true,
      workPercentage: true,
      email: true,
    },
    orderBy: { lastName: 'asc' },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get leave requests for the upcoming period
  const upcomingLeaves = await prisma.leaveRequest.findMany({
    where: {
      status: 'APPROUVE',
      endDate: { gte: today },
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, competence: true },
      },
    },
    orderBy: { startDate: 'asc' },
  })

  const formattedLeaves = upcomingLeaves.map((l) => ({
    ...l,
    startDate: l.startDate.toISOString().split('T')[0],
    endDate: l.endDate.toISOString().split('T')[0],
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    reviewedAt: l.reviewedAt?.toISOString() || null,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Gestion des remplacements
        </h1>
        <p className="mt-1 text-secondary-500">
          Identifiez les agents disponibles et organisez les remplacements
        </p>
      </div>
      <RemplacementsView agents={agents} upcomingLeaves={formattedLeaves} />
    </div>
  )
}
