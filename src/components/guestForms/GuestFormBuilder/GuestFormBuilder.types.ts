import type { GuestFormFieldType } from '@/lib/guestForms'

export interface GuestFormBuilderProps {
  /** null for a new form */
  formId: string | null
  /** New forms only: the starter to pre-fill from; null = blank */
  starterKey: string | null
}

/** A field while it is being edited. `key` is local; `id` is the saved field's id. */
export interface DraftField {
  key: string
  id: string | null
  type: GuestFormFieldType
  label: string
  helpText: string
  required: boolean
  /** One option per line — what the textarea holds. */
  optionsText: string
}

export interface Draft {
  name: string
  description: string
  perGuest: boolean
  fields: DraftField[]
}

/** Problems to fix before saving, keyed by field key ('name' for the form name). */
export type DraftIssues = Record<string, string>

export type MoveDirection = -1 | 1
