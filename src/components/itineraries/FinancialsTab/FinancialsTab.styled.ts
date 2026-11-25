'use client'

import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const Nav = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const NavLink = styled.button`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: ${T.card};
  font-family: 'DM Sans', sans-serif;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${T.terra};
  }
  &:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }
`

export const NavLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
`

export const NavHint = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

/** One section of the tab, with a heading. scroll-margin keeps it clear of the header when jumped to. */
export const Section = styled.section`
  scroll-margin-top: 24px;
`

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${T.border};
`

export const SectionTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
  outline: none;
`

export const SectionHint = styled.span`
  font-size: 12px;
  color: ${T.muted};
`
