'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { GraphQLClient, gql } from 'graphql-request'
import {
  MapPin, Binoculars, Star, Sun, BedDouble, Plane, Thermometer,
  CalendarDays, Users, Leaf, Camera, Info,
} from 'lucide-react'
import { CONTENT_TYPE_CONFIG, type ContentType } from '@/lib/contentTypes'
import * as S from './page.styled'

// ── Types ──────────────────────────────────────────────────────

interface Room {
  id: string
  roomType: string
  description: string | null
  photos: string[]
}

interface FullContentPage {
  id: string
  name: string
  type: string
  coverImageUrl: string | null
  pageContent: unknown
  rooms: Room[]
}

interface InfoPageSlot {
  id: string
  slot: string
  position: number
  contentPage: FullContentPage
}

interface PublicRow {
  id: string
  position: number
  dateLabel: string | null
  startDate: string | null
  numNights: number | null
  transfersText: string | null
  activitiesRichText: Record<string, unknown> | null
  accommodationsRichText: Record<string, unknown> | null
  areaPage: { id: string; name: string } | null
  activities: {
    id: string
    position: number
    contentPage: FullContentPage
  }[]
  accommodations: {
    id: string
    position: number
    contentPage: FullContentPage
    room: { id: string; roomType: string } | null
    areaPage: { id: string; name: string } | null
  }[]
}

interface PublicItinerary {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  whiteLabel: boolean
  slug: string
  infoPageSlots: InfoPageSlot[]
  rows: PublicRow[]
  costs: {
    pricePerPerson: number | null
    numGuests: number
    accommodationType: string | null
    currency: string
    costsToBeDetetermined: boolean
    costIncludes: string | null
    costExcludes: string | null
    costNotes: string | null
    notesVisible: boolean
    miscText: string | null
    miscVisible: boolean
    priceVisible: boolean
  } | null
}

// ── GQL ────────────────────────────────────────────────────────

const CONTENT_PAGE_FIELDS = `
  id name type coverImageUrl pageContent
  rooms { id roomType description photos }
`

const GET_BY_SLUG = gql`
  query GetBySlug($slug: String!) {
    itineraryBySlug(slug: $slug) {
      id proposalTitle preparedFor travelDates whiteLabel slug
      infoPageSlots {
        id slot position
        contentPage { ${CONTENT_PAGE_FIELDS} }
      }
      rows {
        id position dateLabel startDate numNights transfersText
        activitiesRichText accommodationsRichText
        areaPage { id name }
        activities {
          id position
          contentPage { ${CONTENT_PAGE_FIELDS} }
        }
        accommodations {
          id position
          contentPage { ${CONTENT_PAGE_FIELDS} }
          room { id roomType }
          areaPage { id name }
        }
      }
      costs {
        pricePerPerson numGuests accommodationType currency
        costsToBeDetetermined costIncludes costExcludes
        costNotes notesVisible miscText miscVisible priceVisible
      }
    }
  }
`

const RECORD_VIEW = gql`
  mutation RecordView($slug: String!) {
    recordView(slug: $slug)
  }
`

// ── pageContent types ───────────────────────────────────────────

interface TextImageSection { type: string; text1: string; images: string[]; text2: string }
interface FastFactsGroup { label: string; items: string[] }
interface FastFactsSection { type: 'fastFacts'; groups: FastFactsGroup[] }
interface AccommodationSection { type: 'accommodation'; intro: string }
interface GallerySection { type: 'gallery'; images: string[] }
interface PageContent { sections: (TextImageSection | FastFactsSection | AccommodationSection | GallerySection)[] }

function parsePageContent(raw: unknown): PageContent | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const pc = raw as PageContent
    if (Array.isArray(pc.sections) && pc.sections.length > 0) return pc
  }
  return null
}

