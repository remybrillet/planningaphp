import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { AgentsList } from '@/components/planning/AgentsList'

export const metadata: Metadata = {
  title: 'Agents',
  description: 'Gestion des agents — Réanimation Néonatale CHIPS',
}

export default async function AgentsPage() {
  await requireRole('ADMIN', 'GESTIONNAIRE')

  const agents = await prisma.user.findMany({
    where: { isActive: true },
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
    orderBy: { lastName: 'asc' },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Gestion des agents
        </h1>
        <p className="mt-1 text-secondary-500">
          {agents.length} agents actifs dans le service
        </p>
      </div>
      <AgentsList agents={agents} />
    </div>
  )
}
