'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  Clock,
  ArrowLeftRight,
  FileBarChart,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  LayoutDashboard,
  SlidersHorizontal,
  ScrollText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/lib/auth'

const navigation = [
  { name: 'Planning', href: '/planning', icon: Calendar },
  { name: 'Agents', href: '/agents', icon: Users },
  { name: 'Congés', href: '/conges', icon: Clock },
  { name: 'Remplacements', href: '/remplacements', icon: ArrowLeftRight },
  { name: 'Rapports', href: '/rapports', icon: FileBarChart },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
]

const adminNavigation = [
  { name: 'Administration', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { name: 'Configuration', href: '/admin/configuration', icon: SlidersHorizontal },
  { name: 'Journal d\'audit', href: '/admin/audit', icon: ScrollText },
]

type Props = {
  user: SessionUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [appName, setAppName] = useState('PlanningAPHP')
  const [orgName, setOrgName] = useState('GHT Yvelines Nord')

  useEffect(() => {
    fetch('/api/configuration/public')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (!d) return
        if (d.config.app_name) setAppName(d.config.app_name)
        if (d.config.organization_name) setOrgName(d.config.organization_name)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <Link href="/planning" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-secondary-800">{appName}</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-secondary-400 hover:text-secondary-600"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Navigation principale">
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Administration
                </p>
              </div>
              {adminNavigation.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs text-secondary-400 text-center">
            &copy; {new Date().getFullYear()} {orgName}
            <br />
            Développé par{' '}
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
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-secondary-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-secondary-400 hover:text-secondary-600"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              className="relative text-secondary-400 hover:text-secondary-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm text-secondary-600 hover:text-secondary-800 transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <span className="hidden sm:block">
                  {user.firstName} {user.lastName}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-secondary-500">{user.role}</p>
                    </div>
                    <Link
                      href="/parametres"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