// Section titles mirror each content type's own Page Mode
// (identical to PreviewTab)
function sectionTitle(type: string, contentType?: string) {
  if (type === 'overview') {
    switch (contentType) {
      case 'AREA':               return 'Area Overview'
      case 'ACTIVITY':           return 'Activity Overview'
      case 'ABOUT_US':           return 'About Us'
      case 'INTRODUCTORY_NOTES': return 'Introductory Notes'
      case 'TERMS_CONDITIONS':   return 'Terms & Conditions'
      default:                   return 'Property Overview'
    }
  }
  switch (type) {
    case 'experience':    return 'Experience & Activities'
    case 'accommodation': return 'Accommodation'
    case 'fastFacts':     return 'Fast Facts'
    case 'gallery':       return 'Gallery'
    default: return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function factIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('location') || l.includes('where'))                            return <MapPin size={14} />
  if (l.includes('wildlife') || l.includes('animal') || l.includes('game'))     return <Binoculars size={14} />
  if (l.includes('highlight') || l.includes('feature'))                         return <Star size={14} />
  if (l.includes('activ') || l.includes('experience'))                          return <Sun size={14} />
  if (l.includes('accommo') || l.includes('room') || l.includes('tent'))        return <BedDouble size={14} />
  if (l.includes('getting') || l.includes('flight') || l.includes('transfer'))  return <Plane size={14} />
  if (l.includes('climate') || l.includes('weather') || l.includes('temp'))     return <Thermometer size={14} />
  if (l.includes('best time') || l.includes('season') || l.includes('when'))    return <CalendarDays size={14} />
  if (l.includes('family') || l.includes('child') || l.includes('guest'))       return <Users size={14} />
  if (l.includes('conservation') || l.includes('environment') || l.includes('eco')) return <Leaf size={14} />
  if (l.includes('photo') || l.includes('camera'))                              return <Camera size={14} />
  if (l.includes('quick') || l.includes('fact') || l.includes('detail'))        return <Info size={14} />
  return <Star size={14} />
}

// ── Photo slider ────────────────────────────────────────────────

function PhotoSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  if (images.length === 0) return null
  if (images.length === 1) {
    return (
      <S.SliderWrap>
        <S.SliderTrack $index={0}>
          <S.SliderSlide $url={images[0]} />
        </S.SliderTrack>
      </S.SliderWrap>
    )
  }
  return (
    <S.SliderWrap>
      <S.SliderTrack $index={index}>
        {images.map((url, i) => <S.SliderSlide key={i} $url={url} />)}
      </S.SliderTrack>
      <S.SliderArrow $side="left"
        onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </S.SliderArrow>
      <S.SliderArrow $side="right"
        onClick={() => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </S.SliderArrow>
      <S.SliderDots>
        {images.map((_, i) => (
          <S.SliderDot key={i} $active={i === index} onClick={() => setIndex(i)} />
        ))}
      </S.SliderDots>
    </S.SliderWrap>
  )
}

// ── Rich text — HTML from editor or plain-text fallback ─────────

