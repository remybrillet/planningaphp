import { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { AdminUsersView } from '@/components/admin/AdminUsersView'

export const metadata: Metadata = {
  title: 'Gestion des utilisateurs',
  description: 'Administration des utilisateurs — PlanningAPHP',
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
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
    orderBy: [{ role: 'asc' }, { lastName: 'asc' }],
  })

  const formatted = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Gestion des utilisateurs
        </h1>
        <p className="mt-1 text-secondary-500">
          {users.length} utilisateurs enregistrés
        </p>
      </div>
      <AdminUsersView users={formatted} />
    </div>
  )
}
