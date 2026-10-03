import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Block = styled.section`
  padding: 56px 64px;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 900px) {
    padding: 36px 24px;
  }
`

export const Pretitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 12px;
`

export const Heading = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.15;
  margin: 0 0 8px;

  @media (max-width: 900px) {
    font-size: 28px;
  }
`

export const Subline = styled.div`
  font-size: 13px;
  color: ${T.sub};
  margin-bottom: 28px;
`

export const Note = styled.p`
  font-size: 14px;
  color: ${T.sub};
  line-height: 1.6;
  margin: 0 0 28px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
`

export const Card = styled.div<{ $highlight?: boolean }>`
  background: ${(p) => (p.$highlight ? T.terraLt : T.bg)};
  border: 1px solid ${(p) => (p.$highlight ? T.terra : T.border)};
  border-radius: 10px;
  padding: 20px;
`

export const CardLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 10px;
`

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 4px;
`

export const CardText = styled.div`
  font-size: 13px;
  color: ${T.sub};
  line-height: 1.6;
`

export const CardLink = styled.a`
  font-size: 13px;
  color: ${T.terra};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const Emergency = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${T.border};
`

export const EmergencyLine = styled.div`
  font-size: 13px;
  color: ${T.text};
  line-height: 1.6;
`

export const SectionLabel = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.muted};
  margin: 0 0 12px;
`

export const FlightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const FlightRow = styled.div`
  display: grid;
  grid-template-columns: 90px 110px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 12px 16px;
  border: 1px solid ${T.border};
  border-radius: 8px;
  background: ${T.card};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`

export const FlightDirection = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${T.muted};
`

export const FlightCode = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${T.text};
`
