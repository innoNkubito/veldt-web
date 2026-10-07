import styled from '@emotion/styled'
import { T } from '@/lib/theme'

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
