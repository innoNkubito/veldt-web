import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  background: ${T.bg};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 18px 20px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`
