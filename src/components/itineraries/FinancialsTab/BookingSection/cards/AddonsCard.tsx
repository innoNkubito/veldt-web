'use client'

import { useState } from 'react'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { confirmDialog } from '@/stores/confirmStore'
import { useBookingStore, type BookingAddon } from '@/stores/bookingStore'
import AddonModal from '../AddonModal'
import { REMOVE_ADDON_DIALOG } from '../BookingSection.constants'
import type { ConfigCardProps } from '../BookingSection.types'
import * as S from '../BookingSection.styled'

/** Optional per-person extras clients can add at checkout. */
export default function AddonsCard({ config, currency, saving }: ConfigCardProps) {
  const { addAddon, editAddon, removeAddon } = useBookingStore()
  const [modal, setModal] = useState<{ open: boolean; existing: BookingAddon | null }>({ open: false, existing: null })
  const configSaved = config != null

  async function remove(addon: BookingAddon) {
    if (await confirmDialog(REMOVE_ADDON_DIALOG(addon.name))) await removeAddon(addon.id)
  }

  return (
    <S.Card>
      <S.CardTitleRow>
        <S.CardTitle>Add-ons</S.CardTitle>
        <ActionButton
          $variant="outline"
          $disabled={!configSaved}
          onClick={() => configSaved && setModal({ open: true, existing: null })}
        >
          + Add Add-on
        </ActionButton>
      </S.CardTitleRow>

      {!configSaved ? (
        <S.EmptyRow>Save your booking settings below to start adding add-ons.</S.EmptyRow>
      ) : config.addons.length === 0 ? (
        <S.EmptyRow>No add-ons — optional extras clients can add at checkout.</S.EmptyRow>
      ) : (
        <S.ItemList>
          {config.addons.map((addon) => (
            <S.ItemRow key={addon.id}>
              <S.ItemMain>
                <S.ItemName>{addon.name}</S.ItemName>
                {addon.description && <S.ItemDesc>{addon.description}</S.ItemDesc>}
                <S.ItemMeta>
                  {addon.limitCount != null ? `Covers up to ${addon.limitCount} guests` : 'No guest limit'}
                </S.ItemMeta>
              </S.ItemMain>
              <S.ItemPrice>
                {currency} {addon.perPersonPrice.toLocaleString()}
                <S.PriceUnit>per person</S.PriceUnit>
              </S.ItemPrice>
              <S.ItemActions>
                <S.LinkButton onClick={() => setModal({ open: true, existing: addon })}>Edit</S.LinkButton>
                <S.LinkButton $danger onClick={() => remove(addon)}>
                  Remove
                </S.LinkButton>
              </S.ItemActions>
            </S.ItemRow>
          ))}
        </S.ItemList>
      )}

      {modal.open && (
        <AddonModal
          existing={modal.existing}
          currency={currency}
          saving={saving}
          onSave={(input) => (modal.existing ? editAddon(modal.existing.id, input) : addAddon(input))}
          onClose={() => setModal({ open: false, existing: null })}
        />
      )}
    </S.Card>
  )
}
