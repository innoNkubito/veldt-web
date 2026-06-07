import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 0;
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const ShareMeta = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: ${T.muted};
`

export const ShareInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
