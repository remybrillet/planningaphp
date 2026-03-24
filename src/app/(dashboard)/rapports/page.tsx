import { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { requireRole } from '@/lib/auth'
import { RapportsView } from '@/components/rapports/RapportsView'

export const metadata: Metadata = {
  title: 'Rapports',
  description: 'Rapports et exports — Réanimation Néonatale CHIPS',
}

export default async function RapportsPage() {
  await requireRole('ADMIN', 'GESTIONNAIRE')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Rapports et exports
        </h1>
        <p className="mt-1 text-secondary-500">
          Générez des rapports pour votre service
        </p>
      </div>
      <RapportsView />
    </div>
  )
}
