import type { TemplateDetailsInput } from '@/stores/templateStore'

export interface TemplateDetailsModalProps {
  /** 'save' when turning an itinerary into a template; 'edit' for an existing one. */
  mode: 'save' | 'edit'
  initial: TemplateDetailsInput
  onClose: () => void
  /** Returns an error message, or null when saved. */
  onSubmit: (input: TemplateDetailsInput) => Promise<string | null>
}
