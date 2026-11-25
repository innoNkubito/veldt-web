'use client'

import { useMemo, useState } from 'react'
import { useBookingStore, type BookingConfig } from '@/stores/bookingStore'
import type { ScheduleDraft } from './BookingSection.types'
import {
  scheduleSummary,
  toScheduleDraft,
  toScheduleItems,
  withScheduleRow,
  withoutScheduleRow,
} from './BookingSection.utils'

/** The payment schedule editor: draft rows, a live "does it add up" check, and saving. */
export function useScheduleEditor(config: BookingConfig | null, isTemplate: boolean, currency: string) {
  const saveSchedule = useBookingStore((s) => s.saveSchedule)
  const [schedule, setSchedule] = useState<ScheduleDraft[]>([])
  const [dirty, setDirty] = useState(false)

  // Reload the rows whenever a different (or newly saved) config arrives, during render.
  const version = config ? `${config.id}:${config.updatedAt}` : null
  const [loadedVersion, setLoadedVersion] = useState<string | null>(null)
  if (config && version !== loadedVersion) {
    setLoadedVersion(version)
    setSchedule(config.scheduleItems.map(toScheduleDraft))
    setDirty(false)
  }

  function change(next: (rows: ScheduleDraft[]) => ScheduleDraft[]) {
    setSchedule(next)
    setDirty(true)
  }

  async function save() {
    const message = await saveSchedule(toScheduleItems(schedule, isTemplate))
    if (!message) setDirty(false)
  }

  const summary = useMemo(() => scheduleSummary(schedule, currency), [schedule, currency])

  return {
    schedule,
    dirty,
    summary,
    updateRow: (index: number, patch: Partial<ScheduleDraft>) =>
      change((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r))),
    addRow: () => change(withScheduleRow),
    removeRow: (index: number) => change((rows) => withoutScheduleRow(rows, index)),
    save,
  }
}
