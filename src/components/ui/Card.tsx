'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className, hoverable = false, onClick }: CardProps) {
  if (hoverable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-secondary-100', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-secondary-100 bg-secondary-50/50', className)}>
      {children}
    </div>
  )
}
