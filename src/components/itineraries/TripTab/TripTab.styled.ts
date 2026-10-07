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

export const Empty = styled.div`
  font-size: 13px;
  color: ${T.sub};
  line-height: 1.6;
  padding: 18px 0 6px;
`
