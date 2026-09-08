import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page shell ──────────────────────────────────────────────────

export const PageRoot = styled.div`
  max-width: 1100px;
  margin: 2rem 0;
  padding: 16px 40px 2rem;
  box-sizing: border-box;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 40px;
  margin-bottom: 64px;
  border-bottom: 2px solid ${T.border};
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 2rem;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 500;
  color: ${T.text};
  margin: 0 0 4px;
`

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${T.muted};
  margin: 0;
  line-height: 1.5;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 4px;
`

export const SearchInput = styled.input`
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${T.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  width: 220px;
  outline: none;

  &::placeholder { color: ${T.muted}; }
  &:focus { border-color: ${T.muted}; }
`

export const CreateButton = styled.button<{ disabled?: boolean }>`
  height: 36px;
  padding: 0 16px;
  background: ${T.text};
  color: ${T.onBrand};
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover { background: ${T.text}; }
`

// ── Category section ────────────────────────────────────────────

export const CategorySection = styled.div`
  margin-bottom: 36px;
`

export const CategoryHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 2px solid ${T.border};
  margin-bottom: 2px;
`

export const CategoryLabel = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${T.muted};
  margin: 0;
`

export const CategoryCount = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

// ── Content rows ────────────────────────────────────────────────

export const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 12px;
  border-bottom: 1px solid ${T.dim};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;

  &:hover {
    background: ${T.bg};
  }
`

export const TypeBadge = styled.span<{ $bg: string; $fg: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  min-width: 72px;
  text-align: center;
`

export const RowName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${T.text};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RowMeta = styled.span`
  font-size: 12.5px;
  color: ${T.muted};
  flex-shrink: 0;
  width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RowTags = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`

export const TagChip = styled.span`
  font-size: 10.5px;
  padding: 2px 7px;
  background: ${T.dim};
  color: ${T.sub};
  border-radius: 12px;
  white-space: nowrap;
`

export const RowArrow = styled.span`
  font-size: 24px;
  color: ${T.border};
  flex-shrink: 0;
`

export const EmptyCategory = styled.div`
  padding: 18px 10px;
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
`

// ── Modal ───────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalCard = styled.div`
  background: ${T.card};
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 480px;
  max-width: calc(100vw - 32px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
`

export const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 20px;
`

export const ModalLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${T.muted};
  margin: 0 0 10px;
`

// Type picker grid
export const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
`

export const TypeOption = styled.button<{ $selected: boolean }>`
  padding: 10px 8px;
  border-radius: 8px;
  border: 1.5px solid ${({ $selected }) => ($selected ? T.text : T.border)};
  background: ${({ $selected }) => ($selected ? T.bg : T.card)};
  color: ${({ $selected }) => ($selected ? T.text : T.sub)};
  font-size: 12.5px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  text-align: center;
  transition: border-color 0.1s, background 0.1s;

  &:hover {
    border-color: ${T.muted};
    background: ${T.bg};
  }
`

export const ModalNameInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1.5px solid ${T.border};
  border-radius: 8px;
  font-size: 13.5px;
  color: ${T.text};
  outline: none;
  box-sizing: border-box;
  margin-bottom: 20px;

  &::placeholder { color: ${T.muted}; }
  &:focus { border-color: ${T.muted}; }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

export const CancelButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background: none;
  border: 1px solid ${T.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;

  &:hover { background: ${T.bg}; }
`

// ── Empty / loading states ──────────────────────────────────────

export const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: ${T.muted};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`
