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
import { InvoiceDetailCard } from '../components/InvoiceDetailsCard.component'
import { Invoice } from '../types/store'

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  // Get store actions & data
  const invoice = useInvoiceStore(selectInvoiceById(params.id))
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice)
  const markAsPaid = useInvoiceStore((state) => state.markAsPaid)

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

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
    <div className="mx-auto mb-24 w-full max-w-3xl px-6 py-8 md:mb-0 md:py-16">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group text-heading-s text-dark-text mb-8 flex items-center gap-6 font-bold transition-colors hover:text-neutral-400 dark:text-white"
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
      <header className="dark:bg-dark-surface mb-6 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
        <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-4">
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
            edit={() => console.log('Edit clicked')}
          />
        </div>
      </header>

      {/* Main Content */}
      <InvoiceDetailCard invoice={invoice} />

      {/* Mobile Action Buttons (Fixed Bottom) */}
      <div className="dark:bg-dark-surface fixed bottom-0 left-0 flex w-full justify-center bg-white p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:hidden">
        <ActionButtons
          invoice={invoice}
          markAsPaid={markAsPaid}
          setDeleteModalOpen={setDeleteModalOpen}
          edit={() => console.log('Edit clicked')}
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
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
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
  <div className="flex items-center gap-2 md:gap-4">
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
