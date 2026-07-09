'use client'

import { useEffect, useRef, useState } from 'react'
import {
  useTaskStore,
  TASK_TYPES,
  TASK_TYPE_CONFIG,
  memberName,
  type TaskItem,
  type TaskType,
} from '@/stores/taskStore'
import HtmlRichTextEditor from '@/components/itineraries/HtmlRichTextEditor'
import * as S from './TaskModal.styled'

// ── Generic dropdown ────────────────────────────────────────────

interface DropdownOption {
  value: string
  label: string
}

function Dropdown({
  placeholder,
  value,
  options,
  onSelect,
}: {
  placeholder: string
  value: string | null
  options: DropdownOption[]
  onSelect: (value: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <S.DropdownWrap ref={wrapRef}>
      <S.DropdownButton
        type="button"
        $placeholder={!selected}
        onClick={() => setOpen((o) => !o)}
      >
        {selected?.label ?? placeholder}
        <S.DropdownChevron>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </S.DropdownChevron>
      </S.DropdownButton>
      {open && (
        <S.DropdownList>
          {options.length === 0 ? (
            <S.DropdownEmpty>No options</S.DropdownEmpty>
          ) : (
            options.map((o) => (
              <S.DropdownItem
                key={o.value}
                type="button"
                $highlight={o.value === value}
                onClick={() => { onSelect(o.value === value ? null : o.value); setOpen(false) }}
              >
                {o.label}
              </S.DropdownItem>
            ))
          )}
        </S.DropdownList>
      )}
    </S.DropdownWrap>
  )
}

// ── Calendar ────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function Calendar({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (date: string) => void
}) {
  const now = new Date()
  const init = selected ? new Date(selected) : now
  const [month, setMonth] = useState(isNaN(init.getTime()) ? now.getMonth() : init.getMonth())
  const [year, setYear] = useState(isNaN(init.getTime()) ? now.getFullYear() : init.getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate())

  const years: number[] = []
  for (let y = now.getFullYear() - 1; y <= now.getFullYear() + 5; y++) years.push(y)

  function nav(delta: number) {
    let m = month + delta
    let y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m)
    setYear(y)
  }

  return (
    <S.CalendarWrap>
      <S.CalendarHeader>
        <S.CalendarSelect value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </S.CalendarSelect>
        <S.CalendarSelect value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </S.CalendarSelect>
        <S.CalendarNav>
          <S.CalendarNavButton type="button" onClick={() => nav(-1)}>‹</S.CalendarNavButton>
          <S.CalendarNavButton type="button" onClick={() => nav(1)}>›</S.CalendarNavButton>
        </S.CalendarNav>
      </S.CalendarHeader>
      <S.CalendarGrid>
        {DAY_LABELS.map((d) => <S.CalendarDayLabel key={d}>{d}</S.CalendarDayLabel>)}
        {Array.from({ length: firstDay }).map((_, i) => (
          <S.CalendarDay key={`blank-${i}`} $blank type="button" tabIndex={-1}> </S.CalendarDay>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = toDateString(year, month, day)
          return (
            <S.CalendarDay
              key={day}
              type="button"
              $today={dateStr === todayStr}
              $selected={dateStr === selected}
              onClick={() => onSelect(dateStr)}
            >
              {day}
            </S.CalendarDay>
          )
        })}
      </S.CalendarGrid>
    </S.CalendarWrap>
  )
}

// ── Modal ───────────────────────────────────────────────────────

const ONE_OFF = '__ONE_OFF__'

