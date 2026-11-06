'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'

export const Card = styled.section`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  grid-column: 1 / -1;
`

export const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 6px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const Description = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 0 0 6px;
  line-height: 1.5;
`

export const LibraryLink = styled(Link)`
  font-size: 12px;
  color: ${T.terra};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const StatusNote = styled.p`
  font-size: 12px;
  color: ${T.sub};
  background: ${T.dim};
  border-radius: 6px;
  padding: 8px 11px;
  margin: 16px 0;
`

export const List = styled.ol`
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid ${T.border};
  border-radius: 8px;
`

export const Position = styled.span`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 14px;
  color: ${T.muted};
  width: 16px;
  text-align: center;
`

export const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const ItemName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const ItemMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const Badge = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${T.warningDk};
  background: ${T.warningLt};
  border-radius: 999px;
  padding: 2px 7px;
  margin-left: 8px;
`

export const Tools = styled.div`
  display: flex;
  gap: 2px;
`

export const Tool = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: ${(p) => (p.$danger ? T.danger : T.sub)};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${T.dim};
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 1px;
  }
`

export const Empty = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 0 0 16px;
`

export const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 420px;
`

export const AddLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
  white-space: nowrap;
`

export const Muted = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 0;
`

export const ErrorText = styled.p`
  font-size: 12px;
  color: ${T.dangerDk};
  margin: 10px 0 0;
`
