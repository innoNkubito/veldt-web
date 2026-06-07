import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const Card = styled.div`
  width: 440px;
  background: ${T.card};
  border-radius: 12px;
  padding: 32px 36px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`

export const Title = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 8px;
`

export const Body = styled.div`
  font-size: 13px;
  color: ${T.sub};
  margin-bottom: 24px;
  line-height: 1.6;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`
