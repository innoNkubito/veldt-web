import {
  FIELD_TYPE_CONFIG,
  GUEST_EMAIL_FIELD_ID,
  GUEST_NAME_FIELD_ID,
  type GuestFormField,
  type GuestFormValue,
  type GuestFormValues,
} from '@/lib/guestForms'
import { MAX_LENGTH, MESSAGES } from './page.constants'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NUMBER = /^-?\d+(?:[.,]\d+)?$/
const PHONE = /^\+?[\d\s().-]+$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

const asList = (value: GuestFormValue | undefined): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).map((v) => v.trim()).filter(Boolean)

/** The first problem with one answer, or null. The API checks the same rules. */
function problem(field: GuestFormField, value: GuestFormValue | undefined): string | null {
  const values = asList(value)
  if (values.length === 0) return field.required ? MESSAGES.required : null
  const text = values[0]
  switch (field.type) {
    case 'SHORT_TEXT':
      return text.length > MAX_LENGTH.SHORT_TEXT ? MESSAGES.tooLong(MAX_LENGTH.SHORT_TEXT) : null
    case 'LONG_TEXT':
      return text.length > MAX_LENGTH.LONG_TEXT ? MESSAGES.tooLong(MAX_LENGTH.LONG_TEXT) : null
    case 'EMAIL':
      return EMAIL.test(text) ? null : MESSAGES.email
    case 'PHONE':
      return PHONE.test(text) && text.replace(/\D/g, '').length >= 5 ? null : MESSAGES.phone
    case 'NUMBER':
      return NUMBER.test(text) ? null : MESSAGES.number
    case 'DATE':
      return DATE.test(text) ? null : MESSAGES.date
    default:
      return null
  }
}

/** Problems keyed by field id, across the identity questions and the form's own. */
export function validate(fields: GuestFormField[], values: GuestFormValues): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    if (!FIELD_TYPE_CONFIG[field.type].isInput) continue
    const message = problem(field, values[field.id])
    if (message) errors[field.id] = message
  }
  const name = asList(values[GUEST_NAME_FIELD_ID])[0] ?? ''
  if (name.length > MAX_LENGTH.guestName) errors[GUEST_NAME_FIELD_ID] = MESSAGES.tooLong(MAX_LENGTH.guestName)
  return errors
}

/** The mutation's variables, built from the answers. */
export function toSubmission(fields: GuestFormField[], values: GuestFormValues) {
  return {
    guestName: asList(values[GUEST_NAME_FIELD_ID])[0] ?? '',
    guestEmail: asList(values[GUEST_EMAIL_FIELD_ID])[0] ?? null,
    answers: fields
      .filter((f) => FIELD_TYPE_CONFIG[f.type].isInput)
      .map((f) => ({ fieldId: f.id, values: asList(values[f.id]) })),
  }
}
