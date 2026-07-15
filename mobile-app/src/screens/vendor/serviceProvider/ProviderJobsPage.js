import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Search, Filter, MapPin, Calendar, CheckCircle, 
  Clock, IndianRupee, XCircle, Users, Camera, Upload, AlertCircle
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const TABS = [
  'Scheduled', 
  'Team Assigned', 
  'In Progress', 
  'Awaiting Approval', 
  'Completed', 
  'Cancelled', 
  'Rework'
];

const MOCK_JOBS = [
  {
    id: "JOB-452",
    client: "Grand Hotel & Spa",
    service: "AC Deep Cleaning",
    location: "Bandra West",
    date: "18 Oct 2026, 10:00 AM",
    amount: "₹18,000",
    assignedTeam: "Unassigned",
    status: "Scheduled"
  },
  {
    id: "JOB-451",
    client: "Cafe Zephyr",
    service: "Plumbing Repair",
    location: "Andheri East",
    date: "16 Oct 2026, 02:00 PM",
    amount: "₹2,500",
    assignedTeam: "Rahul S.",
    status: "Team Assigned"
  },
  {
    id: "JOB-449",
    client: "The Gourmet Kitchen",
    service: "Exhaust Fan Installation",
    location: "Lower Parel",
    date: "15 Oct 2026, 11:30 AM",
    amount: "₹25,000",
    assignedTeam: "Amit K.",
    status: "In Progress"
  },
  {
    id: "JOB-448",
    client: "Sunset Resort",
    service: "HVAC Annual Maintenance",
    location: "Juhu",
    date: "14 Oct 2026, 09:00 AM",
    amount: "₹45,000",
    assignedTeam: "Rahul S.",
    status: "Completed"
  }
];

