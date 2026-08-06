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
      : 'linear-gradient(160deg, #7c5c3e 0%, #3d4a3a 100%)'};

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
  color: #fff;
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
  background: #fff;
  overflow-y: auto;
  height: 100vh;
  border-left: 1px solid ${T.border};

  @media (max-width: 900px) {
    height: auto;
    overflow-y: visible;
    border-left: none;
  }
`

// ── Cover page block ────────────────────────────────────────────

export const CoverPageBlock = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 900px) {
    min-height: auto;
    padding: 40px 24px;
  }
`

export const CoverPagePretitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${T.terra};
  margin-bottom: 16px;
`

export const CoverPageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 44px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.15;
  margin: 0 0 24px;

  @media (max-width: 900px) {
    font-size: 32px;
  }
`

export const CoverPageDivider = styled.div`
  width: 56px;
  height: 2px;
  background: ${T.terra};
  margin-bottom: 32px;
`

export const CoverPageMetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
`

export const CoverPageMetaRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`

export const CoverPageMetaLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  min-width: 96px;
`

export const CoverPageMetaValue = styled.div`
  font-size: 14px;
  color: ${T.text};
`

export const CoverPageIntro = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${T.sub};
  max-width: 480px;
  margin: 0 0 40px;
`

export const GlanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
`

export const GlanceItem = styled.div`
  background: ${T.bg};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 16px;
`

export const GlanceLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 6px;
`

export const GlanceValue = styled.div`
  font-size: 13px;
  color: ${T.text};
  line-height: 1.5;
`

// ── Info page block ─────────────────────────────────────────────

export const InfoPageBlock = styled.div`
  border-bottom: 1px solid ${T.border};
`

export const InfoPageBody = styled.div`
  padding: 40px 64px 52px;

  @media (max-width: 900px) {
    padding: 32px 24px 40px;
  }
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

  @media (max-width: 900px) {
    padding: 32px 24px 0;
  }
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

  @media (max-width: 900px) {
    padding: 0 24px 40px;
  }
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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
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

// ── Costs (Investment) block ────────────────────────────────────

export const CostsBlock = styled.div`
  padding: 40px 64px 52px;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 900px) {
    padding: 32px 24px 40px;
  }
`

// ── Booking block ─────────────────────────────────────────────

export const BookBlock = styled.div`
  padding: 48px 64px 56px;
  border-bottom: 1px solid ${T.border};
  text-align: center;

  @media (max-width: 900px) {
    padding: 36px 24px 44px;
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
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: #AE6341; }
`

/** Same treatment as BookButton, for external booking links. */
export const BookLink = styled.a`
  display: inline-block;
  padding: 14px 34px;
  border-radius: 8px;
  background: ${T.terra};
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: #AE6341; }
`

export const BookContact = styled.div`
  margin-top: 18px;
  font-size: 13.5px;
  color: ${T.sub};
  white-space: pre-line;
  line-height: 1.6;
`

export const CostsHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  font-style: italic;
  color: ${T.text};
  margin: 0 0 24px;
`

export const CostsCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  overflow: hidden;
`

export const CostsHeader = styled.div`
  background: ${T.cardAlt};
  padding: 20px 28px;
  border-bottom: 1px solid ${T.border};
`

export const CostsPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

export const CostsPrice = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 500;
  color: ${T.text};
`

export const CostsPriceSub = styled.div`
  font-size: 13px;
  color: ${T.muted};
`

export const CostsMeta = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 4px;
`

export const CostsBody = styled.div`
  padding: 24px 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const CostsColumn = styled.div``

export const CostsColumnLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 10px;
`

export const CostsText = styled.div`
  font-size: 13px;
  color: ${T.sub};
  line-height: 1.7;
  white-space: pre-wrap;

  p { margin: 0 0 8px; white-space: normal; }
  p:last-child { margin-bottom: 0; }
  ul, ol { padding-left: 20px; margin: 0 0 8px; white-space: normal; }
  li { margin-bottom: 2px; }
  strong { font-weight: 600; color: ${T.text}; }
  em { font-style: italic; }
`

export const CostsNotes = styled.div`
  padding: 16px 28px;
  border-top: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.muted};
  line-height: 1.6;
  white-space: pre-wrap;

  p { margin: 0 0 8px; white-space: normal; }
  p:last-child { margin-bottom: 0; }
  ul, ol { padding-left: 20px; margin: 0 0 8px; white-space: normal; }
  li { margin-bottom: 2px; }
  strong { font-weight: 600; }
  em { font-style: italic; }
`

export const CostsTBD = styled.div`
  padding: 28px;
  text-align: center;
  font-size: 13px;
  color: ${T.muted};
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
