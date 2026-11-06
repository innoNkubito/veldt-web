'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'

export const Card = styled.section`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-left: 3px solid ${T.terra};
  border-radius: 10px;
  padding: 18px 22px;
  margin-bottom: 20px;
`

export const Title = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.sub};
  margin: 0 0 10px;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const Item = styled.li`
  & + & {
    border-top: 1px solid ${T.border};
  }
`

export const ItemLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  text-decoration: none;

  &:hover strong {
    color: ${T.terra};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
    border-radius: 4px;
  }
`

export const What = styled.span`
  font-size: 13px;
  color: ${T.sub};

  strong {
    font-weight: 600;
    color: ${T.text};
  }
`

export const When = styled.span`
  font-size: 12px;
  color: ${T.muted};
  white-space: nowrap;
`

export const More = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 8px 0 0;
`
