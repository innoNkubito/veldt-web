'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTermsAndConditionsStore } from '@/stores/termsAndConditionsStore'
import { useClientStore } from '@/stores/clientStore'
import TermsDetailsTab from './tabs/DetailsTab'
import TermsRichContentTab from './tabs/TermsRichContentTab'
import * as S from './page.styled'
import { routeParam } from '@/lib/guards'

type TermsTab = 'details' | 'content'

const TABS: { key: TermsTab; label: string }[] = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'New Page' },
]

export default function TermsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = routeParam(params?.id)

  const client = useClientStore((s) => s.client)
  const { terms, termsLoading, saving, fetchTerms, deleteTerms } = useTermsAndConditionsStore()

  const [activeTab, setActiveTab] = useState<TermsTab>('details')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (client && id) fetchTerms(id)
  }, [client, id])

  async function handleDelete() {
    await deleteTerms(id)
    router.push('/library/terms-and-conditions')
  }

  if (termsLoading) return <S.CenteredState>Loading…</S.CenteredState>
  if (!termsLoading && !terms) return <S.CenteredState>Page not found</S.CenteredState>

  return (
    <S.EditorRoot>
      <S.EditorTopBar>
        <S.TopBarLeft>
          <S.BackBtn
            onClick={() => router.push('/library/terms-and-conditions')}
            title="Back to Terms & Conditions"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </S.BackBtn>
          <div>
            <S.TopBarTitle>{terms!.name}</S.TopBarTitle>
            <S.TopBarSub>Terms &amp; Conditions</S.TopBarSub>
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
            <TermsDetailsTab terms={terms!} />
          </S.TabBody>
        )}
        {activeTab === 'content' && (
          <TermsRichContentTab terms={terms!} onSaved={() => setActiveTab('details')} />
        )}
      </S.EditorBody>
    </S.EditorRoot>
  )
}
