import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Settings, User, MapPin, Briefcase, RefreshCcw, DollarSign, Clock, FileText, CreditCard, Bell, Shield, ChevronRight, X, CheckCircle, Upload, AlertCircle } from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_PROFILE = {
  legalName: "Elite Manpower Services Pvt Ltd",
  displayName: "Elite Manpower",
  description: "Premium manpower supplier for the hospitality industry.",
  experience: "5 Years",
  totalCandidates: "500+",
  roles: "Chefs, Bartenders, Stewards, Managers",
  cities: "Mumbai, Pune, Goa",
  replacementPolicy: "30 Days Free Replacement",
  serviceCharge: "8.33% of Annual CTC",
  contactPerson: "Rajesh Kumar",
  phone: "+91 9876543210",
  email: "contact@elitemanpower.in",
  address: "Andheri West, Mumbai 400053"
};

const MOCK_DOCS = [
  { id: 1, name: "GST Certificate", status: "Verified", date: "10 Jan 2026" },
  { id: 2, name: "PAN Card", status: "Verified", date: "10 Jan 2026" },
  { id: 3, name: "Labour Licence", status: "Verified", date: "15 Jan 2026" },
  { id: 4, name: "Shop Act Registration", status: "Pending", date: "14 Jul 2026" },
  { id: 5, name: "Aadhaar (Authorized Person)", status: "Verified", date: "10 Jan 2026" },
  { id: 6, name: "Cancelled Cheque", status: "Verified", date: "10 Jan 2026" },
];

