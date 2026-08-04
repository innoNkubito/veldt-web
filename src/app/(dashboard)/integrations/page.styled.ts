import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page ──────────────────────────────────────────────────────

export const PageRoot = styled.div`
  padding: 2rem;
`

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const PageTitle = styled.div`
  font-family: var(--font-playfair);
  font-size: 28px;
  font-weight: 500;
  color: ${T.text};
  line-height: 1.1;
`

export const PageSubtitle = styled.div`
  font-size: 12.5px;
  color: ${T.muted};
  margin-top: 6px;
`

export const ConnectButton = styled.button<{ $disabled?: boolean }>`
  padding: 9px 18px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'wait' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
`

export const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${T.muted};
  margin: 24px 0 12px;
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

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
  background: ${T.card};
  border: 1px dashed ${T.border};
  border-radius: 10px;
`

// ── Connection cards ──────────────────────────────────────────

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`

export const Card = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`

export const CardName = styled.div`
  font-size: 14.5px;
  font-weight: 600;
  color: ${T.text};
`

export const CardType = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
  margin-top: 2px;
`

export const StatusChip = styled.span<{ $status: string }>`
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
  background: ${({ $status }) =>
    $status === 'ACTIVE' ? '#e5efe4' : $status === 'DISABLED' ? T.dim : '#f7edd8'};
  color: ${({ $status }) =>
    $status === 'ACTIVE' ? '#3d6b39' : $status === 'DISABLED' ? T.muted : '#8a6d1d'};
`

export const ChipStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
`

export const EnvChip = styled.span<{ $live: boolean }>`
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${({ $live }) => ($live ? '#e8eef5' : '#f7edd8')};
  color: ${({ $live }) => ($live ? '#2f5479' : '#8a6d1d')};
  border: 1px solid ${({ $live }) => ($live ? '#c8d8e8' : '#e5d3a6')};
`

export const EnvRow = styled.div`
  display: flex;
  gap: 8px;
`

export const EnvOption = styled.button<{ $active: boolean; $live: boolean }>`
  flex: 1;
  padding: 9px 14px;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
  border: 1.5px solid
    ${({ $active, $live }) => ($active ? ($live ? '#2f5479' : T.terra) : T.border)};
  background: ${({ $active, $live }) =>
    $active ? ($live ? '#e8eef5' : T.terraLt) : T.card};
  color: ${({ $active, $live }) => ($active ? ($live ? '#2f5479' : T.terra) : T.sub)};
`

export const Capabilities = styled.div`
  display: flex;
  gap: 6px;
`

export const CapabilityChip = styled.span`
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 10.5px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

export const CardMeta = styled.div`
  font-size: 11px;
  color: ${T.muted};
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid ${T.border};
`

export const CardActionLink = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  padding: 0;
  color: ${({ $danger }) => ($danger ? '#dc2626' : T.teal)};
  &:hover { text-decoration: underline; }
`

// ── Connect / edit modal ──────────────────────────────────────

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
  width: 480px;
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

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
`

export const FieldInput = styled.input`
  width: 100%;
  padding: 10px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;

  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.muted}; }
`

export const FieldNote = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
`

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${T.text};
  cursor: pointer;
  user-select: none;

  input { accent-color: ${T.terra}; }
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
