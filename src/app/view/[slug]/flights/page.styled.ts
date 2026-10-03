import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  padding: 40px 24px 80px;
`

export const Shell = styled.div`
  max-width: 640px;
  margin: 0 auto;
`

export const BackLink = styled.a`
  display: inline-block;
  color: ${T.sub};
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    color: ${T.terra};
  }
`

export const Pretitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 8px;
`

export const Title = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 10px;
  line-height: 1.15;
`

export const Intro = styled.p`
  font-size: 14px;
  color: ${T.sub};
  line-height: 1.6;
  margin: 0 0 28px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
`

export const Hint = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 6px 0 0;
`

export const FlightRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${T.border};
  font-size: 13.5px;
  color: ${T.text};

  &:first-of-type {
    padding-top: 0;
  }
`

export const RowActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`

export const Empty = styled.div`
  font-size: 13px;
  color: ${T.muted};
  margin-bottom: 12px;
`

export const AddRow = styled.div`
  margin-top: 14px;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ErrorText = styled.div`
  font-size: 13px;
  line-height: 1.5;
  color: ${T.dangerDk};
  margin-bottom: 14px;
`

export const Centered = styled.div`
  text-align: center;
  padding: 80px 0;
  color: ${T.sub};
  font-size: 14px;
  line-height: 1.6;
`
