'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const AuthRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;
`

export const WordmarkWrapper = styled.div`
  text-align: center;
  margin-bottom: 4px;
`

export const WordmarkTitle = styled.span`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 700;
  color: ${T.text};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.1;
  display: block;
`

export const WordmarkSubtitle = styled.span`
  font-size: 8.5px;
  font-weight: 700;
  color: ${T.muted};
  letter-spacing: 0.25em;
  text-transform: uppercase;
  display: block;
  margin-top: 4px;
`
