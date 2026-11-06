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
  max-width: 620px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: ${T.card};
  border-radius: 12px;
  border: 1px solid ${T.border};
  overflow: hidden;
`

export const Head = styled.div`
  padding: 22px 26px 14px;
  border-bottom: 1px solid ${T.border};
`

export const FormName = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 4px;
`

export const Title = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
`

export const Meta = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Body = styled.div`
  padding: 18px 26px;
  overflow-y: auto;
`

export const Answers = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: minmax(140px, 40%) 1fr;
  column-gap: 18px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

/** Keeps each question and answer together without breaking the two-column grid. */
export const Pair = styled.div`
  display: contents;
`

export const Question = styled.dt`
  font-size: 12.5px;
  color: ${T.sub};
  padding: 9px 0;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 560px) {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const Answer = styled.dd<{ $blank: boolean }>`
  margin: 0;
  font-size: 13.5px;
  color: ${(p) => (p.$blank ? T.muted : T.text)};
  padding: 9px 0;
  border-bottom: 1px solid ${T.border};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`

export const Note = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${T.muted};
  margin: 14px 0 0;
`

export const EditNote = styled.p`
  font-size: 12.5px;
  color: ${T.sub};
  margin: 0 0 16px;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 20px 0;
`

export const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 26px;
  border-top: 1px solid ${T.border};
  background: ${T.dim};
`

export const FootGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const ErrorText = styled.p`
  font-size: 12.5px;
  color: ${T.dangerDk};
  margin: 0 26px 12px;
`
