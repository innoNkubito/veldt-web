import type { OperatorContactForm } from './OperatorContactCard.types'

export const EMPTY_FORM: OperatorContactForm = { phone: '', whatsapp: '', email: '' }

export const FIELDS: readonly {
  key: keyof OperatorContactForm
  label: string
  type: 'tel' | 'email'
  placeholder: string
}[] = [
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+254 20 123 4567' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '+254 712 345 678' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'trips@yourcompany.com' },
]

export const COPY = {
  label: 'Contact details for travellers',
  hint: 'Shown on every travel dashboard once a trip is under way, alongside the trip’s advisor.',
  save: 'Save',
  saving: 'Saving…',
  saved: 'Saved.',
  notSet: 'Not set',
} as const
