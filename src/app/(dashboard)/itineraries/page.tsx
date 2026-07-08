'use client'

import { Suspense, useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useItineraryStore, ItineraryListItem } from '@/stores/itineraryStore'
import { useClientStore } from '@/stores/clientStore'
import { T } from '@/lib/theme'
import { STATUS_TABS, StatusTab } from '@/lib/itinerary-constants'
import ItineraryStatusBadge from '@/components/itineraries/ItineraryStatusBadge'
import CreateItineraryModal from '@/components/itineraries/CreateItineraryModal'
import ItineraryRowMenu from '@/components/itineraries/ItineraryRowMenu'
import ItineraryEmptyState from '@/components/itineraries/ItineraryEmptyState'
import { Box } from '@mui/material'
import * as S from './page.styled'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function advisorName(assignedTo: ItineraryListItem['assignedTo']) {
  if (!assignedTo) return '—'
  return `${assignedTo.firstName ?? ''} ${assignedTo.lastName ?? ''}`.trim() || '—'
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: string
  sortField: string
  sortDir: 'asc' | 'desc'
}) {
  return (
    <S.SortIndicator $active={sortField === field}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </S.SortIndicator>
  )
}

function ItinerariesPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const client = useClientStore((s) => s.client)
  const { itineraries, loading, error, fetchItineraries, createItinerary, deleteItinerary, duplicateItinerary } =
    useItineraryStore()

  const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(() => searchParams.get('create') === '1')
  const [sortField, setSortField] = useState<'proposalTitle' | 'createdAt' | 'travelDates'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  useEffect(() => {
    if (client) fetchItineraries(activeTab === 'ALL' ? undefined : activeTab)
  }, [client, activeTab])

  const displayed = useMemo(() => {
    let list = [...itineraries]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (i) =>
          i.proposalTitle.toLowerCase().includes(q) ||
          i.preparedFor?.toLowerCase().includes(q) ||
          i.travelDates?.toLowerCase().includes(q),
      )
    }
    list.sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : av > bv ? -1 : 1
    })
    return list
  }, [itineraries, searchQuery, sortField, sortDir])

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: itineraries.length }
    itineraries.forEach((i) => { c[i.status] = (c[i.status] ?? 0) + 1 })
    return c
  }, [itineraries])

  function handleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  async function handleCreate(data: { proposalTitle: string; preparedFor: string; travelDates: string }) {
    const result = await createItinerary(data)
    if (result) { setShowCreate(false); router.push(`/itineraries/${result.id}`) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this itinerary? This cannot be undone.')) return
    await deleteItinerary(id)
  }

  const cols = [
    { label: 'Itinerary', field: 'proposalTitle' as const },
    { label: 'Assigned To', field: null },
    { label: 'Travel Dates', field: 'travelDates' as const },
    { label: 'Created', field: 'createdAt' as const },
    { label: 'Status', field: null },
    { label: 'Actions', field: null },
  ]

  return (
    <Box sx={{ padding: '2rem' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.PageHeaderRow>
        <div>
          <S.BackLink onClick={() => router.push('/dashboard')}>← Dashboard</S.BackLink>
          <S.PageTitle>Itineraries</S.PageTitle>
          <S.PageSubtitle>
            {counts.ALL ?? 0} total · {counts.CONFIRMED ?? 0} confirmed ·{' '}
            {counts.PUBLISHED ?? 0} published
          </S.PageSubtitle>
        </div>
        <S.HeaderControls>
          <S.SearchWrapper>
            <S.SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search itineraries..."
            />
            <S.SearchIconWrap width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </S.SearchIconWrap>
          </S.SearchWrapper>
          <S.CreateButton onClick={() => setShowCreate(true)}>
            <S.CreateButtonPlus>+</S.CreateButtonPlus>
            New Itinerary
          </S.CreateButton>
        </S.HeaderControls>
      </S.PageHeaderRow>

      {/* ── Status tabs ─────────────────────────────────────── */}
      <S.TabBar>
        {STATUS_TABS.map(({ key, label }) => {
          const active = activeTab === key
          const count = counts[key] ?? 0
          return (
            <S.Tab key={key} $active={active} onClick={() => setActiveTab(key)}>
              {label}
              {count > 0 && <S.TabCount $active={active}>{count}</S.TabCount>}
            </S.Tab>
          )
        })}
      </S.TabBar>

      {/* ── Table ────────────────────────────────────────────── */}
      <S.TableWrapper>
        {displayed.length > 0 && (
          <S.TableHead>
            {cols.map(({ label, field }) => (
              <S.TableHeadCell
                key={label}
                $sortable={!!field}
                onClick={field ? () => handleSort(field) : undefined}
              >
                {label}
                {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
              </S.TableHeadCell>
            ))}
          </S.TableHead>
        )}

        {loading && <S.LoadingMessage>Loading itineraries...</S.LoadingMessage>}
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        {!loading && !error && displayed.length === 0 && (
          <ItineraryEmptyState activeTab={activeTab} onCreateNew={() => setShowCreate(true)} />
        )}

        {!loading &&
          displayed.map((item, i) => (
            <S.TableRow
              key={item.id}
              $hovered={hoveredRow === item.id}
              $last={i === displayed.length - 1}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <S.RowNameCell onClick={() => router.push(`/itineraries/${item.id}`)}>
                <S.RowTitle $hovered={hoveredRow === item.id}>{item.proposalTitle}</S.RowTitle>
                {item.preparedFor && <S.RowSubtext>{item.preparedFor}</S.RowSubtext>}
              </S.RowNameCell>

              <S.RowCell>{advisorName(item.assignedTo)}</S.RowCell>
              <S.RowCell>{item.travelDates ?? '—'}</S.RowCell>
              <S.RowCell $variant="muted">{formatDate(item.createdAt)}</S.RowCell>

              <div>
                <ItineraryStatusBadge status={item.status} />
              </div>

              <S.RowActionsCell onClick={(e) => e.stopPropagation()}>
                {item.viewCount > 0 && (
                  <S.ViewCountSpan>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {item.viewCount}
                  </S.ViewCountSpan>
                )}
                <S.OpenButton onClick={() => router.push(`/itineraries/${item.id}`)}>Open</S.OpenButton>
                <ItineraryRowMenu
                  itinerary={item}
                  onDuplicate={() => duplicateItinerary(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              </S.RowActionsCell>
            </S.TableRow>
          ))}
      </S.TableWrapper>

      {showCreate && (
        <CreateItineraryModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </Box>
  )
}

export default function ItinerariesPage() {
  return (
    <Suspense>
      <ItinerariesPageInner />
    </Suspense>
  )
}
