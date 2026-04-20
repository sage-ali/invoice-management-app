import { Invoice } from '@/app/invoices/page'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InvoiceStore {
  // State
  invoices: Invoice[]
  statusFilter: 'all' | 'draft' | 'pending' | 'paid'

  // Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  setStatusFilter: (filter: InvoiceStore['statusFilter']) => void

  // Initialization
  seedInvoices: (invoices: Invoice[]) => void
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      invoices: [],
      statusFilter: 'all',

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              ...invoice,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

      markAsPaid: (id) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: 'paid' } : inv
          ),
        })),

      setStatusFilter: (filter) => set({ statusFilter: filter }),

      seedInvoices: (invoices) => set({ invoices }),
    }),
    {
      name: 'invoice-storage',
    }
  )
)

// Selectors (use these in components)
export const selectFilteredInvoices = (state: InvoiceStore) => {
  if (state.statusFilter === 'all') return state.invoices
  return state.invoices.filter((inv) => inv.status === state.statusFilter)
}

export const selectInvoiceById = (id: string) => (state: InvoiceStore) =>
  state.invoices.find((inv) => inv.id === id)
