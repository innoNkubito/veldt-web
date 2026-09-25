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

export const Card = styled.form`
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
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
  margin: 0 0 6px;
`

export const Sub = styled.p`
  font-size: 12.5px;
  color: ${T.sub};
  line-height: 1.55;
  margin: 0 0 20px;
`

export const FieldGroup = styled.div`
  margin-bottom: 16px;
`

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 6px;
`

export const FieldInput = styled.input`
  width: 100%;
  border: 1px solid ${T.border};
  border-radius: 7px;
  padding: 9px 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};

  &:focus {
    outline: none;
    border-color: ${T.terra};
  }
`

export const Hint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 6px 0 0;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.dangerDk};
  margin-top: 4px;
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 22px;
`
