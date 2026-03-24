import { Metadata } from 'next'
import { PlanningView } from '@/components/planning/PlanningView'

export const metadata: Metadata = {
  title: 'Planning',
  description: 'Gestion du planning des équipes — Réanimation Néonatale CHIPS',
}

export default function PlanningPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">
          Planning des équipes
        </h1>
        <p className="mt-1 text-secondary-500">
          Gérez les affectations de votre équipe de réanimation néonatale
        </p>
      </div>
      <PlanningView />
    </div>
  )
}
