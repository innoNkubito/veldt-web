import type { GuestFormField, GuestFormValue, GuestFormValues } from '@/lib/guestForms'

export interface GuestFormFieldsProps {
  fields: GuestFormField[]
  values: GuestFormValues
  onChange: (fieldId: string, value: GuestFormValue) => void
  /** Per-field messages, shown under the field. */
  errors?: Record<string, string>
  disabled?: boolean
  /** Prefixes element ids, so two renderers on one page don't collide. */
  idPrefix?: string
}

export interface FieldProps {
  field: GuestFormField
  value: GuestFormValue | undefined
  onChange: (value: GuestFormValue) => void
  disabled: boolean
  inputId: string
  describedBy: string | undefined
}
