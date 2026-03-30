import React, { useState } from 'react';
import { Contact, Search, Plus, Edit, Phone, Mail, MapPin, Briefcase, Calendar, UserCheck, ShieldCheck, BadgeInfo } from 'lucide-react';
import { Button } from './ui/Button';

export const Employees = ({ employees, onRegisterEmployee, onEditEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team <span className="gradient-text">Directory</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Manage your project staff, field workers, and company personnel.</p>
        </div>
        <Button onClick={() => onRegisterEmployee()} className="group gap-2 px-6 py-3 h-fit shadow-primary-500/30">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Onboard New Employee
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, role, or department..." 
            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredEmployees.length} Team Members Registered
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="group glass-card flex flex-col p-6 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Contact size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{employee.name}</h3>
                  <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1">
                    {employee.role || 'Staff Member'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEditEmployee(employee)}
                className="h-8 shadow-none hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-all rounded-lg gap-1 px-2"
              >
                <Edit size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
              </Button>
            </div>

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Department</span>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                    <ShieldCheck size={14} className="text-indigo-400" />
                    {employee.department}
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hire Date</span>
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium justify-end">
                    <Calendar size={14} className="text-slate-400" />
                    {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '---'}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                {employee.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone size={14} className="text-slate-400" />
                    {employee.phone}
                  </div>
                )}
                {employee.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={14} className="text-slate-400" />
                    {employee.email}
                  </div>
                )}
              </div>
            </div>

            {employee.notes && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <BadgeInfo size={14} className="shrink-0 mt-0.5" />
                  <p className="italic line-clamp-2">{employee.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="glass-card py-20 text-center">
          <Contact className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white">No employees found</h3>
          <p className="text-slate-500 mt-2">No team members match your search or no one is registered yet.</p>
        </div>
      )}
    </div>
  );
};
