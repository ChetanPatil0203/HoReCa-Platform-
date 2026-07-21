import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { 
  Phone, Mail, MapPin, CheckCircle, 
  FileText, ChevronRight, Settings, HelpCircle, LogOut, Bell, Building, Users
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';
const BG = '#F7F9FC';

export default function ManpowerProfilePage({ onNavigate }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() }
      ]
    );
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
    { name: "GST Certificate", ref: "GSTIN: 27ABCDE1234F1Z5", status: "Verified" },
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
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>Manage your business profile and verification</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Agency Profile Card */}
        <View style={[styles.card, styles.heroCard]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>EM</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.agencyName}>Elite Manpower Agency</Text>
              
              <View style={styles.badgesRow}>
                <View style={styles.verifiedBadge}>
                  <CheckCircle size={12} color="#2563EB" />
                  <Text style={styles.verifiedText}>Verified Agency</Text>
                </View>
              </View>

              <Text style={styles.agencyType}>Manpower Agency</Text>
              
              <View style={styles.activeStatusRow}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active Account</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.contactDivider} />

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}><Phone size={14} color="#64748B" /><Text style={styles.contactText}>+91 98765 43210</Text></View>
            <View style={styles.contactRow}><Mail size={14} color="#64748B" /><Text style={styles.contactText}>info@elitemanpower.com</Text></View>
            <View style={styles.contactRow}><MapPin size={14} color="#64748B" /><Text style={styles.contactText}>Jalgaon, Maharashtra</Text></View>
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>View Public Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Verification */}
        <View style={styles.verificationSection}>
          <View style={styles.verificationHeader}>
            <Text style={styles.verificationTitle}>Profile Verification</Text>
            <Text style={styles.verificationPercent}>90%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '90%' }]} />
          </View>
          <View style={styles.verificationList}>
            <View style={styles.verifItem}><CheckCircle size={14} color="#10B981" /><Text style={styles.verifText}>Business Information</Text></View>
            <View style={styles.verifItem}><CheckCircle size={14} color="#10B981" /><Text style={styles.verifText}>GST Verified</Text></View>
            <View style={styles.verifItem}><CheckCircle size={14} color="#10B981" /><Text style={styles.verifText}>PAN Verified</Text></View>
            <View style={styles.verifItem}><View style={styles.pendingCircle} /><Text style={styles.verifTextPending}>Registration Verification Pending</Text></View>
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Building size={18} color={NAVY} />
                <Text style={styles.cardTitle}>Business Information</Text>
              </View>
              <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
            </View>

            <View style={styles.businessGrid}>
              <View style={styles.bizCol}>
                <View style={styles.bizItem}>
                  <Text style={styles.bizLabel}>AGENCY TYPE</Text>
                  <Text style={styles.bizValue}>Manpower Agency</Text>
                </View>
                <View style={styles.bizItem}>
                  <Text style={styles.bizLabel}>GST NUMBER</Text>
                  <Text style={styles.bizValue}>27ABCDE1234F1Z5</Text>
                </View>
                <View style={styles.bizItem}>
                  <Text style={styles.bizLabel}>REGISTRATION NO.</Text>
                  <Text style={styles.bizValue}>BRN-27-00012345</Text>
                </View>
              </View>
              <View style={styles.bizCol}>
                <View style={styles.bizItem}>
                  <Text style={styles.bizLabel}>BUSINESS CATEGORY</Text>
                  <Text style={styles.bizValue}>Manpower Services</Text>
                </View>
                <View style={styles.bizItem}>
                  <Text style={styles.bizLabel}>PAN NUMBER</Text>
                  <Text style={styles.bizValue}>ABCDE1234F</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Roles / Services Provided */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Users size={18} color={NAVY} />
                <View>
                  <Text style={styles.cardTitle}>Roles / Services</Text>
                  <Text style={styles.cardSubtitle}>Staff categories offered</Text>
                </View>
              </View>
              <TouchableOpacity><Text style={styles.editText}>Manage</Text></TouchableOpacity>
            </View>

            <View style={styles.chipsContainer}>
              {services.map((s, idx) => (
                <View key={idx} style={[styles.chip, { backgroundColor: s.color + '15' }]}>
                  <Text style={[styles.chipText, { color: s.color }]}>{s.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Verification & Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification & Documents</Text>
          <Text style={styles.sectionSubtitle}>Manage your verified business documents</Text>
          <View style={styles.card}>
            {documents.map((doc, idx) => (
              <TouchableOpacity key={idx} style={[styles.docItem, idx === documents.length - 1 && {borderBottomWidth: 0}]}>
                <View style={styles.docLeft}>
                  <View style={styles.docIconWrap}>
                    <FileText size={20} color={NAVY} />
                  </View>
                  <View style={{marginLeft: 12}}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docRef}>{doc.ref}</Text>
                  </View>
                </View>
                <View style={styles.docRight}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doc.status) + '15' }]}>
                     <Text style={[styles.statusBadgeText, {color: getStatusColor(doc.status)}]}>{doc.status}</Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" style={{marginLeft: 8}} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.linkItem} onPress={() => onNavigate && onNavigate("settings")}>
              <View style={styles.linkLeft}>
                <View style={styles.linkIconWrap}><Settings size={18} color={NAVY} /></View>
                <View style={styles.linkTextWrap}>
                  <Text style={styles.linkTitle}>Account Settings</Text>
                  <Text style={styles.linkSub}>Manage password and preferences</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkLeft}>
                <View style={styles.linkIconWrap}><Bell size={18} color={NAVY} /></View>
                <View style={styles.linkTextWrap}>
                  <Text style={styles.linkTitle}>Notifications</Text>
                  <Text style={styles.linkSub}>Manage notification preferences</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.linkItem, {borderBottomWidth: 0}]} onPress={() => onNavigate && onNavigate("support")}>
              <View style={styles.linkLeft}>
                <View style={styles.linkIconWrap}><HelpCircle size={18} color={NAVY} /></View>
                <View style={styles.linkTextWrap}>
                  <Text style={styles.linkTitle}>Help & Support</Text>
                  <Text style={styles.linkSub}>Get help and contact support</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, {marginBottom: 0}]}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  
  pageHeader: { padding: 16, paddingTop: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: '#64748B' },

  scrollContent: { padding: 16, paddingTop: 8, paddingBottom: 100 }, 

  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },

  heroCard: { padding: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#3B82F6' },
  profileInfo: { marginLeft: 16, flex: 1 },
  agencyName: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { fontSize: 11, color: '#2563EB', fontWeight: 'bold', marginLeft: 4 },
  agencyType: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  activeStatusRow: { flexDirection: 'row', alignItems: 'center' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  activeText: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  
  contactDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  contactInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', minWidth: '45%' },
  contactText: { fontSize: 13, color: '#475569', marginLeft: 8 },
  
  heroActions: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, backgroundColor: NAVY, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  secondaryBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 13, fontWeight: 'bold' },

  verificationSection: { marginTop: 24, paddingHorizontal: 4 },
  verificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  verificationTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  verificationPercent: { fontSize: 13, fontWeight: 'bold', color: '#10B981' },
  progressTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  verificationList: { gap: 6 },
  verifItem: { flexDirection: 'row', alignItems: 'center' },
  verifText: { fontSize: 12, color: NAVY, marginLeft: 8 },
  pendingCircle: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: '#F59E0B', marginLeft: 1 },
  verifTextPending: { fontSize: 12, color: '#F59E0B', marginLeft: 9 },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4, marginLeft: 4 },
  sectionSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 12, marginLeft: 4 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  cardSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  editText: { fontSize: 13, fontWeight: 'bold', color: '#2563EB' },

  businessGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  bizCol: { flex: 1, minWidth: '45%' },
  bizItem: { marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginRight: 8 },
  bizLabel: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8', marginBottom: 4, letterSpacing: 0.5 },
  bizValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '600' },

  docItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  docName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  docRef: { fontSize: 12, color: '#64748B' },
  docRight: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },

  linkItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  linkLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  linkIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  linkTextWrap: { marginLeft: 16, flex: 1 },
  linkTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  linkSub: { fontSize: 12, color: '#64748B' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#FECACA', paddingVertical: 16, borderRadius: 16 },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#EF4444', marginLeft: 8 }
});
