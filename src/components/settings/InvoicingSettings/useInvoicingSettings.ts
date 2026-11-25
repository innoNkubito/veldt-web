'use client'

import { useEffect, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { useInvoiceSettingsStore } from '@/stores/invoiceSettingsStore'
import { COPY } from './InvoicingSettings.constants'
import type { InvoicingForm } from './InvoicingSettings.types'
import { formFromSettings, previewNumber, toInput } from './InvoicingSettings.utils'

/** Loads the settings once, edits a local copy, saves the whole form. */
export function useInvoicingSettings() {
  const client = useClientStore((s) => s.client)
  const { settings, loading, saving, error, fetch, save } = useInvoiceSettingsStore()
  const [form, setForm] = useState<InvoicingForm>(() => formFromSettings(settings))
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)

  useEffect(() => {
    if (client) fetch()
  }, [client, fetch])

  // Adopt the loaded (or just-saved) settings during render, unless mid-edit.
  const [loadedFrom, setLoadedFrom] = useState(settings)
  if (settings !== loadedFrom && !dirty) {
    setLoadedFrom(settings)
    setForm(formFromSettings(settings))
  }

  function set<K extends keyof InvoicingForm>(key: K, value: InvoicingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
    setMessage(null)
  }

  async function submit() {
    const err = await save(toInput(form))
    if (err) {
      setMessage({ text: err, error: true })
      return
    }
    setDirty(false)
    setMessage({ text: COPY.saved, error: false })
  }

  return {
    settings,
    loading: loading && !settings,
    error,
    form,
    set,
    dirty,
    saving,
    message,
    submit,
    canEdit: settings?.canEdit ?? false,
    preview: previewNumber(form.numberPrefix, settings?.nextNumber ?? 1),
  }
}
