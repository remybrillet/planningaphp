import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/planning')
  }

  return <DashboardShell user={session}>{children}</DashboardShell>
}
