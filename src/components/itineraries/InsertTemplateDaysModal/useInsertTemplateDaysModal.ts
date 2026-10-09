import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { useTemplateStore, type TemplateListItem } from '@/stores/templateStore'
import { AT_END } from './InsertTemplateDaysModal.constants'
import { positionOptions, toPosition } from './InsertTemplateDaysModal.utils'
import type { InsertTemplateDaysModalProps } from './InsertTemplateDaysModal.types'

/** Picks a template and a place, inserts the days, then reloads the itinerary. */
export function useInsertTemplateDaysModal({
  itineraryId,
  rows,
  onClose,
}: InsertTemplateDaysModalProps) {
  const { fetchPickerTemplates, insertDays } = useTemplateStore()
  const refreshItinerary = useBuilderStore((s) => s.refreshItinerary)

  const [choices, setChoices] = useState<TemplateListItem[] | null>(null)
  const [templateId, setTemplateId] = useState('')
  const [position, setPosition] = useState(AT_END)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    fetchPickerTemplates().then((list) => {
      // A template being edited cannot be inserted into itself.
      if (live) setChoices(list.filter((t) => t.id !== itineraryId))
    })
    return () => {
      live = false
    }
  }, [fetchPickerTemplates, itineraryId])

  async function submit() {
    if (!templateId) return
    setSubmitting(true)
    const err = await insertDays(itineraryId, templateId, toPosition(position))
    if (err) {
      setSubmitting(false)
      setError(err)
      return
    }
    await refreshItinerary(itineraryId)
    onClose()
  }

  return {
    choices,
    templateId, setTemplateId,
    position, setPosition,
    positions: positionOptions(rows),
    submitting, error,
    canSubmit: templateId !== '' && !submitting,
    submit,
  }
}
