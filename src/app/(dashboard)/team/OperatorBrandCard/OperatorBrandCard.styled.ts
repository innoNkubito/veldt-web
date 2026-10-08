import styled from '@emotion/styled'
import { T } from '@/lib/theme'

export const Section = styled.div`
  margin-bottom: 36px;
`

export const Label = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${T.muted};
  margin-bottom: 14px;
`

export const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: ${T.card};
  border: 1px solid ${T.border};
  border-radius: 12px;
  padding: 20px 22px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const LogoBox = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 72px;
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

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const Name = styled.div`
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 18px;
  color: ${T.text};
`

export const Caption = styled.div`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.5;
`

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
`

export const UploadButton = styled.label<{ $disabled: boolean }>`
  display: inline-block;
  padding: 7px 14px;
  border-radius: 7px;
  border: 1px solid ${T.terra};
  color: ${T.terra};
  font-size: 12.5px;
  font-weight: 600;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};

  &:hover {
    background: ${(p) => (p.$disabled ? 'transparent' : T.terraLt)};
  }
`

export const HiddenInput = styled.input`
  display: none;
`

export const ErrorText = styled.div`
  font-size: 12.5px;
  color: ${T.dangerDk};
`

export const Hint = styled.p`
  font-size: 12px;
  color: ${T.muted};
  line-height: 1.5;
  margin: 10px 0 0;
`
