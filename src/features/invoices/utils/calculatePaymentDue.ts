export function calculatePaymentDue(
  createdAt: string,
  paymentTerms: number
): string {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + paymentTerms)
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}
