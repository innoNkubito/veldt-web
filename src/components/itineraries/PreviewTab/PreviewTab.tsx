'use client'

import * as S from './PreviewTab.styled'
import {
  ContentPageBlock,
  DEFAULT_COVER_LABEL,
  META_LABELS,
  DayByDay,
  ProposalCosts,
  ProposalCoverPage,
  infoSlotId,
  pluralise,
  taggedId,
} from '@/components/itineraries/ProposalSections'
import OperatorMark, { OperatorBrandProvider } from '@/components/itineraries/OperatorMark'
import { usePreviewTab } from './usePreviewTab'
import { scrollToSection } from './PreviewTab.utils'
import { NO_DAYS_MESSAGE, TOC_TITLE } from './PreviewTab.constants'

/** The proposal as the client will see it, rendered live from the builder. */
export default function PreviewTab() {
  const { itinerary, view, contentRef, layerA, layerB, showA, cover } = usePreviewTab()
  if (!itinerary || !view) return null

  return (
    <OperatorBrandProvider value={itinerary.brand}>
      <S.PreviewLayout>
        <S.PreviewToC>
          <S.ToCTitle>{TOC_TITLE}</S.ToCTitle>
          {view.toc.map((group) => (
            <S.ToCGroup key={group.key}>
              {group.label && <S.ToCGroupLabel>{group.label}</S.ToCGroupLabel>}
              {group.entries.map((entry) => (
                <S.ToCItem
                  key={entry.targetId}
                  href={`#${entry.targetId}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(entry.targetId)
                  }}
                >
                  {entry.dayNumber != null && <S.ToCDayNum>{entry.dayNumber}</S.ToCDayNum>}
                  {entry.label}
                </S.ToCItem>
              ))}
            </S.ToCGroup>
          ))}
        </S.PreviewToC>

        <S.PreviewCoverPanel>
          <S.CoverBgLayer $url={layerA.url} $visible={showA} />
          <S.CoverBgLayer $url={layerB.url} $visible={!showA} />
          <OperatorMark brand={itinerary.brand} variant="cover" />
          <S.PreviewCoverContent>
            <S.PreviewCoverLabel>{cover.label}</S.PreviewCoverLabel>
            <S.PreviewCoverTitle>{cover.title || itinerary.proposalTitle}</S.PreviewCoverTitle>
            {cover.label === DEFAULT_COVER_LABEL && (
              <S.PreviewCoverMeta>
                {itinerary.preparedFor && (
                  <S.PreviewCoverMetaRow><span>{META_LABELS.preparedFor} {itinerary.preparedFor}</span></S.PreviewCoverMetaRow>
                )}
                {itinerary.travelDates && (
                  <S.PreviewCoverMetaRow><span>{itinerary.travelDates}</span></S.PreviewCoverMetaRow>
                )}
                {view.rows.length > 0 && (
                  <S.PreviewCoverMetaRow><span>{pluralise(view.rows.length, 'day')}</span></S.PreviewCoverMetaRow>
                )}
              </S.PreviewCoverMeta>
            )}
          </S.PreviewCoverContent>
        </S.PreviewCoverPanel>

        <S.PreviewContent ref={contentRef}>
          <ProposalCoverPage itinerary={itinerary} dayCount={view.rows.length} glance={view.glance} />
          {[...view.afterCover, ...view.beforeDayByDay].map((slot) => (
            <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={infoSlotId(slot.id)} pageId={slot.id} />
          ))}
          <DayByDay rows={view.rows} emptyMessage={NO_DAYS_MESSAGE} />
          {view.taggedPages.map((cp) => (
            <ContentPageBlock key={cp.id} page={cp} blockId={taggedId(cp.id)} pageId={cp.id} />
          ))}
          {view.costs && <ProposalCosts costs={view.costs} />}
          {view.endSlots.map((slot) => (
            <ContentPageBlock key={slot.id} page={slot.contentPage} blockId={infoSlotId(slot.id)} pageId={slot.id} />
          ))}
          <S.OperatorFooter>
            <OperatorMark brand={itinerary.brand} variant="inline" />
          </S.OperatorFooter>
        </S.PreviewContent>
      </S.PreviewLayout>
    </OperatorBrandProvider>
  )
}
