import type { ContactType } from '@/stores/contentLibraryStore'
import type { ContactFormValues } from './ContactsTab.types'

export const CONTACT_TYPES: readonly { value: ContactType; label: string; hint: string }[] = [
  {
    value: 'EMERGENCY',
    label: 'Emergency',
    hint: 'Shown to travellers on their travel dashboard on the nights they stay here.',
  },
  {
    value: 'OFFICE',
    label: 'Office',
    hint: 'For your team only — reservations, accounts and the like.',
  },
]

export const EMPTY_FORM: ContactFormValues = {
  contactType: 'EMERGENCY',
  role: '',
  name: '',
  phone: '',
  email: '',
}

export const COPY = {
  formTitleAdd: 'Add a contact',
  formTitleEdit: 'Edit contact',
  type: 'Type',
  role: 'Role',
  rolePlaceholder: 'e.g. Camp Manager',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  add: 'Add Contact',
  save: 'Save Contact',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  empty: 'No contacts yet.',
  needsReach: 'Add a phone number or an email address.',
  deleteTitle: 'Delete this contact?',
  deleteMessage: 'It is removed from this property and from any travel dashboard showing it.',
} as const
