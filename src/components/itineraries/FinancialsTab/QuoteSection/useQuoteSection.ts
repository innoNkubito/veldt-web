'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import type { QuoteForm } from './QuoteSection.types'
import { formFromCosts, toCostsInput } from './QuoteSection.utils'

/**
 * The quote form. Read from the store once — the Financials tab is keyed on
 * the itinerary, so a different itinerary remounts it with fresh values.
 */
export function useQuoteSection() {
  const { itinerary, upsertCosts, saving } = useBuilderStore()
  const [form, setForm] = useState<QuoteForm>(() => formFromCosts(itinerary?.costs))
  const [dirty, setDirty] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function set<K extends keyof QuoteForm>(key: K, value: QuoteForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
  }

  async function save() {
    if (!itinerary) return
    const message = await upsertCosts(itinerary.id, toCostsInput(form))
    setSaveError(message)
    if (!message) setDirty(false)
  }

  return { form, set, dirty, saving, saveError, save }
}
