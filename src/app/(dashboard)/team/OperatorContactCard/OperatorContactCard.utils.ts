import type { OperatorContact, OperatorContactInput } from '@/stores/teamStore'
import type { OperatorContactForm } from './OperatorContactCard.types'
import { EMPTY_FORM } from './OperatorContactCard.constants'

export function toForm(contact: OperatorContact | null): OperatorContactForm {
  if (!contact) return EMPTY_FORM
  return { phone: contact.phone ?? '', whatsapp: contact.whatsapp ?? '', email: contact.email ?? '' }
}

export function toInput(form: OperatorContactForm): OperatorContactInput {
  return {
    phone: form.phone.trim() || null,
    whatsapp: form.whatsapp.trim() || null,
    email: form.email.trim() || null,
  }
}
