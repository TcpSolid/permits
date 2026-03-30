import React, { useState } from "react";
import {
  ClipboardList,
  FileText,
  Receipt,
  CheckCircle2,
  ScrollText,
  Mail,
  Phone,
  MapPin,
  Shield,
  ArrowLeft
} from "lucide-react";
import {
  LOGO_CIRCLE,
  COMPANY
} from "./constants";
import {
  DocumentForm
} from "./components";

const NAV_TABS = [
  { id: "proposal", label: "Proposal", icon: ClipboardList },
  { id: "invoice-basic", label: "Invoice (Basic)", icon: FileText },
  { id: "invoice", label: "Invoice", icon: Receipt },
  { id: "receipt", label: "Receipt", icon: CheckCircle2 },
  { id: "terms", label: "Terms & Conditions", icon: ScrollText },
];

export function LozaConcreteApp({ onBack }) {
  const [activeTab, setActiveTab] = useState("proposal");

  return (
    <div className="min-h-screen bg-stone-100 font-sans -m-8 relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .loza-container { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type='number'] { -moz-appearance: textfield; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .sidebar { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 0 !important; }
          .print-area { box-shadow: none !important; border: none !important; border-radius: 0 !important; width: 100% !important; margin: 0 !important; }
          .loza-container { background: white !important; }
        }
      `}</style>

      <div className="loza-container flex">
        {/* Sidebar */}
        <div className="sidebar fixed left-0 top-0 h-full w-60 bg-white border-r border-stone-200 flex flex-col z-20 shadow-sm no-print">
          <div className="px-5 pt-7 pb-5 border-b border-stone-100">
            <img src={LOGO_CIRCLE} alt="logo" className="w-12 h-12 object-contain rounded-full border border-stone-200 bg-stone-50 p-1 mb-3" />
            <h2 className="font-semibold text-stone-900 text-base leading-tight">Loza Concrete</h2>
            <p className="text-stone-400 text-xs mt-0.5">Document Manager</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${activeTab === tab.id ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/10" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-stone-100 space-y-1">
            <p className="text-stone-400 text-[10px] uppercase tracking-wider mb-2">Contact</p>
            <div className="flex items-center gap-2 text-stone-500 text-xs">
              <Shield size={12} className="text-stone-400" />
              {COMPANY.license}
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-xs">
              <Phone size={12} className="text-stone-400" />
              {COMPANY.officePhone}
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-xs">
              <Mail size={12} className="text-stone-400" />
              <a href={`mailto:${COMPANY.email}`} className="text-blue-500 hover:text-blue-700 transition-colors uppercase font-semibold">{COMPANY.email}</a>
            </div>
            <div className="flex items-start gap-2 text-stone-400 text-xs leading-snug pt-1">
              <MapPin size={12} className="shrink-0 mt-0.5" />
              {COMPANY.address}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main-content flex-1 ml-60 min-h-screen">
          <div className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 no-print">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                  title="Back to Proposals"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h1 className="text-base font-semibold text-stone-900">{NAV_TABS.find(t => t.id === activeTab)?.label}</h1>
                <p className="text-xs text-stone-400">Fill in the fields and print or save as PDF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-stone-400">Live</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 print-area">
              <DocumentForm key={activeTab} type={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
