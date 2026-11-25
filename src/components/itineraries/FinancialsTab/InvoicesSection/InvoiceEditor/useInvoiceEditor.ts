"use client";

import { useMemo, useState } from "react";
import { useBookingStore } from "@/stores/bookingStore";
import { confirmDialog } from "@/stores/confirmStore";
import type { ClientInvoice } from "@/lib/invoices";
import type { InvoicesSectionModel } from "../useInvoicesSection";
import type {
  InvoiceDraftForm,
  LineDraft,
  StageDraft,
} from "../InvoicesSection.types";
import { MAX_LINES, MAX_STAGES } from "../InvoicesSection.constants";
import {
  blankLine,
  blankStage,
  documentFromDraft,
  formFromInvoice,
  liveTotals,
  matchTotal,
  moveItem,
  splitEvenly,
  stagesFromSchedule,
  toInput,
} from "../InvoicesSection.utils";

/** What blocks sending, worked out from the form as it is now (the API checks again). */
function draftIssues(
  form: InvoiceDraftForm,
  total: number,
  stagesSum: number,
): string[] {
  const issues: string[] = [];
  if (!form.billToName.trim()) issues.push("Add who the invoice is for.");
  if (form.lines.length === 0) issues.push("Add at least one line.");
  else if (total <= 0) issues.push("The total must be more than zero.");
  if (form.lines.some((l) => !l.description.trim()))
    issues.push("Every line needs a description.");
  if (form.stages.length === 0 && total > 0)
    issues.push("Add when payment is due.");
  else if (
    form.stages.length &&
    Math.round(stagesSum * 100) !== Math.round(total * 100)
  ) {
    issues.push("The payment schedule must add up to the total.");
  }
  return issues;
}

export function useInvoiceEditor(
  invoice: ClientInvoice,
  model: InvoicesSectionModel,
) {
  const schedule = useBookingStore((s) => s.config?.scheduleItems ?? []);
  const [form, setForm] = useState<InvoiceDraftForm>(() =>
    formFromInvoice(invoice),
  );
  const [dirty, setDirty] = useState(false);

  // A newer save of this invoice replaces the form, unless mid-edit.
  const [loadedAt, setLoadedAt] = useState(invoice.updatedAt);
  if (invoice.updatedAt !== loadedAt && !dirty) {
    setLoadedAt(invoice.updatedAt);
    setForm(formFromInvoice(invoice));
  }

  const totals = useMemo(() => liveTotals(form), [form]);
  const issues = useMemo(
    () => draftIssues(form, totals.total, totals.stagesSum),
    [form, totals],
  );
  const document = useMemo(
    () => documentFromDraft(invoice, form, totals, model.tripTitle),
    [invoice, form, totals, model.tripTitle],
  );

  function change(next: (f: InvoiceDraftForm) => InvoiceDraftForm) {
    setForm(next);
    setDirty(true);
  }

  const setField = <
    K extends
      "billToName" | "billToEmail" | "billToAddress" | "notes" | "terms",
  >(
    key: K,
    value: string,
  ) => change((f) => ({ ...f, [key]: value }));

  const lines = {
    add: () =>
      change((f) =>
        f.lines.length >= MAX_LINES
          ? f
          : { ...f, lines: [...f.lines, blankLine()] },
      ),
    set: (key: string, patch: Partial<LineDraft>) =>
      change((f) => ({
        ...f,
        lines: f.lines.map((l) => (l.key === key ? { ...l, ...patch } : l)),
      })),
    remove: (key: string) =>
      change((f) => ({ ...f, lines: f.lines.filter((l) => l.key !== key) })),
    move: (index: number, delta: -1 | 1) =>
      change((f) => ({ ...f, lines: moveItem(f.lines, index, delta) })),
  };

  const stages = {
    add: () =>
      change((f) =>
        f.stages.length >= MAX_STAGES
          ? f
          : { ...f, stages: [...f.stages, blankStage()] },
      ),
    set: (key: string, patch: Partial<StageDraft>) =>
      change((f) => ({
        ...f,
        stages: f.stages.map((s) => (s.key === key ? { ...s, ...patch } : s)),
      })),
    remove: (key: string) =>
      change((f) => ({ ...f, stages: f.stages.filter((s) => s.key !== key) })),
    splitEvenly: () =>
      change((f) => ({ ...f, stages: splitEvenly(f.stages, totals.total) })),
    matchTotal: () =>
      change((f) => ({ ...f, stages: matchTotal(f.stages, totals.total) })),
    useSchedule: () =>
      change((f) => ({
        ...f,
        stages: stagesFromSchedule(schedule, totals.total),
      })),
    hasSchedule: schedule.length > 0,
  };

  /** Saves the draft; resolves to the saved invoice, or null after reporting the error. */
  async function save(): Promise<ClientInvoice | null> {
    const { invoice: saved, error } = await model.store.update(
      invoice.id,
      toInput(form),
    );
    if (error !== null) {
      model.say(error, true);
      return null;
    }
    setDirty(false);
    setLoadedAt(saved.updatedAt);
    setForm(formFromInvoice(saved));
    return saved;
  }

  async function saveDraft() {
    if (await save()) model.say("Draft saved.");
  }

  async function startSend() {
    const latest = dirty ? await save() : invoice;
    if (!latest) return;
    if (latest.sendIssues.length) {
      model.say(latest.sendIssues.join(" "), true);
      return;
    }
    model.setModal({ kind: "send", invoice: latest, resend: false });
  }

  async function remove() {
    const ok = await confirmDialog({
      title: "Delete this draft?",
      message:
        "It has no number yet, so nothing is lost from your invoice sequence.",
      confirmLabel: "Delete draft",
      danger: true,
    });
    if (!ok) return;
    const error = await model.store.remove(invoice.id);
    if (error) return model.say(error, true);
    model.closeInvoice();
  }

  async function close() {
    if (dirty) {
      const ok = await confirmDialog({
        title: "Leave without saving?",
        message: "Your changes to this draft will be lost.",
        confirmLabel: "Discard changes",
        danger: true,
      });
      if (!ok) return;
    }
    model.closeInvoice();
  }

  return {
    form,
    dirty,
    totals,
    issues,
    document,
    setField,
    lines,
    stages,
    saving: model.busy === invoice.id,
    saveDraft,
    startSend,
    remove,
    close,
    linked: invoice.bookingId != null,
  };
}

export type InvoiceEditorModel = ReturnType<typeof useInvoiceEditor>;
