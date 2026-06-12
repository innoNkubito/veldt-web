import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// ── Full-width editor shell ──────────────────────────────────────

export const EditorRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${T.bg};
`

/** Sticky top bar — replaces the platform TopNav + Sidebar for this page */
export const EditorTopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid ${T.border};
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`

export const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`

export const BackBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${T.border};
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${T.sub};
  flex-shrink: 0;
  transition: border-color 0.12s, color 0.12s;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

export const TopBarTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${T.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TopBarSub = styled.div`
  font-size: 11px;
  color: ${T.muted};
  margin-top: 1px;
`

export const TopBarTabs = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
`

export const TopBarTab = styled.button<{ $active: boolean }>`
  padding: 8px 18px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? T.text : T.muted)};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? T.terra : 'transparent')};
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: color 0.15s;
  white-space: nowrap;
  &:hover { color: ${T.text}; }
`

export const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`

export const SavingBadge = styled.span`
  font-size: 11px;
  color: ${T.muted};
`

export const TopBarBtn = styled.button<{ $danger?: boolean }>`
  padding: 6px 14px;
  background: none;
  border: 1px solid ${({ $danger }) => ($danger ? '#fca5a5' : T.border)};
  border-radius: 7px;
  color: ${({ $danger }) => ($danger ? '#dc2626' : T.sub)};
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.12s;
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fef2f2' : T.dim)};
  }
`

export const PreviewBtn = styled.button`
  padding: 6px 16px;
  background: ${T.terra};
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
`

export const EditorBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

// Used by Details + Rooms tabs (padded container)
export const TabBody = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`

export const CenteredState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: ${T.muted};
  font-size: 13px;
`

// ── Shared form components ──────────────────────────────────────

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
  @media (max-width: 700px) { grid-template-columns: 1fr; }
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

export const AreaSearch = styled.div`
  position: relative;
`

export const AreaDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0; right: 0;
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
  right: 10px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: ${T.muted}; cursor: pointer;
  font-size: 14px; line-height: 1; padding: 0;
`

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
  background: none; border: none;
  color: ${T.teal}; cursor: pointer;
  padding: 0; font-size: 13px; line-height: 1;
  opacity: 0.7;
  &:hover { opacity: 1; }
`

export const TagInput = styled.input`
  border: none; outline: none; background: none;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: ${T.text}; min-width: 80px; flex: 1;
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

// ── Section editor (Rich Content tab) ──────────────────────────

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

export const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
`

export const ImageThumb = styled.div<{ $url: string }>`
  width: 80px; height: 60px;
  background: ${({ $url }) => `url(${$url}) center/cover`};
  border-radius: 6px;
  border: 1px solid ${T.border};
  position: relative; flex-shrink: 0;
`

export const ImageRemove = styled.button`
  position: absolute; top: -6px; right: -6px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #dc2626; color: #fff; border: none;
  cursor: pointer; font-size: 11px;
  display: flex; align-items: center; justify-content: center; line-height: 1;
`

export const AddImageBtn = styled.label`
  width: 80px; height: 60px;
  border: 2px dashed ${T.border};
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: ${T.muted};
  cursor: pointer; flex-shrink: 0;
  transition: border-color 0.12s;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

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
  background: ${T.bg}; color: ${T.text};
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  outline: none;
  &:focus { border-color: ${T.terra}; }
  &::placeholder { color: ${T.dim}; }
`

export const IconBtn = styled.button`
  background: none; border: none;
  color: ${T.muted}; cursor: pointer;
  font-size: 16px; padding: 2px 4px; line-height: 1;
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
  background: ${T.card}; color: ${T.text};
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  outline: none; cursor: pointer;
`

export const AddSectionBtn = styled.button`
  padding: 8px 16px;
  background: none;
  border: 1px solid ${T.terra};
  border-radius: 7px;
  color: ${T.terra};
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: ${T.terraLt}; }
`

// ── Rooms tab ───────────────────────────────────────────────────

export const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: ${T.tealLt};
  border: 1px solid ${T.teal};
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 13px;
  color: ${T.text};
  margin-bottom: 20px;
`

