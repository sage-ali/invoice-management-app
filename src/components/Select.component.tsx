'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface Option {
  label: string
  value: number | string
}

interface SelectProps {
  label: string
  options: Option[]
  value: number | string
  onChange: (value: number | string) => void
  className?: string
  buttonClassName?: string
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  className,
  buttonClassName,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div
      className={cn('relative flex flex-col gap-2', className)}
      ref={containerRef}
    >
      <label className="text-body text-neutral-400 dark:text-neutral-200">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          // 1. Base Layout & Typography
          'text-heading-s text-dark-text dark:bg-dark-surface flex w-full items-center justify-between rounded border bg-white px-5 py-4 font-bold transition-colors duration-200 dark:text-white',
          'hover:border-primary focus:border-primary dark:border-dark-hover dark:focus:border-primary border-neutral-200',
          'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
          isOpen && 'border-primary dark:border-primary',

          // 5. Custom Overrides (always goes last)
          buttonClassName
        )}
      >
        {selectedOption?.label}
        <svg
          className={cn(
            'ml-2 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="shadow-dropdown dark:bg-dark-hover absolute top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-lg bg-white">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'text-heading-s text-dark-text hover:text-primary dark:border-dark-bg dark:hover:text-primary w-full border-b border-neutral-200 px-6 py-4 text-left font-bold transition-colors last:border-none dark:text-neutral-200',
                option.value === value && 'text-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
