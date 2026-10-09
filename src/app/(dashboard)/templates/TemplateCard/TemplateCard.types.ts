import type { TemplateListItem } from '@/stores/templateStore'

export interface TemplateCardProps {
  template: TemplateListItem
  busy: boolean
  onUse: () => void
  onOpen: () => void
  onEditDetails: () => void
  onDuplicate: () => void
  onToggleArchived: () => void
  onDelete: () => void
}
