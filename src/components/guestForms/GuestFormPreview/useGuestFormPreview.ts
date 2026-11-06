'use client'

import { useState } from 'react'
import type { GuestFormValue, GuestFormValues } from '@/lib/guestForms'

/** Local answers, so the operator can try the form as a guest would. */
export function useGuestFormPreview() {
  const [values, setValues] = useState<GuestFormValues>({})

  return {
    values,
    setValue: (fieldId: string, value: GuestFormValue) =>
      setValues((current) => ({ ...current, [fieldId]: value })),
    reset: () => setValues({}),
  }
}
