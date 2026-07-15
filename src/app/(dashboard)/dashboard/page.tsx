'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useClientStore } from '@/stores/clientStore'
import { useItineraryStore } from '@/stores/itineraryStore'
import { useProfileStore } from '@/stores/profileStore'
import { T } from '@/lib/theme'
import { STATUS_META } from '@/lib/itinerary-constants'
import * as S from './page.styled'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const profile = useProfileStore((s) => s.profile)
  const client = useClientStore((s) => s.client)
  const { itineraries, loading, fetchItineraries } = useItineraryStore()

  useEffect(() => {
    if (client) fetchItineraries()
  }, [client])

  // First name from the operator profile, then Clerk; fall back to username
  const firstName =
    profile?.firstName || user?.firstName || user?.username || ''
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const recent = itineraries.slice(0, 6)
  const total = itineraries.length
  const active = itineraries.filter(
    (i) => i.status === 'PUBLISHED' || i.status === 'CONFIRMED',
  ).length
  const drafts = itineraries.filter((i) => i.status === 'DRAFT').length

  return (
    <S.PageRoot>
      {/* Header */}
      <S.PageHeader>
        <div>
          <S.Greeting>
            {greeting}{firstName ? <>, <em>{firstName}</em></> : ''}
          </S.Greeting>
          <S.SubHeader>{today}</S.SubHeader>
        </div>
        <S.QuickActions>
          <S.QuickBtn onClick={() => router.push('/itineraries')}>
            + New Itinerary
          </S.QuickBtn>
        </S.QuickActions>
      </S.PageHeader>

      {/* Stats */}
      <S.StatsGrid>
        <S.StatCardWrap $accent={T.terra}>
          <S.StatTop>
            <S.StatLabel>Total Itineraries</S.StatLabel>
          </S.StatTop>
          <S.StatValue>{loading ? '—' : total}</S.StatValue>
        </S.StatCardWrap>
        <S.StatCardWrap $accent={T.sage}>
          <S.StatTop>
            <S.StatLabel>Active</S.StatLabel>
          </S.StatTop>
          <S.StatValue>{loading ? '—' : active}</S.StatValue>
        </S.StatCardWrap>
        <S.StatCardWrap $accent={T.gold}>
          <S.StatTop>
            <S.StatLabel>Drafts</S.StatLabel>
          </S.StatTop>
          <S.StatValue>{loading ? '—' : drafts}</S.StatValue>
        </S.StatCardWrap>
      </S.StatsGrid>

      {/* Recent itineraries */}
      <S.Card>
        <S.CardHeader>
          <S.SectionLabel>Recent Itineraries</S.SectionLabel>
          <S.ViewAllLink onClick={() => router.push('/itineraries')}>
            View all →
          </S.ViewAllLink>
        </S.CardHeader>

        {loading ? (
          <div style={{ color: T.muted, fontSize: 13, padding: '16px 0' }}>
            Loading…
          </div>
        ) : recent.length === 0 ? (
          <S.EmptyState>
            <div>No itineraries yet.</div>
            <S.QuickBtn onClick={() => router.push('/itineraries')}>
              Create your first itinerary
            </S.QuickBtn>
          </S.EmptyState>
        ) : (
          <>
            <S.TableHead>
              {['Title', 'Client', 'Travel Dates', 'Status'].map((h) => (
                <S.TableHeadCell key={h}>{h}</S.TableHeadCell>
              ))}
            </S.TableHead>
            {recent.map((it, i) => {
              const meta = STATUS_META[it.status] ?? {
                color: T.muted,
                bg: T.dim,
              }
              return (
                <S.TripRow
                  key={it.id}
                  $last={i === recent.length - 1}
                  onClick={() => router.push(`/itineraries/${it.id}`)}
                >
                  <S.TripCell>
                    <S.StatusBar $color={meta.color} />
                    <S.TripName>{it.proposalTitle}</S.TripName>
                  </S.TripCell>
                  <S.TripClient>{it.preparedFor ?? '—'}</S.TripClient>
                  <S.TripDates>{it.travelDates ?? '—'}</S.TripDates>
                  <S.StatusBadgeSpan $bg={meta.bg} $color={meta.color}>
                    {it.status}
                  </S.StatusBadgeSpan>
                </S.TripRow>
              )
            })}
          </>
        )}
      </S.Card>
    </S.PageRoot>
  )
}
