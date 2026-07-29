import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
  useWindowDimensions,
  Alert
} from 'react-native';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Search,
  MoreVertical,
  Download,
  UploadCloud,
  File,
  X,
  ShieldAlert,
  Eye,
  RefreshCw,
  Building2,
  UserCheck,
  Award
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../../context/AuthContext';

const COLORS = {
  navy: '#071B3A',
  secondaryNavy: '#102A4C',
  gold: '#F2C230',
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E3E9F1',
  primaryText: '#091B3A',
  secondaryText: '#71829B',
  success: '#16B77A',
  successBg: '#E6F4EA',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  missing: '#64748B',
  missingBg: '#F1F5F9',
};

// ROLE-SPECIFIC KYC DOCUMENT TYPES
const GET_ROLE_DOC_TYPES = (roleKey) => {
  const common = ['PAN Card', 'Business Registration / Trade Licence', 'Business Address Proof', 'GST Certificate'];
  
  if (roleKey === 'horeca') return [...common, 'FSSAI Licence', 'Fire Safety NOC'];
  if (roleKey === 'rawMaterial') return [...common, 'FSSAI Licence', 'Warehouse / Address Proof'];
  if (roleKey === 'manpower') return [...common, 'Labour Licence'];
  if (roleKey === 'serviceProvider') return [...common, 'Trade Licence', 'Professional Certificate'];
  if (roleKey === 'marketing') return [...common, 'Portfolio / Work Sample'];
  
  return common;
};

// INITIAL KYC DOCUMENTS (Clean empty state)
const INITIAL_KYC_DOCUMENTS = [];

