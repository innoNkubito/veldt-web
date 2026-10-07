import { useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { confirmDialog } from '@/stores/confirmStore'
import { NEW_LINK_DIALOG } from './OverviewTab.constants'
import { formFromItinerary, shareUrl, toUpdateInput } from './OverviewTab.utils'
import type { OverviewForm } from './OverviewTab.types'

/**
 * The Overview form and share-link actions. The form is read from the store
 * once; the page remounts this tab (key) when a different itinerary loads.
 */
export function useOverviewTab() {
  const { itinerary, updateItinerary, regenerateShareLink, saving } = useBuilderStore()
  const [form, setForm] = useState<OverviewForm>(() => formFromItinerary(itinerary))
  const [dirty, setDirty] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)

  function set<K extends keyof OverviewForm>(key: K, value: OverviewForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
    setSaveError(null)
  }

  async function save() {
    if (!itinerary) return
    const err = await updateItinerary(itinerary.id, toUpdateInput(form))
    // On failure the edits stay in the form so they can be corrected and resaved.
    setSaveError(err)
    if (!err) setDirty(false)
  }

  async function newLink() {
    if (!itinerary) return
    if (!(await confirmDialog(NEW_LINK_DIALOG))) return
    setShareError(await regenerateShareLink(itinerary.id))
  }

  const isDraft = itinerary?.status === 'DRAFT'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const link = itinerary && !isDraft ? shareUrl(origin, itinerary.slug) : null

  function copyLink() {
    if (link) navigator.clipboard.writeText(link)
  }

  return {
    itinerary,
    form,
    set,
    dirty,
    saving,
    saveError,
    save,
    canSave: !saving && form.proposalTitle.trim().length > 0,
    link,
    copyLink,
    newLink,
    shareError,
  }
}
