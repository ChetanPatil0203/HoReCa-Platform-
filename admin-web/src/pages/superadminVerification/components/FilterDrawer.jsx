import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

export default function FilterDrawer({ isOpen, onClose, filters, setFilters, onReset }) {
  if (!isOpen) return null;

  const accountTypes = ['All', 'HoReCa Owner', 'Vendor Partner'];
  const categories = [
    'All',
    'Hotel',
    'Restaurant',
    'Café',
    'Raw Material',
    'Man Power',
    'Service Provider',
    'Marketing',
  ];
  const reviewers = ['All', 'Unassigned', 'Admin Rahul', 'Admin Priya', 'Admin Amit'];
  const docStatuses = ['All', 'Complete', 'Incomplete', 'Needs Attention'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slideLeft">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E9F1]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#071B3A]" />
            <h2 className="text-lg font-bold text-[#071B3A]">Filter Applications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71829B] hover:text-[#091B3A] hover:bg-[#F5F7FA] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Account Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#71829B] mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {accountTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, accountType: type })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                    filters.accountType === type
                      ? 'bg-[#071B3A] text-white border-[#071B3A]'
                      : 'bg-white text-[#091B3A] border-[#E3E9F1] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Business Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#71829B] mb-2">
              Business Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left truncate cursor-pointer ${
                    filters.category === cat
                      ? 'bg-[#071B3A] text-white border-[#071B3A]'
                      : 'bg-white text-[#091B3A] border-[#E3E9F1] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#71829B] mb-2">
              Assigned Reviewer
            </label>
            <select
              value={filters.reviewer || 'All'}
              onChange={(e) => setFilters({ ...filters, reviewer: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A] focus:outline-none focus:border-[#071B3A]"
            >
              {reviewers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Document Completion */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#71829B] mb-2">
              Document Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {docStatuses.map((ds) => (
                <button
                  key={ds}
                  onClick={() => setFilters({ ...filters, docCompletion: ds })}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                    filters.docCompletion === ds
                      ? 'bg-[#071B3A] text-white border-[#071B3A]'
                      : 'bg-white text-[#091B3A] border-[#E3E9F1] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {ds}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#71829B] mb-2">
              City / Location
            </label>
            <input
              type="text"
              value={filters.city || ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="e.g. Delhi, Mumbai, Pune"
              className="w-full px-3 py-2 bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A] focus:outline-none focus:border-[#071B3A]"
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[#E3E9F1] bg-[#F5F7FA] flex items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="w-1/2 px-4 py-2.5 text-xs font-semibold text-[#71829B] bg-white border border-[#E3E9F1] rounded-xl hover:text-[#091B3A] transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="w-1/2 px-4 py-2.5 text-xs font-semibold text-white bg-[#071B3A] rounded-xl hover:bg-[#102A4C] transition-colors shadow-xs cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
