import { useMemo } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import {
  collectTaggedPages,
  hasCosts,
  slotsFor,
  sortByPosition,
  tripGlance,
  useCoverCrossfade,
} from '@/components/itineraries/ProposalSections'
import { buildToc } from './PreviewTab.utils'

/** The builder's itinerary, shaped for the Preview: sorted sections, ToC and cover panel. */
export function usePreviewTab() {
  const itinerary = useBuilderStore((s) => s.itinerary)
  const crossfade = useCoverCrossfade(itinerary)

  const view = useMemo(() => {
    if (!itinerary) return null
    const rows = sortByPosition(itinerary.rows)
    const taggedPages = collectTaggedPages(rows)
    const costs = hasCosts(itinerary.costs) ? itinerary.costs : null
    return {
      rows,
      taggedPages,
      costs,
      glance: tripGlance(rows),
      afterCover: slotsFor(itinerary.infoPageSlots, 'AFTER_COVER'),
      beforeDayByDay: slotsFor(itinerary.infoPageSlots, 'BEFORE_DAY_BY_DAY'),
      endSlots: slotsFor(itinerary.infoPageSlots, 'END'),
      toc: buildToc({ slots: itinerary.infoPageSlots, rows, taggedPages, showCosts: !!costs }),
    }
  }, [itinerary])

  return { itinerary, view, ...crossfade }
}
