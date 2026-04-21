'use client'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="shadow-dropdown dark:bg-dark-surface relative z-10 w-full max-w-120 rounded-lg bg-white p-8 sm:p-12">
        <h2 className="text-heading-m text-dark-text mb-4 font-bold dark:text-white">
          {title}
        </h2>
        <div className="text-body leading-6 text-neutral-400 dark:text-neutral-200">
          {children}
        </div>
      </div>
    </div>
  )
}
