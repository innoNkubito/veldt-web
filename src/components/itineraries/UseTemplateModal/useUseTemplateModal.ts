import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTemplateStore } from '@/stores/templateStore'
import type { AdvisorOption } from '@/stores/templateStore'
import { ITINERARY_PATH } from './UseTemplateModal.constants'
import { defaultAdvisorId } from './UseTemplateModal.utils'
import type { TemplateChoice, UseTemplateModalProps } from './UseTemplateModal.types'

/**
 * Creates a draft itinerary from a template and opens it. With no template
 * passed in, loads the picker list first. The advisor defaults to you.
 */
export function useUseTemplateModal({ template }: Pick<UseTemplateModalProps, 'template'>) {
  const router = useRouter()
  const { createFromTemplate, fetchPickerTemplates, fetchAdvisors } = useTemplateStore()

  const [choices, setChoices] = useState<TemplateChoice[] | null>(template ? [template] : null)
  const [templateId, setTemplateId] = useState(template?.id ?? '')
  const [proposalTitle, setProposalTitle] = useState('')
  const [preparedFor, setPreparedFor] = useState('')
  const [startDate, setStartDate] = useState('')
  const [advisors, setAdvisors] = useState<AdvisorOption[]>([])
  const [assignedToId, setAssignedToId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (template) return
    let live = true
    fetchPickerTemplates().then((list) => {
      if (live) setChoices(list)
    })
    return () => {
      live = false
    }
  }, [template, fetchPickerTemplates])

  useEffect(() => {
    let live = true
    fetchAdvisors().then((list) => {
      if (!live) return
      setAdvisors(list)
      setAssignedToId(defaultAdvisorId(list))
    })
    return () => {
      live = false
    }
  }, [fetchAdvisors])

  const selected = choices?.find((choice) => choice.id === templateId) ?? null

  async function submit() {
    if (!templateId) return
    setSubmitting(true)
    const result = await createFromTemplate(templateId, {
      proposalTitle: proposalTitle.trim() || null,
      preparedFor: preparedFor.trim() || null,
      startDate: startDate || null,
      assignedToId: assignedToId || null,
    })
    if (result.ok) {
      router.push(ITINERARY_PATH(result.value))
      return
    }
    setSubmitting(false)
    setError(result.error)
  }

  return {
    choices,
    showPicker: !template,
    selected,
    templateId, setTemplateId,
    proposalTitle, setProposalTitle,
    preparedFor, setPreparedFor,
    startDate, setStartDate,
    advisors,
    // A solo operator has no one else to pick.
    showAdvisorPicker: advisors.length > 1,
    assignedToId, setAssignedToId,
    submitting, error,
    canSubmit: templateId !== '' && !submitting,
    submit,
  }
}
