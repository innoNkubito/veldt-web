'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useClientStore } from '@/stores/clientStore'
import { confirmDialog } from '@/stores/confirmStore'
import {
  useTaskStore,
  TASK_TYPE_CONFIG,
  memberName,
  type TaskItem,
} from '@/stores/taskStore'
import TaskModal from '@/components/tasks/TaskModal'
import * as S from './page.styled'

// ── Date bucketing ──────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function dueDay(task: TaskItem): number | null {
  if (!task.dueDate) return null
  const d = new Date(task.dueDate)
  if (isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

type FilterTab = 'ALL' | 'DUE_TODAY' | 'OVERDUE' | 'DUE_THIS_WEEK' | 'UPCOMING' | 'COMPLETED' | 'TBD'

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL',           label: 'All Tasks' },
  { key: 'DUE_TODAY',     label: 'Due Today' },
  { key: 'OVERDUE',       label: 'Overdue' },
  { key: 'DUE_THIS_WEEK', label: 'Due This Week' },
  { key: 'UPCOMING',      label: 'Upcoming' },
  { key: 'COMPLETED',     label: 'Completed' },
  { key: 'TBD',           label: 'TBD' },
]

function matchesTab(task: TaskItem, tab: FilterTab): boolean {
  const today = startOfToday()
  const due = dueDay(task)
  switch (tab) {
    case 'ALL':           return !task.completed
    case 'COMPLETED':     return task.completed
    case 'TBD':           return !task.completed && due == null
    case 'DUE_TODAY':     return !task.completed && due === today
    case 'OVERDUE':       return !task.completed && due != null && due < today
    case 'DUE_THIS_WEEK': return !task.completed && due != null && due >= today && due < today + 7 * DAY_MS
    case 'UPCOMING':      return !task.completed && due != null && due >= today + 7 * DAY_MS
  }
}

