import { cn } from '@/lib/utils'
import { InvoiceStatus } from '@/app/invoices/page'

interface BadgeProps {
  status: InvoiceStatus
  className?: string
}

export const Badge = ({ status, className }: BadgeProps) => {
  const statusConfig: Record<
    InvoiceStatus,
    { label: string; styles: string; dot: string }
  > = {
    paid: {
      label: 'Paid',
      styles: 'bg-[#33d69f14] text-[#33D69F]',
      dot: 'bg-[#33D69F]',
    },
    pending: {
      label: 'Pending',
      styles: 'bg-[#ff8f0014] text-[#FF8F00]',
      dot: 'bg-[#FF8F00]',
    },
    draft: {
      label: 'Draft',
      styles:
        'bg-[#373b5314] text-[#373B53] dark:bg-[#dfe3fa14] dark:text-[#DFE3FA]',
      dot: 'bg-[#373B53] dark:bg-[#DFE3FA]',
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'text-heading-s inline-flex h-10 w-26 items-center justify-center gap-2 rounded-md font-bold capitalize',
        config.styles,
        className
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', config.dot)} />
      {config.label}
    </div>
  )
}
