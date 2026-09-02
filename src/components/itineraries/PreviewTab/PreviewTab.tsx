'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  MapPin, Binoculars, Sun, BedDouble, Plane, Thermometer,
  Users, CalendarDays, Leaf, Camera, Star, Info,
} from 'lucide-react'
import { useBuilderStore, type ItineraryRow, type InfoPageRoom } from '@/stores/builderStore'
import { contentTypeConfig } from '@/lib/contentTypes'
import * as S from './PreviewTab.styled'
import {
  toPMNode,
  attrString,
  attrNumber,
  headingTag,
  type PMNode,
} from '@/lib/prosemirror'
import {
  parsePageContent,
  type PageContent,
  type TextImageSection,
  type FastFactsSection,
  type AccommodationSection,
} from '@/lib/pageContent'

// ─────────────────────────────────────────────────────────────────
// Section title / icon helpers
// ─────────────────────────────────────────────────────────────────

// Section titles mirror each content type's own Page Mode:
// PROPERTY → PageContentTab, AREA → AreaPageContentTab, etc.
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

function sectionIcon(type: string) {
  switch (type) {
    case 'overview':      return '◈'
    case 'experience':    return '◉'
    case 'accommodation': return '⊞'
    case 'fastFacts':     return '≡'
    case 'gallery':       return '▦'
    default: return '·'
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

// ─────────────────────────────────────────────────────────────────
// Photo slider
// ─────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────
// Rich text — HTML from editor or plain-text fallback
// ─────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────
// pageContent section renderers
// ─────────────────────────────────────────────────────────────────

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
  rooms: InfoPageRoom[]
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
  rooms: InfoPageRoom[]
  pageId: string
  contentType?: string
}) {
  return (
    <>
      {content.sections.map((section, i) => {
        if (section.type === 'fastFacts') {
          return <FastFactsView key={i} section={section} pageId={pageId} />
        }
        if (section.type === 'accommodation') {
          return (
            <AccommodationView key={i} section={section} rooms={rooms} pageId={pageId} />
          )
        }
        if (section.type === 'gallery') {
          // Gallery: render as a simple photo grid in preview (no download UI)
          const gs = section
          if (gs.images.length === 0) return null
          return (
            <S.ContentSection key={i} id={`${pageId}-gallery`}>
              <S.ContentSectionTitle>{sectionTitle('gallery')}</S.ContentSectionTitle>
              <PhotoSlider images={gs.images} />
            </S.ContentSection>
          )
        }
        return <TextImageView key={i} section={section} pageId={pageId} contentType={contentType} />
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// ProseMirror JSON → React renderer (for day rich text)
// ─────────────────────────────────────────────────────────────────

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
    const label = attrString(node, 'label') ?? attrString(node, 'id') ?? ''
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
      const Tag = headingTag(attrNumber(node, 'level') ?? 2)
      return <Tag key={key}>{children}</Tag>
    }
    default: return <React.Fragment key={key}>{children}</React.Fragment>
  }
}

function DayRichText({ json }: { json: Record<string, unknown> | null }) {
  const node = toPMNode(json)
  if (!node?.content?.length) return null
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

// ─────────────────────────────────────────────────────────────────
// Costs (Investment) helpers
// ─────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────
// Day label helper
// ─────────────────────────────────────────────────────────────────

function dayLabel(row: ItineraryRow, index: number): string {
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

// ─────────────────────────────────────────────────────────────────
// Slot order config (mirrors InfoPagesCard)
// ─────────────────────────────────────────────────────────────────

const SLOT_ORDER = ['AFTER_COVER', 'BEFORE_DAY_BY_DAY', 'END'] as const
type SlotKey = typeof SLOT_ORDER[number]

const PRE_DAY_SLOTS: readonly SlotKey[] = ['AFTER_COVER', 'BEFORE_DAY_BY_DAY']

const SLOT_LABELS: Record<SlotKey, string> = {
  AFTER_COVER:       'After Cover',
  BEFORE_DAY_BY_DAY: 'Before Day-by-Day',
  END:               'End',
}

// ─────────────────────────────────────────────────────────────────
// Cover info type
// ─────────────────────────────────────────────────────────────────

interface CoverInfo {
  url: string | null
  label: string
  title: string
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────

export default function PreviewTab() {
  const itinerary = useBuilderStore((s) => s.itinerary)

  // ── Cover crossfade state (double-buffer pattern) ────────────────
  const [layerA, setLayerA] = useState<CoverInfo>(() => ({
    url: null, label: 'Itinerary', title: itinerary?.proposalTitle ?? '',
  }))
  const [layerB, setLayerB] = useState<CoverInfo>(() => ({
    url: null, label: 'Itinerary', title: itinerary?.proposalTitle ?? '',
  }))
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

  const infoPageSlots = itinerary?.infoPageSlots ?? []

  useEffect(() => {
    const container = contentRef.current
    if (!container) return

    // Build cover lookup from current slots
    const coverMap = new Map<string, CoverInfo>()
    coverMap.set('cover-page', {
      url: null, // itinerary cover image — provided by user later
      label: 'Itinerary',
      title: itinerary?.proposalTitle ?? '',
    })
    for (const slot of infoPageSlots) {
      const typeCfg = contentTypeConfig(slot.contentPage.type)
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
    coverMap.set('costs', {
      url: null,
      label: 'Investment',
      title: itinerary?.proposalTitle ?? '',
    })
    // Tagged content pages from day rows
    for (const row of (itinerary?.rows ?? [])) {
      const allTagged = [
        ...[...row.activities].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
        ...[...row.accommodations].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
      ]
      for (const cp of allTagged) {
        if (!coverMap.has(`tagged-${cp.id}`) && cp.type) {
          const typeCfg = contentTypeConfig(cp.type)
          coverMap.set(`tagged-${cp.id}`, {
            url: cp.coverImageUrl ?? null,
            label: typeCfg?.label ?? cp.type,
            title: cp.name,
          })
        }
      }
    }

    const itineraryTitle = itinerary?.proposalTitle ?? ''
    let lastKey = ''

    // Detection line at 25% from the top of the scroll container.
    // The last sentinel whose top is at or above this line is the active section —
    // works correctly for both scroll directions.
    const getActiveCover = (): CoverInfo => {
      const containerRect = container.getBoundingClientRect()
      const detectionY = containerRect.top + containerRect.height * 0.25

      const sentinels = Array.from(
        container.querySelectorAll<HTMLElement>('[data-cover-id]')
      )

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoPageSlots.length, itinerary?.rows?.length, switchCover])

  if (!itinerary) return null

  const rows = [...itinerary.rows].sort((a, b) => a.position - b.position)

  // Group info page slots by slot key, sorted by position
  const slotMap = (slot: SlotKey) =>
    itinerary.infoPageSlots
      .filter((s) => s.slot === slot)
      .slice()
      .sort((a, b) => a.position - b.position)

  const afterCover       = slotMap('AFTER_COVER')
  const beforeDayByDay   = slotMap('BEFORE_DAY_BY_DAY')
  const endSlots         = slotMap('END')

  // ── Collect unique tagged content pages from day rows (in order of first appearance)
  // Activities then accommodations per row, deduplicated by contentPage.id
  type TaggedPage = NonNullable<typeof rows[number]['activities'][number]['contentPage']> & {
    type: string; coverImageUrl: string | null; pageContent: unknown; rooms: InfoPageRoom[]
  }
  const taggedPages: TaggedPage[] = []
  const seenIds = new Set<string>()
  for (const row of rows) {
    const allTagged = [
      ...[...row.activities].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
      ...[...row.accommodations].sort((a, b) => a.position - b.position).map((a) => a.contentPage),
    ]
    for (const cp of allTagged) {
      if (!seenIds.has(cp.id) && cp.type) {
        seenIds.add(cp.id)
        // TaggedPage requires these; the source fields are optional, so the
        // old cast was asserting a shape the data need not have.
        taggedPages.push({
          ...cp,
          type: cp.type,
          coverImageUrl: cp.coverImageUrl ?? null,
          pageContent: cp.pageContent ?? null,
          rooms: cp.rooms ?? [],
        })
      }
    }
  }

  // Current cover text (whichever layer is on top)
  const coverText = showA ? layerA : layerB

  // ── Render an info page block (from a slot) ───────────────────
  function InfoPage({ slot }: { slot: typeof afterCover[number] }) {
    const { contentPage } = slot
    const content = parsePageContent(contentPage.pageContent)

    return (
      <S.InfoPageBlock id={`infoslot-${slot.id}`} data-cover-id={`infoslot-${slot.id}`}>
        {content && (
          <S.InfoPageBody>
            <S.InfoPageHeader>
              <S.InfoPageTitle>{contentPage.name}</S.InfoPageTitle>
            </S.InfoPageHeader>
            <ContentSections
              content={content}
              rooms={contentPage.rooms ?? []}
              pageId={slot.id}
              contentType={contentPage.type}
            />
          </S.InfoPageBody>
        )}
      </S.InfoPageBlock>
    )
  }

  // ── Render a tagged content page block ────────────────────────
  function TaggedPage({ cp }: { cp: TaggedPage }) {
    const content = parsePageContent(cp.pageContent)

    return (
      <S.InfoPageBlock id={`tagged-${cp.id}`} data-cover-id={`tagged-${cp.id}`}>
        {content && (
          <S.InfoPageBody>
            <S.InfoPageHeader>
              <S.InfoPageTitle>{cp.name}</S.InfoPageTitle>
            </S.InfoPageHeader>
            <ContentSections
              content={content}
              rooms={cp.rooms ?? []}
              pageId={cp.id}
              contentType={cp.type}
            />
          </S.InfoPageBody>
        )}
      </S.InfoPageBlock>
    )
  }

  // ── Trip at a glance (for the default cover page) ─────────────
  const glanceDestinations = [
    ...new Set(
      rows.flatMap((r) => (r.areaPage?.name ? [r.areaPage.name] : [])),
    ),
  ]
  const glanceStays = [...new Set(rows.flatMap((r) => r.accommodations.map((a) => a.contentPage.name)))]
  const glanceExperiences = [...new Set(
    rows.flatMap((r) => r.activities.filter((a) => a.contentPage.type === 'ACTIVITY').map((a) => a.contentPage.name))
  )]

  // ── Costs visibility ───────────────────────────────────────────
  const costs = itinerary.costs
  const hasCosts = !!costs && (
    costs.costsToBeDetetermined ||
    costs.pricePerPerson != null ||
    !!costs.costIncludes ||
    !!costs.costExcludes
  )

  // ── ToC entries ───────────────────────────────────────────────
  const tocSlots = SLOT_ORDER.flatMap((slotKey) => slotMap(slotKey))
  const hasDays = rows.length > 0

  return (
    <S.PreviewLayout>
      {/* ── Table of Contents ──────────────────────────── */}
      <S.PreviewToC>
        <S.ToCTitle>Contents</S.ToCTitle>

        {/* Cover page */}
        <S.ToCGroup>
          <S.ToCItem
            href="#cover-page"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('cover-page')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Cover
          </S.ToCItem>
        </S.ToCGroup>

        {/* Slots before day-by-day */}
        {PRE_DAY_SLOTS.map((slotKey) => {
          const items = slotMap(slotKey)
          if (items.length === 0) return null
          return (
            <S.ToCGroup key={slotKey}>
              <S.ToCGroupLabel>{SLOT_LABELS[slotKey]}</S.ToCGroupLabel>
              {items.map((s) => (
                <S.ToCItem
                  key={s.id}
                  href={`#infoslot-${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(`infoslot-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {s.contentPage.name}
                </S.ToCItem>
              ))}
            </S.ToCGroup>
          )
        })}

        {/* Day-by-day */}
        {hasDays && (
          <S.ToCGroup>
            <S.ToCGroupLabel>Day by Day</S.ToCGroupLabel>
            {rows.map((row, i) => (
              <S.ToCItem
                key={row.id}
                href={`#day-${row.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`day-${row.id}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <S.ToCDayNum>{i + 1}</S.ToCDayNum>
                {dayLabel(row, i)}
              </S.ToCItem>
            ))}
          </S.ToCGroup>
        )}

        {/* Tagged content pages */}
        {taggedPages.length > 0 && (
          <S.ToCGroup>
            <S.ToCGroupLabel>Content Pages</S.ToCGroupLabel>
            {taggedPages.map((cp) => (
              <S.ToCItem
                key={cp.id}
                href={`#tagged-${cp.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`tagged-${cp.id}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {cp.name}
              </S.ToCItem>
            ))}
          </S.ToCGroup>
        )}

        {/* Investment */}
        {hasCosts && (
          <S.ToCGroup>
            <S.ToCGroupLabel>Investment</S.ToCGroupLabel>
            <S.ToCItem
              href="#costs"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('costs')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Investment
            </S.ToCItem>
          </S.ToCGroup>
        )}

        {/* End slots */}
        {endSlots.length > 0 && (
          <S.ToCGroup>
            <S.ToCGroupLabel>{SLOT_LABELS.END}</S.ToCGroupLabel>
            {endSlots.map((s) => (
              <S.ToCItem
                key={s.id}
                href={`#infoslot-${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(`infoslot-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {s.contentPage.name}
              </S.ToCItem>
            ))}
          </S.ToCGroup>
        )}
      </S.PreviewToC>

      {/* ── Sticky cover panel (col 2) ───────────────── */}
      <S.PreviewCoverPanel>
        {/* Double-buffered crossfade background layers */}
        <S.CoverBgLayer $url={layerA.url} $visible={showA} />
        <S.CoverBgLayer $url={layerB.url} $visible={!showA} />

        <S.PreviewCoverContent>
          <S.PreviewCoverLabel>{coverText.label}</S.PreviewCoverLabel>
          <S.PreviewCoverTitle>{coverText.title || itinerary.proposalTitle}</S.PreviewCoverTitle>
          {coverText.label === 'Itinerary' && (
            <S.PreviewCoverMeta>
              {itinerary.preparedFor && (
                <S.PreviewCoverMetaRow>
                  <span>Prepared for {itinerary.preparedFor}</span>
                </S.PreviewCoverMetaRow>
              )}
              {itinerary.travelDates && (
                <S.PreviewCoverMetaRow>
                  <span>{itinerary.travelDates}</span>
                </S.PreviewCoverMetaRow>
              )}
              {rows.length > 0 && (
                <S.PreviewCoverMetaRow>
                  <span>{rows.length} {rows.length === 1 ? 'day' : 'days'}</span>
                </S.PreviewCoverMetaRow>
              )}
            </S.PreviewCoverMeta>
          )}
        </S.PreviewCoverContent>
      </S.PreviewCoverPanel>

      {/* ── Scrollable content (col 3) ───────────────── */}
      <S.PreviewContent ref={contentRef}>

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
        {afterCover.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

        {/* ── BEFORE_DAY_BY_DAY info pages ─ */}
        {beforeDayByDay.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

        {/* ── Day-by-Day ─ */}
        <S.DayByDayBlock id="day-by-day" data-cover-id="day-by-day">
          <S.DayByDayHeader>
            <S.DayByDayHeading>Day-by-Day Itinerary</S.DayByDayHeading>
            {rows.length > 0 && (
              <S.DayByDayMeta>{rows.length} {rows.length === 1 ? 'day' : 'days'}</S.DayByDayMeta>
            )}
          </S.DayByDayHeader>

          <S.DaySections>
            {rows.length === 0 ? (
              <S.EmptyContent>No days added yet. Add days in the Day-by-Day tab.</S.EmptyContent>
            ) : (
              rows.map((row, i) => {
                const richActivities = <DayRichText json={row.activitiesRichText} />
                const richAccom = <DayRichText json={row.accommodationsRichText} />
                const hasActivityTags = row.activities.length > 0
                const hasAccomTags = row.accommodations.length > 0
                const hasAny = richActivities !== null || richAccom !== null || hasActivityTags || hasAccomTags

                return (
                  <S.DaySection key={row.id} id={`day-${row.id}`}>
                    <S.DayHeader>
                      <S.DayDate>{dayLabel(row, i)}</S.DayDate>
                      {row.areaPage && <S.DayArea>{row.areaPage.name}</S.DayArea>}
                    </S.DayHeader>

                    {hasAny ? (
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
                    ) : (
                      <S.EmptyDayText>No content added for this day.</S.EmptyDayText>
                    )}
                  </S.DaySection>
                )
              })
            )}
          </S.DaySections>
        </S.DayByDayBlock>

        {/* ── Tagged content pages (from day-by-day, in order of first appearance) ─ */}
        {taggedPages.map((cp) => <TaggedPage key={cp.id} cp={cp} />)}

        {/* ── Costs (Investment) ─ */}
        {hasCosts && costs && (
          <S.CostsBlock id="costs" data-cover-id="costs">
            <S.CostsHeading>Investment</S.CostsHeading>
            {costs.costsToBeDetetermined ? (
              <S.CostsCard>
                <S.CostsTBD>
                  Pricing information will be provided shortly — please contact your advisor.
                </S.CostsTBD>
              </S.CostsCard>
            ) : (
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
                  <CostsRich
                    text={costs.miscText}
                    Comp={S.CostsNotes}
                    style={{ fontStyle: 'italic' }}
                  />
                )}
              </S.CostsCard>
            )}
          </S.CostsBlock>
        )}

        {/* ── END info pages ─ */}
        {endSlots.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

      </S.PreviewContent>
    </S.PreviewLayout>
  )
}
