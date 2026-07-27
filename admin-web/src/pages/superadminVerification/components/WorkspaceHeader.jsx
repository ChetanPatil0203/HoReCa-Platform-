import React, { useState } from 'react';
import { Copy, Check, X, UserPlus } from 'lucide-react';

export default function WorkspaceHeader({
  application,
  onClose,
  onAssignClick,
  onCopySuccess,
}) {
  const [copiedUuid, setCopiedUuid] = useState(false);

  if (!application) return null;

  const handleCopyUuid = () => {
    navigator.clipboard.writeText(application.id || 'N/A');
    setCopiedUuid(true);
    if (onCopySuccess) onCopySuccess('Technical Reference UUID copied to clipboard.');
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  return (
    <div className="bg-white border-b border-[#E3E9F1] px-6 py-4 rounded-t-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Business Title & Status */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#071B3A] text-[#F2C230] font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#071B3A]/20">
            {application.businessName ? application.businessName.substring(0, 2).toUpperCase() : 'HB'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#071B3A] tracking-tight">
                {application.businessName}
              </h2>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                application.status === 'Approved' ? 'bg-[#16B77A]/10 text-[#16B77A] border border-[#16B77A]/20' :
                application.status === 'Rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' :
                application.status === 'Under Review' ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20' :
                application.status === 'Changes Requested' ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20' :
                'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
              }`}>
                {application.status}
              </span>
            </div>
            <p className="text-xs text-[#71829B] font-medium mt-0.5">
              {application.type || 'Hotel'} · {application.accountType || 'HoReCa Owner'}
            </p>
          </div>
        </div>

        {/* Actions: Assign Reviewer, Close */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onAssignClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#71829B]" />
            <span>Assign Reviewer</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#71829B] hover:text-[#071B3A] hover:bg-[#F5F7FA] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="mt-4 pt-3 border-t border-[#E3E9F1] flex flex-wrap items-center justify-between gap-y-2 text-xs text-[#71829B]">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            Application ID: <span className="font-mono font-bold text-[#071B3A]">{application.shortAppId || 'APP-1083A'}</span>
          </div>
          <div>
            Submitted: <span className="font-medium text-[#091B3A]">{application.dateSubmitted || '24 Jul 2026 · 08:56 PM'}</span>
          </div>
          <div>
            Reviewer: <span className="font-semibold text-[#071B3A]">{application.assignedReviewer || 'Unassigned'}</span>
          </div>
        </div>

        {/* Technical UUID (Small copyable secondary text) */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#71829B]">
          <span>UUID: {application.id ? `${application.id.substring(0, 8)}...` : '1083a0c1...'}</span>
          <button
            onClick={handleCopyUuid}
            title="Copy Full UUID"
            className="text-[#71829B] hover:text-[#071B3A] transition-colors ml-1 cursor-pointer"
          >
            {copiedUuid ? <Check className="w-3.5 h-3.5 text-[#16B77A]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
