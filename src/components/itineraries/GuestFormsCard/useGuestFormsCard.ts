'use client'

import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { useTripGuestFormsStore } from '@/stores/tripGuestFormsStore'
import { tripFormsEditable } from '@/lib/guestForms'

/** The trip's attached forms, the library forms not yet on it, and the actions. */
export function useGuestFormsCard() {
  const client = useClientStore((s) => s.client)
  const itineraryId = useBuilderStore((s) => s.itinerary?.id)
  const status = useBuilderStore((s) => s.itinerary?.status)
  const role = useProfileStore((s) => s.profile?.role)
  const { attached, library, loading, saving, error, load, attach, detach, move } = useTripGuestFormsStore()
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (client && itineraryId) load(itineraryId)
  }, [client, itineraryId, load])

  const attachedIds = new Set(attached.map((a) => a.guestForm.id))
  const run = async (action: Promise<string | null>) => setActionError(await action)

  return {
    status,
    attached,
    available: library.filter((f) => !attachedIds.has(f.id)),
    libraryEmpty: library.length === 0,
    loading: loading && attached.length === 0,
    saving,
    error: actionError ?? error,
    canEdit: (role === 'OWNER' || role === 'ADVISOR') && tripFormsEditable(status),
    attach: (guestFormId: string) => guestFormId && run(attach(guestFormId)),
    detach: (guestFormId: string) => run(detach(guestFormId)),
    move: (guestFormId: string, direction: -1 | 1) => run(move(guestFormId, direction)),
  }
}
