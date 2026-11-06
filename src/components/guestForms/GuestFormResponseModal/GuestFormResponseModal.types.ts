import type { GuestFormResponse } from '@/lib/guestForms'

export interface GuestFormResponseModalProps {
  response: GuestFormResponse
  /** Owners and advisors may edit answers and mark reviewed; viewers only read and copy. */
  canEdit: boolean
  onClose: () => void
}

export type ModalMode = 'view' | 'edit'
