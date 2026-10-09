import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${T.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
`

export const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${T.card};
  border-radius: 12px;
  padding: 30px 34px;
  border: 1px solid ${T.border};
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
`

export const Subtitle = styled.p`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.muted};
  margin: 0 0 22px;
`

export const Hint = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 5px;
`

export const Error = styled.div`
  background: ${T.dangerLt};
  border: 1px solid ${T.dangerBd};
  color: ${T.dangerDk};
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 12.5px;
  margin-bottom: 16px;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
`
