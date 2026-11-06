'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const Section = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${T.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`

export const SectionTitle = styled.h3`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 500;
  color: ${T.text};
  margin: 8px 0 0;
`

export const Question = styled.div``

export const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
`

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 4px;
`

export const Legend = Label.withComponent('legend')

export const Required = styled.span`
  color: ${T.danger};
  margin-left: 3px;
`

export const Help = styled.p`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.muted};
  margin: 0 0 8px;
`

const control = `
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border-radius: 8px;
  border: 1px solid ${T.borderStrong};
  background: ${T.card};
  font-family: inherit;
  font-size: 15px;
  color: ${T.text};
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${T.terra};
    box-shadow: 0 0 0 3px ${T.terraLt};
  }

  &:disabled {
    background: ${T.dim};
    cursor: not-allowed;
  }
`

export const Input = styled.input<{ $invalid?: boolean }>`
  ${control}
  ${(p) => (p.$invalid ? `border-color: ${T.danger};` : '')}
  margin-top: 4px;
`

export const Textarea = styled.textarea<{ $invalid?: boolean }>`
  ${control}
  ${(p) => (p.$invalid ? `border-color: ${T.danger};` : '')}
  margin-top: 4px;
  min-height: 96px;
  resize: vertical;
  line-height: 1.5;
`

export const Choices = styled.div<{ $inline?: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.$inline ? 'row' : 'column')};
  gap: 8px;
  margin-top: 6px;
`

export const Choice = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 13px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$checked ? T.terra : T.border)};
  background: ${(p) => (p.$checked ? T.terraLt : T.card)};
  font-size: 14px;
  color: ${T.text};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  input {
    accent-color: ${T.terra};
    margin: 0;
  }

  &:has(input:focus-visible) {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.7;
  }
`

export const Error = styled.p`
  font-size: 12.5px;
  color: ${T.dangerDk};
  margin: 6px 0 0;
`