function RichHtml({ html }: { html: string }) {
  if (!html) return null
  const isHtml = html.trimStart().startsWith('<')
  if (isHtml) return <S.ContentRichText dangerouslySetInnerHTML={{ __html: html }} />
  return (
    <S.ContentRichText>
      {html.split('\n').filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
    </S.ContentRichText>
  )
}

// ── pageContent section renderers (identical to PreviewTab) ─────

function TextImageView({ section, pageId, contentType }: { section: TextImageSection; pageId: string; contentType?: string }) {
  return (
    <S.ContentSection id={`${pageId}-${section.type}`}>
      <S.ContentSectionTitle>{sectionTitle(section.type, contentType)}</S.ContentSectionTitle>
      {section.text1 && <RichHtml html={section.text1} />}
      {section.images.length > 0 && <PhotoSlider images={section.images} />}
      {section.text2 && <RichHtml html={section.text2} />}
    </S.ContentSection>
  )
}

function FastFactsView({ section, pageId }: { section: FastFactsSection; pageId: string }) {
  const groups = section.groups.filter((g) => g.items.some(Boolean))
  if (groups.length === 0) return null
  return (
    <S.ContentSection id={`${pageId}-fastFacts`}>
      <S.ContentSectionTitle>{sectionTitle('fastFacts')}</S.ContentSectionTitle>
      <S.FastFactsGrid>
        {groups.map((group, i) => (
          <S.FastFactGroup key={i}>
            <S.FastFactGroupHeader>
              <S.FastFactGroupIcon>{factIcon(group.label)}</S.FastFactGroupIcon>
              {group.label && <S.FastFactGroupLabel>{group.label}</S.FastFactGroupLabel>}
            </S.FastFactGroupHeader>
            <S.FastFactItems>
              {group.items.filter(Boolean).map((item, j) => (
                <S.FastFactItem key={j}>{item}</S.FastFactItem>
              ))}
            </S.FastFactItems>
          </S.FastFactGroup>
        ))}
      </S.FastFactsGrid>
    </S.ContentSection>
  )
}

function AccommodationView({
  section,
  rooms,
  pageId,
}: {
  section: AccommodationSection
  rooms: Room[]
  pageId: string
}) {
  return (
    <S.ContentSection id={`${pageId}-accommodation`}>
      <S.ContentSectionTitle>{sectionTitle('accommodation')}</S.ContentSectionTitle>
      {section.intro && <RichHtml html={section.intro} />}
      {rooms.length === 0 ? (
        <S.EmptyContent>No rooms added for this property.</S.EmptyContent>
      ) : (
        rooms.map((room) => {
          const photos = room.photos ?? []
          const useSlider = photos.length === 1 || photos.length >= 3
          const displayPhotos = useSlider ? photos : photos.slice(0, 2)
          return (
            <S.AccomRoomBlock key={room.id}>
              <S.AccomRoomHeading>{room.roomType}</S.AccomRoomHeading>
              {room.description && (
                <S.AccomRoomDescription>{room.description}</S.AccomRoomDescription>
              )}
              {photos.length > 0 && (
                useSlider ? (
                  <PhotoSlider images={photos} />
                ) : (
                  <S.AccomPhotoGrid $count={displayPhotos.length}>
                    {displayPhotos.map((url, i) => <S.AccomPhoto key={i} $url={url} />)}
                  </S.AccomPhotoGrid>
                )
              )}
            </S.AccomRoomBlock>
          )
        })
      )}
    </S.ContentSection>
  )
}

function ContentSections({
  content,
  rooms,
  pageId,
  contentType,
}: {
  content: PageContent
  rooms: Room[]
  pageId: string
  contentType?: string
}) {
  return (
    <>
      {content.sections.map((section, i) => {
        if (section.type === 'fastFacts') {
          return <FastFactsView key={i} section={section as FastFactsSection} pageId={pageId} />
        }
        if (section.type === 'accommodation') {
          return (
            <AccommodationView key={i} section={section as AccommodationSection} rooms={rooms} pageId={pageId} />
          )
        }
        if (section.type === 'gallery') {
          const gs = section as GallerySection
          if (gs.images.length === 0) return null
          return (
            <S.ContentSection key={i} id={`${pageId}-gallery`}>
              <S.ContentSectionTitle>{sectionTitle('gallery')}</S.ContentSectionTitle>
              <PhotoSlider images={gs.images} />
            </S.ContentSection>
          )
        }
        return <TextImageView key={i} section={section as TextImageSection} pageId={pageId} contentType={contentType} />
      })}
    </>
  )
}

// ── ProseMirror JSON → React renderer (for day rich text) ───────

interface PMNode {
  type: string
  content?: PMNode[]
  text?: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  attrs?: Record<string, unknown>
}

function renderNode(node: PMNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    let el: React.ReactNode = node.text ?? ''
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold')   el = <strong key={key}>{el}</strong>
      else if (mark.type === 'italic') el = <em key={key}>{el}</em>
      else if (mark.type === 'strike') el = <s key={key}>{el}</s>
      else if (mark.type === 'code')   el = <code key={key}>{el}</code>
    }
    return el
  }
  if (node.type === 'mention') {
    const label = (node.attrs?.label as string | undefined) ?? (node.attrs?.id as string | undefined) ?? ''
    return <span key={key} className="mention">@{label}</span>
  }
  if (node.type === 'hardBreak') return <br key={key} />

  const children = node.content?.map((child, i) => (
    <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
  ))

  switch (node.type) {
    case 'doc':        return <React.Fragment key={key}>{children}</React.Fragment>
    case 'paragraph':  return <p key={key}>{children ?? <br />}</p>
    case 'bulletList': return <ul key={key}>{children}</ul>
    case 'orderedList':return <ol key={key}>{children}</ol>
    case 'listItem':   return <li key={key}>{children}</li>
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>
    case 'codeBlock':  return <pre key={key}><code>{children}</code></pre>
    case 'heading': {
      const level = (node.attrs?.level as number | undefined) ?? 2
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <Tag key={key}>{children}</Tag>
    }
    default: return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

function DayRichText({ json }: { json: Record<string, unknown> | null }) {
  if (!json) return null
  const node = json as unknown as PMNode
  if (!node.content?.length) return null
  const hasContent = node.content.some(
    (n) =>
      n.type !== 'paragraph' ||
      n.content?.some((c) => (c.type === 'text' && (c.text ?? '').length > 0) || c.type === 'mention')
  )
  if (!hasContent) return null
  return (
    <S.DayRichText>
      {node.content.map((child, i) => (
        <React.Fragment key={i}>{renderNode(child, i)}</React.Fragment>
      ))}
    </S.DayRichText>
  )
}

// ── Day label helper ─────────────────────────────────────────────

function dayLabel(row: PublicRow, index: number): string {
  if (row.dateLabel) return row.dateLabel
  if (row.startDate) {
    try {
      return new Date(row.startDate).toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short',
      })
    } catch { /* fall through */ }
  }
  return `Day ${index + 1}`
}

