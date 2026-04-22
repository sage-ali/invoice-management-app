import { describe, it, expect } from 'vitest'
import { generateInvoiceId } from './generateId'

describe('generateInvoiceId', () => {
  it('should generate an ID with correct format (2 letters + 4 numbers)', () => {
    const id = generateInvoiceId()
    // Format: 2 uppercase letters followed by 4 digits
    const regex = /^[A-Z]{2}\d{4}$/
    expect(id).toMatch(regex)
  })

  it('should generate an ID with length of 6 characters', () => {
    const id = generateInvoiceId()
    expect(id).toHaveLength(6)
  })

  it('should generate unique IDs', () => {
    const ids = new Set<string>()
    const iterations = 100

    for (let i = 0; i < iterations; i++) {
      ids.add(generateInvoiceId())
    }

    // Should have high uniqueness (at least 95% unique in 100 iterations)
    expect(ids.size).toBeGreaterThan(95)
  })

  it('should only contain uppercase letters in the first 2 characters', () => {
    const id = generateInvoiceId()
    const letters = id.slice(0, 2)

    expect(letters).toMatch(/^[A-Z]{2}$/)
  })

  it('should only contain digits in the last 4 characters', () => {
    const id = generateInvoiceId()
    const numbers = id.slice(2)

    expect(numbers).toMatch(/^\d{4}$/)
    expect(parseInt(numbers)).toBeGreaterThanOrEqual(1000)
    expect(parseInt(numbers)).toBeLessThanOrEqual(9999)
  })

  it('should generate multiple different IDs on consecutive calls', () => {
    const id1 = generateInvoiceId()
    const id2 = generateInvoiceId()
    const id3 = generateInvoiceId()

    // While it's theoretically possible they could be the same,
    // it's extremely unlikely for all three to match
    const allSame = id1 === id2 && id2 === id3
    expect(allSame).toBe(false)
  })

  it('should return a string type', () => {
    const id = generateInvoiceId()
    expect(typeof id).toBe('string')
  })
})
