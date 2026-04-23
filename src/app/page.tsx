'use client'

import { useInvoiceStore } from '@/features/invoices/store/invoiceStore'
import { InvoiceCard } from '@/features/invoices/components/InvoiceCard.component'
import Image from 'next/image'
import { Button } from '@/components/Button.component'
import { useState, useMemo } from 'react'
import { InvoiceForm } from '@/features/invoices/components/InvoiceForm.component'
import { FilterDropdown } from '@/features/invoices/components/FilterDropdown.component'

export default function InvoicesPage() {
  // Use the store and selectors
  const invoices = useInvoiceStore((state) => state.invoices)
  const statusFilter = useInvoiceStore((state) => state.statusFilter)
  const setStatusFilter = useInvoiceStore((state) => state.setStatusFilter)

  const [isFormOpen, setIsFormOpen] = useState(false)

  // Compute filtered invoices
  const filteredInvoices = useMemo(() => {
    if (!statusFilter || statusFilter.length === 0) return invoices
    return invoices.filter((inv) => statusFilter.includes(inv.status))
  }, [invoices, statusFilter])

  return (
    <>
      <div className="mx-auto w-full max-w-182.5 px-6 py-8 md:py-16">
        {/* Header Section */}
        <header className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-heading-l text-dark-text font-bold dark:text-white">
              Invoices
            </h1>
            <p className="text-body font-medium text-neutral-400 dark:text-neutral-200">
              <span className="hidden md:inline">
                {filteredInvoices.length > 0
                  ? `There are ${filteredInvoices.length} total invoices`
                  : 'No invoices'}
              </span>
              <span className="md:hidden">
                {filteredInvoices.length > 0
                  ? `${filteredInvoices.length} invoices`
                  : 'No invoices'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            {/* Status Filter Component */}
            <FilterDropdown
              selectedStatuses={statusFilter}
              onChange={setStatusFilter}
            />

            <Button
              variant="primary"
              className="h-11 w-22.5 md:h-12 md:w-37.5"
              icon={
                <Image
                  src="/assets/icon-plus.svg"
                  alt="Plus"
                  width={11}
                  height={11}
                />
              }
              onClick={() => setIsFormOpen(true)}
            >
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
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
      <div className="mb-10 w-60.25">
        <Image
          src="/assets/illustration-empty.svg"
          alt="No invoices found"
          className="h-auto w-full"
          width={241}
          height={200}
        />
      </div>
      <h2 className="text-dark-text text-[24px] leading-none font-bold tracking-[-0.75px] dark:text-white">
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
