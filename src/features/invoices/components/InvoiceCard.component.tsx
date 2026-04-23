import Link from 'next/link'
import { Badge } from '@/components/Badge.component'
import { formatDate } from '@/features/invoices/utils/dateHelpers'
import Image from 'next/image'
import { Invoice } from '../types/store'

export const InvoiceCard = ({ invoice }: { invoice: Invoice }) => (
  <Link
    href={`/invoices/${invoice.id}`}
    className="focus-visible:outline-primary block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    <div className="group dark:bg-dark-surface hover:border-primary flex flex-col rounded-lg border border-transparent bg-white p-6 shadow-sm transition-colors duration-200 md:flex-row md:items-center md:justify-between">
      {/* Top Section (Mobile: Grid / Tablet+: Flex) */}
      <div className="grid grid-cols-2 items-center gap-4 md:flex md:gap-6 lg:gap-11">
        {/* ID - Column 1 Row 1 */}
        <span className="text-heading-s text-dark-text font-bold dark:text-white">
          <span className="text-primary">#</span>
          {invoice.id}
        </span>

        {/* Client Name - Column 2 Row 1 (Mobile: Text Right) */}
        <span className="text-body text-right text-neutral-400 md:text-left dark:text-white">
          {invoice.clientName}
        </span>

        {/* Due Date - Column 1 Row 2 */}
        <span className="text-body text-neutral-400 md:order-0 dark:text-neutral-200">
          Due {formatDate(new Date(invoice.paymentDue))}
        </span>
      </div>

      {/* Bottom Section (Mobile: Flex Row / Tablet+: Flex Row) */}
      <div className="mt-4 flex items-center justify-between md:mt-0 md:gap-8">
        {/* Total Price */}
        <span className="text-dark-text text-[20px] leading-8 font-bold tracking-[-0.5px] md:text-[24px] dark:text-white">
          £{' '}
          {invoice.total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>

        {/* Status Badge + Arrow */}
        <div className="flex items-center gap-5">
          <Badge status={invoice.status} />
          {/* Arrow is hidden on mobile in some versions, but keeping it for consistency */}
          <span className="hidden md:block">
            <Image
              src="/assets/icon-arrow-right.svg"
              alt="View Invoice"
              width={7}
              height={10}
            />
          </span>
        </div>
      </div>
    </div>
  </Link>
)
