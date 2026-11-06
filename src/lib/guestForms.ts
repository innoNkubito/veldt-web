/**
 * Guest forms — shared types and field-type metadata for the form library,
 * the builder and (from phase 4) the guest-facing form page.
 *
 * Mirrors veldt-api src/lib/guestForms/fields.ts. The API is the authority on
 * validation; the limits here only let the builder warn before a save.
 */

export type GuestFormFieldType =
  | 'SECTION'
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'EMAIL'
  | 'PHONE'
  | 'NUMBER'
  | 'DATE'
  | 'SINGLE_CHOICE'
  | 'MULTI_CHOICE'
  | 'YES_NO'

export interface GuestFormField {
  id: string
  type: GuestFormFieldType
  label: string
  helpText: string | null
  required: boolean
  options: string[]
}

export interface GuestForm {
  id: string
  name: string
  description: string | null
  perGuest: boolean
  fields: GuestFormField[]
  questionCount: number
  archivedAt: string | null
  usageCount: number
  updatedAt: string
}

export interface GuestFormStarter {
  key: string
  name: string
  description: string | null
  perGuest: boolean
  fields: GuestFormField[]
}

export interface GuestFormFieldInput {
  /** Omitted for a field added in this edit; the API assigns one. */
  id?: string
  type: GuestFormFieldType
  label: string
  helpText: string | null
  required: boolean
  options: string[]
}

export interface GuestFormInput {
  name: string
  description: string | null
  perGuest: boolean
  fields: GuestFormFieldInput[]
}

/** A guest's answer: text for most types, a list for MULTI_CHOICE. */
export type GuestFormValue = string | string[]
export type GuestFormValues = Record<string, GuestFormValue>

export const GUEST_FORM_LIMITS = {
  nameMax: 120,
  descriptionMax: 2000,
  fieldsMax: 40,
  labelMax: 200,
  helpTextMax: 500,
  optionsMin: 2,
  optionsMax: 20,
  optionMax: 120,
} as const

interface FieldTypeConfig {
  label: string
  /** One line for the "add a question" menu. */
  hint: string
  hasOptions: boolean
  /** false for SECTION: a heading, not a question. */
  isInput: boolean
}

export const FIELD_TYPE_CONFIG: Record<GuestFormFieldType, FieldTypeConfig> = {
  SHORT_TEXT: { label: 'Short answer', hint: 'A name, a number, one line', hasOptions: false, isInput: true },
  LONG_TEXT: { label: 'Paragraph', hint: 'Allergies, notes, anything longer', hasOptions: false, isInput: true },
  SINGLE_CHOICE: { label: 'Single choice', hint: 'Pick one option', hasOptions: true, isInput: true },
  MULTI_CHOICE: { label: 'Checkboxes', hint: 'Pick any number of options', hasOptions: true, isInput: true },
  YES_NO: { label: 'Yes / No', hint: 'A simple yes or no', hasOptions: false, isInput: true },
  DATE: { label: 'Date', hint: 'Date of birth, passport expiry', hasOptions: false, isInput: true },
  EMAIL: { label: 'Email', hint: 'An email address', hasOptions: false, isInput: true },
  PHONE: { label: 'Phone', hint: 'A phone number', hasOptions: false, isInput: true },
  NUMBER: { label: 'Number', hint: 'Shoe size, weight for light aircraft', hasOptions: false, isInput: true },
  SECTION: { label: 'Section heading', hint: 'Groups the questions below it', hasOptions: false, isInput: false },
}

/** Order in the "add a question" menu. */
export const FIELD_TYPE_ORDER: GuestFormFieldType[] = [
  'SHORT_TEXT',
  'LONG_TEXT',
  'SINGLE_CHOICE',
  'MULTI_CHOICE',
  'YES_NO',
  'DATE',
  'EMAIL',
  'PHONE',
  'NUMBER',
  'SECTION',
]

export const perGuestLabel = (perGuest: boolean) => (perGuest ? 'One per guest' : 'One per trip')

/**
 * The two questions every submission asks, ahead of the form's own: who the
 * response is about, and an optional way to reach them. Stored on the
 * response itself (guestName / guestEmail), not as answers.
 */
export const GUEST_NAME_FIELD_ID = '__guest_name'
export const GUEST_EMAIL_FIELD_ID = '__guest_email'

export function guestIdentityFields(perGuest: boolean): GuestFormField[] {
  return [
    {
      id: GUEST_NAME_FIELD_ID,
      type: 'SHORT_TEXT',
      label: perGuest ? 'Guest’s full name' : 'Your name',
      helpText: perGuest ? 'Filling this in for someone else in your group? Enter their name.' : null,
      required: true,
      options: [],
    },
    {
      id: GUEST_EMAIL_FIELD_ID,
      type: 'EMAIL',
      label: 'Email address',
      helpText: 'Optional — in case your travel advisor needs to follow up.',
      required: false,
      options: [],
    },
  ]
}
