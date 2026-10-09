import { useState } from 'react'
import { formatTags, parseTags } from './TemplateDetailsModal.utils'
import type { TemplateDetailsModalProps } from './TemplateDetailsModal.types'

export function useTemplateDetailsModal({
  initial,
  onSubmit,
}: Pick<TemplateDetailsModalProps, 'initial' | 'onSubmit'>) {
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description ?? '')
  const [tags, setTags] = useState(formatTags(initial.tags))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!name.trim()) return
    setSubmitting(true)
    const err = await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      tags: parseTags(tags),
    })
    setSubmitting(false)
    setError(err)
  }

  return {
    name, setName,
    description, setDescription,
    tags, setTags,
    submitting, error,
    canSubmit: name.trim().length > 0 && !submitting,
    submit,
  }
}
