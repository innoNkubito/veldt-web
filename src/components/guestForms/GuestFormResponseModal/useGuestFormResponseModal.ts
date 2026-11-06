'use client'

import { useEffect, useState } from 'react'
import { useGuestFormResponsesStore } from '@/stores/guestFormResponsesStore'
import type { GuestFormResponse, GuestFormValue, GuestFormValues } from '@/lib/guestForms'
import { COPIED_MS } from './GuestFormResponseModal.constants'
import type { ModalMode } from './GuestFormResponseModal.types'
import { responseAsText, toInput, toValues } from './GuestFormResponseModal.utils'

/** View, copy, mark reviewed, and edit one response. Closes on Escape when not editing. */
export function useGuestFormResponseModal(response: GuestFormResponse, onClose: () => void) {
  const { setReviewed, update, saving } = useGuestFormResponsesStore()
  const [mode, setMode] = useState<ModalMode>('view')
  const [values, setValues] = useState<GuestFormValues>(() => toValues(response))
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (mode === 'edit') return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, onClose])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(responseAsText(response))
      setCopied(true)
    } catch {
      setError('Your browser blocked copying. Select the answers and copy them by hand.')
    }
  }

  async function toggleReviewed() {
    setError(await setReviewed(response.id, response.reviewedAt === null))
  }

  function startEdit() {
    setValues(toValues(response))
    setError(null)
    setMode('edit')
  }

  async function saveEdit() {
    const err = await update(response.id, toInput(response, values))
    setError(err)
    if (!err) setMode('view')
  }

  return {
    mode,
    values,
    error,
    copied,
    saving,
    setValue: (fieldId: string, value: GuestFormValue) => setValues((v) => ({ ...v, [fieldId]: value })),
    copy,
    toggleReviewed,
    startEdit,
    cancelEdit: () => {
      setMode('view')
      setError(null)
    },
    saveEdit,
  }
}
