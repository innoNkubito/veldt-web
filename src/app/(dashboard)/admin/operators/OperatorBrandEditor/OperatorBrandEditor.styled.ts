import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const LogoBox = styled.div`
  width: 96px;
  height: 56px;
  border: 1px dashed ${T.border};
  border-radius: 8px;
  background: ${T.dim};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 11px;
  color: ${T.muted};
`

export const Logo = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

export const UploadButton = styled.label<{ $disabled: boolean }>`
  font-size: 12.5px;
  font-weight: 600;
  color: ${T.teal};
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
`

export const LinkButton = styled.button`
  font-size: 12.5px;
  color: ${T.dangerDk};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`

export const HiddenInput = styled.input`
  display: none;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
`

export const Status = styled.span<{ $error?: boolean }>`
  font-size: 12.5px;
  color: ${(p) => (p.$error ? T.dangerDk : T.successDk)};
`

export const Hint = styled.p`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 8px 0 0;
`
