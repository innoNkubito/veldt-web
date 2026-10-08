'use client'

import { LOGO_ACCEPT } from '@/lib/logo'
import * as S from './OperatorBrandCard.styled'
import { useOperatorBrandCard } from './useOperatorBrandCard'
import { COPY, FILE_INPUT_ID } from './OperatorBrandCard.constants'
import type { OperatorBrandCardProps } from './OperatorBrandCard.types'

/**
 * The name and logo stamped on every client-facing itinerary. The name is
 * Veldt's to change; the logo the owner's to set once.
 */
export default function OperatorBrandCard({ canEdit }: OperatorBrandCardProps) {
  const { brand, saving, error, chooseFile } = useOperatorBrandCard()
  if (!brand) return null

  return (
    <S.Section>
      <S.Label>{COPY.label}</S.Label>
      <S.Card>
        <S.LogoBox>
          {brand.logoUrl ? <S.Logo src={brand.logoUrl} alt={brand.name} /> : COPY.noLogo}
        </S.LogoBox>
        <S.Body>
          <S.Name>{brand.name}</S.Name>
          <S.Caption>{COPY.nameCaption}</S.Caption>
          {brand.logoLocked ? (
            <S.Caption>{COPY.locked}</S.Caption>
          ) : canEdit ? (
            <>
              <S.UploadRow>
                <S.UploadButton htmlFor={FILE_INPUT_ID} $disabled={saving}>
                  {saving ? COPY.uploading : COPY.upload}
                </S.UploadButton>
                <S.Caption>{COPY.uploadHint}</S.Caption>
              </S.UploadRow>
              <S.HiddenInput
                id={FILE_INPUT_ID}
                type="file"
                accept={LOGO_ACCEPT}
                disabled={saving}
                onChange={(e) => {
                  chooseFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
              {error && <S.ErrorText>{error}</S.ErrorText>}
            </>
          ) : (
            <S.Caption>{COPY.ownerOnly}</S.Caption>
          )}
        </S.Body>
      </S.Card>
      <S.Hint>{COPY.hint}</S.Hint>
    </S.Section>
  )
}
