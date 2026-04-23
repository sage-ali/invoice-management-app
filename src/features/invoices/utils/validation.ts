import { InvoiceCreatePayload } from '@/features/invoices/types/store'

// 1. Define all possible value types that can come from the form
export type FormFieldValue =
  | string
  | number
  | null
  | undefined
  | Record<string, string> // Accounts for Address objects
  | Array<Record<string, string | number>> // Accounts for the items array

// 2. Apply the strict type to the rules
interface ValidationRule {
  validator: (value: FormFieldValue) => boolean
  message: string
}

type ValidationSchema = Record<string, ValidationRule[]>

export const validators = {
  required: (value: FormFieldValue): boolean => {
    if (typeof value === 'string') return value.trim() !== ''
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined
  },

  email: (value: FormFieldValue): boolean => {
    if (typeof value !== 'string') return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },

  positive: (value: FormFieldValue): boolean => {
    if (typeof value !== 'number') return false
    return value > 0
  },
}

// 4. Define the schema
const invoiceValidationSchema: ValidationSchema = {
  // Client Info
  clientName: [{ validator: validators.required, message: "can't be empty" }],
  clientEmail: [
    { validator: validators.required, message: "can't be empty" },
    { validator: validators.email, message: 'invalid email' },
  ],

  // Invoice Details
  createdAt: [{ validator: validators.required, message: "can't be empty" }],
  description: [{ validator: validators.required, message: "can't be empty" }],

  // Sender Address
  'senderAddress.street': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'senderAddress.city': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'senderAddress.postCode': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'senderAddress.country': [
    { validator: validators.required, message: "can't be empty" },
  ],

  // Client Address
  'clientAddress.street': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'clientAddress.city': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'clientAddress.postCode': [
    { validator: validators.required, message: "can't be empty" },
  ],
  'clientAddress.country': [
    { validator: validators.required, message: "can't be empty" },
  ],

  items: [{ validator: validators.required, message: 'An item must be added' }],
}

// Helper to read nested object properties via string paths (e.g., "senderAddress.city")
export const getDeepValue = (obj: unknown, path: string): FormFieldValue => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    // Type Guard: Ensure 'acc' is actually an object and not null before indexing
    if (acc && typeof acc === 'object' && part in acc) {
      // Now it's safe to cast just this specific interaction
      return (acc as Record<string, unknown>)[part]
    }

    // If the path breaks (e.g., trying to read a property of undefined), safely return
    return undefined
  }, obj) as FormFieldValue
}

export type ErrorData = Record<
  string,
  string | Record<string, string> | Record<string, string>[] | undefined
>

export function validateInvoice(
  formData: InvoiceCreatePayload,
  strict: boolean = false
) {
  const errors: ErrorData = {}

  if (!strict) return errors

  // 1. Process Schema (Top-level, Nested Objects, and the `items` array length)
  Object.entries(invoiceValidationSchema).forEach(([path, rules]) => {
    const value = getDeepValue(formData, path)

    for (const rule of rules) {
      if (!rule.validator(value)) {
        if (path.includes('.')) {
          const [parent, child] = path.split('.')
          if (!errors[parent]) {
            errors[parent] = {}
          }
          const parentNode = errors[parent] as Record<string, string>
          parentNode[child] = rule.message
        } else {
          // This will automatically map 'items' -> 'An item must be added'
          errors[path] = rule.message
        }
        break
      }
    }
  })

  // 2. Validate the specific rows inside the dynamic Array
  // Only run this if the items array actually exists and has items
  if (Array.isArray(formData.items) && formData.items.length > 0) {
    const itemErrors: Record<string, string>[] = []
    let hasItemErrors = false

    formData.items.forEach((item, index) => {
      const itemErr: Record<string, string> = {}

      // We use the exact same validators from our centralized list!
      if (!validators.required(item.name)) itemErr.name = "can't be empty"
      if (!validators.positive(item.quantity)) itemErr.quantity = 'must be > 0'
      if (!validators.positive(item.price)) itemErr.price = 'must be > 0'

      if (Object.keys(itemErr).length > 0) hasItemErrors = true
      itemErrors[index] = itemErr
    })

    if (hasItemErrors) {
      errors.itemsList = itemErrors
    }
  }

  return errors
}