export const InfoIcon = styled.div`
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid ${T.teal}; color: ${T.teal};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  flex-shrink: 0; margin-top: 1px;
`

export const RoomsIntro = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 24px 28px;
  margin-bottom: 20px;
`

export const RoomsIntroTitle = styled.div`
  font-size: 18px; font-weight: 700; color: ${T.text}; margin-bottom: 6px;
`

export const RoomsIntroDesc = styled.div`
  font-size: 13px; color: ${T.sub}; line-height: 1.6;
  margin-bottom: 20px; padding-bottom: 20px;
  border-bottom: 1px solid ${T.border};
`

export const RoomsList = styled.div`
  display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;
`

export const RoomCard = styled.div`
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 10px;
  padding: 16px 20px;
  display: flex; align-items: center; gap: 16px;
`

export const RoomCardLeft = styled.div`
  flex: 1; min-width: 0;
`

export const RoomType = styled.div`
  font-weight: 600; font-size: 14px; color: ${T.text};
`

export const RoomMeta = styled.div`
  font-size: 12px; color: ${T.muted}; margin-top: 3px; display: flex; gap: 10px;
`

export const RoomActions = styled.div`
  display: flex; gap: 6px; flex-shrink: 0;
`

export const RoomActionBtn = styled.button`
  padding: 5px 12px;
  border: 1px solid ${T.border};
  border-radius: 6px; background: none;
  font-size: 12px; color: ${T.sub};
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

export const RoomDeleteBtn = styled(RoomActionBtn)`
  &:hover { border-color: #fca5a5; color: #dc2626; }
`

export const AddNewRoomBtn = styled.button`
  display: block; width: 100%; padding: 12px;
  background: ${T.teal}; color: #fff;
  border: none; border-radius: 8px;
  font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
`

// ── Room modal ──────────────────────────────────────────────────

export const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px;
`

export const RoomModal = styled.div`
  background: ${T.card};
  border-radius: 14px;
  width: 560px; max-width: 100%; max-height: 90vh;
  display: flex; flex-direction: column; overflow: hidden;
`

export const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${T.border};
`

export const ModalTitle = styled.div`
  font-size: 16px; font-weight: 700; color: ${T.text};
`

export const ModalCloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: ${T.muted}; font-size: 20px; line-height: 1; padding: 2px;
  &:hover { color: ${T.text}; }
`

export const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto; flex: 1;
  display: flex; flex-direction: column; gap: 18px;
`

export const ModalFooter = styled.div`
  display: flex; align-items: center; justify-content: flex-end;
  gap: 8px; padding: 14px 24px;
  border-top: 1px solid ${T.border};
`

export const ModalCancelBtn = styled.button`
  padding: 8px 18px; background: none;
  border: 1px solid ${T.border}; border-radius: 7px;
  color: ${T.sub}; font-size: 13px;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
`

export const ModalSaveBtn = styled.button`
  padding: 8px 22px;
  background: ${T.teal}; color: #fff;
  border: none; border-radius: 7px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: default; }
`

export const PhotoUploadZone = styled.label`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; border: 2px dashed ${T.border}; border-radius: 8px; padding: 20px;
  cursor: pointer; transition: border-color 0.12s;
  &:hover { border-color: ${T.teal}; }
`

export const PhotoUploadBtn = styled.div`
  padding: 7px 18px;
  border: 1px solid ${T.border}; border-radius: 6px;
  font-size: 13px; font-weight: 500;
  color: ${T.sub}; background: ${T.card};
`

export const PhotoUploadNote = styled.div`
  font-size: 11px; color: ${T.muted}; text-align: center;
`

export const PhotoGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;
`

export const PhotoThumb = styled.div<{ $url: string }>`
  width: 72px; height: 56px;
  background: ${({ $url }) => `url(${$url}) center/cover`};
  border-radius: 6px; border: 1px solid ${T.border};
  position: relative; flex-shrink: 0;
