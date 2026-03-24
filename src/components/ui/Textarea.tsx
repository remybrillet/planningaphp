'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors text-secondary-800 placeholder:text-secondary-400 min-h-[100px] resize-y',
            error
              ? 'border-error-500 focus:ring-2 focus:ring-error-500'
              : 'border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
