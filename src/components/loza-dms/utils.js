import { useState, useCallback } from "react";
import { COMPANY } from "./constants";

// ─── Utilities ────────────────────────────────────────────────
export function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(n);
}

export function generateId() { 
  return Math.random().toString(36).slice(2, 9); 
}

export function todayISO() { 
  return new Date().toISOString().split("T")[0]; 
}

export function emptyLineItem() {
  return { 
    id: generateId(), 
    item: "", 
    description: "", 
    amount: 0, 
    total: 0, 
    progress: 0, 
    completed: 0, 
    invoiced: false, 
    progressPct: 0 
  };
}

export function emptyDocument(type) {
  return {
    type,
    number: "",
    date: todayISO(),
    supervisor: COMPANY.supervisor,
    valid: "45 Days",
    billTo: { name: "", address: "", phone: "", fax: "", email: "" },
    serviceTo: { name: "", address: "", phone: "", fax: "", email: "" },
    lineItems: Array.from({ length: 5 }, emptyLineItem),
    totalPayments: 0,
    deposit: 0,
    notes: "",
  };
}

export function computeTotals(doc) {
  const grandTotal = doc.lineItems.reduce((s, i) => s + (i.amount || 0), 0);
  const totalCompleted = doc.lineItems.reduce((s, i) => s + ((i.amount || 0) * ((i.progressPct || 0) / 100)), 0);
  const balanceDue = totalCompleted - doc.totalPayments - (doc.deposit || 0);
  return { grandTotal, totalCompleted, balanceDue };
}

// ─── Hook ─────────────────────────────────────────────────────
export function useDocumentState(type) {
  const [doc, setDoc] = useState(() => emptyDocument(type));
  const update = useCallback((key, value) => setDoc(d => ({ ...d, [key]: value })), []);
  const updateClient = useCallback((side, key, value) => setDoc(d => ({ ...d, [side]: { ...d[side], [key]: value } })), []);
  const updateLineItem = useCallback((id, key, value) => setDoc(d => ({ ...d, lineItems: d.lineItems.map(li => li.id === id ? { ...li, [key]: value } : li) })), []);
  const addLineItem = useCallback(() => setDoc(d => ({ ...d, lineItems: [...d.lineItems, emptyLineItem()] })), []);
  const removeLineItem = useCallback((id) => setDoc(d => ({ ...d, lineItems: d.lineItems.filter(li => li.id !== id) })), []);
  const reset = useCallback(() => setDoc(emptyDocument(type)), [type]);
  
  return { doc, update, updateClient, updateLineItem, addLineItem, removeLineItem, reset };
}
