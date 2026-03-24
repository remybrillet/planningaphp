import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-error-50 text-error-500 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-bold text-secondary-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-secondary-600 mb-4">
          Page introuvable
        </h2>
        <p className="text-secondary-500 mb-8 max-w-md">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/planning"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          Retour au planning
        </Link>
        <p className="mt-8 text-xs text-secondary-400">
          &copy; {new Date().getFullYear()} GHT Yvelines Nord | Développé par{' '}
          <a
            href="https://silverliningcloud.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary-500"
          >
            Silver Lining
          </a>
        </p>
      </div>
    </div>
  )
}
