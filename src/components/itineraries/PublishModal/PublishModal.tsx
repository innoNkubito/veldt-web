'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import * as S from './PublishModal.styled'
import { usePublishModal } from './usePublishModal'
import { COPY } from './PublishModal.constants'
import { fixTarget } from './PublishModal.utils'
import type { PublishModalProps } from './PublishModal.types'

/**
 * Confirms publishing — or, when something is missing, lists every problem
 * with a link straight to where it is fixed.
 */
export default function PublishModal({
  itineraryId,
  onConfirm,
  onCancel,
  onFix,
  loading,
}: PublishModalProps) {
  const modal = usePublishModal({ itineraryId })

  return (
    <S.Overlay onClick={onCancel}>
      <S.Card onClick={(e) => e.stopPropagation()}>
        <S.Title>{modal.blocked ? COPY.blockedTitle : COPY.title}</S.Title>

        {modal.state.status === 'checking' && <S.Body>{COPY.checking}</S.Body>}

        {modal.blocked && (
          <>
            <S.Body>{COPY.blockedBody}</S.Body>
            <S.IssueList>
              {modal.issues.map((issue) => (
                <S.Issue key={issue.code}>
                  <S.IssueText>{issue.message}</S.IssueText>
                  <S.FixButton type="button" onClick={() => onFix(fixTarget(issue))}>
                    {COPY.fix}
                  </S.FixButton>
                </S.Issue>
              ))}
            </S.IssueList>
          </>
        )}

        {modal.state.status !== 'checking' && !modal.blocked && (
          <S.Body>
            {modal.state.status === 'unknown' && (
              <S.CheckFailed>
                {COPY.checkFailed}: {modal.state.error}
              </S.CheckFailed>
            )}
            {COPY.body}
          </S.Body>
        )}

        <S.Actions>
          <ActionButton onClick={onCancel}>{modal.blocked ? COPY.close : COPY.cancel}</ActionButton>
          {!modal.blocked && (
            <ActionButton
              $variant="primary"
              onClick={() => modal.canPublish && !loading && onConfirm()}
              $disabled={loading || !modal.canPublish}
            >
              {loading ? COPY.publishing : COPY.publish}
            </ActionButton>
          )}
        </S.Actions>
      </S.Card>
    </S.Overlay>
  )
}
