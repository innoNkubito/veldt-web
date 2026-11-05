'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// Gains a hairline and soft shadow once the page scrolls under it.
export const Bar = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${T.bg};
  border-bottom: 1px solid ${(p) => (p.$scrolled ? T.border : 'transparent')};
  box-shadow: ${(p) => (p.$scrolled ? `0 6px 20px -16px ${T.scrimDeep}` : 'none')};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
`

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 14px;
  padding-bottom: 14px;
`

export const Actions = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`
