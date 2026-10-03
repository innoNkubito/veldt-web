import type { ContactInput, PropertyContact } from '@/stores/contentLibraryStore'
import type { ContactFormValues } from './ContactsTab.types'

export function toFormValues(contact: PropertyContact): ContactFormValues {
  return {
    contactType: contact.contactType,
    role: contact.role ?? '',
    name: contact.name ?? '',
    phone: contact.phone ?? '',
    email: contact.email ?? '',
  }
}

export function toInput(form: ContactFormValues): ContactInput {
  return {
    contactType: form.contactType,
    role: form.role.trim() || null,
    name: form.name.trim() || null,
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
  }
}

/** "Jane Doe · Camp Manager" — or whatever of the two exists. */
export function contactTitle(contact: PropertyContact): string {
  return [contact.name, contact.role].filter(Boolean).join(' · ') || contact.phone || contact.email || ''
}

export function contactsOfType(contacts: PropertyContact[], type: PropertyContact['contactType']) {
  return [...contacts].filter((c) => c.contactType === type).sort((a, b) => a.position - b.position)
}
