import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { 
  Users, CheckCircle, Clock, XCircle, Briefcase, 
  Search, Filter, Plus, Edit, User, MapPin, AlertCircle,
  Phone, Mail, Camera, Eye, Upload
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: "Total Employees", value: "12", icon: Users, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Available", value: "8", icon: CheckCircle, color: "#10B981", bg: "#D1FAE5" },
  { label: "Busy", value: "2", icon: Clock, color: "#F59E0B", bg: "#FEF3C7" },
  { label: "On Leave", value: "1", icon: AlertCircle, color: "#94A3B8", bg: "#F1F5F9" },
  { label: "Inactive", value: "1", icon: XCircle, color: "#EF4444", bg: "#FEE2E2" },
  { label: "Jobs Assigned Today", value: "4", icon: Briefcase, color: "#8B5CF6", bg: "#F3E8FF" },
];

const MOCK_TEAM = [
  {
    id: "EMP-001",
    name: "Rahul Sharma",
    role: "Senior Electrician",
    skills: "Wiring, Panels, HVAC",
    experience: "8 Years",
    status: "Available",
    currentJob: null,
    phone: "+91 9876543210",
    email: "rahul.s@hrchub.com",
    address: "Andheri East, Mumbai",
  },
  {
    id: "EMP-002",
    name: "Amit Kumar",
    role: "AC Technician",
    skills: "Split AC, VRV, Chillers",
    experience: "5 Years",
    status: "Busy",
    currentJob: "JOB-449 (Exhaust Fan Install)",
    phone: "+91 9876543211",
    email: "amit.k@hrchub.com",
    address: "Bandra West, Mumbai",
  },
  {
    id: "EMP-003",
    name: "Sanjay Patel",
    role: "Plumber",
    skills: "Piping, Drain Cleaning",
    experience: "4 Years",
    status: "On Leave",
    currentJob: null,
    phone: "+91 9876543212",
    email: "sanjay.p@hrchub.com",
    address: "Dadar, Mumbai",
  },
  {
    id: "EMP-004",
    name: "Vikram Singh",
    role: "Appliance Technician",
    skills: "Ovens, Refrigerators",
    experience: "2 Years",
    status: "Inactive",
    currentJob: null,
    phone: "+91 9876543213",
    email: "vikram.s@hrchub.com",
    address: "Malad, Mumbai",
  }
];

