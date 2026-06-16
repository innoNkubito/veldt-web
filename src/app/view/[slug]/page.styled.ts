import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page shell ─────────────────────────────────────────────────

export const PageRoot = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  font-family: 'DM Sans', sans-serif;
`

export const PageInner = styled.div`
  max-width: 780px;
  margin: 0 auto;
  padding: 48px 24px 80px;
`

// ── Hero ───────────────────────────────────────────────────────

export const HeroSection = styled.div`
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${T.border};
`

export const HeroPretitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: ${T.terra};
  text-transform: uppercase;
  margin-bottom: 12px;
`

export const HeroTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 14px;
  line-height: 1.15;
`

export const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 16px;
`

export const HeroMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${T.sub};
`

export const MetaLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${T.muted};
`

// ── Section ────────────────────────────────────────────────────

export const Section = styled.div`
  margin-bottom: 40px;
`

export const SectionHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 20px;
`

// ── Day rows ───────────────────────────────────────────────────

export const DayList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const DayRow = styled.div<{ $last: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0;
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${T.border}`)};
  padding: 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const DayLabelCol = styled.div`
  padding: 24px 20px 24px 0;
  border-right: 1px solid ${T.border};

  @media (max-width: 600px) {
    border-right: none;
    border-bottom: 1px solid ${T.border};
    padding: 16px 0 8px;
  }
`

export const DayLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.terra};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
`

export const NightsLabel = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 3px;
`

export const DayContentCol = styled.div`
  padding: 24px 0 24px 28px;

  @media (max-width: 600px) {
    padding: 12px 0 20px;
  }
`

export const TransferLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${T.sub};
  margin-bottom: 12px;
  font-style: italic;
`

export const AccommodationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AccommodationCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`

export const AccommodationIcon = styled.div`
  font-size: 18px;
  flex-shrink: 0;
`

export const AccommodationName = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
`

export const AccommodationSub = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 2px;
`

// ── Costs ──────────────────────────────────────────────────────

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
`

export const CostsNotes = styled.div`
  padding: 16px 28px;
  border-top: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.muted};
  line-height: 1.6;
  white-space: pre-wrap;
`

export const CostsTBD = styled.div`
  padding: 28px;
  text-align: center;
  font-size: 13px;
  color: ${T.muted};
`

// ── States ─────────────────────────────────────────────────────

export const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

// ── Info page slot sections ────────────────────────────────────

export const InfoPagesSection = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const InfoPageEntry = styled.div`
  padding: 16px 20px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
`

export const InfoPageName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

// ── Footer ─────────────────────────────────────────────────────

export const Footer = styled.div`
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid ${T.border};
  text-align: center;
  font-size: 11.5px;
  color: ${T.muted};
`

export const FooterBrand = styled.span`
  font-weight: 600;
  color: ${T.terra};
`

// ── Document blocks ────────────────────────────────────────────

export const DocPageBlock = styled.div`
  margin-bottom: 56px;
`

export const DocCover = styled.div<{ $url: string; $hasImage: boolean }>`
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ $url, $hasImage }) =>
    $hasImage ? `url(${$url}) center/cover no-repeat` : T.cardAlt};
  margin-bottom: 0;
  display: flex;
  align-items: flex-end;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $hasImage }) =>
      $hasImage
        ? 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
        : 'none'};
  }
`

export const DocCoverContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 28px 32px;
  width: 100%;
`

export const DocCoverSub = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
`

export const DocCoverTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  line-height: 1.15;
`

export const DocCoverMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 6px;
`

export const DocPageBody = styled.div`
  padding: 28px 0 0;
`

export const DocSection = styled.div`
  margin-bottom: 32px;
`

export const DocSectionTitle = styled.h3`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${T.border};
`

export const DocRichText = styled.div`
  font-size: 14px;
  line-height: 1.75;
  color: ${T.sub};

  p { margin: 0 0 10px; }
  p:last-child { margin-bottom: 0; }
  strong { color: ${T.text}; font-weight: 600; }
  em { font-style: italic; }
  ul, ol { padding-left: 20px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  h1, h2, h3, h4 {
    font-family: var(--font-playfair), 'Playfair Display', serif;
    color: ${T.text};
    margin: 16px 0 8px;
  }
`

// ── Slider ─────────────────────────────────────────────────────

export const DocSliderWrap = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 10px;
  overflow: hidden;
  margin: 16px 0;
  background: ${T.dim};
`

export const DocSliderTrack = styled.div<{ $index: number }>`
  display: flex;
  height: 100%;
  width: 100%;
  transform: translateX(${({ $index }) => $index * -100}%);
  transition: transform 0.35s ease;
`

export const DocSliderSlide = styled.div<{ $url: string }>`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  background: url(${({ $url }) => $url}) center/cover no-repeat;
`

export const DocSliderArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 12px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  color: ${T.text};
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  line-height: 1;
  padding-bottom: 2px;

  &:hover { background: #fff; }
`

export const DocSliderDots = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
`

export const DocSliderDot = styled.button<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.45)')};
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
`

// ── Fast Facts ─────────────────────────────────────────────────

export const DocFactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`

export const DocFactGroup = styled.div`
  background: ${T.cardAlt};
  border-radius: 8px;
  padding: 14px 16px;
`

export const DocFactLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 8px;
`

export const DocFactItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const DocFactItem = styled.div`
  font-size: 13px;
  color: ${T.text};
  line-height: 1.4;
`

// ── Gallery ────────────────────────────────────────────────────

export const DocGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const DocGalleryCell = styled.div<{ $url: string }>`
  height: 160px;
  border-radius: 8px;
  background: url(${({ $url }) => $url}) center/cover no-repeat;
  background-color: ${T.dim};
`

// ── Rooms ──────────────────────────────────────────────────────

export const DocRoomBlock = styled.div`
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
  padding: 16px 20px;
`

export const DocRoomHeading = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
  margin-bottom: 8px;
`

export const DocRoomPhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  gap: 8px;
  margin-top: 12px;
`

export const DocRoomPhoto = styled.div<{ $url: string }>`
  height: 180px;
  border-radius: 8px;
  background: url(${({ $url }) => $url}) center/cover no-repeat;
  background-color: ${T.dim};
`

// ── Journey ────────────────────────────────────────────────────

export const DocJourneyHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 24px;
  padding-bottom: 14px;
  border-bottom: 2px solid ${T.border};
`

export const DocDayHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
`

export const DocDayLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${T.terra};
`

export const DocNightsLabel = styled.div`
  font-size: 11px;
  color: ${T.muted};
`

export const DocTransferNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${T.sub};
  font-style: italic;
  margin-bottom: 16px;
  padding: 10px 16px;
  background: ${T.cardAlt};
  border-radius: 8px;
`
