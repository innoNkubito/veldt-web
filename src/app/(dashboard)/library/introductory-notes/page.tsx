'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useIntroductoryNoteStore } from '@/stores/introductoryNoteStore'
import { useClientStore } from '@/stores/clientStore'
import * as S from './page.styled'

export default function IntroductoryNotesListPage() {
  const router = useRouter()
  const client = useClientStore((s) => s.client)
  const { introductoryNotes, loading, saving, fetchIntroductoryNotes, createIntroductoryNote } = useIntroductoryNoteStore()

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (client) fetchIntroductoryNotes()
  }, [client])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return introductoryNotes
    return introductoryNotes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [introductoryNotes, search])

  async function handleCreate() {
    if (!newName.trim()) return
    const created = await createIntroductoryNote(newName.trim())
    if (created) {
      setShowCreate(false)
      setNewName('')
      router.push(`/library/introductory-notes/${created.id}`)
    }
  }

  return (
    <S.PageRoot>
      <S.Header>
        <S.TitleGroup>
          <S.PageTitle>Introductory Notes</S.PageTitle>
          <S.PageSubtitle>
            {loading ? 'Loading…' : `${introductoryNotes.length} note${introductoryNotes.length === 1 ? '' : 's'}`}
          </S.PageSubtitle>
        </S.TitleGroup>
        <S.HeaderRight>
          <S.SearchInput
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <S.CreateButton onClick={() => setShowCreate(true)}>+ New Note</S.CreateButton>
        </S.HeaderRight>
      </S.Header>

      {!loading && filtered.length === 0 ? (
        <S.EmptyState>
          <div>{search ? 'No notes match your search.' : 'No introductory notes yet.'}</div>
          {!search && (
            <S.CreateButton onClick={() => setShowCreate(true)}>
              Create your first note
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
            {filtered.map((note) => (
              <S.Tr key={note.id} onClick={() => router.push(`/library/introductory-notes/${note.id}`)}>
                <S.Td>
                  <S.PropertyName>{note.name}</S.PropertyName>
                </S.Td>
                <S.Td>
                  {note.tags.slice(0, 3).map((tag) => (
                    <S.TagChip key={tag}>{tag}</S.TagChip>
                  ))}
                  {note.tags.length > 3 && (
                    <S.TagChip>+{note.tags.length - 3}</S.TagChip>
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
            <S.ModalTitle>New Introductory Note</S.ModalTitle>
            <S.ModalSubtitle>You can fill in the details after creating it.</S.ModalSubtitle>
            <S.ModalLabel htmlFor="new-intronote-name">Note title</S.ModalLabel>
            <S.ModalInput
              id="new-intronote-name"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Welcome to Your Safari"
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
