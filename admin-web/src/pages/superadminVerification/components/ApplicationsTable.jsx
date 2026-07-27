import React from 'react';
import { ChevronRight, FileSearch } from 'lucide-react';

export default function ApplicationsTable({
  applications,
  isLoading,
  onOpenWorkspace,
  onAssignReviewer,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
}) {
  const reviewerOptions = ['Unassigned', 'Admin Rahul', 'Admin Priya', 'Admin Amit'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#16B77A] bg-[#16B77A]/10 border border-[#16B77A]/20 rounded-full">Approved</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full">Rejected</span>;
      case 'Under Review':
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full">Under Review</span>;
      case 'Changes Requested':
      case 'Resubmission Required':
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full">Changes Requested</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full">Pending Review</span>;
    }
  };

  const getDocProgress = (docs = []) => {
    if (!docs || docs.length === 0) return { verifiedCount: 0, totalCount: 0, percentage: 0, pendingCount: 0 };
    const verified = docs.filter(d => d.verificationStatus === 'Verified').length;
    const pending = docs.filter(d => d.verificationStatus === 'Pending Verification').length;
    const total = docs.length;
    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    return { verifiedCount: verified, totalCount: total, percentage, pendingCount: pending };
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-6 shadow-xs animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 bg-[#F5F7FA] border border-[#E3E9F1] rounded-full flex items-center justify-center mx-auto mb-3 text-[#71829B]">
          <FileSearch className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#071B3A]">No applications found</h3>
        <p className="text-sm text-[#71829B] mt-1 mb-4">
          No business registration applications match the selected criteria.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E3E9F1] rounded-2xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F7FA] border-b border-[#E3E9F1] text-xs font-semibold text-[#71829B] uppercase tracking-wider">
              <th className="py-3.5 px-4">Application</th>
              <th className="py-3.5 px-4">Business</th>
              <th className="py-3.5 px-4">Applicant</th>
              <th className="py-3.5 px-4">Documents</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Reviewer</th>
              <th className="py-3.5 px-4">Last Updated</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E9F1] text-sm text-[#091B3A]">
            {applications.map((app) => {
              const { verifiedCount, totalCount, percentage, pendingCount } = getDocProgress(app.documents);
              return (
                <tr key={app.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  {/* Application */}
                  <td className="py-4 px-4 font-mono font-medium text-[#071B3A] whitespace-nowrap">
                    <div>{app.shortAppId || 'APP-1083A'}</div>
                    <div className="text-xs text-[#71829B] font-sans mt-0.5">Submitted: {app.dateSubmitted?.split('·')[0] || '24 Jul 2026'}</div>
                  </td>

                  {/* Business */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-bold text-[#071B3A]">{app.businessName}</div>
                    <div className="text-xs text-[#71829B]">
                      {app.type || 'Hotel'} · {app.accountType || 'HoReCa Owner'}
                    </div>
                  </td>

                  {/* Applicant */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-medium text-[#091B3A]">{app.proprietor}</div>
                    <div className="text-xs text-[#71829B]">{app.location || 'Delhi'}</div>
                  </td>

                  {/* Documents */}
                  <td className="py-4 px-4 whitespace-nowrap min-w-[160px]">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#071B3A] mb-1">
                      <span>{verifiedCount} of {totalCount} Verified</span>
                      <span className="text-[#71829B] text-[11px]">
                        {pendingCount > 0 ? `${pendingCount} Pending` : 'Complete'}
                      </span>
                    </div>
                    <div className="w-full bg-[#E3E9F1] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#16B77A] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>

                  {/* Reviewer */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <select
                      value={app.assignedReviewer || 'Unassigned'}
                      onChange={(e) => onAssignReviewer(app.id, e.target.value)}
                      className="text-xs font-medium bg-[#F5F7FA] border border-[#E3E9F1] rounded-lg px-2.5 py-1.5 text-[#071B3A] focus:outline-none focus:border-[#071B3A] cursor-pointer"
                    >
                      {reviewerOptions.map((rev) => (
                        <option key={rev} value={rev}>{rev}</option>
                      ))}
                    </select>
                  </td>

                  {/* Last Updated */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-[#71829B]">
                    {app.dateSubmitted || '24 Jul · 08:56 PM'}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => onOpenWorkspace(app)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#102A4C] border border-[#071B3A] rounded-xl transition-all min-h-[40px] cursor-pointer shadow-2xs"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-[#E3E9F1] bg-[#F5F7FA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71829B]">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 bg-white border border-[#E3E9F1] rounded-lg text-[#071B3A] focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>applications per page</span>
        </div>

        <div className="flex items-center gap-2 font-medium">
          <span>Page {currentPage} of {totalPages || 1}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 bg-white border border-[#E3E9F1] rounded-lg disabled:opacity-50 text-[#071B3A] hover:bg-gray-50 cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 bg-white border border-[#E3E9F1] rounded-lg disabled:opacity-50 text-[#071B3A] hover:bg-gray-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
