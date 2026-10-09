import { formatTimestamp } from '@/lib/dates'
import type { TemplateListItem } from '@/stores/templateStore'

/** "7 nights · used 3 times · updated 2 Oct 2026" */
export function cardMeta(template: TemplateListItem): string {
  const parts: string[] = []
  if (template.durationNights > 0) {
    parts.push(`${template.durationNights} ${template.durationNights === 1 ? 'night' : 'nights'}`)
  }
  const uses = template.templateUsageCount
  parts.push(uses === 0 ? 'not used yet' : `used ${uses} ${uses === 1 ? 'time' : 'times'}`)
  parts.push(`updated ${formatTimestamp(template.updatedAt)}`)
  return parts.join(' · ')
}
