import React, { useState, useMemo } from 'react';
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
  SafeAreaView
} from 'react-native';
import {
  ShieldCheck,
  FilePlus2,
  MoreVertical,
  CircleCheck,
  Clock3,
  CircleX,
  FileWarning,
  TriangleAlert,
  ChevronRight,
  Search,
  FileText,
  X,
  UploadCloud,
  SlidersHorizontal,
  BellRing,
  History,
  Download
} from 'lucide-react-native';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';
const BG_COLOR = '#F8FAFC';

// =====================================
// UTILS & DATE CALCULATION
// =====================================

const WARNING_DAYS = 30;

const calculateValidity = (expiryDateStr, verification) => {
  if (verification === 'Not Uploaded') return 'Missing';
  if (!expiryDateStr) return 'Valid';

  const today = new Date();
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays <= WARNING_DAYS) return 'Expiring Soon';
  return 'Valid';
};

const getDaysRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return null;
  const today = new Date();
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// =====================================
// MOCK DATA
// =====================================

const MOCK_DOCUMENTS = [];

export default function CompliancePage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const twoColumns = width >= 768 && width <= 1150;

  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Valid, Needs Attention, Missing

  // Modals
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [renewModalVisible, setRenewModalVisible] = useState(false);
  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Derived state
  const docsWithValidity = useMemo(() => {
    return documents.map(doc => ({
      ...doc,
      validity: calculateValidity(doc.expiryDate, doc.verification)
    }));
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return docsWithValidity.filter(doc => {
      // Search
      if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !doc.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !doc.uploadedFile.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Quick filter
      if (activeFilter !== 'All') {
        if (activeFilter === 'Valid' && doc.validity !== 'Valid') return false;
        if (activeFilter === 'Missing' && doc.validity !== 'Missing') return false;
        if (activeFilter === 'Needs Attention') {
          const needsAtt = doc.validity === 'Expired' || doc.validity === 'Expiring Soon' || doc.verification === 'Pending Verification' || doc.verification === 'Rejected';
          if (!needsAtt) return false;
        }
      }
      return true;
    });
  }, [docsWithValidity, searchQuery, activeFilter]);

  // Overview Counts
  const counts = useMemo(() => {
    return {
      valid: docsWithValidity.filter(d => d.validity === 'Valid').length,
      expiring: docsWithValidity.filter(d => d.validity === 'Expiring Soon').length,
      expired: docsWithValidity.filter(d => d.validity === 'Expired').length,
      missing: docsWithValidity.filter(d => d.validity === 'Missing').length,
    };
  }, [docsWithValidity]);

  const hasIssues = counts.expired > 0 || counts.missing > 0 || counts.expiring > 0 || docsWithValidity.some(d => d.verification === 'Rejected');

  // =====================================
  // HELPERS
  // =====================================

  const openDetails = (doc) => {
    setSelectedDoc(doc);
    setDetailsModalVisible(true);
  };

  const showToast = (msg) => {
    if (Platform.OS === 'web') alert(msg);
  };

  const handleUploadSubmit = () => {
    setUploadModalVisible(false);
    showToast("Document submitted for verification.");
  };

  const handleRenewSubmit = () => {
    setRenewModalVisible(false);
    showToast("Renewed document submitted for verification.");
  };

  const handleReplaceSubmit = () => {
    setReplaceModalVisible(false);
    showToast("Corrected document submitted for verification.");
  };

  const handleActionPress = (doc) => {
    setSelectedDoc(doc);
    if (doc.validity === 'Valid') openDetails(doc);
    else if (doc.validity === 'Expiring Soon' || doc.validity === 'Expired') setRenewModalVisible(true);
    else if (doc.validity === 'Missing') setUploadModalVisible(true);
    else if (doc.verification === 'Pending Verification' || doc.verification === 'Uploaded') openDetails(doc);
    else if (doc.verification === 'Rejected') setReplaceModalVisible(true);
    else openDetails(doc);
  };

  // =====================================
  // COMPONENTS
  // =====================================

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.overviewRow}>
        <View style={styles.overviewSegment}>
          <CircleCheck size={16} color="#10B981" />
          <Text style={styles.overviewCount}>{counts.valid}</Text>
          <Text style={styles.overviewLabel}>Valid</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.overviewSegment}>
          <Clock3 size={16} color="#EA580C" />
          <Text style={styles.overviewCount}>{counts.expiring}</Text>
          <Text style={styles.overviewLabel}>Expiring</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.overviewSegment}>
          <CircleX size={16} color="#EF4444" />
          <Text style={styles.overviewCount}>{counts.expired}</Text>
          <Text style={styles.overviewLabel}>Expired</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.overviewSegment}>
          <FileWarning size={16} color="#64748B" />
          <Text style={styles.overviewCount}>{counts.missing}</Text>
          <Text style={styles.overviewLabel}>Missing</Text>
        </View>
      </View>
    </View>
  );

  const renderHealthBanner = () => {
    if (hasIssues) {
      return (
        <View style={[styles.healthBanner, styles.healthBannerDanger]}>
          <View style={styles.healthBannerLeft}>
            <TriangleAlert size={20} color="#EA580C" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.healthBannerTitle, { color: '#9A3412' }]}>Action Required</Text>
              <Text style={[styles.healthBannerSub, { color: '#C2410C' }]}>
                {counts.expired > 0 || counts.missing > 0 || counts.expiring > 0 ? (
                  `${counts.expiring > 0 ? `${counts.expiring} Expiring · ` : ''}${counts.expired > 0 ? `${counts.expired} Expired · ` : ''}${counts.missing > 0 ? `${counts.missing} Missing` : ''}`.replace(/· $/, '')
                ) : 'Documents need attention'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setActiveFilter('Needs Attention')}>
            <Text style={[styles.healthBannerAction, { color: '#9A3412' }]}>Review Documents →</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[styles.healthBanner, styles.healthBannerSafe]}>
        <View style={styles.healthBannerLeft}>
          <ShieldCheck size={20} color="#16A34A" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.healthBannerTitle, { color: '#166534' }]}>Compliance Up to Date</Text>
            <Text style={[styles.healthBannerSub, { color: '#15803D' }]} numberOfLines={1}>All mandatory documents are valid and verified.</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDocumentCard = (doc) => {
    let actionText = 'View Details';
    let validityText = '';
    const days = getDaysRemaining(doc.expiryDate);

    if (doc.validity === 'Valid' && doc.expiryDate) validityText = `Valid until ${doc.expiryDate}`;
    else if (doc.validity === 'Valid') validityText = 'Valid document';
    
    if (doc.validity === 'Expiring Soon') {
      actionText = 'Start Renewal';
      validityText = `Expires in ${days} days`;
    }
    if (doc.validity === 'Expired') {
      actionText = 'Renew Now';
      validityText = `Expired ${Math.abs(days)} days ago`;
    }
    if (doc.validity === 'Missing') {
      actionText = 'Upload Document';
      validityText = 'Document missing';
    }
    if (doc.verification === 'Rejected') {
      actionText = 'Fix Document';
      validityText = 'Correction required';
    }
    if (doc.verification === 'Pending Verification') {
      actionText = 'View Status';
      validityText = 'Submitted recently'; // Could calculate from uploadDate if needed
    }
    if (doc.verification === 'Uploaded') {
      actionText = 'View Submission';
      validityText = 'Uploaded successfully';
    }
    
    return (
      <TouchableOpacity key={doc.id} style={[styles.docCard, twoColumns && styles.docCardHalf]} onPress={() => openDetails(doc)}>
        <View style={styles.docCardMain}>
          <View style={styles.docIconContainer}>
            <FileText size={20} color={NAVY} />
          </View>
          <View style={styles.docCardContent}>
            <Text style={styles.docCardName} numberOfLines={1}>{doc.name}</Text>
            <Text style={styles.docRequirement}>{doc.requirement} · {doc.verification}</Text>
            <Text style={styles.docValidity}>{validityText}</Text>
            
            <TouchableOpacity style={styles.cardActionRow} onPress={(e) => { e.stopPropagation(); handleActionPress(doc); }}>
              <Text style={styles.cardActionText}>{actionText}</Text>
              <ChevronRight size={14} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.mainLayoutDesktop}>
          
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.pageTitle}>Compliance</Text>
              <Text style={styles.pageSubtitle}>Manage licences, renewals and document verification</Text>
            </View>
            <View style={styles.pageHeaderActions}>
              <TouchableOpacity style={styles.addBtn} onPress={() => setUploadModalVisible(true)}>
                <FilePlus2 size={16} color="#fff" />
                <Text style={styles.addBtnText}>Add Document</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitleSmall}>Compliance Status</Text>
          {renderOverview()}

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={18} color="#94A3B8" />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search documents..." 
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
              <SlidersHorizontal size={18} color={NAVY} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContainer}>
            {['All', 'Valid', 'Needs Attention', 'Missing'].map(filter => (
              <TouchableOpacity 
                key={filter}
                style={[styles.quickFilter, activeFilter === filter && styles.quickFilterActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.quickFilterText, activeFilter === filter && styles.quickFilterTextActive]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeaderFlex}>
            <Text style={styles.sectionTitle}>My Documents</Text>
            <Text style={styles.sectionSubtitle}>Business licences and verification documents</Text>
          </View>

          <View style={[styles.documentsList, twoColumns && styles.documentsListDesktop]}>
            {filteredDocs.length > 0 ? (
              filteredDocs.map(doc => renderDocumentCard(doc))
            ) : (
              <View style={styles.emptyState}>
                <ShieldCheck size={40} color="#CBD5E1" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyTitle}>No matching documents found</Text>
                <Text style={styles.emptySub}>Try changing your search or filters.</Text>
                <TouchableOpacity style={styles.emptyAction} onPress={() => { setSearchQuery(''); setActiveFilter('All'); }}>
                  <Text style={styles.emptyActionText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>

      </ScrollView>

      {/* ==============================================
          MODALS 
          ============================================== */}

      {/* 1. Document Details Modal */}
      <Modal visible={detailsModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCentered, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            
            {selectedDoc && (
              <ScrollView style={styles.modalBody}>
                
                <Text style={styles.modalDocName}>{selectedDoc.name}</Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Requirement</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.requirement}</Text>
                  </View>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Verification</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.verification}</Text>
                  </View>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Validity</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.validity}</Text>
                  </View>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Licence Number</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.licenseNumber || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Issued On</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.issueDate || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsCell}>
                    <Text style={styles.modalLabelSmall}>Valid Until</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.expiryDate || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailsCellFull}>
                    <Text style={styles.modalLabelSmall}>Uploaded File</Text>
                    <Text style={styles.modalValueStandard}>{selectedDoc.uploadedFile || 'Not uploaded'}</Text>
                  </View>
                </View>

                {selectedDoc.verification === 'Rejected' && selectedDoc.rejectionReason && (
                  <View style={styles.rejectionBox}>
                    <Text style={styles.rejectionTitle}>Rejection Reason</Text>
                    <Text style={styles.rejectionText}>{selectedDoc.rejectionReason}</Text>
                  </View>
                )}

                {selectedDoc.history.length > 0 && (
                  <View style={styles.historySection}>
                    <Text style={styles.sectionTitleSmall}>Timeline</Text>
                    {selectedDoc.history.map((hist, idx) => (
                      <View key={idx} style={styles.historyItem}>
                        <View style={styles.historyDot} />
                        <View style={styles.historyContent}>
                          <Text style={styles.historyEvent}>{hist.event}</Text>
                          <Text style={styles.historyDate}>{hist.date}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.modalActionsFlex}>
                  {selectedDoc.validity === 'Missing' ? (
                    <TouchableOpacity style={styles.primaryModalBtn} onPress={() => { setDetailsModalVisible(false); setUploadModalVisible(true); }}>
                      <Text style={styles.primaryModalBtnText}>Upload Document</Text>
                    </TouchableOpacity>
                  ) : null}

                  {selectedDoc.validity === 'Expiring Soon' || selectedDoc.validity === 'Expired' ? (
                    <TouchableOpacity style={styles.primaryModalBtn} onPress={() => { setDetailsModalVisible(false); setRenewModalVisible(true); }}>
                      <Text style={styles.primaryModalBtnText}>Start Renewal</Text>
                    </TouchableOpacity>
                  ) : null}

                  {selectedDoc.verification === 'Rejected' ? (
                    <TouchableOpacity style={styles.primaryModalBtn} onPress={() => { setDetailsModalVisible(false); setReplaceModalVisible(true); }}>
                      <Text style={styles.primaryModalBtnText}>Upload New Document</Text>
                    </TouchableOpacity>
                  ) : null}

                  {selectedDoc.uploadedFile ? (
                    <TouchableOpacity style={styles.outlineModalBtn}>
                      <Text style={styles.outlineModalBtnText}>Preview Document</Text>
                    </TouchableOpacity>
                  ) : null}
                  
                  {selectedDoc.validity === 'Valid' ? (
                    <TouchableOpacity style={styles.secondaryModalBtn} onPress={() => { setDetailsModalVisible(false); setReplaceModalVisible(true); }}>
                      <Text style={styles.secondaryModalBtnText}>Replace Document</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. Upload / Add Document Modal */}
      <Modal visible={uploadModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCentered, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Document</Text>
              <TouchableOpacity onPress={() => setUploadModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Document Type</Text>
                <TextInput style={styles.input} placeholder="e.g. FSSAI Licence" placeholderTextColor="#94A3B8" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Requirement Type</Text>
                <TextInput style={[styles.input, { backgroundColor: '#F1F5F9', color: '#64748B' }]} value="Required" editable={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Licence / Reference Number</Text>
                <TextInput style={styles.input} placeholder="Enter number" placeholderTextColor="#94A3B8" />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Issue Date</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" />
                </View>
              </View>

              <TouchableOpacity style={styles.uploadArea}>
                <UploadCloud size={28} color={NAVY} style={{ marginBottom: 8 }} />
                <Text style={styles.uploadAreaTitle}>Upload File</Text>
                <Text style={styles.uploadAreaSub}>PDF, JPG or PNG (Max 5MB)</Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline placeholder="Add notes..." placeholderTextColor="#94A3B8" />
              </View>

              <View style={styles.modalActionsFlexRow}>
                <TouchableOpacity style={styles.secondaryModalBtnFlex} onPress={() => setUploadModalVisible(false)}>
                  <Text style={styles.secondaryModalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryModalBtnFlex} onPress={handleUploadSubmit}>
                  <Text style={styles.primaryModalBtnText}>Submit for Verification</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3. Renew Document Modal */}
      <Modal visible={renewModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCentered, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Renew Document</Text>
              <TouchableOpacity onPress={() => setRenewModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedDoc && (
                <View style={styles.renewContextBox}>
                  <Text style={styles.renewContextTitle}>{selectedDoc.name}</Text>
                  <Text style={styles.renewContextSub}>Current: {selectedDoc.licenseNumber || 'N/A'}</Text>
                  <Text style={styles.renewContextSub}>Expired/Expires on: {selectedDoc.expiryDate}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Licence / Reference Number</Text>
                <TextInput style={styles.input} placeholder="Enter new number" placeholderTextColor="#94A3B8" />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>New Issue Date</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>New Expiry Date</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" />
                </View>
              </View>

              <TouchableOpacity style={styles.uploadArea}>
                <UploadCloud size={28} color={NAVY} style={{ marginBottom: 8 }} />
                <Text style={styles.uploadAreaTitle}>Upload Renewed File</Text>
                <Text style={styles.uploadAreaSub}>PDF, JPG or PNG (Max 5MB)</Text>
              </TouchableOpacity>

              <View style={styles.modalActionsFlexRow}>
                <TouchableOpacity style={styles.secondaryModalBtnFlex} onPress={() => setRenewModalVisible(false)}>
                  <Text style={styles.secondaryModalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryModalBtnFlex} onPress={handleRenewSubmit}>
                  <Text style={styles.primaryModalBtnText}>Submit Renewal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 4. Replace/Fix Document Modal */}
      <Modal visible={replaceModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCentered, { maxWidth: 500 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDoc?.verification === 'Rejected' ? 'Document Rejected' : 'Replace Document'}</Text>
              <TouchableOpacity onPress={() => setReplaceModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {selectedDoc?.verification === 'Rejected' && (
                <View style={styles.rejectionBox}>
                  <Text style={styles.rejectionTitle}>Rejection Reason</Text>
                  <Text style={styles.rejectionText}>{selectedDoc.rejectionReason}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.uploadArea}>
                <UploadCloud size={28} color={NAVY} style={{ marginBottom: 8 }} />
                <Text style={styles.uploadAreaTitle}>Upload New Document</Text>
                <Text style={styles.uploadAreaSub}>PDF, JPG or PNG (Max 5MB)</Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correction Note (Optional)</Text>
                <TextInput style={[styles.input, { height: 60, textAlignVertical: 'top' }]} multiline placeholder="Add note..." placeholderTextColor="#94A3B8" />
              </View>

              <View style={styles.modalActionsFlexRow}>
                <TouchableOpacity style={styles.secondaryModalBtnFlex} onPress={() => setReplaceModalVisible(false)}>
                  <Text style={styles.secondaryModalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryModalBtnFlex} onPress={handleReplaceSubmit}>
                  <Text style={styles.primaryModalBtnText}>Submit Corrected Document</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 5. Mobile Filter Bottom Sheet */}
      <Modal visible={filterModalVisible} transparent={true} animationType="slide">
        <View style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}>
          <View style={styles.bottomSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}><X size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Validity Status</Text>
              <View style={styles.filtersContainerBox}>
                {['Valid', 'Expiring Soon', 'Expired', 'Missing'].map(cat => (
                  <TouchableOpacity key={cat} style={styles.quickFilter}><Text style={styles.quickFilterText}>{cat}</Text></TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Verification Status</Text>
              <View style={styles.filtersContainerBox}>
                {['Verified', 'Pending Verification', 'Uploaded', 'Rejected', 'Not Uploaded'].map(cat => (
                  <TouchableOpacity key={cat} style={styles.quickFilter}><Text style={styles.quickFilterText}>{cat}</Text></TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Document Category</Text>
              <View style={styles.filtersContainerBox}>
                {['Business Registration', 'Food Safety', 'Fire & Safety', 'Tax', 'Local Authority', 'Banking', 'Other'].map(cat => (
                  <TouchableOpacity key={cat} style={styles.quickFilter}><Text style={styles.quickFilterText}>{cat}</Text></TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Requirement</Text>
              <View style={styles.filtersContainerBox}>
                {['Required', 'Optional', 'Required if applicable'].map(req => (
                  <TouchableOpacity key={req} style={styles.quickFilter}><Text style={styles.quickFilterText}>{req}</Text></TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={[styles.modalActionsFlexRow, { padding: 20, borderTopWidth: 1, borderColor: '#E2E8F0', marginTop: 0 }]}>
              <TouchableOpacity style={styles.secondaryModalBtnFlex} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.secondaryModalBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryModalBtnFlex} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.primaryModalBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: BG_COLOR },
  scrollContent: { paddingBottom: 100 },
  
  mainLayoutDesktop: { paddingHorizontal: 24, paddingVertical: 20, maxWidth: 1050, alignSelf: 'center', width: '100%' },

  // Page Header
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  pageHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 'auto' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8, height: 42 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  moreBtn: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  moreMenuDropdown: { position: 'absolute', top: 48, right: 0, backgroundColor: '#fff', borderRadius: 12, padding: 8, minWidth: 200, borderWidth: 1, borderColor: '#E2E8F0', elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 12, zIndex: 100 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
  menuItemText: { fontSize: 14, color: NAVY, fontWeight: '600' },

  // Overview Strip
  sectionTitleSmall: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  overviewContainer: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, padding: 12, elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4 },
  overviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' },
  overviewSegment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: '40%', paddingVertical: 8 },
  divider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  overviewCount: { fontSize: 16, fontWeight: '800', color: NAVY },
  overviewLabel: { fontSize: 14, fontWeight: '600', color: '#64748B' },

  // Health Banner
  healthBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 24, gap: 12 },
  healthBannerSafe: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  healthBannerDanger: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5' },
  healthBannerLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  healthBannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  healthBannerSub: { fontSize: 13, lineHeight: 20 },
  healthBannerAction: { fontSize: 14, fontWeight: '800' },

  // Section Headers
  sectionHeaderFlex: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#64748B' },

  // Search & Filters
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, height: 44, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY, outlineStyle: 'none' },
  filterBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  
  filtersScroll: { marginBottom: 24 },
  filtersContainer: { flexDirection: 'row', gap: 8, paddingRight: 24 },
  filtersContainerBox: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickFilter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  quickFilterActive: { backgroundColor: NAVY, borderColor: NAVY },
  quickFilterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  quickFilterTextActive: { color: '#fff' },

  // Document Cards
  documentsList: { gap: 12 },
  documentsListDesktop: { flexDirection: 'row', flexWrap: 'wrap' },
  docCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4, overflow: 'hidden' },
  docCardHalf: { width: '48.5%' },
  docCardMain: { padding: 14, flexDirection: 'row', alignItems: 'flex-start' },
  docIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  docCardContent: { flex: 1 },
  docCardName: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  docRequirement: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  docValidity: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 12 },
  
  cardActionRow: { flexDirection: 'row', alignItems: 'center' },
  cardActionText: { fontSize: 14, fontWeight: '800', color: NAVY, marginRight: 4 },

  // Empty State
  emptyState: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', width: '100%' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  emptyAction: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyActionText: { fontSize: 14, fontWeight: '700', color: NAVY },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContentCentered: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  bottomSheet: { width: '100%', maxHeight: '80%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalBody: { padding: 20 },
  
  modalDocName: { fontSize: 20, fontWeight: '900', color: NAVY, marginBottom: 24 },
  
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  detailsCell: { width: '45%' },
  detailsCellFull: { width: '100%' },
  modalLabelSmall: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  modalValueStandard: { fontSize: 14, fontWeight: '600', color: NAVY },

  rejectionBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#FECACA' },
  rejectionTitle: { fontSize: 14, fontWeight: '800', color: '#991B1B', marginBottom: 4 },
  rejectionText: { fontSize: 13, color: '#7F1D1D', lineHeight: 20 },

  historySection: { marginBottom: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  historyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  historyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5E1', marginTop: 4, marginRight: 12 },
  historyContent: { flex: 1 },
  historyEvent: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 2 },
  historyDate: { fontSize: 12, color: '#64748B' },

  modalActionsFlex: { gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  modalActionsFlexRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  primaryModalBtn: { backgroundColor: NAVY, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryModalBtnFlex: { flex: 1.5, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryModalBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  secondaryModalBtn: { backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryModalBtnFlex: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secondaryModalBtnText: { color: NAVY, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  outlineModalBtn: { borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  outlineModalBtnText: { color: NAVY, fontSize: 15, fontWeight: '700' },

  // Forms
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 8 },
  input: { height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 16, fontSize: 15, color: NAVY },
  uploadArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16 },
  uploadAreaTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 4 },
  uploadAreaSub: { fontSize: 13, color: '#64748B' },

  renewContextBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  renewContextTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  renewContextSub: { fontSize: 13, color: '#64748B', marginBottom: 2 }
});
