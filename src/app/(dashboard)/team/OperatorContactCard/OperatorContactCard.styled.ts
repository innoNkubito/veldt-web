import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Section = styled.div`
  margin-bottom: 36px;
`

export const Label = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 20px 22px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const Value = styled.div`
  font-size: 13.5px;
  color: ${T.text};
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`

export const Status = styled.span<{ $error?: boolean }>`
  font-size: 12.5px;
  color: ${(p) => (p.$error ? T.dangerDk : T.successDk)};
`

export const Hint = styled.p`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 10px 0 0;
`
