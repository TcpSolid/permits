import React, { useState } from 'react';
import { User, Phone, Mail, FileText, CheckCircle2, Clock, AlertCircle, HardHat, Search, ExternalLink, Plus, ClipboardList, Shield, Play, Edit } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/utils';

export const Contractors = ({ permits, contractors, onEditPermit, onDeletePermit, onRegisterContractor, onEditContractor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Map permits to their respective contractors for status tracking
  const contractorsWithPermits = contractors.map(contractor => ({
    ...contractor,
    permits: permits.filter(p => p.contractorName === contractor.name)
  }));

  const contractorsList = contractorsWithPermits.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone && c.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusCounts = (permits) => {
    return permits.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Registered <span className="gradient-text">Contractors</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage and view all contractors associated with your project permits.</p>
        </div>
        <Button onClick={() => onRegisterContractor(true)} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Register New Contractor
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {contractorsList.length} Contractors Found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractorsList.map((contractor) => {
          const statusCounts = getStatusCounts(contractor.permits);
          return (
            <div key={contractor.name} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                    <HardHat size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{contractor.name}</h3>
                    <div className="flex flex-col gap-0.5 mt-1">
                      {contractor.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={12} />
                          {contractor.phone}
                        </div>
                      )}
                      {contractor.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={12} />
                          {contractor.email}
                        </div>
                      )}
                      {contractor.invoiceEmail && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <ClipboardList size={12} />
                          <span className="font-semibold text-primary-500">Invoice:</span> {contractor.invoiceEmail}
                        </div>
                      )}
                      {(contractor.licenseType || contractor.licenseNumber) && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Shield size={12} className="text-primary-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {contractor.licenseType ? `${contractor.licenseType} ` : ''}
                            {contractor.licenseNumber ? `#${contractor.licenseNumber}` : ''}
                          </span>
                        </div>
                      )}
                      {contractor.website && (
                        <a 
                          href={contractor.website.startsWith('http') ? contractor.website : `https://${contractor.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-primary-500 hover:text-primary-400 transition-colors w-fit group/link"
                        >
                          <Play size={10} className="group-hover/link:translate-x-0.5 transition-transform rotate-90" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditContractor(contractor)}
                  className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
                >
                  <Edit size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Permits</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none flex items-center gap-2">
                    <FileText size={16} className="text-primary-500" />
                    {contractor.permits.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Active</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {statusCounts['Active'] || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1 overflow-y-auto max-h-[120px] custom-scrollbar">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-[inherit] mb-2 py-1">Recent Permits</p>
                {contractor.permits.slice(0, 5).map(permit => (
                  <div key={permit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group/permit">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{permit.type}</span>
                      <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">{permit.permitId || 'NO ID'}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEditPermit(permit)}
                      className="h-7 w-7 p-0 opacity-0 group-hover/permit:opacity-100 transition-opacity"
                    >
                      <ExternalLink size={12} />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div 
                      key={status} 
                      className={cn(
                        "w-5 h-5 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center",
                        status === 'Active' ? 'bg-emerald-500' : 
                        status === 'Expiring Soon' ? 'bg-amber-500' : 
                        status === 'Expired' ? 'bg-red-500' : 'bg-blue-500'
                      )}
                      title={`${count} ${status}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {contractorsList.length === 0 && (
        <div className="glass-card py-20 text-center">
          <HardHat className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No contractors found</h3>
          <p className="text-slate-500 mt-2">No contractors match your search criteria.</p>
        </div>
      )}
    </div>
  );
};
