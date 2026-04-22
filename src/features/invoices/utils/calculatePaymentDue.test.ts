import { describe, it, expect } from 'vitest'
import { calculatePaymentDue } from './calculatePaymentDue'

describe('calculatePaymentDue', () => {
  it('should add payment terms to the created date', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-31')
  })

  it('should handle payment terms of 1 day', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 1

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-02')
  })

  it('should handle payment terms of 7 days', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 7

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-08')
  })

  it('should handle payment terms of 14 days', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 14

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-15')
  })

  it('should handle month transitions correctly', () => {
    const createdAt = '2024-01-20'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-02-19')
  })

  it('should handle year transitions correctly', () => {
    const createdAt = '2024-12-15'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2025-01-14')
  })

  it('should handle leap year correctly', () => {
    // 2024 is a leap year, Feb has 29 days
    const createdAt = '2024-02-01'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-03-02')
  })

  it('should handle non-leap year correctly', () => {
    // 2023 is not a leap year, Feb has 28 days
    const createdAt = '2023-02-01'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2023-03-03')
  })

  it('should handle zero payment terms', () => {
    const createdAt = '2024-01-15'
    const paymentTerms = 0

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-15')
  })

  it('should return date in YYYY-MM-DD format', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    // Check format: YYYY-MM-DD
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should handle dates at the end of the month', () => {
    const createdAt = '2024-01-31'
    const paymentTerms = 1

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-02-01')
  })

  it('should handle dates with time components in ISO string', () => {
    const createdAt = '2024-01-01T12:30:45.000Z'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-01-31')
  })

  it('should handle large payment terms', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 365

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(result).toBe('2024-12-31') // 2024 is a leap year
  })

  it('should return a string type', () => {
    const createdAt = '2024-01-01'
    const paymentTerms = 30

    const result = calculatePaymentDue(createdAt, paymentTerms)

    expect(typeof result).toBe('string')
  })
})