export default function ManpowerSettingsPage() {
  const [profileData, setProfileData] = useState(MOCK_PROFILE);
  const [notifPrefs, setNotifPrefs] = useState({
    broadcasts: true, directReqs: true, interviews: true, selections: true, replacements: true, payments: true, system: true
  });

  const [activeModal, setActiveModal] = useState(null); // 'Profile', 'Documents', 'Notifications'
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleSaveProfile = () => {
    setActiveModal(null);
    showToast("Profile updated successfully.");
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconBox}><Icon size={20} color={NAVY} /></View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Settings size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Settings & Profile</Text>
        </View>
        <Text style={styles.headerSub}>Manage agency profile, compliance, and preferences.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card Summary */}
        <View style={styles.profileSummaryCard}>
          <View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>EM</Text></View>
          <View style={{flex: 1, marginLeft: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.profCardName}>{profileData.displayName}</Text>
              <CheckCircle size={14} color="#10B981" style={{marginLeft: 6}} />
            </View>
            <Text style={styles.profCardLegal}>{profileData.legalName}</Text>
            <TouchableOpacity style={styles.editProfBtn} onPress={() => setActiveModal('Profile')}>
              <Text style={styles.editProfBtnText}>Edit Full Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Compliance & Legal</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={FileText} title="Documents & KYC" subtitle="GST, PAN, Labour Licence" onPress={() => setActiveModal('Documents')} />
          <View style={styles.divider} />
          <MenuItem icon={CreditCard} title="Bank Details" subtitle="Manage payout accounts" onPress={() => showToast("Bank Details under construction")} />
        </View>

        <Text style={styles.sectionHeading}>Business Terms</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={Briefcase} title="Roles Supplied" subtitle="Chefs, Stewards, etc." onPress={() => setActiveModal('Profile')} />
          <View style={styles.divider} />
          <MenuItem icon={RefreshCcw} title="Replacement Policy" subtitle="Terms for staff replacement" onPress={() => setActiveModal('Profile')} />
          <View style={styles.divider} />
          <MenuItem icon={DollarSign} title="Service Charges" subtitle="Commission models" onPress={() => setActiveModal('Profile')} />
        </View>

        <Text style={styles.sectionHeading}>Preferences</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon={Bell} title="Notifications" subtitle="Email and Push alerts" onPress={() => setActiveModal('Notifications')} />
          <View style={styles.divider} />
          <MenuItem icon={Shield} title="Password & Security" subtitle="Update login credentials" onPress={() => showToast("Security under construction")} />
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={activeModal === 'Profile'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Agency Profile</Text>
            <View style={{width: 40}} />
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              
              <Text style={styles.formSectionTitle}>Basic Details</Text>
              <Text style={styles.inputLabel}>Legal Business Name *</Text>
              <TextInput style={styles.input} value={profileData.legalName} onChangeText={t => setProfileData({...profileData, legalName: t})} />
              <Text style={styles.inputLabel}>Display Name *</Text>
              <TextInput style={styles.input} value={profileData.displayName} onChangeText={t => setProfileData({...profileData, displayName: t})} />
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput style={styles.inputArea} value={profileData.description} onChangeText={t => setProfileData({...profileData, description: t})} multiline />

              <Text style={styles.formSectionTitle}>Operations</Text>
              <Text style={styles.inputLabel}>Years of Experience</Text>
              <TextInput style={styles.input} value={profileData.experience} onChangeText={t => setProfileData({...profileData, experience: t})} />
              <Text style={styles.inputLabel}>Staff Roles Supplied</Text>
              <TextInput style={styles.inputArea} value={profileData.roles} onChangeText={t => setProfileData({...profileData, roles: t})} multiline />
              <Text style={styles.inputLabel}>Operational Cities</Text>
              <TextInput style={styles.input} value={profileData.cities} onChangeText={t => setProfileData({...profileData, cities: t})} />

              <Text style={styles.formSectionTitle}>Terms & Policies</Text>
              <Text style={styles.inputLabel}>Replacement Policy</Text>
              <TextInput style={styles.input} value={profileData.replacementPolicy} onChangeText={t => setProfileData({...profileData, replacementPolicy: t})} />
              <Text style={styles.inputLabel}>Service Charge Model</Text>
              <TextInput style={styles.input} value={profileData.serviceCharge} onChangeText={t => setProfileData({...profileData, serviceCharge: t})} />

              <Text style={styles.formSectionTitle}>Contact Details</Text>
              <Text style={styles.inputLabel}>Contact Person *</Text>
              <TextInput style={styles.input} value={profileData.contactPerson} onChangeText={t => setProfileData({...profileData, contactPerson: t})} />
              <Text style={styles.inputLabel}>Phone *</Text>
              <TextInput style={styles.input} value={profileData.phone} onChangeText={t => setProfileData({...profileData, phone: t})} keyboardType="phone-pad" />
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput style={styles.input} value={profileData.email} onChangeText={t => setProfileData({...profileData, email: t})} keyboardType="email-address" />
              <Text style={styles.inputLabel}>Office Address *</Text>
              <TextInput style={styles.inputArea} value={profileData.address} onChangeText={t => setProfileData({...profileData, address: t})} multiline />

              <View style={{height: 40}} />
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.primaryBtnLarge} onPress={handleSaveProfile}>
                <Text style={styles.primaryBtnLargeText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Documents Modal */}
      <Modal visible={activeModal === 'Documents'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Documents & KYC</Text>
            <View style={{width: 40}} />
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {MOCK_DOCS.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <View style={styles.docInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docDate}>Uploaded: {doc.date}</Text>
                </View>
                <View style={styles.docStatusBox}>
                  <Text style={[styles.docStatus, {color: doc.status === 'Verified' ? '#10B981' : '#F59E0B'}]}>{doc.status}</Text>
                </View>
                <View style={styles.docActions}>
                  <TouchableOpacity style={styles.docActionBtn}><Text style={styles.docActionText}>View</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.docActionBtnPrimary}><Upload size={14} color="#fff" style={{marginRight: 4}} /><Text style={styles.docActionTextPrimary}>Replace</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={activeModal === 'Notifications'} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.closeBtn}><X size={24} color="#1E293B" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Notification Preferences</Text>
            <View style={{width: 40}} />
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.menuGroup}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Broadcast Requirements</Text>
                  <Text style={styles.toggleSub}>New job postings from hotels & cafes.</Text>
                </View>
                <Switch value={notifPrefs.broadcasts} onValueChange={v => setNotifPrefs({...notifPrefs, broadcasts: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
              <View style={styles.divider} />
              
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Direct Requests</Text>
                  <Text style={styles.toggleSub}>Exclusive private requests sent to you.</Text>
                </View>
                <Switch value={notifPrefs.directReqs} onValueChange={v => setNotifPrefs({...notifPrefs, directReqs: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Interview Updates</Text>
                  <Text style={styles.toggleSub}>Reschedules, results and feedback.</Text>
                </View>
                <Switch value={notifPrefs.interviews} onValueChange={v => setNotifPrefs({...notifPrefs, interviews: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Selection & Deployment</Text>
                  <Text style={styles.toggleSub}>Alerts when candidates are selected.</Text>
                </View>
                <Switch value={notifPrefs.selections} onValueChange={v => setNotifPrefs({...notifPrefs, selections: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Replacement Requests</Text>
                  <Text style={styles.toggleSub}>Alerts for candidates absconding/leaving.</Text>
                </View>
                <Switch value={notifPrefs.replacements} onValueChange={v => setNotifPrefs({...notifPrefs, replacements: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
              <View style={styles.divider} />

              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Payment Notifications</Text>
                  <Text style={styles.toggleSub}>Invoice paid or overdue alerts.</Text>
                </View>
                <Switch value={notifPrefs.payments} onValueChange={v => setNotifPrefs({...notifPrefs, payments: v})} trackColor={{ false: '#CBD5E1', true: '#10B981' }} thumbColor="#fff" />
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B' },

  scrollContent: { padding: 16 },

  profileSummaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  avatarLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  avatarLargeText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  profCardName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  profCardLegal: { fontSize: 13, color: '#64748B', marginTop: 2, marginBottom: 8 },
  editProfBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F1F5F9', borderRadius: 8 },
  editProfBtnText: { fontSize: 12, fontWeight: 'bold', color: NAVY },

  sectionHeading: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  menuGroup: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  menuSub: { fontSize: 13, color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 72 },

  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  closeBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalContent: { flex: 1, padding: 16 },

  formSectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16, marginTop: 8 },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 16, color: '#1E293B' },
  inputArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16, color: '#1E293B' },

  modalFooter: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtnLarge: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  docCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  docInfo: { width: '100%', marginBottom: 12 },
  docName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  docDate: { fontSize: 12, color: '#94A3B8' },
  docStatusBox: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start' },
  docStatus: { fontSize: 12, fontWeight: 'bold' },
  docActions: { flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'flex-end' },
  docActionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  docActionText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  docActionBtnPrimary: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: NAVY },
  docActionTextPrimary: { fontSize: 12, fontWeight: '600', color: '#fff' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  toggleInfo: { flex: 1, paddingRight: 16 },
  toggleTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  toggleSub: { fontSize: 13, color: '#94A3B8' },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
