'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'

const CONTENT_WIDTH = '1040px'

export const Root = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
`

/* ── Header ──────────────────────────────────────────────── */

export const Header = styled.header`
  border-bottom: 1px solid ${T.border};
  background: ${T.navBg};
`

export const HeaderInner = styled.div`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`

export const Wordmark = styled.div`
  display: flex;
  flex-direction: column;
`

export const WordmarkTitle = styled.span`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 700;
  color: ${T.text};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.1;
`

export const WordmarkSubtitle = styled.span`
  font-size: 8px;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-top: 3px;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

/* ── Buttons ─────────────────────────────────────────────── */

export const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${T.terra};
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 11px 20px;
  border-radius: 7px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: #ae6341;
  }
`

export const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: ${T.sub};
  padding: 11px 16px;
  border-radius: 7px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${T.dim};
  }
`

/* ── Hero ────────────────────────────────────────────────── */

export const Hero = styled.section`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 96px 24px 72px;

  @media (max-width: 700px) {
    padding: 56px 24px 48px;
  }
`

export const Eyebrow = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 20px;
`

export const HeroTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 500;
  line-height: 1.08;
  color: ${T.text};
  margin: 0 0 20px;
  max-width: 16ch;

  em {
    font-style: italic;
    color: ${T.terra};
  }

  @media (max-width: 700px) {
    font-size: 34px;
    max-width: none;
  }
`

export const HeroLead = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: ${T.sub};
  margin: 0 0 32px;
  max-width: 52ch;
`

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const InviteNote = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 20px 0 0;

  a {
    color: ${T.terra};
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

/* ── Capability tiles ────────────────────────────────────── */

export const Section = styled.section`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 0 24px 80px;
  width: 100%;
`

export const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.muted};
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
  margin-bottom: 28px;
`

export const TileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const Tile = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 26px 24px;
`

export const TileIcon = styled.div<{ $tint: string; $fg: string }>`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: ${(p) => p.$tint};
  color: ${(p) => p.$fg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

export const TileTitle = styled.h3`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 8px;
`

export const TileBody = styled.p`
  font-size: 13px;
  line-height: 1.65;
  color: ${T.sub};
  margin: 0;
`

/* ── How access works ────────────────────────────────────── */

export const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

export const Step = styled.li`
  background: ${T.cardAlt};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 24px;
`

export const StepNumber = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 500;
  color: ${T.terra};
  margin-bottom: 12px;
`

export const StepTitle = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 6px;
`

export const StepBody = styled.p`
  font-size: 12.5px;
  line-height: 1.65;
  color: ${T.sub};
  margin: 0;
`

/* ── Footer ──────────────────────────────────────────────── */

export const Footer = styled.footer`
  margin-top: auto;
  border-top: 1px solid ${T.border};
  background: ${T.navBg};
`

export const FooterInner = styled.div`
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: ${T.muted};
`

export const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: ${T.muted};
    text-decoration: none;
  }

  a:hover {
    color: ${T.sub};
  }
`
