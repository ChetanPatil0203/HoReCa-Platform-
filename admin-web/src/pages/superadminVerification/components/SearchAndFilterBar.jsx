import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
  statusCounts = {},
}) {
  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'Pending Review', label: 'Pending Review' },
    { id: 'Under Review', label: 'Under Review' },
    { id: 'Changes Requested', label: 'Changes Requested' },
    { id: 'Approved', label: 'Approved' },
    { id: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71829B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search applications (ID, Business, Applicant, Mobile, Email, PAN, GST, City)..."
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A] placeholder:text-[#71829B] focus:outline-none focus:border-[#071B3A] focus:ring-1 focus:ring-[#071B3A] transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71829B] hover:text-[#091B3A]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontally Scrollable Status Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.id;
          const count = statusCounts[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#071B3A] text-white shadow-xs'
                  : 'bg-white text-[#71829B] border border-[#E3E9F1] hover:bg-[#F5F7FA] hover:text-[#091B3A]'
              }`}
            >
              <span>{tab.label}</span>
              {count !== undefined && (
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5F7FA] text-[#071B3A] border border-[#E3E9F1]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
