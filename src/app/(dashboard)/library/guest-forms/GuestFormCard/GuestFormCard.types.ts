import type { GuestForm } from '@/lib/guestForms'

export interface GuestFormCardProps {
  form: GuestForm
  canEdit: boolean
  busy: boolean
  onOpen: () => void
  onToggleArchived: () => void
  onDelete: () => void
}