export default function TaskModal({
  task,
  onClose,
}: {
  task: TaskItem | null
  onClose: () => void
}) {
  const { teamMembers, fileOptions, createTask, updateTask, saving } = useTaskStore()

  const [name, setName] = useState(task?.name ?? '')
  const [fileId, setFileId] = useState<string | null>(
    task ? (task.itinerary?.id ?? ONE_OFF) : null,
  )
  const [assignedToId, setAssignedToId] = useState<string | null>(task?.assignedTo?.id ?? null)
  const [type, setType] = useState<string | null>(task?.type ?? null)
  const [tags, setTags] = useState<string[]>(task?.tags ?? [])
  const [tagDraft, setTagDraft] = useState('')

  // Due date state
  const [relativeDays, setRelativeDays] = useState(String(task?.relativeDays ?? 1))
  const [relativeBefore, setRelativeBefore] = useState(task?.relativeBefore ?? true)
  const [anchorStart, setAnchorStart] = useState((task?.relativeAnchor ?? 'TRIP_START') === 'TRIP_START')
  const [manualDate, setManualDate] = useState<string | null>(() => {
    if (task?.dueDate && !task.relativeAnchor) {
      const d = new Date(task.dueDate)
      if (!isNaN(d.getTime())) return toDateString(d.getFullYear(), d.getMonth(), d.getDate())
    }
    return null
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const calendarWrapRef = useRef<HTMLDivElement>(null)

  const [note, setNote] = useState(task?.note ?? '')
  const [error, setError] = useState<string | null>(null)

  const hasFile = fileId != null && fileId !== ONE_OFF

  useEffect(() => {
    if (!calendarOpen) return
    function handle(e: MouseEvent) {
      if (calendarWrapRef.current && !calendarWrapRef.current.contains(e.target as Node)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [calendarOpen])

  function addTag() {
    const t = tagDraft.trim().replace(/,+$/, '')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagDraft('')
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !tagDraft && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  async function handleSubmit() {
    if (!name.trim()) { setError('Task name is required'); return }
    if (!assignedToId) { setError('Assigned to is required'); return }
    setError(null)

    const days = parseInt(relativeDays)
    const useRelative = !manualDate && hasFile && !isNaN(days) && days >= 0

    const input = {
      name: name.trim(),
      itineraryId: hasFile ? fileId : null,
      assignedToId,
      type: (type as TaskType) ?? null,
      tags,
      dueDate: manualDate ? new Date(`${manualDate}T12:00:00`).toISOString() : null,
      relativeDays: useRelative ? days : null,
      relativeBefore: useRelative ? relativeBefore : null,
      relativeAnchor: useRelative ? (anchorStart ? ('TRIP_START' as const) : ('TRIP_END' as const)) : null,
      note: note || null,
    }

    const result = task ? await updateTask(task.id, input) : await createTask(input)
    if (result) onClose()
    else setError(useTaskStore.getState().error ?? 'Something went wrong')
  }

  const fileDropdownOptions = [
    { value: ONE_OFF, label: 'One-off task (no file)' },
    ...fileOptions.map((f) => ({ value: f.id, label: f.proposalTitle })),
  ]

  return (
    <S.Overlay onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <S.Card>
        <S.Header>
          <S.Title>{task ? 'Edit Task' : 'Create Task'}</S.Title>
          <S.CloseButton onClick={onClose}>✕</S.CloseButton>
        </S.Header>

        <S.Body>
          <S.TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name*"
            autoFocus
          />

          <Dropdown
            placeholder="File*"
            value={fileId}
            options={fileDropdownOptions}
            onSelect={setFileId}
          />

          <Dropdown
            placeholder="Assigned to*"
            value={assignedToId}
            options={teamMembers.map((m) => ({ value: m.id, label: memberName(m) }))}
            onSelect={setAssignedToId}
          />

          <Dropdown
            placeholder="Task Type"
            value={type}
            options={TASK_TYPES.map((t) => ({ value: t, label: TASK_TYPE_CONFIG[t].label }))}
            onSelect={setType}
          />

          {/* Tags */}
          <S.TagsWrap>
            {tags.map((tag) => (
              <S.TagChip key={tag}>
                {tag}
                <S.TagRemove type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                  ✕
                </S.TagRemove>
              </S.TagChip>
            ))}
            <S.TagInput
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={addTag}
              placeholder={tags.length === 0 ? 'Tags' : ''}
            />
          </S.TagsWrap>

          {/* Relative due date */}
          <S.RelativeRow $disabled={!hasFile || !!manualDate}>
            Due date is
            <S.RelativeDaysInput
              value={relativeDays}
              onChange={(e) => setRelativeDays(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={!hasFile || !!manualDate}
            />
            day(s)
            <S.ToggleChip
              type="button"
              disabled={!hasFile || !!manualDate}
              onClick={() => setRelativeBefore((b) => !b)}
            >
              {relativeBefore ? 'before' : 'after'}
            </S.ToggleChip>
            the
            <S.ToggleChip
              type="button"
              disabled={!hasFile || !!manualDate}
              onClick={() => setAnchorStart((s) => !s)}
            >
              {anchorStart ? 'start of the trip' : 'end of the trip'}
            </S.ToggleChip>
          </S.RelativeRow>

          {/* Manual date */}
          <S.DropdownWrap ref={calendarWrapRef}>
            <S.DropdownButton
              type="button"
              $placeholder={!manualDate}
              onClick={() => setCalendarOpen((o) => !o)}
            >
              {manualDate
                ? new Date(`${manualDate}T12:00:00`).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })
                : 'Or, Manually Select Due Date'}
              <S.DropdownChevron>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </S.DropdownChevron>
            </S.DropdownButton>
            {calendarOpen && (
              <Calendar
                selected={manualDate}
                onSelect={(d) => { setManualDate(d); setCalendarOpen(false) }}
              />
            )}
          </S.DropdownWrap>

          {manualDate && (
            <S.SelectedDateNote>
              Manual due date set.
              <S.ClearDateButton type="button" onClick={() => setManualDate(null)}>
                Clear
              </S.ClearDateButton>
            </S.SelectedDateNote>
          )}

          {/* Note */}
          <HtmlRichTextEditor
            content={note}
            onChange={setNote}
            placeholder="Add note..."
          />

          {error && <S.ErrorText>{error}</S.ErrorText>}
        </S.Body>

        <S.Footer>
          <S.SubmitButton $disabled={saving} onClick={handleSubmit}>
            {saving ? 'Saving…' : task ? 'Save' : 'Create'}
          </S.SubmitButton>
        </S.Footer>
      </S.Card>
    </S.Overlay>
  )
}
