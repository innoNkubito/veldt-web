import type { LucideIcon } from 'lucide-react'
import type { PMNode } from '@/lib/prosemirror'
import type { FastFactsSection } from '@/lib/pageContent'
import {
  OVERVIEW_TITLES,
  DEFAULT_OVERVIEW_TITLE,
  SECTION_TITLES,
  FACT_ICON_RULES,
  DEFAULT_FACT_ICON,
  ROOM_GRID_PHOTO_COUNT,
  LOCALE,
  DAY_LABEL_FORMAT,
} from './ProposalBlocks.constants'
import type { DayLabelRow, RoomPhotoLayout } from './ProposalBlocks.types'

/** Section heading. Overview headings depend on the content page's type. */
export function sectionTitle(type: string, contentType?: string): string {
  if (type === 'overview') {
    return (contentType && OVERVIEW_TITLES[contentType]) || DEFAULT_OVERVIEW_TITLE
  }
  return SECTION_TITLES[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

/** The icon for a fast-fact group, chosen from keywords in its label. */
export function factIconFor(label: string): LucideIcon {
  const l = label.toLowerCase()
  return FACT_ICON_RULES.find((rule) => rule.keywords.some((k) => l.includes(k)))?.icon
    ?? DEFAULT_FACT_ICON
}

/** Editor output is HTML; older content is plain text. */
export function isHtml(text: string): boolean {
  return text.trimStart().startsWith('<')
}

/** Plain-text content as non-empty lines, one paragraph each. */
export function textLines(text: string): string[] {
  return text.split('\n').filter(Boolean)
}

/** Fast-fact groups that have at least one non-empty item. */
export function visibleFactGroups(section: FastFactsSection): FastFactsSection['groups'] {
  return section.groups.filter((g) => g.items.some(Boolean))
}

export function roomPhotoLayout(photos: string[] | null | undefined): RoomPhotoLayout {
  const all = photos ?? []
  const useSlider = all.length !== ROOM_GRID_PHOTO_COUNT
  return { useSlider, photos: useSlider ? all : all.slice(0, ROOM_GRID_PHOTO_COUNT) }
}

/** Slider index arithmetic — both directions wrap around. */
export function nextIndex(index: number, count: number): number {
  return index === count - 1 ? 0 : index + 1
}
export function previousIndex(index: number, count: number): number {
  return index === 0 ? count - 1 : index - 1
}

/** Whether a day's rich text has anything to show beyond empty paragraphs. */
export function hasDayContent(node: PMNode | null): node is PMNode & { content: PMNode[] } {
  if (!node?.content?.length) return false
  return node.content.some(
    (n) =>
      n.type !== 'paragraph' ||
      n.content?.some((c) => (c.type === 'text' && (c.text ?? '').length > 0) || c.type === 'mention'),
  )
}

/** The day heading: the operator's label, else the formatted date, else "Day N". */
export function dayLabel(row: DayLabelRow, index: number): string {
  if (row.dateLabel) return row.dateLabel
  if (row.startDate) {
    try {
      return new Date(row.startDate).toLocaleDateString(LOCALE, DAY_LABEL_FORMAT)
    } catch { /* fall through */ }
  }
  return `Day ${index + 1}`
}

export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}
