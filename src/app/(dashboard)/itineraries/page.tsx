'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useItineraryStore, ItineraryListItem } from '@/stores/itineraryStore'
import { useClientStore } from '@/stores/clientStore'
import { T } from '@/lib/theme'
import { STATUS_META, STATUS_TABS } from './constants'
import { StatusTab } from './types'
import {
  StatusBadgeSpan,
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  FieldGroup,
  FieldLabel,
  FieldInput,
  ModalActions,
  CancelButton,
  PrimaryButton,
  MenuWrapper,
  MenuTrigger,
  MenuBackdrop,
  MenuDropdown,
  MenuItem,
  EmptyRoot,
  EmptyIconCircle,
  EmptyTitle,
  EmptyText,
  EmptyCreateButton,
  PageHeaderRow,
  PageTitle,
  PageSubtitle,
  HeaderControls,
  SearchWrapper,
  SearchInput,
  SearchIconWrap,
  CreateButton,
  CreateButtonPlus,
  TabBar,
  Tab,
  TabCount,
  TableWrapper,
  TableHead,
  TableHeadCell,
  SortIndicator,
  LoadingMessage,
  ErrorMessage,
  TableRow,
  RowNameCell,
  RowTitle,
  RowSubtext,
  RowCell,
  RowActionsCell,
  ViewCountSpan,
  OpenButton,
} from './page.styled'


