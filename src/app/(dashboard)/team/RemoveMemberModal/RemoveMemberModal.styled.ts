import styled from '@emotion/styled'
import { T } from '@/lib/theme'

// The modal frame and buttons are the Team page's own, so this dialog matches
// the invite and request-seats modals beside it.
export {
  Overlay,
  Modal,
  ModalTitle,
  ModalSub,
  ModalActions,
  FieldGroup,
  FieldLabel,
  GhostButton,
  DangerButton,
  ResultLine,
} from '../page.styled'

export const Select = styled.select`
  width: 100%;
  padding: 9px 11px;
  border-radius: 7px;
  border: 1px solid ${T.border};
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: ${T.text};
  background: ${T.card};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${T.terra};
  }
`

export const Note = styled.p`
  font-size: 11.5px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 6px 0 0;
`