function formatDueDate(iso: string | null): string {
  if (!iso) return 'TBD'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'TBD'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ── Sort ────────────────────────────────────────────────────────

type SortField = 'file' | 'type' | 'assignedTo' | 'tags' | 'dueDate'

function sortValue(task: TaskItem, field: SortField): string | number {
  switch (field) {
    case 'file':       return task.itinerary?.proposalTitle?.toLowerCase() ?? ''
    case 'type':       return task.type ?? ''
    case 'assignedTo': return memberName(task.assignedTo).toLowerCase()
    case 'tags':       return task.tags.join(',').toLowerCase()
    case 'dueDate':    return dueDay(task) ?? Number.MAX_SAFE_INTEGER // TBD last
  }
}

// ── Page ────────────────────────────────────────────────────────

export default function TasksPage() {
  const client = useClientStore((s) => s.client)
  const {
    tasks, loading, error,
    fetchTasks, fetchMeta, setTaskCompleted, deleteTask,
  } = useTaskStore()

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [sortField, setSortField] = useState<SortField>('dueDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(25)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TaskItem | null>(null)

  useEffect(() => {
    if (client) {
      fetchTasks()
      fetchMeta()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  const counts = useMemo(() => {
    const c = {} as Record<FilterTab, number>
    for (const { key } of FILTER_TABS) {
      c[key] = tasks.filter((t) => matchesTab(t, key)).length
    }
    return c
  }, [tasks])

  const displayed = useMemo(() => {
    const list = tasks.filter((t) => matchesTab(t, activeTab))
    list.sort((a, b) => {
      const av = sortValue(a, sortField)
      const bv = sortValue(b, sortField)
      if (av === bv) return 0
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : av > bv ? -1 : 1
    })
    return list.slice(0, pageSize)
  }, [tasks, activeTab, sortField, sortDir, pageSize])

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: 'Delete task?',
      message: 'This task will be permanently deleted. This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    })
    if (!ok) return
    await deleteTask(id)
  }

  async function handleToggleCompleted(task: TaskItem, completed: boolean) {
    if (completed) {
      const ok = await confirmDialog({
        title: 'Mark task as complete?',
        message: `"${task.name}" will be moved to Completed.`,
        confirmLabel: 'Mark Complete',
      })
      if (!ok) return
    }
    await setTaskCompleted(task.id, completed)
  }

  const cols: { label: string; field: SortField | null; align?: 'right' }[] = [
    { label: 'Task',        field: null },
    { label: 'File',        field: 'file' },
    { label: 'Type',        field: 'type' },
    { label: 'Assigned To', field: 'assignedTo' },
    { label: 'Tags',        field: 'tags' },
    { label: 'Due Date',    field: 'dueDate' },
    { label: 'Actions',     field: null, align: 'right' },
  ]

  return (
    <Box sx={{ padding: '2rem' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <S.PageHeaderRow>
        <S.PageTitle>Task Manager</S.PageTitle>
        <S.HeaderControls>
          <S.MoreOptionsButton>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            More Options
          </S.MoreOptionsButton>
          <S.CreateButton onClick={() => { setEditing(null); setShowModal(true) }}>
            <S.CreateButtonPlus>+</S.CreateButtonPlus>
            Create New
          </S.CreateButton>
        </S.HeaderControls>
      </S.PageHeaderRow>

      {/* ── Filter tabs ────────────────────────────────────── */}
      <S.TabBar>
        {FILTER_TABS.map(({ key, label }) => {
          const active = activeTab === key
          const count = counts[key] ?? 0
          return (
            <S.Tab key={key} $active={active} onClick={() => setActiveTab(key)}>
              {label}
              {key !== 'TBD' && <S.TabCount $active={active}>{count}</S.TabCount>}
              {key === 'TBD' && count > 0 && <S.TabCount $active={active}>{count}</S.TabCount>}
            </S.Tab>
          )
        })}
      </S.TabBar>

      {/* ── Table ──────────────────────────────────────────── */}
      <S.TableWrapper>
        <S.TableHead>
          <div />
          {cols.map(({ label, field, align }) => (
            <S.TableHeadCell
              key={label}
              $sortable={!!field}
              $align={align}
              onClick={field ? () => handleSort(field) : undefined}
            >
              {field && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="6" x2="14" y2="6" /><line x1="4" y1="12" x2="11" y2="12" /><line x1="4" y1="18" x2="8" y2="18" />
                </svg>
              )}
              {label}
              {field && (
                <S.SortIndicator $active={sortField === field}>
                  {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↓'}
                </S.SortIndicator>
              )}
            </S.TableHeadCell>
          ))}
        </S.TableHead>

        {loading && <S.LoadingMessage>Loading tasks...</S.LoadingMessage>}
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        {!loading && !error && displayed.length === 0 && (
          <S.EmptyMessage>No tasks here yet.</S.EmptyMessage>
        )}

        {!loading &&
          displayed.map((task, i) => {
            const typeCfg = task.type ? TASK_TYPE_CONFIG[task.type] : null
            return (
              <S.TableRow
                key={task.id}
                $hovered={hoveredRow === task.id}
                $last={i === displayed.length - 1}
                $completed={task.completed}
                onMouseEnter={() => setHoveredRow(task.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <S.RowCheckbox
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleToggleCompleted(task, e.target.checked)}
                />

                <S.RowNameCell>
                  <S.RowTitle $completed={task.completed}>{task.name}</S.RowTitle>
                  {task.note && stripHtml(task.note) && (
                    <S.NoteIcon title={stripHtml(task.note)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="14" rx="2" />
                        <line x1="7" y1="9" x2="17" y2="9" /><line x1="7" y1="13" x2="13" y2="13" />
                      </svg>
                    </S.NoteIcon>
                  )}
                </S.RowNameCell>

                <S.RowCell>{task.itinerary?.proposalTitle ?? '—'}</S.RowCell>

                <div>
                  {typeCfg ? (
                    <S.TypeBadge $bg={typeCfg.bg} $fg={typeCfg.fg} $border={typeCfg.border}>
                      {typeCfg.label}
                    </S.TypeBadge>
                  ) : (
                    <S.RowCell $variant="muted">—</S.RowCell>
                  )}
                </div>

                <S.RowCell>{memberName(task.assignedTo)}</S.RowCell>

                <div>
                  {task.tags.length > 0 ? (
                    <S.TagChips>
                      {task.tags.map((tag) => <S.TagChip key={tag}>{tag}</S.TagChip>)}
                    </S.TagChips>
                  ) : (
                    <S.RowCell $variant="muted">—</S.RowCell>
                  )}
                </div>

                <S.RowCell $variant={task.dueDate ? undefined : 'muted'}>
                  {formatDueDate(task.dueDate)}
                </S.RowCell>

                <S.RowActionsCell>
                  <S.EditButton onClick={() => { setEditing(task); setShowModal(true) }}>
                    Edit
                  </S.EditButton>
                  <S.DeleteButton title="Delete task" onClick={() => handleDelete(task.id)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </S.DeleteButton>
                </S.RowActionsCell>
              </S.TableRow>
            )
          })}

        {/* ── Pagination footer ─ */}
        {!loading && !error && (
          <S.FooterRow>
            Show
            <S.PageSizeSelect value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </S.PageSizeSelect>
            Records
          </S.FooterRow>
        )}
      </S.TableWrapper>

      {/* ── Create / Edit modal ────────────────────────────── */}
      {showModal && (
        <TaskModal
          task={editing}
          onClose={() => { setShowModal(false); setEditing(null) }}
        />
      )}
    </Box>
  )
}
