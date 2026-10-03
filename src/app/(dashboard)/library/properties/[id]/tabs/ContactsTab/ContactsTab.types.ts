import type { ContactType, PropertyFull } from '@/stores/contentLibraryStore'

export interface ContactsTabProps {
  property: PropertyFull
}

/** The contact form's fields, as typed. */
export interface ContactFormValues {
  contactType: ContactType
  role: string
  name: string
  phone: string
  email: string
}
