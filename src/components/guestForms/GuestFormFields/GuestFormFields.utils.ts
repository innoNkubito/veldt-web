import type { GuestFormValue } from '@/lib/guestForms'

export const asText = (value: GuestFormValue | undefined): string =>
  typeof value === 'string' ? value : ''

export const asList = (value: GuestFormValue | undefined): string[] =>
  Array.isArray(value) ? value : []

/** Adds or removes one option from a checkbox answer, keeping option order. */
export function toggleOption(current: string[], option: string, options: string[]): string[] {
  const next = new Set(current)
  if (next.has(option)) next.delete(option)
  else next.add(option)
  return options.filter((o) => next.has(o))
}
