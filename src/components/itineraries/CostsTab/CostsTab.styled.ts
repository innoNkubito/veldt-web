import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 16px;
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const FullRow = styled.div`
  grid-column: 1 / -1;
`

export const ConfirmRow = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 8px;
  background: ${({ $checked }) => ($checked ? T.sageLt : T.dim)};
  border: 1px solid ${({ $checked }) => ($checked ? T.sage : T.border)};
  cursor: pointer;
  font-size: 13px;
  color: ${T.text};
  transition: background 0.15s, border-color 0.15s;
`

export const ConfirmCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${T.sage};
  cursor: pointer;
`

export const ConfirmNote = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 8px;
`

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`
