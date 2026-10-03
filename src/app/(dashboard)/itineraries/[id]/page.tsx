'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useBuilderStore } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { T } from '@/lib/theme'
import { STATUS_META } from '@/lib/itinerary-constants'
import ItineraryStatusBadge from '@/components/itineraries/ItineraryStatusBadge'
import OverviewTab from '@/components/itineraries/OverviewTab'
import RowsTab from '@/components/itineraries/RowsTab'
import CostsTab from '@/components/itineraries/CostsTab'
import BookingTab from '@/components/itineraries/BookingTab'
import PreviewTab from '@/components/itineraries/PreviewTab'
import TripTab from '@/components/itineraries/TripTab'
import PublishModal from '@/components/itineraries/PublishModal'
import ConfirmTripModal from '@/components/itineraries/ConfirmTripModal'
import { confirmDialog } from '@/stores/confirmStore'
import type { TripDetailsInput } from '@/stores/builderStore'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type BuilderTab = 'overview' | 'trip' | 'rows' | 'costs' | 'booking' | 'preview'

const TABS: { key: BuilderTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'trip', label: 'Trip' },
  { key: 'rows', label: 'Day-by-Day' },
  { key: 'costs', label: 'Costs' },
  { key: 'booking', label: 'Booking' },
  { key: 'preview', label: 'Preview' },
]

