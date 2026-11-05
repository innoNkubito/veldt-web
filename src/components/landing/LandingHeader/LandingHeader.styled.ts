'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${T.bg};
  border-bottom: 1px solid transparent;
`

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 14px;
  padding-bottom: 14px;
`

// Stacked uppercase wordmark, carried over from the original landing page.
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

export const Actions = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`
