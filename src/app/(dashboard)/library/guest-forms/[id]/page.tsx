'use client'

import { useParams } from 'next/navigation'
import GuestFormBuilder from '@/components/guestForms/GuestFormBuilder'
import { routeParam } from '@/lib/guards'

export default function GuestFormPage() {
  const id = routeParam(useParams()?.id)
  return <GuestFormBuilder key={id} formId={id} starterKey={null} />
}
