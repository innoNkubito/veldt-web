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

export const Wordmark = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`

export const WordmarkTitle = styled.span`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
`

export const WordmarkSubtitle = styled.span`
  font-size: 12px;
  color: ${T.muted};

  @media (max-width: 560px) {
    display: none;
  }
`

export const Actions = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`
