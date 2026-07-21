import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { 
  Search, SlidersHorizontal, MapPin, Calendar, CheckCircle, 
  Clock, IndianRupee, XCircle, Users, Briefcase, ChevronRight, Wrench, CalendarDays, UserRound
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const LIGHT_BG = '#F8FAFC';
const WHITE = '#FFFFFF';

const TABS = ['Scheduled', 'Assigned', 'In Progress', 'Completed'];

const MOCK_JOBS = [
  {
    id: "SRV-452",
    client: "Grand Hotel & Spa",
    businessType: "Hotel",
    service: "AC Deep Cleaning",
    location: "Bandra West",
    date: "18 Oct 2026",
    time: "10:00 AM",
    amount: "₹18,000",
    assignedTeam: "Unassigned",
    status: "Scheduled",
    notes: "Requires deep cleaning of 25 split units.",
    contact: "Mr. Sharma (Manager)"
  },
  {
    id: "SRV-451",
    client: "Cafe Zephyr",
    businessType: "Cafe",
    service: "Plumbing Repair",
    location: "Andheri East",
    date: "16 Oct 2026",
    time: "02:00 PM",
    amount: "₹2,500",
    assignedTeam: "Rahul S.",
    status: "Assigned",
    notes: "Fix leaking sink in main kitchen.",
    contact: "Sarah (Owner)"
  },
  {
    id: "SRV-449",
    client: "The Gourmet Kitchen",
    businessType: "Restaurant",
    service: "Exhaust Fan Installation",
    location: "Lower Parel",
    date: "15 Oct 2026",
    time: "11:30 AM",
    amount: "₹25,000",
    assignedTeam: "Amit K.",
    status: "In Progress",
    notes: "Install new heavy-duty exhaust fan in main cooking area.",
    contact: "Chef Ravi"
  },
  {
    id: "SRV-448",
    client: "Sunset Resort",
    businessType: "Resort",
    service: "HVAC Annual Maintenance",
    location: "Juhu",
    date: "14 Oct 2026",
    time: "09:00 AM",
    amount: "₹45,000",
    assignedTeam: "Rahul S.",
    status: "Completed",
    notes: "Full annual maintenance of all central units.",
    contact: "Admin Desk"
  }
];

export default function ProviderJobsPage() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const modalWidth = Math.min(width * 0.9, 540);

  const [activeTab, setActiveTab] = useState('Scheduled');
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Modal states
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [startJobModalVisible, setStartJobModalVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // Form states
  const [assignForm, setAssignForm] = useState({ tech: '', phone: '', arrival: '', notes: '' });
  const [completionForm, setCompletionForm] = useState({ notes: '', amount: '', additional: '', otp: '' });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return { bg: '#DBEAFE', text: '#1D4ED8', border: '#3B82F6' };
      case 'Assigned': return { bg: '#F3E8FF', text: '#7E22CE', border: '#A855F7' };
      case 'In Progress': return { bg: '#FFEDD5', text: '#C2410C', border: '#F97316' };
      case 'Completed': return { bg: '#DCFCE7', text: '#15803D', border: '#22C55E' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#64748B', border: '#94A3B8' };
    }
  };

  const getCounts = () => {
    const counts = { 'Scheduled': 0, 'Assigned': 0, 'In Progress': 0, 'Completed': 0 };
    jobs.forEach(j => {
      if(counts[j.status] !== undefined) counts[j.status]++;
    });
    return counts;
  };

  const counts = getCounts();
  const filteredJobs = jobs.filter(j => j.status === activeTab);

  const openModal = (job, type) => {
    setSelectedJob(job);
    if (type === 'Assign Team') setAssignModalVisible(true);
    else if (type === 'Start Service') setStartJobModalVisible(true);
    else if (type === 'Complete Service') setCompletionModalVisible(true);
    else if (type === 'Service Details') setDetailsModalVisible(true);
  };

  const handleStartJob = () => {
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'In Progress' } : j));
    setStartJobModalVisible(false);
  };

  const handleAssignSubmit = () => {
    if (!assignForm.tech) return alert("Please select a technician");
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'Assigned', assignedTeam: assignForm.tech } : j));
    setAssignModalVisible(false);
    setAssignForm({ tech: '', phone: '', arrival: '', notes: '' });
  };

  const handleCompleteSubmit = () => {
    if (!completionForm.notes || !completionForm.otp) return alert("Notes and OTP are required");
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'Completed' } : j));
    setCompletionModalVisible(false);
    setCompletionForm({ notes: '', amount: '', additional: '', otp: '' });
  };

  // Full progress tracker for modal only
  const renderProgress = (status) => {
    const states = ['Scheduled', 'Assigned', 'In Progress', 'Completed'];
    const currentIndex = states.indexOf(status);
    const colorStyle = getStatusColor(status);
    
    return (
      <View style={styles.modalProgressContainer}>
        {states.map((s, idx) => (
          <View key={s} style={styles.modalProgressStep}>
            <View style={[
              styles.modalProgressDot, 
              idx < currentIndex && styles.modalProgressDotDone,
              idx === currentIndex && { backgroundColor: colorStyle.border }
            ]}>
              {idx < currentIndex && <CheckCircle size={8} color={WHITE} />}
            </View>
            <Text style={[
              styles.modalProgressLabel, 
              idx === currentIndex && { color: colorStyle.border, fontWeight: 'bold' },
              idx < currentIndex && styles.modalProgressLabelDone
            ]} numberOfLines={1}>{s}</Text>
            {idx < states.length - 1 && (
              <View style={[styles.modalProgressLine, idx < currentIndex && styles.modalProgressLineDone]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderJobCard = ({ item }) => {
    const sColor = getStatusColor(item.status);
    
    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: sColor.bg }]}>
            <Text style={[styles.statusText, { color: sColor.text }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        {/* Main Row */}
        <View style={styles.serviceSection}>
          <View style={styles.serviceIconBox}>
            <Wrench size={20} color={NAVY} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
            <Text style={styles.clientName} numberOfLines={1}>{item.client}</Text>
          </View>
        </View>
        
        {/* Information Row */}
        <View style={styles.compactRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.compactText}>{item.location}</Text>
        </View>
        <View style={styles.compactRow}>
          <CalendarDays size={14} color="#64748B" />
          <Text style={styles.compactText}>{item.date} · {item.time}</Text>
        </View>
        
        <View style={[styles.compactRow, { marginTop: 4 }]}>
          <View style={styles.amountTeamGroup}>
            <View style={styles.infoPair}>
              <IndianRupee size={14} color="#64748B" />
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
            <View style={styles.infoPair}>
              <UserRound size={14} color="#64748B" />
              <Text style={styles.teamLabelText}>Team: </Text>
              {item.assignedTeam === 'Unassigned' ? (
                <Text style={styles.unassignedText}>Unassigned</Text>
              ) : (
                <Text style={styles.assignedText}>{item.assignedTeam}</Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Action Footer */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnViewDetails} onPress={() => openModal(item, 'Service Details')}>
            <Text style={styles.btnViewDetailsText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          
          {item.status === 'Scheduled' && (
            <TouchableOpacity style={styles.btnPrimaryNav} onPress={() => openModal(item, 'Assign Team')}>
              <Text style={styles.btnPrimaryNavText}>Assign Team</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Assigned' && (
            <TouchableOpacity style={styles.btnPrimaryNav} onPress={() => openModal(item, 'Start Service')}>
              <Text style={styles.btnPrimaryNavText}>Start Service</Text>
            </TouchableOpacity>
          )}
          {item.status === 'In Progress' && (
            <TouchableOpacity style={styles.btnPrimaryNav} onPress={() => openModal(item, 'Complete Service')}>
              <Text style={styles.btnPrimaryNavText}>Complete Service</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Completed' && (
            <TouchableOpacity style={styles.btnPrimaryNav} onPress={() => openModal(item, 'Service Details')}>
              <Text style={styles.btnPrimaryNavText}>View Summary</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Service Work</Text>
            <Text style={styles.headerSubtitle}>Manage scheduled, ongoing and completed service work</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <SlidersHorizontal size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Segmented Status Pills */}
        <View style={styles.tabWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
            {TABS.map((tab) => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tabPill, activeTab === tab && styles.activeTabPill]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabPillText, activeTab === tab && styles.activeTabPillText]}>
                  {tab}
                </Text>
                <View style={[styles.tabBadge, activeTab === tab && styles.activeTabBadge]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab && styles.activeTabBadgeText]}>{counts[tab]}</Text>
                </View>
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
              <View style={styles.emptyIconBox}>
                <Briefcase size={32} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} services</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'Scheduled' && 'Newly scheduled services will appear here.'}
                {activeTab === 'Assigned' && 'Services with assigned teams will appear here.'}
                {activeTab === 'In Progress' && 'Started services will appear here.'}
                {activeTab === 'Completed' && 'Completed services will appear here.'}
              </Text>
            </View>
          }
        />

        {/* View Details Center Modal */}
        <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '82%' }]}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Service Details</Text>
                      <Text style={styles.modalSubtitle}>{selectedJob?.id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                      <XCircle size={24} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    {selectedJob && (
                      <>
                        {renderProgress(selectedJob.status)}

                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Service</Text>
                          <Text style={styles.modalValue}>{selectedJob.service}</Text>
                        </View>
                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Business</Text>
                          <Text style={styles.modalValue}>{selectedJob.client}</Text>
                        </View>
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Location</Text>
                            <Text style={styles.modalValue}>{selectedJob.location}</Text>
                          </View>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Contact</Text>
                            <Text style={styles.modalValue}>{selectedJob.contact}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Scheduled</Text>
                            <Text style={styles.modalValue}>{selectedJob.date} • {selectedJob.time}</Text>
                          </View>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Amount</Text>
                            <Text style={styles.modalValue}>{selectedJob.amount}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.modalGrid}>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Assigned Team</Text>
                            <Text style={styles.modalValue}>{selectedJob.assignedTeam}</Text>
                          </View>
                          <View style={styles.modalGridCol}>
                            <Text style={styles.modalLabel}>Status</Text>
                            <Text style={[styles.modalValue, {color: getStatusColor(selectedJob.status).border}]}>{selectedJob.status}</Text>
                          </View>
                        </View>

                        <View style={styles.modalDataBlock}>
                          <Text style={styles.modalLabel}>Notes</Text>
                          <Text style={styles.modalDescText}>{selectedJob.notes}</Text>
                        </View>
                        <View style={{height: 20}}/>
                      </>
                    )}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Assign Team Center Modal */}
        <Modal visible={assignModalVisible} animationType="fade" transparent={true} onRequestClose={() => setAssignModalVisible(false)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlayCenter}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', alignItems: 'center'}}>
                <View style={[styles.centerModalContent, { width: modalWidth }]}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Assign Team</Text>
                    </View>
                    <TouchableOpacity onPress={() => setAssignModalVisible(false)}>
                      <XCircle size={24} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    {selectedJob && (
                      <View style={styles.quoteContextBox}>
                        <Text style={styles.quoteContextTitle}>{selectedJob.service}</Text>
                        <Text style={styles.quoteContextSub}>{selectedJob.client}</Text>
                        <Text style={styles.quoteContextSub}>{selectedJob.date} • {selectedJob.time}</Text>
                      </View>
                    )}

                    <Text style={styles.inputLabel}>Select Technician / Team *</Text>
                    <TextInput style={styles.input} placeholder="e.g. Rahul S." value={assignForm.tech} onChangeText={(t) => setAssignForm({...assignForm, tech: t})} />
                    
                    <Text style={styles.inputLabel}>Expected Arrival Time</Text>
                    <TextInput style={styles.input} placeholder="e.g. 10:15 AM" value={assignForm.arrival} onChangeText={(t) => setAssignForm({...assignForm, arrival: t})} />
                    
                    <Text style={styles.inputLabel}>Internal Note</Text>
                    <TextInput style={styles.input} placeholder="Optional notes" value={assignForm.notes} onChangeText={(t) => setAssignForm({...assignForm, notes: t})} />
                    <View style={{height: 10}}/>
                  </ScrollView>
                  
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnOutline} onPress={() => setAssignModalVisible(false)}>
                      <Text style={styles.btnOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnPrimaryGoldFull, { opacity: assignForm.tech ? 1 : 0.6 }]} onPress={handleAssignSubmit}>
                      <Text style={styles.btnPrimaryGoldText}>Confirm Assignment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Start Job Center Modal */}
        <Modal visible={startJobModalVisible} animationType="fade" transparent={true} onRequestClose={() => setStartJobModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Start this service?</Text>
              
              <View style={styles.quoteContextBox}>
                <Text style={styles.modalLabel}>Service:</Text>
                <Text style={styles.quoteContextTitle}>{selectedJob?.service}</Text>
                <View style={{height: 8}} />
                <Text style={styles.modalLabel}>Business:</Text>
                <Text style={styles.quoteContextTitle}>{selectedJob?.client}</Text>
                <View style={{height: 8}} />
                <Text style={styles.modalLabel}>Assigned Team:</Text>
                <Text style={styles.quoteContextTitle}>{selectedJob?.assignedTeam}</Text>
              </View>

              <View style={styles.confirmActions}>
                <TouchableOpacity style={[styles.btnOutline, { flex: 1, marginRight: 12 }]} onPress={() => setStartJobModalVisible(false)}>
                  <Text style={styles.btnOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnPrimaryNav, { flex: 1, height: 44, borderRadius: 12, justifyContent: 'center' }]} onPress={handleStartJob}>
                  <Text style={[styles.btnPrimaryNavText, {textAlign: 'center'}]}>Start Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Complete Job Center Modal */}
        <Modal visible={completionModalVisible} animationType="fade" transparent={true} onRequestClose={() => setCompletionModalVisible(false)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlayCenter}>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', alignItems: 'center'}}>
                <View style={[styles.centerModalContent, { width: modalWidth, maxHeight: '82%' }]}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Complete Service</Text>
                      <Text style={styles.modalSubtitle}>{selectedJob?.id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setCompletionModalVisible(false)}>
                      <XCircle size={24} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                    <Text style={styles.inputLabel}>Service Completion Notes *</Text>
                    <TextInput style={styles.textArea} placeholder="Describe work done..." multiline numberOfLines={3} value={completionForm.notes} onChangeText={(t) => setCompletionForm({...completionForm, notes: t})} />
                    
                    <Text style={styles.inputLabel}>Customer Confirmation OTP *</Text>
                    <TextInput style={styles.input} placeholder="OTP provided by client" keyboardType="numeric" value={completionForm.otp} onChangeText={(t) => setCompletionForm({...completionForm, otp: t})} />

                    <View style={styles.formRow}>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Final Amount</Text>
                        <TextInput style={styles.input} placeholder="₹" keyboardType="numeric" value={completionForm.amount} onChangeText={(t) => setCompletionForm({...completionForm, amount: t})} />
                      </View>
                      <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Additional Chg</Text>
                        <TextInput style={styles.input} placeholder="₹" keyboardType="numeric" value={completionForm.additional} onChangeText={(t) => setCompletionForm({...completionForm, additional: t})} />
                      </View>
                    </View>
                    <View style={{height: 10}}/>
                  </ScrollView>
                  
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnOutline} onPress={() => setCompletionModalVisible(false)}>
                      <Text style={styles.btnOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnPrimaryGoldFull, { opacity: (completionForm.notes && completionForm.otp) ? 1 : 0.6 }]} onPress={handleCompleteSubmit}>
                      <Text style={styles.btnPrimaryGoldText}>Complete Service</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  container: { flex: 1 },
  
  header: { 
    paddingTop: 30, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 16, backgroundColor: WHITE,
    borderBottomWidth: 1, borderBottomColor: '#E8EDF4',
  },
  headerLeft: { flex: 1, paddingRight: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  headerActions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 8, backgroundColor: '#F8FAFC', borderRadius: 8 },
  
  tabWrapper: { backgroundColor: WHITE, paddingBottom: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#E8EDF4' },
  tabContainer: { paddingHorizontal: 16, gap: 10 },
  tabPill: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, 
    borderRadius: 20, backgroundColor: WHITE, 
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  activeTabPill: { backgroundColor: NAVY, borderColor: NAVY, shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  tabPillText: { fontSize: 13, fontWeight: '600', color: '#64748B', marginRight: 6 },
  activeTabPillText: { color: WHITE },
  tabBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  activeTabBadge: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#475569' },
  activeTabBadgeText: { color: WHITE },

  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 110 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8EDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  
  // Refined Premium Compact Card
  card: { 
    backgroundColor: WHITE, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: '#E6EBF2',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardId: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  serviceSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  serviceIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E8EDF4' },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  clientName: { fontSize: 13, color: '#475569', fontWeight: '500' },
  
  compactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  compactText: { fontSize: 13, color: '#475569' },
  
  amountTeamGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 4 },
  infoPair: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  amountText: { fontSize: 14, color: NAVY, fontWeight: 'bold' },
  teamLabelText: { fontSize: 13, color: '#475569', marginLeft: 4 },
  unassignedText: { fontSize: 13, fontWeight: 'bold', color: '#EF4444' },
  assignedText: { fontSize: 13, fontWeight: 'bold', color: '#7E22CE' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E8EDF4', paddingTop: 14, marginTop: 8 },
  btnViewDetails: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  btnViewDetailsText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
  
  btnPrimaryNav: { backgroundColor: NAVY, paddingHorizontal: 16, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryNavText: { color: WHITE, fontSize: 13, fontWeight: 'bold' },

  // Center Modal Styles
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  modalSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  
  modalBody: { flexShrink: 1 },
  modalDataBlock: { marginBottom: 16 },
  modalLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', fontWeight: '600' },
  modalValue: { fontSize: 15, color: '#1E293B', fontWeight: '500' },
  modalDescText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  
  modalGrid: { flexDirection: 'row', marginBottom: 16 },
  modalGridCol: { flex: 1, paddingRight: 8 },
  
  modalFooterActions: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  btnOutline: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnOutlineText: { color: '#475569', fontWeight: 'bold', fontSize: 14 },
  btnPrimaryGoldFull: { flex: 1.5, height: 44, backgroundColor: GOLD, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryGoldText: { color: WHITE, fontWeight: 'bold', fontSize: 14 },
  
  // Progress tracker inside modal
  modalProgressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
  modalProgressStep: { alignItems: 'center', flex: 1, position: 'relative' },
  modalProgressLine: { position: 'absolute', top: 5, left: '50%', width: '100%', height: 2, backgroundColor: '#E2E8F0', zIndex: 1 },
  modalProgressLineDone: { backgroundColor: '#22C55E' },
  modalProgressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E2E8F0', marginBottom: 6, zIndex: 2, alignItems: 'center', justifyContent: 'center' },
  modalProgressDotDone: { backgroundColor: '#22C55E' },
  modalProgressLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
  modalProgressLabelDone: { color: '#475569' },

  // Forms
  quoteContextBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  quoteContextTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  quoteContextSub: { fontSize: 12, color: '#64748B' },
  formRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  formCol: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY, marginBottom: 16 },
  textArea: { backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: NAVY, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  
  // Confirmation Modal
  confirmBox: { backgroundColor: WHITE, borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 16, textAlign: 'center' },
  confirmActions: { flexDirection: 'row', width: '100%', marginTop: 16 },
});
