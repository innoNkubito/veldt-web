'use client'

import styled from '@emotion/styled'
import Link from 'next/link'
import { T } from '@/lib/theme'

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  padding: 40px 20px 80px;
`

export const Shell = styled.main`
  max-width: 640px;
  margin: 0 auto;
`

export const BackLink = styled(Link)`
  display: inline-block;
  color: ${T.sub};
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    color: ${T.terra};
  }
`

export const Pretitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 8px;
`

export const Title = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 10px;
  line-height: 1.15;
`

export const Intro = styled.p`
  font-size: 14.5px;
  color: ${T.sub};
  line-height: 1.6;
  margin: 0 0 28px;
  white-space: pre-line;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`

export const FormList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FormItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 18px 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const FormName = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  color: ${T.text};
`

export const FormMeta = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 3px;
`

export const PrimaryLink = styled(Link)`
  display: inline-flex;
  justify-content: center;
  padding: 11px 20px;
  border-radius: 8px;
  background: ${T.terra};
  color: ${T.onBrand};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: ${T.terraDk};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }
`

export const Centered = styled.div`
  text-align: center;
  padding: 80px 0;
  color: ${T.sub};
  font-size: 14px;
  line-height: 1.6;
`
