'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  useInvoiceStore,
  selectInvoiceById,
} from '@/features/invoices/store/invoiceStore'
import { Badge } from '@/components/Badge.component'
import { Button } from '@/components/Button.component'
import { Modal } from '@/components/Modal.component' // Assuming you saved the modal here
import { InvoiceDetailCard } from '../../../features/invoices/components/InvoiceDetailsCard.component'
import { Invoice } from '../../../features/invoices/types/store'
import { InvoiceForm } from '@/features/invoices/components/InvoiceForm.component'

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  // Get store actions & data
  const invoice = useInvoiceStore(selectInvoiceById(params.id))
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice)
  const markAsPaid = useInvoiceStore((state) => state.markAsPaid)

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (!invoice) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-24">
        <h1 className="text-heading-l text-dark-text font-bold dark:text-white">
          Invoice Not Found
        </h1>
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="mt-8"
        >
          Go Back
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    router.push('/')
  }

  return (
    <>
      <div className="mx-auto mb-24 w-full max-w-182.5 px-6 py-8 md:mb-0 md:py-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group text-heading-s text-dark-text focus-visible:outline-primary mb-8 flex items-center gap-6 rounded font-bold transition-colors hover:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-white"
        >
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.342.886L2.114 5.114l4.228 4.228"
              stroke="#9277FF"
              strokeWidth="2"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
          Go back
        </button>

        {/* Header Bar */}
        <header className="dark:bg-dark-surface mb-6 flex h-22 w-full max-w-182.5 items-center justify-between rounded-lg bg-white px-8 py-6 shadow-sm">
          <div className="flex h-10 w-full items-center justify-between md:w-auto md:justify-start md:gap-4">
            <span className="text-body text-neutral-400 dark:text-neutral-200">
              Status
            </span>
            <Badge status={invoice.status} />
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:block">
            <ActionButtons
              invoice={invoice}
              markAsPaid={markAsPaid}
              setDeleteModalOpen={setDeleteModalOpen}
              edit={() => setIsFormOpen(true)}
            />
          </div>
        </header>

        {/* Main Content */}
        <InvoiceDetailCard invoice={invoice} />

        {/* Mobile Action Buttons (Fixed Bottom) */}
        <div className="dark:bg-dark-surface shadow-top-light fixed bottom-0 left-0 flex w-full justify-center bg-white p-6 md:hidden">
          <ActionButtons
            invoice={invoice}
            markAsPaid={markAsPaid}
            setDeleteModalOpen={setDeleteModalOpen}
            edit={() => setIsFormOpen(true)}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Deletion"
        >
          <p className="mb-8">
            Are you sure you want to delete invoice{' '}
            <span className="font-bold">#{invoice.id}</span>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>

      {/* Render the form in Edit mode by passing the invoice */}
      {isFormOpen && (
        <InvoiceForm invoice={invoice} onClose={() => setIsFormOpen(false)} />
      )}
    </>
  )
}

interface ActionButtonsProps {
  invoice: Invoice
  markAsPaid: (id: string) => void
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  edit: () => void
}

// The action buttons are reused in Desktop Header and Mobile Footer
const ActionButtons = ({
  invoice,
  markAsPaid,
  setDeleteModalOpen,
  edit,
}: ActionButtonsProps) => (
  <div className="flex w-full flex-wrap items-center gap-2 md:h-12 md:w-77.25 md:flex-nowrap md:justify-end">
    <Button variant="secondary" onClick={edit}>
      Edit
    </Button>
    <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
      Delete
    </Button>
    {invoice.status === 'pending' && (
      <Button variant="primary" onClick={() => markAsPaid(invoice.id)}>
        Mark as Paid
      </Button>
    )}
  </div>
)
