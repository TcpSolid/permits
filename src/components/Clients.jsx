import React, { useState } from 'react';
import { Users, Search, Plus, Edit, Phone, Mail, MapPin, Briefcase, ExternalLink, User, Building2, FileText } from 'lucide-react';
import { Button } from './ui/Button';

export const Clients = ({ clients, onRegisterClient, onEditClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.contactPerson && c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage your project owners, customers, and key stakeholders.</p>
        </div>
        <Button onClick={() => onRegisterClient()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Register New Client
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, contact, or category..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredClients.length} Clients Found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  {client.category === 'Commercial' ? <Building2 size={28} /> : <User size={28} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{client.name}</h3>
                  <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">
                    {client.category || 'Standard Client'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditClient(client)}
                className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
              >
                <Edit size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
              </Button>
            </div>

            <div className="space-y-4 flex-1">
              {client.contactPerson && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Contact</span>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                    <Briefcase size={14} className="text-slate-400" />
                    {client.contactPerson}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {client.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone size={14} className="text-slate-400" />
                    {client.phone}
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={14} className="text-slate-400" />
                    {client.email}
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{client.address}</span>
                  </div>
                )}
                {client.attachments?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText size={14} className="text-slate-400" />
                    <span>{client.attachments.length} Attachment{client.attachments.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {client.notes && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-xs text-slate-500 italic line-clamp-2">{client.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="glass-card py-20 text-center">
          <Users className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No clients found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or register a new customer.</p>
        </div>
      )}
    </div>
  );
};
