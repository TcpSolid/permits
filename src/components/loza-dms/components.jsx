import React from "react";
import { 
  LOGO_WIDE, 
  LOGO_CIRCLE, 
  COMPANY, 
  COMPANY_ISIDRO,
  DOC_LABELS, 
  DOC_PREFIXES, 
  TCS_SECTIONS 
} from "./constants";
import { 
  formatCurrency, 
  computeTotals, 
  useDocumentState 
} from "./utils";

// ─── UI Primitives ────────────────────────────────────────────
export const inputCls = "w-full bg-transparent border-b border-stone-200 hover:border-stone-300 focus:border-stone-500 outline-none py-1 text-sm text-stone-700 focus:text-stone-900 placeholder:text-stone-300 transition-all";

export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{label}</span>
      {children}
    </div>
  );
}

// Utility for keyboard navigation
const handleEnter = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const inputs = Array.from(document.querySelectorAll('.main-content input:not([type="checkbox"])'));
    const index = inputs.indexOf(e.target);
    if (index !== -1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }
};

export function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-5 bg-stone-500 rounded-full" />
      <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">{children}</h3>
    </div>
  );
}

// ─── Company Header (shown on every doc) ─────────────────────
export function CompanyBanner({ company = COMPANY }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-5 flex items-center gap-5">
      <img src={LOGO_CIRCLE} alt="Loza Concrete logo" className="w-16 h-16 object-contain rounded-full border border-stone-200 bg-white p-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <img src={LOGO_WIDE} alt="Loza Concrete banner" className="h-8 object-contain" />
        </div>
        <p className="text-[10px] text-stone-600 uppercase tracking-[0.25em] font-semibold mt-1">{company.division}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-stone-500">
          <span>{company.license}</span>
          <span>{company.address}</span>
          <span>{company.officePhone} · {company.mobilePhone}</span>
          <a href={`mailto:${company.email}`} className="text-stone-600 hover:text-stone-800 transition-colors">{company.email}</a>
        </div>
      </div>
    </div>
  );
}

