import type { GuestFormFieldType } from '@/lib/guestForms'

export interface AddFieldMenuProps {
  disabled: boolean
  onAdd: (type: GuestFormFieldType) => void
}
