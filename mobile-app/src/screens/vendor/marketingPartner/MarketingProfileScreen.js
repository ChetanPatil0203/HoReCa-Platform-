import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert } from 'react-native';
import { 
  BadgeCheck, CircleCheck, Phone, Mail, MapPin, Pencil, Building2, Megaphone, Settings2, 
  Images, FileText, ChevronRight, XCircle, UploadCloud, FileImage, FolderPlus, HelpCircle, LogOut
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#071B3A';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const AVAILABLE_SERVICES = [
  "Social Media Marketing", "Graphic Design", "Photography", "Videography", 
  "Website Development", "Branding", "Printing Services", "Influencer Marketing", 
  "Digital Advertising", "Content Creation"
];



const MOCK_DOCUMENTS = [
  { id: 'DOC-1', name: 'GST Certificate', ref: '27ABCDE1234F1Z5', status: 'Verified', filename: 'gst_cert.pdf', required: true },
  { id: 'DOC-2', name: 'PAN Card', ref: 'ABCDE1234F', status: 'Verified', filename: 'pan_card.pdf', required: true },
  { id: 'DOC-3', name: 'Business Registration Proof', ref: 'BRN-27-00012345', status: 'Pending Verification', filename: 'registration.pdf', required: true },
  { id: 'DOC-4', name: 'Agency Portfolio', ref: '', status: 'Uploaded', filename: 'brandcraft-portfolio.pdf', required: false },
  { id: 'DOC-5', name: 'Company Profile', ref: '', status: 'Missing', filename: '', required: false }
];

