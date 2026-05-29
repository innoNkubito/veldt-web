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
