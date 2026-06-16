'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GraphQLClient, gql } from 'graphql-request'
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
  country: string | null
  pageContent: unknown
  area: { id: string; name: string } | null
  rooms: Room[]
}

interface InfoPageSlot {
  id: string
  slot: string
  position: number
  contentPage: FullContentPage
}

interface PublicItinerary {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  whiteLabel: boolean
  slug: string
  infoPageSlots: InfoPageSlot[]
  rows: {
    id: string
    position: number
    dateLabel: string | null
    numNights: number | null
    transfersText: string | null
    areaPage: FullContentPage | null
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
  }[]
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

const GET_BY_SLUG = gql`
  query GetBySlug($slug: String!) {
    itineraryBySlug(slug: $slug) {
      id proposalTitle preparedFor travelDates whiteLabel slug
      infoPageSlots {
        id slot position
        contentPage { id name type coverImageUrl country pageContent area { id name } }
      }
      rows {
        id position dateLabel numNights transfersText
        areaPage { id name type coverImageUrl country pageContent area { id name } }
        activities {
          id position
          contentPage { id name type coverImageUrl country pageContent area { id name } }
        }
        accommodations {
          id position
          contentPage {
            id name type coverImageUrl country pageContent
            area { id name }
            rooms { id roomType description photos }
          }
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

// ── Content type helpers ────────────────────────────────────────

interface TextImageSection { type: string; text1: string; images: string[]; text2: string }
interface FastFactsGroup { label: string; items: string[] }
interface FastFactsSection { type: 'fastFacts'; groups: FastFactsGroup[] }
interface AccommodationSection { type: 'accommodation'; intro: string }
interface GallerySection { type: 'gallery'; images: string[] }
type AnySection = TextImageSection | FastFactsSection | AccommodationSection | GallerySection

function parsePropertySections(raw: unknown): AnySection[] | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const s = (raw as any).sections
    if (Array.isArray(s) && s.length > 0) return s
  }
  return null
}

function parseOverview(raw: unknown): TextImageSection | null {
  if (raw && typeof raw === 'object' && 'sections' in raw) {
    const sections = (raw as any).sections
    if (Array.isArray(sections) && sections[0]?.type === 'overview') {
      const s = sections[0] as TextImageSection
      if (s.text1 || s.text2 || s.images?.length > 0) return s
    }
  }
  return null
}

function sectionTitle(type: string) {
  switch (type) {
    case 'overview': return 'Overview'
    case 'experience': return 'Experience & Activities'
    case 'accommodation': return 'Accommodation'
    case 'fastFacts': return 'Fast Facts'
    case 'gallery': return 'Gallery'
    default: return type
  }
}

// ── Shared renderers ────────────────────────────────────────────

function PhotoSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  if (!images?.length) return null
  return (
    <S.DocSliderWrap>
      <S.DocSliderTrack $index={index}>
        {images.map((url, i) => <S.DocSliderSlide key={i} $url={url} />)}
      </S.DocSliderTrack>
      {images.length > 1 && (
        <>
          <S.DocSliderArrow $side="left" onClick={() => setIndex(i => i === 0 ? images.length - 1 : i - 1)}>‹</S.DocSliderArrow>
          <S.DocSliderArrow $side="right" onClick={() => setIndex(i => i === images.length - 1 ? 0 : i + 1)}>›</S.DocSliderArrow>
          <S.DocSliderDots>
            {images.map((_, i) => <S.DocSliderDot key={i} $active={i === index} onClick={() => setIndex(i)} />)}
          </S.DocSliderDots>
        </>
      )}
    </S.DocSliderWrap>
  )
}

function RichText({ html }: { html: string }) {
  if (!html) return null
  if (html.trimStart().startsWith('<')) {
    return <S.DocRichText dangerouslySetInnerHTML={{ __html: html }} />
  }
  return (
    <S.DocRichText>
      {html.split('\n').filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
    </S.DocRichText>
  )
}

function TextImageView({ section, title }: { section: TextImageSection; title?: string }) {
  return (
    <S.DocSection>
      {title && <S.DocSectionTitle>{title}</S.DocSectionTitle>}
      {section.text1 && <RichText html={section.text1} />}
      {section.images?.length > 0 && <PhotoSlider images={section.images} />}
      {section.text2 && <RichText html={section.text2} />}
    </S.DocSection>
  )
}

function FastFactsView({ section }: { section: FastFactsSection }) {
  const groups = section.groups?.filter(g => g.items?.some(Boolean)) ?? []
  if (!groups.length) return null
  return (
    <S.DocSection>
      <S.DocSectionTitle>Fast Facts</S.DocSectionTitle>
      <S.DocFactsGrid>
        {groups.map((group, i) => (
          <S.DocFactGroup key={i}>
            {group.label && <S.DocFactLabel>{group.label}</S.DocFactLabel>}
            <S.DocFactItems>
              {group.items.filter(Boolean).map((item, j) => (
                <S.DocFactItem key={j}>{item}</S.DocFactItem>
              ))}
            </S.DocFactItems>
          </S.DocFactGroup>
        ))}
      </S.DocFactsGrid>
    </S.DocSection>
  )
}

function GalleryView({ section }: { section: GallerySection }) {
  if (!section.images?.length) return null
  return (
    <S.DocSection>
      <S.DocSectionTitle>Gallery</S.DocSectionTitle>
      <S.DocGalleryGrid>
        {section.images.map((url, i) => (
          <S.DocGalleryCell key={i} $url={url} />
        ))}
      </S.DocGalleryGrid>
    </S.DocSection>
  )
}

function RoomsView({ rooms, intro }: { rooms: Room[]; intro?: string }) {
  if (!rooms?.length && !intro) return null
  return (
    <S.DocSection>
      <S.DocSectionTitle>Accommodation</S.DocSectionTitle>
      {intro && <RichText html={intro} />}
      {rooms?.map((room) => (
        <S.DocRoomBlock key={room.id}>
          <S.DocRoomHeading>{room.roomType}</S.DocRoomHeading>
          {room.description && <RichText html={room.description} />}
          {room.photos?.length > 0 && (
            room.photos.length >= 3
              ? <PhotoSlider images={room.photos} />
              : (
                <S.DocRoomPhotoGrid $count={room.photos.length}>
                  {room.photos.slice(0, 2).map((url, i) => (
                    <S.DocRoomPhoto key={i} $url={url} />
                  ))}
                </S.DocRoomPhotoGrid>
              )
          )}
        </S.DocRoomBlock>
      ))}
    </S.DocSection>
  )
}

// ── Page document blocks ────────────────────────────────────────

function PageCover({ page }: { page: FullContentPage }) {
  return (
    <S.DocCover $url={page.coverImageUrl ?? ''} $hasImage={!!page.coverImageUrl}>
      <S.DocCoverContent>
        {page.area?.name && <S.DocCoverSub>{page.area.name}</S.DocCoverSub>}
        <S.DocCoverTitle>{page.name}</S.DocCoverTitle>
        {page.country && <S.DocCoverMeta>{page.country}</S.DocCoverMeta>}
      </S.DocCoverContent>
    </S.DocCover>
  )
}

function PropertyPageDoc({ page }: { page: FullContentPage }) {
  const sections = parsePropertySections(page.pageContent)
  return (
    <S.DocPageBlock>
      <PageCover page={page} />
      <S.DocPageBody>
        {sections?.map((section, i) => {
          if (section.type === 'fastFacts') return <FastFactsView key={i} section={section as FastFactsSection} />
          if (section.type === 'gallery') return <GalleryView key={i} section={section as GallerySection} />
          if (section.type === 'accommodation') {
            return <RoomsView key={i} rooms={page.rooms ?? []} intro={(section as AccommodationSection).intro} />
          }
          return <TextImageView key={i} section={section as TextImageSection} title={sectionTitle(section.type)} />
        })}
      </S.DocPageBody>
    </S.DocPageBlock>
  )
}

function SimplePageDoc({ page }: { page: FullContentPage }) {
  const overview = parseOverview(page.pageContent)
  return (
    <S.DocPageBlock>
      <PageCover page={page} />
      <S.DocPageBody>
        {overview && <TextImageView section={overview} />}
      </S.DocPageBody>
    </S.DocPageBlock>
  )
}

function ContentPageDoc({ page }: { page: FullContentPage }) {
  if (!page) return null
  if (page.type === 'PROPERTY') return <PropertyPageDoc page={page} />
  return <SimplePageDoc page={page} />
}

// ── Currency formatter ─────────────────────────────────────────

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

// ── Costs section ──────────────────────────────────────────────

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
              <S.CostsText>{costs.costIncludes}</S.CostsText>
            </S.CostsColumn>
          )}
          {costs.costExcludes && (
            <S.CostsColumn>
              <S.CostsColumnLabel>Excludes</S.CostsColumnLabel>
              <S.CostsText>{costs.costExcludes}</S.CostsText>
            </S.CostsColumn>
          )}
        </S.CostsBody>
      )}
      {costs.notesVisible && costs.costNotes && <S.CostsNotes>{costs.costNotes}</S.CostsNotes>}
      {costs.miscVisible && costs.miscText && (
        <S.CostsNotes style={{ borderTop: '1px solid #EDE6D6', fontStyle: 'italic' }}>
          {costs.miscText}
        </S.CostsNotes>
      )}
    </S.CostsCard>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function SharePage() {
  const params = useParams()
  const slug = params?.slug as string

  const [itinerary, setItinerary] = useState<PublicItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  if (loading) {
    return (
      <S.PageRoot>
        <S.PageInner>
          <S.CenteredState><div>Loading your itinerary…</div></S.CenteredState>
        </S.PageInner>
      </S.PageRoot>
    )
  }

  if (notFound || !itinerary) {
    return (
      <S.PageRoot>
        <S.PageInner>
          <S.CenteredState>
            <S.NotFoundTitle>Itinerary not found</S.NotFoundTitle>
            <div>This link may have expired or the itinerary is no longer published.</div>
          </S.CenteredState>
        </S.PageInner>
      </S.PageRoot>
    )
  }

  const hasCosts = itinerary.costs && (
    itinerary.costs.costsToBeDetetermined ||
    itinerary.costs.pricePerPerson != null ||
    itinerary.costs.costIncludes ||
    itinerary.costs.costExcludes
  )

  const slotsAfterCover = itinerary.infoPageSlots.filter(s => s.slot === 'AFTER_COVER').sort((a, b) => a.position - b.position)
  const slotsBeforeDayByDay = itinerary.infoPageSlots.filter(s => s.slot === 'BEFORE_DAY_BY_DAY').sort((a, b) => a.position - b.position)
  const slotsEnd = itinerary.infoPageSlots.filter(s => s.slot === 'END').sort((a, b) => a.position - b.position)

  return (
    <S.PageRoot>
      <S.PageInner>

        {/* ── Hero ──────────────────────────────────────────── */}
        <S.HeroSection>
          <S.HeroPretitle>Your Veldt Itinerary</S.HeroPretitle>
          <S.HeroTitle>{itinerary.proposalTitle}</S.HeroTitle>
          <S.HeroMeta>
            {itinerary.preparedFor && (
              <S.HeroMetaItem>
                <S.MetaLabel>Prepared for</S.MetaLabel>
                {itinerary.preparedFor}
              </S.HeroMetaItem>
            )}
            {itinerary.travelDates && (
              <S.HeroMetaItem>
                <S.MetaLabel>Travel dates</S.MetaLabel>
                {itinerary.travelDates}
              </S.HeroMetaItem>
            )}
            {itinerary.rows.length > 0 && (
              <S.HeroMetaItem>
                <S.MetaLabel>Duration</S.MetaLabel>
                {itinerary.rows.length} day{itinerary.rows.length !== 1 ? 's' : ''}
              </S.HeroMetaItem>
            )}
          </S.HeroMeta>
        </S.HeroSection>

        {/* ── Info pages: After Cover ───────────────────────── */}
        {slotsAfterCover.map(slot => (
          <ContentPageDoc key={slot.id} page={slot.contentPage} />
        ))}

        {/* ── Info pages: Before Day-by-Day ────────────────── */}
        {slotsBeforeDayByDay.map(slot => (
          <ContentPageDoc key={slot.id} page={slot.contentPage} />
        ))}

        {/* ── Journey ───────────────────────────────────────── */}
        {itinerary.rows.length > 0 && (
          <>
            <S.DocJourneyHeading>Your Journey</S.DocJourneyHeading>
            {itinerary.rows.map((row, i) => (
              <div key={row.id}>
                <S.DocDayHeader>
                  <S.DocDayLabel>{row.dateLabel ?? `Day ${i + 1}`}</S.DocDayLabel>
                  {row.numNights != null && (
                    <S.DocNightsLabel>{row.numNights} night{row.numNights !== 1 ? 's' : ''}</S.DocNightsLabel>
                  )}
                </S.DocDayHeader>

                {row.transfersText && (
                  <S.DocTransferNote>
                    <span>✈</span> {row.transfersText}
                  </S.DocTransferNote>
                )}

                {row.areaPage && <ContentPageDoc page={row.areaPage} />}

                {row.accommodations.map(acc => (
                  <ContentPageDoc key={acc.id} page={acc.contentPage} />
                ))}

                {row.activities
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map(act => (
                    <ContentPageDoc key={act.id} page={act.contentPage} />
                  ))}
              </div>
            ))}
          </>
        )}

        {/* ── Costs ─────────────────────────────────────────── */}
        {hasCosts && (
          <S.Section>
            <S.SectionHeading>Investment</S.SectionHeading>
            <CostsSection costs={itinerary.costs!} />
          </S.Section>
        )}

        {/* ── Info pages: End ───────────────────────────────── */}
        {slotsEnd.map(slot => (
          <ContentPageDoc key={slot.id} page={slot.contentPage} />
        ))}

        {/* ── Footer ────────────────────────────────────────── */}
        {!itinerary.whiteLabel && (
          <S.Footer>
            Built with <S.FooterBrand>Veldt</S.FooterBrand> — the safari itinerary platform
          </S.Footer>
        )}

      </S.PageInner>
    </S.PageRoot>
  )
}
