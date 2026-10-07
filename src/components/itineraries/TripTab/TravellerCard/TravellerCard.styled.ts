import styled from '@emotion/styled'
import { T } from '@/lib/theme'

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
