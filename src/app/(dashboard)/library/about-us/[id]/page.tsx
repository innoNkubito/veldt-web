'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAboutUsStore } from '@/stores/aboutUsStore'
import { useClientStore } from '@/stores/clientStore'
import AboutUsDetailsTab from './tabs/DetailsTab'
import AboutUsPageContentTab from './tabs/AboutUsPageContentTab'
import * as S from './page.styled'

type AboutUsTab = 'details' | 'content'

const TABS: { key: AboutUsTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'New Page' },
]

export default function AboutUsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const client = useClientStore((s) => s.client)
  const { aboutUs, aboutUsLoading, saving, fetchAboutUs, deleteAboutUs } = useAboutUsStore()

  const [activeTab, setActiveTab] = useState<AboutUsTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchAboutUs(id)
  }, [client, id])

  async function handleDelete() {
    await deleteAboutUs(id)
    router.push('/library/about-us')
  }

  if (aboutUsLoading) return <S.CenteredState>Loading…</S.CenteredState>
  if (!aboutUsLoading && !aboutUs) return <S.CenteredState>Page not found</S.CenteredState>

  return (
    <S.EditorRoot>
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn onClick={() => router.push('/library/about-us')} title="Back to about us">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{aboutUs!.name}</S.TopBarTitle>
            <S.TopBarSub>About Us</S.TopBarSub>
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
              <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this page?</span>
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
            <AboutUsDetailsTab aboutUs={aboutUs!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <AboutUsPageContentTab aboutUs={aboutUs!} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
