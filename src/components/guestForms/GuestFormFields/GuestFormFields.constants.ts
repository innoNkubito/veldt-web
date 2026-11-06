import type { GuestFormFieldType } from '@/lib/guestForms'

/** The native input each single-line type renders as. */
export const INPUT_TYPE: Partial<Record<GuestFormFieldType, string>> = {
  SHORT_TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'tel',
  DATE: 'date',
  // Plain text with a numeric keyboard: type="number" mangles "42.5" vs "42,5"
  // and drops anything it can't parse, which a guest never sees happen.
  NUMBER: 'text',
}

export const AUTOCOMPLETE: Partial<Record<GuestFormFieldType, string>> = {
  EMAIL: 'email',
  PHONE: 'tel',
}

export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const

export const REQUIRED_MARK = '*'
