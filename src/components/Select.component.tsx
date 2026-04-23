'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: React.ReactNode
  value: string | number
}

interface SelectProps {
  label: string
  options: SelectOption[]
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)

  // Generate unique IDs for ARIA attributes
  const uniqueId = useId()
  const listboxId = `${uniqueId}-listbox`
  const labelId = `${uniqueId}-label`

  // 1. Sync highlighted index with selected value when opened
  const handleOpenMenu = () => {
    const currentIndex = options.findIndex((opt) => opt.value === value)
    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
    setIsOpen(true)
  }

  // 2. Close dropdown if clicking outside
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

  // 3. The core Keyboard Event Engine
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      // Open the menu on Enter, Space, or Arrow keys
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        handleOpenMenu()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        )
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onChange(options[highlightedIndex].value)
        setIsOpen(false)
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div
      className={cn('relative flex flex-col gap-2', className)}
      ref={containerRef}
    >
      <label
        id={labelId}
        className="text-body text-neutral-400 dark:text-neutral-200"
      >
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        // ARIA Links
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        // Tells the screen reader which item in the list is currently virtually "focused"
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${listboxId}-option-${highlightedIndex}`
            : undefined
        }
        className={cn(
          'text-heading-s text-dark-text dark:bg-dark-surface flex w-full items-center justify-between gap-1 rounded border bg-white px-5 py-4 font-bold transition-colors duration-200 dark:text-white',
          'hover:border-primary focus:border-primary dark:border-dark-hover dark:focus:border-primary border-neutral-200',
          'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
          isOpen && 'border-primary dark:border-primary',
          buttonClassName
        )}
      >
        <span className="flex-1 text-left whitespace-nowrap">
          {selectedOption?.label || 'Select an option'}
        </span>
        <svg
          className={cn(
            'shrink-0 transition-transform duration-200',
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

      {/* Dropdown Menu (Listbox) */}
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          // Prevents the wrapper from stealing tab focus
          tabIndex={-1}
          className="dark:bg-dark-hover absolute top-[calc(100%+8px)] left-0 z-50 w-full overflow-hidden rounded-lg bg-white shadow-xl"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isHighlighted = index === highlightedIndex

            return (
              <li
                key={option.value}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'text-body cursor-pointer px-6 py-4 font-bold transition-colors',
                  // Highlighted state replaces hover so keyboard and mouse look the same
                  isHighlighted
                    ? 'text-primary dark:text-primary'
                    : 'text-dark-text dark:text-[#DFE3FA]',
                  'border-b border-neutral-200/50 last:border-0 dark:border-[#1E2139]'
                )}
                // When a mouse user hovers, update the highlighted index so keyboard/mouse stay in sync
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
