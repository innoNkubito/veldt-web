export const SECTION_ID = 'invoicing'

export const COPY = {
  intro:
    'Printed on every invoice you send to clients. Each sent invoice keeps a copy of these details, so changing them later never alters an invoice already issued.',
  readOnly: 'Only the workspace owner can change these.',
  loading: 'Loading…',
  legalName: 'Legal name',
  legalNameHint: (fallback: string) => `Leave blank to use “${fallback}”.`,
  taxId: 'Tax / VAT number',
  taxIdPlaceholder: 'e.g. P051234567X',
  address: 'Address & contact',
  addressPlaceholder: 'Street, city, country\nPhone, email, registration number',
  bank: 'Bank details',
  bankHint: 'Shown on invoices that can’t be paid online — bank, account name and number, SWIFT.',
  prefix: 'Invoice number prefix',
  prefixHint: 'Letters and digits, e.g. INV or your initials.',
  nextNumber: 'Next invoice: ',
  notes: 'Default notes',
  notesPlaceholder: 'Thank you for travelling with us…',
  terms: 'Default payment terms',
  termsPlaceholder: 'Deposits are non-refundable. Balance due 60 days before travel…',
  defaultsHint: 'Pre-filled on each new invoice; you can change them per invoice.',
  none: 'Not set',
  unsaved: 'Unsaved changes',
  save: 'Save invoice settings',
  saving: 'Saving…',
  saved: 'Saved.',
} as const

export const MAX_PREFIX = 10
