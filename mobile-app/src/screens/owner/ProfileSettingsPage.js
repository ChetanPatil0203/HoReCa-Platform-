import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions,
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  UserRound, Building2, BadgeCheck, CircleCheck, Phone, 
  Mail, MapPin, Pencil, Store, Files, FileText, ChevronRight, X,
  AlertCircle, LogOut
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const RED = '#EF4444';
const ORANGE = '#F59E0B';
const GRAY = '#64748B';
const MUTED = '#94A3B8';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F8FAFC';

export default function ProfileSettingsPage({ user }) {
  // Use 'Hotel', 'Restaurant', or 'Cafe' to test dynamic support
  const [businessType, setBusinessType] = useState('Hotel'); 
  
  const [ownerInfo, setOwnerInfo] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const businessInfo = {
    category: businessType === 'Hotel' ? 'Hospitality Business' : businessType === 'Restaurant' ? 'Food Service Business' : 'Cafe & Beverage Business',
    gst: '',
    pan: '',
    brn: '',
    accountStatus: 'Pending',
    verificationStatus: 'Pending Verification'
  };

  const getDocuments = () => {
    let docs = [
      { id: '1', name: 'FSSAI Licence', ref: 'Not Uploaded', req: 'Required', status: 'Missing' },
      { id: '2', name: 'Business Registration Proof', ref: 'Not Uploaded', req: 'Required', status: 'Missing' },
      { id: '3', name: 'Shop and Establishment Licence', ref: 'Not Uploaded', req: 'Required', status: 'Missing' },
      { id: '4', name: 'Business Address Proof', ref: 'Not Uploaded', req: 'Required', status: 'Missing' },
      { id: '5', name: 'GST Certificate', ref: 'Not Uploaded', req: 'Required if applicable', status: 'Missing' },
      { id: '6', name: 'PAN Card', ref: 'Not Uploaded', req: 'Required if applicable', status: 'Missing' },
    ];

    if (businessType === 'Hotel') {
      docs.push({ id: '7', name: 'Fire Safety Certificate / Fire NOC', ref: 'Not Uploaded', req: 'Required if applicable', status: 'Missing' });
    } else {
      docs.push({ id: '7', name: 'Local Food / Health Trade Licence', ref: 'Not Uploaded', req: 'Required if applicable', status: 'Missing' });
    }
    return docs;
  };

  const documents = getDocuments();

  // Modal states
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editBusinessModal, setEditBusinessModal] = useState(false);
  const [docDetailsModal, setDocDetailsModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Form states
  const [formOwner, setFormOwner] = useState({ ...ownerInfo });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': case 'Active': return { bg: '#D1FAE5', text: '#059669' };
      case 'Pending Verification': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Uploaded': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'Rejected': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Missing': default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleSaveProfile = () => {
    setOwnerInfo({ ...formOwner });
    setEditProfileModal(false);
  };

  // -------------------------------------------------------------
  // Render Main Sections
  // -------------------------------------------------------------

  const renderProfileCard = () => (
    <View style={styles.card}>
      <View style={styles.profileHeaderLayout}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{ownerInfo.name.split(' ').map(n => n[0]).join('')}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.ownerName}>{ownerInfo.name}</Text>
          <Text style={styles.businessName}>{ownerInfo.businessName}</Text>
          
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: '#F1F5F9' }]}>
              <Building2 size={12} color={NAVY} />
              <Text style={[styles.badgeText, { color: NAVY }]}>{businessType}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <BadgeCheck size={12} color={BLUE} />
              <Text style={[styles.badgeText, { color: BLUE }]}>Verified Business</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#D1FAE5' }]}>
              <CircleCheck size={12} color={GREEN} />
              <Text style={[styles.badgeText, { color: GREEN }]}>Active Account</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contactInfoRow}>
        <View style={styles.contactItem}>
          <Phone size={14} color={GRAY} />
          <Text style={styles.contactText}>{ownerInfo.mobile}</Text>
        </View>
        <View style={styles.contactItem}>
          <Mail size={14} color={GRAY} />
          <Text style={styles.contactText}>{ownerInfo.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <MapPin size={14} color={GRAY} />
          <Text style={styles.contactText}>{ownerInfo.location}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => { setFormOwner({...ownerInfo}); setEditProfileModal(true); }}>
        <Pencil size={16} color={NAVY} />
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBusinessInfo = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Building2 size={20} color={NAVY} />
          <Text style={styles.cardTitle}>Business Information</Text>
        </View>
        <TouchableOpacity style={styles.compactEditBtn} onPress={() => setEditBusinessModal(true)}>
          <Pencil size={14} color={NAVY} />
          {width > 340 && <Text style={styles.compactEditBtnText}>Manage</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>BUSINESS NAME</Text>
          <Text style={styles.infoValue}>{ownerInfo.businessName}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>BUSINESS TYPE</Text>
          <Text style={styles.infoValue}>{businessType}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>BUSINESS CATEGORY</Text>
          <Text style={styles.infoValue}>{businessInfo.category}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>GST NUMBER</Text>
          <Text style={styles.infoValue}>{businessInfo.gst}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>PAN NUMBER</Text>
          <Text style={styles.infoValue}>{businessInfo.pan}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>REGISTRATION NUMBER</Text>
          <Text style={styles.infoValue}>{businessInfo.brn}</Text>
        </View>
      </View>
    </View>
  );

  const renderBusinessOperations = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Store size={20} color={NAVY} />
          <View>
            <Text style={styles.cardTitle}>Business Operations</Text>
            <Text style={styles.cardSubtitle}>Details used across the HRC HUB platform</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.opGridItem}>
          <View style={styles.opIconWrap}><Building2 size={16} color={NAVY}/></View>
          <View>
            <Text style={styles.infoLabel}>Business Type</Text>
            <Text style={styles.infoValue}>{businessType}</Text>
          </View>
        </View>
        <View style={styles.opGridItem}>
          <View style={styles.opIconWrap}><MapPin size={16} color={NAVY}/></View>
          <View>
            <Text style={styles.infoLabel}>Primary Location</Text>
            <Text style={styles.infoValue}>{ownerInfo.location}</Text>
          </View>
        </View>
        <View style={styles.opGridItem}>
          <View style={styles.opIconWrap}><CircleCheck size={16} color={NAVY}/></View>
          <View>
            <Text style={styles.infoLabel}>Account Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(businessInfo.accountStatus).bg }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(businessInfo.accountStatus).text }]}>{businessInfo.accountStatus}</Text>
            </View>
          </View>
        </View>
        <View style={styles.opGridItem}>
          <View style={styles.opIconWrap}><BadgeCheck size={16} color={NAVY}/></View>
          <View>
            <Text style={styles.infoLabel}>Verification Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(businessInfo.verificationStatus).bg }]}>
              <Text style={[styles.statusBadgeText, { color: getStatusColor(businessInfo.verificationStatus).text }]}>{businessInfo.verificationStatus}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Files size={20} color={NAVY} />
          <View>
            <Text style={styles.cardTitle}>Licences & Documents</Text>
            <Text style={styles.cardSubtitle}>View and manage business verification documents</Text>
          </View>
        </View>
      </View>

      <View style={styles.docList}>
        {documents.map((doc, idx) => {
          const sCol = getStatusColor(doc.status);
          return (
            <TouchableOpacity key={doc.id} style={[styles.docRow, idx === documents.length - 1 && { borderBottomWidth: 0 }]} onPress={() => { setSelectedDoc(doc); setDocDetailsModal(true); }}>
              <View style={styles.docRowLeft}>
                <View style={styles.docIconWrap}><FileText size={18} color={NAVY} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docRef}>{doc.ref}</Text>
                  <Text style={styles.docReq}>{doc.req}</Text>
                </View>
              </View>
              <View style={styles.docRowRight}>
                <View style={[styles.statusBadge, { backgroundColor: sCol.bg, marginBottom: 4 }]}>
                  <Text style={[styles.statusBadgeText, { color: sCol.text }]}>{doc.status}</Text>
                </View>
                <ChevronRight size={16} color={GRAY} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // -------------------------------------------------------------
  // Modals
  // -------------------------------------------------------------

  const renderEditProfileModal = () => (
    <Modal visible={editProfileModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditProfileModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            
            <Text style={styles.inputLabel}>Owner Full Name</Text>
            <TextInput style={styles.input} value={formOwner.name} onChangeText={t => setFormOwner({...formOwner, name: t})} />
            
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput style={styles.input} value={formOwner.mobile} onChangeText={t => setFormOwner({...formOwner, mobile: t})} keyboardType="phone-pad" />
            
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput style={styles.input} value={formOwner.email} onChangeText={t => setFormOwner({...formOwner, email: t})} keyboardType="email-address" />
            
            <Text style={styles.inputLabel}>Business Address</Text>
            <TextInput style={styles.input} value={formOwner.address} onChangeText={t => setFormOwner({...formOwner, address: t})} />
            
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput style={styles.input} value={formOwner.city} onChangeText={t => setFormOwner({...formOwner, city: t})} />
              </View>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput style={styles.input} value={formOwner.state} onChangeText={t => setFormOwner({...formOwner, state: t})} />
              </View>
            </View>
            <View style={styles.col}>
                <Text style={styles.inputLabel}>Pincode</Text>
                <TextInput style={styles.input} value={formOwner.pincode} onChangeText={t => setFormOwner({...formOwner, pincode: t})} keyboardType="numeric" />
            </View>

          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setEditProfileModal(false)}>
              <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={handleSaveProfile}>
              <Text style={styles.btnPrimaryText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderEditBusinessModal = () => (
    <Modal visible={editBusinessModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView style={[styles.modalContainer, { maxHeight: '60%' }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage Business Information</Text>
            <TouchableOpacity onPress={() => setEditBusinessModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            
            <View style={styles.warningBox}>
              <AlertCircle size={16} color={ORANGE} style={{ marginTop: 2 }} />
              <Text style={styles.warningText}>Verification required to change core business identity information like Business Type, GST, or PAN.</Text>
            </View>

            <Text style={styles.inputLabel}>Business Name</Text>
            <TextInput style={styles.input} value={formOwner.businessName} onChangeText={t => setFormOwner({...formOwner, businessName: t})} />
            
            <Text style={styles.inputLabel}>Business Category</Text>
            <TextInput style={styles.input} value={businessInfo.category} editable={false} />
            
          </ScrollView>
          <View style={styles.modalFooterActions}>
            <TouchableOpacity style={styles.btnOutlineModal} onPress={() => setEditBusinessModal(false)}>
              <Text style={styles.btnOutlineTextBlack}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimaryModal} onPress={() => { setOwnerInfo({...formOwner}); setEditBusinessModal(false); }}>
              <Text style={styles.btnPrimaryText}>Request Update</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  const renderDocDetailsModal = () => {
    if (!selectedDoc) return null;
    const sCol = getStatusColor(selectedDoc.status);
    return (
      <Modal visible={docDetailsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 450, maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setDocDetailsModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              
              <Text style={styles.docDetailTitle}>{selectedDoc.name}</Text>
              
              <View style={styles.infoGridItem}>
                <Text style={styles.infoLabel}>REFERENCE / FILENAME</Text>
                <Text style={styles.infoValue}>{selectedDoc.ref}</Text>
              </View>
              
              <View style={styles.row}>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>REQUIREMENT</Text>
                  <Text style={styles.infoValue}>{selectedDoc.req}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>STATUS</Text>
                  <View style={[styles.statusBadge, { backgroundColor: sCol.bg, alignSelf: 'flex-start' }]}>
                    <Text style={[styles.statusBadgeText, { color: sCol.text }]}>{selectedDoc.status}</Text>
                  </View>
                </View>
              </View>

              {selectedDoc.status === 'Rejected' && (
                <View style={[styles.warningBox, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <AlertCircle size={16} color={RED} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.warningText, { color: RED, fontWeight: 'bold' }]}>Rejected</Text>
                    <Text style={[styles.warningText, { color: RED }]}>Rejection Reason: The document is unclear, incomplete, or invalid.</Text>
                  </View>
                </View>
              )}

            </ScrollView>
            <View style={[styles.modalFooterActions, { flexDirection: 'column', gap: 12 }]}>
              {selectedDoc.status !== 'Missing' && (
                <TouchableOpacity style={styles.btnOutlineModal}>
                  <Text style={styles.btnOutlineTextBlack}>Preview Document</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnPrimaryModal}>
                <Text style={styles.btnPrimaryText}>
                  {selectedDoc.status === 'Rejected' || selectedDoc.status === 'Missing' ? 'Upload New Document' : 'Replace Document'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isMobile ? (width < 340 ? 12 : 16) : 24 }]}>
        
        {/* Page Intro */}
        <View style={styles.pageIntro}>
          <View style={styles.pageIntroTitleRow}>
            <UserRound size={22} color={NAVY} />
            <Text style={styles.pageTitle}>Profile</Text>
          </View>
          <Text style={styles.pageSubtitle}>Manage your personal and business information</Text>
        </View>

        {renderProfileCard()}
        
        <View style={isMobile ? null : styles.desktopGrid}>
          <View style={isMobile ? null : styles.desktopCol}>
            {renderBusinessInfo()}
          </View>
          <View style={isMobile ? null : styles.desktopCol}>
            {renderBusinessOperations()}
          </View>
        </View>

        {renderDocuments()}

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutModal(true)}>
          <LogOut size={16} color={RED} />
          <Text style={styles.logoutBtnText}>Logout Account</Text>
        </TouchableOpacity>

      </ScrollView>

      {renderEditProfileModal()}
      {renderEditBusinessModal()}
      {renderDocDetailsModal()}
      
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxWidth: 320, padding: 24, alignItems: 'center' }]}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <LogOut size={24} color={RED} />
            </View>
            <Text style={[styles.modalTitle, { marginBottom: 8, textAlign: 'center' }]}>Logout?</Text>
            <Text style={{ fontSize: 14, color: GRAY, textAlign: 'center', marginBottom: 24 }}>Are you sure you want to logout of your account?</Text>
            
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity style={[styles.btnOutlineModal, { flex: 1 }]} onPress={() => setLogoutModal(false)}>
                <Text style={styles.btnOutlineTextBlack}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimaryModal, { backgroundColor: RED, flex: 1, borderColor: RED }]} onPress={() => setLogoutModal(false)}>
                <Text style={[styles.btnPrimaryText, { color: WHITE }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%', paddingTop: 24 },
  
  pageIntro: { marginBottom: 20 },
  pageIntroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 13, color: GRAY },

  desktopGrid: { flexDirection: 'row', gap: 20 },
  desktopCol: { flex: 1 },

  card: { backgroundColor: WHITE, borderRadius: 18, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  
  profileHeaderLayout: { flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'center', marginBottom: 20, gap: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: BLUE },
  profileInfo: { alignItems: isMobile ? 'center' : 'flex-start', flex: 1 },
  ownerName: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  businessName: { fontSize: 16, fontWeight: '500', color: NAVY, marginBottom: 12 },
  
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: isMobile ? 'center' : 'flex-start' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },

  contactInfoRow: { flexDirection: isMobile ? 'column' : 'row', gap: 12, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, justifyContent: isMobile ? 'flex-start' : 'space-between' },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactText: { fontSize: 14, color: NAVY, fontWeight: '500' },

  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12, borderRadius: 12, gap: 8 },
  editBtnText: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: GRAY },
  compactEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  compactEditBtnText: { fontSize: 12, fontWeight: 'bold', color: NAVY },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoGridItem: { width: isMobile ? '100%' : '47%', marginBottom: 8 },
  infoLabel: { fontSize: 11, color: MUTED, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 14, color: NAVY, fontWeight: '600' },

  opGridItem: { width: isMobile ? '100%' : '47%', flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  opIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },

  docList: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  docRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docRowLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  docIconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 14, fontWeight: '600', color: NAVY, marginBottom: 2 },
  docRef: { fontSize: 12, color: GRAY, marginBottom: 2 },
  docReq: { fontSize: 11, color: MUTED, fontStyle: 'italic' },
  docRowRight: { alignItems: 'flex-end', gap: 4 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContainer: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '82%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalScroll: { padding: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  modalFooterActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: WHITE, gap: 12 },
  btnOutlineModal: { paddingHorizontal: 16, height: 44, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  btnOutlineTextBlack: { color: NAVY, fontWeight: 'bold', fontSize: 14 },
  btnPrimaryModal: { paddingHorizontal: 20, height: 44, borderRadius: 10, justifyContent: 'center', backgroundColor: NAVY, flex: 1, alignItems: 'center' },
  btnPrimaryText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },
  
  warningBox: { flexDirection: 'row', backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FEF3C7', padding: 12, borderRadius: 10, gap: 8, marginBottom: 16, alignItems: 'flex-start' },
  warningText: { fontSize: 13, color: ORANGE, flex: 1 },

  docDetailTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 16 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE, borderWidth: 1, borderColor: '#FECACA', paddingVertical: 14, borderRadius: 12, gap: 8, marginTop: 12, marginBottom: 24 },
  logoutBtnText: { fontSize: 14, fontWeight: 'bold', color: RED },
});
