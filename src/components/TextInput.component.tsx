import { cn } from '@/lib/utils'
import React from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  inputClassName?: string
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      className = '',
      inputClassName = '',
      id,
      ...props
    }: TextInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    // Generate a unique ID if one isn't provided, useful for a11y
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`

    // Generate a unique ID for the error message
    const errorId = error ? `${inputId}-error` : ''

    const baseInputStyles = `w-full bg-white px-5 text-heading-s font-bold text-dark-text py-4 border border-neutral-200 outline-none transition-colors duration-200 placeholder:text-neutral-300 hover:border-primary focus:border-primary dark:bg-dark-surface dark:text-neutral-100 dark:focus:border-dark-hover dark:border-dark-hover`

    const errorInputStyles = error
      ? 'border-danger focus:border-danger dark:border-danger dark:focus:border-danger'
      : ''

    return (
      <div
        className={cn(
          'flex w-full max-w-full flex-col gap-2 md:max-w-126',
          className
        )}
      >
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className={cn(
              'text-body transition-colors',
              error ? 'text-danger' : 'text-neutral-400 dark:text-neutral-200'
            )}
          >
            {label}
          </label>
          {/* Optional Error Message Display */}
          {error && (
            <span
              id={errorId}
              className="text-body-alt text-danger font-medium"
            >
              {error}
            </span>
          )}
        </div>

        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(baseInputStyles, errorInputStyles, inputClassName)}
          {...props}
        />
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
