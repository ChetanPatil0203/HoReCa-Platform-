import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Shield, Download, ZoomIn, ZoomOut, QrCode, Award, Upload } from 'lucide-react';

export default function DocumentPreviewModal({
  isOpen,
  doc,
  onClose,
  onVerify,
  onReject,
  onRequestReplacement,
  onUploadLocalFile,
}) {
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [imageError, setImageError] = useState(false);

  if (!isOpen || !doc) return null;

  const effectiveUrl = doc.fileUrl || doc.url || doc.previewUrl || null;
  const hasFileUrl = Boolean(effectiveUrl);

  // Detect PDF: server path ends with .pdf OR blob type PDF
  const isPdf =
    hasFileUrl &&
    (effectiveUrl.toLowerCase().endsWith('.pdf') ||
     (effectiveUrl.startsWith('blob:') && doc.format === 'PDF'));

  // Detect web image: http/https/blob URL that is NOT a PDF
  const isWebImage =
    hasFileUrl &&
    !isPdf &&
    (effectiveUrl.startsWith('http://') ||
      effectiveUrl.startsWith('https://') ||
      effectiveUrl.startsWith('blob:')) &&
    !imageError;

  const hasSvg = Boolean(doc.svgContent);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadLocalFile) {
      const fileUrl = URL.createObjectURL(file);
      const format = file.type.includes('pdf') || file.name.endsWith('.pdf') ? 'PDF' : 'IMAGE';
      onUploadLocalFile(doc.id, fileUrl, file.name, format);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E9F1] bg-[#F5F7FA]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#071B3A]" />
            <div>
              <h3 className="text-base font-bold text-[#071B3A]">{doc.name}</h3>
              <p className="text-xs text-[#71829B]">Filename: {doc.filename || 'compliance-doc.jpg'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">

            <button
              onClick={handleZoomOut}
              className="p-1.5 text-[#71829B] hover:text-[#071B3A] hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-[#71829B]">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-[#71829B] hover:text-[#071B3A] hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-[#E3E9F1] mx-1" />
            <button
              onClick={onClose}
              className="p-1.5 text-[#71829B] hover:text-[#071B3A] hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Preview, Right Details */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#E3E9F1]">
          {/* Left Preview Pane */}
          <div className="lg:col-span-2 bg-[#0B1426] p-6 flex items-center justify-center min-h-[420px] overflow-auto relative">
            <div
              className="transition-transform duration-200 origin-center w-full max-w-xl"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {isPdf ? (
                <iframe
                  src={effectiveUrl}
                  title={doc.name}
                  className="w-full h-[550px] rounded-xl border border-gray-700 bg-white"
                />
              ) : hasSvg ? (
                <div
                  className="w-full rounded-xl shadow-xl border border-gray-300 bg-white overflow-auto"
                  style={{ minHeight: '500px', padding: '8px' }}
                  dangerouslySetInnerHTML={{ __html: doc.svgContent }}
                />
              ) : isWebImage ? (
                <img
                  src={effectiveUrl}
                  alt={doc.name}
                  onError={() => setImageError(true)}
                  className="w-full rounded-xl shadow-2xl border border-gray-700 max-h-[600px] object-contain"
                />
              ) : (
                /* High Fidelity Realistic Document Preview Certificate Frame */
                <div className="bg-[#FAFBFD] rounded-2xl shadow-2xl border-4 border-[#071B3A] text-gray-900 space-y-5 relative overflow-hidden p-6">
                  {/* Watermark Shield */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                    <Shield className="w-96 h-96 text-[#071B3A]" />
                  </div>

                  {/* Document Header Banner */}
                  <div className="bg-[#071B3A] text-white p-4 -mx-6 -mt-6 rounded-t-xl flex justify-between items-center border-b-4 border-[#F2C230]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F2C230] text-[#071B3A] flex items-center justify-center font-bold shadow-md">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs tracking-widest uppercase text-[#F2C230]">GOVERNMENT COMPLIANCE CERTIFICATE</h5>
                        <p className="text-[11px] text-gray-200 font-medium">MINISTRY OF CONSUMER AFFAIRS &amp; LICENSING</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold bg-[#F2C230] text-[#071B3A] px-2.5 py-1 rounded-md block">OFFICIAL SCAN</span>
                      <span className="text-[10px] text-gray-300 font-mono mt-0.5 block">REF: 2026-HRC-HUB</span>
                    </div>
                  </div>

                  {/* Document Title & Number */}
                  <div className="text-center space-y-1 py-2 border-b border-gray-200">
                    <span className="inline-block text-[10px] font-bold font-mono bg-blue-100 text-[#071B3A] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      DOCUMENT FILE: {doc.filename || 'WhatsApp Image'}
                    </span>
                    <h4 className="text-xl font-extrabold text-[#071B3A] tracking-tight uppercase mt-1">{doc.name}</h4>
                    <p className="text-xs font-mono text-gray-700 font-semibold">
                      LICENCE / REGISTRATION NO: <span className="text-[#071B3A] font-bold bg-amber-100 px-2 py-0.5 rounded">{doc.docNumber || '14161949674918'}</span>
                    </p>
                  </div>

                  {/* Certificate Information Grid */}
                  <div className="bg-white p-4 rounded-xl text-xs space-y-2.5 border border-gray-300 shadow-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-semibold">Issued Business Name:</span>
                      <span className="font-bold text-[#071B3A] text-sm">{doc.businessName || '—'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-semibold">Applicant Proprietor:</span>
                      <span className="font-bold text-gray-800">{doc.proprietor || '—'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-semibold">Document Category:</span>
                      <span className="font-bold text-[#091B3A]">{doc.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500 font-semibold">Validity Period:</span>
                      <span className="font-bold text-[#16B77A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{doc.validUntil || 'No Expiry'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Verification Audit Status:</span>
                      <span className="font-bold text-[#071B3A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{doc.verificationStatus}</span>
                    </div>
                  </div>

                  {/* Certificate Footer Stamp & Security Hash */}
                  <div className="pt-3 border-t border-gray-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-11 h-11 text-[#071B3A]" />
                      <div className="text-[9px] font-mono text-gray-600 leading-tight">
                        <span className="font-bold text-gray-800">SECURE DIGITAL STAMP</span><br />
                        <span>SHA-256: 8F92A108...3C</span><br />
                        <span className="text-emerald-700 font-semibold">STATUS: VERIFIED SUBMISSION</span>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-[#16B77A] bg-emerald-50 text-[#16B77A] rounded-xl px-3 py-1.5 text-[11px] font-extrabold uppercase rotate-[-2deg] shadow-xs text-center">
                      ✓ HRC HUB AUDITED<br />
                      <span className="text-[9px] font-normal text-emerald-800">COMPLIANCE PASSED</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Details Panel */}
          <div className="p-6 bg-white overflow-y-auto space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#71829B]">Document Verification Panel</h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#71829B] block">Document Name</span>
                <span className="font-bold text-[#071B3A] text-sm">{doc.name}</span>
              </div>

              <div>
                <span className="text-[#71829B] block">Requirement Level</span>
                <span className="font-medium text-[#091B3A]">{doc.requirement}</span>
              </div>

              <div>
                <span className="text-[#71829B] block">Document Number</span>
                <span className="font-mono font-semibold text-[#091B3A]">{doc.docNumber || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[#71829B] block">Validity Status</span>
                <span className="font-semibold text-[#16B77A]">{doc.validityStatus || 'Active'} ({doc.validUntil || 'No Expiry'})</span>
              </div>

              <div>
                <span className="text-[#71829B] block">Verification Status</span>
                <span className="font-bold text-[#071B3A]">{doc.verificationStatus}</span>
              </div>
            </div>

            {/* Checkbox confirmation before verify */}
            <div className="pt-4 border-t border-[#E3E9F1]">
              <label className="flex items-start gap-2.5 text-xs text-[#091B3A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                  className="mt-0.5 rounded text-[#071B3A] focus:ring-[#071B3A]"
                />
                <span>I have reviewed the document image/file and confirmed that the details match the submitted business profile.</span>
              </label>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => { onVerify(doc); onClose(); }}
                disabled={!confirmCheckbox}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#16B77A] rounded-xl hover:bg-[#139B67] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                Verify Document
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onReject(doc); onClose(); }}
                  className="py-2 text-xs font-bold text-[#EF4444] bg-white border border-[#EF4444]/30 rounded-xl hover:bg-[#EF4444]/5 transition-colors cursor-pointer"
                >
                  Reject Document
                </button>
                <button
                  onClick={() => { onRequestReplacement(doc); onClose(); }}
                  className="py-2 text-xs font-bold text-[#7C3AED] bg-white border border-[#7C3AED]/30 rounded-xl hover:bg-[#7C3AED]/5 transition-colors cursor-pointer"
                >
                  Request Replacement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
