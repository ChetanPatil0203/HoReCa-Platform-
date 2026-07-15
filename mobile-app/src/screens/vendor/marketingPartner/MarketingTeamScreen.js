import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, ToastAndroid, Dimensions } from 'react-native';
import { 
  Users, CheckCircle, Clock, XCircle, Briefcase, 
  Plus, Edit, Eye, UserX, UserCheck, Calendar, MapPin, 
  Phone, Mail, X, FileText, ChevronDown 
} from 'lucide-react-native';

const { height } = Dimensions.get('window');

const ROLES = [
  "Campaign Manager", "Account Manager", "Social Media Manager", 
  "Graphic Designer", "Content Writer", "Video Editor", 
  "Photographer", "Videographer", "SEO Executive", 
  "Meta Ads Specialist", "Google Ads Specialist", "Web Developer"
];

const MOCK_TEAM = [
  { id: 'EMP-01', initials: 'AK', name: 'Aarav Kumar', role: 'Campaign Manager', skills: 'Strategy, Client Handling', availability: 'Busy', currentCampaign: 'Azure Palace Summer Launch', currentTask: 'Campaign Planning' },
  { id: 'EMP-02', initials: 'SM', name: 'Sneha Mishra', role: 'Social Media Manager', skills: 'Instagram, Reels, Facebook', availability: 'Available', currentCampaign: 'None', currentTask: 'None' },
  { id: 'EMP-03', initials: 'RJ', name: 'Rohan Joshi', role: 'Graphic Designer', skills: 'Photoshop, Illustrator, Figma', availability: 'Available', currentCampaign: 'None', currentTask: 'None' },
  { id: 'EMP-04', initials: 'PK', name: 'Priya Kapoor', role: 'Content Writer', skills: 'Copywriting, Blogs', availability: 'On Leave', currentCampaign: 'None', currentTask: 'None' },
];

const MOCK_CAMPAIGNS = ["Azure Palace Summer Launch", "Weekend Brunch Influencer Push", "New Menu Launch PR"];

