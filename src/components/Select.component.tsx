'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: number | string
}

interface SelectProps {
  label: string
  options: Option[]
  value: number | string
  onChange: (value: number | string) => void
  className?: string
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  className,
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
          'text-heading-s text-dark-text hover:border-primary focus:border-primary dark:border-dark-hover dark:bg-dark-surface flex w-full items-center justify-between rounded border border-neutral-200 bg-white px-5 py-4 font-bold transition-colors outline-none dark:text-white',
          isOpen && 'border-primary'
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
