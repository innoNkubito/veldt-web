'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 22px 24px;
`

export const Intro = styled.p`
  font-size: 12.5px;
  line-height: 1.55;
  color: ${T.sub};
  margin: 0 0 18px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const Full = styled.div`
  grid-column: 1 / -1;
`

export const Hint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  margin: 5px 0 0;
`

export const Preview = styled.p`
  font-size: 12px;
  color: ${T.sub};
  margin: 6px 0 0;

  strong {
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-weight: 600;
    color: ${T.text};
  }
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 20px 0;
`

/** Rich text shown to people who can't edit it. */
export const ReadOnlyHtml = styled.div`
  font-size: 13px;
  line-height: 1.55;
  color: ${T.text};
  padding: 10px 13px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.dim};

  p {
    margin: 0 0 6px;
  }
  p:last-child {
    margin: 0;
  }
`

export const Empty = styled.span`
  color: ${T.muted};
`

export const Notice = styled.p<{ $error?: boolean }>`
  font-size: 12.5px;
  margin: 0;
  color: ${(p) => (p.$error ? T.dangerDk : T.successDk)};
`

export const Dirty = styled.span`
  font-size: 12px;
  color: ${T.muted};
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`

export const Muted = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 0 0 14px;
`
