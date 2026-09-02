'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useIntroductoryNoteStore } from '@/stores/introductoryNoteStore'
import { useClientStore } from '@/stores/clientStore'
import IntroNoteDetailsTab from './tabs/DetailsTab'
import IntroNotePageContentTab from './tabs/IntroNotePageContentTab'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type IntroNoteTab = 'details' | 'content'

const TABS: { key: IntroNoteTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'New Page' },
]

export default function IntroductoryNoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = routeParam(params?.id)

  const client = useClientStore((s) => s.client)
  const { introductoryNote, introductoryNoteLoading, saving, fetchIntroductoryNote, deleteIntroductoryNote } = useIntroductoryNoteStore()

  const [activeTab, setActiveTab] = useState<IntroNoteTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchIntroductoryNote(id)
  }, [client, id])

  async function handleDelete() {
    await deleteIntroductoryNote(id)
    router.push('/library/introductory-notes')
  }

  if (introductoryNoteLoading) return <S.CenteredState>Loading…</S.CenteredState>
  if (!introductoryNoteLoading && !introductoryNote) return <S.CenteredState>Note not found</S.CenteredState>

  return (
    <S.EditorRoot>
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn onClick={() => router.push('/library/introductory-notes')} title="Back to introductory notes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{introductoryNote!.name}</S.TopBarTitle>
            <S.TopBarSub>Introductory Note</S.TopBarSub>
          </div>
        </S.TopBarLeft>

        <S.TopBarTabs>
          {TABS.map(({ key, label }) => (
            <S.TopBarTab key={key} $active={activeTab === key} onClick={() => setActiveTab(key)}>
              {label}
            </S.TopBarTab>
          ))}
        </S.TopBarTabs>

        <S.TopBarRight>
          {saving && <S.SavingBadge>Saving…</S.SavingBadge>}
          {confirmDelete ? (
            <>
              <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this note?</span>
              <S.TopBarBtn $danger onClick={handleDelete}>Yes, delete</S.TopBarBtn>
              <S.TopBarBtn onClick={() => setConfirmDelete(false)}>Cancel</S.TopBarBtn>
            </>
          ) : (
            <S.TopBarBtn $danger onClick={() => setConfirmDelete(true)}>Delete</S.TopBarBtn>
          )}
        </S.TopBarRight>
      </S.EditorTopBar>

      <S.EditorBody>
        {activeTab === 'details' && (
          <S.TabBody>
            <IntroNoteDetailsTab introductoryNote={introductoryNote!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <IntroNotePageContentTab introductoryNote={introductoryNote!} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
