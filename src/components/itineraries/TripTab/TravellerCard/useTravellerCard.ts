import { useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { formFromItinerary, toTripDetails } from './TravellerCard.utils'
import type { TravellerForm } from './TravellerCard.types'

/** The traveller form; read once — the Trip tab remounts this card per itinerary (key). */
export function useTravellerCard() {
  const { itinerary, saving, updateTripDetails } = useBuilderStore()
  const [form, setForm] = useState<TravellerForm>(() => formFromItinerary(itinerary))
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof TravellerForm>(key: K, value: TravellerForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setDirty(true)
    setError(null)
  }

  async function save() {
    if (!itinerary) return
    const err = await updateTripDetails(itinerary.id, toTripDetails(form))
    setError(err)
    if (!err) setDirty(false)
  }

  return { form, set, dirty, saving, error, save }
}