export default function ItineraryBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const id = routeParam(params?.id)

  const client = useClientStore((s) => s.client)
  const {
    itinerary,
    loading,
    error,
    saving,
    fetchItinerary,
    publishItinerary,
    setItineraryStatus,
    restoreItinerary,
  } = useBuilderStore()

  const [activeTab, setActiveTab] = useState<BuilderTab>('overview')
  const [showPublish, setShowPublish] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [showConfirmTrip, setShowConfirmTrip] = useState(false)

  useEffect(() => {
    if (client && id) fetchItinerary(id)
  }, [client, id])

  async function handlePublish() {
    if (!itinerary) return
    setPublishing(true)
    const err = await publishItinerary(itinerary.id)
    setPublishing(false)
    if (err) {
      setPublishError(err.replace('VALIDATION: ', ''))
      setShowPublish(false)
    } else {
      setShowPublish(false)
      setPublishError(null)
    }
  }

  async function handleConfirmTrip(trip: TripDetailsInput) {
    if (!itinerary) return null
    const err = await setItineraryStatus(itinerary.id, 'CONFIRMED', trip)
    if (!err) {
      setShowConfirmTrip(false)
      setPublishError(null)
    }
    return err
  }

  async function handleUndoConfirm() {
    if (!itinerary) return
    const ok = await confirmDialog({
      title: 'Undo confirmation?',
      message:
        'The trip goes back to being a published proposal. The traveller details and dates are kept.',
      confirmLabel: 'Undo Confirmation',
    })
    if (!ok) return
    setPublishError(await setItineraryStatus(itinerary.id, 'PUBLISHED'))
  }

  async function handleArchive() {
    if (!itinerary) return
    const ok = await confirmDialog({
      title: 'Archive this itinerary?',
      message:
        'It leaves the working list and its share link stops working. You can restore it from the Archived tab.',
      confirmLabel: 'Archive',
      danger: true,
    })
    if (!ok) return
    setPublishError(await setItineraryStatus(itinerary.id, 'ARCHIVED'))
  }

  async function handleStartTrip() {
    if (!itinerary) return
    const ok = await confirmDialog({
      title: 'Start this trip?',
      message:
        'The share link becomes the traveller\u2019s travel dashboard: confirmed flights, where they stay each night and who to contact.',
      confirmLabel: 'Start Trip',
    })
    if (!ok) return
    setPublishError(await setItineraryStatus(itinerary.id, 'TRAVELLING'))
  }

  async function handleCompleteTrip() {
    if (!itinerary) return
    const ok = await confirmDialog({
      title: 'Mark this trip complete?',
      message: 'The travel dashboard stays available to the traveller, read-only.',
      confirmLabel: 'Complete Trip',
    })
    if (!ok) return
    setPublishError(await setItineraryStatus(itinerary.id, 'COMPLETED'))
  }

  async function handleRestore() {
    if (!itinerary) return
    setPublishError(await restoreItinerary(itinerary.id))
  }

  const statusMeta = STATUS_META[itinerary?.status ?? ''] ?? { color: T.muted, bg: T.dim }
  const isDraft = itinerary?.status === 'DRAFT'
  const isArchived = itinerary?.status === 'ARCHIVED'
  // The trip is run from CONFIRMED on; before that it is still a proposal.
  const showTrip =
    itinerary?.status === 'CONFIRMED' ||
    itinerary?.status === 'TRAVELLING' ||
    itinerary?.status === 'COMPLETED'
  const visibleTabs = TABS.filter((t) => t.key !== 'trip' || showTrip)
  // Undoing a confirmation hides the tab; fall back rather than render nothing.
  const currentTab: BuilderTab = activeTab === 'trip' && !showTrip ? 'overview' : activeTab
  const canArchive = !!itinerary && !isDraft && !isArchived

  if (loading) {
    return (
      <S.CenteredState>
        <div>Loading itinerary…</div>
      </S.CenteredState>
    )
  }

  if (error || (!loading && !itinerary)) {
    return (
      <S.CenteredState>
        <div>{error ?? 'Itinerary not found'}</div>
        <ActionButton onClick={() => router.push('/itineraries')}>← Back to Itineraries</ActionButton>
      </S.CenteredState>
    )
  }

  return (
    <S.PageRoot>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.Header>
        <S.HeaderLeft>
          <S.BackLink onClick={() => router.push('/itineraries')}>← Itineraries</S.BackLink>
          <S.TitleRow>
            <S.PageTitle>{itinerary?.proposalTitle}</S.PageTitle>
            {itinerary?.status && <ItineraryStatusBadge status={itinerary.status} />}
          </S.TitleRow>
          <S.HeaderMeta>
            {itinerary?.preparedFor && <span>For {itinerary.preparedFor}</span>}
            {itinerary?.preparedFor && itinerary?.travelDates && <S.MetaDot />}
            {itinerary?.travelDates && <span>{itinerary.travelDates}</span>}
            {itinerary && <S.MetaDot />}
            <span>{itinerary?.rows.length ?? 0} days · {itinerary?.viewCount ?? 0} views</span>
          </S.HeaderMeta>
        </S.HeaderLeft>

        <S.HeaderActions>
          {saving && <S.SaveIndicator>Saving…</S.SaveIndicator>}
          {!isDraft && !isArchived && (
            <ActionButton
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.origin}/view/${itinerary?.slug}`)
              }
            >
              Copy Share Link
            </ActionButton>
          )}
          {isDraft && (
            <ActionButton $variant="primary" onClick={() => setShowPublish(true)}>
              Publish
            </ActionButton>
          )}
          {canArchive && (
            <ActionButton onClick={handleArchive} disabled={saving}>
              Archive
            </ActionButton>
          )}
          {itinerary?.status === 'CONFIRMED' && (
            <ActionButton onClick={handleUndoConfirm} disabled={saving}>
              Undo Confirmation
            </ActionButton>
          )}
          {itinerary?.status === 'CONFIRMED' && (
            <ActionButton $variant="primary" onClick={handleStartTrip} disabled={saving}>
              Start Trip
            </ActionButton>
          )}
          {itinerary?.status === 'TRAVELLING' && (
            <ActionButton $variant="primary" onClick={handleCompleteTrip} disabled={saving}>
              Complete Trip
            </ActionButton>
          )}
          {itinerary?.status === 'PUBLISHED' && (
            <ActionButton $variant="primary" onClick={() => setShowConfirmTrip(true)}>
              Mark Confirmed
            </ActionButton>
          )}
          {isArchived && (
            <ActionButton $variant="primary" onClick={handleRestore} disabled={saving}>
              Restore
            </ActionButton>
          )}
        </S.HeaderActions>
      </S.Header>

      {/* ── Publish error ───────────────────────────────────── */}
      {publishError && (
        <S.ErrorBanner>
          {publishError}{' '}
          <button
            style={{
              marginLeft: 8,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: T.danger,
            }}
            onClick={() => setPublishError(null)}
          >
            Dismiss
          </button>
        </S.ErrorBanner>
      )}

      {/* ── Tabs ────────────────────────────────────────────── */}
      <S.TabBar>
        {visibleTabs.map(({ key, label }) => (
          <S.Tab key={key} $active={currentTab === key} onClick={() => setActiveTab(key)}>
            {label}
          </S.Tab>
        ))}
      </S.TabBar>

      {/* ── Tab panels ──────────────────────────────────────── */}
      {currentTab === 'overview' && <OverviewTab />}
      {currentTab === 'trip' && <TripTab />}
      {currentTab === 'rows' && <RowsTab />}
      {currentTab === 'costs' && <CostsTab />}
      {currentTab === 'booking' && <BookingTab />}
      {currentTab === 'preview' && <PreviewTab />}

      {/* ── Publish modal ────────────────────────────────────── */}
      {showPublish && (
        <PublishModal
          onConfirm={handlePublish}
          onCancel={() => setShowPublish(false)}
          loading={publishing}
        />
      )}

      {/* ── Confirm trip modal ───────────────────────────────── */}
      {showConfirmTrip && itinerary && (
        <ConfirmTripModal
          itinerary={itinerary}
          onSubmit={handleConfirmTrip}
          onCancel={() => setShowConfirmTrip(false)}
        />
      )}
    </S.PageRoot>
  )
}
