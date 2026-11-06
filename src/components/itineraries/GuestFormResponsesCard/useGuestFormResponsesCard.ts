'use client'

import { useState } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { useGuestFormResponsesStore, selectUnreviewedCount } from '@/stores/guestFormResponsesStore'
import { useTripGuestFormsStore } from '@/stores/tripGuestFormsStore'
import { canManageGuestForms } from '@/lib/guestForms'
import { groupByForm } from './GuestFormResponsesCard.utils'

/** The open trip's responses (loaded by the builder page) and which one is open. */
export function useGuestFormResponsesCard() {
  const role = useProfileStore((s) => s.profile?.role)
  const { responses, loading, error } = useGuestFormResponsesStore()
  const unreviewed = useGuestFormResponsesStore(selectUnreviewedCount)
  const formsAttached = useTripGuestFormsStore((s) => s.attached.length)
  const [openId, setOpenId] = useState<string | null>(null)

  return {
    groups: groupByForm(responses),
    loading: loading && responses.length === 0,
    error,
    unreviewed,
    hasResponses: responses.length > 0,
    formsAttached,
    canEdit: canManageGuestForms(role),
    // Read from the store each render, so a save or review shows at once.
    open: responses.find((r) => r.id === openId) ?? null,
    openResponse: setOpenId,
    close: () => setOpenId(null),
  }
}
