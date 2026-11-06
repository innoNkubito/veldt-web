'use client'

import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import GuestFormCard from './GuestFormCard'
import NewFormModal from './NewFormModal'
import { COPY } from './page.constants'
import { useGuestFormsPage } from './useGuestFormsPage'
import * as S from './page.styled'

export default function GuestFormsPage() {
  const page = useGuestFormsPage()
  const newButton = page.canEdit && (
    <ActionButton $variant="primary" onClick={page.openPicker}>
      {COPY.newForm}
    </ActionButton>
  )

  return (
    <S.PageRoot>
      <S.PageHead>
        <div>
          <S.PageTitle>{COPY.title}</S.PageTitle>
          <S.PageSub>{COPY.subtitle}</S.PageSub>
        </div>
        <S.Controls>
          <S.Toggle>
            <input
              type="checkbox"
              checked={page.includeArchived}
              onChange={(e) => page.setIncludeArchived(e.target.checked)}
            />
            {COPY.showArchived}
          </S.Toggle>
          {newButton}
        </S.Controls>
      </S.PageHead>

      {!page.canEdit && <S.Muted>{COPY.readOnly}</S.Muted>}
      {page.error && <S.Notice $error>{page.error}</S.Notice>}
      {page.notice && <S.Notice $error={page.notice.error}>{page.notice.text}</S.Notice>}

      {page.loading && page.forms.length === 0 ? (
        <S.EmptyState>{COPY.loading}</S.EmptyState>
      ) : page.forms.length === 0 ? (
        <S.EmptyState>
          <S.EmptyTitle>{COPY.emptyTitle}</S.EmptyTitle>
          {COPY.emptyBody}
          {newButton && <S.EmptyAction>{newButton}</S.EmptyAction>}
        </S.EmptyState>
      ) : (
        <S.Grid>
          {page.forms.map((form) => (
            <GuestFormCard
              key={form.id}
              form={form}
              canEdit={page.canEdit}
              busy={page.saving}
              onOpen={() => page.open(form)}
              onToggleArchived={() => page.toggleArchived(form)}
              onDelete={() => page.remove(form)}
            />
          ))}
        </S.Grid>
      )}

      {page.pickerOpen && <NewFormModal onClose={page.closePicker} />}
    </S.PageRoot>
  )
}
