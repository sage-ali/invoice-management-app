export interface Invoice {
  id: string
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  status: InvoiceStatus
  senderAddress: Address
  clientAddress: Address
  items: InvoiceItem[]
  total: number
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid'

interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

export interface InvoiceItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface Props {
  params: {
    id: string
  }
}
export default function Page({ params }: Props) {
  const { id } = params

  return (
    <>
      <h1>Page {id}</h1>
      <p>Page content</p>
    </>
  )
}
