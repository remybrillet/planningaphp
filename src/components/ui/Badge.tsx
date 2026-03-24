import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'jour' | 'nuit'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-secondary-100 text-secondary-700',
  success: 'bg-accent-50 text-accent-700',
  error: 'bg-error-50 text-error-700',
  warning: 'bg-warning-50 text-warning-700',
  info: 'bg-primary-50 text-primary-700',
  jour: 'bg-amber-50 text-amber-700',
  nuit: 'bg-indigo-50 text-indigo-700',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
