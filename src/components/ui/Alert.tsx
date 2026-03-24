import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

type AlertProps = {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
}

const config: Record<AlertVariant, { icon: typeof Info; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-800' },
  error: { icon: AlertCircle, bg: 'bg-error-50', border: 'border-error-200', text: 'text-error-800' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-800' },
  info: { icon: Info, bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-800' },
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { icon: Icon, bg, border, text } = config[variant]

  return (
    <div
      className={cn('flex gap-3 p-4 rounded-lg border', bg, border, className)}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', text)} />
      <div className={text}>
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
