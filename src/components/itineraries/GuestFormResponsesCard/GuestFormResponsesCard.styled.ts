'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.section`
  grid-column: 1 / -1;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const Title = styled.h2`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
`

export const NewCount = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: ${T.onBrand};
  background: ${T.terra};
  border-radius: 999px;
  padding: 3px 9px;
`

export const Group = styled.div`
  & + & {
    margin-top: 18px;
  }
`

export const GroupName = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
  margin: 0 0 8px;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Row = styled.button<{ $new: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 13px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$new ? T.terra : T.border)};
  background: ${(p) => (p.$new ? T.terraLt : T.card)};
  font-family: 'DM Sans', sans-serif;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${T.terra};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 1px;
  }
`

export const Guest = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
`

export const RowMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${T.muted};
  white-space: nowrap;
`

export const Badge = styled.span`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${T.onBrand};
  background: ${T.terra};
  border-radius: 999px;
  padding: 2px 7px;
`

export const Muted = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 0;
`

export const Note = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  margin: 16px 0 0;
`

export const ErrorText = styled.p`
  font-size: 12px;
  color: ${T.dangerDk};
  margin: 0;
`
