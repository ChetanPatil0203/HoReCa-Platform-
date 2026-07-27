import React from 'react';
import { ChevronRight, FileSearch } from 'lucide-react';

export default function ApplicationCardView({ applications, onOpenWorkspace, onAssignReviewer, onClearFilters }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-8 text-center shadow-xs">
        <FileSearch className="w-8 h-8 text-[#71829B] mx-auto mb-2" />
        <h3 className="text-sm font-bold text-[#071B3A]">No applications found</h3>
        <button
          onClick={onClearFilters}
          className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:hidden">
      {applications.map((app) => {
        const verified = (app.documents || []).filter(d => d.verificationStatus === 'Verified').length;
        const total = (app.documents || []).length;
        const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;

        return (
          <div key={app.id} className="bg-white border border-[#E3E9F1] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#E3E9F1] pb-2.5">
              <span className="font-mono text-xs font-bold text-[#071B3A]">{app.shortAppId || 'APP-1083A'}</span>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                app.status === 'Approved' ? 'bg-[#16B77A]/10 text-[#16B77A]' :
                app.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                app.status === 'Under Review' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                app.status === 'Changes Requested' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' :
                'bg-[#F59E0B]/10 text-[#F59E0B]'
              }`}>
                {app.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-[#071B3A] text-sm">{app.businessName}</h4>
              <p className="text-xs text-[#71829B]">{app.type} · {app.accountType}</p>
              <p className="text-xs text-[#091B3A] mt-1">Applicant: <span className="font-medium">{app.proprietor}</span> ({app.location})</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[#71829B] mb-1">
                <span>Documents ({verified}/{total} Verified)</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-[#E3E9F1] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#16B77A] h-full rounded-full" style={{ width: `${percentage}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E3E9F1]">
              <select
                value={app.assignedReviewer || 'Unassigned'}
                onChange={(e) => onAssignReviewer(app.id, e.target.value)}
                className="text-xs font-medium bg-[#F5F7FA] border border-[#E3E9F1] rounded-lg px-2 py-1 text-[#071B3A]"
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Admin Rahul">Admin Rahul</option>
                <option value="Admin Priya">Admin Priya</option>
                <option value="Admin Amit">Admin Amit</option>
              </select>

              <button
                onClick={() => onOpenWorkspace(app)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#071B3A] rounded-xl hover:bg-[#102A4C]"
              >
                <span>Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
