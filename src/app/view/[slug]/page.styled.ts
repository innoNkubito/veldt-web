import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page shell (loading / not-found states) ─────────────────────

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  font-family: 'DM Sans', sans-serif;
`

export const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 12px;
  color: ${T.muted};
  font-size: 14px;
  text-align: center;
`

export const NotFoundTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  color: ${T.text};
  margin-bottom: 4px;
`

// ── Layout — mirrors PreviewTab (minus ToC) ─────────────────────
// 2 columns: sticky cover panel | scrollable content

export const ViewLayout = styled.div`
  display: grid;
  grid-template-columns: 9fr 11fr;
  height: 100vh;
  overflow: hidden;
  background: ${T.bg};
  font-family: 'DM Sans', sans-serif;

  /* On paper the proposal flows top to bottom: cover page, then content */
  @media print {
    display: block;
    height: auto;
    overflow: visible;
  }

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`

// ── Sticky cover panel ──────────────────────────────────────────

export const CoverPanel = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;

  @media print {
    height: 240mm;
    break-after: page;
  }

  @media (max-width: 900px) {
    height: 320px;
  }
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

export const CoverContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 32px;
`

export const CoverLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 8px;
`

export const CoverTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: ${T.onBrand};
  margin: 0 0 16px;
  line-height: 1.15;
`

export const CoverMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const CoverMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// ── Scrollable content area (col 3) ─────────────────────────────

export const ViewContent = styled.div`
  background: ${T.card};
  overflow-y: auto;
  height: 100vh;
  border-left: 1px solid ${T.border};

  @media print {
    height: auto;
    overflow: visible;
    border-left: none;
  }

  @media (max-width: 900px) {
    height: auto;
    overflow-y: visible;
    border-left: none;
  }
`

// ── Cover page block ────────────────────────────────────────────

// ── Info page block ─────────────────────────────────────────────

// ── Day sections ────────────────────────────────────────────────

// ── Section renderers (shared style matching PageContentTab) ────

// ── Photo slider ────────────────────────────────────────────────

// ── Fast Facts ──────────────────────────────────────────────────

// ── Accommodation rooms ─────────────────────────────────────────

// ── Empty / misc ────────────────────────────────────────────────

// ── Costs (Investment) block ────────────────────────────────────

// ── Booking block ─────────────────────────────────────────────

export const BookBlock = styled.div`
  padding: 48px 64px 56px;
  border-bottom: 1px solid ${T.border};
  text-align: center;

  @media (max-width: 900px) {
    padding: 36px 24px 44px;
  }

  @media print {
    display: none;
  }
`

export const BookHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  font-style: italic;
  color: ${T.text};
  margin: 0 0 14px;
`

export const BookIntro = styled.p`
  font-size: 14.5px;
  line-height: 1.7;
  color: ${T.sub};
  max-width: 480px;
  margin: 0 auto 26px;
`

export const BookButton = styled.button`
  display: inline-block;
  padding: 14px 34px;
  border-radius: 8px;
  border: none;
  background: ${T.terra};
  color: ${T.onBrand};
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: ${T.terraDk}; }
`

/** Same treatment as BookButton, for external booking links. */
export const BookLink = styled.a`
  display: inline-block;
  padding: 14px 34px;
  border-radius: 8px;
  background: ${T.terra};
  color: ${T.onBrand};
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: ${T.terraDk}; }
`

export const BookContact = styled.div`
  margin-top: 18px;
  font-size: 13.5px;
  color: ${T.sub};
  white-space: pre-line;
  line-height: 1.6;
`

// ── Footer ──────────────────────────────────────────────────────

export const Footer = styled.div`
  padding: 24px 64px 40px;
  text-align: center;
  font-size: 11.5px;
  color: ${T.muted};

  @media (max-width: 900px) {
    padding: 24px 24px 40px;
  }
`

export const FooterBrand = styled.span`
  font-weight: 600;
  color: ${T.terra};
`

export const FlightsPrompt = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 64px;
  background: ${T.terraLt};
  border-bottom: 1px solid ${T.border};
  font-size: 13.5px;
  color: ${T.text};

  @media (max-width: 900px) {
    padding: 14px 24px;
  }

  @media print {
    display: none;
  }
`

export const FlightsPromptLink = styled.a`
  font-weight: 600;
  color: ${T.terra};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const OperatorFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 64px 0;
  margin-top: 24px;
  border-top: 1px solid ${T.border};

  @media (max-width: 900px) {
    padding: 24px 24px 0;
  }
`
