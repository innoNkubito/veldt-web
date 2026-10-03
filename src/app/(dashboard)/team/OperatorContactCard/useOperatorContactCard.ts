import { useEffect, useState } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { useTeamStore } from '@/stores/teamStore'
import { toForm, toInput } from './OperatorContactCard.utils'
import type { OperatorContactForm } from './OperatorContactCard.types'

/** Loads the operator's contact details once, and saves edits. */
export function useOperatorContactCard() {
  const client = useClientStore((s) => s.client)
  const { operatorContact, fetchOperatorContact, updateOperatorContact, saving } = useTeamStore()
  const [form, setForm] = useState<OperatorContactForm | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (client) fetchOperatorContact()
  }, [client, fetchOperatorContact])

  // Until the user types, the form mirrors what was loaded.
  const values = form ?? toForm(operatorContact)

  function setField(key: keyof OperatorContactForm, value: string) {
    setForm({ ...values, [key]: value })
    setSaved(false)
    setError(null)
  }

  async function save() {
    const err = await updateOperatorContact(toInput(values))
    setError(err)
    if (!err) {
      setForm(null)
      setSaved(true)
    }
  }

  return { values, setField, dirty: form !== null, saving, error, saved, save }
}
