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
  width: 480px;
  background: ${T.card};
  border-radius: 12px;
  padding: 32px 36px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
`

export const Header = styled.div`
  margin-bottom: 24px;
`

export const Title = styled.div`
  font-family: var(--font-playfair);
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 4px;
`

export const Subtitle = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`

export const FieldInput = styled.input`
  width: 100%;
  padding: 10px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`

export const CancelButton = styled.button`
  padding: 9px 20px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
`

export const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  padding: 9px 22px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
`
