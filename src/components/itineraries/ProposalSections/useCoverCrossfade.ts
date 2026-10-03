import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_COVER_LABEL, EMPTY_COVER } from './ProposalSections.constants'
import { activeCoverId, buildCoverMap, coverKey } from './ProposalSections.utils'
import type { CoverInfo, ProposalItinerary } from './ProposalSections.types'

/**
 * The sticky cover panel: follows the section scrolled into view and
 * crossfades between two layers, so one image fades out as the next fades in.
 *
 * Shared by the share page and the Preview tab — attach `contentRef` to the
 * scroll container and render `layerA` / `layerB` with `showA`.
 */
export function useCoverCrossfade(itinerary: ProposalItinerary | null) {
  const [layerA, setLayerA] = useState<CoverInfo>(EMPTY_COVER)
  const [layerB, setLayerB] = useState<CoverInfo>(EMPTY_COVER)
  const [showA, setShowA] = useState(true)
  const showingRef = useRef<'A' | 'B'>('A')
  const contentRef = useRef<HTMLDivElement>(null)

  // Write to the hidden layer, then reveal it.
  const switchCover = useCallback((info: CoverInfo) => {
    if (showingRef.current === 'A') {
      setLayerB(info)
      setShowA(false)
      showingRef.current = 'B'
    } else {
      setLayerA(info)
      setShowA(true)
      showingRef.current = 'A'
    }
  }, [])

  useEffect(() => {
    const container = contentRef.current
    if (!container || !itinerary) return

    const coverMap = buildCoverMap(itinerary)
    const fallback: CoverInfo = { url: null, label: DEFAULT_COVER_LABEL, title: itinerary.proposalTitle }
    let lastKey = ''

    const handleScroll = () => {
      const id = activeCoverId(container)
      const cover = (id && coverMap.get(id)) || fallback
      const key = coverKey(cover)
      if (key !== lastKey) {
        lastKey = key
        switchCover(cover)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [itinerary, switchCover])

  return { contentRef, layerA, layerB, showA, cover: showA ? layerA : layerB }
}
