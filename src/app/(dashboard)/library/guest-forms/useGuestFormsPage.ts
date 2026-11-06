'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientStore } from '@/stores/clientStore'
import { useProfileStore } from '@/stores/profileStore'
import { confirmDialog } from '@/stores/confirmStore'
import { useGuestFormStore } from '@/stores/guestFormStore'
import type { GuestForm } from '@/lib/guestForms'
import { ARCHIVE_DIALOG, DELETE_DIALOG, FORMS_PATH } from './page.constants'

/** The list, the archived toggle, and every per-card action. */
export function useGuestFormsPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const role = useProfileStore((s) => s.profile?.role)
  const { forms, includeArchived, loading, saving, error, setIncludeArchived, fetchForms, setArchived, deleteForm } =
    useGuestFormStore()

  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (client) fetchForms()
  }, [client, includeArchived, fetchForms])

  function report(err: string | null, success: string) {
    setNotice(err ? { text: err, error: true } : { text: success, error: false })
  }

  async function toggleArchived(form: GuestForm) {
    const archiving = form.archivedAt === null
    if (archiving && !(await confirmDialog(ARCHIVE_DIALOG(form.name)))) return
    report(await setArchived(form.id, archiving), archiving ? 'Form archived.' : 'Form restored.')
  }

  async function remove(form: GuestForm) {
    if (!(await confirmDialog(DELETE_DIALOG(form.name)))) return
    report(await deleteForm(form.id), 'Form deleted.')
  }

  return {
    forms,
    loading,
    saving,
    error,
    notice,
    canEdit: role === 'OWNER' || role === 'ADVISOR',
    includeArchived,
    setIncludeArchived,
    open: (form: GuestForm) => router.push(`${FORMS_PATH}/${form.id}`),
    pickerOpen,
    openPicker: () => setPickerOpen(true),
    closePicker: () => setPickerOpen(false),
    toggleArchived,
    remove,
  }
}
