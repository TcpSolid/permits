import React, { useState } from 'react';
import { Store, Phone, Mail, MapPin, Globe, Search, Plus, Edit, ExternalLink, Briefcase } from 'lucide-react';
import { Button } from './ui/Button';

export const Vendors = ({ vendors, onRegisterVendor, onEditVendor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.type && v.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project <span className="gradient-text">Vendors</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage material suppliers, service providers, and equipment rentals.</p>
        </div>
        <Button onClick={() => onRegisterVendor()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Register New Vendor
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, type, or email..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredVendors.length} Vendors Found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Store size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{vendor.name}</h3>
                  <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">
                    {vendor.type || 'General Vendor'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditVendor(vendor)}
                className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
              >
                <Edit size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
              </Button>
            </div>

            <div className="space-y-3 flex-1">
              {vendor.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Phone size={16} className="text-slate-400" />
                  {vendor.phone}
                </div>
              )}
              {vendor.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-slate-400" />
                  {vendor.email}
                </div>
              )}
              {vendor.address && (
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{vendor.address}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              {vendor.website ? (
                <a 
                  href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group/link text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    Visit Website
                  </div>
                  <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <div className="text-xs text-slate-500 italic flex items-center gap-2">
                  <Briefcase size={14} />
                  No website registered
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="glass-card py-20 text-center">
          <Store className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No vendors found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria or register a new vendor.</p>
        </div>
      )}
    </div>
  );
};
