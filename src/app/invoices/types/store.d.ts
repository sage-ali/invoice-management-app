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

// Define the specific shape of an update payload
export type InvoiceUpdatePayload = Partial<Omit<Invoice, 'id' | 'createdAt'>>

// Define the creation payload
export type InvoiceCreatePayload = Omit<Invoice, 'id' | 'createdAt'>
