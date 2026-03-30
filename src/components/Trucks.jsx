import React, { useState } from 'react';
import { Truck, Search, Plus, Edit, FileText, Calendar, Hash, Palette, Info } from 'lucide-react';
import { Button } from './ui/Button';

export const Trucks = ({ trucks, onRegisterTruck, onEditTruck }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrucks = trucks.filter(t => 
    t.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vehicle <span className="gradient-text">Fleet</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage and track all company vehicles and assets.</p>
        </div>
        <Button onClick={() => onRegisterTruck()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Register New Truck
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by make, model, plate, or VIN..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredTrucks.length} Vehicles in Fleet
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrucks.map((truck) => (
          <div key={truck.id} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {truck.year} {truck.make} {truck.model}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                      {truck.licensePlate}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditTruck(truck)}
                className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
              >
                <Edit size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">VIN</span>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-mono">
                    <Hash size={14} className="text-slate-400" />
                    {truck.vin}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Color</span>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Palette size={14} className="text-slate-400" />
                    {truck.color}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-end items-end">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 w-full text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Active</span>
                </div>
              </div>
            </div>

            {truck.notes && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p className="italic">{truck.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div className="glass-card py-20 text-center">
          <Truck className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No trucks found</h3>
          <p className="text-slate-500 mt-2">No vehicles match your search criteria.</p>
        </div>
      )}
    </div>
  );
};
