import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page chrome ────────────────────────────────────────────────

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 0;
  border-bottom: 1px solid ${T.border};
`

export const HeaderLeft = styled.div`
  flex: 1;
  min-width: 0;
`

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${T.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 12px;
  transition: color 0.12s;

  &:hover { color: ${T.terra}; }
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
  line-height: 1.2;
`

export const EditableTitleInput = styled.input`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 500;
  color: ${T.text};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${T.terra};
  outline: none;
  line-height: 1.2;
  min-width: 200px;
  width: 100%;
  max-width: 500px;
  padding: 0 0 2px;
`

export const StatusBadge = styled.span<{ $bg: string; $color: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

export const HeaderMeta = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${T.muted};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: ${T.muted};
  display: inline-block;
`

// ── Header actions ─────────────────────────────────────────────

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const ActionButton = styled.button<{ $variant?: 'primary' | 'outline' | 'ghost'; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;

  ${({ $variant = 'outline' }) =>
    $variant === 'primary'
      ? `
        background: ${T.terra};
        color: #fff;
        border: none;
        &:hover:not(:disabled) { background: #AE6341; }
      `
      : $variant === 'ghost'
      ? `
        background: transparent;
        color: ${T.sub};
        border: none;
        &:hover { background: ${T.dim}; }
      `
      : `
        background: transparent;
        color: ${T.sub};
        border: 1px solid ${T.border};
        &:hover { background: ${T.dim}; }
      `}
`

export const SaveIndicator = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

// ── Tab bar ────────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  gap: 2px;
  border-bottom: 1px solid ${T.border};
  margin-top: 24px;
  margin-bottom: 28px;
`

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.text : T.muted)};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? T.terra : 'transparent')};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: -1px;
  transition: color 0.15s;

  &:hover { color: ${T.text}; }
`

// ── Section card ───────────────────────────────────────────────

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 16px;
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const SectionLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: ${T.muted};
  text-transform: uppercase;
  margin-bottom: 14px;
`

// ── Overview tab ───────────────────────────────────────────────

export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Field = styled.div``

export const FieldLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`

export const FieldInput = styled.input`
  width: 100%;
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &:focus { border-color: ${T.terra}; }
`

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;

  &:focus { border-color: ${T.terra}; }
`

export const FieldSelect = styled.select`
  width: 100%;
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
`

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${T.sub};
  cursor: pointer;
`

// ── Rows tab ───────────────────────────────────────────────────

export const RowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const RowCard = styled.div<{ $dragging?: boolean }>`
  background: ${T.card};
  border: 1px solid ${({ $dragging }) => ($dragging ? T.terra : T.border)};
  border-radius: 10px;
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: ${({ $dragging }) => ($dragging ? '0 4px 16px rgba(0,0,0,0.10)' : 'none')};

  &:hover {
    border-color: ${({ $dragging }) => ($dragging ? T.terra : '#D4C8B4')};
  }
`

export const RowDragHandle = styled.div`
  color: ${T.muted};
  cursor: grab;
  padding-top: 2px;
  font-size: 16px;
  user-select: none;

  &:active { cursor: grabbing; }
`

export const RowContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const RowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

export const RowDayLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${T.terra};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const RowTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
`

export const RowSubtext = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 3px;
`

export const AccommodationChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: ${T.sub};
  background: ${T.dim};
  border-radius: 5px;
  padding: 3px 9px;
  margin-top: 6px;
  margin-right: 5px;
`

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`

export const IconButton = styled.button<{ $color?: string }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 6px;
  color: ${({ $color }) => $color ?? T.muted};
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  transition: background 0.12s;

  &:hover { background: ${T.dim}; }
`

export const AddRowButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 14px 20px;
  border-radius: 10px;
  border: 1.5px dashed ${T.border};
  background: transparent;
  font-size: 13px;
  color: ${T.muted};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  justify-content: center;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    border-color: ${T.terra};
    color: ${T.terra};
    background: ${T.terraLt};
  }
`

// ── Inline row edit form ───────────────────────────────────────

export const RowEditForm = styled.div`
  background: ${T.bg};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 18px 20px;
`

export const RowFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

export const RowFormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

export const SmallButton = styled.button<{ $primary?: boolean }>`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  ${({ $primary }) =>
    $primary
      ? `background: ${T.terra}; color: #fff; border: none;`
      : `background: transparent; color: ${T.sub}; border: 1px solid ${T.border};`}
`

// ── Costs tab ──────────────────────────────────────────────────

export const CostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

export const CostsFullRow = styled.div`
  grid-column: 1 / -1;
`

export const ConfirmRow = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 8px;
  background: ${({ $checked }) => ($checked ? T.sageLt : T.dim)};
  border: 1px solid ${({ $checked }) => ($checked ? T.sage : T.border)};
  cursor: pointer;
  font-size: 13px;
  color: ${T.text};
  transition: background 0.15s, border-color 0.15s;
`

export const ConfirmCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${T.sage};
  cursor: pointer;
`

// ── Empty / loading states ─────────────────────────────────────

export const CenteredState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 10px;
  color: ${T.muted};
  font-size: 13px;
  text-align: center;
`

export const ErrorBanner = styled.div`
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FECACA;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  margin-bottom: 20px;
`

// ── Publish modal ──────────────────────────────────────────────

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const ModalCard = styled.div`
  width: 440px;
  background: ${T.card};
  border-radius: 12px;
  padding: 32px 36px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
`

export const ModalTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
  margin-bottom: 8px;
`

export const ModalBody = styled.div`
  font-size: 13px;
  color: ${T.sub};
  margin-bottom: 24px;
  line-height: 1.6;
`

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`
