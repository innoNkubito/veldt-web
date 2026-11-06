'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  border: 1px dashed ${T.borderStrong};
  border-radius: 10px;
  padding: 14px 16px 16px;
`

export const Title = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${T.sub};
  margin-bottom: 10px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
`

export const Choice = styled.button`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
  padding: 9px 11px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: ${T.card};
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    border-color: ${T.terra};
    background: ${T.terraLt};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 1px;
  }
`

export const ChoiceName = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.text};
`

export const ChoiceHint = styled.span`
  font-size: 11px;
  line-height: 1.35;
  color: ${T.muted};
`
