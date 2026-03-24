import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-secondary-800 mb-1">{title}</h3>
      <p className="text-sm text-secondary-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
