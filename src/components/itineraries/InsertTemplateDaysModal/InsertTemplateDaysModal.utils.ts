import type { ItineraryRow } from '@/stores/builderStore'
import type { TemplateListItem } from '@/stores/templateStore'
import { AT_END, COPY } from './InsertTemplateDaysModal.constants'

/** "Days 1–3 (3 nights)" or "Day 2" when the row has no label. */
export function rowLabel(row: ItineraryRow, index: number): string {
  const label = row.dateLabel?.trim() || `Day ${index + 1}`
  return row.numNights ? `${label} (${row.numNights} ${row.numNights === 1 ? 'night' : 'nights'})` : label
}

/** Insertion points: start, after each day, end — as select options. */
export function positionOptions(rows: ItineraryRow[]): { value: string; label: string }[] {
  if (rows.length === 0) return [{ value: AT_END, label: COPY.atEnd }]
  return [
    { value: '0', label: COPY.atStart },
    ...rows.slice(0, -1).map((row, i) => ({
      value: String(i + 1),
      label: `${COPY.after} ${rowLabel(row, i)}`,
    })),
    { value: AT_END, label: COPY.atEnd },
  ]
}

/** The select value as the API's position — null means at the end. */
export function toPosition(value: string): number | null {
  return value === AT_END ? null : Number.parseInt(value, 10)
}

/** "Gorillas & Akagera · 4 nights" */
export function templateOptionLabel(template: TemplateListItem): string {
  const name = template.templateName || template.proposalTitle
  return template.durationNights > 0 ? `${name} · ${template.durationNights} nights` : name
}
