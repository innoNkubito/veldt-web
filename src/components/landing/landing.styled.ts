'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'
import { CONTENT_WIDTH } from './constants'

// Pieces shared by every landing section.

export const Container = styled.div`
  width: 100%;
  max-width: ${CONTENT_WIDTH};
  margin: 0 auto;
  padding: 0 24px;
`

const pill = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 3px;
  }
`

export const PrimaryPill = styled(Link)`
  ${pill}
  background: ${T.terra};
  color: ${T.onBrand};
  border: 1px solid ${T.terra};

  &:hover {
    background: ${T.terraDk};
    border-color: ${T.terraDk};
  }
`

// `$onDark` flips the outline for use on the hero panel.
export const GhostPill = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$onDark',
})<{ $onDark?: boolean }>`
  ${pill}
  background: transparent;
  color: ${(p) => (p.$onDark ? T.onBrand : T.text)};
  border: 1px solid ${(p) => (p.$onDark ? T.onBrandFaint : T.borderStrong)};

  &:hover {
    border-color: ${(p) => (p.$onDark ? T.onBrand : T.text)};
  }

  &:focus-visible {
    outline-color: ${(p) => (p.$onDark ? T.onBrand : T.teal)};
  }
`

// Uppercase tracked label — same voice as the wordmark subtitle.
export const Eyebrow = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 16px;
`

// Stacked uppercase wordmark (header + footer).
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

export const SectionTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(32px, 4.4vw, 52px);
  font-weight: 400;
  line-height: 1.08;
  color: ${T.text};
  margin: 0 0 20px;
  max-width: 18ch;
  text-wrap: balance;
`

export const Section = styled.section`
  padding: 112px 0 0;

  @media (max-width: 700px) {
    padding-top: 72px;
  }
`

// Readable by screen readers, invisible on screen.
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
