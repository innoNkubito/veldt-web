'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.li<{ $invalid: boolean; $section: boolean }>`
  list-style: none;
  border: 1px solid ${(p) => (p.$invalid ? T.dangerBd : T.border)};
  border-left: 3px solid ${(p) => (p.$invalid ? T.danger : p.$section ? T.gold : T.terra)};
  border-radius: 10px;
  background: ${(p) => (p.$section ? T.cardAlt : T.card)};
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const TopRow = styled.div`
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) 170px;
  gap: 10px;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 26px minmax(0, 1fr);
  }
`

export const Number = styled.span`
  align-self: center;
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 14px;
  color: ${T.muted};
  text-align: center;
  padding-top: 18px;
`

export const TypeSlot = styled.div`
  @media (max-width: 640px) {
    grid-column: 2;
  }
`

export const Indented = styled.div`
  padding-left: 36px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

export const OptionsHint = styled.span`
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: ${T.muted};
  margin-left: 6px;
`

export const Issue = styled.p`
  margin: 0;
  padding-left: 36px;
  font-size: 12px;
  color: ${T.dangerDk};
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0 0 36px;
  border-top: 1px solid ${T.border};
  flex-wrap: wrap;

  @media (max-width: 640px) {
    padding-left: 0;
  }
`

export const Tools = styled.div`
  display: flex;
  gap: 2px;
`

export const Tool = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => (p.$danger ? T.danger : T.sub)};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${T.dim};
    color: ${(p) => (p.$danger ? T.dangerDk : T.text)};
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 1px;
  }
`
