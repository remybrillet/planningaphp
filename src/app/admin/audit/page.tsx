import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AuditView } from '@/components/admin/AuditView'

export const metadata: Metadata = {
  title: 'Journal d\'audit',
  description: 'Historique des actions — PlanningAPHP',
}

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
  })

  const formatted = logs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
    oldValues: log.oldValues as Record<string, unknown> | null,
    newValues: log.newValues as Record<string, unknown> | null,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Journal d&apos;audit
        </h1>
        <p className="mt-1 text-secondary-500">
          Historique de toutes les actions et modifications
        </p>
      </div>
      <AuditView logs={formatted} />
    </div>
  )
}
