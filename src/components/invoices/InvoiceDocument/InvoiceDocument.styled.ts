'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

/** The invoice "paper" — also what the print stylesheet keeps. */
export const Paper = styled.article`
  position: relative;
  background: ${T.white};
  color: ${T.text};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 36px 40px;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;

  @media print {
    border: none;
    border-radius: 0;
    padding: 0;
  }
`

export const Head = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
`

export const Logo = styled.img`
  max-height: 56px;
  max-width: 180px;
  object-fit: contain;
  display: block;
  margin-bottom: 12px;
`

export const IssuerName = styled.div`
  font-weight: 700;
  font-size: 14px;
`

export const Small = styled.div`
  font-size: 12px;
  color: ${T.sub};
  white-space: pre-line;
`

export const TitleBlock = styled.div`
  text-align: right;
`

export const Title = styled.h2`
  font-family: var(--font-playfair);
  font-weight: 500;
  font-size: 28px;
  margin: 0 0 4px;
  letter-spacing: 0.02em;
`

export const InvoiceNumber = styled.div`
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 13px;
  color: ${T.sub};
`

export const Meta = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid ${T.border};
  border-bottom: 1px solid ${T.border};
  margin-bottom: 20px;
`

export const MetaLabel = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin-bottom: 3px;
`

export const MetaRight = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  th {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${T.muted};
    text-align: left;
    padding: 0 8px 8px 0;
    border-bottom: 1px solid ${T.border};
  }
  td {
    padding: 9px 8px 9px 0;
    border-bottom: 1px solid ${T.border};
    vertical-align: top;
  }
  th.num,
  td.num {
    text-align: right;
    white-space: nowrap;
    padding-right: 0;
    padding-left: 8px;
  }
`

export const Empty = styled.p`
  color: ${T.muted};
  margin: 0 0 16px;
`

export const Totals = styled.div`
  margin-left: auto;
  width: min(300px, 100%);
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 26px;
`

export const TotalRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-weight: ${(p) => (p.$strong ? 700 : 400)};
  font-size: ${(p) => (p.$strong ? '15px' : '13px')};
  color: ${(p) => (p.$strong ? T.text : T.sub)};
  ${(p) => (p.$strong ? `border-top: 1px solid ${T.border}; padding-top: 7px; margin-top: 3px;` : '')}
`

export const Block = styled.section`
  margin-bottom: 20px;
`

export const BlockTitle = styled.h3`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin: 0 0 8px;
`

export const StageState = styled.span<{ $color: string }>`
  font-size: 11.5px;
  font-weight: 600;
  color: ${(p) => p.$color};
`

export const PayLink = styled.a`
  display: inline-block;
  margin-left: 10px;
  padding: 4px 12px;
  border-radius: 6px;
  background: ${T.terra};
  color: ${T.onBrand};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: ${T.terraDk};
  }

  @media print {
    display: none;
  }
`

export const Rich = styled.div`
  font-size: 12.5px;
  color: ${T.sub};

  p {
    margin: 0 0 6px;
  }
  ul,
  ol {
    margin: 0 0 6px;
    padding-left: 18px;
  }
`

export const Stamp = styled.div<{ $tone: 'paid' | 'void' }>`
  position: absolute;
  top: 120px;
  right: 40px;
  transform: rotate(-12deg);
  border: 3px solid ${(p) => (p.$tone === 'paid' ? T.success : T.danger)};
  color: ${(p) => (p.$tone === 'paid' ? T.success : T.danger)};
  border-radius: 8px;
  padding: 4px 18px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.55;
  pointer-events: none;
`
