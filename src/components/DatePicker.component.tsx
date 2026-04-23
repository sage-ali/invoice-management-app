import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  getDaysInMonth,
  formatDate,
} from '@/features/invoices/utils/dateHelpers'

interface DatePickerProps {
  label: string
  value: Date
  onChange: (date: Date) => void
  className?: string
}

export const DatePicker = ({
  label,
  value,
  onChange,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date(value))
  const containerRef = useRef<HTMLDivElement>(null)

  const { firstDay, daysInMonth } = getDaysInMonth(viewDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + offset)))
  }

  return (
    <div
      className={cn('relative flex flex-col gap-2', className)}
      ref={containerRef}
    >
      <label className="text-body text-neutral-400 dark:text-neutral-200">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-heading-s text-dark-text dark:bg-dark-surface focus-visible:outline-primary flex w-full items-center justify-between rounded border bg-white px-5 py-4 font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-white ${
          isOpen
            ? 'border-primary dark:border-primary' // Keeps the border purple while the calendar is open
            : 'hover:border-primary focus:border-primary dark:border-dark-hover dark:focus:border-primary border-neutral-200'
        }`}
      >
        {formatDate(value)}
        <svg
          className="ml-2.5"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V7h13.334v7z"
            fill="#7E88C3"
            fillRule="nonzero"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="shadow-dropdown dark:bg-dark-hover absolute top-[calc(100%+8px)] z-30 w-60 rounded-lg bg-white p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              type="button"
              className="text-primary focus-visible:outline-primary rounded hover:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Previous month"
            >
              <svg
                width="7"
                height="11"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6.712 9.142L2.57 5l4.142-4.142L5.298 0 0 5.298l5.298 5.298z"
                  fill="currentColor"
                  fillRule="nonzero"
                />
              </svg>
            </button>
            <span className="text-heading-s font-bold dark:text-white">
              {viewDate.toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <button
              onClick={() => changeMonth(1)}
              type="button"
              className="text-primary focus-visible:outline-primary rounded hover:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Next month"
            >
              <svg
                width="7"
                height="11"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M0 9.142L4.142 5 0 .858 1.414 0 6.712 5.298 1.414 10.596z"
                  fill="currentColor"
                  fillRule="nonzero"
                />
              </svg>
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {blanks.map((b) => (
              <div key={`b-${b}`} />
            ))}
            {days.map((d) => {
              const isSelected =
                value.getDate() === d &&
                value.getMonth() === viewDate.getMonth() &&
                value.getFullYear() === viewDate.getFullYear()
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(new Date(viewDate.setDate(d)))
                    setIsOpen(false)
                  }}
                  className={cn(
                    'text-heading-s hover:text-primary focus-visible:outline-primary rounded font-bold focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-white',
                    isSelected && 'text-primary'
                  )}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
