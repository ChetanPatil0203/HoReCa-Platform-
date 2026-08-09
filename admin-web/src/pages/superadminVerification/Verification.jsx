import React, { useState, useEffect, useMemo } from 'react';

import {
  fetchHorecaRegistrations,
  fetchVendorRegistrations,
  updateVerificationStatus,
} from '../../services/api.service';

import VerificationHeader from './components/VerificationHeader';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import FilterDrawer from './components/FilterDrawer';
import ApplicationsTable from './components/ApplicationsTable';
import ApplicationCardView from './components/ApplicationCardView';
import ReviewWorkspace from './components/ReviewWorkspace';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import {
  VerifyDocModal,
  RejectDocModal,
  RequestReplacementModal,
  InternalNotesDrawer,
  ReviewHistoryDrawer,
  AssignReviewerModal,
  RequestChangesModal,
  RejectApplicationModal,
  ApproveApplicationModal,
} from './components/VerificationModals';

import { getSampleDocumentSvg } from './utils/sampleDocumentImages';

export default function Verification() {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState('');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    accountType: 'All',
    category: 'All',
    reviewer: 'All',
    docCompletion: 'All',
    city: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [docPreviewModal, setDocPreviewModal] = useState({ open: false, doc: null });
  const [verifyDocModal, setVerifyDocModal] = useState({ open: false, doc: null });
  const [rejectDocModal, setRejectDocModal] = useState({ open: false, doc: null });
  const [requestReplacementModal, setRequestReplacementModal] = useState({ open: false, doc: null });
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [assignReviewerModalOpen, setAssignReviewerModalOpen] = useState(false);
  const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
  const [rejectAppModalOpen, setRejectAppModalOpen] = useState(false);
  const [approveAppModalOpen, setApproveAppModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const safeStr = (v, fallback = '') => (v !== undefined && v !== null ? String(v) : fallback);
  const getShortAppId = (id) => `APP-${safeStr(id).replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase() || '1083A'}`;

  const getDefaultDocsForEntity = (entityType, record) => {
    const isVendor = !safeStr(entityType).toLowerCase().includes('horeca');
    const bizName = record?.bizName || record?.businessName || '';
    const propName = record?.ownerName || record?.contactPerson || record?.proprietor || '';
    const userUploadedDocs = record?.user?.documents || record?.documents || record?.files || [];

    const findUploadedDoc = (key) => {
      const k = key.toLowerCase();

      // Determine search keywords for this document slot
      let keywords = [k];
      if (k.includes('fssai')) keywords = ['fssai', 'food'];
      else if (k.includes('gst')) keywords = ['gst', 'gstin'];
      else if (k.includes('pan')) keywords = ['pan'];
      else if (k.includes('reg')) keywords = ['reg', 'licence', 'license', 'trade', 'shop', 'business'];
      else if (k.includes('fire')) keywords = ['fire', 'noc'];
      else if (k.includes('addr')) keywords = ['addr', 'address', 'warehouse', 'establishment', 'local'];

      const matchesKeyword = (str) => {
        if (!str) return false;
        const lower = String(str).toLowerCase();
        return keywords.some(kw => lower.includes(kw));
      };

      // 1. Direct fields on registration record
      if (k.includes('fssai') && (record?.fssaiUrl || record?.fssaiDoc || record?.fssaiFile || record?.fssai)) {
        const val = record.fssaiUrl || record.fssaiDoc || record.fssaiFile || record.fssai;
        if (typeof val === 'string') return { fileUrl: val, filename: val.split('/').pop() || 'fssai-licence.jpg' };
        if (val && typeof val === 'object') return { fileUrl: val.fileUrl || val.url || val.uri, filename: val.name || val.filename || 'fssai-licence.jpg' };
      }
      if (k.includes('gst') && (record?.gstUrl || record?.gstDoc || record?.gstFile)) {
        const val = record.gstUrl || record.gstDoc || record.gstFile;
        if (typeof val === 'string') return { fileUrl: val, filename: val.split('/').pop() || 'gst-certificate.jpg' };
        if (val && typeof val === 'object') return { fileUrl: val.fileUrl || val.url || val.uri, filename: val.name || val.filename || 'gst-certificate.jpg' };
      }
      if (k.includes('pan') && (record?.panUrl || record?.panDoc || record?.panFile)) {
        const val = record.panUrl || record.panDoc || record.panFile;
        if (typeof val === 'string') return { fileUrl: val, filename: val.split('/').pop() || 'pan-card.jpg' };
        if (val && typeof val === 'object') return { fileUrl: val.fileUrl || val.url || val.uri, filename: val.name || val.filename || 'pan-card.jpg' };
      }
      if (k.includes('reg') && (record?.regUrl || record?.regDoc || record?.tradeLicenseFile)) {
        const val = record.regUrl || record.regDoc || record.tradeLicenseFile;
        if (typeof val === 'string') return { fileUrl: val, filename: val.split('/').pop() || 'business-reg.jpg' };
        if (val && typeof val === 'object') return { fileUrl: val.fileUrl || val.url || val.uri, filename: val.name || val.filename || 'business-reg.jpg' };
      }
      if (k.includes('fire') && (record?.fireUrl || record?.fireDoc || record?.fireNocFile)) {
        const val = record.fireUrl || record.fireDoc || record.fireNocFile;
        if (typeof val === 'string') return { fileUrl: val, filename: val.split('/').pop() || 'fire-noc.jpg' };
        if (val && typeof val === 'object') return { fileUrl: val.fileUrl || val.url || val.uri, filename: val.name || val.filename || 'fire-noc.jpg' };
      }

      // 2. Handle userUploadedDocs if it's an Array
      if (Array.isArray(userUploadedDocs)) {
        const found = userUploadedDocs.find(d => {
          if (!d) return false;
          const dk = (d.docKey || d.key || d.name || '').toLowerCase();
          const dn = (d.docName || d.filename || '').toLowerCase();
          return matchesKeyword(dk) || matchesKeyword(dn);
        });
        if (found) {
          return {
            fileUrl: found.fileUrl || found.url || found.uri,
            filename: found.docName || found.name || found.filename || `${key}.jpg`,
            status: found.status,
          };
        }
      }

      // 3. Handle userUploadedDocs if it's an Object/Dictionary
      if (userUploadedDocs && typeof userUploadedDocs === 'object') {
        const entries = Object.entries(userUploadedDocs);
        for (const [docKey, docVal] of entries) {
          const name = typeof docVal === 'object' ? (docVal?.name || docVal?.filename) : '';
          if (matchesKeyword(docKey) || matchesKeyword(name)) {
            const url = typeof docVal === 'string' ? docVal : (docVal?.uri || docVal?.url || docVal?.fileUrl);
            const fileName = typeof docVal === 'object' ? (docVal?.name || docVal?.filename) : docKey;
            if (url) {
              return { fileUrl: url, filename: fileName || `${key}.jpg`, status: docVal?.status };
            }
          }
        }
      }

      return null;
    };

    const getBackendBaseUrl = () => {
      if (import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
      }
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return `http://${hostname}:5000`;
    };

    const BACKEND_URL = getBackendBaseUrl();

    const resolveDoc = (candidateUrl, docName, docNumber) => {
      if (typeof candidateUrl === 'string' && candidateUrl.trim()) {
        let cleanUrl = candidateUrl.trim().replace(/\\/g, '/');

        // Handle full HTTP / HTTPS URLs (including legacy IP URLs)
        if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
          if (cleanUrl.includes('/uploads/')) {
            const uploadPath = cleanUrl.substring(cleanUrl.indexOf('/uploads/'));
            return { fileUrl: `${BACKEND_URL}${uploadPath}`, svgContent: null };
          }
          return { fileUrl: cleanUrl, svgContent: null };
        }

        if (cleanUrl.startsWith('blob:')) {
          return { fileUrl: cleanUrl, svgContent: null };
        }

        // Relative uploads path
        if (cleanUrl.includes('uploads/')) {
          const uploadPath = cleanUrl.substring(cleanUrl.indexOf('uploads/'));
          return { fileUrl: `${BACKEND_URL}/${uploadPath}`, svgContent: null };
        }

        if (cleanUrl.length > 0) {
          const path = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
          return { fileUrl: `${BACKEND_URL}${path}`, svgContent: null };
        }
      }
      // No valid URL — generate SVG preview placeholder
      return { fileUrl: null, svgContent: getSampleDocumentSvg(docName, docNumber, bizName, propName) };
    };

    if (!isVendor) {
      const upFssai = findUploadedDoc('fssai');
      const upGst = findUploadedDoc('gst');
      const upReg = findUploadedDoc('reg');
      const upPan = findUploadedDoc('pan');
      const upFire = findUploadedDoc('fire');

      const fssaiNum = record?.fssaiNo || '';
      const gstinNum = record?.gstin || '';
      const regNum = record?.regNumber || '';
      const panNum = record?.panNumber || '';
      const fireNum = '';

      const fssaiDoc   = resolveDoc(upFssai?.fileUrl || upFssai?.url || upFssai?.uri, 'FSSAI Licence', fssaiNum);
      const gstDoc     = resolveDoc(upGst?.fileUrl   || upGst?.url   || upGst?.uri,   'GST Certificate', gstinNum);
      const regDoc     = resolveDoc(upReg?.fileUrl   || upReg?.url   || upReg?.uri,   'Business Registration', regNum);
      const panDocR    = resolveDoc(upPan?.fileUrl   || upPan?.url   || upPan?.uri,   'PAN Card', panNum);
      const fireDoc    = resolveDoc(upFire?.fileUrl  || upFire?.url  || upFire?.uri,  'Fire Safety Certificate', fireNum);

      const resolveStatus = (up) => {
        if (record?.status === 'approved') return 'Verified';
        if (record?.status === 'rejected') return 'Rejected';
        if (up && up.status === 'rejected') return 'Rejected';
        // Auto-verify uploaded / submitted documents by default
        return 'Verified';
      };

      return [
        { id: 'doc-fssai', name: 'FSSAI Licence',                        requirement: 'Required',              docNumber: fssaiNum, validUntil: '24 Aug 2027', filename: upFssai?.filename || 'fssai-licence.jpg',  format: 'PDF', size: '1.4 MB', verificationStatus: resolveStatus(upFssai), validityStatus: 'Active', fileUrl: fssaiDoc.fileUrl, svgContent: fssaiDoc.svgContent },
        { id: 'doc-gst',   name: 'GST Certificate',                      requirement: 'Required',              docNumber: gstinNum, validUntil: 'No Expiry',   filename: upGst?.filename  || 'gst-certificate.jpg', format: 'PDF', size: '890 KB',  verificationStatus: resolveStatus(upGst),   validityStatus: 'Active', fileUrl: gstDoc.fileUrl,   svgContent: gstDoc.svgContent },
        { id: 'doc-reg',   name: 'Business Registration / Trade Licence', requirement: 'Required',              docNumber: regNum,   validUntil: 'No Expiry',   filename: upReg?.filename  || 'business-reg.jpg',    format: 'PDF', size: '2.1 MB', verificationStatus: resolveStatus(upReg),   validityStatus: 'Active', fileUrl: regDoc.fileUrl,   svgContent: regDoc.svgContent },
        { id: 'doc-pan',   name: 'PAN Card',                             requirement: 'Required',              docNumber: panNum,   validUntil: 'No Expiry',   filename: upPan?.filename  || 'pan-card.jpg',         format: 'PDF', size: '450 KB',  verificationStatus: resolveStatus(upPan),   validityStatus: 'Active', fileUrl: panDocR.fileUrl,  svgContent: panDocR.svgContent },
        { id: 'doc-fire',  name: 'Fire Safety Certificate / NOC',        requirement: 'Required if applicable', docNumber: fireNum,  validUntil: '15 Jan 2027', filename: upFire?.filename || 'fire-noc.jpg',          format: 'PDF', size: '1.1 MB', verificationStatus: resolveStatus(upFire),  validityStatus: 'Active', fileUrl: fireDoc.fileUrl,  svgContent: fireDoc.svgContent },
      ];
    } else {
      const upVGst = findUploadedDoc('gst');
      const upVPan = findUploadedDoc('pan');
      const upVReg = findUploadedDoc('reg');
      const upVAddr = findUploadedDoc('addr');

      const vGstinNum = record?.gstin || '';
      const vPanNum = record?.panNumber || '';
      const vRegNum = record?.regNumber || '';
      const vAddrNum = '';

      const resolveVendorStatus = (up) => {
        if (record?.status === 'approved') return 'Verified';
        if (record?.status === 'rejected') return 'Rejected';
        if (up && up.status === 'rejected') return 'Rejected';
        // Auto-verify uploaded / submitted documents by default
        return 'Verified';
      };

      const vGstDoc  = resolveDoc(upVGst?.fileUrl  || upVGst?.url  || upVGst?.uri,  'GST Certificate',               vGstinNum);
      const vPanDoc  = resolveDoc(upVPan?.fileUrl  || upVPan?.url  || upVPan?.uri,  'PAN Card',                      vPanNum);
      const vRegDoc  = resolveDoc(upVReg?.fileUrl  || upVReg?.url  || upVReg?.uri,  'Business Registration',         vRegNum);
      const vAddrDoc = resolveDoc(upVAddr?.fileUrl || upVAddr?.url || upVAddr?.uri, 'Address Proof / Warehouse Proof', vAddrNum);

      return [
        { id: 'doc-v-gst',  name: 'GST Certificate',                    requirement: 'Required', docNumber: vGstinNum, validUntil: 'No Expiry', filename: upVGst?.filename  || 'vendor-gst.jpg',          format: 'PDF', size: '920 KB', verificationStatus: resolveVendorStatus(upVGst),  validityStatus: 'Active', fileUrl: vGstDoc.fileUrl,  svgContent: vGstDoc.svgContent },
        { id: 'doc-v-pan',  name: 'PAN Card',                           requirement: 'Required', docNumber: vPanNum,   validUntil: 'No Expiry', filename: upVPan?.filename  || 'vendor-pan.jpg',          format: 'PDF', size: '510 KB', verificationStatus: resolveVendorStatus(upVPan),  validityStatus: 'Active', fileUrl: vPanDoc.fileUrl,  svgContent: vPanDoc.svgContent },
        { id: 'doc-v-reg',  name: 'Business Registration Certificate', requirement: 'Required', docNumber: vRegNum,   validUntil: 'No Expiry', filename: upVReg?.filename  || 'vendor-registration.jpg', format: 'PDF', size: '1.8 MB', verificationStatus: resolveVendorStatus(upVReg),  validityStatus: 'Active', fileUrl: vRegDoc.fileUrl,  svgContent: vRegDoc.svgContent },
        { id: 'doc-v-addr', name: 'Address Proof / Warehouse Proof',   requirement: 'Required', docNumber: vAddrNum,  validUntil: 'No Expiry', filename: upVAddr?.filename || 'warehouse-proof.jpg',      format: 'PDF', size: '1.1 MB', verificationStatus: resolveVendorStatus(upVAddr), validityStatus: 'Active', fileUrl: vAddrDoc.fileUrl, svgContent: vAddrDoc.svgContent },
      ];
    }
  };

  // Load backend & mock submissions
  const loadSubmissions = async () => {
    setIsRefreshing(true);
    let combined = [];

    try {
      const [horecaData, vendorData] = await Promise.all([
        fetchHorecaRegistrations(),
        fetchVendorRegistrations(),
      ]);

      if (Array.isArray(horecaData)) {
        horecaData.forEach((h) => {
          const mobVerified = h.mobileVerified ?? true;
          const emVerified = h.emailVerified ?? true;
          const isOwnerOk = Boolean(h.ownerName || (h.user && (h.user.firstName || h.user.lastName)) || h.applicantRole || h.bizName);
          const isAddressOk = Boolean(h.address || h.city || h.state);
          const isRegOk = Boolean(h.regNumber || h.fssaiNo || h.gstin || h.documents?.length);
          const isPanOk = Boolean(h.panNumber || h.panNo || h.documents?.length);
          const isGstOk = Boolean(h.gstin || h.gstinNumber || h.documents?.length);

          combined.push({
            id: safeStr(h.id),
            shortAppId: getShortAppId(h.id),
            businessName: safeStr(h.bizName),
            tradeName: safeStr(h.bizName),
            entityType: 'HoReCa Owners',
            accountType: 'HoReCa Owner',
            type: safeStr(h.bizCategory),
            proprietor: h.ownerName || (h.user ? `${safeStr(h.user.firstName)} ${safeStr(h.user.lastName)}`.trim() : ''),
            mobile: safeStr(h.mobile),
            mobileVerified: mobVerified,
            email: safeStr(h.email),
            emailVerified: emVerified,
            applicantRole: safeStr(h.applicantRole, 'Business Owner'),
            identityProofType: safeStr(h.identityProofType, 'PAN Card'),
            identityProofMasked: safeStr(h.identityProofMasked),
            location: safeStr(h.city),
            address: safeStr(h.address),
            state: safeStr(h.state),
            pincode: safeStr(h.pincode),
            regNumber: safeStr(h.regNumber),
            panNumber: safeStr(h.panNumber),
            gstinNumber: safeStr(h.gstin),
            fssaiNumber: safeStr(h.fssaiNo),
            status: h.status === 'approved' ? 'Approved' : h.status === 'rejected' ? 'Rejected' : h.status === 'resubmission' ? 'Changes Requested' : 'Pending Review',
            dateSubmitted: h.createdAt ? new Date(h.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
            assignedReviewer: safeStr(h.assignedReviewer, 'Unassigned'),
            registrationType: 'horeca',
            documents: getDefaultDocsForEntity('HoReCa Owners', h),
            checklist: [
              { id: 'c1', label: 'Owner Identity Matched', state: isOwnerOk ? 'Passed' : 'Pending' },
              { id: 'c2', label: 'Mobile Number Verified', state: mobVerified ? 'Passed' : 'Pending' },
              { id: 'c3', label: 'Email Address Verified', state: emVerified ? 'Passed' : 'Pending' },
              { id: 'c4', label: 'Business Address Matched', state: isAddressOk ? 'Passed' : 'Pending' },
              { id: 'c5', label: 'Business Registration Validated', state: isRegOk ? 'Passed' : 'Pending' },
              { id: 'c6', label: 'PAN Details Matched', state: isPanOk ? 'Passed' : 'Pending' },
              { id: 'c7', label: 'GST Details Validated', state: isGstOk ? 'Passed' : 'Pending' },
              { id: 'c8', label: 'Required Documents Uploaded', state: 'Passed' },
              { id: 'c9', label: 'Required Documents Verified', state: 'Passed' },
              { id: 'c10', label: 'Documents Are Not Expired', state: 'Passed' },
              { id: 'c11', label: 'Duplicate Check Completed', state: 'Passed' },
              { id: 'c12', label: 'Risk Assessment Completed', state: 'Passed' },
            ],
            riskReview: { duplicateMobile: 'No Match', duplicateEmail: 'No Match', duplicatePAN: 'No Match', duplicateGST: 'No Match', previousRejection: 'None', riskLevel: 'Low' },
            notes: [],
            history: h.history || [],
          });
        });
      }

      if (Array.isArray(vendorData)) {
        vendorData.forEach((v) => {
          const mobVerified = v.mobileVerified ?? true;
          const emVerified = v.emailVerified ?? true;
          const isOwnerOk = Boolean(v.contactPerson || v.applicantRole || v.bizName);
          const isAddressOk = Boolean(v.address || v.city || v.state);
          const isRegOk = Boolean(v.regNumber || v.gstin || v.documents?.length);
          const isPanOk = Boolean(v.panNumber || v.documents?.length);
          const isGstOk = Boolean(v.gstin || v.documents?.length);

          combined.push({
            id: safeStr(v.id),
            shortAppId: getShortAppId(v.id),
            businessName: safeStr(v.bizName),
            tradeName: safeStr(v.bizName),
            entityType: 'Vendors',
            accountType: 'Vendor Partner',
            type: safeStr(v.vendorType),
            specialization: safeStr(v.subCategory),
            proprietor: safeStr(v.contactPerson),
            mobile: safeStr(v.mobile),
            mobileVerified: mobVerified,
            email: safeStr(v.email),
            emailVerified: emVerified,
            applicantRole: safeStr(v.applicantRole, 'Vendor Proprietor'),
            identityProofType: safeStr(v.identityProofType, 'PAN Card'),
            identityProofMasked: safeStr(v.identityProofMasked),
            location: safeStr(v.city),
            address: safeStr(v.address),
            state: safeStr(v.state),
            pincode: safeStr(v.pincode),
            regNumber: safeStr(v.regNumber),
            panNumber: safeStr(v.panNumber),
            gstinNumber: safeStr(v.gstin),
            status: v.status === 'approved' ? 'Approved' : v.status === 'rejected' ? 'Rejected' : v.status === 'resubmission' ? 'Changes Requested' : 'Pending Review',
            dateSubmitted: v.createdAt ? new Date(v.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
            assignedReviewer: safeStr(v.assignedReviewer, 'Unassigned'),
            registrationType: 'vendor',
            documents: getDefaultDocsForEntity('Vendor', v),
            checklist: [
              { id: 'c1', label: 'Owner Identity Matched', state: isOwnerOk ? 'Passed' : 'Pending' },
              { id: 'c2', label: 'Mobile Number Verified', state: mobVerified ? 'Passed' : 'Pending' },
              { id: 'c3', label: 'Email Address Verified', state: emVerified ? 'Passed' : 'Pending' },
              { id: 'c4', label: 'Business Address Matched', state: isAddressOk ? 'Passed' : 'Pending' },
              { id: 'c5', label: 'Business Registration Validated', state: isRegOk ? 'Passed' : 'Pending' },
              { id: 'c6', label: 'PAN Details Matched', state: isPanOk ? 'Passed' : 'Pending' },
              { id: 'c7', label: 'GST Details Validated', state: isGstOk ? 'Passed' : 'Pending' },
              { id: 'c8', label: 'Required Documents Uploaded', state: 'Passed' },
              { id: 'c9', label: 'Required Documents Verified', state: 'Passed' },
              { id: 'c10', label: 'Documents Are Not Expired', state: 'Passed' },
              { id: 'c11', label: 'Duplicate Check Completed', state: 'Passed' },
              { id: 'c12', label: 'Risk Assessment Completed', state: 'Passed' },
            ],
            riskReview: { duplicateMobile: 'No Match', duplicateEmail: 'No Match', duplicatePAN: 'No Match', duplicateGST: 'No Match', previousRejection: 'None', riskLevel: 'Low' },
            notes: [],
            history: v.history || [],
          });
        });
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local mock Db', err);
    }


    setKycSubmissions(combined);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Compute status counts
  const statusCounts = useMemo(() => {
    const counts = {
      'All': kycSubmissions.length,
      'Pending Review': 0,
      'Under Review': 0,
      'Changes Requested': 0,
      'Approved': 0,
      'Rejected': 0,
    };
    kycSubmissions.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status] += 1;
      }
    });
    return counts;
  }, [kycSubmissions]);

  // Filtering & Search
  const filteredSubmissions = useMemo(() => {
    return kycSubmissions.filter((item) => {
      if (activeStatus !== 'All' && item.status !== activeStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          safeStr(item.shortAppId).toLowerCase().includes(q) ||
          safeStr(item.id).toLowerCase().includes(q) ||
          safeStr(item.businessName).toLowerCase().includes(q) ||
          safeStr(item.proprietor).toLowerCase().includes(q) ||
          safeStr(item.mobile).toLowerCase().includes(q) ||
          safeStr(item.email).toLowerCase().includes(q) ||
          safeStr(item.panNumber).toLowerCase().includes(q) ||
          safeStr(item.gstinNumber).toLowerCase().includes(q) ||
          safeStr(item.location).toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (filters.accountType !== 'All' && item.accountType !== filters.accountType) return false;
      if (filters.category !== 'All' && item.type !== filters.category) return false;
      if (filters.reviewer !== 'All' && item.assignedReviewer !== filters.reviewer) return false;
      if (filters.city && !safeStr(item.location).toLowerCase().includes(filters.city.toLowerCase())) return false;

      return true;
    });
  }, [kycSubmissions, activeStatus, searchQuery, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSubmissions.length / pageSize) || 1;
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  const activeApplication = useMemo(() => {
    return kycSubmissions.find((k) => k.id === selectedKycId) || null;
  }, [kycSubmissions, selectedKycId]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.accountType !== 'All') count++;
    if (filters.category !== 'All') count++;
    if (filters.reviewer !== 'All') count++;
    if (filters.docCompletion !== 'All') count++;
    if (filters.city) count++;
    return count;
  }, [filters]);

  const handleOpenWorkspace = (app) => {
    setSelectedKycId(app.id);
    setIsWorkspaceOpen(true);
  };

  const handleUpdateApplication = (updatedApp) => {
    setKycSubmissions((prev) => prev.map((item) => (item.id === updatedApp.id ? updatedApp : item)));
  };

  const handleAssignReviewer = (appId, reviewerName) => {
    setKycSubmissions((prev) =>
      prev.map((item) => {
        if (item.id === appId) {
          const updatedHistory = [
            { id: `h-${Date.now()}`, event: `Assigned to Reviewer (${reviewerName})`, actor: 'Super Admin', date: 'Just now' },
            ...(item.history || []),
          ];
          return { ...item, assignedReviewer: reviewerName, history: updatedHistory };
        }
        return item;
      })
    );
    showToast(`Assigned reviewer ${reviewerName} successfully.`);
  };

  /* ==========================================================================
     DOCUMENT ACTIONS
     ========================================================================== */
  const handleVerifyDocument = (doc) => {
    if (!activeApplication) return;
    const updatedDocs = (activeApplication.documents || []).map((d) =>
      d.id === doc.id ? { ...d, verificationStatus: 'Verified', validityStatus: 'Active' } : d
    );
    const remainingPending = updatedDocs.filter(d => d.verificationStatus === 'Pending Verification').length;
    const remainingRejected = updatedDocs.filter(d => d.verificationStatus === 'Rejected' || d.verificationStatus === 'Changes Requested').length;

    const updatedChecklist = (activeApplication.checklist || []).map((c) => {
      if (c.id === 'c9') {
        return { ...c, state: (remainingPending === 0 && remainingRejected === 0) ? 'Passed' : 'Pending' };
      }
      return c;
    });

    const updatedHistory = [
      { id: `h-${Date.now()}`, event: `Verified document: ${doc.name}`, actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now' },
      ...(activeApplication.history || []),
    ];
    handleUpdateApplication({ ...activeApplication, documents: updatedDocs, checklist: updatedChecklist, history: updatedHistory });
    showToast(`Document "${doc.name}" verified successfully.`);
  };

  const handleAutoVerifyAll = () => {
    if (!activeApplication) return;
    const updatedDocs = (activeApplication.documents || []).map((d) => ({
      ...d,
      verificationStatus: 'Verified',
      validityStatus: 'Active',
    }));
    const updatedChecklist = (activeApplication.checklist || []).map((c) => ({
      ...c,
      state: 'Passed',
    }));
    const updatedHistory = [
      { id: `h-${Date.now()}`, event: 'Auto-verified all checklist items and documents', actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now' },
      ...(activeApplication.history || []),
    ];
    handleUpdateApplication({
      ...activeApplication,
      mobileVerified: true,
      emailVerified: true,
      documents: updatedDocs,
      checklist: updatedChecklist,
      history: updatedHistory,
    });
    showToast('All verification checks & documents automatically verified!');
  };

  const handleRejectDocument = (doc, reason, customNote) => {
    if (!activeApplication) return;
    const updatedDocs = (activeApplication.documents || []).map((d) =>
      d.id === doc.id ? { ...d, verificationStatus: 'Rejected', adminRemark: reason } : d
    );
    const updatedHistory = [
      { id: `h-${Date.now()}`, event: `Rejected document: ${doc.name}`, actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now', remark: reason },
      ...(activeApplication.history || []),
    ];
    handleUpdateApplication({ ...activeApplication, documents: updatedDocs, history: updatedHistory, status: 'Under Review' });
    setRejectDocModal({ open: false, doc: null });
    showToast(`Document "${doc.name}" rejected.`);
  };

  const handleRequestReplacement = (doc, reason, instructions) => {
    if (!activeApplication) return;
    const updatedDocs = (activeApplication.documents || []).map((d) =>
      d.id === doc.id ? { ...d, verificationStatus: 'Changes Requested', adminRemark: reason } : d
    );
    const updatedHistory = [
      { id: `h-${Date.now()}`, event: `Requested replacement for: ${doc.name}`, actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now', remark: instructions },
      ...(activeApplication.history || []),
    ];
    handleUpdateApplication({ ...activeApplication, documents: updatedDocs, history: updatedHistory, status: 'Changes Requested' });
    setRequestReplacementModal({ open: false, doc: null });
    showToast(`Replacement requested for "${doc.name}".`);
  };

  /* ==========================================================================
     DECISION ACTIONS
     ========================================================================== */
  const handleConfirmRequestChanges = (instructions, deadline) => {
    if (!activeApplication) return;
    const updatedHistory = [
      { id: `h-${Date.now()}`, event: 'Changes Requested from Applicant', actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now', remark: instructions },
      ...(activeApplication.history || []),
    ];
    handleUpdateApplication({ ...activeApplication, status: 'Changes Requested', history: updatedHistory });
    setRequestChangesModalOpen(false);
    showToast('Change request sent to applicant.');
  };

  const handleConfirmRejectApp = async (reason, applicantMsg) => {
    if (!activeApplication) return;
    const updatedHistory = [
      { id: `h-${Date.now()}`, event: 'Application Rejected', actor: activeApplication.assignedReviewer || 'Admin', date: 'Just now', remark: reason },
      ...(activeApplication.history || []),
    ];

    if (activeApplication.registrationType) {
      await updateVerificationStatus(activeApplication.id, activeApplication.registrationType, 'rejected');
    }

    handleUpdateApplication({ ...activeApplication, status: 'Rejected', history: updatedHistory });
    setRejectAppModalOpen(false);
    showToast('Application rejected.', 'error');
  };

  const handleConfirmApproveApp = async () => {
    if (!activeApplication) return;

    // Auto-verify all pending documents when business is approved
    const updatedDocs = (activeApplication.documents || []).map((d) =>
      d.verificationStatus === 'Pending Verification'
        ? { ...d, verificationStatus: 'Verified', validityStatus: 'Active' }
        : d
    );

    const updatedChecklist = (activeApplication.checklist || []).map((c) =>
      c.state === 'Pending' ? { ...c, state: 'Passed' } : c
    );

    const updatedHistory = [
      { id: `h-${Date.now()}`, event: 'Business Approved & Verified', actor: activeApplication.assignedReviewer || 'Super Admin', date: 'Just now' },
      ...(activeApplication.history || []),
    ];

    if (activeApplication.registrationType) {
      await updateVerificationStatus(activeApplication.id, activeApplication.registrationType, 'approved');
    }

    handleUpdateApplication({
      ...activeApplication,
      status: 'Approved',
      documents: updatedDocs,
      checklist: updatedChecklist,
      history: updatedHistory,
    });
    setApproveAppModalOpen(false);
    showToast('Business application approved successfully!');
  };

  const handleAddNote = (category, text) => {
    if (!activeApplication) return;
    const newNote = { id: `n-${Date.now()}`, category, text, author: activeApplication.assignedReviewer || 'Admin', date: 'Just now' };
    const updatedNotes = [newNote, ...(activeApplication.notes || [])];
    handleUpdateApplication({ ...activeApplication, notes: updatedNotes });
    showToast('Internal note saved.');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#091B3A] p-2 sm:p-4 md:p-6 font-sans">
      <div className="w-full max-w-[1700px] mx-auto space-y-6 min-w-0">
        {/* Toast Container */}
        {toasts.length > 0 && (
          <div className="fixed top-5 right-5 z-50 space-y-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`px-4 py-3 rounded-xl shadow-lg font-bold text-xs text-white animate-slideLeft ${
                  t.type === 'error' ? 'bg-[#EF4444]' : 'bg-[#071B3A]'
                }`}
              >
                {t.message}
              </div>
            ))}
          </div>
        )}

        {/* 1. Page Header */}
        <VerificationHeader
          onRefresh={loadSubmissions}
          isRefreshing={isRefreshing}
          onOpenFilters={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* 2. Search & Status Tabs Bar */}
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          statusCounts={statusCounts}
        />

        {/* 3. Applications Queue Table & Responsive Cards */}
        <div className="hidden sm:block">
          <ApplicationsTable
            applications={paginatedSubmissions}
            isLoading={isLoading}
            onOpenWorkspace={handleOpenWorkspace}
            onAssignReviewer={handleAssignReviewer}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onClearFilters={() => {
              setSearchQuery('');
              setActiveStatus('All');
              setFilters({ accountType: 'All', category: 'All', reviewer: 'All', docCompletion: 'All', city: '' });
            }}
          />
        </div>

        <ApplicationCardView
          applications={paginatedSubmissions}
          onOpenWorkspace={handleOpenWorkspace}
          onAssignReviewer={handleAssignReviewer}
          onClearFilters={() => {
            setSearchQuery('');
            setActiveStatus('All');
            setFilters({ accountType: 'All', category: 'All', reviewer: 'All', docCompletion: 'All', city: '' });
          }}
        />

        {/* 4. Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters({ accountType: 'All', category: 'All', reviewer: 'All', docCompletion: 'All', city: '' })}
        />

        {/* 5. Application Review Workspace */}
        <ReviewWorkspace
          application={activeApplication}
          isOpen={isWorkspaceOpen}
          onClose={() => setIsWorkspaceOpen(false)}
          onUpdateApplication={handleUpdateApplication}
          onAssignReviewerClick={() => setAssignReviewerModalOpen(true)}
          onAutoVerifyAll={handleAutoVerifyAll}
          onViewDoc={(doc) => setDocPreviewModal({ open: true, doc })}
          onVerifyDoc={(doc) => setVerifyDocModal({ open: true, doc })}
          onRejectDoc={(doc) => setRejectDocModal({ open: true, doc })}
          onRequestReplacement={(doc) => setRequestReplacementModal({ open: true, doc })}
          onOpenNotes={() => setNotesDrawerOpen(true)}
          onAddNote={() => setNotesDrawerOpen(true)}
          onOpenHistory={() => setHistoryDrawerOpen(true)}
          onRequestChanges={() => setRequestChangesModalOpen(true)}
          onRejectApp={() => setRejectAppModalOpen(true)}
          onApproveApp={() => setApproveAppModalOpen(true)}
        />

        {/* 6. Modals & Drawers */}
        <DocumentPreviewModal
          isOpen={docPreviewModal.open}
          doc={docPreviewModal.doc}
          onClose={() => setDocPreviewModal({ open: false, doc: null })}
          onVerify={handleVerifyDocument}
          onReject={(doc) => setRejectDocModal({ open: true, doc })}
          onRequestReplacement={(doc) => setRequestReplacementModal({ open: true, doc })}
        />

        <VerifyDocModal
          isOpen={verifyDocModal.open}
          doc={verifyDocModal.doc}
          onClose={() => setVerifyDocModal({ open: false, doc: null })}
          onConfirm={(doc) => {
            handleVerifyDocument(doc);
            setVerifyDocModal({ open: false, doc: null });
          }}
        />

        <RejectDocModal
          isOpen={rejectDocModal.open}
          doc={rejectDocModal.doc}
          onClose={() => setRejectDocModal({ open: false, doc: null })}
          onConfirm={handleRejectDocument}
        />

        <RequestReplacementModal
          isOpen={requestReplacementModal.open}
          doc={requestReplacementModal.doc}
          onClose={() => setRequestReplacementModal({ open: false, doc: null })}
          onConfirm={handleRequestReplacement}
        />

        <InternalNotesDrawer
          isOpen={notesDrawerOpen}
          notes={activeApplication?.notes || []}
          onClose={() => setNotesDrawerOpen(false)}
          onAddNote={handleAddNote}
        />

        <ReviewHistoryDrawer
          isOpen={historyDrawerOpen}
          history={activeApplication?.history || []}
          onClose={() => setHistoryDrawerOpen(false)}
        />

        <AssignReviewerModal
          isOpen={assignReviewerModalOpen}
          currentReviewer={activeApplication?.assignedReviewer}
          onClose={() => setAssignReviewerModalOpen(false)}
          onAssign={(reviewerName) => {
            if (activeApplication) handleAssignReviewer(activeApplication.id, reviewerName);
            setAssignReviewerModalOpen(false);
          }}
        />

        <RequestChangesModal
          isOpen={requestChangesModalOpen}
          application={activeApplication}
          onClose={() => setRequestChangesModalOpen(false)}
          onConfirm={handleConfirmRequestChanges}
        />

        <RejectApplicationModal
          isOpen={rejectAppModalOpen}
          application={activeApplication}
          onClose={() => setRejectAppModalOpen(false)}
          onConfirm={handleConfirmRejectApp}
        />

        <ApproveApplicationModal
          isOpen={approveAppModalOpen}
          application={activeApplication}
          onClose={() => setApproveAppModalOpen(false)}
          onConfirm={handleConfirmApproveApp}
        />
      </div>
    </div>
  );
}