function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { color: T.muted, bg: T.dim }
  return (
    <StatusBadgeSpan $bg={m.bg} $color={m.color}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </StatusBadgeSpan>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function AdvisorName(assignedTo: ItineraryListItem['assignedTo']) {
  if (!assignedTo) return '—'
  return (
    `${assignedTo.firstName ?? ''} ${assignedTo.lastName ?? ''}`.trim() || '—'
  )
}

// ─── Create Modal ─────────────────────────────────────────────

function CreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (data: {
    proposalTitle: string
    preparedFor: string
    travelDates: string
  }) => void
}) {
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [dates, setDates] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    await onCreate({
      proposalTitle: title,
      preparedFor: client,
      travelDates: dates,
    })
    setLoading(false)
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>New Itinerary</ModalTitle>
          <ModalSubtitle>
            Fill in the basics — you can complete the rest in the builder
          </ModalSubtitle>
        </ModalHeader>

        <FieldGroup>
          {[
            {
              label: 'Proposal Title *',
              value: title,
              onChange: setTitle,
              placeholder: 'e.g. Kenya Safari — 7 Days',
            },
            {
              label: 'Prepared For',
              value: client,
              onChange: setClient,
              placeholder: 'e.g. James & Sarah Wilson',
            },
            {
              label: 'Travel Dates',
              value: dates,
              onChange: setDates,
              placeholder: 'e.g. September 2026',
            },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <FieldLabel>{label}</FieldLabel>
              <FieldInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </FieldGroup>

        <ModalActions>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <PrimaryButton
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            $disabled={loading || !title.trim()}
          >
            {loading ? 'Creating...' : 'Create Itinerary'}
          </PrimaryButton>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>
  )
}

// ─── Row actions menu ─────────────────────────────────────────

function RowMenu({
  itinerary,
  onDuplicate,
  onDelete,
}: {
  itinerary: ItineraryListItem
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <MenuWrapper>
      <MenuTrigger $open={open} onClick={() => setOpen(!open)}>
        ⋯
      </MenuTrigger>
      {open && (
        <>
          <MenuBackdrop onClick={() => setOpen(false)} />
          <MenuDropdown>
            {[
              { label: 'Duplicate', action: onDuplicate, color: T.sub },
              {
                label: 'Share link',
                action: () => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/view/${itinerary.slug}`,
                  )
                  setOpen(false)
                },
                color: T.sub,
              },
              { label: 'Delete', action: onDelete, color: '#DC2626' },
            ].map(({ label, action, color }) => (
              <MenuItem
                key={label}
                $color={color}
                onClick={() => {
                  action()
                  setOpen(false)
                }}
              >
                {label}
              </MenuItem>
            ))}
          </MenuDropdown>
        </>
      )}
    </MenuWrapper>
  )
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({
  activeTab,
  onCreateNew,
}: {
  activeTab: StatusTab
  onCreateNew: () => void
}) {
  return (
    <EmptyRoot>
      <EmptyIconCircle>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke={T.muted}
          strokeWidth='1.8'
        >
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <polyline points='14 2 14 8 20 8' />
          <line x1='12' y1='18' x2='12' y2='12' />
          <line x1='9' y1='15' x2='15' y2='15' />
        </svg>
      </EmptyIconCircle>
      <div>
        <EmptyTitle>
          {activeTab === 'ALL'
            ? 'No itineraries yet'
            : `No ${activeTab.toLowerCase()} itineraries`}
        </EmptyTitle>
        <EmptyText>
          {activeTab === 'ALL'
            ? 'Create your first itinerary to get started'
            : `Itineraries with ${activeTab.toLowerCase()} status will appear here`}
        </EmptyText>
      </div>
      {activeTab === 'ALL' && (
        <EmptyCreateButton onClick={onCreateNew}>
          + Create Itinerary
        </EmptyCreateButton>
      )}
    </EmptyRoot>
  )
}

// ─── Main page ────────────────────────────────────────────────

export default function ItinerariesPage() {
  const router = useRouter()
  const { user } = useUser()

  const client = useClientStore((s) => s.client)
  const {
    itineraries,
    loading,
    error,
    fetchItineraries,
    createItinerary,
    deleteItinerary,
    duplicateItinerary,
  } = useItineraryStore()

  const [activeTab, setActiveTab] = useState<StatusTab>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [sortField, setSortField] = useState<
    'proposalTitle' | 'createdAt' | 'travelDates'
  >('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  useEffect(() => {
    if (client) {
      fetchItineraries(activeTab === 'ALL' ? undefined : activeTab)
    }
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
    itineraries.forEach((i) => {
      c[i.status] = (c[i.status] ?? 0) + 1
    })
    return c
  }, [itineraries])

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  async function handleCreate(data: {
    proposalTitle: string
    preparedFor: string
    travelDates: string
  }) {
    const result = await createItinerary(data)
    if (result) {
      setShowCreate(false)
      router.push(`/itineraries/${result.id}`)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this itinerary? This cannot be undone.')) return
    await deleteItinerary(id)
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <SortIndicator $active={sortField === field}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </SortIndicator>
  )

  return (
    <>
      {/* ── Page header ─────────────────────────────────────── */}
      <PageHeaderRow>
        <div>
          <PageTitle>Itineraries</PageTitle>
          <PageSubtitle>
            {counts.ALL ?? 0} total · {counts.CONFIRMED ?? 0} confirmed ·{' '}
            {counts.PUBLISHED ?? 0} published
          </PageSubtitle>
        </div>

        <HeaderControls>
          <SearchWrapper>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search itineraries...'
            />
            <SearchIconWrap
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke={T.muted}
              strokeWidth='2'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </SearchIconWrap>
          </SearchWrapper>

          <CreateButton onClick={() => setShowCreate(true)}>
            <CreateButtonPlus>+</CreateButtonPlus>
            New Itinerary
          </CreateButton>
        </HeaderControls>
      </PageHeaderRow>

      {/* ── Status tabs ─────────────────────────────────────── */}
      <TabBar>
        {STATUS_TABS.map(({ key, label }) => {
          const active = activeTab === key
          const count = counts[key] ?? 0
          return (
            <Tab key={key} $active={active} onClick={() => setActiveTab(key)}>
              {label}
              {count > 0 && (
                <TabCount $active={active}>{count}</TabCount>
              )}
            </Tab>
          )
        })}
      </TabBar>

      {/* ── Table ───────────────────────────────────────────── */}
      <TableWrapper>
        {displayed.length > 0 && (
          <TableHead>
            {[
              { label: 'Itinerary', field: 'proposalTitle' as const },
              { label: 'Assigned To', field: null },
              { label: 'Travel Dates', field: 'travelDates' as const },
              { label: 'Created', field: 'createdAt' as const },
              { label: 'Status', field: null },
              { label: 'Actions', field: null },
            ].map(({ label, field }) => (
              <TableHeadCell
                key={label}
                $sortable={!!field}
                onClick={field ? () => handleSort(field) : undefined}
              >
                {label}
                {field && <SortIcon field={field} />}
              </TableHeadCell>
            ))}
          </TableHead>
        )}

        {loading && <LoadingMessage>Loading itineraries...</LoadingMessage>}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loading && !error && displayed.length === 0 && (
          <EmptyState
            activeTab={activeTab}
            onCreateNew={() => setShowCreate(true)}
          />
        )}

        {!loading &&
          displayed.map((item, i) => (
            <TableRow
              key={item.id}
              $hovered={hoveredRow === item.id}
              $last={i === displayed.length - 1}
              onMouseEnter={() => setHoveredRow(item.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <RowNameCell onClick={() => router.push(`/itineraries/${item.id}`)}>
                <RowTitle $hovered={hoveredRow === item.id}>
                  {item.proposalTitle}
                </RowTitle>
                {item.preparedFor && (
                  <RowSubtext>{item.preparedFor}</RowSubtext>
                )}
              </RowNameCell>

              <RowCell>{AdvisorName(item.assignedTo)}</RowCell>

              <RowCell>{item.travelDates ?? '—'}</RowCell>

              <RowCell $variant="muted">{formatDate(item.createdAt)}</RowCell>

              <div>
                <StatusBadge status={item.status} />
              </div>

              <RowActionsCell onClick={(e) => e.stopPropagation()}>
                {item.viewCount > 0 && (
                  <ViewCountSpan>
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={T.muted}
                      strokeWidth='2'
                    >
                      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                      <circle cx='12' cy='12' r='3' />
                    </svg>
                    {item.viewCount}
                  </ViewCountSpan>
                )}

                <OpenButton
                  onClick={() => router.push(`/itineraries/${item.id}`)}
                >
                  Open
                </OpenButton>

                <RowMenu
                  itinerary={item}
                  onDuplicate={() => duplicateItinerary(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              </RowActionsCell>
            </TableRow>
          ))}
      </TableWrapper>

      {/* ── Create modal ─────────────────────────────────────── */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  )
}
