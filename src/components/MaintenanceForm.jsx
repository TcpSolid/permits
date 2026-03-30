import React, { useState } from 'react';
import { X, Save, Wrench, Truck, Calendar, DollarSign, ClipboardList, PenTool } from 'lucide-react';
import { Button } from './ui/Button';

export const MaintenanceForm = ({ record, trucks, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    truckId: record?.truckId || (trucks.length > 0 ? trucks[0].id : ''),
    serviceType: record?.serviceType || '',
    date: record?.date || new Date().toISOString().split('T')[0],
    cost: record?.cost || '',
    description: record?.description || '',
    notes: record?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-md" onClick={onCancel}></div>
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {record ? 'Edit Service Record' : 'Log Maintenance'}
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-semibold">
              Vehicle Maintenance Log
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-full h-10 w-10 p-0 hover:bg-white/10">
            <X size={20} />
          </Button>
        </div>

        <div className="px-8 py-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Select Vehicle</label>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    name="truckId"
                    value={formData.truckId}
                    onChange={handleChange}
                    className={`${inputClasses} pl-12 h-11 appearance-none`}
                    required
                  >
                    <option value="" disabled>Choose a vehicle</option>
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.year} {t.make} {t.model} ({t.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Service Type</label>
                <div className="relative">
                  <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    placeholder="e.g. Oil Change, Tire Rotation, Brake Repair"
                    className={`${inputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Service Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      required
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Total Cost</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Service Description</label>
                <div className="relative">
                  <ClipboardList className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What was done to the vehicle?"
                    className={`${inputClasses} pl-12 min-h-[100px] resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
              <Button type="submit" className="flex-1 h-12 gap-2 text-base shadow-lg shadow-primary-500/20">
                <Save size={20} />
                {record ? 'Save Record' : 'Log Maintenance'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 h-12 text-base">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
