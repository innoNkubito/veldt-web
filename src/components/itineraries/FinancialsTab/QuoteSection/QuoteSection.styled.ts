'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 16px;
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const FullRow = styled.div`
  grid-column: 1 / -1;
`

/** A visibility toggle sitting under a rich-text field. */
export const VisibilityToggle = styled.div`
  margin-top: 6px;
`

export const SaveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`

export const DirtyNote = styled.span`
  font-size: 12px;
  color: ${T.muted};
`

export const FieldHint = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 4px;
`

export const SaveError = styled.div`
  margin-bottom: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${T.dangerLt};
  border: 1px solid ${T.dangerBd};
  color: ${T.dangerDk};
  font-size: 12.5px;
`
