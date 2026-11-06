'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  padding: 2rem;
`

export const CenteredState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
`

export const Back = styled(Link)`
  display: inline-block;
  font-size: 12.5px;
  color: ${T.sub};
  text-decoration: none;
  margin-bottom: 10px;

  &:hover {
    color: ${T.terra};
  }
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`

export const Title = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.15;
  margin: 0;
`

export const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Status = styled.span`
  font-size: 12px;
  color: ${T.muted};
`

export const Banner = styled.div<{ $tone: 'info' | 'error' | 'success' | 'warning' }>`
  font-size: 12.5px;
  line-height: 1.5;
  border-radius: 7px;
  padding: 10px 13px;
  margin-bottom: 12px;
  ${({ $tone }) => {
    const tone = {
      info: [T.infoLt, T.infoBd, T.infoDk],
      error: [T.dangerLt, T.dangerBd, T.dangerDk],
      success: [T.successLt, T.successBd, T.successDk],
      warning: [T.warningLt, T.warningBd, T.warningDk],
    }[$tone]
    return `background: ${tone[0]}; border: 1px solid ${tone[1]}; color: ${tone[2]};`
  }}
`

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 28px;
  align-items: start;
  margin-top: 8px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

export const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`

export const Panel = styled.section`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 18px 20px 20px;
`

export const PanelTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 14px;
`

export const FieldIssue = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${T.dangerDk};
`

export const ModeChoices = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const ModeChoice = styled.label<{ $checked: boolean }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 11px 13px;
  border-radius: 9px;
  border: 1px solid ${(p) => (p.$checked ? T.terra : T.border)};
  background: ${(p) => (p.$checked ? T.terraLt : T.card)};
  cursor: pointer;

  input {
    margin-top: 3px;
    accent-color: ${T.terra};
  }
  &:has(input:focus-visible) {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }
`

export const ModeName = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const ModeHint = styled.span`
  display: block;
  font-size: 11.5px;
  line-height: 1.45;
  color: ${T.sub};
  margin-top: 2px;
`

export const FieldList = styled.ol`
  margin: 0 0 14px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Empty = styled.p`
  font-size: 13px;
  color: ${T.muted};
  margin: 0 0 14px;
`

export const PreviewColumn = styled.aside`
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;

  @media (max-width: 1100px) {
    position: static;
    max-height: none;
  }
`

export const PreviewTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${T.sub};
  margin-bottom: 8px;
`
