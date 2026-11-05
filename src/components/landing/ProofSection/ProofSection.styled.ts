'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Panel = styled.div`
  background: ${T.inverse};
  color: ${T.onBrand};
  border-radius: 28px;
  padding: 64px 56px 56px;

  @media (max-width: 700px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(32px, 4.4vw, 52px);
  font-weight: 400;
  line-height: 1.08;
  margin: 0 0 48px;
  max-width: 14ch;
`

export const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    row-gap: 36px;
  }
`

export const Stat = styled.div`
  padding-bottom: 40px;
  border-bottom: 1px solid ${T.onBrandFaint};

  @media (max-width: 860px) {
    padding-bottom: 20px;
  }
`

export const StatValue = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 5vw, 64px);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  margin-bottom: 14px;
`

export const StatLabel = styled.div`
  font-size: 15px;
  line-height: 1.5;
  color: ${T.onBrandMuted};
  max-width: 22ch;
`

export const Quote = styled.figure`
  margin: 0;
  padding-top: 24px;
`

export const QuoteText = styled.blockquote`
  margin: 0 0 12px;
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  line-height: 1.35;
`

export const QuoteBy = styled.figcaption`
  font-size: 13px;
  color: ${T.onBrandMuted};
`

export const Operators = styled.ul`
  list-style: none;
  margin: 48px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;

  li {
    font-family: var(--font-playfair), 'Playfair Display', serif;
    font-style: italic;
    font-size: 18px;
    color: ${T.onBrandMuted};
  }
`
