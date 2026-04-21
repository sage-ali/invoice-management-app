import { formatDate } from '@/features/invoices/utils/dateHelpers'
import { Invoice, InvoiceItem } from '../page'

export const InvoiceDetailCard = ({ invoice }: { invoice: Invoice }) => {
  return (
    <div className="dark:bg-dark-surface rounded-lg bg-white p-6 shadow-sm md:p-12">
      {/* Top Section: ID & Addresses */}
      <div className="mb-10 flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col">
          <span className="text-heading-s text-dark-text font-bold dark:text-white">
            <span className="text-neutral-400">#</span>
            {invoice.id}
          </span>
          <span className="text-body mt-2 text-neutral-400 dark:text-neutral-200">
            {invoice.description}
          </span>
        </div>

        <div className="text-body flex flex-col text-left text-neutral-400 md:text-right dark:text-neutral-200">
          <span>{invoice.senderAddress.street}</span>
          <span>{invoice.senderAddress.city}</span>
          <span>{invoice.senderAddress.postCode}</span>
          <span>{invoice.senderAddress.country}</span>
        </div>
      </div>

      {/* Middle Section: Dates & Client Info */}
      <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="text-body mb-3 text-neutral-400 dark:text-neutral-200">
              Invoice Date
            </span>
            <span className="text-heading-s text-dark-text font-bold dark:text-white">
              {formatDate(new Date(invoice.createdAt))}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-body mb-3 text-neutral-400 dark:text-neutral-200">
              Payment Due
            </span>
            <span className="text-heading-s text-dark-text font-bold dark:text-white">
              {formatDate(new Date(invoice.paymentDue))}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-body mb-3 text-neutral-400 dark:text-neutral-200">
            Bill To
          </span>
          <span className="text-heading-s text-dark-text mb-2 font-bold dark:text-white">
            {invoice.clientName}
          </span>
          <div className="text-body flex flex-col text-neutral-400 dark:text-neutral-200">
            <span>{invoice.clientAddress.street}</span>
            <span>{invoice.clientAddress.city}</span>
            <span>{invoice.clientAddress.postCode}</span>
            <span>{invoice.clientAddress.country}</span>
          </div>
        </div>

        <div className="flex flex-col md:col-start-3 md:row-start-1">
          <span className="text-body mb-3 text-neutral-400 dark:text-neutral-200">
            Sent to
          </span>
          <span className="text-heading-s text-dark-text font-bold dark:text-white">
            {invoice.clientEmail}
          </span>
        </div>
      </div>

      {/* Items Table Area */}
      <div className="overflow-hidden rounded-lg">
        {/* Table Header / Body */}
        <div className="dark:bg-dark-hover bg-[#F9FAFE] p-6 md:p-8">
          {/* Desktop Table Headers */}
          <div className="text-body mb-8 hidden grid-cols-5 text-neutral-400 md:grid dark:text-neutral-200">
            <span className="col-span-2">Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {/* Items List */}
          <div className="flex flex-col gap-6">
            {invoice.items.map((item: InvoiceItem, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between md:grid md:grid-cols-5"
              >
                {/* Mobile Left / Desktop Col 1-2 */}
                <div className="flex flex-col md:col-span-2 md:block">
                  <span className="text-heading-s text-dark-text font-bold dark:text-white">
                    {item.name}
                  </span>
                  {/* Mobile Only: QTY x Price */}
                  <span className="text-heading-s-alt mt-2 font-bold text-neutral-400 md:hidden dark:text-neutral-200">
                    {item.quantity} x £{' '}
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Desktop Only: QTY & Price */}
                <span className="text-heading-s hidden text-center font-bold text-neutral-400 md:block dark:text-neutral-200">
                  {item.quantity}
                </span>
                <span className="text-heading-s hidden text-right font-bold text-neutral-400 md:block dark:text-neutral-200">
                  £{' '}
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>

                {/* Always show Total on the right */}
                <span className="text-heading-s text-dark-text text-right font-bold dark:text-white">
                  £{' '}
                  {item.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Total Footer */}
        <div className="flex items-center justify-between bg-[#373B53] p-6 md:px-8 md:py-6 dark:bg-[#0C0E16]">
          <span className="text-body text-white">Amount Due</span>
          <span className="text-heading-l font-bold text-white">
            £{' '}
            {invoice.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
