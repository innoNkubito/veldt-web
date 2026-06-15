'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAreaStore } from '@/stores/areaStore'
import { useClientStore } from '@/stores/clientStore'
import * as S from './page.styled'

export default function AreasListPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { areas, loading, saving, fetchAreas, createArea } = useAreaStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (client) fetchAreas()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return areas
    return areas.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.country ?? '').toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [areas, search])

  async function handleCreate() {
    if (!newName.trim()) return
    const created = await createArea(newName.trim())
    if (created) {
      setShowCreate(false)
      setNewName('')
      router.push(`/library/areas/${created.id}`)
    }
  }

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Areas</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${areas.length} area${areas.length === 1 ? '' : 's'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search areas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ New Area</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && filtered.length === 0 ? (
        <S.EmptyState>
          <div>{search ? 'No areas match your search.' : 'No areas yet.'}</div>
          {!search && (
            <S.CreateButton onClick={() => setShowCreate(true)}>
              Create your first area
            </S.CreateButton>
          )}
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.Thead>
            <tr>
              <S.Th>Name</S.Th>
              <S.Th>Country</S.Th>
              <S.Th>Tags</S.Th>
            </tr>
          </S.Thead>
          <S.Tbody>
            {filtered.map((area) => (
              <S.Tr key={area.id} onClick={() => router.push(`/library/areas/${area.id}`)}>
                <S.Td>
                  <S.PropertyName>{area.name}</S.PropertyName>
                </S.Td>
                <S.Td>{area.country ?? '—'}</S.Td>
                <S.Td>
                  {area.tags.slice(0, 3).map((tag) => (
                    <S.TagChip key={tag}>{tag}</S.TagChip>
                  ))}
                  {area.tags.length > 3 && (
                    <S.TagChip>+{area.tags.length - 3}</S.TagChip>
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
            <S.ModalTitle>New Area</S.ModalTitle>
            <S.ModalSubtitle>You can fill in the details after creating it.</S.ModalSubtitle>
            <S.ModalLabel htmlFor="new-area-name">Area name</S.ModalLabel>
            <S.ModalInput
              id="new-area-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Masai Mara"
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