`

export const PhotoRemove = styled.button`
  position: absolute; top: -5px; right: -5px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #dc2626; color: #fff; border: none;
  cursor: pointer; font-size: 10px;
  display: flex; align-items: center; justify-content: center;
`

export const VideoRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr auto;
  gap: 8px; align-items: center;
`

export const AddVideoBtn = styled.button`
  background: none; border: none;
  color: ${T.teal}; font-size: 13px;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  padding: 4px 0; text-align: left;
  &:hover { text-decoration: underline; }
`

// ── New Page — 3-column layout ──────────────────────────────────

/** ToC | Cover | Sections */
export const PageViewLayout = styled.div`
  display: grid;
  grid-template-columns: 160px 504px 1fr;
  min-height: calc(100vh - 56px);
`

// ── Table of Contents ───────────────────────────────────────────

export const PageToC = styled.nav`
  position: sticky;
  top: 56px;
  align-self: start;
  height: calc(100vh - 56px);
  padding: 28px 16px 28px 20px;
  border-right: 1px solid ${T.border};
  background: ${T.bg};
  overflow-y: auto;
`

export const ToCTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const ToCItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: ${({ $active }) => ($active ? T.terra : T.sub)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.12s, background 0.12s;
  margin-bottom: 2px;
  background: ${({ $active }) => ($active ? T.terraLt : 'transparent')};
  &:hover { color: ${T.terra}; background: ${T.terraLt}; }

  svg { flex-shrink: 0; opacity: 0.5; }
`

// ── Cover panel ─────────────────────────────────────────────────

export const PageViewCover = styled.div<{ $url?: string }>`
  position: sticky;
  top: 56px;
  align-self: start;
  height: calc(100vh - 56px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $url }) =>
      $url
        ? `url(${$url}) center/cover no-repeat`
        : 'linear-gradient(160deg, #7c5c3e 0%, #3d4a3a 100%)'};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.6) 100%);
  }
