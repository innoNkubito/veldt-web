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
      : 'linear-gradient(160deg, #7c5c3e 0%, #3d4a3a 100%)'};

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
  color: #fff;
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

export const PreviewCoverDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  display: inline-block;
  flex-shrink: 0;
`

// ── Scrollable content area (col 3) ─────────────────────────────

export const PreviewContent = styled.div`
  background: #fff;
  overflow-y: auto;
  min-height: calc(100vh - 200px);
  border-left: 1px solid ${T.border};
`

// ── Info page block ─────────────────────────────────────────────

export const InfoPageBlock = styled.div`
  border-bottom: 1px solid ${T.border};
`

export const InfoPageBody = styled.div`
  padding: 40px 64px 52px;
`

export const InfoPageHeader = styled.div`
  margin-bottom: 32px;
`

export const InfoPageTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
`

// ── Day sections ────────────────────────────────────────────────

export const DayByDayBlock = styled.div`
  border-bottom: 1px solid ${T.border};
`

export const DayByDayHeader = styled.div`
  padding: 40px 64px 0;
  margin-bottom: 36px;
`

export const DayByDayHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  font-style: italic;
  color: ${T.text};
  margin: 0 0 6px;
`

export const DayByDayMeta = styled.div`
  font-size: 12px;
  color: ${T.muted};
`

export const DaySections = styled.div`
  padding: 0 64px 52px;
`

export const DaySection = styled.div`
  margin-bottom: 48px;
  scroll-margin-top: 80px;
  padding-bottom: 48px;
  border-bottom: 1px dashed ${T.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`

export const DayHeader = styled.div`
  margin-bottom: 20px;
`

export const DayDate = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-style: italic;
  color: #1a1a1a;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e3de;
  margin-bottom: 8px;
`

export const DayArea = styled.div`
  font-size: 11px;
  color: ${T.muted};
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
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

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
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

// ── Section renderers (shared style matching PageContentTab) ────

export const ContentSection = styled.div`
  margin-bottom: 44px;
  scroll-margin-top: 80px;
`

export const ContentSectionTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e3de;
`

export const ContentRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 14px;

  p { margin: 0 0 12px; }
  p:last-child { margin-bottom: 0; }
  strong { font-weight: 600; color: #2a2a2a; }
  em { font-style: italic; }
  ul, ol { padding-left: 20px; margin: 0 0 12px; }
  li { margin-bottom: 4px; }
  a { color: ${T.terra}; text-decoration: underline; }
  blockquote {
    border-left: 3px solid ${T.border};
    margin: 0 0 12px;
    padding-left: 14px;
    color: ${T.sub};
    font-style: italic;
  }
`

export const DayRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;

  p { margin: 0 0 10px; }
  p:last-child { margin-bottom: 0; }
  p:empty::after { content: ''; display: inline-block; }
  strong { font-weight: 600; color: #2a2a2a; }
  em { font-style: italic; }
  s { text-decoration: line-through; }
  ul, ol { padding-left: 20px; margin: 0 0 10px; }
  li { margin-bottom: 4px; }
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
    white-space: nowrap;
  }
`

// ── Photo slider ────────────────────────────────────────────────

export const SliderWrap = styled.div`
  position: relative;
  margin: 18px 0;
  border-radius: 10px;
  overflow: hidden;
  background: #f0ebe4;
  aspect-ratio: 16/9;
`

export const SliderTrack = styled.div<{ $index: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${({ $index }) => -$index * 100}%);
`

export const SliderSlide = styled.div<{ $url: string }>`
  flex: 0 0 100%;
  height: 100%;
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
`

export const SliderArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 12px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: background 0.15s;
  &:hover { background: rgba(0, 0, 0, 0.65); }
`

export const SliderDots = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

export const SliderDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 20 : 6)}px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.5)')};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s;
`

// ── Fast Facts ──────────────────────────────────────────────────

export const FastFactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

export const FastFactGroup = styled.div`
  background: ${T.bg};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 14px 16px;
`

export const FastFactGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
`

export const FastFactGroupIcon = styled.span`
  color: ${T.terra};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const FastFactGroupLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${T.text};
`

export const FastFactItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const FastFactItem = styled.li`
  font-size: 12px;
  color: ${T.sub};
  padding: 3px 0;
  border-bottom: 1px dashed ${T.border};
  line-height: 1.45;
  &:last-child { border-bottom: none; }
`

// ── Accommodation rooms ─────────────────────────────────────────

export const AccomRoomBlock = styled.div`
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid ${T.border};
  &:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
`

export const AccomRoomHeading = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 6px;
`

export const AccomRoomDescription = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: ${T.sub};
  margin-bottom: 12px;
`

export const AccomPhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => `repeat(${$count}, 1fr)`};
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/7;
`

export const AccomPhoto = styled.div<{ $url: string }>`
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
  height: 100%;
`

// ── Empty / misc ────────────────────────────────────────────────

export const EmptyContent = styled.div`
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
  padding: 8px 0;
`
