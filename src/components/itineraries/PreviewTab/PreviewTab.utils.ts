import {
  COSTS_ID,
  COVER_PAGE_ID,
  PRE_DAY_SLOTS,
  SLOT_LABELS,
  dayId,
  infoSlotId,
  slotsFor,
  taggedId,
  type ProposalRow,
  type ProposalSlot,
  type TaggedPage,
} from '@/components/itineraries/ProposalSections'
import { dayLabel } from '@/components/itineraries/ProposalBlocks'
import { SCROLL_BEHAVIOR, TOC_LABELS } from './PreviewTab.constants'
import type { TocEntry, TocGroup } from './PreviewTab.types'

export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView(SCROLL_BEHAVIOR)
}

const slotEntries = (slots: ProposalSlot[]): TocEntry[] =>
  slots.map((s) => ({ targetId: infoSlotId(s.id), label: s.contentPage.name }))

/**
 * The table of contents, in page order: cover, pre-day info pages, days,
 * tagged content pages, investment, end info pages. Empty groups are dropped.
 */
export function buildToc(input: {
  slots: ProposalSlot[]
  rows: ProposalRow[]
  taggedPages: TaggedPage[]
  showCosts: boolean
}): TocGroup[] {
  const groups: TocGroup[] = [
    { key: 'cover', entries: [{ targetId: COVER_PAGE_ID, label: TOC_LABELS.cover }] },
    ...PRE_DAY_SLOTS.map((key) => ({
      key,
      label: SLOT_LABELS[key],
      entries: slotEntries(slotsFor(input.slots, key)),
    })),
    {
      key: 'days',
      label: TOC_LABELS.days,
      entries: input.rows.map((row, i) => ({
        targetId: dayId(row.id),
        label: dayLabel(row, i),
        dayNumber: i + 1,
      })),
    },
    {
      key: 'tagged',
      label: TOC_LABELS.contentPages,
      entries: input.taggedPages.map((cp) => ({ targetId: taggedId(cp.id), label: cp.name })),
    },
    {
      key: 'costs',
      label: TOC_LABELS.investment,
      entries: input.showCosts ? [{ targetId: COSTS_ID, label: TOC_LABELS.investment }] : [],
    },
    { key: 'END', label: SLOT_LABELS.END, entries: slotEntries(slotsFor(input.slots, 'END')) },
  ]
  return groups.filter((g) => g.entries.length > 0)
}
