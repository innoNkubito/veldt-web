"use client";

import { useEffect, useState } from "react";
import { useBuilderStore } from "@/stores/builderStore";
import { useClientStore } from "@/stores/clientStore";
import { useProfileStore } from "@/stores/profileStore";
import { useClientInvoiceStore } from "@/stores/clientInvoiceStore";
import { confirmDialog } from "@/stores/confirmStore";
import type { ClientInvoice, ClientInvoiceSource } from "@/lib/invoices";
import type { InvoiceModal } from "./InvoicesSection.types";

/**
 * The trip's invoices: the list, which one is open, the source picker and the
 * send / void / payment dialogs. Editing a draft lives in useInvoiceEditor.
 */
export function useInvoicesSection() {
  const client = useClientStore((s) => s.client);
  const itinerary = useBuilderStore((s) => s.itinerary);
  const role = useProfileStore((s) => s.profile?.role);
  const store = useClientInvoiceStore();
  const { fetch } = store;

  const [openId, setOpenId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [modal, setModal] = useState<InvoiceModal>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (client && itinerary?.id) fetch(itinerary.id);
  }, [client, itinerary?.id, fetch]);

  const canEdit = role === "OWNER" || role === "ADVISOR";
  const open = store.invoices.find((i) => i.id === openId) ?? null;
  const bookable = store.bookings.filter((b) => b.status !== "CANCELLED");

  const say = (text: string, error = false) => setNotice({ text, error });

  async function create(source: ClientInvoiceSource, bookingId: string | null) {
    const { invoice, error } = await store.create(source, bookingId);
    if (error !== null) return error;
    setPicking(false);
    setOpenId(invoice.id);
    setNotice(null);
    return null;
  }

  /** Runs a write and reports its outcome; resolves to the error, if any. */
  async function run(
    result: Promise<{ invoice: ClientInvoice | null; error: string | null }>,
    done?: string,
  ) {
    const { error } = await result;
    if (error) {
      say(error, true);
      return error;
    }
    if (done) say(done);
    return null;
  }

  async function reissue(invoice: ClientInvoice) {
    const ok = await confirmDialog({
      title: "Reissue this invoice?",
      message:
        "A new draft is made from it, payments included. It gets a new number when you send it.",
      confirmLabel: "Reissue",
    });
    if (!ok) return;
    const { invoice: draft, error } = await store.reissue(invoice.id);
    if (error !== null) return say(error, true);
    setOpenId(draft.id);
    say("Draft created from the void invoice.");
  }

  async function deletePayment(invoice: ClientInvoice, paymentId: string) {
    const ok = await confirmDialog({
      title: "Remove this payment?",
      message: "The invoice’s paid amount and status update straight away.",
      confirmLabel: "Remove",
      danger: true,
    });
    if (ok)
      await run(store.deletePayment(invoice.id, paymentId), "Payment removed.");
  }

  async function copyLink(invoice: ClientInvoice, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      say(`Link to ${invoice.number ?? "the invoice"} copied.`);
    } catch {
      say("Couldn’t copy — select the link and copy it instead.", true);
    }
  }

  return {
    itinerary,
    tripTitle: itinerary?.proposalTitle ?? null,
    isTemplate: itinerary?.kind === "TEMPLATE",
    invoices: store.invoices,
    bookings: bookable,
    loading: store.loading && store.invoices.length === 0,
    loadError: store.error,
    busy: store.busy,
    canEdit,
    open,
    openInvoice: (id: string) => {
      setOpenId(id);
      setNotice(null);
    },
    closeInvoice: () => {
      setOpenId(null);
      setNotice(null);
    },
    picking,
    setPicking,
    create,
    modal,
    setModal,
    notice,
    say,
    clearNotice: () => setNotice(null),
    run,
    reissue,
    deletePayment,
    copyLink,
    store,
  };
}

export type InvoicesSectionModel = ReturnType<typeof useInvoicesSection>;
