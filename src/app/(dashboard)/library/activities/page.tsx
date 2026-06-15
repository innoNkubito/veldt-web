'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useActivityStore } from '@/stores/activityStore'
import { useClientStore } from '@/stores/clientStore'
import * as S from './page.styled'

export default function ActivitiesListPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { activities, loading, saving, fetchActivities, createActivity } = useActivityStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (client) fetchActivities()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return activities
    return activities.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.country ?? '').toLowerCase().includes(q) ||
        (a.area?.name ?? '').toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [activities, search])

  async function handleCreate() {
    if (!newName.trim()) return
    const created = await createActivity(newName.trim())
    if (created) {
      setShowCreate(false)
      setNewName('')
      router.push(`/library/activities/${created.id}`)
    }
  }

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Activities</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${activities.length} activit${activities.length === 1 ? 'y' : 'ies'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search activities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ New Activity</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && filtered.length === 0 ? (
        <S.EmptyState>
          <div>{search ? 'No activities match your search.' : 'No activities yet.'}</div>
          {!search && (
            <S.CreateButton onClick={() => setShowCreate(true)}>
              Create your first activity
            </S.CreateButton>
          )}
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.Thead>
            <tr>
              <S.Th>Name / Area</S.Th>
              <S.Th>Country</S.Th>
              <S.Th>Tags</S.Th>
            </tr>
          </S.Thead>
          <S.Tbody>
            {filtered.map((activity) => (
              <S.Tr key={activity.id} onClick={() => router.push(`/library/activities/${activity.id}`)}>
                <S.Td>
                  <S.PropertyName>{activity.name}</S.PropertyName>
                  {activity.area && <S.AreaSub>{activity.area.name}</S.AreaSub>}
                </S.Td>
                <S.Td>{activity.country ?? '—'}</S.Td>
                <S.Td>
                  {activity.tags.slice(0, 3).map((tag) => (
                    <S.TagChip key={tag}>{tag}</S.TagChip>
                  ))}
                  {activity.tags.length > 3 && (
                    <S.TagChip>+{activity.tags.length - 3}</S.TagChip>
                  )}
                </S.Td>
              </S.Tr>
            ))}
          </S.Tbody>
        </S.Table>
      )}

      {showCreate && (
        <S.Overlay onClick={() => setShowCreate(false)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>New Activity</S.ModalTitle>
            <S.ModalSubtitle>You can fill in the details after creating it.</S.ModalSubtitle>
            <S.ModalLabel htmlFor="new-activity-name">Activity name</S.ModalLabel>
            <S.ModalInput
              id="new-activity-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Hot Air Balloon Safari"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <S.ModalActions>
              <S.CancelButton onClick={() => { setShowCreate(false); setNewName('') }}>
                Cancel
              </S.CancelButton>
              <S.CreateButton onClick={handleCreate} disabled={saving || !newName.trim()}>
                {saving ? 'Creating…' : 'Create'}
              </S.CreateButton>
            </S.ModalActions>
          </S.ModalCard>
        </S.Overlay>
      )}
    </S.PageRoot>
  )
}
