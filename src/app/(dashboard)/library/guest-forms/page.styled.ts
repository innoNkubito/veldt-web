'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  padding: 2rem;
`

export const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
  margin: 0;
`

export const PageSub = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 6px 0 0;
  max-width: 560px;
  line-height: 1.5;
`

export const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`

export const Toggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: ${T.sub};
  cursor: pointer;
  user-select: none;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`

export const Notice = styled.div<{ $error?: boolean }>`
  font-size: 12.5px;
  border-radius: 7px;
  padding: 10px 13px;
  margin-bottom: 16px;
  background: ${({ $error }) => ($error ? T.dangerLt : T.successLt)};
  border: 1px solid ${({ $error }) => ($error ? T.dangerBd : T.successBd)};
  color: ${({ $error }) => ($error ? T.dangerDk : T.successDk)};
`

export const Muted = styled.p`
  font-size: 12.5px;
  color: ${T.muted};
  margin: 0 0 16px;
`

export const EmptyState = styled.div`
  border: 1px dashed ${T.borderStrong};
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  color: ${T.sub};
  font-size: 13px;
  line-height: 1.6;
  background: ${T.card};
`

export const EmptyTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  color: ${T.text};
  margin-bottom: 6px;
`

export const EmptyAction = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`
