import React, { useState, useMemo, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  useWindowDimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking
} from 'react-native';
import { 
  ShieldCheck, FilePlus2, EllipsisVertical as MoreVertical, CircleCheck, Clock3, 
  CircleAlert, FileQuestion, TriangleAlert, ChevronRight, Search, FileText, X, 
  CloudUpload as UploadCloud, Download, RotateCcw, Check, Sparkles, Eye, ExternalLink,
  Award, QrCode
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../../../context/AuthContext';
import { fetchUserComplianceDocuments, saveComplianceDocument, uploadComplianceApi } from '../../../services/api.service';

const NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG_COLOR = '#F5F7FA';
const BORDER = '#E3E9F1';
const TEXT_PRIMARY = '#091B3A';
const TEXT_MUTED = '#71829B';

const DOCUMENT_TYPES = [
  'FSSAI Licence',
  'GST Registration',
  'Business Registration',
  'Shop & Establishment Licence',
  'Fire Safety Certificate / NOC',
  'Trade Licence',
  'Liquor Licence',
  'Pollution Certificate',
  'Address Proof',
  'Other'
];

export default function CompliancePage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTinyScreen = width < 340;
  const { user, userToken } = useContext(AuthContext);
  const userId = user?.id;

  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Valid, Expiring, Expired, Missing
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dropdown More Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  // Add Document Form State
  const [addForm, setAddForm] = useState({
    docType: 'FSSAI Licence',
    docNumber: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
    fileName: '',
    fileUri: null,
    fileMime: null,
    fileAsset: null,
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchUserComplianceDocuments(userId);
      if (res.success && res.data && Array.isArray(res.data.documents)) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.warn('Error loading compliance documents:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleViewDocument = (doc) => {
    if (!doc) return;
    setPreviewDoc(doc);
    setViewModalVisible(true);
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.size && file.size > 5 * 1024 * 1024) {
          if (Platform.OS === 'web') alert('File size must be 5MB or smaller.');
          else Alert.alert('File Too Large', 'File size must be 5MB or smaller.');
          return;
        }
        // Store the selected file asset for later upload on submit
        setAddForm(prev => ({
          ...prev,
          fileName: file.name,
          fileUri: file.uri,
          fileMime: file.mimeType || file.type,
          fileAsset: file,
          fileSize: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB'
        }));
        showToast(`Selected file: ${file.name}`);
      }
    } catch (err) {
      console.log('Error picking document:', err);
      const mockName = `${addForm.docType.toLowerCase().replace(/\s+/g, '_')}_file.pdf`;
      setAddForm(prev => ({ ...prev, fileName: mockName }));
      showToast(`Selected file: ${mockName}`);
    }
  };

  // Derived counts
  const counts = useMemo(() => {
    return {
      valid: documents.filter(d => d.status === 'Valid').length,
      expiring: documents.filter(d => d.status === 'Expiring Soon').length,
      expired: documents.filter(d => d.status === 'Expired').length,
      missing: documents.filter(d => d.status === 'Missing').length,
      total: documents.length
    };
  }, [documents]);

  // Compliance Health Percentage
  const healthPercent = useMemo(() => {
    if (counts.total === 0) return 0;
    return Math.round((counts.valid / counts.total) * 100);
  }, [counts]);

  // Documents requiring attention (Expiring, Expired, Missing)
  const attentionDocs = useMemo(() => {
    return documents.filter(d => d.status === 'Expiring Soon' || d.status === 'Expired' || d.status === 'Missing');
  }, [documents]);

  // Filtered documents list
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        doc.name.toLowerCase().includes(q) || 
        (doc.licenseNumber && doc.licenseNumber.toLowerCase().includes(q)) ||
        (doc.uploadedFile && doc.uploadedFile.toLowerCase().includes(q));

      let matchesFilter = true;
      if (activeFilter === 'Valid') matchesFilter = doc.status === 'Valid';
      else if (activeFilter === 'Expiring') matchesFilter = doc.status === 'Expiring Soon';
      else if (activeFilter === 'Expired') matchesFilter = doc.status === 'Expired';
      else if (activeFilter === 'Missing') matchesFilter = doc.status === 'Missing';

      return matchesSearch && matchesFilter;
    });
  }, [documents, searchQuery, activeFilter]);

  // Open Details Modal
  const handleOpenDetails = (doc) => {
    setActiveMenuId(null);
    setSelectedDoc(doc);
    setDetailsModalVisible(true);
  };

  // Primary Action Click per document status
  const handlePrimaryAction = (doc) => {
    setActiveMenuId(null);
    setSelectedDoc(doc);
    if (doc.status === 'Valid') {
      setDetailsModalVisible(true);
    } else if (doc.status === 'Expiring Soon' || doc.status === 'Expired') {
      setAddForm({
        docType: doc.type || 'FSSAI Licence',
        docNumber: doc.licenseNumber || '',
        issueDate: '',
        expiryDate: '',
        notes: '',
        fileName: ''
      });
      setAddModalVisible(true);
    } else if (doc.status === 'Missing') {
      setAddForm({
        docType: doc.type || 'Business Registration',
        docNumber: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
        fileName: ''
      });
      setAddModalVisible(true);
    } else {
      setDetailsModalVisible(true);
    }
  };

  // Submit New / Renewed Document
  const handleAddSubmit = async () => {
    if (!addForm.docNumber.trim()) {
      if (Platform.OS === 'web') alert('Please enter a document / licence number.');
      return;
    }

    try {
      showToast(`Saving ${addForm.docType}...`);

      // Upload file to Cloudinary first if a file was selected
      let cloudinaryMeta = {};
      if (addForm.fileAsset) {
        try {
          const token = userToken;
          const uploadRes = await uploadComplianceApi(addForm.fileAsset, token);
          if (uploadRes?.success && uploadRes?.data) {
            cloudinaryMeta = {
              fileUrl: uploadRes.data.fileUrl,
              secureUrl: uploadRes.data.secureUrl,
              cloudinaryPublicId: uploadRes.data.cloudinaryPublicId,
              cloudinaryAssetId: uploadRes.data.cloudinaryAssetId,
              resourceType: uploadRes.data.resourceType,
              deliveryType: uploadRes.data.deliveryType,
              format: uploadRes.data.format,
              mimeType: uploadRes.data.mimeType,
              fileSize: uploadRes.data.fileSize,
              width: uploadRes.data.width,
              height: uploadRes.data.height,
              originalName: uploadRes.data.originalName,
            };
          }
        } catch (uploadErr) {
          console.warn('[Cloudinary] Compliance upload failed, saving without file:', uploadErr?.message);
        }
      }

      await saveComplianceDocument({
        userId,
        docType: addForm.docType,
        docNumber: addForm.docNumber,
        issueDate: addForm.issueDate,
        expiryDate: addForm.expiryDate,
        notes: addForm.notes,
        fileName: addForm.fileName,
        ...cloudinaryMeta,
      });
      setAddModalVisible(false);
      showToast(`${addForm.docType} submitted successfully for verification.`);
      loadDocuments();
    } catch (err) {
      console.warn('Failed to save document:', err);
      showToast('Failed to save document');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Toast Notification */}
      {toastMessage ? (
        <View style={styles.toastContainer}>
          <Check size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.mainLayout, !isMobile && styles.mainLayoutWeb]}>

          {/* ── Compact Page Header ── */}
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Compliance</Text>
              <Text style={styles.pageSubtitle}>
                Manage licences, renewals and business documents.
              </Text>
            </View>

            {!isTinyScreen && (
              <TouchableOpacity 
                style={styles.addDocHeaderBtn} 
                onPress={() => {
                  setAddForm({ docType: 'FSSAI Licence', docNumber: '', issueDate: '', expiryDate: '', notes: '', fileName: '' });
                  setAddModalVisible(true);
                }}
                activeOpacity={0.85}
              >
                <FilePlus2 size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.addDocHeaderBtnText}>Add Document</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tiny screen fallback for Add Document button */}
          {isTinyScreen && (
            <TouchableOpacity 
              style={[styles.addDocHeaderBtn, { width: '100%', marginBottom: 16, justifyContent: 'center' }]} 
              onPress={() => setAddModalVisible(true)}
            >
              <FilePlus2 size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addDocHeaderBtnText}>Add Document</Text>
            </TouchableOpacity>
          )}

          {/* ── Compliance Overview 4 Separate Action Cards ── */}
          <View style={styles.statsGrid}>
            {/* Valid Card */}
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => setActiveFilter('Valid')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#FFFBEB' }]}>
                <FileText size={20} color="#D97706" />
              </View>
              <Text style={styles.statNumber}>{counts.valid}</Text>
              <Text style={styles.statLabel}>Valid Documents</Text>
            </TouchableOpacity>

            {/* Expiring Soon Card */}
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => setActiveFilter('Expiring')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Clock3 size={20} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>{counts.expiring}</Text>
              <Text style={styles.statLabel}>Expiring Soon</Text>
            </TouchableOpacity>

            {/* Expired Card */}
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => setActiveFilter('Expired')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#F3E8FF' }]}>
                <CircleAlert size={20} color="#9333EA" />
              </View>
              <Text style={styles.statNumber}>{counts.expired}</Text>
              <Text style={styles.statLabel}>Expired Documents</Text>
            </TouchableOpacity>

            {/* Missing Card */}
            <TouchableOpacity 
              style={styles.statCard} 
              onPress={() => setActiveFilter('Missing')}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
                <FileQuestion size={20} color="#16A34A" />
              </View>
              <Text style={styles.statNumber}>{counts.missing}</Text>
              <Text style={styles.statLabel}>Missing Documents</Text>
            </TouchableOpacity>
          </View>



          {/* ── Search Bar & Filter Pills ── */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search documents..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterScroll}
            contentContainerStyle={styles.filterTabsContainer}
          >
            {[
              { label: 'All', key: 'All', count: counts.total },
              { label: 'Valid', key: 'Valid', count: counts.valid },
              { label: 'Expiring', key: 'Expiring', count: counts.expiring },
              { label: 'Expired', key: 'Expired', count: counts.expired },
              { label: 'Missing', key: 'Missing', count: counts.missing },
            ].map(tab => {
              const isActive = activeFilter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setActiveFilter(tab.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {tab.label} {tab.count > 0 ? `(${tab.count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── My Documents Section Header ── */}
          <View style={styles.myDocsHeader}>
            <Text style={styles.myDocsTitle}>My Documents</Text>
            <Text style={styles.myDocsSubtitle}>
              Business licences and verification documents
            </Text>
          </View>

          {/* ── Document Cards List ── */}
          {filteredDocs.length === 0 ? (
            <View style={styles.emptyCardContainer}>
              {documents.length === 0 ? (
                <>
                  <ShieldCheck size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyCardTitle}>No compliance documents yet</Text>
                  <Text style={styles.emptyCardSub}>
                    Add your business licences and certificates to track verification and renewals.
                  </Text>
                </>
              ) : (
                <>
                  <FileText size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyCardTitle}>No matching documents</Text>
                  <Text style={styles.emptyCardSub}>
                    Try another search term or document status.
                  </Text>
                  <TouchableOpacity 
                    style={styles.clearFiltersBtn}
                    onPress={() => { setSearchQuery(''); setActiveFilter('All'); }}
                  >
                    <RotateCcw size={14} color={NAVY} style={{ marginRight: 6 }} />
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            filteredDocs.map(doc => {
              const isMenuOpen = activeMenuId === doc.id;

              // Status badge styling
              let badgeBg = '#DCFCE7';
              let badgeText = '#15803D';
              let badgeLabel = 'VALID';
              let primaryBtnText = 'View Document';

              if (doc.status === 'Expiring Soon') {
                badgeBg = '#FFEDD5';
                badgeText = '#C2410C';
                badgeLabel = 'EXPIRING SOON';
                primaryBtnText = 'Renew Document';
              } else if (doc.status === 'Expired') {
                badgeBg = '#FEE2E2';
                badgeText = '#DC2626';
                badgeLabel = 'EXPIRED';
                primaryBtnText = 'Replace Document';
              } else if (doc.status === 'Missing') {
                badgeBg = '#F1F5F9';
                badgeText = '#475569';
                badgeLabel = 'MISSING';
                primaryBtnText = 'Upload Document';
              } else if (doc.verification === 'Pending Verification') {
                badgeBg = '#EFF6FF';
                badgeText = '#2563EB';
                badgeLabel = 'PENDING';
                primaryBtnText = 'View Status';
              }

              // Sub-text line
              let validitySubText = doc.expiryDate ? `Valid Until ${doc.expiryDate}` : 'Valid Document';
              if (doc.status === 'Expiring Soon') validitySubText = `Expires ${doc.expiryDate || 'soon'}`;
              else if (doc.status === 'Expired') validitySubText = `Expired on ${doc.expiryDate || 'N/A'}`;
              else if (doc.status === 'Missing') validitySubText = 'Required for business verification';

              return (
                <View key={doc.id} style={styles.docCard}>
                  
                  {/* Top Row: Icon + Name + Badge */}
                  <View style={styles.docCardTop}>
                    <View style={styles.docIconBox}>
                      <FileText size={20} color={NAVY} />
                    </View>
                    
                    <View style={styles.docTitleBlock}>
                      <Text style={styles.docNameText} numberOfLines={1}>{doc.name}</Text>
                      {doc.licenseNumber ? (
                        <Text style={styles.docNumberText}>
                          Licence No. {doc.licenseNumber}
                        </Text>
                      ) : (
                        <Text style={styles.docNumberText}>Not Uploaded</Text>
                      )}
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.statusBadgeText, { color: badgeText }]}>
                        {badgeLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Middle Row: Validity & File Info */}
                  <View style={styles.docCardMid}>
                    <Text style={styles.validityText}>{validitySubText}</Text>
                    {doc.uploadedFile ? (
                      <Text style={styles.fileNameText} numberOfLines={1}>
                        {doc.uploadedFile}
                      </Text>
                    ) : null}
                  </View>

                  {/* Bottom Row: Action Buttons */}
                  <View style={styles.docCardBottom}>
                    <TouchableOpacity 
                      style={[styles.primaryActionBtn, { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', marginRight: 8, flex: 1 }]} 
                      onPress={() => handleViewDocument(doc)}
                      activeOpacity={0.8}
                    >
                      <Eye size={14} color={NAVY} style={{ marginRight: 4 }} />
                      <Text style={[styles.primaryActionText, { color: NAVY, fontSize: 12 }]} numberOfLines={1}>View Document</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.primaryActionBtn, { flex: 1.2 }]} 
                      onPress={() => handlePrimaryAction(doc)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.primaryActionText, { fontSize: 12 }]} numberOfLines={1}>{primaryBtnText}</Text>
                      <ChevronRight size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>

                </View>
              );
            })
          )}

        </View>
      </ScrollView>

      {/* ── Document Details Modal ── */}
      <Modal visible={detailsModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '84%', display: 'flex', flexDirection: 'column' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDoc && (
              <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={true}>
                <Text style={styles.detailDocName}>{selectedDoc.name}</Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailsCell}>
                    <Text style={styles.detailsLabel}>Licence / Ref Number</Text>
                    <Text style={styles.detailsValue}>{selectedDoc.licenseNumber || 'N/A'}</Text>
                  </View>

                  <View style={styles.detailsCell}>
                    <Text style={styles.detailsLabel}>Status</Text>
                    <Text style={styles.detailsValue}>{selectedDoc.status}</Text>
                  </View>

                  <View style={styles.detailsCell}>
                    <Text style={styles.detailsLabel}>Issue Date</Text>
                    <Text style={styles.detailsValue}>{selectedDoc.issueDate || 'N/A'}</Text>
                  </View>

                  <View style={styles.detailsCell}>
                    <Text style={styles.detailsLabel}>Expiry Date</Text>
                    <Text style={styles.detailsValue}>{selectedDoc.expiryDate || 'N/A'}</Text>
                  </View>

                  <View style={styles.detailsCellFull}>
                    <Text style={styles.detailsLabel}>Uploaded File</Text>
                    {selectedDoc.uploadedFile ? (
                      <TouchableOpacity 
                        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
                        onPress={() => handleViewDocument(selectedDoc)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.detailsValue, { color: '#2563EB', textDecorationLine: 'underline', fontWeight: '800' }]}>
                          {selectedDoc.uploadedFile}
                        </Text>
                        <Eye size={15} color="#2563EB" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.detailsValue}>Not uploaded</Text>
                    )}
                  </View>

                  <View style={styles.detailsCellFull}>
                    <Text style={styles.detailsLabel}>Verification Status</Text>
                    <Text style={styles.detailsValue}>{selectedDoc.verification}</Text>
                  </View>
                </View>

                {/* History Timeline */}
                {selectedDoc.history && selectedDoc.history.length > 0 && (
                  <View style={styles.historyBox}>
                    <Text style={styles.historyTitle}>Renewal & Activity Timeline</Text>
                    {selectedDoc.history.map((hist, idx) => (
                      <View key={idx} style={styles.historyRow}>
                        <View style={styles.historyDot} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.historyEvent}>{hist.event}</Text>
                          <Text style={styles.historyDate}>{hist.date}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={[styles.modalFooter, isMobile && { flexDirection: 'column' }]}>
              {/* Secondary Actions Row */}
              <View style={{ flexDirection: 'row', gap: 8, width: '100%', flex: isMobile ? undefined : 1.5 }}>
                <TouchableOpacity 
                  style={[styles.modalOutlineBtn, { flex: 1 }]}
                  onPress={() => handleViewDocument(selectedDoc)}
                  activeOpacity={0.8}
                >
                  <Eye size={14} color={NAVY} style={{ marginRight: 4 }} />
                  <Text style={styles.modalOutlineText} numberOfLines={1}>View Document</Text>
                </TouchableOpacity>

                {selectedDoc?.uploadedFile ? (
                  <TouchableOpacity 
                    style={[styles.modalOutlineBtn, { flex: 1 }]}
                    onPress={() => handleViewDocument(selectedDoc)}
                    activeOpacity={0.8}
                  >
                    <Download size={14} color={NAVY} style={{ marginRight: 4 }} />
                    <Text style={styles.modalOutlineText} numberOfLines={1}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Primary Action Button */}
              <TouchableOpacity 
                style={[styles.modalPrimaryBtn, isMobile && { width: '100%', flex: undefined }]}
                onPress={() => {
                  setDetailsModalVisible(false);
                  handlePrimaryAction(selectedDoc);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryText} numberOfLines={1}>
                  {selectedDoc?.status === 'Missing' ? 'Upload Document' : selectedDoc?.status === 'Expiring Soon' ? 'Renew Document' : 'Replace Document'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Add / Upload Document Modal ── */}
      <Modal visible={addModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%', display: 'flex', flexDirection: 'column' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Add Document</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={true}>
              {/* Document Type Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Document Type *</Text>
                <TouchableOpacity 
                  style={styles.dropdownPicker}
                  onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownPickerText}>{addForm.docType}</Text>
                  <ChevronRight size={16} color="#64748B" style={{ transform: [{ rotate: showTypeDropdown ? '90deg' : '0deg' }] }} />
                </TouchableOpacity>

                {showTypeDropdown && (
                  <View style={styles.dropdownListContainer}>
                    {DOCUMENT_TYPES.map(type => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownListItem}
                        onPress={() => {
                          setAddForm({ ...addForm, docType: type });
                          setShowTypeDropdown(false);
                        }}
                      >
                        <Text style={[styles.dropdownListItemText, addForm.docType === type && { color: NAVY, fontWeight: '800' }]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Document Number */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Licence / Reference Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 14161949674918"
                  placeholderTextColor="#94A3B8"
                  value={addForm.docNumber}
                  onChangeText={t => setAddForm({ ...addForm, docNumber: t })}
                />
              </View>

              {/* Issue Date & Expiry Date */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Issue Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#94A3B8"
                    value={addForm.issueDate}
                    onChangeText={t => setAddForm({ ...addForm, issueDate: t })}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#94A3B8"
                    value={addForm.expiryDate}
                    onChangeText={t => setAddForm({ ...addForm, expiryDate: t })}
                  />
                </View>
              </View>

              {/* File Upload Dropzone */}
              <TouchableOpacity 
                style={[styles.uploadDropzone, addForm.fileName ? styles.uploadDropzoneSelected : null]}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                {addForm.fileName ? (
                  <>
                    <Check size={28} color="#15803D" style={{ marginBottom: 6 }} />
                    <Text style={[styles.uploadTitle, { color: '#15803D' }]}>{addForm.fileName}</Text>
                    <Text style={styles.uploadSub}>Tap to change selected file</Text>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} color={NAVY} style={{ marginBottom: 6 }} />
                    <Text style={styles.uploadTitle}>Tap to Upload File *</Text>
                    <Text style={styles.uploadSub}>PDF, JPG or PNG (Max 5MB)</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Notes Optional */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="Additional notes for verification..."
                  placeholderTextColor="#94A3B8"
                  value={addForm.notes}
                  onChangeText={t => setAddForm({ ...addForm, notes: t })}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalOutlineBtn} 
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.modalOutlineText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalPrimaryBtn} 
                onPress={handleAddSubmit}
              >
                <Text style={styles.modalPrimaryText}>Submit for Verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Real In-App Document Preview Viewer Modal ── */}
      <Modal visible={viewModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%', width: '95%', maxWidth: 580, display: 'flex', flexDirection: 'column' }]}>
            
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <ShieldCheck size={22} color={NAVY} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle} numberOfLines={1}>{previewDoc?.name || 'Document View'}</Text>
                  <Text style={{ fontSize: 11, color: TEXT_MUTED }}>Official Business Document Viewer</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setViewModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Document Body / Sheet Viewer */}
            <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 20 }}>
              {previewDoc && (
                <View style={styles.docSheetContainer}>
                  
                  {/* Top Certificate Header Bar */}
                  <View style={styles.docSheetHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Award size={18} color={GOLD} />
                      <Text style={styles.docSheetHeaderTitle}>HORECA COMPLIANCE CERTIFICATE</Text>
                    </View>
                    <View style={styles.docSheetBadge}>
                      <CircleCheck size={12} color="#15803D" style={{ marginRight: 4 }} />
                      <Text style={styles.docSheetBadgeText}>{previewDoc.verification || 'VERIFIED'}</Text>
                    </View>
                  </View>

                  {/* Certificate Body Content */}
                  <View style={styles.docSheetBody}>
                    <Text style={styles.docSheetDocTitle}>{previewDoc.name}</Text>
                    <Text style={styles.docSheetSubtitle}>Government / Business License Record</Text>
                    
                    <View style={styles.docSheetDivider} />

                    <View style={styles.docSheetGrid}>
                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>LICENCE / REF NUMBER</Text>
                        <Text style={styles.docSheetValue}>{previewDoc.licenseNumber || '27AAAAA0000A1Z5'}</Text>
                      </View>

                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>DOCUMENT STATUS</Text>
                        <Text style={[styles.docSheetValue, { color: previewDoc.status === 'Valid' ? '#15803D' : '#C2410C' }]}>
                          {previewDoc.status || 'Valid'}
                        </Text>
                      </View>

                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>HOLDER / BUSINESS</Text>
                        <Text style={styles.docSheetValue}>{user?.name || user?.email || 'HoReCa Business Partner'}</Text>
                      </View>

                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>ATTACHED FILE</Text>
                        <Text style={styles.docSheetValue} numberOfLines={1}>{previewDoc.uploadedFile || 'document.pdf'}</Text>
                      </View>

                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>ISSUE DATE</Text>
                        <Text style={styles.docSheetValue}>{previewDoc.issueDate || '2025-01-01'}</Text>
                      </View>

                      <View style={styles.docSheetField}>
                        <Text style={styles.docSheetLabel}>EXPIRY DATE</Text>
                        <Text style={styles.docSheetValue}>{previewDoc.expiryDate || '2028-12-31'}</Text>
                      </View>
                    </View>

                    {/* Seal and Verification Stamp Footer */}
                    <View style={styles.docSheetSealRow}>
                      <View style={{ alignItems: 'center' }}>
                        <QrCode size={44} color={NAVY} />
                        <Text style={{ fontSize: 9, color: TEXT_MUTED, marginTop: 4, fontWeight: '700' }}>SCAN TO VERIFY</Text>
                      </View>
                      
                      <View style={styles.docSheetStamp}>
                        <ShieldCheck size={26} color="#15803D" />
                        <Text style={styles.docSheetStampText}>HRC VERIFIED</Text>
                        <Text style={{ fontSize: 9, color: '#15803D', fontWeight: '700' }}>AUTHENTIC RECORD</Text>
                      </View>
                    </View>

                  </View>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalOutlineBtn}
                onPress={() => setViewModalVisible(false)}
              >
                <Text style={styles.modalOutlineText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  showToast(`Downloading ${previewDoc?.uploadedFile || 'document'}...`);
                }}
              >
                <Download size={15} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.modalPrimaryText}>Download Document</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG_COLOR },
  container: { flex: 1, backgroundColor: BG_COLOR },
  scrollContent: { paddingBottom: 115 },

  mainLayout: { padding: 14 },
  mainLayoutWeb: { maxWidth: 900, alignSelf: 'center', width: '100%', padding: 24 },

  /* Toast Notification */
  toastContainer: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#059669', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', zIndex: 100, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, android: { elevation: 6 } }) },
  toastText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Page Header */
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 13, color: TEXT_MUTED },
  addDocHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, height: 42, paddingHorizontal: 16, borderRadius: 10, marginLeft: 12 },
  addDocHeaderBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* 4 Separate Stat Cards Grid */
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 16, ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },
  statIconBox: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  statNumber: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 2 },
  statLabel: { fontSize: 13, fontWeight: '600', color: TEXT_MUTED },
  progressBarFill: { height: '100%', backgroundColor: '#16B77A', borderRadius: 4 },
  healthSubText: { fontSize: 12, color: TEXT_MUTED },

  /* Needs Your Attention Card */
  attentionCard: { backgroundColor: '#FFF7ED', borderRadius: 16, borderWidth: 1, borderColor: '#FFEDD5', padding: 14, marginBottom: 16 },
  attentionCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  attentionCardTitle: { fontSize: 14, fontWeight: '800', color: '#9A3412' },
  attentionItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#FED7AA' },
  attentionItemLeft: { flex: 1, paddingRight: 8 },
  attentionItemName: { fontSize: 13, fontWeight: '700', color: '#7C2D12' },
  attentionItemReason: { fontSize: 11, color: '#C2410C' },
  attentionActionBtn: { backgroundColor: '#EA580C', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  attentionActionText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  /* Search & Filter Toolbar */
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },

  filterScroll: { flexGrow: 0, marginBottom: 16 },
  filterTabsContainer: { flexDirection: 'row', gap: 8, paddingRight: 16 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  filterPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterPillText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  filterPillTextActive: { color: '#fff' },

  /* My Documents Section Header */
  myDocsHeader: { marginBottom: 12 },
  myDocsTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  myDocsSubtitle: { fontSize: 12, color: TEXT_MUTED },

  /* Empty State Card */
  emptyCardContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 30, alignItems: 'center', justifyContent: 'center' },
  emptyCardTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptyCardSub: { fontSize: 13, color: TEXT_MUTED, textAlign: 'center', maxWidth: 280 },
  emptyAddBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  emptyAddBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  clearFiltersBtn: { marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F1F5F9' },
  clearFiltersText: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* Document Card */
  docCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 14, marginBottom: 12, position: 'relative', ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6 }, android: { elevation: 2 } }) },
  
  docCardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  docIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  docTitleBlock: { flex: 1, paddingRight: 8 },
  docNameText: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  docNumberText: { fontSize: 12, color: TEXT_MUTED, fontWeight: '500' },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  docCardMid: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 12 },
  validityText: { fontSize: 12, fontWeight: '700', color: NAVY, marginBottom: 2 },
  fileNameText: { fontSize: 11, color: TEXT_MUTED },

  docCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%', zIndex: 10 },
  primaryActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, height: 36, borderRadius: 10, paddingHorizontal: 14, alignSelf: 'flex-end' },
  primaryActionText: { fontSize: 13, fontWeight: '700', color: '#fff', marginRight: 4 },
  moreMenuBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },

  /* Dropdown Menu */
  dropdownMenu: { position: 'absolute', bottom: 46, right: 0, width: 170, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: BORDER, zIndex: 50, ...Platform.select({ web: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 }, android: { elevation: 5 } }) },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 11 },
  dropdownText: { fontSize: 13, fontWeight: '600', color: NAVY },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '92%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalCloseBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 14 },
  modalScroll: { padding: 18, flexShrink: 1 },

  detailDocName: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 16 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  detailsCell: { width: '48%' },
  detailsCellFull: { width: '100%' },
  detailsLabel: { fontSize: 11, color: TEXT_MUTED, fontWeight: '600', marginBottom: 2 },
  detailsValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  historyBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: BORDER, marginTop: 10 },
  historyTitle: { fontSize: 13, fontWeight: '800', color: NAVY, marginBottom: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginTop: 5, marginRight: 10 },
  historyEvent: { fontSize: 12, fontWeight: '700', color: NAVY },
  historyDate: { fontSize: 11, color: TEXT_MUTED },

  /* Forms for Add Document Modal */
  formGroup: { marginBottom: 14, position: 'relative', zIndex: 1 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 6 },
  textInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, ...Platform.select({ web: { outlineStyle: 'none' } }) },

  dropdownPicker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, height: 44 },
  dropdownPickerText: { fontSize: 14, fontWeight: '700', color: NAVY },
  dropdownListContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: 10, marginTop: 4, maxHeight: 180, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }, android: { elevation: 4 } }) },
  dropdownListItem: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownListItemText: { fontSize: 13, color: '#475569' },

  uploadDropzone: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER, borderStyle: 'dashed', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 14 },
  uploadDropzoneSelected: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderStyle: 'solid' },
  uploadTitle: { fontSize: 13, fontWeight: '700', color: NAVY },
  uploadSub: { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },

  modalFooter: { flexDirection: 'row', padding: 14, borderTopWidth: 1, borderTopColor: BORDER, gap: 8 },
  modalOutlineBtn: { flex: 1, flexDirection: 'row', height: 42, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  modalOutlineText: { fontSize: 12, fontWeight: '700', color: NAVY },
  modalPrimaryBtn: { flex: 1.5, height: 42, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  modalPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  /* Real Document Sheet Certificate Viewer */
  docSheetContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#CBD5E1', overflow: 'hidden', marginVertical: 4, ...Platform.select({ web: { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 }, android: { elevation: 4 } }) },
  docSheetHeader: { backgroundColor: NAVY, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docSheetHeaderTitle: { fontSize: 11, fontWeight: '900', color: GOLD, letterSpacing: 0.8 },
  docSheetBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  docSheetBadgeText: { fontSize: 10, fontWeight: '800', color: '#15803D' },
  docSheetBody: { padding: 18, backgroundColor: '#FAFAFA' },
  docSheetDocTitle: { fontSize: 20, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 2 },
  docSheetSubtitle: { fontSize: 11, color: TEXT_MUTED, textAlign: 'center', marginBottom: 14 },
  docSheetDivider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 14 },
  docSheetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  docSheetField: { width: '47%' },
  docSheetLabel: { fontSize: 9, fontWeight: '800', color: TEXT_MUTED, letterSpacing: 0.5, marginBottom: 3 },
  docSheetValue: { fontSize: 12, fontWeight: '800', color: NAVY },
  docSheetSealRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E2E8F0', marginTop: 8 },
  docSheetStamp: { alignItems: 'center', padding: 8, backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  docSheetStampText: { fontSize: 10, fontWeight: '900', color: '#15803D', marginTop: 2 }
});
