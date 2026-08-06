'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useBookingsStore,
  BOOKING_STATUS_CONFIG,
  INSTALLMENT_STATUS_CONFIG,
  formatMoney,
  nextDueInstallment,
  type Booking,
  type Installment,
} from '@/stores/bookingsStore'
import * as S from './page.styled'

type TabKey = 'ALL' | 'REQUESTS' | 'AWAITING' | 'CONFIRMED' | 'OVERDUE' | 'CANCELLED'
type SortKey = 'createdAt' | 'clientName' | 'total' | 'balanceDue' | 'nextDue'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'REQUESTS', label: 'Requests' },
  { key: 'AWAITING', label: 'Awaiting Payment' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'OVERDUE', label: 'Overdue' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

function isOverdue(booking: Booking): boolean {
  if (booking.status === 'CANCELLED') return false
  const now = Date.now()
  return booking.installments.some(
    (i) =>
      i.status !== 'PAID' &&
      i.status !== 'VOID' &&
      new Date(i.dueDate).getTime() < now,
  )
}

function matchesTab(booking: Booking, tab: TabKey): boolean {
  switch (tab) {
    case 'ALL':
      return booking.status !== 'CANCELLED'
    case 'REQUESTS':
      return booking.status === 'PENDING_REQUEST'
    case 'AWAITING':
      return booking.status === 'AWAITING_PAYMENT'
    case 'CONFIRMED':
      return booking.status === 'CONFIRMED'
    case 'OVERDUE':
      return isOverdue(booking)
    case 'CANCELLED':
      return booking.status === 'CANCELLED'
  }
}

// ── Detail drawer ───────────────────────────────────────────────

function BookingDrawer({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { approveRequest, cancelBooking, markPaid, saving } = useBookingsStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const statusMeta = BOOKING_STATUS_CONFIG[booking.status]

  async function handleApprove() {
    const ok = await confirmDialog({
      title: 'Approve this request?',
      message: `${booking.clientName} will be sent a confirmation with the payment schedule.`,
      confirmLabel: 'Approve',
    })
    if (ok) await approveRequest(booking.id)
  }

  async function handleCancel() {
    const ok = await confirmDialog({
      title: 'Cancel this booking?',
      message:
        'Package availability will be released and any unpaid installments voided. Payments already taken are not refunded automatically — handle refunds in your payment processor.',
      confirmLabel: 'Cancel booking',
      danger: true,
    })
    if (ok) {
      await cancelBooking(booking.id)
      onClose()
    }
  }

  async function handleMarkPaid(installment: Installment) {
    const ok = await confirmDialog({
      title: 'Record this payment?',
      message: `Mark "${installment.description}" (${formatMoney(
        installment.amountDue,
        booking.currency,
      )}) as paid outside Veldt. A receipt will be emailed to the client.`,
      confirmLabel: 'Mark as paid',
    })
    if (ok) await markPaid(installment.id)
  }

  async function copyPayLink(installment: Installment) {
    if (!installment.payToken) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/pay/${installment.payToken}`)
      setCopiedId(installment.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.Drawer>
        <S.DrawerHeader>
          <div>
            <S.DrawerTitle>{booking.clientName}</S.DrawerTitle>
            <S.DrawerMeta>
              {booking.reference} · {booking.itineraryTitle ?? 'Itinerary'} ·{' '}
              {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
            </S.DrawerMeta>
          </div>
          <S.DrawerClose onClick={onClose}>✕</S.DrawerClose>
        </S.DrawerHeader>

        <div style={{ marginBottom: 22 }}>
          <S.StatusChip $color={statusMeta.color} $bg={statusMeta.bg}>
            {statusMeta.label}
          </S.StatusChip>
        </div>

        <S.Section>
          <S.SectionTitle>Contact</S.SectionTitle>
          <S.DetailRow>
            <div>Email</div>
            <div>{booking.clientEmail}</div>
          </S.DetailRow>
          {booking.clientPhone && (
            <S.DetailRow>
              <div>Phone</div>
              <div>{booking.clientPhone}</div>
            </S.DetailRow>
          )}
          <S.DetailRow>
            <div>Booked</div>
            <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
          </S.DetailRow>
        </S.Section>

        {booking.clientNote && (
          <S.Section>
            <S.SectionTitle>Client note</S.SectionTitle>
            <S.NoteBox>{booking.clientNote}</S.NoteBox>
          </S.Section>
        )}

        <S.Section>
          <S.SectionTitle>Booking</S.SectionTitle>
          {booking.packageSelections.map((line) => (
            <S.DetailRow key={line.id}>
              <div>
                {line.packageName} × {line.quantity}
              </div>
              <div>{formatMoney(line.lineTotal, booking.currency)}</div>
            </S.DetailRow>
          ))}
          {booking.addonSelections.map((line) => (
            <S.DetailRow key={line.id}>
              <div>
                {line.addonName} × {line.quantity}
              </div>
              <div>{formatMoney(line.lineTotal, booking.currency)}</div>
            </S.DetailRow>
          ))}
          <S.DetailRow $strong>
            <div>Total</div>
            <div>{formatMoney(booking.total, booking.currency)}</div>
          </S.DetailRow>
          <S.DetailRow>
            <div>Paid</div>
            <div>{formatMoney(booking.amountPaid, booking.currency)}</div>
          </S.DetailRow>
          <S.DetailRow>
            <div>Balance</div>
            <div>{formatMoney(booking.balanceDue, booking.currency)}</div>
          </S.DetailRow>
        </S.Section>

        <S.Section>
          <S.SectionTitle>Payment schedule</S.SectionTitle>
          {booking.installments.map((installment) => {
            const meta = INSTALLMENT_STATUS_CONFIG[installment.status]
            const overdue =
              installment.status !== 'PAID' &&
              installment.status !== 'VOID' &&
              new Date(installment.dueDate).getTime() < Date.now()
            return (
              <S.InstallmentRow key={installment.id}>
                <S.InstallmentMain>
                  <S.InstallmentName>{installment.description}</S.InstallmentName>
                  <S.InstallmentDue>
                    Due {new Date(installment.dueDate).toLocaleDateString()}
                    {installment.paidAt &&
                      ` · paid ${new Date(installment.paidAt).toLocaleDateString()}`}
                    {installment.paymentMethod && ` · ${installment.paymentMethod.toLowerCase()}`}
                  </S.InstallmentDue>
                </S.InstallmentMain>

                <S.InstallmentAmount>
                  {formatMoney(installment.amountDue, booking.currency)}
                </S.InstallmentAmount>

                <S.InstallmentActions>
                  <S.StatusChip
                    $color={overdue ? '#b91c1c' : meta.color}
                    $bg={overdue ? '#fbe9e9' : meta.bg}
                  >
                    {overdue ? 'Overdue' : meta.label}
                  </S.StatusChip>
                  {installment.status !== 'PAID' && installment.status !== 'VOID' && (
                    <>
                      <S.LinkButton onClick={() => handleMarkPaid(installment)}>
                        Mark paid
                      </S.LinkButton>
                      {installment.payToken && (
                        <S.LinkButton onClick={() => copyPayLink(installment)}>
                          {copiedId === installment.id ? 'Copied!' : 'Copy link'}
                        </S.LinkButton>
                      )}
                    </>
                  )}
                </S.InstallmentActions>
              </S.InstallmentRow>
            )
          })}
        </S.Section>

        {booking.status !== 'CANCELLED' && (
          <S.DrawerActions>
            {booking.status === 'PENDING_REQUEST' && (
              <S.PrimaryButton $disabled={saving} onClick={() => !saving && handleApprove()}>
                {saving ? 'Working…' : 'Approve request'}
              </S.PrimaryButton>
            )}
            <S.DangerLink onClick={handleCancel}>Cancel booking</S.DangerLink>
          </S.DrawerActions>
        )}
      </S.Drawer>
    </S.Overlay>
  )
}

// ── Page ────────────────────────────────────────────────────────

export default function BookingsPage() {
  const client = useClientStore((s) => s.client)
  const { bookings, loading, error, fetchBookings, setError } = useBookingsStore()

  const [tab, setTab] = useState<TabKey>('ALL')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (client) fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  const counts = useMemo(
    () =>
      TABS.reduce(
        (acc, t) => ({ ...acc, [t.key]: bookings.filter((b) => matchesTab(b, t.key)).length }),
        {} as Record<TabKey, number>,
      ),
    [bookings],
  )

  const displayed = useMemo(() => {
    let list = bookings.filter((b) => matchesTab(b, tab))

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (b) =>
          b.clientName.toLowerCase().includes(q) ||
          b.clientEmail.toLowerCase().includes(q) ||
          b.reference.toLowerCase().includes(q) ||
          (b.itineraryTitle ?? '').toLowerCase().includes(q),
      )
    }

    const sorted = [...list].sort((a, b) => {
      switch (sortKey) {
        case 'clientName':
          return a.clientName.localeCompare(b.clientName)
        case 'total':
          return a.total - b.total
        case 'balanceDue':
          return a.balanceDue - b.balanceDue
        case 'nextDue': {
          const aDue = nextDueInstallment(a)?.dueDate ?? ''
          const bDue = nextDueInstallment(b)?.dueDate ?? ''
          return aDue.localeCompare(bDue)
        }
        default:
          return a.createdAt.localeCompare(b.createdAt)
      }
    })

    return sortAsc ? sorted : sorted.reverse()
  }, [bookings, tab, search, sortKey, sortAsc])

  const selected = bookings.find((b) => b.id === selectedId) ?? null

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc((prev) => !prev)
    else {
      setSortKey(key)
      setSortAsc(key === 'clientName' || key === 'nextDue')
    }
  }

  return (
    <S.PageRoot>
      <S.PageHeaderRow>
        <div>
          <S.PageTitle>Bookings</S.PageTitle>
          <S.PageSubtitle>
            {counts.ALL} active · {counts.REQUESTS} awaiting approval · {counts.OVERDUE} overdue
          </S.PageSubtitle>
        </div>
        <S.SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or reference..."
        />
      </S.PageHeaderRow>

      {error && <S.ErrorBanner onClick={() => setError(null)}>{error}</S.ErrorBanner>}

      <S.TabBar>
        {TABS.map(({ key, label }) => (
          <S.Tab key={key} $active={tab === key} onClick={() => setTab(key)}>
            {label}
            <S.TabCount $active={tab === key}>{counts[key]}</S.TabCount>
          </S.Tab>
        ))}
      </S.TabBar>

      {loading ? (
        <S.LoadingMessage>Loading bookings...</S.LoadingMessage>
      ) : displayed.length === 0 ? (
        <S.EmptyState>
          {bookings.length === 0
            ? 'No bookings yet. Once an itinerary is bookable, client bookings appear here.'
            : 'No bookings match this filter.'}
        </S.EmptyState>
      ) : (
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th $sortable onClick={() => toggleSort('clientName')}>
                  Client
                </S.Th>
                <S.Th>Itinerary</S.Th>
                <S.Th>Status</S.Th>
                <S.Th $sortable onClick={() => toggleSort('nextDue')}>
                  Next Due
                </S.Th>
                <S.Th $sortable $right onClick={() => toggleSort('total')}>
                  Total
                </S.Th>
                <S.Th $sortable $right onClick={() => toggleSort('balanceDue')}>
                  Balance
                </S.Th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((booking) => {
                const statusMeta = BOOKING_STATUS_CONFIG[booking.status]
                const next = nextDueInstallment(booking)
                const overdue =
                  next != null && new Date(next.dueDate).getTime() < Date.now() &&
                  booking.status !== 'CANCELLED'

                return (
                  <S.Tr key={booking.id} onClick={() => setSelectedId(booking.id)}>
                    <S.Td>
                      <S.ClientName>{booking.clientName}</S.ClientName>
                      <S.ClientEmail>{booking.clientEmail}</S.ClientEmail>
                    </S.Td>
                    <S.Td>
                      {booking.itineraryTitle ?? '—'}
                      <S.Reference>{booking.reference}</S.Reference>
                    </S.Td>
                    <S.Td>
                      <S.StatusChip $color={statusMeta.color} $bg={statusMeta.bg}>
                        {statusMeta.label}
                      </S.StatusChip>
                    </S.Td>
                    <S.Td $muted={!next}>
                      {next ? (
                        overdue ? (
                          <S.OverdueText>
                            {new Date(next.dueDate).toLocaleDateString()}
                          </S.OverdueText>
                        ) : (
                          new Date(next.dueDate).toLocaleDateString()
                        )
                      ) : (
                        '—'
                      )}
                    </S.Td>
                    <S.Td $right>{formatMoney(booking.total, booking.currency)}</S.Td>
                    <S.Td $right $muted={booking.balanceDue === 0}>
                      {formatMoney(booking.balanceDue, booking.currency)}
                    </S.Td>
                  </S.Tr>
                )
              })}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      )}

      {selected && <BookingDrawer booking={selected} onClose={() => setSelectedId(null)} />}
    </S.PageRoot>
  )
}
