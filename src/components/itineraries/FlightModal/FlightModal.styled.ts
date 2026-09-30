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
  padding: 16px;
`

export const Card = styled.form`
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  overflow-y: auto;
  background: ${T.card};
  border-radius: 12px;
  padding: 28px 32px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 20px;
`

export const Row = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols ?? 2}, 1fr);
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

export const Section = styled.div`
  border-top: 1px solid ${T.border};
  padding-top: 14px;
  margin-top: 4px;
`

export const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
`

export const Hint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 5px 0 0;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.dangerDk};
  margin-top: 8px;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 22px;
`
