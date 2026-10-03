export interface OperatorContactCardProps {
  /** Owners edit; everyone else sees the details read-only. */
  canEdit: boolean
}

export interface OperatorContactForm {
  phone: string
  whatsapp: string
  email: string
}
