'use client'

import { useState } from 'react'
import { ActionButton } from '@/components/itineraries/shared/ActionButton'
import { confirmDialog } from '@/stores/confirmStore'
import { useBookingStore, type BookingPackage, type PackageInput } from '@/stores/bookingStore'
import { BUILDER_SECTION } from '@/lib/builderSections'
import PackageModal from '../PackageModal'
import { REMOVE_PACKAGE_DIALOG } from '../BookingSection.constants'
import type { ConfigCardProps } from '../BookingSection.types'
import * as S from '../BookingSection.styled'

interface PackagesCardProps extends ConfigCardProps {
  /** One package at the quoted price, when the quote has one. */
  quotePackage: PackageInput | null
  /** After a package is added, point at the next setup step. */
  onAdded: () => void
}

/** What clients can book. At least one is required for Book through Veldt. */
export default function PackagesCard({ config, currency, saving, quotePackage, onAdded }: PackagesCardProps) {
  const { addPackage, editPackage, removePackage, setError } = useBookingStore()
  const [modal, setModal] = useState<{ open: boolean; existing: BookingPackage | null }>({ open: false, existing: null })
  const configSaved = config != null

  async function createFromQuote(input: PackageInput) {
    const message = await addPackage(input)
    if (message) setError(message)
    else onAdded()
  }

  async function remove(pkg: BookingPackage) {
    if (await confirmDialog(REMOVE_PACKAGE_DIALOG(pkg.name))) await removePackage(pkg.id)
  }

  return (
    <S.Card id={BUILDER_SECTION.bookingPackages}>
      <S.CardTitleRow>
        <S.CardTitle>Packages</S.CardTitle>
        <S.TitleActions>
          {configSaved && config.packages.length === 0 && quotePackage && (
            <ActionButton $variant="outline" $disabled={saving} onClick={() => !saving && createFromQuote(quotePackage)}>
              Create from Quote
            </ActionButton>
          )}
          <ActionButton
            $variant="outline"
            $disabled={!configSaved}
            onClick={() => configSaved && setModal({ open: true, existing: null })}
          >
            + Add Package
          </ActionButton>
        </S.TitleActions>
      </S.CardTitleRow>

      {!configSaved ? (
        <S.EmptyRow>Save your booking settings below to start adding packages.</S.EmptyRow>
      ) : config.packages.length === 0 ? (
        <S.EmptyRow>
          Required — clients need at least one package to book. Add one, or create it from the quote.
        </S.EmptyRow>
      ) : (
        <S.ItemList>
          {config.packages.map((pkg) => (
            <S.ItemRow key={pkg.id}>
              <S.ItemMain>
                <S.ItemName>{pkg.name}</S.ItemName>
                {pkg.description && <S.ItemDesc>{pkg.description}</S.ItemDesc>}
                <S.ItemMeta>
                  {pkg.peopleIncluded} {pkg.peopleIncluded === 1 ? 'person' : 'people'} · {pkg.totalAvailable} available
                </S.ItemMeta>
              </S.ItemMain>
              <S.ItemPrice>
                {currency} {pkg.price.toLocaleString()}
              </S.ItemPrice>
              <S.ItemActions>
                <S.LinkButton onClick={() => setModal({ open: true, existing: pkg })}>Edit</S.LinkButton>
                <S.LinkButton $danger onClick={() => remove(pkg)}>
                  Remove
                </S.LinkButton>
              </S.ItemActions>
            </S.ItemRow>
          ))}
        </S.ItemList>
      )}

      {modal.open && (
        <PackageModal
          existing={modal.existing}
          currency={currency}
          saving={saving}
          onSave={async (input) => {
            if (modal.existing) return editPackage(modal.existing.id, input)
            const message = await addPackage(input)
            // The modal closes itself on success; the schedule comes next.
            if (!message) onAdded()
            return message
          }}
          onClose={() => setModal({ open: false, existing: null })}
        />
      )}
    </S.Card>
  )
}
