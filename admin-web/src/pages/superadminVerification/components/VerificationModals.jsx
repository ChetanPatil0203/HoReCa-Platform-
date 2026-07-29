import React, { useState } from 'react';
import { X, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, ShieldAlert, UserPlus, FileText, Send, MessageSquare, History } from 'lucide-react';

/* ==========================================================================
   1. VERIFY DOCUMENT CONFIRMATION MODAL
   ========================================================================== */
export function VerifyDocModal({ isOpen, doc, onClose, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#16B77A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Verify Document</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-[#71829B]">
          Are you sure you want to verify <strong className="text-[#071B3A]">{doc.name}</strong>?
        </p>

        <label className="flex items-start gap-2.5 text-xs text-[#091B3A] cursor-pointer pt-2 border-t border-[#E3E9F1]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 rounded text-[#071B3A]"
          />
          <span>I reviewed this document and confirmed that the details match the submitted profile.</span>
        </label>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B] bg-white border border-[#E3E9F1] rounded-xl hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onConfirm(doc)}
            disabled={!confirmed}
            className="px-4 py-2 text-xs font-bold text-white bg-[#16B77A] rounded-xl hover:bg-[#139B67] disabled:opacity-50"
          >
            Verify Document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. REJECT DOCUMENT MODAL
   ========================================================================== */
export function RejectDocModal({ isOpen, doc, onClose, onConfirm }) {
  const [reason, setReason] = useState('Document is unreadable');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen || !doc) return null;

  const reasons = [
    'Document is unreadable',
    'Incorrect document uploaded',
    'Details do not match',
    'Document expired',
    'Invalid document number',
    'Missing page',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h3 className="text-base font-bold text-[#071B3A]">Reject Document</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-[#71829B]">
          Rejecting <strong className="text-[#071B3A]">{doc.name}</strong> will notify the applicant.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#71829B] mb-1">Select Rejection Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A]"
            >
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {(reason === 'Other' || customNote) && (
            <div>
              <label className="block text-xs font-semibold text-[#71829B] mb-1">Additional Note (Required for Other)</label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Explain why this document was rejected..."
                className="w-full p-2.5 bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B] bg-white border border-[#E3E9F1] rounded-xl">Cancel</button>
          <button
            onClick={() => onConfirm(doc, reason, customNote)}
            disabled={reason === 'Other' && !customNote.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#EF4444] rounded-xl hover:bg-[#DC2626] disabled:opacity-50"
          >
            Reject Document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. REQUEST REPLACEMENT MODAL
   ========================================================================== */
export function RequestReplacementModal({ isOpen, doc, onClose, onConfirm }) {
  const [instructions, setInstructions] = useState('');

  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="text-base font-bold text-[#071B3A]">Request Replacement</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-[#71829B]">
          Request a replacement upload for <strong className="text-[#071B3A]">{doc.name}</strong>.
        </p>

        <div className="space-y-2 text-xs">
          <label className="block text-xs font-semibold text-[#71829B]">Applicant Instructions</label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Please upload a clear, un-cropped scan of your valid license..."
            className="w-full p-2.5 border border-[#E3E9F1] rounded-xl text-[#091B3A]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B] bg-white border border-[#E3E9F1] rounded-xl">Cancel</button>
          <button
            onClick={() => onConfirm(doc, 'Replacement Requested', instructions)}
            disabled={!instructions.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9] disabled:opacity-50"
          >
            Request Replacement
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. INTERNAL NOTES DRAWER
   ========================================================================== */
export function InternalNotesDrawer({ isOpen, notes = [], onClose, onAddNote }) {
  const [category, setCategory] = useState('General');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote(category, text);
    setText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slideLeft">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E9F1]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-lg font-bold text-[#071B3A]">Internal Notes</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#71829B] hover:text-[#091B3A]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <form onSubmit={handleSubmit} className="space-y-3 bg-[#F5F7FA] p-4 rounded-xl border border-[#E3E9F1]">
            <div>
              <label className="block text-xs font-semibold text-[#71829B] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#E3E9F1] rounded-lg text-[#091B3A]"
              >
                <option value="General">General Note</option>
                <option value="Document Verification">Document Verification</option>
                <option value="Risk & Fraud">Risk &amp; Fraud</option>
                <option value="Applicant Contact">Applicant Contact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#71829B] mb-1">Note Content</label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add internal reviewer note..."
                className="w-full p-2 bg-white border border-[#E3E9F1] rounded-lg text-[#091B3A]"
              />
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full py-2 text-xs font-bold text-white bg-[#071B3A] rounded-xl hover:bg-[#102A4C] disabled:opacity-50"
            >
              Add Note
            </button>
          </form>

          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-[#71829B] text-xs uppercase">Saved Notes ({notes.length})</h4>
            {notes.length === 0 ? (
              <p className="text-xs text-[#71829B] italic">No internal notes added.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="bg-white border border-[#E3E9F1] p-3 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#071B3A] bg-[#071B3A]/10 px-2 py-0.5 rounded">{n.category}</span>
                    <span className="text-[#71829B]">{n.date}</span>
                  </div>
                  <p className="text-xs text-[#091B3A] pt-1">{n.text}</p>
                  <span className="text-[10px] text-[#71829B] block font-medium">Author: {n.author}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. REVIEW HISTORY DRAWER
   ========================================================================== */
export function ReviewHistoryDrawer({ isOpen, history = [], onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slideLeft">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E9F1]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-lg font-bold text-[#071B3A]">Audit Review History</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#71829B] hover:text-[#091B3A]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="relative border-l-2 border-[#E3E9F1] ml-3 pl-4 space-y-6">
            {history.map((h) => (
              <div key={h.id} className="relative">
                <div className="absolute -left-[23px] top-0 w-3 h-3 bg-[#071B3A] rounded-full border-2 border-white" />
                <div className="font-bold text-[#071B3A] text-xs">{h.event}</div>
                <div className="text-[11px] text-[#71829B]">{h.actor} · {h.date}</div>
                {h.remark && <div className="text-xs bg-[#F5F7FA] p-2 rounded-lg mt-1 border text-[#091B3A]">{h.remark}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. ASSIGN REVIEWER MODAL
   ========================================================================== */
export function AssignReviewerModal({ isOpen, currentReviewer, onClose, onAssign }) {
  const [selected, setSelected] = useState(currentReviewer || 'Admin Rahul');

  if (!isOpen) return null;

  const reviewers = [
    { name: 'Unassigned', role: 'None', activeCount: 0 },
    { name: 'Admin Rahul', role: 'Senior Compliance Officer', activeCount: 8 },
    { name: 'Admin Priya', role: 'Verification Specialist', activeCount: 4 },
    { name: 'Admin Amit', role: 'Super Admin', activeCount: 12 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#071B3A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Assign Reviewer</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-2 text-xs">
          {reviewers.map((r) => (
            <label
              key={r.name}
              onClick={() => setSelected(r.name)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selected === r.name ? 'border-[#071B3A] bg-[#071B3A]/5 font-bold' : 'border-[#E3E9F1] hover:bg-[#F5F7FA]'
              }`}
            >
              <div>
                <div className="text-[#071B3A]">{r.name}</div>
                <div className="text-[11px] text-[#71829B] font-normal">{r.role}</div>
              </div>
              <span className="text-[11px] text-[#71829B]">{r.activeCount} active apps</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E9F1]">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B]">Cancel</button>
          <button
            onClick={() => onAssign(selected)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] rounded-xl hover:bg-[#102A4C]"
          >
            Assign Reviewer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. REQUEST CHANGES MODAL
   ========================================================================== */
export function RequestChangesModal({ isOpen, application, onClose, onConfirm }) {
  const [instructions, setInstructions] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);

  if (!isOpen || !application) return null;

  const docs = application.documents || [];

  const toggleDoc = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="text-base font-bold text-[#071B3A]">Request Changes from Applicant</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-[#71829B]">
          Specify which documents require correction and provide clear instructions.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#71829B] mb-1.5">Select Documents Requiring Correction</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto border border-[#E3E9F1] rounded-xl p-2.5">
              {docs.map((d) => (
                <label key={d.id} className="flex items-center gap-2 cursor-pointer hover:bg-[#F5F7FA] p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(d.id)}
                    onChange={() => toggleDoc(d.id)}
                    className="rounded text-[#7C3AED]"
                  />
                  <span className="text-[#091B3A]">{d.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71829B] mb-1">Applicant Instructions (Required)</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide exact details of required changes..."
              className="w-full p-2.5 border border-[#E3E9F1] rounded-xl text-[#091B3A]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B]">Cancel</button>
          <button
            onClick={() => onConfirm(instructions, '7 days')}
            disabled={!instructions.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl hover:bg-[#6D28D9] disabled:opacity-50"
          >
            Send Change Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   8. REJECT APPLICATION MODAL
   ========================================================================== */
export function RejectApplicationModal({ isOpen, application, onClose, onConfirm }) {
  const [reason, setReason] = useState('Invalid business documents');
  const [applicantMsg, setApplicantMsg] = useState('');

  if (!isOpen || !application) return null;

  const reasons = [
    'Invalid business documents',
    'Required documents missing',
    'Business details mismatch',
    'Duplicate registration',
    'Identity verification failed',
    'Mandatory licence expired',
    'Risk review failed',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#EF4444]" />
            <h3 className="text-base font-bold text-[#071B3A]">Reject Business Application</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <p className="text-xs text-[#71829B]">
          Rejecting <strong className="text-[#071B3A]">{application.businessName}</strong> will notify the applicant. All uploaded files and history will be preserved.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#71829B] mb-1">Primary Rejection Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3E9F1] rounded-xl text-[#091B3A]"
            >
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71829B] mb-1">Applicant Facing Reason (Required)</label>
            <textarea
              rows={3}
              value={applicantMsg}
              onChange={(e) => setApplicantMsg(e.target.value)}
              placeholder="Explain reason clearly for the applicant..."
              className="w-full p-2.5 border border-[#E3E9F1] rounded-xl text-[#091B3A]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B]">Cancel</button>
          <button
            onClick={() => onConfirm(reason, applicantMsg)}
            disabled={!applicantMsg.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#EF4444] rounded-xl hover:bg-[#DC2626] disabled:opacity-50"
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   9. APPROVE APPLICATION MODAL
   ========================================================================== */
export function ApproveApplicationModal({ isOpen, application, onClose, onConfirm }) {
  if (!isOpen || !application) return null;

  const docs = application.documents || [];
  const verifiedCount = docs.filter(d => d.verificationStatus === 'Verified').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp border border-[#E3E9F1]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#16B77A]" />
            <h3 className="text-base font-bold text-[#071B3A]">Approve Business Application</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded-xl space-y-2 border border-[#E3E9F1] text-xs">
          <div className="flex justify-between"><span className="text-[#71829B]">Business Name:</span><span className="font-bold text-[#071B3A]">{application.businessName}</span></div>
          <div className="flex justify-between"><span className="text-[#71829B]">Category:</span><span className="font-medium text-[#091B3A]">{application.type}</span></div>
          <div className="flex justify-between"><span className="text-[#71829B]">Applicant:</span><span className="font-medium text-[#091B3A]">{application.proprietor}</span></div>
          <div className="flex justify-between"><span className="text-[#71829B]">Documents:</span><span className="font-bold text-[#16B77A]">{verifiedCount} of {docs.length} Verified</span></div>
          <div className="flex justify-between"><span className="text-[#71829B]">Checklist:</span><span className="font-bold text-[#16B77A]">All required checks passed</span></div>
          <div className="flex justify-between"><span className="text-[#71829B]">Risk Level:</span><span className="font-bold text-[#16B77A]">Low</span></div>
        </div>

        <p className="text-xs text-[#71829B]">
          Approving this business will activate their account and grant platform operational permissions.
        </p>

        <div className="flex justify-end gap-2 pt-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#71829B]">Cancel</button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-[#16B77A] rounded-xl hover:bg-[#139B67] shadow-xs cursor-pointer"
          >
            Approve Business
          </button>
        </div>
      </div>
    </div>
  );
}
