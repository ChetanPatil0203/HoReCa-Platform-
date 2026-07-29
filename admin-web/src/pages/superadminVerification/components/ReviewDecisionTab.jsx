import React, { useState } from 'react';
import { CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle, FileText, ShieldCheck, History, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReviewDecisionTab({
  application,
  onChecklistChange,
  onOpenNotes,
  onAddNote,
  onOpenHistory,
  onRequestChanges,
  onRejectApp,
  onApproveApp,
}) {
  const [showAllChecks, setShowAllChecks] = useState(false);
  const [failedRemarkId, setFailedRemarkId] = useState(null);
  const [remarkText, setRemarkText] = useState('');

  if (!application) return null;

  const docs = application.documents || [];
  const pendingDocs = docs.filter(d => d.verificationStatus === 'Pending Verification').length;
  const rejectedDocs = docs.filter(d => d.verificationStatus === 'Rejected' || d.verificationStatus === 'Changes Requested').length;
  const verifiedDocs = docs.filter(d => d.verificationStatus === 'Verified').length;
  const totalDocs = docs.length;

  const checklist = application.checklist || [];
  
  // Dynamic system check c9 (Required Documents Verified)
  const isAllDocsVerified = pendingDocs === 0 && rejectedDocs === 0 && totalDocs > 0;
  const effectiveChecklist = checklist.map(c => {
    if (c.id === 'c9') {
      return { ...c, state: isAllDocsVerified ? 'Passed' : 'Pending' };
    }
    return c;
  });

  const manualChecklistItems = effectiveChecklist.filter(c => !['c2', 'c3', 'c8', 'c9', 'c10', 'c11'].includes(c.id));
  const pendingManualChecks = manualChecklistItems.filter(c => c.state !== 'Passed' && c.state !== 'Not Applicable').length;
  
  const systemChecks = [
    { label: 'Mobile Number Verified', status: application.mobileVerified ? 'System Check Passed' : 'Failed' },
    { label: 'Email Address Verified', status: application.emailVerified ? 'System Check Passed' : 'Failed' },
    { label: 'Required Documents Uploaded', status: totalDocs > 0 ? 'System Check Passed' : 'Pending' },
    { label: 'Required Documents Verified', status: isAllDocsVerified ? 'System Check Passed' : 'Pending Verification' },
    { label: 'Duplicate Review', status: application.riskReview?.duplicateMobile === 'No Match' ? 'Auto Verified' : 'Check Required' },
  ];

  // Approval Rule Evaluation
  const isDocsComplete = pendingDocs === 0 && rejectedDocs === 0 && totalDocs > 0;
  const isChecklistComplete = pendingManualChecks === 0;
  // Risk is considered OK if it's Low, Unknown, N/A, or not set (new registrations)
  const riskLevel = application.riskReview?.riskLevel || '';
  const isRiskLow = !riskLevel || riskLevel === 'Low' || riskLevel === 'Unknown' || riskLevel === 'N/A';
  const isApproveEnabled = isDocsComplete && isChecklistComplete && isRiskLow && application.status !== 'Approved';

  let disabledReason = '';
  if (pendingDocs > 0) disabledReason = `${pendingDocs} document(s) pending verification.`;
  else if (rejectedDocs > 0) disabledReason = `${rejectedDocs} document(s) rejected or require replacement.`;
  else if (pendingManualChecks > 0) disabledReason = `${pendingManualChecks} manual checklist check(s) pending.`;
  else if (!isRiskLow) disabledReason = 'High risk flag requires resolution.';
  else if (application.status === 'Approved') disabledReason = 'Application already approved.';

  const displayedChecks = showAllChecks ? effectiveChecklist : effectiveChecklist.slice(0, 5);

  const handleDropdownChange = (checkId, newState) => {
    if (newState === 'Failed') {
      setFailedRemarkId(checkId);
    } else {
      onChecklistChange(checkId, newState);
    }
  };

  const handleSaveRemark = (checkId) => {
    onChecklistChange(checkId, 'Failed', remarkText);
    setFailedRemarkId(null);
    setRemarkText('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Essential Verification Checklist */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E9F1]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Essential Verification Checklist</h3>
          </div>
          <span className="text-xs text-[#71829B] font-medium">
            {effectiveChecklist.filter(c => c.state === 'Passed').length} of {effectiveChecklist.length} Checks Passed
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {displayedChecks.map((item) => {
            const isSystemCheck = ['c2', 'c3', 'c8', 'c9', 'c10', 'c11'].includes(item.id);
            return (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E3E9F1]">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-[#091B3A]">{item.label}</span>
                  {isSystemCheck && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-[#071B3A] bg-[#071B3A]/10 rounded-md uppercase tracking-wider">
                      Auto Verified
                    </span>
                  )}
                </div>

                {isSystemCheck ? (
                  <span className="px-2.5 py-1 text-xs font-bold text-[#16B77A] bg-[#16B77A]/10 border border-[#16B77A]/20 rounded-lg self-start sm:self-auto">
                    {item.state === 'Passed' ? 'System Check Passed' : 'Pending Verification'}
                  </span>
                ) : (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select
                      value={item.state}
                      onChange={(e) => handleDropdownChange(item.id, e.target.value)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none cursor-pointer ${
                        item.state === 'Passed' ? 'bg-[#16B77A]/10 text-[#16B77A] border-[#16B77A]/30' :
                        item.state === 'Failed' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30' :
                        item.state === 'Not Applicable' ? 'bg-gray-100 text-[#71829B] border-gray-300' :
                        'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                      }`}
                    >
                      <option value="Passed">Passed ▾</option>
                      <option value="Pending">Pending ▾</option>
                      <option value="Failed">Failed ▾</option>
                      <option value="Not Applicable">Not Applicable ▾</option>
                    </select>
                  </div>
                )}

                {failedRemarkId === item.id && (
                  <div className="w-full mt-2 pt-2 border-t border-gray-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter reason for failure..."
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      className="flex-1 px-3 py-1 text-xs border border-red-300 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRemark(item.id)}
                      className="px-3 py-1 text-xs font-bold text-white bg-[#EF4444] rounded-lg"
                    >
                      Save Failure
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {effectiveChecklist.length > 5 && (
          <button
            onClick={() => setShowAllChecks(!showAllChecks)}
            className="text-xs font-bold text-[#071B3A] hover:underline flex items-center gap-1 mx-auto pt-1 cursor-pointer"
          >
            <span>{showAllChecks ? 'Show Fewer Checks' : `View All (${effectiveChecklist.length}) Checks`}</span>
            {showAllChecks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 2. Risk & Duplicate Summary */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-[#071B3A]">Risk &amp; Duplicate Summary</h3>

        <div className="bg-[#16B77A]/10 border border-[#16B77A]/20 rounded-xl p-3 flex items-center justify-between text-xs text-[#071B3A]">
          <span className="font-bold text-[#16B77A]">✓ Risk Review Clear</span>
          <span className="text-[#71829B]">No duplicate matches detected</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div>
            <span className="text-[#71829B] block">Duplicate Mobile</span>
            <span className={`font-semibold ${application.riskReview?.duplicateMobile === 'No Match' || application.riskReview?.duplicateMobile === 'N/A' || !application.riskReview?.duplicateMobile ? 'text-[#16B77A]' : 'text-[#EF4444]'}`}>
              {application.riskReview?.duplicateMobile || 'No Match'}
            </span>
          </div>
          <div>
            <span className="text-[#71829B] block">Duplicate Email</span>
            <span className={`font-semibold ${application.riskReview?.duplicateEmail === 'No Match' || application.riskReview?.duplicateEmail === 'N/A' || !application.riskReview?.duplicateEmail ? 'text-[#16B77A]' : 'text-[#EF4444]'}`}>
              {application.riskReview?.duplicateEmail || 'No Match'}
            </span>
          </div>
          <div>
            <span className="text-[#71829B] block">Duplicate PAN</span>
            <span className={`font-semibold ${application.riskReview?.duplicatePAN === 'No Match' || application.riskReview?.duplicatePAN === 'N/A' || !application.riskReview?.duplicatePAN ? 'text-[#16B77A]' : 'text-[#EF4444]'}`}>
              {application.riskReview?.duplicatePAN || 'No Match'}
            </span>
          </div>
          <div>
            <span className="text-[#71829B] block">Duplicate GST</span>
            <span className={`font-semibold ${application.riskReview?.duplicateGST === 'No Match' || application.riskReview?.duplicateGST === 'N/A' || !application.riskReview?.duplicateGST ? 'text-[#16B77A]' : 'text-[#EF4444]'}`}>
              {application.riskReview?.duplicateGST || 'No Match'}
            </span>
          </div>
          <div>
            <span className="text-[#71829B] block">Overall Risk</span>
            <span className={`font-bold ${riskLevel === 'High' ? 'text-[#EF4444]' : riskLevel === 'Medium' ? 'text-[#F59E0B]' : 'text-[#16B77A]'}`}>
              {riskLevel || 'Low'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Collapsed Summaries for Internal Notes & Review History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Internal Notes Collapsed Summary */}
        <div className="bg-white border border-[#E3E9F1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[#071B3A] text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#071B3A]" />
              Internal Notes
            </h4>
            <p className="text-xs text-[#71829B] mt-0.5">
              {(application.notes || []).length} note(s) recorded
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotes}
              className="px-3 py-1.5 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
            >
              View Notes
            </button>
          </div>
        </div>

        {/* Review History Collapsed Summary */}
        <div className="bg-white border border-[#E3E9F1] rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[#071B3A] text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-[#071B3A]" />
              Review History
            </h4>
            <p className="text-xs text-[#71829B] mt-0.5 truncate max-w-[200px]">
              Latest: {application.history?.[0]?.event || 'Application Submitted'}
            </p>
          </div>
          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 text-xs font-semibold text-[#071B3A] bg-white border border-[#E3E9F1] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
          >
            View History →
          </button>
        </div>
      </div>

      {/* 4. Approval Readiness Box */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs">
        <h4 className="font-bold text-[#071B3A] text-sm mb-2">Approval Readiness</h4>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-[#091B3A]">
              {verifiedDocs} of {totalDocs} required documents verified
            </span>
            {pendingDocs > 0 && (
              <span className="text-[#EF4444] block font-medium mt-0.5">
                • {pendingDocs} document(s) pending verification
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#71829B]">Status:</span>
            <span className={`font-bold px-3 py-1 rounded-full ${
              isApproveEnabled ? 'bg-[#16B77A]/10 text-[#16B77A]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
            }`}>
              {isApproveEnabled ? 'Ready for Approval' : 'Not Ready for Approval'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Sticky Decision Footer */}
      <div className="fixed bottom-0 right-0 left-0 z-30 bg-white border-t border-[#E3E9F1] px-6 py-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Readiness Warning / Hint */}
        <div className="text-xs">
          {isApproveEnabled ? (
            <span className="font-bold text-[#16B77A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ready for final approval decision.
            </span>
          ) : (
            <span className="font-semibold text-[#EF4444] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" /> Approval unavailable: {disabledReason}
            </span>
          )}
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={onRequestChanges}
            className="px-4 py-2.5 text-xs font-bold text-[#7C3AED] bg-white border border-[#7C3AED]/40 rounded-xl hover:bg-[#7C3AED]/5 transition-colors cursor-pointer"
          >
            Request Changes
          </button>

          <button
            onClick={onRejectApp}
            className="px-4 py-2.5 text-xs font-bold text-[#EF4444] bg-white border border-[#EF4444]/40 rounded-xl hover:bg-[#EF4444]/5 transition-colors cursor-pointer"
          >
            Reject
          </button>

          <button
            onClick={onApproveApp}
            disabled={!isApproveEnabled}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#16B77A] hover:bg-[#139B67] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Approve Business
          </button>
        </div>
      </div>
    </div>
  );
}
