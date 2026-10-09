'use client'

import { useRouter } from 'next/navigation'
import ItineraryStatusBadge from '@/components/itineraries/ItineraryStatusBadge'
import OverviewTab from '@/components/itineraries/OverviewTab'
import RowsTab from '@/components/itineraries/RowsTab'
import CostsTab from '@/components/itineraries/CostsTab'
import BookingTab from '@/components/itineraries/BookingTab'
import PreviewTab from '@/components/itineraries/PreviewTab'
import TripTab from '@/components/itineraries/TripTab'
import PublishModal from '@/components/itineraries/PublishModal'
import ConfirmTripModal from '@/components/itineraries/ConfirmTripModal'
import StartTripModal from '@/components/itineraries/StartTripModal'
import TemplateDetailsModal from '@/components/itineraries/TemplateDetailsModal'
import UseTemplateModal from '@/components/itineraries/UseTemplateModal'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import * as S from './page.styled'
import { useItineraryBuilderPage } from './useItineraryBuilderPage'
import { COPY, ITINERARIES_PATH, TEMPLATES_PATH } from './page.constants'
import { headerStats, templateStats } from './page.utils'

export default function ItineraryBuilderPage() {
  const router = useRouter()
  const {
    itinerary, loading, error, saving, status, isTemplate, canSaveTemplate,
    saveTemplateModal, useTemplateModal,
    tabs, currentTab, setActiveTab, actionError, dismissError, copyShareLink,
    publishModal, confirmTripModal, startTripModal,
    undoConfirm, archive, completeTrip, restore,
  } = useItineraryBuilderPage()

  if (loading) {
    return (
      <S.CenteredState>
        <div>{COPY.loading}</div>
      </S.CenteredState>
    )
  }

  if (error || !itinerary) {
    return (
      <S.CenteredState>
        <div>{error ?? COPY.notFound}</div>
        <ActionButton onClick={() => router.push(ITINERARIES_PATH)}>{COPY.back}</ActionButton>
      </S.CenteredState>
    )
  }

  const isDraft = status === 'DRAFT'
  const isArchived = status === 'ARCHIVED'
  const backPath = isTemplate ? TEMPLATES_PATH : ITINERARIES_PATH

  return (
    <S.PageRoot>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.Header>
        <S.HeaderLeft>
          <S.BackLink onClick={() => router.push(backPath)}>
            {isTemplate ? COPY.templatesBackLink : COPY.backLink}
          </S.BackLink>
          <S.TitleRow>
            <S.PageTitle>
              {isTemplate ? (itinerary.templateName ?? itinerary.proposalTitle) : itinerary.proposalTitle}
            </S.PageTitle>
            {isTemplate ? (
              <S.TemplateBadge>{COPY.templateBadge}</S.TemplateBadge>
            ) : (
              <ItineraryStatusBadge status={itinerary.status} />
            )}
          </S.TitleRow>
          <S.HeaderMeta>
            {isTemplate ? (
              <span>{templateStats(itinerary.rows.length)}</span>
            ) : (
              <>
                {itinerary.preparedFor && <span>{COPY.forPrefix} {itinerary.preparedFor}</span>}
                {itinerary.preparedFor && itinerary.travelDates && <S.MetaDot />}
                {itinerary.travelDates && <span>{itinerary.travelDates}</span>}
                <S.MetaDot />
                <span>{headerStats(itinerary.rows.length, itinerary.viewCount)}</span>
              </>
            )}
          </S.HeaderMeta>
        </S.HeaderLeft>

        <S.HeaderActions>
          {saving && <S.SaveIndicator>{COPY.saving}</S.SaveIndicator>}
          {/* A template is never published or shared — it is only ever used. */}
          {isTemplate ? (
            <ActionButton $variant="primary" onClick={useTemplateModal.show}>
              {COPY.useTemplate}
            </ActionButton>
          ) : (
            <>
              {canSaveTemplate && (
                <ActionButton onClick={saveTemplateModal.show}>{COPY.saveAsTemplate}</ActionButton>
              )}
              {!isDraft && !isArchived && (
                <ActionButton onClick={copyShareLink}>{COPY.copyShareLink}</ActionButton>
              )}
              {isDraft && (
                <ActionButton $variant="primary" onClick={publishModal.show}>
                  {COPY.publish}
                </ActionButton>
              )}
              {!isDraft && !isArchived && (
                <ActionButton onClick={archive} disabled={saving}>
                  {COPY.archive}
                </ActionButton>
              )}
              {status === 'CONFIRMED' && (
                <ActionButton onClick={undoConfirm} disabled={saving}>
                  {COPY.undoConfirmation}
                </ActionButton>
              )}
              {status === 'CONFIRMED' && (
                <ActionButton $variant="primary" onClick={startTripModal.show} disabled={saving}>
                  {COPY.startTrip}
                </ActionButton>
              )}
              {status === 'TRAVELLING' && (
                <ActionButton $variant="primary" onClick={completeTrip} disabled={saving}>
                  {COPY.completeTrip}
                </ActionButton>
              )}
              {status === 'PUBLISHED' && (
                <ActionButton $variant="primary" onClick={confirmTripModal.show}>
                  {COPY.markConfirmed}
                </ActionButton>
              )}
              {isArchived && (
                <ActionButton $variant="primary" onClick={restore} disabled={saving}>
                  {COPY.restore}
                </ActionButton>
              )}
            </>
          )}
        </S.HeaderActions>
      </S.Header>

      {isTemplate && <S.TemplateBanner>{COPY.templateBanner}</S.TemplateBanner>}

      {/* ── Action error ────────────────────────────────────── */}
      {actionError && (
        <S.ErrorBanner>
          {actionError}{' '}
          <S.DismissButton onClick={dismissError}>{COPY.dismiss}</S.DismissButton>
        </S.ErrorBanner>
      )}

      {/* ── Tabs ────────────────────────────────────────────── */}
      <S.TabBar>
        {tabs.map(({ key, label }) => (
          <S.Tab key={key} $active={currentTab === key} onClick={() => setActiveTab(key)}>
            {label}
          </S.Tab>
        ))}
      </S.TabBar>

      {/* ── Tab panels (keyed so a different itinerary remounts their forms) ── */}
      {currentTab === 'overview' && <OverviewTab key={itinerary.id} />}
      {currentTab === 'trip' && <TripTab />}
      {currentTab === 'rows' && <RowsTab />}
      {currentTab === 'costs' && <CostsTab key={itinerary.id} />}
      {currentTab === 'booking' && <BookingTab />}
      {currentTab === 'preview' && <PreviewTab />}

      {/* ── Modals ───────────────────────────────────────────── */}
      {publishModal.open && (
        <PublishModal
          onConfirm={publishModal.publish}
          onCancel={publishModal.close}
          loading={publishModal.publishing}
        />
      )}
      {startTripModal.open && (
        <StartTripModal
          travellerEmail={itinerary.clientEmail}
          onConfirm={startTripModal.startTrip}
          onCancel={startTripModal.close}
        />
      )}
      {saveTemplateModal.open && (
        <TemplateDetailsModal
          mode="save"
          initial={{ name: itinerary.proposalTitle, description: null, tags: [] }}
          onClose={saveTemplateModal.close}
          onSubmit={saveTemplateModal.save}
        />
      )}
      {useTemplateModal.open && (
        <UseTemplateModal
          template={{
            id: itinerary.id,
            templateName: itinerary.templateName,
            proposalTitle: itinerary.proposalTitle,
            durationNights: itinerary.rows.reduce((sum, row) => sum + (row.numNights ?? 0), 0),
          }}
          onClose={useTemplateModal.close}
        />
      )}
      {confirmTripModal.open && (
        <ConfirmTripModal
          itinerary={itinerary}
          onSubmit={confirmTripModal.confirmTrip}
          onCancel={confirmTripModal.close}
        />
      )}
    </S.PageRoot>
  )
}
