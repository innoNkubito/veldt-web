'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTermsAndConditionsStore } from '@/stores/termsAndConditionsStore'
import { useClientStore } from '@/stores/clientStore'
import * as S from './page.styled'

export default function TermsListPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { termsList, loading, saving, fetchTermsList, createTerms } = useTermsAndConditionsStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (client) fetchTermsList()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return termsList
    return termsList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }, [termsList, search])

  async function handleCreate() {
    if (!newName.trim()) return
    const created = await createTerms(newName.trim())
    if (created) {
      setShowCreate(false)
      setNewName('')
      router.push(`/library/terms-and-conditions/${created.id}`)
    }
  }

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Terms &amp; Conditions</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${termsList.length} page${termsList.length === 1 ? '' : 's'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search terms pages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ New Page</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && filtered.length === 0 ? (
        <S.EmptyState>
          <div>{search ? 'No pages match your search.' : 'No terms & conditions pages yet.'}</div>
          {!search && (
            <S.CreateButton onClick={() => setShowCreate(true)}>
              Create your first page
            </S.CreateButton>
          )}
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.Thead>
            <tr>
              <S.Th>Title</S.Th>
              <S.Th>Tags</S.Th>
            </tr>
          </S.Thead>
          <S.Tbody>
            {filtered.map((item) => (
              <S.Tr
                key={item.id}
                onClick={() => router.push(`/library/terms-and-conditions/${item.id}`)}
              >
                <S.Td>
                  <S.PropertyName>{item.name}</S.PropertyName>
                </S.Td>
                <S.Td>
                  {item.tags.slice(0, 3).map((tag) => (
                    <S.TagChip key={tag}>{tag}</S.TagChip>
                  ))}
                  {item.tags.length > 3 && (
                    <S.TagChip>+{item.tags.length - 3}</S.TagChip>
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
            <S.ModalTitle>New Terms &amp; Conditions Page</S.ModalTitle>
            <S.ModalSubtitle>You can fill in the details after creating it.</S.ModalSubtitle>
            <S.ModalLabel htmlFor="new-terms-name">Page title</S.ModalLabel>
            <S.ModalInput
              id="new-terms-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Standard Booking Terms"
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
