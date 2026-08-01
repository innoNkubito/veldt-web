import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Cards / layout ────────────────────────────────────────────

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 16px;
`

export const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${T.border};
`

export const CardTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${T.text};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const CardHint = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin: -8px 0 16px;
  line-height: 1.5;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const FullRow = styled.div`
  grid-column: 1 / -1;
`

export const Spacer = styled.div`
  height: 16px;
`

// ── Mode selector ─────────────────────────────────────────────

export const ModeRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

export const ModeCard = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 180px;
  text-align: left;
  padding: 14px 16px;
  border-radius: 9px;
  border: 1.5px solid ${({ $active }) => ($active ? T.terra : T.border)};
  background: ${({ $active }) => ($active ? T.terraLt : T.card)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s;

  &:hover { border-color: ${T.terra}; }
`

export const ModeName = styled.div<{ $active: boolean }>`
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? T.terra : T.text)};
`

export const ModeDesc = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 4px;
  line-height: 1.4;
`

// ── Callouts ──────────────────────────────────────────────────

export const Callout = styled.div<{ $tone?: 'warn' | 'info' }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12.5px;
  line-height: 1.55;
  margin-bottom: 16px;
  background: ${({ $tone }) => ($tone === 'warn' ? '#f7edd8' : T.dim)};
  border: 1px solid ${({ $tone }) => ($tone === 'warn' ? '#e5d3a6' : T.border)};
  color: ${({ $tone }) => ($tone === 'warn' ? '#7a5f16' : T.sub)};
`

export const CalloutLink = styled.a`
  color: ${T.teal};
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
`

export const ErrorBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 16px;
  border-radius: 8px;
  background: #fbe9e9;
  border: 1px solid #f3c6c6;
  color: #b91c1c;
  font-size: 12.5px;
  white-space: pre-line;
`

export const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
`

// ── Item lists (packages / addons) ────────────────────────────

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid ${T.border};
  border-radius: 9px;
  background: ${T.bg};
`

export const ItemMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const ItemName = styled.div`
  font-size: 13.5px;
  font-weight: 600;
  color: ${T.text};
`

export const ItemDesc = styled.div`
  font-size: 12px;
  color: ${T.sub};
  margin-top: 4px;
  line-height: 1.5;
`

export const ItemMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 6px;
`

export const ItemPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
  white-space: nowrap;
`

export const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;
`

export const LinkButton = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  padding: 0;
  color: ${({ $danger }) => ($danger ? '#dc2626' : T.teal)};
  &:hover { text-decoration: underline; }
`

export const EmptyRow = styled.div`
  padding: 28px 20px;
  text-align: center;
  color: ${T.muted};
  font-size: 12.5px;
  background: ${T.bg};
  border: 1px dashed ${T.border};
  border-radius: 9px;
`

// ── Payment schedule ──────────────────────────────────────────

export const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: 24px 1.4fr 1fr 0.9fr 1fr 28px;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${T.border};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 14px 0;
  }
`

export const ScheduleHeaderRow = styled(ScheduleRow)`
  padding-bottom: 8px;
  border-bottom: 1px solid ${T.border};
`

export const ScheduleHeaderCell = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${T.muted};
`

export const ScheduleIndex = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${T.muted};
`

export const ScheduleLockNote = styled.div`
  font-size: 11px;
  color: ${T.muted};
  font-style: italic;
  padding: 9px 0;
`

export const ScheduleTotalRow = styled.div<{ $valid: boolean }>`
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 7px;
  font-size: 12.5px;
  background: ${({ $valid }) => ($valid ? '#e5efe4' : '#f7edd8')};
  border: 1px solid ${({ $valid }) => ($valid ? '#c3ddc0' : '#e5d3a6')};
  color: ${({ $valid }) => ($valid ? '#3d6b39' : '#7a5f16')};
`

// ── Reminder chips ────────────────────────────────────────────

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

export const ChipRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.muted};
  font-size: 12px;
  padding: 0;
  line-height: 1;
  &:hover { color: #dc2626; }
`

export const ChipInput = styled.input`
  width: 130px;
  padding: 6px 10px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 12.5px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;

  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.muted}; }
`

// ── Toggle rows ───────────────────────────────────────────────

export const ToggleRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: ${T.text};
  cursor: pointer;
  user-select: none;
  padding: 4px 0;

  input { accent-color: ${T.terra}; margin-top: 2px; }
`

export const ToggleLabelText = styled.div`
  line-height: 1.45;
`

export const ToggleHint = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

// ── Save bar ──────────────────────────────────────────────────

export const SaveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0 8px;
`

export const DirtyNote = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-right: auto;
`

// ── Modal ─────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(42, 31, 20, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

export const ModalCard = styled.div`
  width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${T.card};
  border-radius: 12px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const ModalTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 20px;
  font-weight: 500;
  color: ${T.text};
`

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`

export const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: transparent;
  font-size: 12.5px;
  color: ${T.sub};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;

  &:hover { background: ${T.dim}; color: ${T.text}; }
`

export const SaveButton = styled.button<{ $disabled?: boolean }>`
  margin-left: auto;
  padding: 9px 22px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
`
