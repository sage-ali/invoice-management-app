'use client'

import React, { useState } from 'react'
import { useInvoiceStore } from '@/features/invoices/store/invoiceStore'
import { Button } from '@/components/Button.component'
import { Select } from '@/components/Select.component'
import TextInput from '@/components/TextInput.component'
import { Invoice, InvoiceItem } from '@/app/invoices/types/store'
import { calculatePaymentDue } from '@/features/invoices/utils/calculatePaymentDue'
import { DatePicker } from '@/components/DatePicker.component'
import { formatDate } from '@/features/invoices/utils/dateHelpers'

interface InvoiceFormProps {
  invoice?: Invoice // If passed, we are in Edit mode
  onClose: () => void
}

type FormState = Omit<Invoice, 'id'> & { id?: string }

export const InvoiceForm = ({ invoice, onClose }: InvoiceFormProps) => {
  const addInvoice = useInvoiceStore((state) => state.addInvoice)
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice)

  // Initialize state strictly typed to FormState
  const [formData, setFormData] = useState<FormState>(
    invoice || {
      createdAt: new Date().toISOString().split('T')[0],
      paymentDue: '',
      description: '',
      paymentTerms: 30,
      clientName: '',
      clientEmail: '',
      status: 'draft',
      senderAddress: {
        street: '',
        city: '',
        postCode: '',
        country: '',
      },
      clientAddress: {
        street: '',
        city: '',
        postCode: '',
        country: '',
      },
      items: [],
      total: 0,
    }
  )

  // Errors map strictly to boolean
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Strictly typed item handler
  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...formData.items]
    const item = { ...newItems[index], [field]: value }

    // Auto-calculate item total
    if (field === 'quantity' || field === 'price') {
      item.total = Number(item.quantity || 0) * Number(item.price || 0)
    }

    newItems[index] = item
    const newTotal = newItems.reduce((sum, it) => sum + it.total, 0)
    setFormData({ ...formData, items: newItems, total: newTotal })
  }

  const addItem = () => {
    const newItems = [
      ...formData.items,
      { name: '', quantity: 1, price: 0, total: 0 },
    ]
    const newTotal = newItems.reduce((sum, it) => sum + it.total, 0)
    setFormData({
      ...formData,
      items: newItems,
      total: newTotal,
    })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const newTotal = newItems.reduce((sum, it) => sum + it.total, 0)
    setFormData({ ...formData, items: newItems, total: newTotal })
  }

  const validate = (strict: boolean): boolean => {
    const newErrors: Record<string, boolean> = {}
    if (strict) {
      if (!formData.clientName.trim()) newErrors.clientName = true
      if (!formData.clientEmail.trim()) newErrors.clientEmail = true
      if (!formData.description.trim()) newErrors.description = true
      if (!formData.senderAddress.street.trim()) newErrors.senderAddress = true
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = (status: 'draft' | 'pending') => {
    const isStrict = status === 'pending'
    if (!validate(isStrict)) return

    // Calculate Payment Due Date safely
    const paymentDue = calculatePaymentDue(
      formData.createdAt,
      formData.paymentTerms
    )

    if (invoice && invoice.id) {
      // EDIT MODE
      updateInvoice(invoice.id, {
        ...formData,
        status,
        paymentDue,
      } as Invoice)
    } else {
      // CREATE MODE
      const newInvoice = {
        ...formData,
        status,
        paymentDue,
      }

      addInvoice(newInvoice as Invoice)
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="dark:bg-dark-bg fixed top-18 left-0 z-50 flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col rounded-r-3xl bg-white transition-transform duration-300 lg:top-0 lg:h-screen lg:pl-25.75">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-14">
          <h2 className="text-heading-m text-dark-text mb-12 font-bold dark:text-white">
            {invoice ? (
              <span>
                Edit <span className="text-neutral-400">#</span>
                {invoice.id}
              </span>
            ) : (
              'New Invoice'
            )}
          </h2>

          <form
            className="flex flex-col gap-12"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Bill From */}
            <div className="flex flex-col gap-6">
              <h4 className="text-heading-s text-primary font-bold">
                Bill From
              </h4>
              <TextInput
                label="Street Address"
                value={formData.senderAddress.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    senderAddress: {
                      ...formData.senderAddress,
                      street: e.target.value,
                    },
                  })
                }
                error={errors.senderAddress ? "can't be empty" : undefined}
              />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <TextInput
                  label="City"
                  value={formData.senderAddress.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      senderAddress: {
                        ...formData.senderAddress,
                        city: e.target.value,
                      },
                    })
                  }
                />
                <TextInput
                  label="Post Code"
                  value={formData.senderAddress.postCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      senderAddress: {
                        ...formData.senderAddress,
                        postCode: e.target.value,
                      },
                    })
                  }
                />
                <TextInput
                  label="Country"
                  className="col-span-2 md:col-span-1"
                  value={formData.senderAddress.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      senderAddress: {
                        ...formData.senderAddress,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Bill To */}
            <div className="flex flex-col gap-6">
              <h4 className="text-heading-s text-primary font-bold">Bill To</h4>
              <TextInput
                label="Client's Name"
                value={formData.clientName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                error={errors.clientName ? "can't be empty" : undefined}
              />
              <TextInput
                label="Client's Email"
                type="email"
                value={formData.clientEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
                error={errors.clientEmail ? "can't be empty" : undefined}
              />
              <TextInput
                label="Street Address"
                value={formData.clientAddress.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    clientAddress: {
                      ...formData.clientAddress,
                      street: e.target.value,
                    },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                <TextInput
                  label="City"
                  value={formData.clientAddress.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      clientAddress: {
                        ...formData.clientAddress,
                        city: e.target.value,
                      },
                    })
                  }
                />
                <TextInput
                  label="Post Code"
                  value={formData.clientAddress.postCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      clientAddress: {
                        ...formData.clientAddress,
                        postCode: e.target.value,
                      },
                    })
                  }
                />
                <TextInput
                  label="Country"
                  className="col-span-2 md:col-span-1"
                  value={formData.clientAddress.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      clientAddress: {
                        ...formData.clientAddress,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <DatePicker
                label="Invoice Date"
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate)
                  const formattedNewDate = formatDate(newDate)
                  setFormData({ ...formData, createdAt: formattedNewDate })
                }}
              />
              <Select
                label="Payment Terms"
                value={formData.paymentTerms}
                onChange={(val) =>
                  setFormData({ ...formData, paymentTerms: Number(val) })
                }
                options={[
                  { label: 'Net 1 Day', value: 1 },
                  { label: 'Net 7 Days', value: 7 },
                  { label: 'Net 14 Days', value: 14 },
                  { label: 'Net 30 Days', value: 30 },
                ]}
              />
            </div>
            <TextInput
              label="Project Description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={errors.description ? "can't be empty" : undefined}
            />

            {/* Item List */}
            <div className="flex flex-col gap-6">
              <h3 className="text-heading-m font-bold text-[#777F98]">
                Item List
              </h3>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_4fr] items-center gap-4 md:grid-cols-[4fr_1fr_2fr_2fr_min-content]"
                >
                  <TextInput
                    label="Item Name"
                    className="col-span-2 md:col-span-1"
                    value={item.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleItemChange(index, 'name', e.target.value)
                    }
                  />
                  <TextInput
                    label="Qty."
                    type="number"
                    value={item.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                  />
                  <TextInput
                    label="Price"
                    type="number"
                    value={item.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleItemChange(index, 'price', e.target.value)
                    }
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-body text-neutral-400">Total</label>
                    <div className="text-heading-s flex h-12 items-center font-bold text-neutral-400">
                      {item.total.toFixed(2)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="hover:text-danger mt-8 text-[#888EB0] transition-colors"
                  >
                    <svg
                      width="13"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.778 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.427 1.111v1.667h4.934v1.666H1.14V2.778h4.934V1.111C6.074.498 6.572 0 7.185 0h1.14c.614 0 1.112.498 1.112 1.111z"
                        fill="currentColor"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <Button
                variant="secondary"
                className="dark:bg-dark-hover mt-4 w-full bg-[#F9FAFE] dark:text-neutral-200"
                onClick={addItem}
              >
                + Add New Item
              </Button>
            </div>
          </form>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="dark:bg-dark-surface shadow-top-light flex items-center justify-between rounded-br-3xl bg-white px-6 py-8 md:px-14">
          <Button variant="secondary" onClick={onClose}>
            {invoice ? 'Cancel' : 'Discard'}
          </Button>
          <div className="flex gap-2">
            {!invoice && (
              <Button
                variant="secondary"
                className="bg-[#373B53] text-[#DFE3FA] hover:bg-[#0C0E16]"
                onClick={() => handleSave('draft')}
              >
                Save as Draft
              </Button>
            )}
            <Button variant="primary" onClick={() => handleSave('pending')}>
              {invoice ? 'Save Changes' : 'Save & Send'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
