import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Page chrome ─────────────────────────────────────────────────

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 2rem;
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

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid ${T.border};
  gap: 16px;
`

export const PageTitle = styled.h1`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 500;
  color: ${T.text};
  margin: 0;
`

export const HeaderMeta = styled.div`
  font-size: 12px;
  color: ${T.muted};
  margin-top: 4px;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const SaveIndicator = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

export const DeleteButton = styled.button`
  padding: 7px 14px;
  background: none;
  border: 1px solid #fca5a5;
  border-radius: 7px;
  color: #dc2626;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: #fef2f2; }
`

// ── Tabs ────────────────────────────────────────────────────────

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

export const CenteredState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: ${T.muted};
  font-size: 13px;
`

// ── Details tab ─────────────────────────────────────────────────

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

export const FieldGroup = styled.div``

export const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 5px;
`

export const FieldInput = styled.input`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.bg};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: ${T.terra}; }
`

// Cover image

export const CoverPreview = styled.div<{ $url: string }>`
  width: 100%;
  height: 140px;
  background: ${({ $url }) => ($url ? `url(${$url}) center/cover` : T.dim)};
  border-radius: 8px;
  border: 1px solid ${T.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`

export const UploadButton = styled.label`
  display: inline-block;
  padding: 7px 14px;
  background: none;
  border: 1px solid ${T.border};
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: ${T.sub};
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: border-color 0.12s;
  &:hover { border-color: ${T.terra}; }
`

export const UploadNote = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 4px;
`

// Area dropdown

export const AreaSearch = styled.div`
  position: relative;
`

export const AreaDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  z-index: 20;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
`

export const AreaOption = styled.div`
  padding: 9px 12px;
  font-size: 13px;
  color: ${T.text};
  cursor: pointer;
  &:hover { background: ${T.dim}; }
`

export const AreaClear = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${T.muted};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
`

// Tags

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.bg};
  min-height: 38px;
  cursor: text;
`

export const TagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  background: ${T.tealLt};
  color: ${T.teal};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`

export const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${T.teal};
  cursor: pointer;
  padding: 0;
  font-size: 13px;
  line-height: 1;
  opacity: 0.7;
  &:hover { opacity: 1; }
`

export const TagInput = styled.input`
  border: none;
  outline: none;
  background: none;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text};
  min-width: 80px;
  flex: 1;
  &::placeholder { color: ${T.dim}; }
`

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`

export const SaveButton = styled.button`
  padding: 8px 20px;
  background: ${T.terra};
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: default; }
`

// ── Page Content tab (structured JSON editor) ───────────────────

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SectionCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  overflow: hidden;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${T.dim};
  border-bottom: 1px solid ${T.border};
`

export const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${T.sub};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex: 1;
`

export const SectionBody = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.bg};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  min-height: 90px;
  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.dim}; }
`

export const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
`

export const ImageThumb = styled.div<{ $url: string }>`
  width: 80px;
  height: 60px;
  background: ${({ $url }) => `url(${$url}) center/cover`};
  border-radius: 6px;
  border: 1px solid ${T.border};
  position: relative;
  flex-shrink: 0;
`

export const ImageRemove = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dc2626;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`

export const AddImageBtn = styled.label`
  width: 80px;
  height: 60px;
  border: 2px dashed ${T.border};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${T.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.12s;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

// Fast facts

export const GroupCard = styled.div`
  border: 1px solid ${T.border};
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const SmallInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border: 1px solid ${T.border};
  border-radius: 6px;
  background: ${T.bg};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.dim}; }
`

export const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${T.muted};
  cursor: pointer;
  font-size: 16px;
  padding: 2px 4px;
  line-height: 1;
  &:hover { color: ${T.terra}; }
`

export const DangerIconBtn = styled(IconBtn)`
  &:hover { color: #dc2626; }
`

export const AddSectionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 0;
`

export const SectionTypeSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.card};
  color: ${T.text};
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  cursor: pointer;
`

export const AddSectionBtn = styled.button`
  padding: 8px 16px;
  background: none;
  border: 1px solid ${T.terra};
  border-radius: 7px;
  color: ${T.terra};
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: ${T.terraLt}; }
`

// ── Rooms tab ───────────────────────────────────────────────────

export const RoomsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const RoomCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 18px 20px;
`

export const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const RoomType = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${T.text};
`

export const RoomActions = styled.div`
  display: flex;
  gap: 6px;
`

export const RoomActionBtn = styled.button`
  padding: 4px 10px;
  border: 1px solid ${T.border};
  border-radius: 6px;
  background: none;
  font-size: 12px;
  color: ${T.sub};
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

export const RoomDeleteBtn = styled(RoomActionBtn)`
  &:hover { border-color: #fca5a5; color: #dc2626; }
`

export const RoomDesc = styled.div`
  font-size: 13px;
  color: ${T.sub};
`

export const AddRoomCard = styled.div`
  border: 2px dashed ${T.border};
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const AddRoomTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${T.sub};
  margin-bottom: 4px;
`

export const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`
