import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Layout ──────────────────────────────────────────────────────
// Bleeds out of PageRoot's 2rem padding to go full-width
// 3 columns: ToC | sticky cover panel | scrollable content

export const PreviewLayout = styled.div`
  margin: 0 -2rem -2rem;
  display: grid;
  grid-template-columns: 160px 9fr 11fr;
  min-height: calc(100vh - 200px);
`

// ── Table of Contents ───────────────────────────────────────────

export const PreviewToC = styled.nav`
  position: sticky;
  top: 0;
  align-self: start;
  height: calc(100vh - 200px);
  padding: 24px 8px 24px 16px;
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

export const ToCGroup = styled.div`
  margin-bottom: 16px;
`

export const ToCGroupLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${T.muted};
  opacity: 0.6;
  margin-bottom: 4px;
  padding-left: 8px;
`

export const ToCItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  font-size: 11.5px;
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.12s, background 0.12s;
  margin-bottom: 1px;
  background: ${({ $active }) => ($active ? T.terraLt : 'transparent')};
  line-height: 1.35;

  &:hover {
    color: ${T.terra};
    background: ${T.terraLt};
  }
`

export const ToCDayNum = styled.span`
  font-size: 9px;
  color: ${T.muted};
  flex-shrink: 0;
  min-width: 14px;
`

// ── Sticky cover panel (col 2) ──────────────────────────────────

export const PreviewCoverPanel = styled.div`
  position: sticky;
  top: 0;
  align-self: start;
  height: calc(100vh - 200px);
  overflow: hidden;
`

/** Crossfade layer — two of these sit stacked; we toggle opacity */
export const CoverBgLayer = styled.div<{ $url: string | null; $visible: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.6s ease;

  /* Photo when available, gradient fallback */
  background: ${({ $url }) =>
    $url
      ? `url(${$url}) center/cover no-repeat`
      : `linear-gradient(160deg, ${T.sub} 0%, ${T.text} 100%)`};

  /* Darken overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.60) 100%);
  }
`

export const PreviewCoverContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 32px;
`

export const PreviewCoverLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
`

export const PreviewCoverTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: ${T.onBrand};
  margin: 0 0 16px;
  line-height: 1.15;
`

export const PreviewCoverMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const PreviewCoverMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// ── Scrollable content area (col 3) ─────────────────────────────

export const PreviewContent = styled.div`
  background: ${T.card};
  overflow-y: auto;
  min-height: calc(100vh - 200px);
  border-left: 1px solid ${T.border};
`

// ── Cover page block ────────────────────────────────────────────

// ── Info page block ─────────────────────────────────────────────

// ── Day sections ────────────────────────────────────────────────

// ── Section renderers (shared style matching PageContentTab) ────

// ── Photo slider ────────────────────────────────────────────────

// ── Fast Facts ──────────────────────────────────────────────────

// ── Accommodation rooms ─────────────────────────────────────────

// ── Costs (Investment) block ────────────────────────────────────

// ── Empty / misc ────────────────────────────────────────────────

