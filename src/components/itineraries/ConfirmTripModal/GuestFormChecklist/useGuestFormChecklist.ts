'use client'

import { useEffect } from 'react'
import { useTripGuestFormsStore } from '@/stores/tripGuestFormsStore'
import { checklistOptions } from './GuestFormChecklist.utils'

/**
 * Loads the trip's forms (if the Overview tab hasn't already), then seeds
 * the selection with what is attached today.
 */
export function useGuestFormChecklist(
  itineraryId: string,
  selected: string[] | null,
  onChange: (selected: string[]) => void,
) {
  const { itineraryId: loadedFor, attached, library, loading, load } = useTripGuestFormsStore()
  const ready = loadedFor === itineraryId && !loading

  useEffect(() => {
    if (loadedFor !== itineraryId) load(itineraryId)
  }, [itineraryId, loadedFor, load])

  useEffect(() => {
    if (ready && selected === null) onChange(attached.map((a) => a.guestForm.id))
  }, [ready, selected, attached, onChange])

  return { ready, options: checklistOptions(attached, library) }
}
