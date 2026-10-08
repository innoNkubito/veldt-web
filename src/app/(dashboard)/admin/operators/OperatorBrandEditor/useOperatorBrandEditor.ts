import { useEffect, useState } from 'react'
import { useBrandStore } from '@/stores/brandStore'
import { logoFileError } from '@/lib/logo'
import { gqlErrorMessage } from '@/lib/gql-error'
import { isChanged, toDraft } from './OperatorBrandEditor.utils'
import type { BrandDraft, OperatorBrandEditorProps } from './OperatorBrandEditor.types'

/**
 * Loads one operator's brand and saves Veldt's edits. A new logo is uploaded
 * as soon as it's chosen, but only applied on save.
 */
export function useOperatorBrandEditor({ operatorId, onSaved }: OperatorBrandEditorProps) {
  const { fetchAdminBrand, uploadAdminLogo, updateAdminBrand, saving } = useBrandStore()
  const [saved, setSaved] = useState<BrandDraft | null>(null)
  const [draft, setDraft] = useState<BrandDraft | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchAdminBrand(operatorId).then((brand) => {
      if (cancelled || !brand) return
      setSaved(toDraft(brand))
      setDraft(toDraft(brand))
    })
    return () => {
      cancelled = true
    }
  }, [operatorId, fetchAdminBrand])

  function edit(patch: Partial<BrandDraft>) {
    setDraft((d) => (d ? { ...d, ...patch } : d))
    setError(null)
    setJustSaved(false)
  }

  async function chooseFile(file: File | undefined) {
    if (!file) return
    const problem = logoFileError(file)
    if (problem) {
      setError(problem)
      return
    }
    setUploading(true)
    try {
      edit({ logoUrl: await uploadAdminLogo(operatorId, file) })
    } catch (err) {
      setError(gqlErrorMessage(err, 'Could not upload the logo.'))
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!draft) return
    const err = await updateAdminBrand(operatorId, { name: draft.name.trim(), logoUrl: draft.logoUrl })
    setError(err)
    if (err) return
    setSaved({ name: draft.name.trim(), logoUrl: draft.logoUrl })
    setJustSaved(true)
    onSaved()
  }

  return {
    draft,
    edit,
    chooseFile,
    uploading,
    saving,
    error,
    justSaved,
    save,
    canSave: !!draft && !!saved && isChanged(draft, saved) && !!draft.name.trim() && !saving && !uploading,
  }
}
