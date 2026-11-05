'use client'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Link from 'next/link'
import { T } from '@/lib/theme'
import { ENTRANCE_STEP_MS } from './constants'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`

// `$step` orders the entrance; reduced-motion users get no animation.
const Entrance = styled.div<{ $step: number }>`
  animation: ${fadeUp} 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: ${(p) => p.$step * ENTRANCE_STEP_MS}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// Full-bleed-ish panel with a shallow elliptical bottom edge.
export const Panel = styled.section`
  width: calc(100% - 2 * clamp(0px, 6vw, 100px));
  margin: 0 auto;
  background: ${T.heroGradient};
  color: ${T.onBrand};
  border-radius: 0 0 50% 50% / 0 0 72px 72px;
  padding: 72px 0 80px;

  @media (max-width: 900px) {
    width: 100%;
    border-radius: 0 0 50% 50% / 0 0 36px 36px;
    padding: 48px 0 72px;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  align-items: center;
  gap: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

export const Copy = styled.div`
  min-width: 0;
`

export const Title = styled(Entrance.withComponent('h1'))`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(42px, 6.4vw, 80px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.01em;
  margin: 0 0 24px;

  em {
    font-style: italic;
    font-weight: 600;
  }
`

export const Lead = styled(Entrance.withComponent('p'))`
  font-size: 17px;
  line-height: 1.65;
  color: ${T.onBrandMuted};
  margin: 0 0 32px;
  max-width: 52ch;
`

export const Actions = styled(Entrance)`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

// On the dark panel the brand-green pill would vanish, so the primary
// action flips to a light fill.
export const LightPill = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: 999px;
  background: ${T.card};
  color: ${T.terra};
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${T.terraLt};
  }

  &:focus-visible {
    outline: 2px solid ${T.onBrand};
    outline-offset: 3px;
  }
`

export const InviteNote = styled(Entrance.withComponent('p'))`
  font-size: 13px;
  color: ${T.onBrandMuted};
  margin: 20px 0 0;

  a {
    color: ${T.onBrand};
    font-weight: 600;
  }
`

export const PhoneSlot = styled(Entrance)`
  display: flex;
  justify-content: center;
`
