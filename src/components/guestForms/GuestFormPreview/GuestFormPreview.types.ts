import type { GuestFormField } from '@/lib/guestForms'

export interface GuestFormPreviewProps {
  name: string
  description: string | null
  perGuest: boolean
  fields: GuestFormField[]
}
