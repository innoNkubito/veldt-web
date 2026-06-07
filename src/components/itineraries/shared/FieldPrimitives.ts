import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Field = styled.div``

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
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${T.terra};
  }
`

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${T.terra};
  }
`

export const FieldSelect = styled.select`
  width: 100%;
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
`

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
`

export const SmallButton = styled.button<{ $primary?: boolean }>`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  ${({ $primary }) =>
    $primary
      ? `background: ${T.terra}; color: #fff; border: none;`
      : `background: transparent; color: ${T.sub}; border: 1px solid ${T.border};`}
`
