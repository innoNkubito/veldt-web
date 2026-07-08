import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Layout ──────────────────────────────────────────────────────

// Bleeds out of PageRoot's 2rem padding to go full-width
export const PreviewLayout = styled.div`
  margin: 0 -2rem -2rem;
  display: grid;
  grid-template-columns: 180px 1fr;
  min-height: calc(100vh - 200px);
`

// ── Table of Contents ───────────────────────────────────────────

export const PreviewToC = styled.nav`
  position: sticky;
  top: 0;
  align-self: start;
  max-height: calc(100vh - 200px);
  padding: 28px 16px 28px 20px;
  border-right: 1px solid ${T.border};
  background: ${T.bg};
  overflow-y: auto;
`

export const ToCTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const ToCItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.12s, background 0.12s;
  margin-bottom: 2px;
  background: ${({ $active }) => ($active ? T.terraLt : 'transparent')};
  line-height: 1.35;

  &:hover {
    color: ${T.terra};
    background: ${T.terraLt};
  }
`

export const ToCDayNum = styled.span`
  font-size: 10px;
  color: ${T.muted};
  flex-shrink: 0;
`

// ── Main content area ───────────────────────────────────────────

export const PreviewContent = styled.div`
  background: #fff;
  overflow-y: auto;
  min-height: calc(100vh - 200px);
`

// ── Cover card ──────────────────────────────────────────────────

export const PreviewCover = styled.div`
  background: linear-gradient(160deg, #7c5c3e 0%, #3d4a3a 100%);
  padding: 56px 60px 48px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.18);
    pointer-events: none;
  }
`

export const PreviewCoverLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
`

export const PreviewCoverTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 18px;
  line-height: 1.15;
  position: relative;
  z-index: 1;
`

export const PreviewCoverMeta = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`

export const PreviewCoverDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  display: inline-block;
  flex-shrink: 0;
`

// ── Day sections ────────────────────────────────────────────────

export const DaySections = styled.div`
  padding: 48px 60px 80px;
`

export const DaySection = styled.div`
  margin-bottom: 52px;
  scroll-margin-top: 80px;
  padding-bottom: 52px;
  border-bottom: 1px solid ${T.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`

export const DayHeader = styled.div`
  margin-bottom: 24px;
`

export const DayDate = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: #1a1a1a;
  margin-bottom: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e3de;
`

export const DayArea = styled.div`
  font-size: 11px;
  color: ${T.muted};
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 8px;
`

export const DayColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`

export const DayColumn = styled.div``

export const DayColumnLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${T.muted};
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed ${T.border};
`

export const DayRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;

  p {
    margin: 0 0 10px;
  }
  p:last-child {
    margin-bottom: 0;
  }
  p:empty::after {
    content: '';
    display: inline-block;
  }
  strong {
    font-weight: 600;
    color: #2a2a2a;
  }
  em {
    font-style: italic;
  }
  s {
    text-decoration: line-through;
  }
  ul,
  ol {
    padding-left: 20px;
    margin: 0 0 10px;
  }
  li {
    margin-bottom: 4px;
  }
  code {
    background: ${T.dim};
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 12px;
    font-family: monospace;
  }
  blockquote {
    border-left: 3px solid ${T.border};
    margin: 0 0 10px;
    padding-left: 12px;
    color: ${T.sub};
  }

  .mention {
    display: inline-flex;
    align-items: center;
    background: ${T.terraLt};
    color: ${T.terra};
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: default;
    text-decoration: none;
    white-space: nowrap;
  }
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
  line-height: 1.4;
`

export const EmptyDayText = styled.div`
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
`

export const EmptyState = styled.div`
  padding: 60px 60px;
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
`
