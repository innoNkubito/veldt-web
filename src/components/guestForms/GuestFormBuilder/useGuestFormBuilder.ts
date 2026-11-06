'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { useGuestFormStore } from '@/stores/guestFormStore'
import { FIELD_TYPE_CONFIG, type GuestForm, type GuestFormFieldType } from '@/lib/guestForms'
import { COPY, FORMS_PATH, UNSAVED_PROMPT } from './GuestFormBuilder.constants'
import type { Draft, DraftField, MoveDirection } from './GuestFormBuilder.types'
import { draftIssues, emptyField, moveItem, snapshot, toDraft, toInput, toPreviewFields } from './GuestFormBuilder.utils'

type LoadState = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready' }

/**
 * Everything the builder does: load (a saved form, a starter, or blank),
 * edit the draft, track unsaved changes, and save. Issues are only shown
 * after the first save attempt, so a half-typed question isn't flagged.
 */
export function useGuestFormBuilder(formId: string | null, starterKey: string | null) {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const role = useProfileStore((s) => s.profile?.role)
  const { fetchForm, fetchStarters, createForm, updateForm, saving } = useGuestFormStore()

  const [load, setLoad] = useState<LoadState>({ status: 'loading' })
  const [form, setForm] = useState<GuestForm | null>(null)
  const [draft, setDraft] = useState<Draft>(() => toDraft(null))
  const [baseline, setBaseline] = useState(() => snapshot(toDraft(null)))
  const [showIssues, setShowIssues] = useState(false)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)

  // Load once the GraphQL client is ready.
  useEffect(() => {
    if (!client) return
    let live = true
    const start = (loaded: Draft, saved: GuestForm | null) => {
      if (!live) return
      setForm(saved)
      setDraft(loaded)
      setBaseline(snapshot(saved ? loaded : toDraft(null)))
      setLoad({ status: 'ready' })
    }

    if (formId) {
      fetchForm(formId).then((result) => {
        if (!live) return
        if (result.ok) start(toDraft(result.value), result.value)
        else setLoad({ status: 'error', message: result.error })
      })
    } else if (starterKey) {
      fetchStarters().then((starters) => start(toDraft(starters.find((s) => s.key === starterKey) ?? null), null))
    } else {
      start(toDraft(null), null)
    }
    return () => {
      live = false
    }
  }, [client, formId, starterKey, fetchForm, fetchStarters])

  const dirty = load.status === 'ready' && snapshot(draft) !== baseline

  // Closing or reloading the tab with unsaved work asks first.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = UNSAVED_PROMPT
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const issues = useMemo(() => draftIssues(draft), [draft])
  const previewFields = useMemo(() => toPreviewFields(draft), [draft])

  function edit(patch: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...patch }))
    setMessage(null)
  }

  function editFields(change: (fields: DraftField[]) => DraftField[]) {
    setDraft((d) => ({ ...d, fields: change(d.fields) }))
    setMessage(null)
  }

  const updateField = (key: string, patch: Partial<DraftField>) =>
    editFields((fields) =>
      fields.map((f) => {
        if (f.key !== key) return f
        const next = { ...f, ...patch }
        // Switching to a choice type starts with two options to rename.
        if (patch.type && FIELD_TYPE_CONFIG[patch.type].hasOptions && !f.optionsText.trim()) {
          next.optionsText = emptyField(patch.type).optionsText
        }
        return next
      }),
    )

  async function save() {
    setShowIssues(true)
    if (Object.keys(issues).length > 0) {
      setMessage({ text: COPY.fixIssues, error: true })
      return
    }
    const input = toInput(draft)
    const result = form ? await updateForm(form.id, input) : await createForm(input)
    if (!result.ok) {
      setMessage({ text: result.error, error: true })
      return
    }
    const saved = toDraft(result.value)
    setForm(result.value)
    setDraft(saved)
    setBaseline(snapshot(saved))
    setShowIssues(false)
    setMessage({ text: COPY.saved, error: false })
    if (!form) router.replace(`${FORMS_PATH}/${result.value.id}`)
  }

  return {
    load,
    form,
    draft,
    dirty,
    saving,
    message,
    canEdit: role === 'OWNER' || role === 'ADVISOR',
    issues: showIssues ? issues : {},
    previewFields,
    setName: (name: string) => edit({ name }),
    setDescription: (description: string) => edit({ description }),
    setPerGuest: (perGuest: boolean) => edit({ perGuest }),
    addField: (type: GuestFormFieldType) => editFields((fields) => [...fields, emptyField(type)]),
    updateField,
    moveField: (key: string, direction: MoveDirection) =>
      editFields((fields) => moveItem(fields, fields.findIndex((f) => f.key === key), direction)),
    duplicateField: (key: string) =>
      editFields((fields) => {
        const index = fields.findIndex((f) => f.key === key)
        const copy = { ...fields[index], key: emptyField('SHORT_TEXT').key, id: null }
        return [...fields.slice(0, index + 1), copy, ...fields.slice(index + 1)]
      }),
    removeField: (key: string) => editFields((fields) => fields.filter((f) => f.key !== key)),
    save,
  }
}
