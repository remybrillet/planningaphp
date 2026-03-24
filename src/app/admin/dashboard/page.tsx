import { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Administration',
  description: 'Tableau de bord administrateur — PlanningAPHP',
}

export default async function AdminDashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [totalAgents, activeAgents, todayAssignments, pendingLeaves, recentLogs] =
    await Promise.all([
      prisma.user.count({ where: { role: 'EMPLOYE' } }),
      prisma.user.count({ where: { role: 'EMPLOYE', isActive: true } }),
      prisma.assignment.count({
        where: { date: { gte: today, lt: tomorrow }, status: { not: 'ANNULE' } },
      }),
      prisma.leaveRequest.count({ where: { status: 'EN_ATTENTE' } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      }),
    ])

  const formattedLogs = recentLogs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Tableau de bord
        </h1>
        <p className="mt-1 text-secondary-500">
          Vue d&apos;ensemble de votre service
        </p>
      </div>
      <AdminDashboard
        stats={{
          totalAgents,
          activeAgents,
          todayAssignments,
          pendingLeaves,
        }}
        recentLogs={formattedLogs}
      />
    </div>
  )
}
