'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/Button.component'
import TextInput from '@/components/TextInput.component'
import { Modal } from '@/components/Modal.component'
import { Badge } from '@/components/Badge.component'
import { Select } from '@/components/Select.component'
import { DatePicker } from '@/components/DatePicker.component'

export default function Home() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const PAYMENT_OPTIONS = [
    { label: 'Net 1 Day', value: 1 },
    { label: 'Net 7 Days', value: 7 },
    { label: 'Net 14 Days', value: 14 },
    { label: 'Net 30 Days', value: 30 },
  ]

  const [terms, setTerms] = useState(30)
  const myInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      {/* Testing the dark-surface color, the white background,
        and the custom dropdown shadow
      */}
      <main className="shadow-dropdown dark:bg-dark-surface flex w-full max-w-3xl flex-col items-center gap-8 rounded-lg bg-white p-12 sm:items-start">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          {/* Testing Custom Typography (Heading L) */}
          <h1 className="text-heading-l text-dark-text font-bold dark:text-white">
            Design System Test
          </h1>
          <Badge status="pending" />

          {/* Testing Custom Typography (Body) and Neutral Colors */}
          <p className="text-body text-neutral-400 dark:text-neutral-200">
            If you can read this in League Spartan, and the colors match the
            design system, your Tailwind config is working perfectly!
          </p>
        </div>
        <div>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            Delete
          </Button>

          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Confirm Deletion"
          >
            <p className="mb-8">
              Are you sure you want to delete invoice #XM9141? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => console.log('Delete logic here')}
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>
        {/* Testing Primary and Danger colors and their hover states */}
        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          <TextInput
            label="Name"
            type="text"
            className="input-1"
            ref={myInputRef}
          />
          <TextInput label="Email" error="required" type="email" />
          <Select
            label="Payment Terms"
            options={PAYMENT_OPTIONS}
            value={terms}
            onChange={(val) => setTerms(Number(val))}
          />
          <DatePicker
            label="Due Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
          />
          <Button variant="primary">Primary Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
      </main>
    </div>
  )
}
