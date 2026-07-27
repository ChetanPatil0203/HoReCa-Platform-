import React, { useState } from 'react';
import { Eye, EyeOff, User, Building, CheckCircle2 } from 'lucide-react';

export default function OverviewTab({ application }) {
  const [showIdentity, setShowIdentity] = useState(false);

  if (!application) return null;

  const docs = application.documents || [];
  const verifiedDocs = docs.filter(d => d.verificationStatus === 'Verified').length;
  const totalDocs = docs.length;
  const isVendor = application.accountType?.toLowerCase().includes('vendor');
  const isReady = verifiedDocs === totalDocs && totalDocs > 0;

  return (
    <div className="space-y-6">
      {/* 1. Compact Review Summary Strip */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E3E9F1]">
          <div className="pt-2 sm:pt-0 sm:px-2">
            <span className="text-xs text-[#71829B] block">Documents</span>
            <span className="text-sm font-bold text-[#071B3A]">{verifiedDocs} of {totalDocs} Verified</span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-2">
            <span className="text-xs text-[#71829B] block">Identity Proof</span>
            <span className="text-sm font-bold text-[#16B77A] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-2">
            <span className="text-xs text-[#71829B] block">Duplicate Check</span>
            <span className="text-sm font-bold text-[#16B77A]">Clear</span>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-2">
            <span className="text-xs text-[#71829B] block">Approval Status</span>
            <span className={`text-sm font-bold ${isReady ? 'text-[#16B77A]' : 'text-[#F59E0B]'}`}>
              {isReady ? 'Ready for Approval' : 'Not Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column Layout for Applicant and Business Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant Information */}
        <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E3E9F1]">
            <User className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Applicant Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#71829B] block mb-0.5">Contact Person</span>
              <span className="font-bold text-[#091B3A] text-sm">{application.proprietor}</span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Applicant Role</span>
              <span className="font-medium text-[#091B3A]">{application.applicantRole || 'Business Owner'}</span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Registered Mobile</span>
              <span className="font-semibold text-[#091B3A] block">{application.mobile}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16B77A] mt-0.5">
                ✓ Verified
              </span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Registered Email</span>
              <span className="font-semibold text-[#091B3A] block truncate">{application.email}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16B77A] mt-0.5">
                ✓ Verified
              </span>
            </div>

            <div className="col-span-2 bg-[#F5F7FA] p-3 rounded-xl border border-[#E3E9F1]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#71829B]">Identity Proof ({application.identityProofType || 'PAN Card'})</span>
                <button
                  onClick={() => setShowIdentity(!showIdentity)}
                  className="text-xs font-semibold text-[#071B3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showIdentity ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showIdentity ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <span className="font-mono font-bold text-[#071B3A]">
                {showIdentity ? (application.panNumber || 'ABCDE1234F') : (application.identityProofMasked || 'XXXXX1234X')}
              </span>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E3E9F1]">
            <Building className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Business Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <span className="text-[#71829B] block mb-0.5">Registered Business Name</span>
              <span className="font-bold text-[#091B3A] text-sm">{application.businessName}</span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Trade Name</span>
              <span className="font-medium text-[#091B3A]">{application.tradeName || application.businessName}</span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Account Type</span>
              <span className="font-medium text-[#091B3A]">{application.accountType}</span>
            </div>

            <div>
              <span className="text-[#71829B] block mb-0.5">Business Category</span>
              <span className="font-medium text-[#091B3A]">{application.type}</span>
            </div>

            {isVendor && application.specialization && (
              <div>
                <span className="text-[#71829B] block mb-0.5">Vendor Specialization</span>
                <span className="font-medium text-[#091B3A]">{application.specialization}</span>
              </div>
            )}

            {application.regNumber && (
              <div>
                <span className="text-[#71829B] block mb-0.5">Registration Number</span>
                <span className="font-mono font-semibold text-[#091B3A]">{application.regNumber}</span>
              </div>
            )}

            {application.panNumber && (
              <div>
                <span className="text-[#71829B] block mb-0.5">PAN Number</span>
                <span className="font-mono font-semibold text-[#091B3A]">{application.panNumber}</span>
              </div>
            )}

            {application.gstinNumber && (
              <div>
                <span className="text-[#71829B] block mb-0.5">GST Number</span>
                <span className="font-mono font-semibold text-[#091B3A]">{application.gstinNumber}</span>
              </div>
            )}

            {application.fssaiNumber && (
              <div>
                <span className="text-[#71829B] block mb-0.5">FSSAI Number</span>
                <span className="font-mono font-semibold text-[#091B3A]">{application.fssaiNumber}</span>
              </div>
            )}

            <div className="col-span-2 pt-2 border-t border-[#E3E9F1]">
              <span className="text-[#71829B] block mb-0.5">Business Address</span>
              <span className="font-medium text-[#091B3A] block">
                {application.address}, {application.location}, {application.state || 'Maharashtra'} - {application.pincode || '411001'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
