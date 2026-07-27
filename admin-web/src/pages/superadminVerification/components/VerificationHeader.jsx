import React from 'react';
import { RefreshCw, Download, SlidersHorizontal } from 'lucide-react';

export default function VerificationHeader({ onRefresh, isRefreshing, onOpenFilters, activeFilterCount }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A] tracking-tight">Business Verification</h1>
        <p className="text-sm text-[#71829B] mt-0.5">
          Review and manage business registration applications.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#71829B] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={onOpenFilters}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border rounded-xl transition-colors shadow-xs cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-[#071B3A] text-white border-[#071B3A]'
              : 'bg-white text-[#071B3A] border-[#E3E9F1] hover:bg-[#F5F7FA]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-xs font-bold bg-[#F2C230] text-[#071B3A] rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
