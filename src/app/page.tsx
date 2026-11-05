'use client'

import { Library, Route, CreditCard } from 'lucide-react'
import { T } from '@/lib/theme'
import LandingHeader from '@/components/landing/LandingHeader'
import LandingHero from '@/components/landing/LandingHero'
import ProofSection from '@/components/landing/ProofSection'
import AccessSection from '@/components/landing/AccessSection'
import LandingFooter from '@/components/landing/LandingFooter'
import * as S from './page.styled'

// Public landing page. Signed-in users never reach it — the proxy in
// src/middleware.ts redirects them to /dashboard before this renders, so
// there is no authenticated flash to guard against here.
//
// Access is support-mediated, so the primary call to action is "Request
// access" (/onboarding), not sign-up. A cold Clerk sign-up produces an
// account with no OperatorUser, which the dashboard cannot serve — sign-up
// is therefore presented only to people who already hold an invitation.

const TILES = [
  {
    icon: Library,
    tint: T.terraLt,
    fg: T.terra,
    title: 'Content library',
    body: 'Properties, areas, activities and notes, written once and reused across every proposal. Variants let one lodge read differently for different clients.',
  },
  {
    icon: Route,
    tint: T.tealLt,
    fg: T.teal,
    title: 'Itinerary builder',
    body: 'Day-by-day or calendar. Mention a camp and its page comes with it — rooms, photos and rates already attached.',
  },
  {
    icon: CreditCard,
    tint: T.sageLt,
    fg: T.sage,
    title: 'Bookings and payments',
    body: 'Send a proposal your client can accept and pay from. Deposits, instalment schedules and reminders are handled for you.',
  },
]

export default function LandingPage() {
  return (
    <S.Root>
      <LandingHeader />
      <LandingHero />
      <ProofSection />

      {/* Replaced in phase 4 of the landing upgrade. */}
      <S.Section>
        <S.SectionLabel>What you get</S.SectionLabel>
        <S.TileGrid>
          {TILES.map((tile) => {
            const Icon = tile.icon
            return (
              <S.Tile key={tile.title}>
                <S.TileIcon $tint={tile.tint} $fg={tile.fg}>
                  <Icon size={17} strokeWidth={2} aria-hidden />
                </S.TileIcon>
                <S.TileTitle>{tile.title}</S.TileTitle>
                <S.TileBody>{tile.body}</S.TileBody>
              </S.Tile>
            )
          })}
        </S.TileGrid>
      </S.Section>

      <AccessSection />

      <LandingFooter />
    </S.Root>
  )
}
