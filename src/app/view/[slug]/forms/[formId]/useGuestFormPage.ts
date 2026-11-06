'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { routeParam } from '@/lib/guards'
import { gqlErrorMessage } from '@/lib/gql-error'
import {
  GUEST_NAME_FIELD_ID,
  guestIdentityFields,
  type GuestFormValue,
  type GuestFormValues,
} from '@/lib/guestForms'
import { useTripForms } from '../useTripForms'
import { SUBMIT_GUEST_FORM } from '../page.constants'
import { publicClient } from '../page.utils'
import { COPY, ID_PREFIX } from './page.constants'
import { toSubmission, validate } from './page.utils'

/**
 * One form: answers held locally, checked on submit (the API checks again),
 * then a thank-you. For per-guest forms the thank-you offers a fresh copy for
 * the next person in the group.
 */
export function useGuestFormPage() {
  const formId = routeParam(useParams()?.formId)
  const { slug, state } = useTripForms()
  const [values, setValues] = useState<GuestFormValues>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sentFor, setSentFor] = useState<string | null>(null)

  const form = state.phase === 'ready' ? state.forms.find((f) => f.id === formId) ?? null : null
  const identity = guestIdentityFields(form?.perGuest ?? true)

  function setValue(fieldId: string, value: GuestFormValue) {
    setValues((v) => ({ ...v, [fieldId]: value }))
    setErrors((current) => {
      if (!(fieldId in current)) return current
      const next = { ...current }
      delete next[fieldId]
      return next
    })
  }

  /** Moves focus to the first problem so keyboard and screen-reader users land on it. */
  function focusFirst(found: Record<string, string>) {
    const first = [...identity, ...(form?.fields ?? [])].find((f) => found[f.id])
    if (!first) return
    const prefix = identity.some((f) => f.id === first.id) ? ID_PREFIX.identity : ID_PREFIX.fields
    const el =
      document.getElementById(`${prefix}-${first.id}`) ??
      document.querySelector<HTMLInputElement>(`input[name="${prefix}-${first.id}"]`)
    el?.focus()
  }

  async function submit() {
    const client = publicClient()
    if (!form || !client) return
    const found = validate([...identity, ...form.fields], values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setMessage(COPY.fixErrors)
      focusFirst(found)
      return
    }

    setSubmitting(true)
    setMessage(null)
    try {
      await client.request(SUBMIT_GUEST_FORM, { slug, guestFormId: form.id, ...toSubmission(form.fields, values) })
      setSentFor(String(values[GUEST_NAME_FIELD_ID] ?? '').trim())
      window.scrollTo({ top: 0 })
    } catch (err) {
      setMessage(gqlErrorMessage(err, COPY.submitFallback))
    } finally {
      setSubmitting(false)
    }
  }

  function startAnother() {
    setValues({})
    setErrors({})
    setMessage(null)
    setSentFor(null)
    window.scrollTo({ top: 0 })
  }

  return {
    slug,
    state,
    form,
    identity,
    values,
    errors,
    message,
    submitting,
    sentFor,
    setValue,
    submit,
    startAnother,
  }
}