export default function MarketingTeamScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Add Employee Form State
  const [newRole, setNewRole] = useState('Campaign Manager');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Assign Campaign Form State
  const [assignCampaign, setAssignCampaign] = useState('Azure Palace Summer Launch');
  const [showCampDropdown, setShowCampDropdown] = useState(false);
  const [assignRole, setAssignRole] = useState('');
  const [assignStart, setAssignStart] = useState('');
  const [assignEnd, setAssignEnd] = useState('');

  const openAssign = (emp) => {
    setSelectedEmployee(emp);
    setAssignModalVisible(true);
  };

  const handleAssignSubmit = () => {
    if (selectedEmployee?.availability === 'Busy' || selectedEmployee?.availability === 'On Leave') {
      if (Platform.OS === 'android') {
         ToastAndroid.show("Cannot assign! Employee is " + selectedEmployee.availability, ToastAndroid.SHORT);
      }
      return;
    }
    if (Platform.OS === 'android') {
      ToastAndroid.show("Employee assigned successfully.", ToastAndroid.SHORT);
    }
    setAssignModalVisible(false);
  };

  const getAvailColor = (avail) => {
    switch (avail) {
      case 'Available': return { bg: '#D1FAE5', text: '#059669', icon: CheckCircle };
      case 'Busy': return { bg: '#FEE2E2', text: '#EF4444', icon: Briefcase };
      case 'On Leave': return { bg: '#FEF3C7', text: '#D97706', icon: Clock };
      case 'Inactive': return { bg: '#F1F5F9', text: '#475569', icon: XCircle };
      default: return { bg: '#F1F5F9', text: '#475569', icon: CheckCircle };
    }
  };

  const renderKPIs = () => (
    <View style={styles.kpiWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiScroll}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Team</Text>
          <View style={styles.kpiRow}><Users size={20} color="#0F172A"/><Text style={styles.kpiVal}>14</Text></View>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Available</Text>
          <View style={styles.kpiRow}><CheckCircle size={20} color="#10B981"/><Text style={[styles.kpiVal, {color: '#10B981'}]}>8</Text></View>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Busy</Text>
          <View style={styles.kpiRow}><Briefcase size={20} color="#EF4444"/><Text style={[styles.kpiVal, {color: '#EF4444'}]}>4</Text></View>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>On Leave</Text>
          <View style={styles.kpiRow}><Clock size={20} color="#F59E0B"/><Text style={[styles.kpiVal, {color: '#F59E0B'}]}>2</Text></View>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Inactive</Text>
          <View style={styles.kpiRow}><XCircle size={20} color="#64748B"/><Text style={[styles.kpiVal, {color: '#64748B'}]}>0</Text></View>
        </View>
      </ScrollView>
    </View>
  );

  const renderEmployeeCard = ({ item }) => {
    const avail = getAvailColor(item.availability);
    const Icon = avail.icon;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarBox}><Text style={styles.avatarInitials}>{item.initials}</Text></View>
          <View style={styles.headerInfo}>
             <Text style={styles.empName}>{item.name}</Text>
             <Text style={styles.empRole}>{item.role}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: avail.bg }]}>
             <Icon size={12} color={avail.text} />
             <Text style={[styles.badgeText, { color: avail.text }]}>{item.availability}</Text>
          </View>
        </View>

        <Text style={styles.skillsText}>Skills: {item.skills}</Text>

        <View style={styles.assignmentBox}>
           <Text style={styles.assignLabel}>Current Campaign</Text>
           <Text style={styles.assignVal}>{item.currentCampaign}</Text>
           <Text style={styles.assignLabel}>Current Task</Text>
           <Text style={styles.assignVal}>{item.currentTask}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
           <TouchableOpacity style={styles.btnOutline}><Eye size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>View</Text></TouchableOpacity>
           <TouchableOpacity style={styles.btnOutline}><Edit size={16} color="#8B5CF6"/><Text style={styles.btnOutlineText}>Edit</Text></TouchableOpacity>
           <TouchableOpacity style={styles.btnPrimary} onPress={() => openAssign(item)}><UserCheck size={16} color="#fff"/><Text style={styles.btnPrimaryText}>Assign Campaign</Text></TouchableOpacity>
           <TouchableOpacity style={styles.btnDangerOutline}><UserX size={16} color="#EF4444"/><Text style={styles.btnDangerText}>Deactivate</Text></TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal visible={addModalVisible} animationType="slide">
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalHeader}>
           <Text style={styles.modalTitle}>Add New Employee</Text>
           <TouchableOpacity onPress={() => setAddModalVisible(false)}><X size={24} color="#0F172A"/></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalScroll} contentContainerStyle={{padding: 16}}>
           
           <View style={{alignItems: 'center', marginBottom: 24}}>
             <View style={styles.uploadPhotoBox}>
                <Plus size={24} color="#94A3B8"/>
                <Text style={styles.uploadPhotoText}>Upload Photo</Text>
             </View>
           </View>

           <Text style={styles.label}>Full Name</Text>
           <TextInput style={styles.input} placeholder="e.g. Rahul Sharma" />
           
           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Phone</Text><TextInput style={styles.input} placeholder="+91..." keyboardType="phone-pad" /></View>
             <View style={styles.col}><Text style={styles.label}>Email</Text><TextInput style={styles.input} placeholder="name@agency.com" keyboardType="email-address" /></View>
           </View>

           <Text style={styles.label}>Role</Text>
           <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowRoleDropdown(!showRoleDropdown)}>
              <Text style={styles.dropdownText}>{newRole}</Text>
              <ChevronDown size={20} color="#64748B" />
           </TouchableOpacity>
           {showRoleDropdown && (
              <View style={styles.dropdownList}>
                {ROLES.map(r => (
                  <TouchableOpacity key={r} style={styles.dropdownItem} onPress={() => { setNewRole(r); setShowRoleDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
           )}

           <Text style={styles.label}>Core Skills</Text>
           <TextInput style={styles.input} placeholder="e.g. Photoshop, Premiere Pro..." />

           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Experience (Years)</Text><TextInput style={styles.input} placeholder="e.g. 3" keyboardType="numeric" /></View>
             <View style={styles.col}><Text style={styles.label}>Joining Date</Text><TextInput style={styles.input} placeholder="DD/MM/YYYY" /></View>
           </View>

           <Text style={styles.label}>Working Hours</Text>
           <TextInput style={styles.input} placeholder="e.g. 10 AM - 7 PM" />
           
           <Text style={styles.label}>Emergency Contact</Text>
           <TextInput style={styles.input} placeholder="Name & Phone" />

           <Text style={styles.label}>ID Proof Upload</Text>
           <TouchableOpacity style={styles.fileUploadBox}>
              <FileText size={20} color="#94A3B8"/>
              <Text style={styles.fileUploadText}>Tap to upload PDF/JPG</Text>
           </TouchableOpacity>

        </ScrollView>
        <View style={styles.modalFooter}>
           <TouchableOpacity style={styles.btnPrimaryFull} onPress={() => setAddModalVisible(false)}><Text style={styles.btnPrimaryFullText}>Save Employee</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderAssignModal = () => (
    <Modal visible={assignModalVisible} transparent={true} animationType="fade">
      <View style={styles.bottomSheetOverlay}>
        <TouchableOpacity style={{flex: 1}} onPress={() => setAssignModalVisible(false)} />
        <View style={styles.bottomSheetContainer}>
           <View style={styles.sheetHandle} />
           <Text style={styles.sheetTitle}>Assign to Campaign</Text>
           <Text style={styles.sheetSubtitle}>Assigning {selectedEmployee?.name} ({selectedEmployee?.role})</Text>

           {selectedEmployee?.availability === 'Busy' || selectedEmployee?.availability === 'On Leave' ? (
             <View style={styles.warningBox}>
                <XCircle size={20} color="#EF4444" />
                <Text style={styles.warningText}>This employee is currently {selectedEmployee?.availability} and cannot be assigned to overlapping campaigns.</Text>
             </View>
           ) : null}

           <Text style={styles.label}>Select Campaign</Text>
           <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowCampDropdown(!showCampDropdown)}>
              <Text style={styles.dropdownText}>{assignCampaign}</Text>
              <ChevronDown size={20} color="#64748B" />
           </TouchableOpacity>
           {showCampDropdown && (
              <View style={styles.dropdownList}>
                {MOCK_CAMPAIGNS.map(c => (
                  <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => { setAssignCampaign(c); setShowCampDropdown(false); }}>
                    <Text style={styles.dropdownItemText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
           )}

           <Text style={styles.label}>Role in Campaign</Text>
           <TextInput style={styles.input} placeholder="e.g. Lead Designer" value={assignRole} onChangeText={setAssignRole} />

           <View style={styles.row}>
             <View style={styles.col}><Text style={styles.label}>Start Date</Text><TextInput style={styles.input} placeholder="DD/MM/YYYY" value={assignStart} onChangeText={setAssignStart} /></View>
             <View style={styles.col}><Text style={styles.label}>End Date</Text><TextInput style={styles.input} placeholder="DD/MM/YYYY" value={assignEnd} onChangeText={setAssignEnd} /></View>
           </View>

           <TouchableOpacity 
             style={[styles.btnPrimaryFull, (selectedEmployee?.availability === 'Busy' || selectedEmployee?.availability === 'On Leave') && { backgroundColor: '#CBD5E1' }]}
             onPress={handleAssignSubmit}
           >
             <Text style={styles.btnPrimaryFullText}>Confirm Assignment</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Team Directory</Text>
         <TouchableOpacity style={styles.addBtn} onPress={() => setAddModalVisible(true)}>
            <Plus size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Employee</Text>
         </TouchableOpacity>
      </View>
      
      {renderKPIs()}

      <FlatList
        data={MOCK_TEAM}
        keyExtractor={item => item.id}
        renderItem={renderEmployeeCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderAddModal()}
      {renderAssignModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A',
  },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6,
  },
  addBtnText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  kpiWrapper: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 12,
  },
  kpiScroll: {
    paddingHorizontal: 16, gap: 12,
  },
  kpiCard: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, width: 120,
  },
  kpiLabel: {
    fontSize: 12, color: '#64748B', marginBottom: 8,
  },
  kpiRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  kpiVal: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A',
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12,
  },
  avatarBox: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarInitials: {
    color: '#fff', fontSize: 18, fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 2,
  },
  empRole: {
    fontSize: 13, color: '#475569',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  badgeText: {
    fontSize: 10, fontWeight: 'bold',
  },
  skillsText: {
    fontSize: 13, color: '#334155', fontStyle: 'italic', marginBottom: 12,
  },
  assignmentBox: {
    backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, marginBottom: 16,
  },
  assignLabel: {
    fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4,
  },
  assignVal: {
    fontSize: 13, color: '#0F172A', fontWeight: '500', marginBottom: 8,
  },
  actionsRow: {
    gap: 8,
  },
  btnPrimary: {
    flexDirection: 'row', backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  btnOutline: {
    flexDirection: 'row', backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  btnDangerOutline: {
    flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 6,
  },
  btnDangerText: {
    color: '#EF4444', fontWeight: 'bold', fontSize: 13,
  },
  
  // Modals
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  modalScroll: { flex: 1 },
  label: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A', marginBottom: 16, backgroundColor: '#fff' },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  uploadPhotoBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  uploadPhotoText: { fontSize: 10, color: '#64748B', marginTop: 4 },
  fileUploadBox: { borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 16, marginBottom: 24, flexDirection: 'row', gap: 8 },
  fileUploadText: { fontSize: 13, color: '#64748B' },
  modalFooter: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimaryFull: { backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnPrimaryFullText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16, backgroundColor: '#fff' },
  dropdownText: { fontSize: 14, color: '#0F172A' },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 16, marginTop: -12, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, color: '#334155' },
  
  // Bottom Sheet
  bottomSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.8 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  sheetSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  warningBox: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'flex-start', gap: 8 },
  warningText: { flex: 1, fontSize: 13, color: '#EF4444', lineHeight: 18 }
});
