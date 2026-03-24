import { Metadata } from 'next'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ParametresView } from '@/components/parametres/ParametresView'

export const metadata: Metadata = {
  title: 'Paramètres',
  description: 'Paramètres du compte — Réanimation Néonatale CHIPS',
}

export default async function ParametresPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      competence: true,
      workPercentage: true,
      phone: true,
    },
  })

  if (!user) redirect('/login')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Paramètres</h1>
        <p className="mt-1 text-secondary-500">
          Gérez votre compte et vos préférences
        </p>
      </div>
      <ParametresView user={user} />
    </div>
  )
}
