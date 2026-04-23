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
      // .showModal() creates the native backdrop and traps focus automatically
      dialog.showModal()
      document.body.style.overflow = 'hidden' // Prevent underlying page scroll
    } else {
      dialog.close()
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Listen for the native "Escape" key close event
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    // The 'cancel' event fires when the user presses Escape natively on a dialog
    const handleCancel = (e: Event) => {
      e.preventDefault() // Prevent immediate DOM close so React can handle state
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  // Handle clicking the native backdrop to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    if (!dialog) return

    // Calculate if the click was outside the bounds of the dialog content box
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
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
      className={cn(
        // Dialog Base
        'shadow-dropdown dark:bg-dark-surface w-full max-w-[480px] rounded-lg bg-white p-8 sm:p-12',
        'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
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
