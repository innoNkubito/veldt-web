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
import PreviewTab from '@/components/itineraries/PreviewTab'
import PublishModal from '@/components/itineraries/PublishModal'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import * as S from './page.styled'

type BuilderTab = 'overview' | 'rows' | 'costs' | 'preview'

const TABS: { key: BuilderTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'rows', label: 'Day-by-Day' },
  { key: 'costs', label: 'Costs' },
  { key: 'preview', label: 'Preview' },
]

export default function ItineraryBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const client = useClientStore((s) => s.client)
  const { itinerary, loading, error, saving, fetchItinerary, publishItinerary } = useBuilderStore()

  const [activeTab, setActiveTab] = useState<BuilderTab>('overview')
  const [showPublish, setShowPublish] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

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

  const statusMeta = STATUS_META[itinerary?.status ?? ''] ?? { color: T.muted, bg: T.dim }
  const isDraft = itinerary?.status === 'DRAFT'

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
          {itinerary?.status !== 'DRAFT' && (
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
          {itinerary?.status === 'PUBLISHED' && (
            <ActionButton $variant="primary" onClick={() => itinerary && publishItinerary(itinerary.id)}>
              Mark Confirmed
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
              color: '#DC2626',
            }}
            onClick={() => setPublishError(null)}
          >
            Dismiss
          </button>
        </S.ErrorBanner>
      )}

      {/* ── Tabs ────────────────────────────────────────────── */}
      <S.TabBar>
        {TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={activeTab === key} onClick={() => setActiveTab(key)}>
            {label}
          </S.Tab>
        ))}
      </S.TabBar>

      {/* ── Tab panels ──────────────────────────────────────── */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'rows' && <RowsTab />}
      {activeTab === 'costs' && <CostsTab />}
      {activeTab === 'preview' && <PreviewTab />}

      {/* ── Publish modal ────────────────────────────────────── */}
      {showPublish && (
        <PublishModal
          onConfirm={handlePublish}
          onCancel={() => setShowPublish(false)}
          loading={publishing}
        />
      )}
    </S.PageRoot>
  )
}
