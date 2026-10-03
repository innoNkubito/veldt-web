import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const CostsBlock = styled.div`
  padding: 40px 64px 52px;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 900px) {
    padding: 32px 24px 40px;
  }
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

export const CostsCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  overflow: hidden;
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

export const CostsHeader = styled.div`
  background: ${T.cardAlt};
  padding: 20px 28px;
  border-bottom: 1px solid ${T.border};
`

export const CostsHeading = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 500;
  font-style: italic;
  color: ${T.text};
  margin: 0 0 24px;
`

export const CostsMeta = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 4px;
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

export const CostsPrice = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 500;
  color: ${T.text};
`

export const CostsPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

export const CostsPriceSub = styled.div`
  font-size: 13px;
  color: ${T.muted};
`

export const CostsTBD = styled.div`
  padding: 28px;
  text-align: center;
  font-size: 13px;
  color: ${T.muted};
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

export const CoverPageDivider = styled.div`
  width: 56px;
  height: 2px;
  background: ${T.terra};
  margin-bottom: 32px;
`

export const CoverPageIntro = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${T.sub};
  max-width: 480px;
  margin: 0 0 40px;
`

export const CoverPageMetaLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  min-width: 96px;
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

export const CoverPageMetaValue = styled.div`
  font-size: 14px;
  color: ${T.text};
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

export const DayArea = styled.div`
  font-size: 11px;
  color: ${T.muted};
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

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

export const DayColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

export const DayDate = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-style: italic;
  color: ${T.text};
  padding-bottom: 10px;
  border-bottom: 1px solid ${T.border};
  margin-bottom: 8px;
`

export const DayHeader = styled.div`
  margin-bottom: 20px;
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

export const DaySections = styled.div`
  padding: 0 64px 52px;

  @media (max-width: 900px) {
    padding: 0 24px 40px;
  }
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

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`

export const EmptyContent = styled.div`
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
  padding: 8px 0;
`
