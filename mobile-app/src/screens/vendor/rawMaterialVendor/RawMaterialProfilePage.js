import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, Dimensions, 
  Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback 
} from 'react-native';
import { 
  BadgeCheck, CircleCheck, Phone, Mail, MapPin, Pencil, 
  Building2, Boxes, Settings2, Files, FileText, ChevronRight, XCircle, Search,
  X, Clock3, ShieldAlert, Eye, Upload, RefreshCw, LogOut
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';

const PRIMARY = '#071B3A';
const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

export default function RawMaterialProfilePage() {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const { logout } = useContext(AuthContext);

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [manageCatModal, setManageCatModal] = useState(false);
  const [docModal, setDocModal] = useState({ visible: false, doc: null });

  const [profileForm, setProfileForm] = useState({
    businessName: 'Metro Fresh',
    contactPerson: 'Rahul Sharma',
    mobileNumber: '+91 98765 43210',
    email: 'info@metrofresh.com',
    address: 'Plot 42, MIDC Phase 2',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pincode: '425001'
  });

  const [selectedCats, setSelectedCats] = useState([
    'Vegetables', 'Fruits', 'Dairy Products', 'Grocery', 'Grains and Rice', 'Oils'
  ]);

  const AVAILABLE_CATEGORIES = [
    'Vegetables', 'Fruits', 'Dairy Products', 'Grocery', 'Grains and Rice', 
    'Flour', 'Pulses', 'Oils', 'Bakery Products', 'Meat', 'Seafood'
  ];

  const DOCUMENTS = [
    { id: 1, name: 'PAN Card', ref: 'ABCDE1234F', status: 'Verified', statusColor: '#10B981', statusBg: '#F0FDF4', required: true },
    { id: 2, name: 'GST Certificate', ref: '27ABCDE1234F1Z5', status: 'Verified', statusColor: '#10B981', statusBg: '#F0FDF4', required: true },
    { id: 3, name: 'Business Registration', ref: 'BRN-27-00012345', status: 'Pending Verification', statusColor: '#F97316', statusBg: '#FFF7ED', required: true },
    { id: 4, name: 'Business Address Proof', ref: 'Uploaded Document', status: 'Uploaded', statusColor: '#3B82F6', statusBg: '#EFF6FF', required: true },
    { id: 5, name: 'FSSAI Licence', ref: 'FSSAI-11520000012345', status: 'Verified', statusColor: '#10B981', statusBg: '#F0FDF4', required: true },
    { id: 6, name: 'Bank Proof / Cancelled Cheque', ref: 'Missing', status: 'Missing', statusColor: '#64748B', statusBg: '#F1F5F9', required: true },
  ];

  const handleSaveProfile = () => {
    setEditProfileModal(false);
    alert('Supplier profile updated successfully.');
  };

  const handleSaveCategories = () => {
    if (selectedCats.length === 0) {
      alert('Please select at least one product category.');
      return;
    }
    setManageCatModal(false);
  };

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length === 1) {
        alert('Please select at least one product category.');
        return;
      }
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.maxWidthContainer}>
          
          {/* Page Intro */}
          <View style={styles.pageIntro}>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSubtitle}>Manage your supplier profile and business information</Text>
          </View>

          {/* 1. Supplier Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarInitial}>MF</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.businessName}>Metro Fresh</Text>
                <View style={styles.badgeRow}>
                  <BadgeCheck size={14} color="#10B981" />
                  <Text style={styles.badgeText}>Verified Supplier</Text>
                  <Text style={styles.dotSeparator}>·</Text>
                  <CircleCheck size={14} color="#10B981" />
                  <Text style={styles.badgeText}>Active Business</Text>
                </View>
                <Text style={styles.supplierRole}>Raw Material Supplier</Text>
              </View>
            </View>
            
            <View style={styles.contactDetailsWrapper}>
              <View style={styles.contactRow}>
                <Phone size={14} color={MUTED} style={styles.contactIcon} />
                <Text style={styles.contactText}>{profileForm.mobileNumber}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail size={14} color={MUTED} style={styles.contactIcon} />
                <Text style={styles.contactText}>{profileForm.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin size={14} color={MUTED} style={styles.contactIcon} />
                <Text style={styles.contactText}>{profileForm.city}, {profileForm.state}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={() => setEditProfileModal(true)}>
              <Pencil size={14} color={NAVY} style={{marginRight: 6}} />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={isMobile ? {} : styles.row}>
            {/* 2. Business Information */}
            <View style={[styles.section, isMobile ? {} : {flex: 1, marginRight: 12}]}>
              <View style={styles.sectionHeader}>
                <Building2 size={20} color={NAVY} style={{marginRight: 8}} />
                <Text style={styles.sectionTitle}>Business Information</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.infoGrid}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>BUSINESS TYPE</Text>
                    <Text style={styles.infoValue}>Vendor / Supplier</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>BUSINESS PILLAR</Text>
                    <Text style={styles.infoValue}>Raw Material</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>BUSINESS CATEGORY</Text>
                    <Text style={styles.infoValue}>Food & Hospitality Supplies</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>GST NUMBER</Text>
                    <Text style={styles.infoValue}>27ABCDE1234F1Z5</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>PAN NUMBER</Text>
                    <Text style={styles.infoValue}>ABCDE1234F</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>REGISTRATION NUMBER</Text>
                    <Text style={styles.infoValue}>BRN-27-00012345</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 3. Product Categories Supplied */}
            <View style={[styles.section, isMobile ? {} : {flex: 1, marginLeft: 12}]}>
              <View style={styles.sectionHeaderFlex}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Boxes size={20} color={NAVY} style={{marginRight: 8}} />
                  <View>
                    <Text style={styles.sectionTitle}>Product Categories Supplied</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.smallActionBtn} onPress={() => setManageCatModal(true)}>
                  <Settings2 size={16} color={NAVY} />
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSub}>Raw material categories offered by your business</Text>
              <View style={[styles.card, { marginTop: 12 }]}>
                <View style={styles.chipContainer}>
                  {selectedCats.map(cat => (
                    <View key={cat} style={styles.chip}>
                      <Text style={styles.chipText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* 4. Licences & Documents */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderFlex}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Files size={20} color={NAVY} style={{marginRight: 8}} />
                <View>
                  <Text style={styles.sectionTitle}>Licences & Documents</Text>
                </View>
              </View>
            </View>
            <Text style={styles.sectionSub}>View and manage supplier verification documents</Text>
            
            <View style={[styles.card, { padding: 0, marginTop: 12, overflow: 'hidden' }]}>
              {DOCUMENTS.map((doc, index) => (
                <TouchableOpacity 
                  key={doc.id} 
                  style={[styles.docRow, index === DOCUMENTS.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => setDocModal({ visible: true, doc })}
                >
                  <View style={styles.docIconBox}>
                    <FileText size={20} color={MUTED} />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docRef}>{doc.ref}</Text>
                  </View>
                  <View style={styles.docStatusRow}>
                    <View style={[styles.docBadge, { backgroundColor: doc.statusBg }]}>
                      <Text style={[styles.docBadgeText, { color: doc.statusColor }]}>{doc.status}</Text>
                    </View>
                    <ChevronRight size={18} color={MUTED} style={{marginLeft: 8}} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => {
            if (window.confirm && Platform.OS === 'web') {
               if (window.confirm("Are you sure you want to logout?")) logout();
            } else {
               logout();
            }
          }}>
            <LogOut size={20} color="#EF4444" style={{marginRight: 10}} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileModal} animationType="fade" transparent={true} onRequestClose={() => setEditProfileModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setEditProfileModal(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 520, width: '100%'}, {maxHeight: '82%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Supplier Profile</Text>
                    <TouchableOpacity onPress={() => setEditProfileModal(false)}>
                      <XCircle size={24} color={MUTED} />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    <Text style={styles.inputLabel}>Business Name</Text>
                    <TextInput style={styles.input} value={profileForm.businessName} onChangeText={t => setProfileForm({...profileForm, businessName: t})} />
                    
                    <Text style={styles.inputLabel}>Contact Person Name</Text>
                    <TextInput style={styles.input} value={profileForm.contactPerson} onChangeText={t => setProfileForm({...profileForm, contactPerson: t})} />
                    
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <TextInput style={styles.input} value={profileForm.mobileNumber} onChangeText={t => setProfileForm({...profileForm, mobileNumber: t})} keyboardType="phone-pad" />
                    
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput style={styles.input} value={profileForm.email} onChangeText={t => setProfileForm({...profileForm, email: t})} keyboardType="email-address" />
                    
                    <Text style={styles.inputLabel}>Business Address</Text>
                    <TextInput style={styles.input} value={profileForm.address} onChangeText={t => setProfileForm({...profileForm, address: t})} />
                    
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput style={styles.input} value={profileForm.city} onChangeText={t => setProfileForm({...profileForm, city: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>State</Text>
                        <TextInput style={styles.input} value={profileForm.state} onChangeText={t => setProfileForm({...profileForm, state: t})} />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>Pincode</Text>
                    <TextInput style={styles.input} value={profileForm.pincode} onChangeText={t => setProfileForm({...profileForm, pincode: t})} keyboardType="number-pad" />
                  </ScrollView>
                  
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setEditProfileModal(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalPrimary} onPress={handleSaveProfile}>
                      <Text style={styles.btnModalPrimaryText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Manage Categories Modal */}
      <Modal visible={manageCatModal} animationType="fade" transparent={true} onRequestClose={() => setManageCatModal(false)}>
        <TouchableWithoutFeedback onPress={() => setManageCatModal(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 520, width: '100%'}, {maxHeight: '82%'}]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Manage Product Categories</Text>
                  <TouchableOpacity onPress={() => setManageCatModal(false)}>
                    <XCircle size={24} color={MUTED} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalSubHeader}>
                    <Text style={styles.categoryCount}>{selectedCats.length} categories selected</Text>
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <TouchableOpacity onPress={() => setSelectedCats(AVAILABLE_CATEGORIES)}><Text style={styles.catActionText}>Select All</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setSelectedCats([])}><Text style={styles.catActionText}>Clear All</Text></TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.categoryList}>
                    {AVAILABLE_CATEGORIES.map(cat => {
                      const isSelected = selectedCats.includes(cat);
                      return (
                        <TouchableOpacity 
                          key={cat} 
                          style={[styles.catOption, isSelected && styles.catOptionSelected]}
                          onPress={() => toggleCategory(cat)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <CircleCheck size={14} color={WHITE} />}
                          </View>
                          <Text style={[styles.catOptionText, isSelected && styles.catOptionTextSelected]}>{cat}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>
                
                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnModalOutline} onPress={() => setManageCatModal(false)}>
                    <Text style={styles.btnModalOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnModalPrimary} onPress={handleSaveCategories}>
                    <Text style={styles.btnModalPrimaryText}>Save Categories</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Document Details Modal */}
      <Modal visible={docModal.visible} animationType="fade" transparent={true} onRequestClose={() => setDocModal({ visible: false, doc: null })}>
        <TouchableWithoutFeedback onPress={() => setDocModal({ visible: false, doc: null })}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 480, width: '100%'}]}>
                {docModal.doc && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Document Details</Text>
                      <TouchableOpacity style={styles.closeBtn} onPress={() => setDocModal({ visible: false, doc: null })}>
                        <X size={20} color={MUTED} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.modalBody}>
                      <View style={styles.docDetailBox}>
                        <View style={styles.docDetailIconBox}>
                          <FileText size={24} color="#3B82F6" />
                        </View>
                        <Text style={styles.docDetailTitle}>{docModal.doc.name}</Text>
                        <Text style={styles.docDetailRef}>{docModal.doc.ref}</Text>
                        <View style={[styles.docBadge, { backgroundColor: docModal.doc.statusBg, alignSelf: 'center', marginTop: 8 }]}>
                          <Text style={[styles.docBadgeText, { color: docModal.doc.statusColor }]}>{docModal.doc.status}</Text>
                        </View>
                      </View>
                      
                      {docModal.doc.status === 'Pending Verification' && (
                        <View style={styles.pendingInfoBox}>
                          <Clock3 size={16} color="#F59E0B" style={{marginRight: 8, marginTop: 2}} />
                          <View style={{flex: 1}}>
                            <Text style={styles.pendingInfoTitle}>Verification Pending</Text>
                            <Text style={styles.pendingInfoText}>Your document has been uploaded and is waiting for Super Admin approval.</Text>
                          </View>
                        </View>
                      )}
                      
                      <View style={styles.docDetailList}>
                        <View style={styles.docDetailRow}>
                          <Text style={styles.docDetailLabel}>Requirement</Text>
                          <Text style={styles.docDetailValue}>{docModal.doc.required ? 'Required' : 'Optional'}</Text>
                        </View>
                        <View style={styles.docDetailRow}>
                          <Text style={styles.docDetailLabel}>Uploaded File</Text>
                          <Text style={styles.docDetailValue}>business-registration.pdf</Text>
                        </View>
                        <View style={styles.docDetailRow}>
                          <Text style={styles.docDetailLabel}>Uploaded On</Text>
                          <Text style={styles.docDetailValue}>20 Jul 2026</Text>
                        </View>
                        <View style={[styles.docDetailRow, { borderBottomWidth: 0 }]}>
                          <Text style={styles.docDetailLabel}>File Type</Text>
                          <Text style={styles.docDetailValue}>PDF</Text>
                        </View>
                      </View>
                      
                      {docModal.doc.status === 'Rejected' && (
                        <View style={styles.rejectionBox}>
                          <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
                          <Text style={styles.rejectionText}>Document image is unclear.</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.modalFooterActionsVertical}>
                      <TouchableOpacity style={styles.btnModalPrimary}>
                        {docModal.doc.status === 'Missing' || docModal.doc.status === 'Rejected' ? <Upload size={16} color={WHITE} style={{marginRight: 6}} /> : <Eye size={16} color={WHITE} style={{marginRight: 6}} />}
                        <Text style={styles.btnModalPrimaryText}>{docModal.doc.status === 'Missing' ? 'Upload Document' : (docModal.doc.status === 'Rejected' ? 'Upload New Document' : 'Preview Document')}</Text>
                      </TouchableOpacity>
                      {docModal.doc.status !== 'Missing' && docModal.doc.status !== 'Rejected' && (
                        <TouchableOpacity style={styles.btnModalOutlineCenter}>
                          <RefreshCw size={16} color={NAVY} style={{marginRight: 6}} />
                          <Text style={styles.btnModalOutlineText}>Replace Document</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 115 }, 
  maxWidthContainer: { width: '100%', maxWidth: 1200, alignSelf: 'center' },
  
  row: { flexDirection: 'row' },
  
  pageIntro: { marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: MUTED },
  
  // Premium Profile Card
  profileCard: { backgroundColor: WHITE, borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#E6EBF2' },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarInitial: { fontSize: 24, fontWeight: 'bold', color: '#F97316' },
  profileInfo: { flex: 1 },
  businessName: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#10B981', marginLeft: 4 },
  dotSeparator: { marginHorizontal: 6, color: '#10B981', fontWeight: 'bold' },
  supplierRole: { fontSize: 13, color: MUTED, fontWeight: '500' },
  
  contactDetailsWrapper: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  contactIcon: { marginRight: 10 },
  contactText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  
  editBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E8EDF4' },
  editBtnText: { fontSize: 13, fontWeight: '600', color: NAVY },
  
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionHeaderFlex: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  sectionSub: { fontSize: 13, color: MUTED, marginBottom: 4 },
  smallActionBtn: { padding: 8, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E8EDF4' },
  
  card: { backgroundColor: WHITE, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#E6EBF2' },
  
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  infoCol: { width: '50%', marginBottom: 16, paddingRight: 8 },
  infoLabel: { fontSize: 11, color: MUTED, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { fontSize: 13, color: NAVY, fontWeight: '600' },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#BFDBFE' },
  chipText: { fontSize: 13, color: '#1E40AF', fontWeight: '500' },
  
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docInfo: { flex: 1, paddingRight: 8 },
  docName: { fontSize: 14, fontWeight: '600', color: NAVY, marginBottom: 2 },
  docRef: { fontSize: 12, color: MUTED },
  docStatusRow: { flexDirection: 'row', alignItems: 'center' },
  docBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  docBadgeText: { fontSize: 11, fontWeight: 'bold' },
  
  // Modal Standard Styles
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },
  modalFooterActions: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  modalFooterActionsVertical: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineCenter: { height: 44, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, flexDirection: 'row', backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  modalSubHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryCount: { fontSize: 13, color: MUTED, fontWeight: '500' },
  catActionText: { fontSize: 13, color: '#3B82F6', fontWeight: '600' },
  
  categoryList: { gap: 10, paddingBottom: 20 },
  catOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 14, borderRadius: 12 },
  catOptionSelected: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  catOptionText: { fontSize: 14, color: NAVY, fontWeight: '500' },
  catOptionTextSelected: { color: '#1E40AF', fontWeight: 'bold' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  
  docDetailBox: { alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 12 },
  docDetailIconBox: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#DBEAFE' },
  docDetailTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  docDetailRef: { fontSize: 13, color: MUTED },
  
  pendingInfoBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 16 },
  pendingInfoTitle: { fontSize: 13, fontWeight: 'bold', color: '#B45309', marginBottom: 2 },
  pendingInfoText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  
  docDetailList: { gap: 4 },
  docDetailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docDetailLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },
  docDetailValue: { fontSize: 13, color: NAVY, fontWeight: '600' },
  
  rejectionBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', marginTop: 16 },
  rejectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#DC2626', marginBottom: 4 },
  rejectionText: { fontSize: 13, color: '#991B1B' },
  
  logoutBtn: { flexDirection: 'row', backgroundColor: WHITE, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' },

  bottomSpacer: { height: 20 }
});