`

export const CoverUploadBtn = styled.label`
  position: absolute;
  top: 14px; right: 14px;
  z-index: 2;
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: rgba(0,0,0,0.45);
  color: rgba(255,255,255,0.9);
  border-radius: 20px;
  font-size: 12px; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
  &:hover { background: rgba(0,0,0,0.65); color: #fff; }
`

export const PageViewCoverContent = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 1;
  padding: 32px 28px;
`

export const PageViewCoverBrand = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PageViewCoverTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`

export const PageViewCoverMeta = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.02em;
`

// ── Right sections panel ────────────────────────────────────────

export const PageViewSections = styled.div`
  background: #fff;
  padding: 32px 48px 64px;
  overflow-y: auto;
  min-height: calc(100vh - 56px);
`

export const PageViewSectionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 32px;
`

export const EditContentBtn = styled.button`
  padding: 5px 14px;
  border: 1px solid ${T.border};
  border-radius: 6px;
  background: none;
  font-size: 12px; font-weight: 600;
  color: ${T.sub};
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  &:hover { border-color: ${T.terra}; color: ${T.terra}; }
`

// ── Section view components ─────────────────────────────────────

export const ContentSection = styled.div`
  margin-bottom: 48px;
  scroll-margin-top: 80px;
`

export const ContentSectionTitle = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e3de;
`

export const ContentRichText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 16px;

  p { margin: 0 0 12px; }
  p:last-child { margin-bottom: 0; }
  strong { font-weight: 600; color: #2a2a2a; }
  em { font-style: italic; }
  ul, ol { padding-left: 20px; margin: 0 0 12px; }
  li { margin-bottom: 4px; }
`

// ── Photo slider (view mode) ────────────────────────────────────

export const SliderWrap = styled.div`
  position: relative;
  margin: 18px 0;
  border-radius: 10px;
  overflow: hidden;
  background: #f0ebe4;
  aspect-ratio: 16/9;
`

export const SliderTrack = styled.div<{ $index: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${({ $index }) => -$index * 100}%);
`

export const SliderSlide = styled.div<{ $url: string }>`
  flex: 0 0 100%;
  height: 100%;
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
`

export const SliderArrow = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 12px;
  transform: translateY(-50%);
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
  transition: background 0.15s;
  &:hover { background: rgba(0,0,0,0.65); }
`

export const SliderDots = styled.div`
  position: absolute;
  bottom: 10px; left: 0; right: 0;
  display: flex; align-items: center; justify-content: center; gap: 6px;
`

export const SliderDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 20 : 6)}px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.5)')};
  border: none; cursor: pointer; padding: 0;
  transition: all 0.25s;
`

// ── Fast Facts ──────────────────────────────────────────────────

export const FastFactsGrid = styled.div`
  display: flex;
  flex-direction: column;
`

export const FastFactGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid #e8e3de;
`

export const FastFactGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 180px;
`

export const FastFactGroupIcon = styled.div`
  width: 28px; height: 28px;
  border-radius: 6px;
  background: #f5f0e8;
  display: flex; align-items: center; justify-content: center;
  color: #7c5c3e;
  flex-shrink: 0;
`

export const FastFactGroupLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`

export const FastFactItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const FastFactItem = styled.div`
  font-size: 13px;
  color: #4a4a4a;
  line-height: 1.8;
`

// ── Gallery ──────────────────────────────────────────────────────

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

export const GalleryCell = styled.div<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  outline: ${({ $selected }) => ($selected ? '2px solid #7c5c3e' : '2px solid transparent')};
  outline-offset: -2px;
  transition: outline-color 0.15s;

  &:hover > span {
    opacity: 1;
  }
`

export const GalleryCellImg = styled.div<{ $url: string }>`
  width: 100%; height: 100%;
  background: url(${({ $url }) => $url}) center / cover no-repeat;
`

export const GalleryCellCheck = styled.span<{ $selected: boolean }>`
  position: absolute;
  top: 8px; left: 8px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? '#7c5c3e' : 'rgba(255,255,255,0.85)')};
  border: 2px solid ${({ $selected }) => ($selected ? '#7c5c3e' : 'rgba(0,0,0,0.25)')};
  display: flex; align-items: center; justify-content: center;
  opacity: ${({ $selected }) => ($selected ? 1 : 0)};
  transition: opacity 0.15s, background 0.15s;
  pointer-events: none;
  font-size: 11px;
  color: #fff;
`

export const GalleryDownloadBar = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #e8e3de;
  margin-top: 12px;
  font-size: 13px;
  color: #4a4a4a;
`

export const GalleryDownloadBtn = styled.button`
  padding: 7px 16px;
  background: #7c5c3e;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;

  &:hover { background: #6a4e35; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

export const GallerySelectAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #7c5c3e;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
`

export const EmptyContent = styled.div`
  text-align: center; padding: 40px 20px;
  color: ${T.muted}; font-size: 13px;
`

// ── Accommodation ───────────────────────────────────────────────

export const AccommodationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px; margin-top: 4px;
`

export const AccommodationCard = styled.div`
  border: 1px solid #e8e3de;
  border-radius: 10px; overflow: hidden; background: #fff;
`

export const AccommodationPhoto = styled.div<{ $url: string }>`
  width: 100%; aspect-ratio: 4/3;
  background: ${({ $url }) => `url(${$url}) center/cover`};
`

export const AccommodationCardBody = styled.div`
  padding: 12px 14px;
`

export const AccommodationRoomName = styled.div`
  font-size: 14px; font-weight: 600; color: #1a1a1a;
`

export const AccommodationRoomDesc = styled.div`
  font-size: 12px; color: #4a4a4a; line-height: 1.5; margin-top: 4px;
`

export const AccommodationPhotoCount = styled.div`
  font-size: 11px; color: #999; margin-top: 6px;
`

export const AccommodationRoomList = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-top: 4px;
`

export const AccommodationRoomRow = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border: 1px solid ${T.border}; border-radius: 8px; background: ${T.bg};
`

export const AccommodationRoomThumb = styled.div<{ $url: string }>`
  width: 44px; height: 36px; border-radius: 5px;
  background: ${({ $url }) => `url(${$url}) center/cover`};
  flex-shrink: 0; border: 1px solid ${T.border};
`

// ── Accommodation — document-style view ────────────────────────

export const AccomRoomBlock = styled.div`
  padding: 28px 0;
  border-bottom: 1px solid #e8e3de;

  &:first-child { padding-top: 0; }
  &:last-child { border-bottom: none; padding-bottom: 0; }
`

export const AccomRoomHeading = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
`

export const AccomRoomDescription = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #4a4a4a;
  margin: 0 0 18px;
`

/** 1 photo: full width. 2 photos: equal-width 2-col grid. */
export const AccomPhotoGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => ($count >= 2 ? '1fr 1fr' : '1fr')};
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
`

export const AccomPhoto = styled.div<{ $url: string }>`
  width: 100%;
  aspect-ratio: ${({ }) => '16/10'};
  background: ${({ $url }) => `url(${$url}) center/cover no-repeat`};
  background-color: #e8e3de;
`

// ── Preview modal ───────────────────────────────────────────────

export const PreviewOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 500;
  display: flex; flex-direction: column;
  overflow: hidden;
`

export const PreviewBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 52px;
  background: #1a1a1a;
  flex-shrink: 0;
`

export const PreviewBarTitle = styled.div`
  font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8);
  display: flex; align-items: center; gap: 10px;
`

export const PreviewBadge = styled.span`
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: ${T.terra};
  background: ${T.terraLt}; padding: 3px 8px; border-radius: 20px;
`

export const PreviewCloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.6); font-size: 20px; line-height: 1;
  padding: 4px;
  &:hover { color: #fff; }
`

export const PreviewBody = styled.div`
  flex: 1; overflow-y: auto;
  display: grid;
  grid-template-columns: 456px 1fr;
`

export const PreviewCover = styled.div<{ $url?: string }>`
  position: sticky; top: 0;
  height: calc(100vh - 52px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute; inset: 0;
    background: ${({ $url }) =>
      $url
        ? `url(${$url}) center/cover no-repeat`
        : 'linear-gradient(160deg, #7c5c3e 0%, #3d4a3a 100%)'};
  }

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.6) 100%);
  }
`

export const PreviewCoverContent = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0;
  z-index: 1; padding: 32px 28px;
`

export const PreviewCoverTitle = styled.h2`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 32px; font-weight: 700; color: #fff;
  margin: 0 0 8px; line-height: 1.2;
  text-transform: uppercase; letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`

export const PreviewCoverMeta = styled.div`
  font-size: 12px; color: rgba(255,255,255,0.75); letter-spacing: 0.02em;
`

export const PreviewSections = styled.div`
  background: #fff;
  padding: 40px 56px 80px;
  overflow-y: auto;
`

// ── Rich text editor wrapper ────────────────────────────────────

export const RichEditorWrap = styled.div`
  border: 1px solid ${T.border};
  border-radius: 7px;
  background: ${T.bg};
  overflow: hidden;

  &:focus-within { border-color: ${T.terra}; }

  .tiptap {
    padding: 10px 12px;
    min-height: 100px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.6;
    color: ${T.text};
    outline: none;

    p { margin: 0 0 8px; }
    p:last-child { margin-bottom: 0; }
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${T.dim};
      float: left;
      pointer-events: none;
      height: 0;
    }
    strong { font-weight: 600; }
    em { font-style: italic; }
    ul, ol { padding-left: 18px; margin: 0 0 8px; }
    li { margin-bottom: 3px; }
  }
`

export const RichEditorToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid ${T.border};
  background: ${T.dim};
`

export const RichToolBtn = styled.button<{ $active?: boolean }>`
  width: 28px; height: 28px;
  border-radius: 5px;
  border: none;
  background: ${({ $active }) => ($active ? T.border : 'none')};
  color: ${({ $active }) => ($active ? T.text : T.sub)};
  cursor: pointer; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.1s;
  font-family: 'DM Sans', sans-serif;
  &:hover { background: ${T.border}; color: ${T.text}; }
`

export const RichToolDivider = styled.div`
  width: 1px; height: 16px; background: ${T.border}; margin: 0 4px;
`
