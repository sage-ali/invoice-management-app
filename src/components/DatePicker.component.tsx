import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  getDaysInMonth,
  formatDate,
} from '@/features/invoices/utils/dateHelpers'
import Image from 'next/image'

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
        <Image
          src="/assets/icon-calendar.svg"
          alt="Calendar"
          width={16}
          height={16}
          className="ml-2.5"
        />
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
              <Image
                src="/assets/icon-arrow-left.svg"
                alt="Previous"
                width={7}
                height={10}
              />
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
              <Image
                src="/assets/icon-arrow-right.svg"
                alt="Next"
                width={7}
                height={10}
              />
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
