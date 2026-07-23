import React, { useContext, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  useWindowDimensions, Alert, Platform, Modal, TextInput, 
  KeyboardAvoidingView, Pressable, SafeAreaView, ActivityIndicator
} from 'react-native';
import { 
  Phone, Mail, MapPin, 
  FileText, ChevronRight, BadgeCheck, Pencil, LogOut,
  X, Save, UserRound
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#081A3A';
const BG = '#F7F9FC';

export default function ManpowerProfilePage() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { logout } = useContext(AuthContext);

  // Modal & Form State
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [profile, setProfile] = useState({
    agencyName: 'Elite Manpower Agency',
    contactPerson: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'info@elitemanpower.com',
    address: '123 Business Hub',
    city: 'Jalgaon',
    state: 'Maharashtra',
    pincode: '425001'
  });

  const [profileForm, setProfileForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleOpenEdit = () => {
    setProfileForm({ ...profile });
    setErrors({});
    setIsEditProfileVisible(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!profileForm.agencyName.trim()) newErrors.agencyName = 'Enter the agency name.';
    if (!profileForm.contactPerson.trim()) newErrors.contactPerson = 'Enter the contact person name.';
    if (!profileForm.mobile.trim() || !/^\d{10}$/.test(profileForm.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    if (!profileForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) newErrors.email = 'Enter a valid email address.';
    if (!profileForm.city.trim()) newErrors.city = 'Enter the city.';
    if (!profileForm.state.trim()) newErrors.state = 'Enter the state.';
    if (!profileForm.pincode.trim() || !/^\d{6}$/.test(profileForm.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setProfile({ ...profileForm });
      setIsSaving(false);
      setIsEditProfileVisible(false);
      showToast("Profile updated successfully.");
    }, 1000);
  };

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

  const services = [
    { name: "Chef", color: "#3B82F6" },
    { name: "Waiter", color: "#10B981" },
    { name: "Housekeeping", color: "#F59E0B" },
    { name: "Kitchen Staff", color: "#8B5CF6" },
    { name: "Security", color: "#64748B" },
    { name: "Helper", color: "#3B82F6" },
    { name: "Bartender", color: "#10B981" },
    { name: "Receptionist", color: "#F59E0B" }
  ];

  const documents = [
    { name: "GST Certificate", ref: "27ABCDE1234F1Z5", status: "Verified" },
    { name: "PAN Card", ref: "ABCDE1234F", status: "Verified" },
    { name: "Business Registration", ref: "BRN-27-00012345", status: "Pending" }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Rejected': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.pageHeader}>
        <View style={styles.centerWrapper}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage agency profile and business details</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerWrapper}>
          
          {/* Main Agency Profile Card */}
          <View style={[styles.card, styles.heroCard]}>
            <View style={styles.heroTop}>
              <View style={styles.heroInfoRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{profile.agencyName.charAt(0)}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.agencyName}>{profile.agencyName}</Text>
                  
                  <View style={styles.badgesRow}>
                    <View style={styles.verifiedBadge}>
                      <BadgeCheck size={14} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified Agency</Text>
                    </View>
                    <Text style={styles.badgeDivider}>•</Text>
                    <Text style={styles.activeText}>Active</Text>
                  </View>

                  <Text style={styles.agencyType}>Manpower Agency</Text>
                </View>
              </View>

              {isLargeScreen && (
                <TouchableOpacity style={styles.editBtn} onPress={handleOpenEdit}>
                  <Pencil size={14} color={NAVY} />
                  <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.contactDivider} />

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}><Phone size={16} color="#64748B" /><Text style={styles.contactText}>+91 {profile.mobile.substring(0,5)} {profile.mobile.substring(5,10)}</Text></View>
              <View style={styles.contactRow}><Mail size={16} color="#64748B" /><Text style={styles.contactText}>{profile.email}</Text></View>
              <View style={styles.contactRow}><MapPin size={16} color="#64748B" /><Text style={styles.contactText}>{profile.city}, {profile.state}</Text></View>
            </View>

            {!isLargeScreen && (
              <TouchableOpacity style={[styles.editBtn, styles.editBtnMobile]} onPress={handleOpenEdit}>
                <Pencil size={14} color={NAVY} />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Grid Layout for Desktop */}
          <View style={isLargeScreen ? styles.desktopRow : null}>
            {/* Business Information */}
            <View style={[styles.section, isLargeScreen && styles.flexHalf]}>
              <View style={[styles.card, styles.flexCard]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Business Information</Text>
                  <TouchableOpacity onPress={() => Platform.OS === 'web' ? window.alert('Coming Soon: Business Information edit will be available soon.') : Alert.alert('Coming Soon', 'Business Information edit will be available soon.')}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.businessGrid}>
                  <View style={styles.bizCol}>
                    <View style={styles.bizItem}>
                      <Text style={styles.bizLabel}>Agency Type</Text>
                      <Text style={styles.bizValue}>Manpower Agency</Text>
                    </View>
                    <View style={styles.bizItem}>
                      <Text style={styles.bizLabel}>GST Number</Text>
                      <Text style={styles.bizValue}>27ABCDE1234F1Z5</Text>
                    </View>
                    <View style={styles.bizItem}>
                      <Text style={styles.bizLabel}>Registration Number</Text>
                      <Text style={styles.bizValue}>BRN-27-00012345</Text>
                    </View>
                  </View>
                  <View style={styles.bizCol}>
                    <View style={styles.bizItem}>
                      <Text style={styles.bizLabel}>Business Category</Text>
                      <Text style={styles.bizValue}>Manpower Services</Text>
                    </View>
                    <View style={styles.bizItem}>
                      <Text style={styles.bizLabel}>PAN Number</Text>
                      <Text style={styles.bizValue}>ABCDE1234F</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Roles / Services Provided */}
            <View style={[styles.section, isLargeScreen && styles.flexHalf]}>
              <View style={[styles.card, styles.flexCard]}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>Roles / Services Offered</Text>
                    <Text style={styles.cardSubtitle}>Staff categories provided by your agency</Text>
                  </View>
                  <TouchableOpacity onPress={() => Platform.OS === 'web' ? window.alert('Coming Soon: Roles / Services management will be available soon.') : Alert.alert('Coming Soon', 'Roles / Services management will be available soon.')}>
                    <Text style={styles.editText}>Manage</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.chipsContainer}>
                  {services.map((s, idx) => (
                    <View key={idx} style={[styles.chip, { backgroundColor: s.color + '15', borderColor: s.color + '30' }]}>
                      <Text style={[styles.chipText, { color: s.color }]}>{s.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Verification & Documents */}
          <View style={styles.section}>
            <View style={[styles.card, { padding: 0 }]}>
              <View style={[styles.cardHeader, { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 0 }]}>
                <View>
                  <Text style={styles.cardTitle}>Documents</Text>
                  <Text style={styles.cardSubtitle}>View and manage agency verification documents</Text>
                </View>
              </View>
              <View>
                {documents.map((doc, idx) => (
                  <View key={idx} style={[styles.docItem, idx === documents.length - 1 && {borderBottomWidth: 0}]}>
                    <View style={styles.docLeft}>
                      <View style={styles.docIconWrap}>
                        <FileText size={20} color={NAVY} />
                      </View>
                      <View style={{marginLeft: 14}}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        <Text style={styles.docRef}>{doc.ref}</Text>
                      </View>
                    </View>
                    <View style={styles.docRight}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) + '15' }]}>
                         <Text style={[styles.statusBadgeText, {color: getStatusColor(doc.status)}]}>{doc.status}</Text>
                      </View>
                      <ChevronRight size={18} color="#94A3B8" style={{marginLeft: 12}} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Logout */}
          <View style={[styles.section, {marginBottom: 0}]}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal 
        visible={isEditProfileVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsEditProfileVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '100%', alignItems: 'center'}}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Edit Agency Profile</Text>
                  <Text style={styles.modalSubtitle}>Update your agency contact and business details</Text>
                </View>
                <TouchableOpacity onPress={() => setIsEditProfileVisible(false)} style={styles.closeBtn}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20}} keyboardShouldPersistTaps="handled">
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Agency Name</Text>
                  <View style={[styles.inputWrapper, errors.agencyName && styles.inputError]}>
                    <TextInput 
                      style={styles.input} 
                      value={profileForm.agencyName}
                      onChangeText={(val) => setProfileForm({...profileForm, agencyName: val})}
                      placeholder="e.g. Elite Manpower Agency"
                    />
                  </View>
                  {errors.agencyName && <Text style={styles.errorText}>{errors.agencyName}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Contact Person</Text>
                  <View style={[styles.inputWrapper, errors.contactPerson && styles.inputError]}>
                    <UserRound size={18} color="#94A3B8" style={{marginLeft: 12}} />
                    <TextInput 
                      style={styles.inputWithIcon} 
                      value={profileForm.contactPerson}
                      onChangeText={(val) => setProfileForm({...profileForm, contactPerson: val})}
                      placeholder="Enter contact person name"
                    />
                  </View>
                  {errors.contactPerson && <Text style={styles.errorText}>{errors.contactPerson}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <View style={[styles.inputWrapper, errors.mobile && styles.inputError]}>
                    <Phone size={18} color="#94A3B8" style={{marginLeft: 12}} />
                    <TextInput 
                      style={styles.inputWithIcon} 
                      value={profileForm.mobile}
                      keyboardType="numeric"
                      maxLength={10}
                      onChangeText={(val) => setProfileForm({...profileForm, mobile: val})}
                      placeholder="10-digit mobile number"
                    />
                  </View>
                  {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                    <Mail size={18} color="#94A3B8" style={{marginLeft: 12}} />
                    <TextInput 
                      style={styles.inputWithIcon} 
                      value={profileForm.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={(val) => setProfileForm({...profileForm, email: val})}
                      placeholder="e.g. info@agency.com"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Business Address (Optional)</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={18} color="#94A3B8" style={{marginLeft: 12}} />
                    <TextInput 
                      style={styles.inputWithIcon} 
                      value={profileForm.address}
                      onChangeText={(val) => setProfileForm({...profileForm, address: val})}
                      placeholder="Flat, building, street..."
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', gap: 12}}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.inputLabel}>City</Text>
                    <View style={[styles.inputWrapper, errors.city && styles.inputError]}>
                      <TextInput 
                        style={styles.input} 
                        value={profileForm.city}
                        onChangeText={(val) => setProfileForm({...profileForm, city: val})}
                        placeholder="e.g. Jalgaon"
                      />
                    </View>
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                  </View>

                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.inputLabel}>State</Text>
                    <View style={[styles.inputWrapper, errors.state && styles.inputError]}>
                      <TextInput 
                        style={styles.input} 
                        value={profileForm.state}
                        onChangeText={(val) => setProfileForm({...profileForm, state: val})}
                        placeholder="e.g. Maharashtra"
                      />
                    </View>
                    {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <View style={[styles.inputWrapper, errors.pincode && styles.inputError]}>
                    <TextInput 
                      style={styles.input} 
                      value={profileForm.pincode}
                      keyboardType="numeric"
                      maxLength={6}
                      onChangeText={(val) => setProfileForm({...profileForm, pincode: val})}
                      placeholder="6-digit PIN"
                    />
                  </View>
                  {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
                </View>
                
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsEditProfileVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Save size={16} color="#fff" />
                      <Text style={styles.modalSaveText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

            </Pressable>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* Toast Notification */}
      {toastMsg ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centerWrapper: { maxWidth: 1200, alignSelf: 'center', width: '100%' },
  
  pageHeader: { padding: 20, paddingBottom: 10, backgroundColor: BG },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },

  scrollContent: { padding: 16, paddingTop: 10, paddingBottom: 100 }, 

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },

  heroCard: { padding: 24 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroInfoRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 26, fontWeight: 'bold', color: '#3B82F6' },
  profileInfo: { marginLeft: 16, flex: 1 },
  agencyName: { fontSize: 20, fontWeight: '900', color: NAVY, marginBottom: 6 },
  
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedText: { fontSize: 13, color: '#10B981', fontWeight: 'bold', marginLeft: 6 },
  badgeDivider: { color: '#CBD5E1', marginHorizontal: 8, fontSize: 16 },
  activeText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  
  agencyType: { fontSize: 14, color: '#64748B' },
  
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  editBtnText: { color: NAVY, fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  editBtnMobile: { marginTop: 16, justifyContent: 'center', paddingVertical: 12 },

  contactDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },

  contactInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', minWidth: 200, marginRight: 16 },
  contactText: { fontSize: 14, color: '#475569', marginLeft: 10, fontWeight: '500' },
  
  section: { marginTop: 24 },
  flexHalf: { flex: 1, marginTop: 0 },
  desktopRow: { flexDirection: 'row', gap: 24, marginTop: 24 },
  flexCard: { flex: 1 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  cardSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  editText: { fontSize: 14, fontWeight: 'bold', color: '#2563EB' },

  businessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  bizCol: { flex: 1, minWidth: 200, gap: 16 },
  bizItem: { marginBottom: 4 },
  bizLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  bizValue: { fontSize: 15, fontWeight: '600', color: '#1E293B' },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },

  docItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  docName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  docRef: { fontSize: 13, color: '#64748B' },
  docRight: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: 'bold' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#FECACA', paddingVertical: 16, borderRadius: 16 },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#EF4444', marginLeft: 8 },

  // Edit Profile Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '85%', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#64748B' },
  closeBtn: { padding: 4, borderRadius: 20, backgroundColor: '#F1F5F9' },
  
  formGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 48 },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 14, color: NAVY, height: '100%' },
  inputWithIcon: { flex: 1, paddingHorizontal: 12, fontSize: 14, color: NAVY, height: '100%' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },

  modalFooter: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalSaveBtn: { flex: 1, flexDirection: 'row', paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  modalSaveText: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginLeft: 8 },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
