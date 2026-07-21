import React, { useState, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert
} from 'react-native';
import { 
  BadgeCheck, CircleCheck, Phone, Mail, MapPin, Pencil,
  Building2, Wrench, Settings2, Files, FileText, ChevronRight, XCircle, LogOut
} from 'lucide-react-native';

import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const LIGHT_BG = '#F8FAFC';
const WHITE = '#FFFFFF';

const MOCK_PROFILE = {
  businessName: 'ProClean Services',
  contactName: 'Rahul Patil',
  mobile: '+91 98765 43210',
  email: 'info@procleanservices.com',
  address: '123 Main Street',
  city: 'Jalgaon',
  state: 'Maharashtra',
  pincode: '425001'
};

const MOCK_SERVICES = [
  'Cleaning Services', 
  'AC Repair & Maintenance',
  'Pest Control'
];

const ALL_SERVICES = [
  'AC Repair & Maintenance', 'Electrical Services', 'Plumbing Services', 
  'Equipment Repair', 'Cleaning Services', 'Pest Control', 
  'Laundry Services', 'Fire Safety Services', 'CCTV & Security Services', 
  'Interior Maintenance'
];

const MOCK_DOCUMENTS = [
  { id: 1, name: 'GST Certificate', ref: '27ABCDE1234F1Z5', status: 'Verified' },
  { id: 2, name: 'PAN Card', ref: 'ABCDE1234F', status: 'Verified' },
  { id: 3, name: 'Business Registration', ref: 'BRN-27-00012345', status: 'Pending' },
  { id: 4, name: 'Service-Specific Licence', ref: 'Pest Control Licence', status: 'Verified' },
];

