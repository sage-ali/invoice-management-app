'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/lib/utils'
import { InvoiceStatus } from '@/features/invoices/types/store'
import Image from 'next/image'

interface FilterDropdownProps {
  selectedStatuses: InvoiceStatus[]
  onChange: (statuses: InvoiceStatus[]) => void
  className?: string
}

export const FilterDropdown = ({
  selectedStatuses,
  onChange,
  className,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const uniqueId = useId()
  const listboxId = `${uniqueId}-listbox`

  const toggleStatus = (status: InvoiceStatus) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onChange([...selectedStatuses, status])
    }
  }

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  const statuses: InvoiceStatus[] = ['draft', 'pending', 'paid']
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    paid: 'Paid',
  }

  return (
    <div
      className={cn('relative flex items-center', className)}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className="focus-visible:outline-primary flex items-center gap-3 rounded border-0 bg-transparent outline-none focus-visible:outline-2"
      >
        <span className="text-heading-s text-dark-text font-bold whitespace-nowrap transition-colors dark:text-white">
          <span className="hidden md:inline">Filter by status</span>
          <span className="md:hidden">Filter</span>
        </span>
        <Image
          src="/assets/icon-arrow-down.svg"
          alt="Arrow"
          width={11}
          height={7}
          className={cn(
            'shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          className="shadow-dropdown dark:bg-dark-hover absolute top-[calc(100%+24px)] left-1/2 z-50 flex w-48 -translate-x-1/2 flex-col gap-4 rounded-lg bg-white p-6 dark:shadow-none"
        >
          {statuses.map((status) => {
            const isSelected = selectedStatuses.includes(status)
            return (
              <li
                key={status}
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleStatus(status)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleStatus(status)
                  }
                }}
                tabIndex={0}
                className="group flex cursor-pointer items-center gap-3 outline-none"
              >
                {/* Custom Checkbox */}
                <div
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-transparent transition-colors',
                    isSelected
                      ? 'bg-primary'
                      : 'group-hover:border-primary group-focus:border-primary bg-[#DFE3FA] dark:bg-[#1E2139]'
                  )}
                >
                  {isSelected && (
                    <Image
                      src="/assets/icon-check.svg"
                      alt="Checked"
                      width={10}
                      height={8}
                    />
                  )}
                </div>

                {/* Label */}
                <span className="text-heading-s text-dark-text font-bold capitalize transition-colors dark:text-white">
                  {labels[status]}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