// ── Slot order config (mirrors PreviewTab) ──────────────────────

const SLOT_ORDER = ['AFTER_COVER', 'BEFORE_DAY_BY_DAY', 'END'] as const
type SlotKey = typeof SLOT_ORDER[number]

// ── Cover info type ─────────────────────────────────────────────

interface CoverInfo {
  url: string | null
  label: string
  title: string
}

// ── Currency formatter ──────────────────────────────────────────

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

/** Renders a costs text field — rich HTML from the editor, or legacy plain text. */
function CostsRich({
  text,
  Comp,
  style,
}: {
  text: string
  Comp: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>
  style?: React.CSSProperties
}) {
  if (text.trimStart().startsWith('<')) {
    return <Comp style={style} dangerouslySetInnerHTML={{ __html: text }} />
  }
  return <Comp style={style}>{text}</Comp>
}

// ── Costs section ───────────────────────────────────────────────

function CostsSection({ costs }: { costs: NonNullable<PublicItinerary['costs']> }) {
  if (costs.costsToBeDetetermined) {
    return (
      <S.CostsCard>
        <S.CostsTBD>
          Pricing information will be provided shortly — please contact your advisor.
        </S.CostsTBD>
      </S.CostsCard>
    )
  }

  return (
    <S.CostsCard>
      {costs.priceVisible && costs.pricePerPerson != null && (
        <S.CostsHeader>
          <S.CostsPriceRow>
            <S.CostsPrice>{formatPrice(costs.pricePerPerson, costs.currency)}</S.CostsPrice>
            <S.CostsPriceSub>per person</S.CostsPriceSub>
          </S.CostsPriceRow>
          <S.CostsMeta>
            {costs.numGuests} guest{costs.numGuests !== 1 ? 's' : ''}
            {costs.accommodationType && ` · ${costs.accommodationType}`}
          </S.CostsMeta>
        </S.CostsHeader>
      )}
      {(costs.costIncludes || costs.costExcludes) && (
        <S.CostsBody>
          {costs.costIncludes && (
            <S.CostsColumn>
              <S.CostsColumnLabel>Included</S.CostsColumnLabel>
              <CostsRich text={costs.costIncludes} Comp={S.CostsText} />
            </S.CostsColumn>
          )}
          {costs.costExcludes && (
            <S.CostsColumn>
              <S.CostsColumnLabel>Excludes</S.CostsColumnLabel>
              <CostsRich text={costs.costExcludes} Comp={S.CostsText} />
            </S.CostsColumn>
          )}
        </S.CostsBody>
      )}
      {costs.notesVisible && costs.costNotes && (
        <CostsRich text={costs.costNotes} Comp={S.CostsNotes} />
      )}
      {costs.miscVisible && costs.miscText && (
        <CostsRich text={costs.miscText} Comp={S.CostsNotes} style={{ fontStyle: 'italic' }} />
      )}
    </S.CostsCard>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function SharePage() {
  const params = useParams()
  const slug = params?.slug as string

  const [itinerary, setItinerary] = useState<PublicItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // ── Cover crossfade state (double-buffer pattern, mirrors PreviewTab)
  const [layerA, setLayerA] = useState<CoverInfo>({ url: null, label: 'Itinerary', title: '' })
  const [layerB, setLayerB] = useState<CoverInfo>({ url: null, label: 'Itinerary', title: '' })
  const [showA, setShowA] = useState(true)
  const showingRef = useRef<'A' | 'B'>('A')
  const contentRef = useRef<HTMLDivElement>(null)

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

  // ── Load itinerary ─────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return
    const client = new GraphQLClient(apiUrl)

    async function load() {
      try {
        const data = await client.request<{ itineraryBySlug: PublicItinerary | null }>(GET_BY_SLUG, { slug })
        if (!data.itineraryBySlug) { setNotFound(true); setLoading(false); return }
        setItinerary(data.itineraryBySlug)
        setLoading(false)
        client.request(RECORD_VIEW, { slug }).catch(() => {})
      } catch {
        setNotFound(true)
        setLoading(false)
      }
    }

    load()
  }, [slug])

  // Seed the cover title once the itinerary arrives
  useEffect(() => {
    if (!itinerary) return
    const info = { url: null, label: 'Itinerary', title: itinerary.proposalTitle }
    setLayerA(info)
    setLayerB(info)
  }, [itinerary])

  // ── Scroll-driven cover crossfade (mirrors PreviewTab) ─────────
  useEffect(() => {
    const container = contentRef.current
    if (!container || !itinerary) return

    const coverMap = new Map<string, CoverInfo>()
    coverMap.set('cover-page', {
      url: null, // itinerary cover image — provided by user later
      label: 'Itinerary',
      title: itinerary.proposalTitle,
    })
    for (const slot of itinerary.infoPageSlots) {
      const typeCfg = CONTENT_TYPE_CONFIG[slot.contentPage.type as ContentType]
      coverMap.set(`infoslot-${slot.id}`, {
        url: slot.contentPage.coverImageUrl ?? null,
        label: typeCfg?.label ?? slot.contentPage.type,
        title: slot.contentPage.name,
      })
    }
    coverMap.set('day-by-day', {
      url: null,
      label: 'Day by Day',
      title: 'Day-by-Day Itinerary',
    })
    for (const row of itinerary.rows) {
      const allTagged = [
        ...[...row.activities].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
        ...[...row.accommodations].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
      ]
      for (const cp of allTagged) {
        if (!coverMap.has(`tagged-${cp.id}`) && cp.type) {
          const typeCfg = CONTENT_TYPE_CONFIG[cp.type as ContentType]
          coverMap.set(`tagged-${cp.id}`, {
            url: cp.coverImageUrl ?? null,
            label: typeCfg?.label ?? cp.type,
            title: cp.name,
          })
        }
      }
    }
    coverMap.set('costs', {
      url: null,
      label: 'Investment',
      title: itinerary.proposalTitle,
    })

    const itineraryTitle = itinerary.proposalTitle
    let lastKey = ''

    // Detection line at 25% from the top of the scroll container.
    const getActiveCover = (): CoverInfo => {
      const containerRect = container.getBoundingClientRect()
      const detectionY = containerRect.top + containerRect.height * 0.25

      const sentinels = Array.from(
        container.querySelectorAll('[data-cover-id]')
      ) as HTMLElement[]

      let active: HTMLElement | null = null
      for (const el of sentinels) {
        if (el.getBoundingClientRect().top <= detectionY) active = el
      }

      if (!active) return { url: null, label: 'Itinerary', title: itineraryTitle }
      return coverMap.get(active.dataset.coverId!) ?? { url: null, label: 'Itinerary', title: itineraryTitle }
    }

    const handleScroll = () => {
      const cover = getActiveCover()
      const key = `${cover.label}::${cover.title}`
      if (key !== lastKey) {
        lastKey = key
        switchCover(cover)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [itinerary, switchCover])

  if (loading) {
    return (
      <S.PageRoot>
        <S.CenteredState><div>Loading your itinerary…</div></S.CenteredState>
      </S.PageRoot>
    )
  }

  if (notFound || !itinerary) {
    return (
      <S.PageRoot>
        <S.CenteredState>
          <S.NotFoundTitle>Itinerary not found</S.NotFoundTitle>
          <div>This link may have expired or the itinerary is no longer published.</div>
        </S.CenteredState>
      </S.PageRoot>
    )
  }

  const rows = [...itinerary.rows].sort((a, b) => a.position - b.position)

  const slotMap = (slot: SlotKey) =>
    itinerary.infoPageSlots
      .filter((s) => s.slot === slot)
      .slice()
      .sort((a, b) => a.position - b.position)

  const afterCover     = slotMap('AFTER_COVER')
  const beforeDayByDay = slotMap('BEFORE_DAY_BY_DAY')
  const endSlots       = slotMap('END')

  // ── Collect unique tagged content pages from day rows (in order of
  // first appearance). Activities then accommodations per row,
  // deduplicated by contentPage.id — identical to PreviewTab.
  const taggedPages: FullContentPage[] = []
  const seenIds = new Set<string>()
  for (const row of rows) {
    const allTagged = [
      ...[...row.activities].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
      ...[...row.accommodations].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
    ]
    for (const cp of allTagged) {
      if (!seenIds.has(cp.id) && cp.type) {
        seenIds.add(cp.id)
        taggedPages.push(cp)
      }
    }
  }

  // Current cover text (whichever layer is on top)
  const coverText = showA ? layerA : layerB

  // ── Trip at a glance (for the default cover page) ─────────────
  const glanceDestinations = [...new Set(rows.map((r) => r.areaPage?.name).filter(Boolean))] as string[]
  const glanceStays = [...new Set(rows.flatMap((r) => r.accommodations.map((a) => a.contentPage.name)))]
  const glanceExperiences = [...new Set(
    rows.flatMap((r) => r.activities.filter((a) => a.contentPage.type === 'ACTIVITY').map((a) => a.contentPage.name))
  )]

  const hasCosts = itinerary.costs && (
    itinerary.costs.costsToBeDetetermined ||
    itinerary.costs.pricePerPerson != null ||
    itinerary.costs.costIncludes ||
    itinerary.costs.costExcludes
  )

  // ── Render a full content page block ──────────────────────────
  function ContentPageBlock({ page, blockId }: { page: FullContentPage; blockId: string }) {
    const content = parsePageContent(page.pageContent)

    return (
      <S.InfoPageBlock id={blockId} data-cover-id={blockId}>
        {content && (
          <S.InfoPageBody>
            <S.InfoPageHeader>
              <S.InfoPageTitle>{page.name}</S.InfoPageTitle>
            </S.InfoPageHeader>
            <ContentSections
              content={content}
              rooms={page.rooms ?? []}
              pageId={page.id}
              contentType={page.type}
            />
          </S.InfoPageBody>
        )}
      </S.InfoPageBlock>
    )
  }

  return (
    <S.ViewLayout>
      {/* ── Sticky cover panel ───────────────────────── */}
      <S.CoverPanel>
        <S.CoverBgLayer $url={layerA.url} $visible={showA} />
        <S.CoverBgLayer $url={layerB.url} $visible={!showA} />

        <S.CoverContent>
          <S.CoverLabel>{coverText.label}</S.CoverLabel>
          <S.CoverTitle>{coverText.title || itinerary.proposalTitle}</S.CoverTitle>
          {coverText.label === 'Itinerary' && (
            <S.CoverMeta>
              {itinerary.preparedFor && (
                <S.CoverMetaRow>
                  <span>Prepared for {itinerary.preparedFor}</span>
                </S.CoverMetaRow>
              )}
              {itinerary.travelDates && (
                <S.CoverMetaRow>
                  <span>{itinerary.travelDates}</span>
                </S.CoverMetaRow>
              )}
              {rows.length > 0 && (
                <S.CoverMetaRow>
                  <span>{rows.length} {rows.length === 1 ? 'day' : 'days'}</span>
                </S.CoverMetaRow>
              )}
            </S.CoverMeta>
          )}
        </S.CoverContent>
      </S.CoverPanel>

      {/* ── Scrollable content ───────────────────────── */}
      <S.ViewContent ref={contentRef}>

        {/* ── Default cover page ─ */}
        <S.CoverPageBlock id="cover-page" data-cover-id="cover-page">
          <S.CoverPagePretitle>Safari Proposal</S.CoverPagePretitle>
          <S.CoverPageTitle>{itinerary.proposalTitle}</S.CoverPageTitle>
          <S.CoverPageDivider />

          <S.CoverPageMetaList>
            {itinerary.preparedFor && (
              <S.CoverPageMetaRow>
                <S.CoverPageMetaLabel>Prepared for</S.CoverPageMetaLabel>
                <S.CoverPageMetaValue>{itinerary.preparedFor}</S.CoverPageMetaValue>
              </S.CoverPageMetaRow>
            )}
            {itinerary.travelDates && (
              <S.CoverPageMetaRow>
                <S.CoverPageMetaLabel>Travel dates</S.CoverPageMetaLabel>
                <S.CoverPageMetaValue>{itinerary.travelDates}</S.CoverPageMetaValue>
              </S.CoverPageMetaRow>
            )}
            {rows.length > 0 && (
              <S.CoverPageMetaRow>
                <S.CoverPageMetaLabel>Duration</S.CoverPageMetaLabel>
                <S.CoverPageMetaValue>{rows.length} {rows.length === 1 ? 'day' : 'days'}</S.CoverPageMetaValue>
              </S.CoverPageMetaRow>
            )}
          </S.CoverPageMetaList>

          <S.CoverPageIntro>
            Welcome to your bespoke safari proposal. Within these pages you&rsquo;ll find a
            day-by-day journey crafted around the wild places, hand-picked stays and
            unforgettable experiences selected especially for you.
          </S.CoverPageIntro>

          {(glanceDestinations.length > 0 || glanceStays.length > 0 || glanceExperiences.length > 0) && (
            <S.GlanceGrid>
              {glanceDestinations.length > 0 && (
                <S.GlanceItem>
                  <S.GlanceLabel>Destinations</S.GlanceLabel>
                  <S.GlanceValue>{glanceDestinations.join(' · ')}</S.GlanceValue>
                </S.GlanceItem>
              )}
              {glanceStays.length > 0 && (
                <S.GlanceItem>
                  <S.GlanceLabel>Stays</S.GlanceLabel>
                  <S.GlanceValue>{glanceStays.join(' · ')}</S.GlanceValue>
                </S.GlanceItem>
              )}
              {glanceExperiences.length > 0 && (
                <S.GlanceItem>
                  <S.GlanceLabel>Experiences</S.GlanceLabel>
                  <S.GlanceValue>{glanceExperiences.join(' · ')}</S.GlanceValue>
                </S.GlanceItem>
              )}
            </S.GlanceGrid>
          )}
        </S.CoverPageBlock>

        {/* ── AFTER_COVER info pages ─ */}
        {afterCover.map((slot) => (
          <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={`infoslot-${slot.id}`} />
        ))}

        {/* ── BEFORE_DAY_BY_DAY info pages ─ */}
        {beforeDayByDay.map((slot) => (
          <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={`infoslot-${slot.id}`} />
        ))}

        {/* ── Day-by-Day ─ */}
        <S.DayByDayBlock id="day-by-day" data-cover-id="day-by-day">
          <S.DayByDayHeader>
            <S.DayByDayHeading>Day-by-Day Itinerary</S.DayByDayHeading>
            {rows.length > 0 && (
              <S.DayByDayMeta>{rows.length} {rows.length === 1 ? 'day' : 'days'}</S.DayByDayMeta>
            )}
          </S.DayByDayHeader>

          <S.DaySections>
            {rows.map((row, i) => {
              const richActivities = <DayRichText json={row.activitiesRichText} />
              const richAccom = <DayRichText json={row.accommodationsRichText} />
              const hasActivityTags = row.activities.length > 0
              const hasAccomTags = row.accommodations.length > 0

              return (
                <S.DaySection key={row.id} id={`day-${row.id}`}>
                  <S.DayHeader>
                    <S.DayDate>{dayLabel(row, i)}</S.DayDate>
                    {row.areaPage && <S.DayArea>{row.areaPage.name}</S.DayArea>}
                  </S.DayHeader>

                  <S.DayColumns>
                    <S.DayColumn>
                      <S.DayColumnLabel>Transfers &amp; Activities</S.DayColumnLabel>
                      {richActivities}
                      {hasActivityTags && (
                        <S.TagList>
                          {row.activities
                            .slice()
                            .sort((a, b) => a.position - b.position)
                            .map((a) => <S.Tag key={a.id}>{a.contentPage.name}</S.Tag>)}
                        </S.TagList>
                      )}
                    </S.DayColumn>
                    <S.DayColumn>
                      <S.DayColumnLabel>Accommodations</S.DayColumnLabel>
                      {richAccom}
                      {hasAccomTags && (
                        <S.TagList>
                          {row.accommodations
                            .slice()
                            .sort((a, b) => a.position - b.position)
                            .map((a) => (
                              <S.Tag key={a.id}>
                                {a.contentPage.name}{a.room ? ` — ${a.room.roomType}` : ''}
                              </S.Tag>
                            ))}
                        </S.TagList>
                      )}
                    </S.DayColumn>
                  </S.DayColumns>
                </S.DaySection>
              )
            })}
          </S.DaySections>
        </S.DayByDayBlock>

        {/* ── Tagged content pages (from day-by-day, in order of first appearance) ─ */}
        {taggedPages.map((cp) => (
          <ContentPageBlock key={cp.id} page={cp} blockId={`tagged-${cp.id}`} />
        ))}

        {/* ── Costs ─ */}
        {hasCosts && (
          <S.CostsBlock id="costs" data-cover-id="costs">
            <S.CostsHeading>Investment</S.CostsHeading>
            <CostsSection costs={itinerary.costs!} />
          </S.CostsBlock>
        )}

        {/* ── END info pages ─ */}
        {endSlots.map((slot) => (
          <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={`infoslot-${slot.id}`} />
        ))}

        {/* ── Footer ─ */}
        {!itinerary.whiteLabel && (
          <S.Footer>
            Built with <S.FooterBrand>Veldt</S.FooterBrand> — the safari itinerary platform
          </S.Footer>
        )}

      </S.ViewContent>
    </S.ViewLayout>
  )
}
