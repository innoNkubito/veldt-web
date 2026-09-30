import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 2fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const DateRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
`

export const Hint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 12px 0 0;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.dangerDk};
  margin-top: 10px;
`

export const Group = styled.div`
  & + & {
    margin-top: 22px;
  }
`

export const GroupLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`

export const FlightRow = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid ${T.border};
  border-radius: 8px;
  background: ${T.bg};

  & + & {
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

export const FlightCode = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${T.text};
`

export const FlightAirline = styled.div`
  font-size: 11.5px;
  color: ${T.sub};
  margin-top: 2px;
`

export const Route = styled.div`
  font-size: 13px;
  color: ${T.text};
  font-weight: 600;
`

export const Times = styled.div`
  font-size: 12px;
  color: ${T.sub};
  margin-top: 3px;
  line-height: 1.5;
`

export const Meta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 3px;
`

export const RowActions = styled.div`
  display: flex;
  gap: 6px;
`

export const Empty = styled.div`
  font-size: 13px;
  color: ${T.sub};
  line-height: 1.6;
  padding: 18px 0 6px;
`
