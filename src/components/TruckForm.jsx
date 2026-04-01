import React, { useState } from 'react';
import { X, Save, Truck, Hash, Calendar, Palette, ClipboardList, PenTool, Upload, Trash2, FileText, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';

export const TruckForm = ({ truck, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    year: truck?.year || '',
    make: truck?.make || '',
    model: truck?.model || '',
    truckType: truck?.truckType || '',
    weight: truck?.weight || '',
    vin: truck?.vin || '',
    value: truck?.value || '',
    licensePlate: truck?.licensePlate || '',
    color: truck?.color || '',
    status: truck?.status || 'Active',
    notes: truck?.notes || '',
    attachments: truck?.attachments || []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve({
      data: reader.result,
      type: file.type,
      name: file.name,
      size: file.size
    });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxSize = 50 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Please select files under 50MB.`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const newAttachments = await Promise.all(validFiles.map(readFileAsDataURL));
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newAttachments]
    }));
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
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
              {truck ? 'Edit Truck' : 'Add A Truck'}
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-semibold">
              Vehicle Fleet Registry
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-full h-10 w-10 p-0 hover:bg-white/10">
            <X size={20} />
          </Button>
        </div>

        <div className="px-8 py-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="2024"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Make / Brand</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      placeholder="e.g. Ford, Freightliner"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Model Name</label>
                <div className="relative">
                  <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. F-150, M2 106"
                    className={`${inputClasses} pl-12`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Truck Type</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="truckType"
                      value={formData.truckType}
                      onChange={handleChange}
                      placeholder="e.g. Dump, Flatbed, Crane"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Weight</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g. 26,000 lbs"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>License Plate</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      placeholder="ABC-1234"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Color</label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. White, Silver"
                      className={`${inputClasses} pl-12`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClasses}>VIN (Vehicle ID Number)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="17-Digit VIN"
                    className={`${inputClasses} pl-12 uppercase font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Truck Value</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    className={`${inputClasses} pl-12`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Upload Files / Pictures</label>
                <div className="space-y-3">
                  <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                    <Upload size={16} />
                    Choose files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Upload documents or vehicle pictures. Max 50MB per file.</p>
                  {formData.attachments?.length > 0 && (
                    <div className="space-y-2">
                      {formData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="text-slate-500" size={16} />
                            <div className="min-w-0">
                              <div className="truncate font-medium text-slate-900 dark:text-white">{attachment.name}</div>
                              <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{Math.round(attachment.size / 1024)} KB</div>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeAttachment(index)} className="text-slate-500 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClasses}>Additional Vehicle Notes</label>
                <div className="relative">
                  <ClipboardList className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Insurance info, special equipment, driver assignments..."
                    className={`${inputClasses} pl-12 min-h-[100px] resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
              <Button type="submit" className="flex-1 h-12 gap-2 text-base shadow-lg shadow-primary-500/20">
                <Save size={20} />
                {truck ? 'Save Changes' : 'Register Vehicle'}
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
