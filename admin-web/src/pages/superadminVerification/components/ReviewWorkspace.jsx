import React, { useState } from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import OverviewTab from './OverviewTab';
import DocumentsTab from './DocumentsTab';
import ReviewDecisionTab from './ReviewDecisionTab';

export default function ReviewWorkspace({
  application,
  isOpen,
  onClose,
  onUpdateApplication,
  onAssignReviewerClick,
  onViewDoc,
  onVerifyDoc,
  onRejectDoc,
  onRequestReplacement,
  onUploadLocalDoc,
  onOpenNotes,
  onAddNote,
  onOpenHistory,
  onRequestChanges,
  onRejectApp,
  onApproveApp,
}) {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!isOpen || !application) return null;

  const tabs = [
    { id: 'Overview', label: '1. Overview' },
    { id: 'Documents', label: '2. Documents' },
    { id: 'Review & Decision', label: '3. Review & Decision' },
  ];

  const handleChecklistChange = (checkId, newState, remark = '') => {
    const updatedChecklist = (application.checklist || []).map((c) =>
      c.id === checkId ? { ...c, state: newState, remark: remark || c.remark } : c
    );

    const updatedApp = {
      ...application,
      checklist: updatedChecklist,
      history: [
        {
          id: `h-${Date.now()}`,
          event: `Checklist Item Updated (${newState})`,
          actor: application.assignedReviewer || 'Admin',
          date: 'Just now',
          remark: remark,
        },
        ...(application.history || []),
      ],
    };

    onUpdateApplication(updatedApp);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      {/* Workspace Container */}
      <div className="w-full max-w-[1320px] h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp border border-[#E3E9F1]">
        {/* Sticky Header */}
        <WorkspaceHeader
          application={application}
          onClose={onClose}
          onAssignClick={onAssignReviewerClick}
        />

        {/* Sticky 3-Tab Bar */}
        <div className="bg-[#F5F7FA] border-b border-[#E3E9F1] px-6 flex items-center gap-2 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#071B3A] text-[#071B3A] bg-white rounded-t-xl shadow-2xs'
                  : 'border-transparent text-[#71829B] hover:text-[#071B3A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Single Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
          {activeTab === 'Overview' && <OverviewTab application={application} />}

          {activeTab === 'Documents' && (
            <DocumentsTab
              documents={application.documents || []}
              onViewDoc={(doc) => onViewDoc({
                ...doc,
                businessName: application.businessName || application.tradeName || '',
                proprietor: application.proprietor || application.ownerName || '',
              })}
              onVerifyDoc={onVerifyDoc}
              onRejectDoc={onRejectDoc}
              onRequestReplacement={onRequestReplacement}
              onUploadLocalDoc={onUploadLocalDoc}
            />
          )}

          {activeTab === 'Review & Decision' && (
            <ReviewDecisionTab
              application={application}
              onChecklistChange={handleChecklistChange}
              onOpenNotes={onOpenNotes}
              onAddNote={onAddNote}
              onOpenHistory={onOpenHistory}
              onRequestChanges={onRequestChanges}
              onRejectApp={onRejectApp}
              onApproveApp={onApproveApp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
