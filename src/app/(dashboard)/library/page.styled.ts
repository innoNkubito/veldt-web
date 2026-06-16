import styled from '@emotion/styled'

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
  border-bottom: 2px solid #e8e3de;
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
  color: #1a1a1a;
  margin: 0 0 4px;
`

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #888;
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
  border: 1px solid #e0dbd4;
  border-radius: 8px;
  font-size: 13px;
  color: #1a1a1a;
  background: #fff;
  width: 220px;
  outline: none;

  &::placeholder { color: #aaa; }
  &:focus { border-color: #b8a898; }
`

export const CreateButton = styled.button<{ disabled?: boolean }>`
  height: 36px;
  padding: 0 16px;
  background: #3d2b1f;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover { background: #5a3d2b; }
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
  border-bottom: 2px solid #e8e3de;
  margin-bottom: 2px;
`

export const CategoryLabel = styled.h2`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888;
  margin: 0;
`

export const CategoryCount = styled.span`
  font-size: 11px;
  color: #aaa;
`

// ── Content rows ────────────────────────────────────────────────

export const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 12px;
  border-bottom: 1px solid #f2ede8;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;

  &:hover {
    background: #faf7f4;
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
  color: #1a1a1a;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RowMeta = styled.span`
  font-size: 12.5px;
  color: #888;
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
  background: #f0ebe4;
  color: #6b5744;
  border-radius: 12px;
  white-space: nowrap;
`

export const RowArrow = styled.span`
  font-size: 14px;
  color: #ccc;
  flex-shrink: 0;
`

export const EmptyCategory = styled.div`
  padding: 18px 10px;
  font-size: 13px;
  color: #aaa;
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
  background: #fff;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 480px;
  max-width: calc(100vw - 32px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
`

export const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px;
`

export const ModalLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #888;
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
  border: 1.5px solid ${({ $selected }) => ($selected ? '#3d2b1f' : '#e0dbd4')};
  background: ${({ $selected }) => ($selected ? '#faf5f0' : '#fff')};
  color: ${({ $selected }) => ($selected ? '#3d2b1f' : '#555')};
  font-size: 12.5px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  text-align: center;
  transition: border-color 0.1s, background 0.1s;

  &:hover {
    border-color: #b8a898;
    background: #faf7f4;
  }
`

export const ModalNameInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1.5px solid #e0dbd4;
  border-radius: 8px;
  font-size: 13.5px;
  color: #1a1a1a;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 20px;

  &::placeholder { color: #bbb; }
  &:focus { border-color: #b8a898; }
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
  border: 1px solid #e0dbd4;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;

  &:hover { background: #faf7f4; }
`

// ── Empty / loading states ──────────────────────────────────────

export const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: #aaa;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`
