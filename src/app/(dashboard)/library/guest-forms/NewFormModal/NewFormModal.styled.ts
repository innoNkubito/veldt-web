'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${T.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
`

export const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${T.card};
  border-radius: 12px;
  padding: 28px 30px;
  border: 1px solid ${T.border};
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 6px;
`

export const Subtitle = styled.p`
  font-size: 12.5px;
  line-height: 1.5;
  color: ${T.muted};
  margin: 0 0 18px;
`

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Option = styled.button`
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: left;
  padding: 13px 15px;
  border-radius: 9px;
  border: 1px solid ${T.border};
  background: ${T.card};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${T.terra};
    background: ${T.terraLt};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }
`

export const OptionName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

export const OptionMeta = styled.span`
  font-size: 12px;
  line-height: 1.45;
  color: ${T.sub};
`

export const Loading = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 6px 2px 0;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
`
