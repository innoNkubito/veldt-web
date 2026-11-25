'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

/** One editable line: description on its own row, the numbers below. */
export const LineRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 6px 8px;
  padding: 10px;
  border: 1px solid ${T.border};
  border-radius: 8px;
  background: ${T.cardAlt};
`

export const StageRow = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr 0.9fr auto;
  gap: 8px;
  align-items: end;
`

export const Wide = styled.div`
  grid-column: 1 / -2;
`

export const SmallLabel = styled.label`
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  color: ${T.muted};
  margin-bottom: 3px;
`

export const RowTools = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: flex-end;
  grid-row: span 2;
`

export const IconButton = styled.button`
  width: 26px;
  height: 24px;
  border-radius: 5px;
  border: 1px solid transparent;
  background: none;
  color: ${T.sub};
  font-size: 13px;
  cursor: pointer;
  line-height: 1;

  &:hover:not(:disabled) {
    background: ${T.dim};
    border-color: ${T.border};
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`

export const LineAmount = styled.div`
  grid-column: 1 / -2;
  font-size: 12px;
  color: ${T.sub};
  text-align: right;
`

export const Tools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`

export const TextButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.terra};
  cursor: pointer;

  &:disabled {
    color: ${T.muted};
    cursor: default;
  }
`

export const Sum = styled.p<{ $ok: boolean }>`
  font-size: 12.5px;
  margin: 10px 0 0;
  color: ${(p) => (p.$ok ? T.successDk : T.warningDk)};
`

export const Linked = styled.span`
  font-size: 11px;
  color: ${T.infoDk};
`

export const Section = styled.div`
  & + & {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid ${T.border};
  }
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
`

export const Spacer = styled.span`
  flex: 1;
`

export const DirtyNote = styled.span`
  font-size: 12px;
  color: ${T.muted};
`
