'use client'

import { useInvoiceStore } from '@/features/invoices/store/invoiceStore'
import { InvoiceCard } from '@/features/invoices/components/InvoiceCard.component'
import Image from 'next/image'
import { Button } from '@/components/Button.component'
import { InvoiceStatus } from '../features/invoices/types/store'
import { Select, SelectOption } from '@/components/Select.component'
import { useState } from 'react'
import { InvoiceForm } from '@/features/invoices/components/InvoiceForm.component'

export default function InvoicesPage() {
  // Use the store and selectors
  const invoices = useInvoiceStore((state) => state.invoices)
  const statusFilter = useInvoiceStore((state) => state.statusFilter)
  const setStatusFilter = useInvoiceStore((state) => state.setStatusFilter)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filterValue, setFilterValue] = useState('all')
  const selectOptions: SelectOption[] = [
    { label: 'Filter by status', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
  ]

  // Perform the filter here.
  // It only re-runs when invoices or statusFilter actually change.
  const filteredInvoices =
    statusFilter === 'all'
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter)

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-6 py-8 md:py-16">
        {/* Header Section */}
        <header className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-heading-l text-dark-text font-bold dark:text-white">
              Invoices
            </h1>
            <p className="text-body text-neutral-400 dark:text-neutral-200">
              {filteredInvoices.length > 0
                ? `There are ${filteredInvoices.length} total invoices`
                : 'No invoices'}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            {/* Status Filter (Simple version for now) */}
            <div className="relative min-w-43.75">
              <Select
                label=""
                options={selectOptions}
                value={filterValue}
                buttonClassName="border-0 bg-transparent dark:bg-transparent justify-end"
                onChange={(val) => {
                  setFilterValue(val as InvoiceStatus)
                  setStatusFilter(val as InvoiceStatus)
                }}
              />
            </div>

            <Button
              variant="primary"
              icon={
                <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
                    fill="currentColor"
                    fillRule="nonzero"
                  />
                </svg>
              }
              onClick={() => setIsFormOpen(true)}
            >
              <span className="hidden sm:inline">New Invoice</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </header>

        {/* Invoice List or Empty State */}
        <div className="flex flex-col gap-4">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Render the form overlay if open */}
      {isFormOpen && <InvoiceForm onClose={() => setIsFormOpen(false)} />}
    </>
  )
}

function EmptyState() {
  return (
    <div className="mt-20 flex flex-col items-center text-center">
      <Image
        src="/assets/illustration-empty.svg"
        alt="No invoices found"
        className="mb-10 w-auto"
        width={75}
        height={75}
      />
      <h2 className="text-heading-m text-dark-text font-bold dark:text-white">
        There is nothing here
      </h2>
      <p className="text-body mt-6 max-w-55 text-neutral-400 dark:text-neutral-200">
        Create an invoice by clicking the <br />
        <strong className="font-bold">New Invoice</strong> button and get
        started.
      </p>
    </div>
  )
}
