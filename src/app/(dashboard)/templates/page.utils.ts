import type { TemplateListItem } from '@/stores/templateStore'

export function displayName(template: TemplateListItem): string {
  return template.templateName || template.proposalTitle
}
