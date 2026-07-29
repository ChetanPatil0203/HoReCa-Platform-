import React, { useState } from 'react';
import { FileText, Eye, Upload, EllipsisVertical as MoreVertical, TriangleAlert as AlertTriangle } from 'lucide-react';

export default function DocumentsTab({
  documents = [],
  onViewDoc,
  onVerifyDoc,
  onRejectDoc,
  onRequestReplacement,
  onUploadLocalDoc,
}) {
  const [docFilter, setDocFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState(null);

  const verifiedCount = documents.filter((d) => d.verificationStatus === 'Verified').length;
  const pendingCount = documents.filter((d) => d.verificationStatus === 'Pending Verification').length;
  const rejectedCount = documents.filter((d) => d.verificationStatus === 'Rejected' || d.verificationStatus === 'Changes Requested').length;
  const totalCount = documents.length;
  const percentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const filteredDocs = documents.filter((doc) => {
    if (docFilter === 'Pending') return doc.verificationStatus === 'Pending Verification';
    if (docFilter === 'Verified') return doc.verificationStatus === 'Verified';
    if (docFilter === 'Needs Attention') return doc.verificationStatus === 'Rejected' || doc.verificationStatus === 'Changes Requested';
    if (docFilter === 'Missing') return doc.verificationStatus === 'Not Uploaded';
    return true;
  });

  const getRequirementBadge = (req) => {
    switch (req) {
      case 'Required':
        return <span className="px-2 py-0.5 text-[11px] font-semibold text-[#071B3A] bg-[#071B3A]/10 border border-[#071B3A]/20 rounded-md">Required</span>;
      case 'Required if applicable':
        return <span className="px-2 py-0.5 text-[11px] font-semibold text-[#71829B] bg-gray-100 border border-gray-200 rounded-md">Conditional</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-medium text-[#71829B] bg-gray-100 rounded-md">Optional</span>;
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#16B77A] bg-[#16B77A]/10 border border-[#16B77A]/20 rounded-full">✓ Verified</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full">✕ Rejected</span>;
      case 'Changes Requested':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#7C3AED] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full">⟳ Replacement Requested</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-full">⏳ Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Document Progress Summary */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-base font-bold text-[#071B3A]">Document Progress</h3>
            <p className="text-xs text-[#71829B] mt-0.5">
              {totalCount} Required Documents — <span className="font-bold text-[#16B77A]">{verifiedCount} Verified</span> · <span className="font-bold text-[#F59E0B]">{pendingCount} Pending</span>
            </p>
          </div>
          <div className="text-xs font-bold text-[#071B3A]">
            {percentage}% Complete
          </div>
        </div>

        <div className="w-full bg-[#E3E9F1] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#16B77A] h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {pendingCount > 0 && (
          <div className="mt-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-2.5 flex items-center gap-2 text-xs text-[#071B3A]">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span>{pendingCount} document(s) still require verification.</span>
          </div>
        )}
      </div>

      {/* 2. Document Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Pending', 'Verified', 'Needs Attention', 'Missing'].map((filter) => (
          <button
            key={filter}
            onClick={() => setDocFilter(filter)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              docFilter === filter
                ? 'bg-[#071B3A] text-white shadow-xs'
                : 'bg-white text-[#71829B] border border-[#E3E9F1] hover:bg-[#F5F7FA]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Compact Document Table */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E3E9F1] text-xs font-semibold text-[#71829B] uppercase tracking-wider">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E9F1] text-xs text-[#091B3A]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  {/* Document Cell */}
                  <td className="py-3.5 px-4 min-w-[220px]">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-[#071B3A] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#071B3A] text-sm">{doc.name}</div>
                        {doc.docNumber && (
                          <div className="text-[11px] text-[#71829B] font-mono mt-0.5">
                            Licence No: {doc.docNumber}
                          </div>
                        )}
                        <div className="text-[11px] text-[#71829B] mt-0.5">
                          File: {doc.filename || 'compliance-doc.pdf'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Requirement */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getRequirementBadge(doc.requirement)}
                  </td>

                  {/* Validity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span className={`font-semibold ${doc.validityStatus === 'Expired' ? 'text-[#EF4444]' : 'text-[#091B3A]'}`}>
                        {doc.validityStatus || 'Active'}
                      </span>
                      <div className="text-[11px] text-[#71829B]">
                        {doc.validUntil ? `Valid until ${doc.validUntil}` : 'No Expiry'}
                      </div>
                    </div>
                  </td>

                  {/* Verification */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getVerificationBadge(doc.verificationStatus)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDoc(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#71829B]" />
                        <span>View Document</span>
                      </button>

                      {doc.verificationStatus === 'Pending Verification' && (
                        <button
                          onClick={() => onVerifyDoc(doc)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#16B77A] rounded-xl hover:bg-[#139B67] transition-colors shadow-xs cursor-pointer"
                        >
                          Verify
                        </button>
                      )}

                      {/* More Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                          className="p-1.5 text-[#71829B] hover:text-[#071B3A] hover:bg-[#F5F7FA] rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === doc.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E3E9F1] rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                            <button
                              onClick={() => { onVerifyDoc(doc); setOpenMenuId(null); }}
                              className="w-full px-3 py-2 hover:bg-[#F5F7FA] text-[#16B77A] font-semibold text-left cursor-pointer"
                            >
                              Verify Document
                            </button>
                            <button
                              onClick={() => { onRejectDoc(doc); setOpenMenuId(null); }}
                              className="w-full px-3 py-2 hover:bg-[#F5F7FA] text-[#EF4444] font-semibold text-left cursor-pointer"
                            >
                              Reject Document
                            </button>
                            <button
                              onClick={() => { onRequestReplacement(doc); setOpenMenuId(null); }}
                              className="w-full px-3 py-2 hover:bg-[#F5F7FA] text-[#7C3AED] font-semibold text-left cursor-pointer"
                            >
                              Request Replacement
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
