import { useState } from 'react'
import type { StartTripModalProps } from './StartTripModal.types'

/** The email choice and submit state; failures stay in the modal. */
export function useStartTripModal({ travellerEmail, onConfirm }: StartTripModalProps) {
  const [notifyTraveller, setNotifyTraveller] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setSubmitting(true)
    setError(null)
    const err = await onConfirm(!!travellerEmail && notifyTraveller)
    setSubmitting(false)
    if (err) setError(err)
  }

  return { notifyTraveller, setNotifyTraveller, submitting, error, confirm }
}