export default function MarketingProfileScreen({ setActivePage }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { logout } = useContext(AuthContext);

  // State
  const [profileData, setProfileData] = useState({
    name: 'BrandCraft Agency',
    contactPerson: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    email: 'hello@brandcraftagency.com',
    address: '123 Creative Hub',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pincode: '425001'
  });
  
  const [selectedServices, setSelectedServices] = useState([
    "Social Media Marketing", "Graphic Design", "Content Creation", "Photography"
  ]);

  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  // Modals
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({...profileData});

  const [manageServicesVisible, setManageServicesVisible] = useState(false);
  const [tempServices, setTempServices] = useState([...selectedServices]);



  const [docDetailsVisible, setDocDetailsVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleEditProfileSave = () => {
    setProfileData(editProfileForm);
    setEditProfileVisible(false);
  };

  const handleServiceToggle = (service) => {
    if (tempServices.includes(service)) {
      // simulate dependency check
      if (service === 'Social Media Marketing') {
        Alert.alert(
          "Cannot Remove Service",
          "This service is connected to active proposals or campaigns. Complete or update those records before removing the service.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "View Campaigns", onPress: () => { setManageServicesVisible(false); setActivePage('campaigns'); } }
          ]
        );
        return;
      }
      setTempServices(prev => prev.filter(s => s !== service));
    } else {
      setTempServices(prev => [...prev, service]);
    }
  };

  const handleManageServicesSave = () => {
    if (tempServices.length === 0) {
      Alert.alert("Validation", "Please select at least one marketing service.");
      return;
    }
    setSelectedServices(tempServices);
    setManageServicesVisible(false);
  };



  const openDoc = (doc) => {
    setSelectedDoc(doc);
    setDocDetailsVisible(true);
  };

  const getDocStatusBadge = (status) => {
    switch(status) {
      case 'Verified': return { bg: '#F0FDF4', text: GREEN };
      case 'Pending Verification': return { bg: '#FFFBEB', text: ORANGE };
      case 'Rejected': return { bg: '#FEF2F2', text: RED };
      case 'Uploaded': return { bg: '#EFF6FF', text: BLUE };
      case 'Missing': return { bg: '#F1F5F9', text: MUTED };
      default: return { bg: '#F1F5F9', text: MUTED };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Intro */}
        <View style={styles.introBox}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your agency profile, services and portfolio</Text>
        </View>

        {/* 1. Marketing Agency Profile Card */}
        <View style={styles.card}>
          <View style={[styles.profileTop, !isMobile && {flexDirection: 'row', alignItems: 'center'}]}>
            <View style={[styles.profileLeft, !isMobile && {flex: 1, flexDirection: 'row', alignItems: 'center'}]}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarInitials}>BC</Text>
              </View>
              <View style={[!isMobile && {marginLeft: 20}]}>
                <Text style={styles.agencyName}>{profileData.name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.verifiedBadge}>
                    <BadgeCheck size={14} color={GREEN} style={{marginRight: 4}} />
                    <Text style={styles.verifiedText}>Verified Agency</Text>
                  </View>
                  <Text style={styles.badgeDot}>·</Text>
                  <View style={styles.activeBadge}>
                    <CircleCheck size={14} color={GREEN} style={{marginRight: 4}} />
                    <Text style={styles.activeText}>Active Business</Text>
                  </View>
                </View>
                <Text style={styles.businessType}>Marketing Agency</Text>
              </View>
            </View>

            <View style={[styles.profileMiddle, !isMobile && {flex: 1, paddingHorizontal: 20}]}>
              <View style={styles.contactRow}>
                <Phone size={14} color={MUTED} style={{marginRight: 8}} />
                <Text style={styles.contactText}>{profileData.mobile}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail size={14} color={MUTED} style={{marginRight: 8}} />
                <Text style={styles.contactText}>{profileData.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin size={14} color={MUTED} style={{marginRight: 8}} />
                <Text style={styles.contactText}>{profileData.city}, {profileData.state}</Text>
              </View>
            </View>

            <View style={[styles.profileRight, !isMobile && {alignItems: 'flex-end', justifyContent: 'center'}]}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => { setEditProfileForm({...profileData}); setEditProfileVisible(true); }}>
                <Pencil size={14} color={NAVY} style={{marginRight: 6}} />
                <Text style={styles.btnOutlineText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Business Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconTitleBox}>
              <Building2 size={20} color={PURPLE} style={{marginRight: 10}} />
              <Text style={styles.cardTitle}>Business Information</Text>
            </View>
          </View>
          <View style={styles.businessGrid}>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>BUSINESS TYPE</Text>
              <Text style={styles.businessValue}>Vendor / Supplier</Text>
            </View>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>BUSINESS PILLAR</Text>
              <Text style={styles.businessValue}>Marketing</Text>
            </View>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>BUSINESS CATEGORY</Text>
              <Text style={styles.businessValue}>Marketing Services</Text>
            </View>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>GST NUMBER</Text>
              <Text style={styles.businessValue}>27ABCDE1234F1Z5</Text>
            </View>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>PAN NUMBER</Text>
              <Text style={styles.businessValue}>ABCDE1234F</Text>
            </View>
            <View style={styles.businessCol}>
              <Text style={styles.businessLabel}>REGISTRATION NUMBER</Text>
              <Text style={styles.businessValue}>BRN-27-00012345</Text>
            </View>
          </View>
        </View>

        {/* 3. Marketing Services Offered */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.iconTitleBox}>
                <Megaphone size={20} color={PURPLE} style={{marginRight: 10}} />
                <Text style={styles.cardTitle}>Marketing Services Offered</Text>
              </View>
              <Text style={styles.cardSubtitle}>Professional marketing services provided by your agency</Text>
            </View>
            <TouchableOpacity style={styles.btnTextAction} onPress={() => { setTempServices([...selectedServices]); setManageServicesVisible(true); }}>
              <Settings2 size={16} color={PURPLE} style={{marginRight: 6}} />
              <Text style={styles.btnTextActionText}>Manage Services</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesWrap}>
            {selectedServices.map((srv, i) => (
              <View key={i} style={styles.serviceChip}>
                <Text style={styles.serviceChipText}>{srv}</Text>
              </View>
            ))}
          </View>
        </View>


        {/* 5. Licences & Documents */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.iconTitleBox}>
                <FileText size={20} color={PURPLE} style={{marginRight: 10}} />
                <Text style={styles.cardTitle}>Licences & Documents</Text>
              </View>
              <Text style={styles.cardSubtitle}>View and manage agency verification documents</Text>
            </View>
          </View>
          <View style={styles.docsContainer}>
            {documents.map((doc, idx) => (
              <TouchableOpacity key={idx} style={[styles.docRow, idx !== documents.length - 1 && styles.docRowBorder]} onPress={() => openDoc(doc)}>
                <View style={styles.docIconBox}><FileText size={20} color={MUTED} /></View>
                <View style={styles.docInfo}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    {doc.required && <Text style={styles.docReqBadge}>REQ</Text>}
                  </View>
                  {doc.ref ? <Text style={styles.docRef}>{doc.ref}</Text> : null}
                </View>
                <View style={[styles.docStatusBadge, {backgroundColor: getDocStatusBadge(doc.status).bg}]}>
                  <Text style={[styles.docStatusText, {color: getDocStatusBadge(doc.status).text}]}>{doc.status}</Text>
                </View>
                <ChevronRight size={18} color={MUTED} style={{marginLeft: 8}} />
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
          <LogOut size={20} color={RED} style={{marginRight: 10}} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileVisible} animationType="fade" transparent={true} onRequestClose={() => setEditProfileVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setEditProfileVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 520, width: '100%'}, {maxHeight: '82%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Edit Agency Profile</Text>
                    <TouchableOpacity onPress={() => setEditProfileVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody}>
                    <Text style={styles.inputLabel}>Agency Name</Text>
                    <TextInput style={styles.input} value={editProfileForm.name} onChangeText={t => setEditProfileForm({...editProfileForm, name: t})} />
                    
                    <Text style={styles.inputLabel}>Contact Person Name</Text>
                    <TextInput style={styles.input} value={editProfileForm.contactPerson} onChangeText={t => setEditProfileForm({...editProfileForm, contactPerson: t})} />
                    
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <TextInput style={styles.input} keyboardType="phone-pad" value={editProfileForm.mobile} onChangeText={t => setEditProfileForm({...editProfileForm, mobile: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput style={styles.input} keyboardType="email-address" value={editProfileForm.email} onChangeText={t => setEditProfileForm({...editProfileForm, email: t})} />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>Business Address</Text>
                    <TextInput style={styles.input} value={editProfileForm.address} onChangeText={t => setEditProfileForm({...editProfileForm, address: t})} />
                    
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput style={styles.input} value={editProfileForm.city} onChangeText={t => setEditProfileForm({...editProfileForm, city: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>State</Text>
                        <TextInput style={styles.input} value={editProfileForm.state} onChangeText={t => setEditProfileForm({...editProfileForm, state: t})} />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>Pincode</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={editProfileForm.pincode} onChangeText={t => setEditProfileForm({...editProfileForm, pincode: t})} />
                    
                    <View style={{height: 20}} />
                  </ScrollView>
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setEditProfileVisible(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalPrimary} onPress={handleEditProfileSave}>
                      <Text style={styles.btnModalPrimaryText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Manage Services Modal */}
      <Modal visible={manageServicesVisible} animationType="fade" transparent={true} onRequestClose={() => setManageServicesVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setManageServicesVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 520, width: '100%'}, {maxHeight: '82%'}]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Manage Marketing Services</Text>
                  <TouchableOpacity onPress={() => setManageServicesVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 20, paddingTop: 16}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                    <Text style={{fontSize: 13, color: NAVY, fontWeight: 'bold'}}>{tempServices.length} services selected</Text>
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <TouchableOpacity onPress={() => setTempServices([...AVAILABLE_SERVICES])}><Text style={{fontSize: 13, color: PURPLE, fontWeight: '600'}}>Select All</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setTempServices([])}><Text style={{fontSize: 13, color: MUTED, fontWeight: '600'}}>Clear All</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
                <ScrollView style={styles.modalBody}>
                  {AVAILABLE_SERVICES.map((srv, i) => {
                    const isSelected = tempServices.includes(srv);
                    return (
                      <TouchableOpacity key={i} style={[styles.serviceCheckRow, isSelected && styles.serviceCheckRowActive]} onPress={() => handleServiceToggle(srv)}>
                        <Text style={[styles.serviceCheckText, isSelected && styles.serviceCheckTextActive]}>{srv}</Text>
                        {isSelected && <CircleCheck size={20} color={PURPLE} />}
                      </TouchableOpacity>
                    );
                  })}
                  <View style={{height: 20}} />
                </ScrollView>
                <View style={styles.modalFooterActions}>
                  <TouchableOpacity style={styles.btnModalOutline} onPress={() => setManageServicesVisible(false)}>
                    <Text style={styles.btnModalOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnModalPrimary} onPress={handleManageServicesSave}>
                    <Text style={styles.btnModalPrimaryText}>Save Services</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      {/* Document Details Modal */}
      <Modal visible={docDetailsVisible} animationType="fade" transparent={true} onRequestClose={() => setDocDetailsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDocDetailsVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '95%'} : {maxWidth: 500, width: '100%'}, {maxHeight: '85%'}]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Document Details</Text>
                  <TouchableOpacity onPress={() => setDocDetailsVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                </View>
                {selectedDoc && (
                  <ScrollView style={styles.modalBody}>
                    <Text style={styles.docDetailName}>{selectedDoc.name}</Text>
                    
                    <View style={styles.docMetaGrid}>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaLabel}>Status</Text>
                        <View style={[styles.docStatusBadge, {backgroundColor: getDocStatusBadge(selectedDoc.status).bg}]}>
                          <Text style={[styles.docStatusText, {color: getDocStatusBadge(selectedDoc.status).text}]}>{selectedDoc.status}</Text>
                        </View>
                      </View>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaLabel}>Reference Number</Text>
                        <Text style={styles.docMetaValue}>{selectedDoc.ref || 'N/A'}</Text>
                      </View>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaLabel}>Filename</Text>
                        <Text style={styles.docMetaValue}>{selectedDoc.filename || 'Not uploaded'}</Text>
                      </View>
                      <View style={styles.docMetaRow}>
                        <Text style={styles.docMetaLabel}>Type</Text>
                        <Text style={styles.docMetaValue}>{selectedDoc.required ? 'Required Document' : 'Optional Document'}</Text>
                      </View>
                    </View>

                    {selectedDoc.status === 'Rejected' && (
                      <View style={styles.docRejectionBox}>
                        <Text style={styles.docRejectionLabel}>Rejection Reason:</Text>
                        <Text style={styles.docRejectionText}>The uploaded document is unclear or incomplete.</Text>
                      </View>
                    )}

                    <View style={styles.docActionsBox}>
                      <TouchableOpacity style={[styles.docActionBtn, !selectedDoc.filename && {opacity: 0.5}]} disabled={!selectedDoc.filename}>
                        <Text style={styles.docActionBtnText}>Preview Document</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.docActionBtn}>
                        <Text style={styles.docActionBtnText}>{selectedDoc.filename ? 'Replace Document' : 'Upload Document'}</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={{height: 20}} />
                  </ScrollView>
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
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 115, paddingHorizontal: 16, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  
  introBox: { marginTop: 16, marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: MUTED },

  card: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  
  // 1. Profile Top Card
  profileTop: { },
  profileLeft: { marginBottom: 16 },
  avatarLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarInitials: { fontSize: 24, fontWeight: 'bold', color: PURPLE },
  agencyName: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedText: { fontSize: 12, fontWeight: 'bold', color: GREEN },
  badgeDot: { color: MUTED, marginHorizontal: 8, fontWeight: 'bold' },
  activeBadge: { flexDirection: 'row', alignItems: 'center' },
  activeText: { fontSize: 12, fontWeight: 'bold', color: GREEN },
  businessType: { fontSize: 13, color: MUTED, fontWeight: '500' },
  
  profileMiddle: { marginBottom: 16, gap: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center' },
  contactText: { fontSize: 14, color: NAVY, fontWeight: '500' },
  
  profileRight: { },
  btnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'flex-start' },
  btnOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },

  // Generic Card Header
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconTitleBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  cardSubtitle: { fontSize: 13, color: MUTED },
  btnTextAction: { flexDirection: 'row', alignItems: 'center' },
  btnTextActionText: { fontSize: 13, fontWeight: 'bold', color: PURPLE, marginRight: 2 },

  // 2. Business Information
  businessGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 4 },
  businessCol: { width: '50%', padding: 12 },
  businessLabel: { fontSize: 10, fontWeight: 'bold', color: MUTED, marginBottom: 4, letterSpacing: 0.5 },
  businessValue: { fontSize: 14, fontWeight: '600', color: NAVY },

  // 3. Marketing Services
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#EAE6FF' },
  serviceChipText: { fontSize: 13, fontWeight: '600', color: NAVY },

  // 4. Portfolio Highlights
  portfolioGrid: { gap: 12 },
  pfCard: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  pfThumbnail: { height: 100, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  pfContent: { padding: 12 },
  pfTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  pfMeta: { fontSize: 12, color: MUTED, marginBottom: 6 },
  pfResult: { fontSize: 13, color: NAVY, marginBottom: 12 },
  pfLink: { flexDirection: 'row', alignItems: 'center' },
  pfLinkText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 4 },

  // 5. Documents
  docsContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  docRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  docIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  docInfo: { flex: 1, paddingRight: 8 },
  docName: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  docReqBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6, fontSize: 9, fontWeight: 'bold', color: MUTED },
  docRef: { fontSize: 12, color: MUTED, marginTop: 2 },
  docStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  docStatusText: { fontSize: 10, fontWeight: 'bold' },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  serviceCheckRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  serviceCheckRowActive: { backgroundColor: '#F5F3FF', paddingHorizontal: 10, marginHorizontal: -10, borderRadius: 8, borderBottomWidth: 0, marginVertical: 2 },
  serviceCheckText: { fontSize: 14, color: NAVY, fontWeight: '500' },
  serviceCheckTextActive: { fontWeight: 'bold', color: PURPLE },

  modalFooterActions: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  pfPreviewImg: { height: 200, backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  pfDetailTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pfDetailSub: { fontSize: 14, color: MUTED, marginBottom: 16 },
  pfDetailBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12 },
  pfDetailLabel: { fontSize: 11, fontWeight: 'bold', color: MUTED, marginBottom: 6 },
  pfDetailValue: { fontSize: 14, color: NAVY, lineHeight: 22 },

  docDetailName: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  docMetaGrid: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, gap: 12, marginBottom: 16 },
  docMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docMetaLabel: { fontSize: 13, color: MUTED },
  docMetaValue: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  docRejectionBox: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA', marginBottom: 16 },
  docRejectionLabel: { fontSize: 12, fontWeight: 'bold', color: RED, marginBottom: 4 },
  docRejectionText: { fontSize: 13, color: RED },
  docActionsBox: { gap: 10 },
  docActionBtn: { paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  docActionBtnText: { fontSize: 14, fontWeight: '600', color: NAVY },

  logoutBtn: { flexDirection: 'row', backgroundColor: WHITE, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: RED },
});
