'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Frame = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 14px;
  overflow: hidden;
`

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  background: ${T.dim};
  border-bottom: 1px solid ${T.border};
  font-size: 12px;
  color: ${T.muted};
`

export const Badge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.terra};
`

export const ResetButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: ${T.sub};
  text-decoration: underline;
  cursor: pointer;
`

export const Body = styled.div`
  padding: 28px 28px 32px;
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 8px;
`

export const Intro = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${T.sub};
  margin: 0 0 24px;
  white-space: pre-line;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 24px 0;
`

export const Empty = styled.p`
  font-size: 13px;
  color: ${T.muted};
  margin: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 28px;
`

export const FakeButton = styled.span<{ $primary?: boolean }>`
  display: inline-flex;
  padding: 11px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${(p) => (p.$primary ? T.terra : 'transparent')};
  color: ${(p) => (p.$primary ? T.onBrand : T.terra)};
  border: 1px solid ${T.terra};
  opacity: 0.85;
`
