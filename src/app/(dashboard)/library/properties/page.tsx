'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useContentLibraryStore } from '@/stores/contentLibraryStore'
import { useClientStore } from '@/stores/clientStore'
import * as S from './page.styled'

export default function PropertiesListPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { properties, loading, saving, fetchProperties, createProperty } =
    useContentLibraryStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (client) fetchProperties()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return properties
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.country ?? '').toLowerCase().includes(q) ||
        (p.area?.name ?? '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [properties, search])

  async function handleCreate() {
    if (!newName.trim()) return
    const created = await createProperty(newName.trim())
    if (created) {
      setShowCreate(false)
      setNewName('')
      router.push(`/library/properties/${created.id}`)
    }
  }

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Properties</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search properties…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ New Property</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && filtered.length === 0 ? (
        <S.EmptyState>
          <div>{search ? 'No properties match your search.' : 'No properties yet.'}</div>
          {!search && (
            <S.CreateButton onClick={() => setShowCreate(true)}>
              Create your first property
            </S.CreateButton>
          )}
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.Thead>
            <tr>
              <S.Th>Name / Area</S.Th>
              <S.Th>Country</S.Th>
              <S.Th>Rooms</S.Th>
              <S.Th>Tags</S.Th>
            </tr>
          </S.Thead>
          <S.Tbody>
            {filtered.map((prop) => (
              <S.Tr key={prop.id} onClick={() => router.push(`/library/properties/${prop.id}`)}>
                <S.Td>
                  <S.PropertyName>{prop.name}</S.PropertyName>
                  {prop.area && <S.AreaSub>{prop.area.name}</S.AreaSub>}
                </S.Td>
                <S.Td>{prop.country ?? '—'}</S.Td>
                <S.Td>{prop.rooms.length}</S.Td>
                <S.Td>
                  {prop.tags.slice(0, 3).map((tag) => (
                    <S.TagChip key={tag}>{tag}</S.TagChip>
                  ))}
                  {prop.tags.length > 3 && (
                    <S.TagChip>+{prop.tags.length - 3}</S.TagChip>
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
            <S.ModalTitle>New Property</S.ModalTitle>
            <S.ModalSubtitle>
              You can fill in the details after creating it.
            </S.ModalSubtitle>
            <S.ModalLabel htmlFor="new-prop-name">Property name</S.ModalLabel>
            <S.ModalInput
              id="new-prop-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Singita Grumeti"
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
