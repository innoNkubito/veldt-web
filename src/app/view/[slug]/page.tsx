'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { GraphQLClient, gql } from 'graphql-request'
import * as S from './page.styled'

// ── Types ──────────────────────────────────────────────────────

interface PublicItinerary {
  id: string
  proposalTitle: string
  preparedFor: string | null
  travelDates: string | null
  whiteLabel: boolean
  slug: string
  rows: {
    id: string
    position: number
    dateLabel: string | null
    numNights: number | null
    transfersText: string | null
    accommodations: {
      id: string
      position: number
      contentPage: { id: string; title: string }
      room: { id: string; name: string } | null
      areaPage: { id: string; title: string } | null
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
      id
      proposalTitle
      preparedFor
      travelDates
      whiteLabel
      slug
      rows {
        id position dateLabel numNights transfersText
        accommodations {
          id position
          contentPage { id title }
          room { id name }
          areaPage { id title }
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

// ── Currency formatter ─────────────────────────────────────────

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
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

      {costs.notesVisible && costs.costNotes && (
        <S.CostsNotes>{costs.costNotes}</S.CostsNotes>
      )}

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

    // Unauthenticated client — public query
    const client = new GraphQLClient(apiUrl)

    async function load() {
      try {
        const data = await client.request<{ itineraryBySlug: PublicItinerary | null }>(
          GET_BY_SLUG,
          { slug },
        )

        if (!data.itineraryBySlug) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setItinerary(data.itineraryBySlug)
        setLoading(false)

        // Fire-and-forget view recording
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
          <S.CenteredState>
            <div>Loading your itinerary…</div>
          </S.CenteredState>
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

  const hasCosts =
    itinerary.costs &&
    (itinerary.costs.costsToBeDetetermined ||
      itinerary.costs.pricePerPerson != null ||
      itinerary.costs.costIncludes ||
      itinerary.costs.costExcludes)

  return (
    <S.PageRoot>
      <S.PageInner>
        {/* ── Hero ────────────────────────────────────────── */}
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

        {/* ── Day-by-day ──────────────────────────────────── */}
        {itinerary.rows.length > 0 && (
          <S.Section>
            <S.SectionHeading>Your Journey</S.SectionHeading>
            <S.DayList>
              {itinerary.rows.map((row, i) => (
                <S.DayRow key={row.id} $last={i === itinerary.rows.length - 1}>
                  <S.DayLabelCol>
                    {row.dateLabel ? (
                      <S.DayLabel>{row.dateLabel}</S.DayLabel>
                    ) : (
                      <S.DayLabel>Day {i + 1}</S.DayLabel>
                    )}
                    {row.numNights != null && (
                      <S.NightsLabel>
                        {row.numNights} night{row.numNights !== 1 ? 's' : ''}
                      </S.NightsLabel>
                    )}
                  </S.DayLabelCol>

                  <S.DayContentCol>
                    {row.transfersText && (
                      <S.TransferLine>
                        <span>✈</span>
                        {row.transfersText}
                      </S.TransferLine>
                    )}

                    {row.accommodations.length > 0 && (
                      <S.AccommodationList>
                        {row.accommodations.map((acc) => (
                          <S.AccommodationCard key={acc.id}>
                            <S.AccommodationIcon>🏕</S.AccommodationIcon>
                            <div>
                              <S.AccommodationName>{acc.contentPage.title}</S.AccommodationName>
                              {(acc.room || acc.areaPage) && (
                                <S.AccommodationSub>
                                  {[acc.room?.name, acc.areaPage?.title]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </S.AccommodationSub>
                              )}
                            </div>
                          </S.AccommodationCard>
                        ))}
                      </S.AccommodationList>
                    )}

                    {!row.transfersText && row.accommodations.length === 0 && (
                      <div style={{ fontSize: 13, color: '#9E8E7A', fontStyle: 'italic' }}>
                        Details to follow
                      </div>
                    )}
                  </S.DayContentCol>
                </S.DayRow>
              ))}
            </S.DayList>
          </S.Section>
        )}

        {/* ── Costs ───────────────────────────────────────── */}
        {hasCosts && (
          <S.Section>
            <S.SectionHeading>Investment</S.SectionHeading>
            <CostsSection costs={itinerary.costs!} />
          </S.Section>
        )}

        {/* ── Footer ──────────────────────────────────────── */}
        {!itinerary.whiteLabel && (
          <S.Footer>
            Built with <S.FooterBrand>Veldt</S.FooterBrand> — the safari itinerary platform
          </S.Footer>
        )}
      </S.PageInner>
    </S.PageRoot>
  )
}
