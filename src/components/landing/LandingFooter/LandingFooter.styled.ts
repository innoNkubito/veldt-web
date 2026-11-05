'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Bar = styled.footer`
  margin-top: auto;
  padding: 48px 0 40px;
`

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: ${T.sub};
`

export const Links = styled.nav`
  display: flex;
  gap: 6px;

  a {
    color: ${T.sub};
    text-decoration: none;
  }

  a:hover {
    color: ${T.text};
  }
`

export const Dot = styled.span`
  color: ${T.muted};
`
