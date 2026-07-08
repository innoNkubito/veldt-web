import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Outer wrapper ─────────────────────────────────────────────────

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`

// ── Table shell ───────────────────────────────────────────────────

export const Table = styled.div`
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
  background: ${T.card};
`

// ── Header ────────────────────────────────────────────────────────

export const Header = styled.div`
  display: grid;
  grid-template-columns: 28px 190px 1fr 1fr 36px;
  border-bottom: 1px solid ${T.border};
  background: ${T.bg};
`

export const HeaderCell = styled.div`
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 1px solid ${T.border};

  &:last-child {
    border-right: none;
  }
`

// ── Data row ──────────────────────────────────────────────────────

export const Row = styled.div<{ $last?: boolean }>`
  display: grid;
  grid-template-columns: 28px 190px 1fr 1fr 36px;
  border-bottom: ${({ $last }) => ($last ? 'none' : `1px solid ${T.border}`)};
  min-height: 120px;

  &:hover > * {
    background: #fdfaf6;
  }
`

export const DragCell = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14px;
  color: ${T.muted};
  font-size: 15px;
  cursor: grab;
  user-select: none;
  border-right: 1px solid ${T.border};
  background: ${T.bg};

  &:active {
    cursor: grabbing;
  }
`

// ── Date cell ─────────────────────────────────────────────────────

export const DateCell = styled.div`
  padding: 12px 14px;
  border-right: 1px solid ${T.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DateDisplay = styled.div`
  cursor: pointer;
  flex: 1;

  &:hover .date-label {
    color: ${T.terra};
  }
`

export const DateLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${T.text};
  transition: color 0.12s;
`

export const NightsLabel = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const DatePlaceholder = styled.div`
  font-size: 12px;
  color: ${T.muted};
  font-style: italic;
`

// Inline date edit form
export const DateEditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const DateInput = styled.input`
  width: 100%;
  padding: 5px 8px;
  border: 1px solid ${T.border};
  border-radius: 5px;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  background: ${T.card};
  outline: none;

  &:focus {
    border-color: ${T.teal};
  }

  &::placeholder {
    color: ${T.muted};
  }
`

export const DateEditActions = styled.div`
  display: flex;
  gap: 5px;
`

export const DateEditSave = styled.button`
  flex: 1;
  padding: 4px 0;
  border: none;
  border-radius: 4px;
  background: ${T.terra};
  color: #fff;
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.12s;

  &:hover {
    opacity: 0.85;
  }
`

export const DateEditCancel = styled.button`
  flex: 1;
  padding: 4px 0;
  border: 1px solid ${T.border};
  border-radius: 4px;
  background: none;
  color: ${T.muted};
  font-size: 11px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;

  &:hover {
    color: ${T.text};
  }
`

// ── Content cells (rich text) ─────────────────────────────────────

export const ContentCell = styled.div`
  border-right: 1px solid ${T.border};

  &:last-of-type {
    border-right: none;
  }
`

// ── Actions cell ──────────────────────────────────────────────────

export const ActionsCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
`

export const ActionTrigger = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  border-radius: 5px;
  font-size: 16px;
  color: ${T.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: ${T.dim};
    color: ${T.text};
  }
`

export const ActionDropdown = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  z-index: 50;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 140px;
`

export const ActionItem = styled.button<{ $danger?: boolean }>`
  display: block;
  width: 100%;
  padding: 9px 14px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${({ $danger }) => ($danger ? '#DC2626' : T.text)};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${({ $danger }) => ($danger ? '#fef2f2' : T.dim)};
  }
`

export const ActionBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 49;
`

// ── Add row ───────────────────────────────────────────────────────

export const AddRowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  margin-top: 10px;
  padding: 13px 20px;
  border: 1.5px dashed ${T.border};
  border-radius: 10px;
  background: transparent;
  font-size: 13px;
  color: ${T.muted};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    border-color: ${T.terra};
    color: ${T.terra};
    background: ${T.terraLt};
  }
`

export const AddRowForm = styled.div`
  margin-top: 10px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 14px 16px;
`

export const AddRowFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 10px;
  margin-bottom: 10px;
`

export const AddRowFieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${T.muted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
`

export const AddRowInput = styled.input`
  width: 100%;
  padding: 7px 10px;
  border: 1px solid ${T.border};
  border-radius: 6px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  background: ${T.bg};
  outline: none;

  &:focus {
    border-color: ${T.teal};
  }

  &::placeholder {
    color: ${T.muted};
  }
`

export const AddRowFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const AddRowSave = styled.button`
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: ${T.terra};
  color: #fff;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.12s;

  &:hover {
    opacity: 0.85;
  }
`

export const AddRowCancel = styled.button`
  padding: 6px 14px;
  border: 1px solid ${T.border};
  border-radius: 6px;
  background: none;
  color: ${T.muted};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;

  &:hover {
    color: ${T.text};
  }
`

// ── Property tagger ───────────────────────────────────────────────

export const TaggerWrap = styled.div`
  position: relative;
  padding: 8px 12px;
  border-top: 1px dashed ${T.border};
`

export const TaggerChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`

export const TaggerChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${T.terraLt};
  color: ${T.terra};
  border: 1px solid rgba(124, 92, 62, 0.15);
  border-radius: 5px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
`

export const TaggerChipRemove = styled.button`
  background: none;
  border: none;
  color: ${T.terra};
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  padding: 0;
  opacity: 0.5;
  font-family: inherit;
  &:hover { opacity: 1; }
`

export const TaggerAddBtn = styled.button`
  font-size: 11.5px;
  color: ${T.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.12s;
  &:hover { color: ${T.terra}; }
`

export const TaggerDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  width: 288px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
`

export const TaggerSearch = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid ${T.border};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  box-sizing: border-box;
  &::placeholder { color: ${T.muted}; }
`

export const TaggerList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`

export const TaggerListItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: none;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  text-align: left;
  cursor: pointer;
  &:hover { background: ${T.dim}; }
`

export const TaggerMeta = styled.span`
  font-size: 11px;
  color: ${T.muted};
  flex-shrink: 0;
`

export const TaggerEmpty = styled.div`
  padding: 12px;
  font-size: 13px;
  color: ${T.muted};
  font-style: italic;
`

export const TaggerBackRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid ${T.border};
  background: ${T.bg};
`

export const TaggerBack = styled.button`
  background: none;
  border: none;
  color: ${T.terra};
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`

export const TaggerBackLabel = styled.span`
  font-size: 12px;
  color: ${T.muted};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

// ── Empty state ───────────────────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 80px 20px;
  color: ${T.muted};
  font-size: 13px;
  text-align: center;
`
