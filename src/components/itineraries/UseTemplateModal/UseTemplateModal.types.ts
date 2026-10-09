export interface TemplateChoice {
  id: string
  templateName: string | null
  proposalTitle: string
  durationNights: number
}

export interface UseTemplateModalProps {
  /** The template to use; when absent, the modal offers a picker. */
  template?: TemplateChoice | null
  onClose: () => void
}
