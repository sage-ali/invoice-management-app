'use client'

import { useEffect, useRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Create a unique ID to link the title to the dialog for screen readers
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
      document.body.style.overflow = 'hidden' // Prevent underlying page scroll
    } else {
      if (dialog.open) {
        dialog.close()
      }
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle clicking the native backdrop to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // If the target is the dialog itself (the backdrop), close it.
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className={cn(
        // Dialog Base
        'shadow-dropdown dark:bg-dark-surface w-full max-w-120 rounded-lg bg-white p-8 sm:p-12',
        'backdrop:bg-black/50',
        'm-auto border-0 p-0 text-left outline-none',
        // Smooth animations when it opens (Requires tailwindcss-animate plugin, or custom CSS)
        'open:animate-in open:fade-in-0 open:zoom-in-95 backdrop:open:animate-in backdrop:open:fade-in-0'
      )}
    >
      <h2
        id={titleId}
        className="text-heading-m text-dark-text mb-4 font-bold dark:text-white"
      >
        {title}
      </h2>
      <div className="text-body leading-6 text-neutral-400 dark:text-neutral-200">
        {children}
      </div>
    </dialog>
  )
}
