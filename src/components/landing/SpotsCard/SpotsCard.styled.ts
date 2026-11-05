'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.aside`
  background: ${T.card};
  border: 1px solid ${T.borderStrong};
  border-radius: 24px;
  padding: 28px 28px 32px;
`

export const Headline = styled.p`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 18px;
  font-size: 17px;
  color: ${T.sub};
`

export const Count = styled.span`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 64px;
  line-height: 1;
  color: ${T.text};
`

export const Track = styled.div`
  height: 6px;
  border-radius: 999px;
  background: ${T.dim};
  overflow: hidden;
  margin-bottom: 24px;
`

export const Fill = styled.div<{ $pct: number }>`
  width: ${(p) => p.$pct}%;
  height: 100%;
  background: ${T.gold};
  border-radius: inherit;
`

export const MarketsLabel = styled.div`
  font-size: 13.5px;
  color: ${T.sub};
  margin-bottom: 14px;
`

export const Markets = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 24px;
`

export const MarketItem = styled.li<{ $live: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${(p) => (p.$live ? T.text : T.muted)};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${(p) => (p.$live ? T.sage : 'transparent')};
    border: 1.5px solid ${(p) => (p.$live ? T.sage : T.muted)};
  }
`
