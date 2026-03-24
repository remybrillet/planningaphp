'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors text-secondary-800 bg-white',
            error
              ? 'border-error-500 focus:ring-2 focus:ring-error-500'
              : 'border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
