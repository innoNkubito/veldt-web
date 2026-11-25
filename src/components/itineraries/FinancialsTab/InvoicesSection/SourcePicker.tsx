"use client";

import { useState } from "react";
import { ActionButton } from "@/components/itineraries/shared/ActionButton";
import {
  Field,
  FieldLabel,
  FieldSelect,
} from "@/components/itineraries/shared/FieldPrimitives";
import { formatMoney, type ClientInvoiceSource } from "@/lib/invoices";
import type { InvoiceableBooking } from "@/stores/clientInvoiceStore";
import { SOURCES } from "./InvoicesSection.constants";
import * as S from "./InvoicesSection.styled";

interface Props {
  bookings: InvoiceableBooking[];
  busy: boolean;
  onCreate: (
    source: ClientInvoiceSource,
    bookingId: string | null,
  ) => Promise<string | null>;
  onClose: () => void;
}

/** Where a new invoice's lines come from. A booking is the default when there is one. */
export default function SourcePicker({
  bookings,
  busy,
  onCreate,
  onClose,
}: Props) {
  const [source, setSource] = useState<ClientInvoiceSource>(
    bookings.length ? "BOOKING" : "QUOTE",
  );
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (busy) return;
    const message = await onCreate(
      source,
      source === "BOOKING" ? bookingId : null,
    );
    setError(message);
  }

  return (
    <S.Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <S.ModalCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-source-title"
      >
        <S.ModalTitle id="invoice-source-title">New invoice</S.ModalTitle>
        <S.ModalText>
          Start from what this trip already holds. Everything stays editable.
        </S.ModalText>

        <div
          role="radiogroup"
          aria-label="Start from"
          style={{ display: "grid", gap: 8 }}
        >
          {SOURCES.map((option) => {
            const disabled =
              option.value === "BOOKING" && bookings.length === 0;
            return (
              <S.Choice
                key={option.value}
                $active={source === option.value}
                $disabled={disabled}
              >
                <input
                  type="radio"
                  name="invoice-source"
                  value={option.value}
                  checked={source === option.value}
                  disabled={disabled}
                  onChange={() => setSource(option.value)}
                />
                <S.ChoiceLabel>{option.label}</S.ChoiceLabel>
                <S.ChoiceHint>
                  {disabled ? "This trip has no bookings yet." : option.hint}
                </S.ChoiceHint>
              </S.Choice>
            );
          })}
        </div>

        {source === "BOOKING" && bookings.length > 1 && (
          <Field>
            <FieldLabel htmlFor="invoice-booking">Booking</FieldLabel>
            <FieldSelect
              id="invoice-booking"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.reference} — {b.clientName} ·{" "}
                  {formatMoney(b.total, b.currency)}
                </option>
              ))}
            </FieldSelect>
          </Field>
        )}

        {error && <S.ModalError role="alert">{error}</S.ModalError>}
        <S.ModalActions>
          <ActionButton type="button" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton
            type="button"
            $variant="primary"
            $disabled={busy}
            disabled={busy}
            onClick={submit}
          >
            {busy ? "Creating…" : "Create draft"}
          </ActionButton>
        </S.ModalActions>
      </S.ModalCard>
    </S.Overlay>
  );
}