export default function ProviderTeamPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [team, setTeam] = useState(MOCK_TEAM);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', role: '', skills: '',
    experience: '', address: '', joiningDate: '', workingHours: '',
    emergencyContact: '', status: 'Available'
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return { bg: '#D1FAE5', text: '#10B981' };
      case 'Busy': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'On Leave': return { bg: '#F1F5F9', text: '#64748B' };
      case 'Inactive': return { bg: '#FEE2E2', text: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleOpenForm = (emp = null) => {
    if (emp) {
      setEditingEmp(emp);
      setForm({ ...emp });
    } else {
      setEditingEmp(null);
      setForm({
        name: '', phone: '', email: '', role: '', skills: '',
        experience: '', address: '', joiningDate: '', workingHours: '',
        emergencyContact: '', status: 'Available'
      });
    }
    setFormModalVisible(true);
  };

  const handleSaveEmployee = () => {
    if (editingEmp) {
      setTeam(prev => prev.map(e => e.id === editingEmp.id ? { ...form, id: e.id, currentJob: e.currentJob } : e));
    } else {
      const newEmp = { ...form, id: `EMP-00${team.length + 1}`, currentJob: null };
      setTeam([newEmp, ...team]);
    }
    setFormModalVisible(false);
  };

  const handleAction = (emp, actionType) => {
    if (actionType === 'Assign Job') {
      if (emp.status === 'Available') {
        setSelectedEmp(emp);
        setAssignModalVisible(true);
      } else {
        alert("Cannot assign job. Employee is " + emp.status);
      }
    } else if (actionType === 'Toggle Availability') {
      const newStatus = emp.status === 'Available' ? 'On Leave' : 'Available';
      setTeam(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus, currentJob: null } : e));
    } else if (actionType === 'Deactivate') {
      setTeam(prev => prev.map(e => e.id === emp.id ? { ...e, status: 'Inactive', currentJob: null } : e));
    }
  };

  const renderSummaryCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Icon size={20} color={item.color} />
          </View>
          <Text style={styles.summaryValue}>{item.value}</Text>
        </View>
        <Text style={styles.summaryLabel}>{item.label}</Text>
      </View>
    );
  };

  const renderEmployeeCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    const canAssign = item.status === 'Available';
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarBox}>
            <User size={24} color="#94A3B8" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.empName}>{item.name}</Text>
            <Text style={styles.empRole}>{item.role}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Skills:</Text>
            <Text style={styles.detailValue}>{item.skills}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Experience:</Text>
            <Text style={styles.detailValue}>{item.experience}</Text>
          </View>
          {item.currentJob && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Job:</Text>
              <Text style={[styles.detailValue, { color: '#F59E0B', fontWeight: '600' }]}>{item.currentJob}</Text>
            </View>
          )}
        </View>

        <View style={[styles.cardFooter, isSmallScreen && { flexDirection: 'column' }]}>
          <View style={[styles.actionBtnsLeft, isSmallScreen && { width: '100%', marginBottom: 8 }]}>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleOpenForm(item)}>
              <Edit size={16} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleAction(item, 'Toggle Availability')}>
              <Clock size={16} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconActionBtn} onPress={() => handleAction(item, 'Deactivate')}>
              <XCircle size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.actionBtnsRight, isSmallScreen && { width: '100%' }]}>
            <TouchableOpacity 
              style={[styles.btnPrimary, !canAssign && styles.btnDisabled]} 
              onPress={() => handleAction(item, 'Assign Job')}
              disabled={!canAssign}
            >
              <Briefcase size={16} color={canAssign ? "#FFFFFF" : "#94A3B8"} style={{ marginRight: 6 }} />
              <Text style={[styles.btnPrimaryText, !canAssign && { color: '#94A3B8' }]}>Assign Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Team Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Scrollable Summary Section */}
          <View style={styles.summarySection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
              {SUMMARY_DATA.map(item => (
                <View key={item.label} style={{ marginRight: 12 }}>
                  {renderSummaryCard({ item })}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* List Section */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Employees</Text>
            </View>
            
            {team.map(item => (
              <React.Fragment key={item.id}>
                {renderEmployeeCard({ item })}
              </React.Fragment>
            ))}
            
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => handleOpenForm()}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Assign Job Modal (Placeholder) */}
        <Modal visible={assignModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlayCenter}>
            <View style={styles.centerSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Assign Job to {selectedEmp?.name}</Text>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <View style={styles.sheetBody}>
                <Text style={styles.inputLabel}>Select Scheduled Job</Text>
                <View style={styles.mockSelect}>
                  <Text style={{color: '#64748B'}}>JOB-452 (AC Deep Cleaning)</Text>
                </View>
                <TouchableOpacity 
                  style={styles.btnPrimaryLarge} 
                  onPress={() => {
                    setTeam(prev => prev.map(e => e.id === selectedEmp?.id ? { ...e, status: 'Busy', currentJob: 'JOB-452 (AC Deep Cleaning)' } : e));
                    setAssignModalVisible(false);
                  }}
                >
                  <Text style={styles.btnPrimaryLargeText}>Assign & Dispatch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add/Edit Form Modal */}
        <Modal visible={formModalVisible} animationType="slide" transparent={true}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{editingEmp ? 'Edit Employee' : 'Add New Employee'}</Text>
                <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                
                <View style={styles.photoUploadCenter}>
                  <TouchableOpacity style={styles.avatarUpload}>
                    <Camera size={24} color="#94A3B8" />
                    <Text style={styles.photoTextSmall}>Add Photo</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. Rahul Sharma" 
                      value={form.name}
                      onChangeText={(t) => setForm({...form, name: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Role</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. Electrician" 
                      value={form.role}
                      onChangeText={(t) => setForm({...form, role: t})}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="+91" 
                      keyboardType="phone-pad"
                      value={form.phone}
                      onChangeText={(t) => setForm({...form, phone: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="email@example.com" 
                      keyboardType="email-address"
                      value={form.email}
                      onChangeText={(t) => setForm({...form, email: t})}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Skills (Comma separated)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Wiring, HVAC, Panels" 
                  value={form.skills}
                  onChangeText={(t) => setForm({...form, skills: t})}
                />

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Experience</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 5 Years" 
                      value={form.experience}
                      onChangeText={(t) => setForm({...form, experience: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Joining Date</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="DD/MM/YYYY" 
                      value={form.joiningDate}
                      onChangeText={(t) => setForm({...form, joiningDate: t})}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Home Address</Text>
                <TextInput 
                  style={styles.textArea} 
                  placeholder="Full address..." 
                  multiline
                  numberOfLines={2}
                  value={form.address}
                  onChangeText={(t) => setForm({...form, address: t})}
                />

                <Text style={styles.inputLabel}>Emergency Contact</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Name - Phone" 
                  value={form.emergencyContact}
                  onChangeText={(t) => setForm({...form, emergencyContact: t})}
                />

                <Text style={styles.inputLabel}>ID Proof / Verification Document</Text>
                <TouchableOpacity style={styles.docUploadBtn}>
                  <Upload size={20} color="#64748B" />
                  <Text style={styles.docUploadText}>Upload Aadhar/PAN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnPrimaryLargeGold} onPress={handleSaveEmployee}>
                  <Text style={styles.btnPrimaryLargeText}>Save Employee</Text>
                </TouchableOpacity>
                <View style={{height: 40}}/>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  summarySection: {
    paddingVertical: 16,
  },
  summaryScroll: {
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  listSection: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  empRole: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: NAVY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtnsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconActionBtn: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionBtnsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: NAVY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  btnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  sheetBody: {
    padding: 20,
  },
  photoUploadCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarUpload: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTextSmall: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 24,
  },
  docUploadText: {
    marginLeft: 8,
    color: '#64748B',
    fontWeight: '500',
  },
  btnPrimaryLargeGold: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  centerSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  mockSelect: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  btnPrimaryLarge: {
    backgroundColor: NAVY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
});
