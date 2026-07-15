import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Header ────────────────────────────────────────────────────

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
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

export const HeaderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const SearchInput = styled.input`
  padding: 9px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  width: 200px;
  font-family: 'DM Sans', sans-serif;

  &::placeholder { color: ${T.muted}; }
`

export const UploadButton = styled.button<{ $disabled?: boolean }>`
  padding: 9px 18px;
  border-radius: 7px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? T.muted : T.terra)};
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? 'wait' : 'pointer')};
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
`

// ── Filters ───────────────────────────────────────────────────

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${T.border};
  margin-bottom: 14px;
`

export const Tab = styled.div<{ $active: boolean }>`
  padding: 10px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  border-bottom: 2px solid ${({ $active }) => ($active ? T.terra : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  user-select: none;
`

export const TabCount = styled.span<{ $active: boolean }>`
  font-size: 10px;
  font-weight: 700;
  background: ${({ $active }) => ($active ? T.terraLt : T.dim)};
  color: ${({ $active }) => ($active ? T.terra : T.muted)};
  padding: 1px 6px;
  border-radius: 10px;
`

export const TagFilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`

export const TagFilterChip = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: 14px;
  border: 1px solid ${({ $active }) => ($active ? T.terra : T.border)};
  background: ${({ $active }) => ($active ? T.terraLt : T.card)};
  font-size: 12px;
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.12s, background 0.12s;
`

// ── Grid ──────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(216px, 1fr));
  gap: 16px;
`

export const CardWrap = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`

export const CardImage = styled.div<{ $url: string }>`
  aspect-ratio: 4/3;
  background: url(${({ $url }) => $url}) center/cover no-repeat, ${T.dim};
  position: relative;
`

export const AppBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(42, 31, 20, 0.65);
  color: #fff;
`

export const CardBody = styled.div`
  padding: 10px 12px 12px;
`

export const CardName = styled.div`
  font-size: 12.5px;
  font-weight: 500;
  color: ${T.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
`

export const CardTag = styled.span`
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

// ── States ────────────────────────────────────────────────────

export const LoadingMessage = styled.div`
  padding: 48px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
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

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: ${T.muted};
  font-size: 13px;
  background: ${T.card};
  border: 1px dashed ${T.border};
  border-radius: 10px;
`

// ── Detail modal ──────────────────────────────────────────────

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
  width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${T.card};
  border-radius: 12px;
  border: 1px solid ${T.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
`

export const ModalImage = styled.div<{ $url: string }>`
  aspect-ratio: 16/10;
  background: url(${({ $url }) => $url}) center/contain no-repeat, #f4efe6;
  border-bottom: 1px solid ${T.border};
`

export const ModalBody = styled.div`
  padding: 20px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const ModalMeta = styled.div`
  font-size: 11.5px;
  color: ${T.muted};
`

export const NameInput = styled.input`
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
  &:disabled { background: ${T.dim}; color: ${T.sub}; }
`

export const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px 13px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  background: ${T.card};

  &:focus-within { border-color: ${T.terra}; }
`

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  background: ${T.dim};
  color: ${T.sub};
  border: 1px solid ${T.border};
`

export const TagRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${T.muted};
  font-size: 12px;
  padding: 0;
  line-height: 1;
  &:hover { color: #dc2626; }
`

export const TagInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 13px;
  color: ${T.text};
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  padding: 3px 0;

  &::placeholder { color: ${T.muted}; }
`

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const CopyButton = styled.button`
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

export const DeleteLink = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #dc2626;
  font-size: 12.5px;
  font-family: 'DM Sans', sans-serif;
  padding: 8px 4px;
  &:hover { text-decoration: underline; }
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
