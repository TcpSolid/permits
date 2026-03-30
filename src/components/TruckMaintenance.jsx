import React, { useState } from 'react';
import { Wrench, Search, Plus, Edit, Calendar, Truck, DollarSign, ClipboardList, PenTool, ClipboardCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

export const TruckMaintenance = ({ maintenance, trucks, onRegisterMaintenance, onEditMaintenance }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaintenance = maintenance.filter(m => {
    const truck = trucks.find(t => t.id === m.truckId);
    const truckName = truck ? `${truck.year} ${truck.make} ${truck.model}` : 'Unknown Vehicle';
    return (
      m.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truckName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTruckLabel = (truckId) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? `${truck.year} ${truck.make} ${truck.model}` : 'Unknown Vehicle';
  };

  const getTruckPlate = (truckId) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? truck.licensePlate : '---';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Maintenance <span className="gradient-text">Log</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Track service history, repairs, and maintenance costs for your fleet.</p>
        </div>
        <Button onClick={() => onRegisterMaintenance()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Log Maintenance Record
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by vehicle, service, or description..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredMaintenance.length} Service Records Found
        </div>
      </div>

      <div className="space-y-4">
        {filteredMaintenance.map((record) => (
          <div key={record.id} className="group glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-500/30 transition-all duration-300">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shrink-0">
                <Wrench size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{record.serviceType}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary-500/10 text-primary-500">
                    {getTruckPlate(record.truckId)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Truck size={14} className="text-slate-400" />
                    {getTruckLabel(record.truckId)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate italic">{record.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Service Cost</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-0.5 justify-end">
                  <DollarSign size={18} className="text-emerald-500" />
                  {record.cost}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditMaintenance(record)}
                className="h-10 w-10 p-0 hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-full"
              >
                <Edit size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredMaintenance.length === 0 && (
        <div className="glass-card py-20 text-center">
          <Wrench className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No maintenance records found</h3>
          <p className="text-slate-500 mt-2">No service history matches your search or no records have been logged yet.</p>
        </div>
      )}
    </div>
  );
};
