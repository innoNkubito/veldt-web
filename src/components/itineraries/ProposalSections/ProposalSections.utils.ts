import { contentTypeConfig } from '@/lib/contentTypes'
import {
  COVER_ATTRIBUTE,
  COVER_DETECTION_RATIO,
  COVER_PAGE_ID,
  DAY_MS,
  DEFAULT_COVER_LABEL,
  DEFAULT_ROW_NIGHTS,
  EXPERIENCE_CONTENT_TYPE,
  INFO_SLOT_PREFIX,
  SECTION_COVERS,
  TAGGED_PREFIX,
  DAY_PREFIX,
} from './ProposalSections.constants'
import type {
  CoverInfo,
  ProposalContentPage,
  ProposalCostsData,
  ProposalItinerary,
  ProposalRow,
  ProposalSlot,
  SlotKey,
  TaggedPage,
  TripGlance,
} from './ProposalSections.types'

export const infoSlotId = (slotId: string) => `${INFO_SLOT_PREFIX}${slotId}`
export const taggedId = (pageId: string) => `${TAGGED_PREFIX}${pageId}`
export const dayId = (rowId: string) => `${DAY_PREFIX}${rowId}`

/** A copy sorted by `position` — never mutates the store's arrays. */
export function sortByPosition<T extends { position: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.position - b.position)
}

/** The info pages placed in one slot, in order. */
export function slotsFor<S extends ProposalSlot>(slots: readonly S[], key: SlotKey): S[] {
  return sortByPosition(slots.filter((s) => s.slot === key))
}

/** A row's tagged pages: activities, then accommodations, each in order. */
export function rowContentPages(row: ProposalRow): ProposalContentPage[] {
  return [
    ...sortByPosition(row.activities).map((a) => a.contentPage),
    ...sortByPosition(row.accommodations).map((a) => a.contentPage),
  ]
}

/** Every page tagged on a day, once each, in order of first appearance. */
export function collectTaggedPages(rows: readonly ProposalRow[]): TaggedPage[] {
  const seen = new Set<string>()
  const pages: TaggedPage[] = []
  for (const row of rows) {
    for (const cp of rowContentPages(row)) {
      if (seen.has(cp.id) || !cp.type) continue
      seen.add(cp.id)
      pages.push({
        id: cp.id,
        name: cp.name,
        type: cp.type,
        coverImageUrl: cp.coverImageUrl ?? null,
        pageContent: cp.pageContent ?? null,
        rooms: cp.rooms ?? [],
      })
    }
  }
  return pages
}

const unique = (values: string[]) => [...new Set(values)]

/** Destinations, stays and experiences across the trip, for the cover page. */
export function tripGlance(rows: readonly ProposalRow[]): TripGlance {
  return {
    destinations: unique(rows.flatMap((r) => (r.areaPage?.name ? [r.areaPage.name] : []))),
    stays: unique(rows.flatMap((r) => r.accommodations.map((a) => a.contentPage.name))),
    experiences: unique(
      rows.flatMap((r) =>
        r.activities
          .filter((a) => a.contentPage.type === EXPERIENCE_CONTENT_TYPE)
          .map((a) => a.contentPage.name),
      ),
    ),
  }
}

export function hasGlance(glance: TripGlance): boolean {
  return glance.destinations.length > 0 || glance.stays.length > 0 || glance.experiences.length > 0
}

/** Whether there is anything to show in the Investment section. */
export function hasCosts(costs: ProposalCostsData | null | undefined): costs is ProposalCostsData {
  return !!costs && (
    costs.costsToBeDetetermined ||
    costs.pricePerPerson != null ||
    !!costs.costIncludes ||
    !!costs.costExcludes
  )
}

export const pluralise = (count: number, singular: string) =>
  `${count} ${singular}${count === 1 ? '' : 's'}`

export function roomTagLabel(acc: ProposalRow['accommodations'][number]): string {
  return acc.room ? `${acc.contentPage.name} — ${acc.room.roomType}` : acc.contentPage.name
}

function pageCover(page: ProposalContentPage): CoverInfo {
  const type = page.type ?? ''
  return {
    url: page.coverImageUrl ?? null,
    label: contentTypeConfig(type)?.label ?? type,
    title: page.name,
  }
}

/** The cover for every sentinel id on the page. */
export function buildCoverMap(itinerary: ProposalItinerary): Map<string, CoverInfo> {
  const title = itinerary.proposalTitle
  const map = new Map<string, CoverInfo>()
  map.set(COVER_PAGE_ID, { url: null, label: DEFAULT_COVER_LABEL, title })
  for (const slot of itinerary.infoPageSlots) {
    map.set(infoSlotId(slot.id), pageCover(slot.contentPage))
  }
  for (const row of itinerary.rows) {
    for (const cp of rowContentPages(row)) {
      if (cp.type && !map.has(taggedId(cp.id))) map.set(taggedId(cp.id), pageCover(cp))
    }
  }
  for (const [id, cover] of Object.entries(SECTION_COVERS)) {
    map.set(id, { url: null, label: cover.label, title: cover.title ?? title })
  }
  return map
}

/**
 * The sentinel currently "in view": the last one whose top has passed the
 * detection line. Works in both scroll directions.
 */
export function activeCoverId(container: HTMLElement): string | null {
  const rect = container.getBoundingClientRect()
  const detectionY = rect.top + rect.height * COVER_DETECTION_RATIO
  let active: string | null = null
  for (const el of container.querySelectorAll<HTMLElement>(`[${COVER_ATTRIBUTE}]`)) {
    if (el.getBoundingClientRect().top <= detectionY) active = el.getAttribute(COVER_ATTRIBUTE)
  }
  return active
}

export const coverKey = (cover: CoverInfo) => `${cover.label}::${cover.title}`

const utcDay = (date: string) => Date.parse(`${date.slice(0, 10)}T00:00:00.000Z`)

/**
 * Gives every row a date. A row's own date wins; any other row starts where
 * the previous one ended — the trip start for the first — and runs for its
 * night count. Rows must already be in order. Without a trip start date the
 * rows are returned as they are.
 */
export function resolveRowDates<R extends { startDate: string | null; numNights?: number | null }>(
  rows: readonly R[],
  tripStart: string | null | undefined,
): R[] {
  if (!tripStart) return [...rows]
  let cursor = utcDay(tripStart)
  return rows.map((row) => {
    const start = row.startDate ? utcDay(row.startDate) : cursor
    cursor = start + (row.numNights ?? DEFAULT_ROW_NIGHTS) * DAY_MS
    return row.startDate ? row : { ...row, startDate: new Date(start).toISOString() }
  })
}