export default function ProviderProfilePage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const isTablet = width > 768;
  const modalWidth = Math.min(width * 0.9, 520);

  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [selectedServices, setSelectedServices] = useState(MOCK_SERVICES);

  // Modals
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [manageServicesVisible, setManageServicesVisible] = useState(false);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to logout?")) {
        logout();
      }
    } else {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Logout", style: "destructive", onPress: () => logout() }
        ]
      );
    }
  };

  // Form states
  const [profileForm, setProfileForm] = useState(MOCK_PROFILE);
  const [tempServices, setTempServices] = useState(MOCK_SERVICES);

  const handleEditProfile = () => {
    setProfileForm(profile);
    setEditProfileVisible(true);
  };

  const saveProfile = () => {
    setProfile(profileForm);
    setEditProfileVisible(false);
  };

  const handleManageServices = () => {
    setTempServices(selectedServices);
    setManageServicesVisible(true);
  };

  const toggleTempService = (srv) => {
    if (tempServices.includes(srv)) {
      if (tempServices.length > 1) {
        setTempServices(tempServices.filter(s => s !== srv));
      }
    } else {
      setTempServices([...tempServices, srv]);
    }
  };

  const saveServices = () => {
    setSelectedServices(tempServices);
    setManageServicesVisible(false);
  };

  const openDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentModalVisible(true);
  };

  const getDocStatusColor = (status) => {
    switch(status) {
      case 'Verified': return { bg: '#DCFCE7', text: '#15803D' };
      case 'Pending': return { bg: '#FFEDD5', text: '#C2410C' };
      case 'Rejected': return { bg: '#FEE2E2', text: '#B91C1C' };
      case 'Uploaded': return { bg: '#DBEAFE', text: '#1D4ED8' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Page Intro */}
        <View style={styles.pageIntro}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your business profile and service information</Text>
        </View>

        {/* 1. Premium Service Provider Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>PS</Text>
            </View>
            <View style={styles.profileIdentity}>
              <Text style={styles.businessName}>{profile.businessName}</Text>
              <View style={styles.badgesRow}>
                <View style={styles.verifiedBadge}>
                  <BadgeCheck size={12} color="#2563EB" />
                  <Text style={styles.verifiedText}>Verified Provider</Text>
                </View>
                <View style={styles.dotSeparator} />
                <View style={styles.activeBadge}>
                  <CircleCheck size={12} color="#16A34A" />
                  <Text style={styles.activeText}>Active Business</Text>
                </View>
              </View>
              <Text style={styles.businessType}>Service Provider</Text>
            </View>
          </View>

          <View style={styles.contactDetails}>
            <View style={styles.contactRow}>
              <Phone size={14} color="#64748B" />
              <Text style={styles.contactText}>{profile.mobile}</Text>
            </View>
            <View style={styles.contactRow}>
              <Mail size={14} color="#64748B" />
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.contactText}>{profile.city}, {profile.state}</Text>
            </View>
          </View>

          <View style={styles.profileFooter}>
            <TouchableOpacity style={styles.btnEditProfile} onPress={handleEditProfile}>
              <Pencil size={14} color={NAVY} />
              <Text style={styles.btnEditProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={isTablet ? styles.tabletGridRow : null}>
          {/* 2. Business Information */}
          <View style={[styles.sectionContainer, isTablet && { flex: 1, marginRight: 12 }]}>
            <View style={styles.sectionHeader}>
              <Building2 size={20} color={NAVY} />
              <Text style={styles.sectionTitle}>Business Information</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Business Type</Text>
                  <Text style={styles.infoValue}>Service Provider</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Business Category</Text>
                  <Text style={styles.infoValue}>Professional Services</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>GST Number</Text>
                  <Text style={styles.infoValue}>27ABCDE1234F1Z5</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>PAN Number</Text>
                  <Text style={styles.infoValue}>ABCDE1234F</Text>
                </View>
                <View style={styles.infoItemFull}>
                  <Text style={styles.infoLabel}>Registration Number</Text>
                  <Text style={styles.infoValue}>BRN-27-00012345</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Services Offered */}
          <View style={[styles.sectionContainer, isTablet && { flex: 1, marginLeft: 12 }]}>
            <View style={styles.sectionHeader}>
              <Wrench size={20} color={NAVY} />
              <View style={{flex: 1}}>
                <Text style={styles.sectionTitle}>Services Offered</Text>
                <Text style={styles.sectionSubtitle}>Professional services provided by your business</Text>
              </View>
            </View>
            <View style={styles.servicesCard}>
              <View style={styles.chipsContainer}>
                {selectedServices.map((srv, idx) => (
                  <View key={idx} style={styles.serviceChip}>
                    <Text style={styles.serviceChipText}>{srv}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.btnManageServices} onPress={handleManageServices}>
                <Settings2 size={16} color={NAVY} />
                <Text style={styles.btnManageServicesText}>Manage Services</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. Licences & Documents */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Files size={20} color={NAVY} />
            <View style={{flex: 1}}>
              <Text style={styles.sectionTitle}>Licences & Documents</Text>
              <Text style={styles.sectionSubtitle}>View and manage business verification documents</Text>
            </View>
          </View>
          <View style={styles.documentsCard}>
            {MOCK_DOCUMENTS.map((doc, idx) => {
              const statusStyle = getDocStatusColor(doc.status);
              return (
                <TouchableOpacity 
                  key={doc.id} 
                  style={[styles.documentRow, idx === MOCK_DOCUMENTS.length - 1 && styles.lastDocumentRow]}
                  onPress={() => openDocument(doc)}
                >
                  <View style={styles.docIconBox}>
                    <FileText size={20} color="#64748B" />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docRef}>{doc.ref}</Text>
                  </View>
                  <View style={styles.docStatusRight}>
                    <View style={[styles.docStatusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.docStatusText, { color: statusStyle.text }]}>{doc.status}</Text>
                    </View>
                    <ChevronRight size={16} color="#94A3B8" style={{marginLeft: 8}} />
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.btnLogoutText}>Logout</Text>
        </TouchableOpacity>
        
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} animationType="fade" transparent={true} onRequestClose={() => setEditProfileVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlayCenter}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', alignItems: 'center'}}>
              <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '82%' }]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Business Profile</Text>
                  <TouchableOpacity onPress={() => setEditProfileVisible(false)}>
                    <XCircle size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <Text style={styles.inputLabel}>Business Name</Text>
                  <TextInput style={styles.input} value={profileForm.businessName} onChangeText={t => setProfileForm({...profileForm, businessName: t})} />
                  
                  <Text style={styles.inputLabel}>Contact Person Name</Text>
                  <TextInput style={styles.input} value={profileForm.contactName} onChangeText={t => setProfileForm({...profileForm, contactName: t})} />

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <TextInput style={styles.input} keyboardType="phone-pad" value={profileForm.mobile} onChangeText={t => setProfileForm({...profileForm, mobile: t})} />
                    </View>
                  </View>
                  
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput style={styles.input} keyboardType="email-address" value={profileForm.email} onChangeText={t => setProfileForm({...profileForm, email: t})} />
                  
                  <Text style={styles.inputLabel}>Business Address</Text>
                  <TextInput style={styles.input} value={profileForm.address} onChangeText={t => setProfileForm({...profileForm, address: t})} />
                  
                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput style={styles.input} value={profileForm.city} onChangeText={t => setProfileForm({...profileForm, city: t})} />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.inputLabel}>Pincode</Text>
                      <TextInput style={styles.input} keyboardType="numeric" value={profileForm.pincode} onChangeText={t => setProfileForm({...profileForm, pincode: t})} />
                    </View>
                  </View>
                  <View style={{height: 10}}/>
                </ScrollView>
                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => setEditProfileVisible(false)}>
                    <Text style={styles.btnOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimaryGoldFull} onPress={saveProfile}>
                    <Text style={styles.btnPrimaryGoldText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Manage Services Modal */}
      <Modal visible={manageServicesVisible} animationType="fade" transparent={true} onRequestClose={() => setManageServicesVisible(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '82%' }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Manage Services</Text>
                <Text style={styles.modalSubtitle}>{tempServices.length} selected</Text>
              </View>
              <TouchableOpacity onPress={() => setManageServicesVisible(false)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.checkboxList}>
                {ALL_SERVICES.map(srv => {
                  const isSelected = tempServices.includes(srv);
                  return (
                    <TouchableOpacity 
                      key={srv} 
                      style={[styles.checkboxRow, isSelected && styles.checkboxRowActive]}
                      onPress={() => toggleTempService(srv)}
                    >
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                        {isSelected && <CircleCheck size={14} color={WHITE} />}
                      </View>
                      <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelActive]}>{srv}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={{height: 10}}/>
            </ScrollView>
            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setManageServicesVisible(false)}>
                <Text style={styles.btnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimaryGoldFull} onPress={saveServices}>
                <Text style={styles.btnPrimaryGoldText}>Save Services</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Document Details Modal */}
      <Modal visible={documentModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDocumentModalVisible(false)}>
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.centerModalContent, { width: Math.min(width * 0.9, 400) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setDocumentModalVisible(false)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedDocument && (
              <View style={styles.modalBody}>
                <View style={styles.docModalPreviewBox}>
                  <FileText size={48} color="#94A3B8" />
                  <Text style={styles.docModalPreviewText}>{selectedDocument.name}.pdf</Text>
                </View>
                
                <View style={styles.infoItemFull}>
                  <Text style={styles.infoLabel}>Document Name</Text>
                  <Text style={styles.infoValue}>{selectedDocument.name}</Text>
                </View>
                <View style={styles.infoItemFull}>
                  <Text style={styles.infoLabel}>Reference Number</Text>
                  <Text style={styles.infoValue}>{selectedDocument.ref}</Text>
                </View>
                
                <View style={styles.infoItemFull}>
                  <Text style={styles.infoLabel}>Verification Status</Text>
                  <View style={[styles.docStatusBadge, { backgroundColor: getDocStatusColor(selectedDocument.status).bg, alignSelf: 'flex-start' }]}>
                    <Text style={[styles.docStatusText, { color: getDocStatusColor(selectedDocument.status).text }]}>{selectedDocument.status}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.modalFooterActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => setDocumentModalVisible(false)}>
                <Text style={styles.btnOutlineText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimaryGoldFull}>
                <Text style={styles.btnPrimaryGoldText}>Replace File</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 110 },
  
  pageIntro: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: '#64748B' },
  
  profileCard: { backgroundColor: WHITE, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  profileTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#1D4ED8' },
  profileIdentity: { flex: 1 },
  businessName: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedText: { fontSize: 11, fontWeight: '600', color: '#2563EB', marginLeft: 4 },
  dotSeparator: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#CBD5E1', marginHorizontal: 6 },
  activeBadge: { flexDirection: 'row', alignItems: 'center' },
  activeText: { fontSize: 11, fontWeight: '600', color: '#16A34A', marginLeft: 4 },
  businessType: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  
  contactDetails: { marginBottom: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  contactText: { fontSize: 14, color: '#475569', marginLeft: 10 },
  
  profileFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, alignItems: 'flex-start' },
  btnEditProfile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnEditProfileText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  
  tabletGridRow: { flexDirection: 'row' },
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  infoCard: { backgroundColor: WHITE, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { width: '45%', marginBottom: 8 },
  infoItemFull: { width: '100%', marginBottom: 12 },
  infoLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  
  servicesCard: { backgroundColor: WHITE, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  serviceChip: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  serviceChipText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  btnManageServices: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E8EDF4' },
  btnManageServicesText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  
  documentsCard: { backgroundColor: WHITE, borderRadius: 18, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  documentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  lastDocumentRow: { borderBottomWidth: 0 },
  docIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docName: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  docRef: { fontSize: 12, color: '#64748B' },
  docStatusRight: { flexDirection: 'row', alignItems: 'center' },
  docStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  docStatusText: { fontSize: 10, fontWeight: 'bold' },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  modalSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  modalBody: { flexShrink: 1 },
  
  formRow: { flexDirection: 'row', gap: 12 },
  formCol: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  
  checkboxList: { gap: 12 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  checkboxRowActive: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkboxLabel: { fontSize: 14, color: '#475569', fontWeight: '500' },
  checkboxLabelActive: { color: NAVY, fontWeight: 'bold' },
  
  docModalPreviewBox: { backgroundColor: '#F8FAFC', borderRadius: 12, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  docModalPreviewText: { fontSize: 12, color: '#64748B', marginTop: 8, fontWeight: '500' },

  modalFooterActions: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btnOutline: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnOutlineText: { color: '#475569', fontWeight: 'bold', fontSize: 14 },
  btnPrimaryGoldFull: { flex: 1.5, height: 44, backgroundColor: GOLD, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryGoldText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },

  btnLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 30, marginTop: 8, marginBottom: 24, borderWidth: 1, borderColor: '#FCA5A5' },
  btnLogoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444', marginLeft: 8 }
});
