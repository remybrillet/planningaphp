import { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { ConfigurationView } from '@/components/admin/ConfigurationView'

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Configuration du service — PlanningAPHP',
}

export default async function ConfigurationPage() {
  const configs = await prisma.configuration.findMany({
    orderBy: { key: 'asc' },
  })

  const shiftTemplates = await prisma.shiftTemplate.findMany({
    orderBy: { type: 'asc' },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Configuration</h1>
        <p className="mt-1 text-secondary-500">
          Paramètres du service et des shifts
        </p>
      </div>
      <ConfigurationView configs={configs} shiftTemplates={shiftTemplates} />
    </div>
  )
}
