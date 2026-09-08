import { create } from 'zustand'
import { gql } from 'graphql-request'
import { useClientStore } from './clientStore'
import { gqlErrorMessage } from '@/lib/gql-error'
import { ACCENT } from '@/lib/theme'

// ── Types ───────────────────────────────────────────────────────

export type TaskType = 'EMAIL' | 'PAYMENTS' | 'CHECK_IN' | 'FOLLOW_UP' | 'PHONE_CALL' | 'ADMIN'
export type TaskDueAnchor = 'TRIP_START' | 'TRIP_END'

export interface TaskItem {
  id: string
  name: string
  itinerary: { id: string; proposalTitle: string } | null
  assignedTo: { id: string; firstName: string | null; lastName: string | null } | null
  type: TaskType | null
  tags: string[]
  dueDate: string | null
  relativeDays: number | null
  relativeBefore: boolean | null
  relativeAnchor: TaskDueAnchor | null
  note: string | null
  completed: boolean
  completedAt: string | null
  createdAt: string
}

export interface TeamMember {
  id: string
  firstName: string | null
  lastName: string | null
  role: string
}

export interface FileOption {
  id: string
  proposalTitle: string
}

export interface TaskInput {
  name?: string
  itineraryId?: string | null
  assignedToId?: string | null
  type?: TaskType | null
  tags?: string[]
  dueDate?: string | null
  relativeDays?: number | null
  relativeBefore?: boolean | null
  relativeAnchor?: TaskDueAnchor | null
  note?: string | null
}

// ── GQL ─────────────────────────────────────────────────────────

const TASK_FIELDS = `
  id name
  itinerary { id proposalTitle }
  assignedTo { id firstName lastName }
  type tags dueDate
  relativeDays relativeBefore relativeAnchor
  note completed completedAt createdAt
`

const GET_TASKS = gql`
  query GetTasks {
    tasks { ${TASK_FIELDS} }
  }
`

const GET_TASK_META = gql`
  query GetTaskMeta {
    teamMembers { id firstName lastName role }
    itineraries { id proposalTitle }
  }
`

const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) { ${TASK_FIELDS} }
  }
`

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskInput!) {
    updateTask(id: $id, input: $input) { ${TASK_FIELDS} }
  }
`

const SET_TASK_COMPLETED = gql`
  mutation SetTaskCompleted($id: ID!, $completed: Boolean!) {
    setTaskCompleted(id: $id, completed: $completed) { ${TASK_FIELDS} }
  }
`

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`

// ── Store ───────────────────────────────────────────────────────

interface TaskState {
  tasks: TaskItem[]
  loading: boolean
  saving: boolean
  error: string | null
  teamMembers: TeamMember[]
  fileOptions: FileOption[]
  metaLoading: boolean

  fetchTasks: () => Promise<void>
  fetchMeta: () => Promise<void>
  createTask: (input: TaskInput) => Promise<TaskItem | null>
  updateTask: (id: string, input: TaskInput) => Promise<TaskItem | null>
  setTaskCompleted: (id: string, completed: boolean) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  saving: false,
  error: null,
  teamMembers: [],
  fileOptions: [],
  metaLoading: false,

  fetchTasks: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ loading: true, error: null })
    try {
      const data = await client.request<{ tasks: TaskItem[] }>(GET_TASKS)
      set({ tasks: data.tasks, loading: false })
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to load tasks'), loading: false })
    }
  },

  fetchMeta: async () => {
    const client = useClientStore.getState().client
    if (!client) return
    set({ metaLoading: true })
    try {
      const data = await client.request<{ teamMembers: TeamMember[]; itineraries: FileOption[] }>(
        GET_TASK_META,
      )
      set({ teamMembers: data.teamMembers, fileOptions: data.itineraries, metaLoading: false })
    } catch {
      set({ metaLoading: false })
    }
  },

  createTask: async (input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ createTask: TaskItem }>(CREATE_TASK, { input })
      set((s) => ({ tasks: [...s.tasks, data.createTask], saving: false }))
      return data.createTask
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to create task'), saving: false })
      return null
    }
  },

  updateTask: async (id, input) => {
    const client = useClientStore.getState().client
    if (!client) return null
    set({ saving: true })
    try {
      const data = await client.request<{ updateTask: TaskItem }>(UPDATE_TASK, { id, input })
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? data.updateTask : t)),
        saving: false,
      }))
      return data.updateTask
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to update task'), saving: false })
      return null
    }
  },

  setTaskCompleted: async (id, completed) => {
    const client = useClientStore.getState().client
    if (!client) return
    // Optimistic toggle
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed } : t)),
    }))
    try {
      const data = await client.request<{ setTaskCompleted: TaskItem }>(SET_TASK_COMPLETED, {
        id,
        completed,
      })
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data.setTaskCompleted : t)) }))
    } catch (err) {
      // Revert on failure
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
        error: gqlErrorMessage(err, 'Failed to update task'),
      }))
    }
  },

  deleteTask: async (id) => {
    const client = useClientStore.getState().client
    if (!client) return
    try {
      await client.request(DELETE_TASK, { id })
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    } catch (err) {
      set({ error: gqlErrorMessage(err, 'Failed to delete task') })
    }
  },
}))

// ── Shared task type config ─────────────────────────────────────

export const TASK_TYPE_CONFIG: Record<TaskType, { label: string; bg: string; fg: string; border: string }> = {
  EMAIL:      { label: 'Email',      bg: ACCENT.moss.bg, fg: ACCENT.moss.fg, border: ACCENT.moss.border },
  PAYMENTS:   { label: 'Payments',   bg: ACCENT.indigo.bg, fg: ACCENT.indigo.fg, border: ACCENT.indigo.border },
  CHECK_IN:   { label: 'Check In',   bg: ACCENT.leaf.bg, fg: ACCENT.leaf.fg, border: ACCENT.leaf.border },
  FOLLOW_UP:  { label: 'Follow Up',  bg: ACCENT.rose.bg, fg: ACCENT.rose.fg, border: ACCENT.rose.border },
  PHONE_CALL: { label: 'Phone Call', bg: ACCENT.plum.bg, fg: ACCENT.plum.fg, border: ACCENT.plum.border },
  ADMIN:      { label: 'Admin',      bg: ACCENT.clay.bg, fg: ACCENT.clay.fg, border: ACCENT.clay.border },
}

export const TASK_TYPES: TaskType[] = ['EMAIL', 'PAYMENTS', 'CHECK_IN', 'FOLLOW_UP', 'PHONE_CALL', 'ADMIN']

export function memberName(m: { firstName: string | null; lastName: string | null } | null): string {
  if (!m) return '—'
  return `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim() || '—'
}
