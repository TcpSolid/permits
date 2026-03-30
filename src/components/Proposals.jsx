import React, { useState } from 'react';
import { FileSignature, Search, Plus, Edit, Calendar, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, FileText, User } from 'lucide-react';
import { Button } from './ui/Button';

export const Proposals = ({ proposals, onRegisterProposal, onEditProposal, onOpenLozaDMS }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.status && p.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Rejected': return <XCircle size={16} className="text-rose-500" />;
      case 'Sent': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project <span className="gradient-text">Proposals</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Tracks bids, estimates, and project approvals.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={onOpenLozaDMS} variant="secondary" className="group gap-2 px-6 py-3 h-fit">
            <FileText size={20} className="text-primary-500" />
            Loza DMS
          </Button>
          <Button onClick={() => onRegisterProposal()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create New Proposal
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, client, or status..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredProposals.length} Proposals Found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal) => (
          <div key={proposal.id} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <FileSignature size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{proposal.title}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-2 ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status || 'Draft'}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditProposal(proposal)}
                className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
              >
                <Edit size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
              </Button>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Client Name</span>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                  <User size={14} className="text-slate-400" />
                  {proposal.clientName || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Value</span>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    <DollarSign size={14} />
                    {proposal.value ? Number(proposal.value).toLocaleString() : '0.00'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date</span>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <Calendar size={14} />
                    {proposal.date || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {proposal.notes && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 italic line-clamp-2">{proposal.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="glass-card py-20 text-center">
          <FileText className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No proposals found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or create a new bid.</p>
        </div>
      )}
    </div>
  );
};
