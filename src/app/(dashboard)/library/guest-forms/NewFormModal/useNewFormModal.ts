'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGuestFormStore } from '@/stores/guestFormStore'
import type { GuestFormStarter } from '@/lib/guestForms'
import { newFormPath } from './NewFormModal.utils'

/** Loads the starters, closes on Escape, and opens the builder with the choice. */
export function useNewFormModal(onClose: () => void) {
  const router = useRouter()
  const fetchStarters = useGuestFormStore((s) => s.fetchStarters)
  const [starters, setStarters] = useState<GuestFormStarter[] | null>(null)

  useEffect(() => {
    let live = true
    fetchStarters().then((list) => live && setStarters(list))
    return () => {
      live = false
    }
  }, [fetchStarters])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return {
    starters,
    choose: (starterKey: string | null) => router.push(newFormPath(starterKey)),
  }
}
