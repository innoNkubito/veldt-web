'use client'

import Link from 'next/link'
import { Library, Route, CreditCard } from 'lucide-react'
import { T } from '@/lib/theme'
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

const STEPS = [
  {
    title: 'Tell us about your operation',
    body: 'A short form — company, contact and the plan that fits. No card required.',
  },
  {
    title: 'We review and set you up',
    body: 'Our team confirms the details, agrees the plan with you and provisions your workspace.',
  },
  {
    title: 'Your invitation arrives',
    body: 'Create your account from the emailed invitation and start building the same day.',
  },
]

const YEAR = new Date().getFullYear()

export default function LandingPage() {
  return (
    <S.Root>
      <S.Header>
        <S.HeaderInner>
          <S.Wordmark>
            <S.WordmarkTitle>Veldt</S.WordmarkTitle>
            <S.WordmarkSubtitle>Travel Operations</S.WordmarkSubtitle>
          </S.Wordmark>
          <S.HeaderActions>
            <S.GhostLink href="/sign-in">Sign in</S.GhostLink>
            <S.PrimaryLink href="/onboarding">Request access</S.PrimaryLink>
          </S.HeaderActions>
        </S.HeaderInner>
      </S.Header>

      <S.Hero>
        <S.Eyebrow>For safari operators</S.Eyebrow>
        <S.HeroTitle>
          Proposals worth <em>arriving</em> for.
        </S.HeroTitle>
        <S.HeroLead>
          Veldt is where safari operators build, send and get paid for bespoke
          itineraries — one library of your camps and experiences, assembled
          into a proposal your client can read on any device and book from
          directly.
        </S.HeroLead>
        <S.HeroActions>
          <S.PrimaryLink href="/onboarding">Request access</S.PrimaryLink>
          <S.GhostLink href="/sign-in">Sign in</S.GhostLink>
        </S.HeroActions>
        <S.InviteNote>
          Have an invitation? <Link href="/sign-up">Create your account</Link>
        </S.InviteNote>
      </S.Hero>

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

      <S.Section>
        <S.SectionLabel>How access works</S.SectionLabel>
        <S.Steps>
          {STEPS.map((step, index) => (
            <S.Step key={step.title}>
              <S.StepNumber>{String(index + 1).padStart(2, '0')}</S.StepNumber>
              <S.StepTitle>{step.title}</S.StepTitle>
              <S.StepBody>{step.body}</S.StepBody>
            </S.Step>
          ))}
        </S.Steps>
      </S.Section>

      <S.Footer>
        <S.FooterInner>
          <span>© {YEAR} Veldt</span>
          <S.FooterLinks>
            <Link href="/onboarding">Request access</Link>
            <Link href="/sign-in">Sign in</Link>
          </S.FooterLinks>
        </S.FooterInner>
      </S.Footer>
    </S.Root>
  )
}
