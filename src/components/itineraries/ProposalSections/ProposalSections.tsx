'use client'

/**
 * The sections of a rendered proposal — cover page, content pages, day by
 * day and costs — shared by the public share page and the builder's Preview
 * tab. View only: copy is in .constants, derivations in .utils, the cover
 * panel's scroll tracking in useCoverCrossfade.
 */

import * as S from './ProposalSections.styled'
import { parsePageContent } from '@/lib/pageContent'
import {
  ContentSections,
  CostsRich,
  DayRichText,
  dayLabel,
  formatPrice,
} from '@/components/itineraries/ProposalBlocks'
import {
  COSTS_HEADING,
  COSTS_ID,
  COSTS_LABELS,
  COSTS_TBD_MESSAGE,
  COVER_INTRO,
  COVER_PAGE_ID,
  DAY_BY_DAY_HEADING,
  DAY_BY_DAY_ID,
  DAY_COLUMN_LABELS,
  GLANCE_LABELS,
  LIST_SEPARATOR,
  META_LABELS,
  MISC_NOTE_STYLE,
  PROPOSAL_PRETITLE,
} from './ProposalSections.constants'
import { dayId, hasGlance, pluralise, roomTagLabel, sortByPosition } from './ProposalSections.utils'
import type {
  ContentPageBlockProps,
  DayByDayProps,
  ProposalCostsProps,
  ProposalCoverPageProps,
} from './ProposalSections.types'

export function ProposalCoverPage({ itinerary, dayCount, glance }: ProposalCoverPageProps) {
  const glanceItems = [
    { label: GLANCE_LABELS.destinations, values: glance.destinations },
    { label: GLANCE_LABELS.stays, values: glance.stays },
    { label: GLANCE_LABELS.experiences, values: glance.experiences },
  ].filter((item) => item.values.length > 0)

  return (
    <S.CoverPageBlock id={COVER_PAGE_ID} data-cover-id={COVER_PAGE_ID}>
      <S.CoverPagePretitle>{PROPOSAL_PRETITLE}</S.CoverPagePretitle>
      <S.CoverPageTitle>{itinerary.proposalTitle}</S.CoverPageTitle>
      <S.CoverPageDivider />

      <S.CoverPageMetaList>
        {itinerary.preparedFor && (
          <S.CoverPageMetaRow>
            <S.CoverPageMetaLabel>{META_LABELS.preparedFor}</S.CoverPageMetaLabel>
            <S.CoverPageMetaValue>{itinerary.preparedFor}</S.CoverPageMetaValue>
          </S.CoverPageMetaRow>
        )}
        {itinerary.travelDates && (
          <S.CoverPageMetaRow>
            <S.CoverPageMetaLabel>{META_LABELS.travelDates}</S.CoverPageMetaLabel>
            <S.CoverPageMetaValue>{itinerary.travelDates}</S.CoverPageMetaValue>
          </S.CoverPageMetaRow>
        )}
        {dayCount > 0 && (
          <S.CoverPageMetaRow>
            <S.CoverPageMetaLabel>{META_LABELS.duration}</S.CoverPageMetaLabel>
            <S.CoverPageMetaValue>{pluralise(dayCount, 'day')}</S.CoverPageMetaValue>
          </S.CoverPageMetaRow>
        )}
      </S.CoverPageMetaList>

      <S.CoverPageIntro>{COVER_INTRO}</S.CoverPageIntro>

      {hasGlance(glance) && (
        <S.GlanceGrid>
          {glanceItems.map((item) => (
            <S.GlanceItem key={item.label}>
              <S.GlanceLabel>{item.label}</S.GlanceLabel>
              <S.GlanceValue>{item.values.join(LIST_SEPARATOR)}</S.GlanceValue>
            </S.GlanceItem>
          ))}
        </S.GlanceGrid>
      )}
    </S.CoverPageBlock>
  )
}

/** An info page or a row-tagged page, rendered in full. */
export function ContentPageBlock({ page, blockId, pageId }: ContentPageBlockProps) {
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
            pageId={pageId}
            contentType={page.type}
          />
        </S.InfoPageBody>
      )}
    </S.InfoPageBlock>
  )
}