export default function DocumentsKycScreen({ onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const auth = useContext(AuthContext);
  const user = auth?.user || {};

  const roleKey = useMemo(() => {
    const role = user?.role || 'owner';
    const vendorType = user?.vendorType || '';
    if (role === 'owner') return 'horeca';
    if (role === 'vendor') {
      if (vendorType === 'Raw Material') return 'rawMaterial';
      if (vendorType === 'Manpower') return 'manpower';
      if (vendorType === 'Service Provider') return 'serviceProvider';
      if (vendorType === 'Marketing Agency') return 'marketing';
    }
    return 'horeca';
  }, [user]);

  const allowedDocTypes = useMemo(() => GET_ROLE_DOC_TYPES(roleKey), [roleKey]);

  // Documents state & Search/Filter
  const [documents, setDocuments] = useState(INITIAL_KYC_DOCUMENTS);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  // Modals state
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewModalDoc, setPreviewModalDoc] = useState(null);
  const [moreMenuDoc, setMoreMenuDoc] = useState(null);

  // Upload Form State
  const [uploadDocType, setUploadDocType] = useState(allowedDocTypes[0] || 'PAN Card');
  const [uploadDocNum, setUploadDocNum] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = documents.length;
    const verified = documents.filter(d => d.status === 'Verified').length;
    const pending = documents.filter(d => d.status === 'Pending').length;
    const rejected = documents.filter(d => d.status === 'Rejected').length;
    return { total, verified, pending, rejected };
  }, [documents]);

  // Filtered List
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (selectedFilter === 'Verified' && doc.status !== 'Verified') return false;
      if (selectedFilter === 'Pending' && doc.status !== 'Pending') return false;
      if (selectedFilter === 'Rejected' && doc.status !== 'Rejected') return false;
      if (selectedFilter === 'Missing' && doc.status !== 'Missing') return false;

      if (searchText.trim()) {
        const query = searchText.toLowerCase();
        return (
          doc.name.toLowerCase().includes(query) ||
          (doc.number && doc.number.toLowerCase().includes(query)) ||
          (doc.fileName && doc.fileName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [documents, selectedFilter, searchText]);

  // Handle Pick Document
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setSelectedFile({
          name: asset.name,
          size: `${(asset.size / (1024 * 1024)).toFixed(1)} MB`,
          uri: asset.uri
        });
      }
    } catch (err) {
      console.warn('Document picker error:', err);
    }
  };

  // Handle Upload Submit
  const handleUploadSubmit = () => {
    if (!selectedFile) {
      Alert.alert('File Required', 'Please select a document file to upload.');
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: uploadDocType,
        number: uploadDocNum.trim() || 'SUBMITTED',
        status: 'Pending',
        uploadedDate: 'Just now',
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        reviewerNote: 'Document submitted and queued for verification.'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsSubmitting(false);
      setUploadModalVisible(false);
      setSelectedFile(null);
      setUploadDocNum('');
      setUploadNotes('');
      Alert.alert('Document Uploaded', `${uploadDocType} has been submitted for verification.`);
    }, 600);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Verified':
        return { bg: COLORS.successBg, color: COLORS.success, icon: CheckCircle2 };
      case 'Pending':
        return { bg: COLORS.warningBg, color: COLORS.warning, icon: Clock };
      case 'Rejected':
        return { bg: COLORS.errorBg, color: COLORS.error, icon: XCircle };
      default:
        return { bg: COLORS.missingBg, color: COLORS.missing, icon: FileText };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* PAGE HEADER */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTopRow}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Go back">
                <ArrowLeft size={20} color={COLORS.navy} />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>Documents & KYC</Text>
              <Text style={styles.pageSubtitle}>View and manage your verification documents.</Text>
            </View>
            <TouchableOpacity
              style={styles.addDocHeaderBtn}
              onPress={() => setUploadModalVisible(true)}
              activeOpacity={0.8}
            >
              <Plus size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.addDocHeaderBtnText}>Add Document</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* COMPACT SUMMARY STRIP */}
          <View style={styles.summaryStrip}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{summaryMetrics.total}</Text>
              <Text style={styles.metricLabel}>Total</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.success }]}>{summaryMetrics.verified}</Text>
              <Text style={styles.metricLabel}>Verified</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.warning }]}>{summaryMetrics.pending}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.error }]}>{summaryMetrics.rejected}</Text>
              <Text style={styles.metricLabel}>Rejected</Text>
            </View>
          </View>

          {/* SEARCH & COMPACT FILTER PILLS */}
          <View style={styles.searchFilterBlock}>
            <View style={styles.searchBox}>
              <Search size={16} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search documents..."
                placeholderTextColor={COLORS.secondaryText}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <X size={16} color={COLORS.secondaryText} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
              {['All', 'Verified', 'Pending', 'Rejected', 'Missing'].map(filterKey => {
                const isActive = selectedFilter === filterKey;
                return (
                  <TouchableOpacity
                    key={filterKey}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedFilter(filterKey)}
                  >
                    <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>{filterKey}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* DOCUMENT CARDS LIST */}
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(doc => {
              const badge = getStatusBadgeStyle(doc.status);
              const BadgeIcon = badge.icon;

              return (
                <View key={doc.id} style={styles.docCard}>
                  <View style={styles.docCardHeader}>
                    <View style={styles.docIconBox}>
                      <FileText size={20} color={COLORS.navy} />
                    </View>

                    <View style={styles.docInfoCol}>
                      <Text style={styles.docNameText}>{doc.name}</Text>
                      {doc.number ? (
                        <Text style={styles.docMetaText}>Number: <Text style={{ fontWeight: '700', color: COLORS.primaryText }}>{doc.number}</Text></Text>
                      ) : null}
                      <Text style={styles.docSubMetaText}>Uploaded: {doc.uploadedDate} · {doc.fileName}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <BadgeIcon size={12} color={badge.color} style={{ marginRight: 4 }} />
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>{doc.status}</Text>
                    </View>
                  </View>

                  {/* ACTION BAR */}
                  <View style={styles.docCardFooter}>
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => {
                        if (doc.status === 'Missing' || doc.status === 'Rejected') {
                          setUploadDocType(doc.name);
                          setUploadModalVisible(true);
                        } else {
                          setPreviewModalDoc(doc);
                        }
                      }}
                    >
                      <Eye size={14} color={COLORS.navy} style={{ marginRight: 6 }} />
                      <Text style={styles.primaryActionBtnText}>
                        {doc.status === 'Verified' ? 'View Document' : doc.status === 'Pending' ? 'View Status' : doc.status === 'Rejected' ? 'Upload Corrected Document' : 'Upload Document'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.moreBtn}
                      onPress={() => setMoreMenuDoc(doc)}
                    >
                      <MoreVertical size={18} color={COLORS.secondaryText} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyStateCard}>
              <FileText size={36} color={COLORS.secondaryText} style={{ marginBottom: 10 }} />
              <Text style={styles.emptyTitle}>No documents uploaded</Text>
              <Text style={styles.emptyMessage}>Upload your business and KYC documents for verification.</Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => setUploadModalVisible(true)}
              >
                <Plus size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.emptyActionBtnText}>Add Document</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* DOCUMENT PREVIEW MODAL */}
        <Modal
          visible={Boolean(previewModalDoc)}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewModalDoc(null)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewModalDoc(null)}>
            <TouchableOpacity style={styles.previewModalCard} activeOpacity={1}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.modalTitle}>{previewModalDoc?.name}</Text>
                  <Text style={styles.modalSubtitle}>{previewModalDoc?.fileName} ({previewModalDoc?.fileSize})</Text>
                </View>
                <TouchableOpacity onPress={() => setPreviewModalDoc(null)}>
                  <X size={20} color={COLORS.secondaryText} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 320, paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
                <View style={styles.previewBox}>
                  <FileText size={48} color={COLORS.navy} style={{ marginBottom: 8 }} />
                  <Text style={styles.previewDocTitle}>{previewModalDoc?.name}</Text>
                  <Text style={styles.previewDocSub}>{previewModalDoc?.number || 'Document Preview'}</Text>
                  <View style={styles.verifiedTag}>
                    <CheckCircle2 size={14} color={COLORS.success} style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedTagText}>{previewModalDoc?.status} Document</Text>
                  </View>
                </View>

                {previewModalDoc?.reviewerNote ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteTitle}>Reviewer Note</Text>
                    <Text style={styles.noteText}>{previewModalDoc.reviewerNote}</Text>
                  </View>
                ) : null}
              </ScrollView>

              <View style={styles.previewModalFooter}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setPreviewModalDoc(null)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => {
                    Alert.alert('Download', `Downloading ${previewModalDoc?.fileName}`);
                    setPreviewModalDoc(null);
                  }}
                >
                  <Download size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.downloadBtnText}>Download</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* UPLOAD DOCUMENT MODAL */}
        <Modal
          visible={uploadModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setUploadModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setUploadModalVisible(false)}>
            <TouchableOpacity style={styles.uploadModalCard} activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload Document</Text>
                <TouchableOpacity onPress={() => setUploadModalVisible(false)}>
                  <X size={20} color={COLORS.secondaryText} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380, paddingVertical: 8 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Document Type *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
                    {allowedDocTypes.map(dt => (
                      <TouchableOpacity
                        key={dt}
                        style={[styles.typeChip, uploadDocType === dt && styles.typeChipActive]}
                        onPress={() => setUploadDocType(dt)}
                      >
                        <Text style={[styles.typeChipText, uploadDocType === dt && styles.typeChipTextActive]}>{dt}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Document Number (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. ABCDE1234F"
                    value={uploadDocNum}
                    onChangeText={setUploadDocNum}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Upload File *</Text>
                  {selectedFile ? (
                    <View style={styles.fileSelectedBox}>
                      <File size={20} color={COLORS.navy} style={{ marginRight: 10 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fileNameText} numberOfLines={1}>{selectedFile.name}</Text>
                        <Text style={styles.fileSizeText}>{selectedFile.size}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedFile(null)}>
                        <X size={18} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.uploadPickerBox} onPress={handlePickDocument}>
                      <UploadCloud size={28} color={COLORS.navy} style={{ marginBottom: 6 }} />
                      <Text style={styles.uploadPickerTitle}>Tap to select file</Text>
                      <Text style={styles.uploadPickerSub}>PDF or JPG/PNG image (Max 5MB)</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>

              <View style={styles.previewModalFooter}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setUploadModalVisible(false)}>
                  <Text style={styles.closeBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitUploadBtn} onPress={handleUploadSubmit} disabled={isSubmitting}>
                  <UploadCloud size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.submitUploadBtnText}>{isSubmitting ? 'Uploading...' : 'Upload Document'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* MORE OPTIONS SHEET */}
        <Modal
          visible={Boolean(moreMenuDoc)}
          transparent
          animationType="fade"
          onRequestClose={() => setMoreMenuDoc(null)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMoreMenuDoc(null)}>
            <View style={styles.actionSheetCard}>
              <Text style={styles.actionSheetTitle}>{moreMenuDoc?.name}</Text>
              
              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  const target = moreMenuDoc;
                  setMoreMenuDoc(null);
                  setPreviewModalDoc(target);
                }}
              >
                <Eye size={16} color={COLORS.navy} style={{ marginRight: 10 }} />
                <Text style={styles.sheetOptionText}>Preview Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  const targetName = moreMenuDoc?.fileName;
                  setMoreMenuDoc(null);
                  Alert.alert('Download', `Downloading ${targetName}`);
                }}
              >
                <Download size={16} color={COLORS.navy} style={{ marginRight: 10 }} />
                <Text style={styles.sheetOptionText}>Download File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  const target = moreMenuDoc;
                  setMoreMenuDoc(null);
                  setUploadDocType(target?.name || 'PAN Card');
                  setUploadModalVisible(true);
                }}
              >
                <RefreshCw size={16} color={COLORS.navy} style={{ marginRight: 10 }} />
                <Text style={styles.sheetOptionText}>Replace Document</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setMoreMenuDoc(null)}>
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },

  /* HEADER BLOCK */
  headerBlock: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { padding: 4 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryText },
  pageSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  addDocHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addDocHeaderBtnText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  scrollContainer: { flex: 1 },
  scrollContent: { padding: 16 },

  /* SUMMARY STRIP */
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  metricItem: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 18, fontWeight: '800', color: COLORS.primaryText },
  metricLabel: { fontSize: 11, color: COLORS.secondaryText, marginTop: 2, fontWeight: '600' },
  metricDivider: { width: 1, height: 28, backgroundColor: '#F1F5F9' },

  /* SEARCH & FILTERS */
  searchFilterBlock: { marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.primaryText },
  filterPillsRow: { gap: 8 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  filterPillText: { fontSize: 12, color: COLORS.secondaryText, fontWeight: '600' },
  filterPillTextActive: { color: '#FFFFFF', fontWeight: '700' },

  /* DOCUMENT CARDS */
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  docCardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docInfoCol: { flex: 1, marginRight: 8 },
  docNameText: { fontSize: 15, fontWeight: '800', color: COLORS.primaryText, marginBottom: 2 },
  docMetaText: { fontSize: 12, color: COLORS.secondaryText, marginBottom: 2 },
  docSubMetaText: { fontSize: 11, color: '#94A3B8' },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  docCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
  },
  primaryActionBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.navy },
  moreBtn: { padding: 8 },

  /* EMPTY STATE */
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryText, marginBottom: 4 },
  emptyMessage: { fontSize: 12, color: COLORS.secondaryText, textAlign: 'center', marginBottom: 16 },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
  },
  emptyActionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  /* MODALS */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalCard: {
    width: '92%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadModalCard: {
    width: '92%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: COLORS.primaryText },
  modalSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },

  previewBox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  previewDocTitle: { fontSize: 16, fontWeight: '800', color: COLORS.navy, marginBottom: 2 },
  previewDocSub: { fontSize: 12, color: COLORS.secondaryText, marginBottom: 10 },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  verifiedTagText: { fontSize: 11, fontWeight: '700', color: COLORS.success },

  noteBox: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', padding: 12, borderRadius: 10 },
  noteTitle: { fontSize: 11, fontWeight: '800', color: '#B45309', marginBottom: 2 },
  noteText: { fontSize: 12, color: '#92400E', lineHeight: 16 },

  previewModalFooter: { flexDirection: 'row', gap: 10, marginTop: 14 },
  closeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryText },
  downloadBtn: {
    flex: 1.3,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  submitUploadBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitUploadBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  formGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.primaryText, marginBottom: 6 },
  textInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.primaryText,
    backgroundColor: '#F8FAFD',
  },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: COLORS.border },
  typeChipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  typeChipText: { fontSize: 11, fontWeight: '600', color: COLORS.secondaryText },
  typeChipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  uploadPickerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFD',
  },
  uploadPickerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.navy, marginBottom: 2 },
  uploadPickerSub: { fontSize: 11, color: COLORS.secondaryText },
  fileSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fileNameText: { fontSize: 13, fontWeight: '700', color: COLORS.navy },
  fileSizeText: { fontSize: 11, color: COLORS.secondaryText },

  /* ACTION SHEET */
  actionSheetCard: {
    width: '92%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionSheetTitle: { fontSize: 15, fontWeight: '800', color: COLORS.primaryText, marginBottom: 14, paddingLeft: 4 },
  sheetOption: { flexDirection: 'row', alignItems: 'center', height: 44, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
  sheetOptionText: { fontSize: 13, fontWeight: '700', color: COLORS.navy },
  sheetCancelBtn: { height: 42, borderRadius: 10, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  sheetCancelText: { fontSize: 13, fontWeight: '700', color: COLORS.secondaryText },
});