export default function ProviderJobsPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [activeTab, setActiveTab] = useState('Scheduled');
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Modal states
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);

  // Form states
  const [completionForm, setCompletionForm] = useState({
    summary: '',
    materials: '',
    extraCharges: '',
    otp: '',
    time: '',
    notes: ''
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return { bg: '#E0E7FF', text: '#6366F1' };
      case 'Team Assigned': return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'In Progress': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'Awaiting Approval': return { bg: '#FCE7F3', text: '#DB2777' };
      case 'Completed': return { bg: '#D1FAE5', text: '#10B981' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#EF4444' };
      case 'Rework': return { bg: '#FFEDD5', text: '#F97316' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleAction = (job, actionType) => {
    setSelectedJob(job);
    if (actionType === 'Assign Team') {
      setAssignModalVisible(true);
    } else if (actionType === 'Complete Job') {
      setCompletionModalVisible(true);
    } else if (actionType === 'Start Job') {
      // Direct status update
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'In Progress' } : j));
    }
  };

  const handleCompleteSubmit = () => {
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'Awaiting Approval' } : j));
    setCompletionModalVisible(false);
    setCompletionForm({ summary: '', materials: '', extraCharges: '', otp: '', time: '', notes: '' });
  };

  const filteredJobs = jobs.filter(j => j.status === activeTab);

  const renderJobCard = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.clientName}>{item.client}</Text>
          <Text style={styles.serviceName}>{item.service}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={14} color="#64748B" />
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <IndianRupee size={14} color="#64748B" />
              <Text style={styles.detailText}>{item.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={14} color={item.assignedTeam === 'Unassigned' ? '#EF4444' : '#64748B'} />
              <Text style={[styles.detailText, item.assignedTeam === 'Unassigned' && { color: '#EF4444', fontWeight: '500' }]}>
                {item.assignedTeam}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.cardFooter, isSmallScreen && { flexDirection: 'column' }]}>
          <TouchableOpacity style={[styles.btnOutline, isSmallScreen && { marginBottom: 8 }]}>
            <Text style={styles.btnOutlineText}>View Details</Text>
          </TouchableOpacity>
          
          <View style={[styles.actionBtns, isSmallScreen && { width: '100%' }]}>
            {item.status === 'Scheduled' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => handleAction(item, 'Assign Team')}>
                <Text style={styles.btnPrimaryText}>Assign Team</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Team Assigned' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => handleAction(item, 'Start Job')}>
                <Text style={styles.btnPrimaryText}>Start Job</Text>
              </TouchableOpacity>
            )}
            {item.status === 'In Progress' && (
              <TouchableOpacity style={styles.btnPrimaryGold} onPress={() => handleAction(item, 'Complete Job')}>
                <Text style={styles.btnPrimaryGoldText}>Complete Job</Text>
              </TouchableOpacity>
            )}
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
          <Text style={styles.headerTitle}>Jobs Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Filter size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content List */}
        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AlertCircle size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No jobs found in '{activeTab}'.</Text>
            </View>
          }
        />

        {/* Assign Team Modal (Placeholder) */}
        <Modal visible={assignModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlayCenter}>
            <View style={styles.centerSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Assign Team</Text>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <View style={styles.sheetBody}>
                <Text style={styles.inputLabel}>Select Team Member</Text>
                <View style={styles.mockSelect}>
                  <Text style={{color: '#64748B'}}>Rahul S. (Available)</Text>
                </View>
                <TouchableOpacity 
                  style={styles.btnPrimaryLarge} 
                  onPress={() => {
                    setJobs(prev => prev.map(j => j.id === selectedJob?.id ? { ...j, status: 'Team Assigned', assignedTeam: 'Rahul S.' } : j));
                    setAssignModalVisible(false);
                  }}
                >
                  <Text style={styles.btnPrimaryLargeText}>Confirm Assignment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Completion Form Modal */}
        <Modal visible={completionModalVisible} animationType="slide" transparent={true}>
          <KeyboardAvoidingView 
            style={styles.modalOverlay} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Job Completion Report</Text>
                <TouchableOpacity onPress={() => setCompletionModalVisible(false)}>
                  <XCircle size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
                {selectedJob && (
                  <View style={styles.jobSummaryBox}>
                    <Text style={styles.summaryTitle}>{selectedJob.id}: {selectedJob.service}</Text>
                    <Text style={styles.summaryClient}>{selectedJob.client}</Text>
                  </View>
                )}

                <Text style={styles.inputLabel}>Before & After Photos</Text>
                <View style={styles.photoUploadRow}>
                  <TouchableOpacity style={styles.photoBox}>
                    <Camera size={24} color="#94A3B8" />
                    <Text style={styles.photoText}>Add Before</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoBox}>
                    <Camera size={24} color="#94A3B8" />
                    <Text style={styles.photoText}>Add After</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Work Summary</Text>
                <TextInput 
                  style={styles.textArea} 
                  placeholder="Describe the work done..." 
                  multiline
                  numberOfLines={3}
                  value={completionForm.summary}
                  onChangeText={(t) => setCompletionForm({...completionForm, summary: t})}
                />

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Materials Used</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. Copper Pipe" 
                      value={completionForm.materials}
                      onChangeText={(t) => setCompletionForm({...completionForm, materials: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Extra Charges (₹)</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="0.00" 
                      keyboardType="numeric"
                      value={completionForm.extraCharges}
                      onChangeText={(t) => setCompletionForm({...completionForm, extraCharges: t})}
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Actual Completion Time</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. 2.5 Hours" 
                      value={completionForm.time}
                      onChangeText={(t) => setCompletionForm({...completionForm, time: t})}
                    />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Client OTP</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="1234" 
                      keyboardType="numeric"
                      maxLength={4}
                      value={completionForm.otp}
                      onChangeText={(t) => setCompletionForm({...completionForm, otp: t})}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Additional Notes</Text>
                <TextInput 
                  style={styles.textArea} 
                  placeholder="Any feedback or remarks..." 
                  multiline
                  numberOfLines={2}
                  value={completionForm.notes}
                  onChangeText={(t) => setCompletionForm({...completionForm, notes: t})}
                />

                <TouchableOpacity style={styles.btnPrimaryLargeGold} onPress={handleCompleteSubmit}>
                  <Text style={styles.btnPrimaryLargeText}>Submit Completion</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabsScroll: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: NAVY,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  cardId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
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
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtns: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  btnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  btnPrimary: {
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
  btnPrimaryGold: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: GOLD,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryGoldText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
  },
  centerSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
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
  jobSummaryBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  summaryClient: {
    fontSize: 14,
    color: '#64748B',
  },
  photoUploadRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  photoText: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
  btnPrimaryLargeGold: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryLargeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
