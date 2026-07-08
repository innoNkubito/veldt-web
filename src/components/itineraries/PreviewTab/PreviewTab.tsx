'use client'

import React, { useState } from 'react'
import {
  MapPin, Binoculars, Sun, BedDouble, Plane, Thermometer,
  Users, CalendarDays, Leaf, Camera, Star, Info,
} from 'lucide-react'
import { useBuilderStore, type ItineraryRow, type InfoPageRoom } from '@/stores/builderStore'
import { CONTENT_TYPE_CONFIG, type ContentType } from '@/lib/contentTypes'
import * as S from './PreviewTab.styled'

// ─────────────────────────────────────────────────────────────────
// pageContent types (mirrors PageContentTab's pageContent.types.ts)
// ─────────────────────────────────────────────────────────────────

interface TextImageSection {
  type: 'overview' | 'experience'
  text1: string
  images: string[]
  text2: string
}
interface FastFactsGroup { label: string; items: string[] }
interface FastFactsSection { type: 'fastFacts'; groups: FastFactsGroup[] }
interface AccommodationSection { type: 'accommodation'; intro: string }
interface GallerySection { type: 'gallery'; images: string[] }
type ContentSection = TextImageSection | FastFactsSection | AccommodationSection | GallerySection
interface PageContent { sections: ContentSection[] }

function parsePageContent(raw: unknown): PageContent | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const pc = raw as PageContent
    if (Array.isArray(pc.sections) && pc.sections.length > 0) return pc
  }
  return null
}

// ─────────────────────────────────────────────────────────────────
// Section title / icon helpers
// ─────────────────────────────────────────────────────────────────

function sectionTitle(type: string) {
  switch (type) {
    case 'overview':      return 'Property Overview'
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

function TextImageView({ section, pageId }: { section: TextImageSection; pageId: string }) {
  return (
    <S.ContentSection id={`${pageId}-${section.type}`}>
      <S.ContentSectionTitle>{sectionTitle(section.type)}</S.ContentSectionTitle>
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
}: {
  content: PageContent
  rooms: InfoPageRoom[]
  pageId: string
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
          // Gallery: render as a simple photo grid in preview (no download UI)
          const gs = section as GallerySection
          if (gs.images.length === 0) return null
          return (
            <S.ContentSection key={i} id={`${pageId}-gallery`}>
              <S.ContentSectionTitle>{sectionTitle('gallery')}</S.ContentSectionTitle>
              <PhotoSlider images={gs.images} />
            </S.ContentSection>
          )
        }
        return <TextImageView key={i} section={section as TextImageSection} pageId={pageId} />
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// ProseMirror JSON → React renderer (for day rich text)
// ─────────────────────────────────────────────────────────────────

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

const SLOT_LABELS: Record<SlotKey, string> = {
  AFTER_COVER:       'After Cover',
  BEFORE_DAY_BY_DAY: 'Before Day-by-Day',
  END:               'End',
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────

export default function PreviewTab() {
  const itinerary = useBuilderStore((s) => s.itinerary)
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

  // ── Render an info page block ──────────────────────────────────
  function InfoPage({ slot }: { slot: typeof afterCover[number] }) {
    const { contentPage } = slot
    const content = parsePageContent(contentPage.pageContent)
    const typeCfg = CONTENT_TYPE_CONFIG[contentPage.type as ContentType]

    return (
      <S.InfoPageBlock id={`infoslot-${slot.id}`}>
        <S.InfoPageCover $url={contentPage.coverImageUrl ?? undefined}>
          <S.InfoPageCoverContent>
            {typeCfg && <S.InfoPageCoverType>{typeCfg.label}</S.InfoPageCoverType>}
            <S.InfoPageCoverTitle>{contentPage.name}</S.InfoPageCoverTitle>
          </S.InfoPageCoverContent>
        </S.InfoPageCover>

        {content && (
          <S.InfoPageBody>
            <ContentSections
              content={content}
              rooms={contentPage.rooms}
              pageId={slot.id}
            />
          </S.InfoPageBody>
        )}
      </S.InfoPageBlock>
    )
  }

  // ── ToC entries ───────────────────────────────────────────────
  const tocSlots = SLOT_ORDER.flatMap((slotKey) => slotMap(slotKey))
  const hasDays = rows.length > 0

  return (
    <S.PreviewLayout>
      {/* ── Table of Contents ──────────────────────────── */}
      <S.PreviewToC>
        <S.ToCTitle>Contents</S.ToCTitle>

        {/* Slots before day-by-day */}
        {(['AFTER_COVER', 'BEFORE_DAY_BY_DAY'] as SlotKey[]).map((slotKey) => {
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

      {/* ── Itinerary content ─────────────────────────── */}
      <S.PreviewContent>

        {/* ── Itinerary cover ─ */}
        <S.PreviewCover>
          <S.PreviewCoverLabel>Itinerary</S.PreviewCoverLabel>
          <S.PreviewCoverTitle>{itinerary.proposalTitle}</S.PreviewCoverTitle>
          <S.PreviewCoverMeta>
            {itinerary.preparedFor && <span>Prepared for {itinerary.preparedFor}</span>}
            {itinerary.preparedFor && itinerary.travelDates && <S.PreviewCoverDot />}
            {itinerary.travelDates && <span>{itinerary.travelDates}</span>}
            {rows.length > 0 && (
              <>
                <S.PreviewCoverDot />
                <span>{rows.length} {rows.length === 1 ? 'day' : 'days'}</span>
              </>
            )}
          </S.PreviewCoverMeta>
        </S.PreviewCover>

        {/* ── AFTER_COVER info pages ─ */}
        {afterCover.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

        {/* ── BEFORE_DAY_BY_DAY info pages ─ */}
        {beforeDayByDay.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

        {/* ── Day-by-Day ─ */}
        <S.DayByDayBlock id="day-by-day">
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

        {/* ── END info pages ─ */}
        {endSlots.map((slot) => <InfoPage key={slot.id} slot={slot} />)}

      </S.PreviewContent>
    </S.PreviewLayout>
  )
}
