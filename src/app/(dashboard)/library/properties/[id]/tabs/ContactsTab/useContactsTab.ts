import { useState } from 'react'
import { useContentLibraryStore } from '@/stores/contentLibraryStore'
import type { ContactType, PropertyContact } from '@/stores/contentLibraryStore'
import { confirmDialog } from '@/stores/confirmStore'
import { COPY, EMPTY_FORM } from './ContactsTab.constants'
import { toFormValues, toInput } from './ContactsTab.utils'
import type { ContactFormValues, ContactsTabProps } from './ContactsTab.types'

/** One form for adding and editing; editing loads a contact into it. */
export function useContactsTab({ property }: ContactsTabProps) {
  const { saving, addContact, updateContact, deleteContact } = useContentLibraryStore()
  const [form, setForm] = useState<ContactFormValues>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function setField(key: Exclude<keyof ContactFormValues, 'contactType'>, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setType(contactType: ContactType) {
    setForm((f) => ({ ...f, contactType }))
  }

  function startEdit(contact: PropertyContact) {
    setEditingId(contact.id)
    setForm(toFormValues(contact))
    setError(null)
  }

  function reset() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  async function save() {
    if (!form.phone.trim() && !form.email.trim()) return setError(COPY.needsReach)
    const input = toInput(form)
    const err = editingId ? await updateContact(editingId, input) : await addContact(property.id, input)
    if (err) return setError(err)
    reset()
  }

  async function remove(contact: PropertyContact) {
    const ok = await confirmDialog({
      title: COPY.deleteTitle,
      message: COPY.deleteMessage,
      confirmLabel: COPY.delete,
      danger: true,
    })
    if (!ok) return
    const err = await deleteContact(contact.id)
    if (err) return setError(err)
    if (editingId === contact.id) reset()
  }

  return { form, setField, setType, editingId, error, saving, startEdit, reset, save, remove }
}
