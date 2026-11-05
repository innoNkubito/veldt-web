'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Bar = styled.footer`
  margin-top: 112px;
  border-top: 1px solid ${T.border};
  padding: 36px 0 40px;

  @media (max-width: 700px) {
    margin-top: 72px;
  }
`

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`

export const Links = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${T.sub};

  a {
    color: ${T.sub};
    text-decoration: none;
  }

  a:hover {
    color: ${T.text};
  }

  a:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 3px;
    border-radius: 4px;
  }
`

export const Dot = styled.span`
  color: ${T.muted};
`

export const Copyright = styled.span`
  color: ${T.muted};
  margin-left: 14px;
`
