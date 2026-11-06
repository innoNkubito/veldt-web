'use client'

import { useEffect } from 'react'
import { useClientStore } from '@/stores/clientStore'
import { useGuestFormResponsesStore } from '@/stores/guestFormResponsesStore'
import { PANEL_LIMIT } from './NewGuestFormsPanel.constants'

/** The newest unreviewed responses across every trip. */
export function useNewGuestFormsPanel() {
  const client = useClientStore((s) => s.client)
  const { recent, unreviewedTotal, fetchRecent } = useGuestFormResponsesStore()

  useEffect(() => {
    if (client) fetchRecent(PANEL_LIMIT)
  }, [client, fetchRecent])

  return { recent, more: Math.max(0, unreviewedTotal - recent.length) }
}
