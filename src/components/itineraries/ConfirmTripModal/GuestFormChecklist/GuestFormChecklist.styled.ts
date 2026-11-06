'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Fieldset = styled.fieldset`
  border: none;
  margin: 0 0 18px;
  padding: 0;
  min-width: 0;
`

export const Legend = styled.legend`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${T.sub};
  margin-bottom: 4px;
  padding: 0;
`

export const Hint = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  margin: 0 0 8px;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
`

export const Option = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 11px;
  border-radius: 7px;
  border: 1px solid ${(p) => (p.$checked ? T.terra : T.border)};
  background: ${(p) => (p.$checked ? T.terraLt : T.card)};
  cursor: pointer;

  input {
    margin-top: 2px;
    accent-color: ${T.terra};
  }
  &:has(input:focus-visible) {
    outline: 2px solid ${T.teal};
    outline-offset: 1px;
  }
`

export const Name = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const Meta = styled.span`
  display: block;
  font-size: 11.5px;
  color: ${T.muted};
`

export const Muted = styled.p`
  font-size: 12px;
  color: ${T.muted};
  margin: 0;
`