// ─── Document Meta Header ─────────────────────────────────────
export function DocumentHeader({ doc, update }) {
  const label = DOC_LABELS[doc.type];
  const prefix = DOC_PREFIXES[doc.type] ?? "";
  const isTerms = doc.type === "terms";
  if (isTerms) return null;
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="inline-block bg-stone-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">{label}</span>
          {doc.type === "proposal" && <span className="text-xs text-stone-400">Valid: 45 Days</span>}
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center text-right">
          <span className="text-stone-500 text-xs uppercase tracking-wider text-left">Number</span>
          <input className="bg-white border border-stone-200 focus:border-stone-400 rounded-lg px-2 py-1 text-stone-800 text-xs outline-none w-32 ml-auto text-right" placeholder={`${prefix}-XXX`} value={doc.number} onChange={e => update("number", e.target.value)} />
          <span className="text-stone-500 text-xs uppercase tracking-wider text-left">Date</span>
          <input type="date" className="bg-white border border-stone-200 focus:border-stone-400 rounded-lg px-2 py-1 text-stone-800 text-xs outline-none w-32 ml-auto" value={doc.date} onChange={e => update("date", e.target.value)} />
          <span className="text-stone-500 text-xs uppercase tracking-wider text-left">Supervisor</span>
          <input className="bg-white border border-stone-200 focus:border-stone-400 rounded-lg px-2 py-1 text-stone-800 text-xs outline-none w-32 ml-auto text-right uppercase" value={doc.supervisor} onChange={e => update("supervisor", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Client Block (extracted to avoid re-mount on every keystroke) ─────
function ClientBlock({ side, title, data, updateClient }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-600 mb-3 pb-2 border-b border-stone-200">{title}</div>
      <div className="space-y-3">
        <Field label="Name"><input className={inputCls} value={data.name} onChange={e => updateClient(side, "name", e.target.value)} onKeyDown={handleEnter} placeholder="Client name" /></Field>
        <Field label="Address"><input className={inputCls} value={data.address} onChange={e => updateClient(side, "address", e.target.value)} onKeyDown={handleEnter} placeholder="Street address" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone"><input className={inputCls} value={data.phone} onChange={e => updateClient(side, "phone", e.target.value)} onKeyDown={handleEnter} placeholder="(000) 000-0000" /></Field>
          <Field label="Fax"><input className={inputCls} value={data.fax ?? ""} onChange={e => updateClient(side, "fax", e.target.value)} onKeyDown={handleEnter} placeholder="(000) 000-0000" /></Field>
        </div>
        <Field label="Email"><input type="email" className={inputCls} value={data.email} onChange={e => updateClient(side, "email", e.target.value)} onKeyDown={handleEnter} placeholder="email@example.com" /></Field>
      </div>
    </div>
  );
}

// ─── Client Section ───────────────────────────────────────────
export function ClientSection({ doc, updateClient }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <ClientBlock side="billTo" title="Bill To" data={doc.billTo} updateClient={updateClient} />
      <ClientBlock side="serviceTo" title="Service To" data={doc.serviceTo} updateClient={updateClient} />
    </div>
  );
}

// ─── Line Items Table ─────────────────────────────────────────
export function LineItemsTable({ doc, updateLineItem, addLineItem, removeLineItem }) {
  const isInvoice = doc.type === "invoice";
  const showProgress = isInvoice || doc.type === "receipt";
  const thCls = "text-[10px] uppercase tracking-wider text-stone-500 font-semibold py-2.5 px-3 text-left border-b border-stone-200 bg-stone-50";
  return (
    <div className="mb-5">
      <SectionHeader>Line Items</SectionHeader>
      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={`${thCls} w-14`}>#</th>
              <th className={thCls}>Description</th>
              <th className={`${thCls} w-28 text-right`}>Amount</th>
              {showProgress && <><th className={`${thCls} w-24 text-right`}>Progress %</th><th className={`${thCls} w-28 text-right`}>Completed</th></>}
              {isInvoice && <th className={`${thCls} w-20 text-center`}>Invoiced</th>}
              <th className={`${thCls} w-8`} />
            </tr>
          </thead>
          <tbody>
            {doc.lineItems.map((item, idx) => (
              <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors group">
                <td className="py-2 px-3"><input className="w-full bg-transparent outline-none text-stone-500 text-xs focus:text-stone-800" value={item.item} onChange={e => updateLineItem(item.id, "item", e.target.value)} onKeyDown={handleEnter} placeholder={String(idx + 1)} /></td>
                <td className="py-2 px-3"><input className="w-full bg-transparent outline-none text-stone-700 focus:text-stone-900" value={item.description} onChange={e => updateLineItem(item.id, "description", e.target.value)} onKeyDown={handleEnter} placeholder="Item description" /></td>
                <td className="py-2 px-3 text-right"><input type="number" className="w-full bg-transparent outline-none text-stone-700 text-right focus:text-stone-900" value={item.amount || ""} onChange={e => updateLineItem(item.id, "amount", parseFloat(e.target.value) || 0)} onKeyDown={handleEnter} placeholder="0" /></td>
                {showProgress && (
                  <>
                    <td className="py-2 px-3 text-right"><input type="number" className="w-full bg-transparent outline-none text-stone-700 text-right focus:text-stone-900" value={item.progressPct || ""} onChange={e => updateLineItem(item.id, "progressPct", parseFloat(e.target.value) || 0)} onKeyDown={handleEnter} placeholder="0" min="0" max="100" /></td>
                    <td className="py-2 px-3 text-right text-stone-500 text-xs">{item.amount && item.progressPct ? formatCurrency((item.amount * (item.progressPct || 0)) / 100) : "—"}</td>
                  </>
                )}
                {isInvoice && <td className="py-2 px-3 text-center"><input type="checkbox" className="accent-stone-600 w-4 h-4 cursor-pointer" checked={item.invoiced ?? false} onChange={e => updateLineItem(item.id, "invoiced", e.target.checked)} /></td>}
                <td className="py-2 px-1 text-center"><button onClick={() => removeLineItem(item.id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all text-xs w-5 h-5 flex items-center justify-center rounded">×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200">
          <button onClick={addLineItem} className="text-xs text-stone-600 hover:text-stone-800 font-medium flex items-center gap-1.5 transition-colors">
            <span className="text-base leading-none">+</span> Add line item
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Totals Panel ─────────────────────────────────────────────
export function TotalsPanel({ doc, update }) {
  const { grandTotal, totalCompleted, balanceDue } = computeTotals(doc);
  const isProposal = doc.type === "proposal";
  const showDeposit = doc.type === "invoice" || doc.type === "receipt" || doc.type === "invoice-basic";

  function Row({ label, value, editable, onEdit, highlight, bold }) {
    return (
      <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${highlight ? "bg-stone-100 border border-stone-300" : ""}`}>
        <span className={`text-xs uppercase tracking-wider ${bold ? "font-bold text-stone-800" : "text-stone-500"}`}>{label}</span>
        {editable ? (
          <input type="number" className={`bg-transparent outline-none text-right w-28 border-b border-stone-200 hover:border-stone-300 focus:border-stone-500 text-sm ${bold ? "font-bold text-stone-900" : "text-stone-700"}`} value={value || ""} onChange={e => onEdit?.(parseFloat(e.target.value) || 0)} placeholder="0" />
        ) : (
          <span className={`text-sm ${highlight ? "text-stone-800 font-bold" : bold ? "font-bold text-stone-900" : "text-stone-700"}`}>{formatCurrency(value)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-5">
      <SectionHeader>Summary</SectionHeader>
      <div className="space-y-1">
        <Row label="Grand Total" value={grandTotal} bold />
        {!isProposal && <Row label="Total Completed" value={totalCompleted} />}
        <Row label="Total Payments" value={doc.totalPayments} editable onEdit={v => update("totalPayments", v)} />
        {showDeposit && <Row label="Deposit" value={doc.deposit ?? 0} editable onEdit={v => update("deposit", v)} />}
        <div className="border-t border-stone-200 mt-2 pt-2">
          <Row label="Balance Due" value={balanceDue} highlight bold />
        </div>
      </div>
    </div>
  );
}

// ─── Proposal Footer ──────────────────────────────────────────
export function ProposalFooter({ doc, company = COMPANY }) {
  if (doc.type !== "proposal") return null;
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-5 text-xs text-stone-500 space-y-2">
      <p>*The Terms & Conditions for this proposal are specified on the last page of this document.</p>
      <p>If you have any questions, please contact <strong className="text-stone-700">{company.contact} at {company.contactPhone}</strong>.</p>
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
        <div><div className="border-b border-stone-400 mb-1 h-8" /><p className="uppercase tracking-wider text-[10px]">Signature of Approval</p></div>
        <div><div className="border-b border-stone-400 mb-1 h-8" /><p className="uppercase tracking-wider text-[10px]">Date</p></div>
      </div>
    </div>
  );
}

// ─── Terms & Conditions Page ──────────────────────────────────
// NOTE: Signature block at bottom always uses COMPANY_ISIDRO per business requirement
export function TermsPage({ company = COMPANY }) {
  return (
    <div>
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between">
          <span className="inline-block bg-stone-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Terms & Conditions</span>
          <div className="text-right text-xs text-stone-400 space-y-0.5">
            <p>Proposal No.: _______________</p>
            <p>Date: _______________</p>
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-3">If you have any questions regarding these Terms & Conditions, please contact our office at <span className="font-medium text-stone-700">{company.officePhone}</span>.</p>
      </div>

      <div className="space-y-4">
        {TCS_SECTIONS.map((section, si) => (
          <div key={si} className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-600 text-white px-4 py-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider">{section.title}</h3>
            </div>
            <ul className="p-4 space-y-2">
              {section.items.map((item, ii) => (
                <li key={ii} className={`flex gap-2.5 text-sm text-stone-700 ${item.startsWith("o ") || item.startsWith("This includes") ? "ml-5 text-stone-500" : ""}`}>
                  <span className="text-stone-400 shrink-0 mt-0.5">{item.startsWith("o ") || item.startsWith("This includes") ? "◦" : "•"}</span>
                  <span>{item.replace(/^[•o] /, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border border-stone-200 rounded-xl p-5 bg-stone-50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-4">Signature Block</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Customer</p>
            <div><div className="border-b border-stone-400 h-8 mb-1" /><p className="text-[10px] uppercase tracking-wider text-stone-400">Printed Name</p></div>
            <div><div className="border-b border-stone-400 h-8 mb-1" /><p className="text-[10px] uppercase tracking-wider text-stone-400">Signature</p></div>
            <div><div className="border-b border-stone-400 h-8 mb-1" /><p className="text-[10px] uppercase tracking-wider text-stone-400">Date</p></div>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Loza Concrete, Inc.</p>
            {/* Always Isidro Loza in the T&C signature block */}
            <div><p className="text-sm font-medium text-stone-800 border-b border-stone-300 pb-1 mb-1">{COMPANY_ISIDRO.contact}</p><p className="text-[10px] uppercase tracking-wider text-stone-400">Printed Name</p></div>
            <div><p className="text-sm text-stone-600 border-b border-stone-300 pb-1 mb-1">Owner — Loza Concrete, Inc.</p><p className="text-[10px] uppercase tracking-wider text-stone-400">Title</p></div>
            <div><div className="border-b border-stone-400 h-8 mb-1" /><p className="text-[10px] uppercase tracking-wider text-stone-400">Date</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Document Form ────────────────────────────────────────────
export function DocumentForm({ type, company = COMPANY }) {
  const { doc, update, updateClient, updateLineItem, addLineItem, removeLineItem, reset } = useDocumentState(type, company);
  const isTerms = type === "terms";

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 border-b border-stone-100 -mx-6 px-6 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 uppercase tracking-wider">Document</span>
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">{DOC_LABELS[type]}</span>
        </div>
        <div className="flex gap-2">
          {!isTerms && <button onClick={reset} className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-1.5 border border-stone-200 rounded-lg">Clear</button>}
          <button onClick={() => window.print()} className="text-xs text-white bg-stone-600 hover:bg-stone-700 transition-colors px-4 py-1.5 rounded-lg font-medium flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print / Save PDF
          </button>
        </div>
      </div>

      <CompanyBanner company={company} />
      {!isTerms && <DocumentHeader doc={doc} update={update} />}
      {!isTerms && <ClientSection doc={doc} updateClient={updateClient} />}
      {isTerms ? <TermsPage company={company} /> : (
        <>
          <LineItemsTable doc={doc} updateLineItem={updateLineItem} addLineItem={addLineItem} removeLineItem={removeLineItem} />
          <TotalsPanel doc={doc} update={update} />
          <ProposalFooter doc={doc} company={company} />
        </>
      )}
    </div>
  );
}