export function DayByDay({ rows, emptyMessage }: DayByDayProps) {
  return (
    <S.DayByDayBlock id={DAY_BY_DAY_ID} data-cover-id={DAY_BY_DAY_ID}>
      <S.DayByDayHeader>
        <S.DayByDayHeading>{DAY_BY_DAY_HEADING}</S.DayByDayHeading>
        {rows.length > 0 && <S.DayByDayMeta>{pluralise(rows.length, 'day')}</S.DayByDayMeta>}
      </S.DayByDayHeader>

      <S.DaySections>
        {rows.length === 0 && emptyMessage && <S.EmptyContent>{emptyMessage}</S.EmptyContent>}
        {rows.map((row, i) => (
          <S.DaySection key={row.id} id={dayId(row.id)}>
            <S.DayHeader>
              <S.DayDate>{dayLabel(row, i)}</S.DayDate>
              {row.areaPage && <S.DayArea>{row.areaPage.name}</S.DayArea>}
            </S.DayHeader>

            <S.DayColumns>
              <S.DayColumn>
                <S.DayColumnLabel>{DAY_COLUMN_LABELS.activities}</S.DayColumnLabel>
                <DayRichText json={row.activitiesRichText} />
                {row.activities.length > 0 && (
                  <S.TagList>
                    {sortByPosition(row.activities).map((a) => (
                      <S.Tag key={a.id}>{a.contentPage.name}</S.Tag>
                    ))}
                  </S.TagList>
                )}
              </S.DayColumn>
              <S.DayColumn>
                <S.DayColumnLabel>{DAY_COLUMN_LABELS.accommodations}</S.DayColumnLabel>
                <DayRichText json={row.accommodationsRichText} />
                {row.accommodations.length > 0 && (
                  <S.TagList>
                    {sortByPosition(row.accommodations).map((a) => (
                      <S.Tag key={a.id}>{roomTagLabel(a)}</S.Tag>
                    ))}
                  </S.TagList>
                )}
              </S.DayColumn>
            </S.DayColumns>
          </S.DaySection>
        ))}
      </S.DaySections>
    </S.DayByDayBlock>
  )
}

/** The Investment section. Render only when `hasCosts(costs)`. */
export function ProposalCosts({ costs }: ProposalCostsProps) {
  return (
    <S.CostsBlock id={COSTS_ID} data-cover-id={COSTS_ID}>
      <S.CostsHeading>{COSTS_HEADING}</S.CostsHeading>
      <S.CostsCard>
        {costs.costsToBeDetetermined ? (
          <S.CostsTBD>{COSTS_TBD_MESSAGE}</S.CostsTBD>
        ) : (
          <>
            {costs.priceVisible && costs.pricePerPerson != null && (
              <S.CostsHeader>
                <S.CostsPriceRow>
                  <S.CostsPrice>{formatPrice(costs.pricePerPerson, costs.currency)}</S.CostsPrice>
                  <S.CostsPriceSub>{COSTS_LABELS.perPerson}</S.CostsPriceSub>
                </S.CostsPriceRow>
                <S.CostsMeta>
                  {pluralise(costs.numGuests, 'guest')}
                  {costs.accommodationType && ` · ${costs.accommodationType}`}
                </S.CostsMeta>
              </S.CostsHeader>
            )}
            {(costs.costIncludes || costs.costExcludes) && (
              <S.CostsBody>
                {costs.costIncludes && (
                  <S.CostsColumn>
                    <S.CostsColumnLabel>{COSTS_LABELS.included}</S.CostsColumnLabel>
                    <CostsRich text={costs.costIncludes} Comp={S.CostsText} />
                  </S.CostsColumn>
                )}
                {costs.costExcludes && (
                  <S.CostsColumn>
                    <S.CostsColumnLabel>{COSTS_LABELS.excludes}</S.CostsColumnLabel>
                    <CostsRich text={costs.costExcludes} Comp={S.CostsText} />
                  </S.CostsColumn>
                )}
              </S.CostsBody>
            )}
            {costs.notesVisible && costs.costNotes && (
              <CostsRich text={costs.costNotes} Comp={S.CostsNotes} />
            )}
            {costs.miscVisible && costs.miscText && (
              <CostsRich text={costs.miscText} Comp={S.CostsNotes} style={MISC_NOTE_STYLE} />
            )}
          </>
        )}
      </S.CostsCard>
    </S.CostsBlock>
  )
}
