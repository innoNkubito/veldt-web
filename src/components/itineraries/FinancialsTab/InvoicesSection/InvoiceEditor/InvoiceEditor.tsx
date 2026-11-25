"use client";

import { ActionButton } from "@/components/itineraries/shared/ActionButton";
import {
  Field,
  FieldInput,
  FieldLabel,
  FieldTextarea,
} from "@/components/itineraries/shared/FieldPrimitives";
import HtmlRichTextEditor from "@/components/itineraries/HtmlRichTextEditor";
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import type { ClientInvoice } from "@/lib/invoices";
import type { InvoicesSectionModel } from "../useInvoicesSection";
import * as Section from "../InvoicesSection.styled";
import LinesEditor from "./LinesEditor";
import StagesEditor from "./StagesEditor";
import { useInvoiceEditor } from "./useInvoiceEditor";
import * as S from "./InvoiceEditor.styled";

/** A draft: the form on the left, the invoice as the client will see it on the right. */
export default function InvoiceEditor({
  invoice,
  model,
}: {
  invoice: ClientInvoice;
  model: InvoicesSectionModel;
}) {
  const e = useInvoiceEditor(invoice, model);
  const { form } = e;

  return (
    <>
      <Section.Toolbar>
        <Section.Back type="button" onClick={e.close}>
          ← All invoices
        </Section.Back>
        <Section.ToolbarTitle>
          Draft invoice
          {invoice.replacesNumber
            ? ` · replaces ${invoice.replacesNumber}`
            : ""}
        </Section.ToolbarTitle>
      </Section.Toolbar>

      <Section.Split>
        <Section.Card>
          {e.issues.length > 0 && (
            <Section.Issues aria-label="Before you can send">
              {e.issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </Section.Issues>
          )}

          <S.Section>
            <Section.PanelTitle>Bill to</Section.PanelTitle>
            <Section.Grid>
              <Field>
                <FieldLabel htmlFor="inv-bill-name">Name</FieldLabel>
                <FieldInput
                  id="inv-bill-name"
                  value={form.billToName}
                  maxLength={160}
                  onChange={(ev) => e.setField("billToName", ev.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="inv-bill-email">Email</FieldLabel>
                <FieldInput
                  id="inv-bill-email"
                  type="email"
                  value={form.billToEmail}
                  onChange={(ev) => e.setField("billToEmail", ev.target.value)}
                />
              </Field>
              <Section.Full>
                <Field>
                  <FieldLabel htmlFor="inv-bill-address">Address</FieldLabel>
                  <FieldTextarea
                    id="inv-bill-address"
                    rows={2}
                    value={form.billToAddress}
                    placeholder="Optional"
                    onChange={(ev) =>
                      e.setField("billToAddress", ev.target.value)
                    }
                  />
                </Field>
              </Section.Full>
            </Section.Grid>
          </S.Section>

          <S.Section>
            <Section.PanelTitle>Lines</Section.PanelTitle>
            <LinesEditor e={e} currency={invoice.currency} />
          </S.Section>

          <S.Section>
            <Section.PanelTitle>Payment schedule</Section.PanelTitle>
            <StagesEditor e={e} currency={invoice.currency} />
          </S.Section>

          <S.Section>
            <Section.PanelTitle>Notes</Section.PanelTitle>
            <HtmlRichTextEditor
              content={form.notes}
              onChange={(html) => e.setField("notes", html)}
            />
          </S.Section>
          <S.Section>
            <Section.PanelTitle>Terms</Section.PanelTitle>
            <HtmlRichTextEditor
              content={form.terms}
              onChange={(html) => e.setField("terms", html)}
            />
          </S.Section>

          <S.Footer>
            <Section.DangerLink
              type="button"
              onClick={e.remove}
              disabled={e.saving}
            >
              Delete draft
            </Section.DangerLink>
            <S.Spacer />
            {e.dirty && <S.DirtyNote>Unsaved changes</S.DirtyNote>}
            <ActionButton
              type="button"
              onClick={e.saveDraft}
              disabled={e.saving || !e.dirty}
              $disabled={e.saving || !e.dirty}
            >
              {e.saving ? "Saving…" : "Save draft"}
            </ActionButton>
            <ActionButton
              type="button"
              $variant="primary"
              onClick={e.startSend}
              disabled={e.saving || e.issues.length > 0}
              $disabled={e.saving || e.issues.length > 0}
            >
              Send…
            </ActionButton>
          </S.Footer>
        </Section.Card>

        <Section.Sticky>
          <InvoiceDocument invoice={e.document} />
        </Section.Sticky>
      </Section.Split>
    </>
  );
}
