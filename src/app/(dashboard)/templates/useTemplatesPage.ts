import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import { useTemplateStore, type TemplateDetailsInput, type TemplateListItem } from '@/stores/templateStore'
import { ARCHIVE_DIALOG, DELETE_DIALOG, SEARCH_DEBOUNCE_MS } from './page.constants'
import { displayName } from './page.utils'

/** Filters, the list, and every per-card action. Errors land in one notice. */
export function useTemplatesPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const {
    templates, allTags, filters, loading, saving, error,
    setFilters, fetchTemplates, updateDetails, setArchived, duplicate, remove,
  } = useTemplateStore()

  const [search, setSearch] = useState(filters.search)
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null)
  const [editing, setEditing] = useState<TemplateListItem | null>(null)
  const [using, setUsing] = useState<TemplateListItem | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  // Typing settles before the list reloads.
  useEffect(() => {
    const timer = setTimeout(() => setFilters({ search }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search, setFilters])

  useEffect(() => {
    if (client) fetchTemplates()
  }, [client, filters, fetchTemplates])

  const hasFilters = filters.tag !== null || filters.search.trim() !== ''

  function report(err: string | null, success: string) {
    setNotice(err ? { text: err, error: true } : { text: success, error: false })
  }

  async function saveDetails(input: TemplateDetailsInput) {
    if (!editing) return null
    const err = await updateDetails(editing.id, input)
    if (!err) {
      setEditing(null)
      report(null, 'Template details saved.')
    }
    return err
  }

  async function toggleArchived(template: TemplateListItem) {
    const archiving = template.templateArchivedAt === null
    if (archiving && !(await confirmDialog(ARCHIVE_DIALOG(displayName(template))))) return
    const err = await setArchived(template.id, archiving)
    report(err, archiving ? 'Template archived.' : 'Template restored.')
  }

  async function duplicateTemplate(template: TemplateListItem) {
    const err = await duplicate(template.id)
    report(err, `“${displayName(template)}” duplicated.`)
  }

  async function deleteTemplate(template: TemplateListItem) {
    if (!(await confirmDialog(DELETE_DIALOG(displayName(template))))) return
    const err = await remove(template.id)
    report(err, 'Template deleted.')
  }

  return {
    templates, loading, saving, error, notice,
    search, setSearch,
    tag: filters.tag,
    setTag: (tag: string | null) => setFilters({ tag }),
    includeArchived: filters.includeArchived,
    setIncludeArchived: (includeArchived: boolean) => setFilters({ includeArchived }),
    tags: allTags,
    hasFilters,
    open: (template: TemplateListItem) => router.push(`/itineraries/${template.id}`),
    editing, startEditing: setEditing, stopEditing: () => setEditing(null), saveDetails,
    using, startUsing: setUsing, stopUsing: () => setUsing(null),
    pickerOpen, openPicker: () => setPickerOpen(true), closePicker: () => setPickerOpen(false),
    toggleArchived, duplicateTemplate, deleteTemplate,
  }
}
