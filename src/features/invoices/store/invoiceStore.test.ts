import { describe, it, expect, beforeEach } from 'vitest'
import { Invoice } from '@/app/invoices/types/store'
import {
  useInvoiceStore,
  selectFilteredInvoices,
  selectInvoiceById,
} from './invoiceStore'

// Mock crypto.randomUUID if not available in test environment
if (!global.crypto) {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(2, 15),
  } as Crypto
}

// Helper to create mock invoice data
const createMockInvoice = (
  overrides?: Partial<Invoice>
): Omit<Invoice, 'id' | 'createdAt'> => ({
  paymentDue: '2024-01-15',
  description: 'Website Redesign',
  paymentTerms: 30,
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  status: 'pending',
  senderAddress: {
    street: '123 Main St',
    city: 'London',
    postCode: 'E1 3EZ',
    country: 'United Kingdom',
  },
  clientAddress: {
    street: '456 Oak Ave',
    city: 'Manchester',
    postCode: 'M1 1AE',
    country: 'United Kingdom',
  },
  items: [
    {
      name: 'Design Service',
      quantity: 1,
      price: 1000,
      total: 1000,
    },
  ],
  total: 1000,
  ...overrides,
})

describe('Invoice Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useInvoiceStore.setState({ invoices: [], statusFilter: 'all' })
  })

  describe('Initial State', () => {
    it('should initialize with empty invoices array', () => {
      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toEqual([])
    })

    it('should initialize with "all" status filter', () => {
      const { statusFilter } = useInvoiceStore.getState()
      expect(statusFilter).toBe('all')
    })
  })

  describe('addInvoice', () => {
    it('should add a new invoice with generated id and createdAt', () => {
      const { addInvoice } = useInvoiceStore.getState()
      const mockInvoice = createMockInvoice()

      addInvoice(mockInvoice)

      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toHaveLength(1)
      expect(invoices[0]).toMatchObject(mockInvoice)
      expect(invoices[0].id).toBeDefined()
      expect(invoices[0].createdAt).toBeDefined()
    })

    it('should add multiple invoices', () => {
      const { addInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Alice' }))
      addInvoice(createMockInvoice({ clientName: 'Bob' }))
      addInvoice(createMockInvoice({ clientName: 'Charlie' }))

      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toHaveLength(3)
      expect(invoices[0].clientName).toBe('Alice')
      expect(invoices[1].clientName).toBe('Bob')
      expect(invoices[2].clientName).toBe('Charlie')
    })

    it('should generate unique IDs for each invoice', () => {
      const { addInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice())
      addInvoice(createMockInvoice())

      const { invoices } = useInvoiceStore.getState()
      expect(invoices[0].id).not.toBe(invoices[1].id)
    })
  })

  describe('updateInvoice', () => {
    it('should update an existing invoice', () => {
      const { addInvoice, updateInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Original Name' }))
      const { invoices } = useInvoiceStore.getState()
      const invoiceId = invoices[0].id

      updateInvoice(invoiceId, { clientName: 'Updated Name' })

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices[0].clientName).toBe('Updated Name')
    })

    it('should preserve unchanged fields when updating', () => {
      const { addInvoice, updateInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'John', total: 1000 }))
      const { invoices } = useInvoiceStore.getState()
      const invoiceId = invoices[0].id

      updateInvoice(invoiceId, { clientName: 'Jane' })

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices[0].clientName).toBe('Jane')
      expect(updatedState.invoices[0].total).toBe(1000)
    })

    it('should not affect other invoices when updating', () => {
      const { addInvoice, updateInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Alice' }))
      addInvoice(createMockInvoice({ clientName: 'Bob' }))

      const { invoices } = useInvoiceStore.getState()
      const aliceId = invoices[0].id

      updateInvoice(aliceId, { clientName: 'Alice Updated' })

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices[0].clientName).toBe('Alice Updated')
      expect(updatedState.invoices[1].clientName).toBe('Bob')
    })

    it('should handle updating non-existent invoice gracefully', () => {
      const { addInvoice, updateInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Alice' }))
      updateInvoice('non-existent-id', { clientName: 'Updated' })

      const { invoices } = useInvoiceStore.getState()
      expect(invoices[0].clientName).toBe('Alice')
    })
  })

  describe('deleteInvoice', () => {
    it('should delete an invoice by id', () => {
      const { addInvoice, deleteInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'To Delete' }))
      const { invoices } = useInvoiceStore.getState()
      const invoiceId = invoices[0].id

      deleteInvoice(invoiceId)

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices).toHaveLength(0)
    })

    it('should only delete the specified invoice', () => {
      const { addInvoice, deleteInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Alice' }))
      addInvoice(createMockInvoice({ clientName: 'Bob' }))
      addInvoice(createMockInvoice({ clientName: 'Charlie' }))

      const { invoices } = useInvoiceStore.getState()
      const bobId = invoices[1].id

      deleteInvoice(bobId)

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices).toHaveLength(2)
      expect(updatedState.invoices[0].clientName).toBe('Alice')
      expect(updatedState.invoices[1].clientName).toBe('Charlie')
    })

    it('should handle deleting non-existent invoice gracefully', () => {
      const { addInvoice, deleteInvoice } = useInvoiceStore.getState()

      addInvoice(createMockInvoice())
      deleteInvoice('non-existent-id')

      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toHaveLength(1)
    })
  })

  describe('markAsPaid', () => {
    it('should mark an invoice as paid', () => {
      const { addInvoice, markAsPaid } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ status: 'pending' }))
      const { invoices } = useInvoiceStore.getState()
      const invoiceId = invoices[0].id

      markAsPaid(invoiceId)

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices[0].status).toBe('paid')
    })

    it('should only mark the specified invoice as paid', () => {
      const { addInvoice, markAsPaid } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Alice', status: 'pending' }))
      addInvoice(createMockInvoice({ clientName: 'Bob', status: 'draft' }))

      const { invoices } = useInvoiceStore.getState()
      const aliceId = invoices[0].id

      markAsPaid(aliceId)

      const updatedState = useInvoiceStore.getState()
      expect(updatedState.invoices[0].status).toBe('paid')
      expect(updatedState.invoices[1].status).toBe('draft')
    })
  })

  describe('setStatusFilter', () => {
    it('should set status filter to "draft"', () => {
      const { setStatusFilter } = useInvoiceStore.getState()

      setStatusFilter('draft')

      const { statusFilter } = useInvoiceStore.getState()
      expect(statusFilter).toBe('draft')
    })

    it('should set status filter to "pending"', () => {
      const { setStatusFilter } = useInvoiceStore.getState()

      setStatusFilter('pending')

      const { statusFilter } = useInvoiceStore.getState()
      expect(statusFilter).toBe('pending')
    })

    it('should set status filter to "paid"', () => {
      const { setStatusFilter } = useInvoiceStore.getState()

      setStatusFilter('paid')

      const { statusFilter } = useInvoiceStore.getState()
      expect(statusFilter).toBe('paid')
    })

    it('should set status filter back to "all"', () => {
      const { setStatusFilter } = useInvoiceStore.getState()

      setStatusFilter('draft')
      setStatusFilter('all')

      const { statusFilter } = useInvoiceStore.getState()
      expect(statusFilter).toBe('all')
    })
  })

  describe('seedInvoices', () => {
    it('should seed invoices from data', () => {
      const { seedInvoices } = useInvoiceStore.getState()

      const mockInvoices: Invoice[] = [
        {
          ...createMockInvoice({ clientName: 'Alice' }),
          id: 'invoice-1',
          createdAt: '2024-01-01',
        },
        {
          ...createMockInvoice({ clientName: 'Bob' }),
          id: 'invoice-2',
          createdAt: '2024-01-02',
        },
      ]

      seedInvoices(mockInvoices)

      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toHaveLength(2)
      expect(invoices).toEqual(mockInvoices)
    })

    it('should replace existing invoices when seeding', () => {
      const { addInvoice, seedInvoices } = useInvoiceStore.getState()

      addInvoice(createMockInvoice({ clientName: 'Existing' }))

      const newInvoices: Invoice[] = [
        {
          ...createMockInvoice({ clientName: 'New' }),
          id: 'invoice-1',
          createdAt: '2024-01-01',
        },
      ]

      seedInvoices(newInvoices)

      const { invoices } = useInvoiceStore.getState()
      expect(invoices).toHaveLength(1)
      expect(invoices[0].clientName).toBe('New')
    })
  })

  describe('Selectors', () => {
    describe('selectFilteredInvoices', () => {
      beforeEach(() => {
        const { seedInvoices } = useInvoiceStore.getState()

        const mockInvoices: Invoice[] = [
          {
            ...createMockInvoice({
              clientName: 'Draft Invoice',
              status: 'draft',
            }),
            id: 'invoice-1',
            createdAt: '2024-01-01',
          },
          {
            ...createMockInvoice({
              clientName: 'Pending Invoice 1',
              status: 'pending',
            }),
            id: 'invoice-2',
            createdAt: '2024-01-02',
          },
          {
            ...createMockInvoice({
              clientName: 'Pending Invoice 2',
              status: 'pending',
            }),
            id: 'invoice-3',
            createdAt: '2024-01-03',
          },
          {
            ...createMockInvoice({
              clientName: 'Paid Invoice',
              status: 'paid',
            }),
            id: 'invoice-4',
            createdAt: '2024-01-04',
          },
        ]

        seedInvoices(mockInvoices)
      })

      it('should return all invoices when filter is "all"', () => {
        const state = useInvoiceStore.getState()
        const filtered = selectFilteredInvoices(state)

        expect(filtered).toHaveLength(4)
      })

      it('should return only draft invoices when filter is "draft"', () => {
        const { setStatusFilter } = useInvoiceStore.getState()
        setStatusFilter('draft')

        const state = useInvoiceStore.getState()
        const filtered = selectFilteredInvoices(state)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].status).toBe('draft')
      })

      it('should return only pending invoices when filter is "pending"', () => {
        const { setStatusFilter } = useInvoiceStore.getState()
        setStatusFilter('pending')

        const state = useInvoiceStore.getState()
        const filtered = selectFilteredInvoices(state)

        expect(filtered).toHaveLength(2)
        expect(filtered.every((inv) => inv.status === 'pending')).toBe(true)
      })

      it('should return only paid invoices when filter is "paid"', () => {
        const { setStatusFilter } = useInvoiceStore.getState()
        setStatusFilter('paid')

        const state = useInvoiceStore.getState()
        const filtered = selectFilteredInvoices(state)

        expect(filtered).toHaveLength(1)
        expect(filtered[0].status).toBe('paid')
      })

      it('should return empty array when no invoices match filter', () => {
        useInvoiceStore.setState({ invoices: [], statusFilter: 'draft' })

        const state = useInvoiceStore.getState()
        const filtered = selectFilteredInvoices(state)

        expect(filtered).toEqual([])
      })
    })

    describe('selectInvoiceById', () => {
      it('should return invoice with matching id', () => {
        const { seedInvoices } = useInvoiceStore.getState()

        const mockInvoices: Invoice[] = [
          {
            ...createMockInvoice({ clientName: 'Alice' }),
            id: 'invoice-1',
            createdAt: '2024-01-01',
          },
          {
            ...createMockInvoice({ clientName: 'Bob' }),
            id: 'invoice-2',
            createdAt: '2024-01-02',
          },
        ]

        seedInvoices(mockInvoices)

        const state = useInvoiceStore.getState()
        const invoice = selectInvoiceById('invoice-2')(state)

        expect(invoice?.clientName).toBe('Bob')
      })

      it('should return undefined when invoice not found', () => {
        const state = useInvoiceStore.getState()
        const invoice = selectInvoiceById('non-existent-id')(state)

        expect(invoice).toBeUndefined()
      })
    })
  })
})
