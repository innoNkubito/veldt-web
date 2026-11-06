'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GuestFormBuilder from '@/components/guestForms/GuestFormBuilder'

function NewGuestForm() {
  const starter = useSearchParams().get('starter')
  return <GuestFormBuilder formId={null} starterKey={starter} />
}

export default function NewGuestFormPage() {
  // useSearchParams requires a Suspense boundary
  return (
    <Suspense fallback={null}>
      <NewGuestForm />
    </Suspense>
  )
}
