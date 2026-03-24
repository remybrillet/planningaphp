import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  firstName: string
  lastName: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold',
        sizeStyles[size],
        className
      )}
      aria-label={`${firstName} ${lastName}`}
    >
      {initials}
    </div>
  )
}
