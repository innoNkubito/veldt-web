'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 24px 0;
`

export const RequiredNote = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 0 0 18px;
`

export const Banner = styled.div`
  font-size: 13.5px;
  line-height: 1.5;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
  background: ${T.dangerLt};
  border: 1px solid ${T.dangerBd};
  color: ${T.dangerDk};
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
`

export const Button = styled.button<{ $secondary?: boolean }>`
  display: inline-flex;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${T.terra};
  background: ${(p) => (p.$secondary ? 'transparent' : T.terra)};
  color: ${(p) => (p.$secondary ? T.terra : T.onBrand)};

  &:hover:not(:disabled) {
    background: ${(p) => (p.$secondary ? T.terraLt : T.terraDk)};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`

export const Privacy = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${T.muted};
  margin: 16px 0 0;
`
