'use client'

import { LOGO_ACCEPT } from '@/lib/logo'
import * as Admin from '../../requests/page.styled'
import * as S from './OperatorBrandEditor.styled'
import { useOperatorBrandEditor } from './useOperatorBrandEditor'
import { COPY, FILE_INPUT_ID } from './OperatorBrandEditor.constants'
import type { OperatorBrandEditorProps } from './OperatorBrandEditor.types'

/** Veldt's edit of an operator's watermark: the registered name and logo. */
export default function OperatorBrandEditor(props: OperatorBrandEditorProps) {
  const { draft, edit, chooseFile, uploading, saving, error, justSaved, save, canSave } =
    useOperatorBrandEditor(props)

  return (
    <Admin.Section>
      <Admin.SectionTitle>{COPY.title}</Admin.SectionTitle>
      {!draft ? (
        <S.Hint>{COPY.loading}</S.Hint>
      ) : (
        <>
          <Admin.FieldGrid>
            <Admin.Field>
              <Admin.Label>{COPY.name}</Admin.Label>
              <Admin.Input value={draft.name} onChange={(e) => edit({ name: e.target.value })} />
            </Admin.Field>
            <Admin.Field>
              <Admin.Label>{COPY.logo}</Admin.Label>
              <S.LogoRow>
                <S.LogoBox>
                  {draft.logoUrl ? <S.Logo src={draft.logoUrl} alt={draft.name} /> : COPY.noLogo}
                </S.LogoBox>
                <S.UploadButton htmlFor={FILE_INPUT_ID} $disabled={uploading}>
                  {uploading ? COPY.uploading : COPY.replace}
                </S.UploadButton>
                {draft.logoUrl && (
                  <S.LinkButton type="button" onClick={() => edit({ logoUrl: null })}>
                    {COPY.remove}
                  </S.LinkButton>
                )}
              </S.LogoRow>
              <S.HiddenInput
                id={FILE_INPUT_ID}
                type="file"
                accept={LOGO_ACCEPT}
                disabled={uploading}
                onChange={(e) => {
                  chooseFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </Admin.Field>
          </Admin.FieldGrid>
          <S.Footer>
            <Admin.PrimaryButton $disabled={!canSave} disabled={!canSave} onClick={save}>
              {saving ? COPY.saving : COPY.save}
            </Admin.PrimaryButton>
            {error && <S.Status $error>{error}</S.Status>}
            {justSaved && !error && <S.Status>{COPY.saved}</S.Status>}
          </S.Footer>
        </>
      )}
      <S.Hint>{COPY.hint}</S.Hint>
    </Admin.Section>
  )
}
