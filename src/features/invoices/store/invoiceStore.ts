import { Invoice } from '@/app/invoices/page'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import initialInvoiceData from '@/data/data.json'

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

      seedInvoices: (newInvoices: Invoice[]) => set({ invoices: newInvoices }),
    }),
    {
      name: 'invoice-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // If there are no invoices in the rehydrated state, or if the rehydrated state itself is null/undefined,
        // then we seed it with the data from data.json.
        if (!state?.invoices || state.invoices.length === 0) {
          console.log('No persisted invoices found, seeding from initial data.')

          state?.seedInvoices(initialInvoiceData as Invoice[])
        } else {
          console.log('Persisted invoices found, using them.')
        }
      },
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
