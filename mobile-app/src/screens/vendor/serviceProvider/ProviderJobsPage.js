import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, Modal, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, Pressable, Alert 
} from 'react-native';
import { 
  Search, SlidersHorizontal, ChevronRight, MoreVertical, 
  UserRound, Users, XCircle, CheckCircle, MapPin,
  CircleCheck, BadgeCheck, Wrench, FileText
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const GREEN = '#10B981';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';

const INITIAL_JOBS = [
  {
    id: "SRV-452",
    client: "Grand Hotel & Spa",
    businessType: "Hotel",
    service: "AC Deep Cleaning",
    location: "Bandra West",
    date: "18 Oct 2026",
    time: "10:00 AM",
    amount: "₹18,000",
    assignedTeam: null,
    status: "Scheduled",
    currentStage: null,
    progress: 0,
    notes: "Requires deep cleaning of 25 split units.",
    contact: "Mr. Sharma (Manager)"
  },
  {
    id: "SRV-453",
    client: "Cafe Zephyr",
    businessType: "Cafe",
    service: "Commercial Oven Repair",
    location: "Andheri East",
    date: "19 Oct 2026",
    time: "02:00 PM",
    amount: "₹8,500",
    assignedTeam: "Rahul S. + 2 Members",
    status: "Team Assigned",
    currentStage: null,
    progress: 0,
    notes: "Fix heating coil.",
    contact: "Sarah (Owner)"
  },
  {
    id: "SRV-454",
    client: "The Meridian Hotel",
    businessType: "Hotel",
    service: "Pest Control Service",
    location: "Mumbai",
    date: "20 Oct 2026",
    time: "11:30 AM",
    amount: "₹12,000",
    assignedTeam: "Amit K.",
    status: "In Progress",
    currentStage: "Treatment in Progress",
    progress: 60,
    notes: "Full property treatment.",
    contact: "Manager"
  },
  {
    id: "SRV-455",
    client: "Spice Route Restaurant",
    businessType: "Restaurant",
    service: "Kitchen Equipment Repair",
    location: "Lower Parel",
    date: "20 Oct 2026",
    time: "09:00 AM",
    amount: "₹12,000",
    assignedTeam: "Vikram R.",
    status: "Completed",
    currentStage: "Completed",
    progress: 100,
    notes: "Replaced faulty burners.",
    contact: "Chef"
  }
];

const TABS = ['Scheduled', 'Team Assigned', 'In Progress', 'Awaiting Confirmation', 'Completed', 'Cancelled'];
const MOCK_TEAM_MEMBERS = [
  { id: 'tm1', name: 'Rahul Sharma', role: 'Senior AC Technician', skills: ['AC Deep Cleaning', 'Equipment Handling', 'Safety Compliance'], availability: 'Available', workload: '1 Active Assignment', active: true, canLead: true },
  { id: 'tm2', name: 'Amit Kumar', role: 'AC Technician', skills: ['AC Deep Cleaning', 'Safety Compliance'], availability: 'Busy', conflictTime: '9:00 AM - 11:00 AM', workload: '2 Active Assignments', active: true, canLead: false },
  { id: 'tm3', name: 'Vikram Rao', role: 'Support Technician', skills: ['Equipment Handling'], availability: 'Available', workload: '0 Active Assignments', active: true, canLead: false },
  { id: 'tm4', name: 'Suresh Patil', role: 'Senior Electrician', skills: ['Electrical Repair', 'Safety Compliance'], availability: 'Available', workload: '1 Active Assignment', active: true, canLead: true }
];

const REQUIRED_SKILLS = ['AC Deep Cleaning', 'Equipment Handling', 'Safety Compliance'];
const TOOLS_EQUIPMENT = ['AC Cleaning Kit', 'Pressure Washer', 'Vacuum Machine', 'Safety Gloves', 'Safety Mask', 'Ladder', 'Cleaning Chemicals', 'Other'];

export default function ProviderJobsPage() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const [activeTab, setActiveTab] = useState('Scheduled');
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Modals state
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Form states
  const [assignForm, setAssignForm] = useState({ 
    lead: '', members: [], reportingDate: '', reportingTime: '', duration: '', 
    instructions: '', notifyTeam: true 
  });
  const [assignConflictError, setAssignConflictError] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [leadDropdownOpen, setLeadDropdownOpen] = useState(false);
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [progressForm, setProgressForm] = useState({ percent: '', stage: '', update: '', nextStep: '' });
  const [completeForm, setCompleteForm] = useState({ note: '', summary: '', amount: '' });

  const showToast = (msg) => {
    if (Platform.OS === 'web') { window.alert(msg); }
    else { Alert.alert('Success', msg); }
  };

  const getFilteredJobs = () => {
    return jobs.filter(j => {
      if (j.status !== activeTab) return false;
      if (search && !j.service.toLowerCase().includes(search.toLowerCase()) && !j.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  };

  const filteredJobs = getFilteredJobs();
  
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => counts[t] = 0);
    jobs.forEach(j => { if (counts[j.status] !== undefined) counts[j.status]++; });
    return counts;
  }, [jobs]);

  // Modal handlers
  const handleAssignTeam = () => {
    if (!assignForm.lead) {
      if (Platform.OS === 'web') { window.alert('Please select a team lead.'); } else { Alert.alert('Required', 'Please select a team lead.'); }
      return;
    }
    if (!assignForm.reportingDate || !assignForm.reportingTime || !assignForm.duration) {
      if (Platform.OS === 'web') { window.alert('Please complete all required fields (Date, Time, Duration).'); } else { Alert.alert('Required', 'Please complete all required fields.'); }
      return;
    }

    // Mock conflict check
    const selectedMembers = MOCK_TEAM_MEMBERS.filter(m => m.id === assignForm.lead || assignForm.members.includes(m.id));
    const hasConflict = selectedMembers.find(m => m.availability === 'Busy');
    if (hasConflict) {
      setAssignConflictError(`${hasConflict.name} is assigned to another service work (${hasConflict.conflictTime}).`);
      return;
    }

    setIsAssigning(true);
    setTimeout(() => {
      const leadMember = MOCK_TEAM_MEMBERS.find(m => m.id === assignForm.lead);
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'Team Assigned', assignedTeam: leadMember ? leadMember.name : assignForm.lead } : j));
      setIsAssigning(false);
      setAssignModalVisible(false);
      showToast('Team assigned successfully.');
    }, 800);
  };

  const handleStartWork = () => {
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'In Progress', currentStage: 'Inspection Started', progress: 10 } : j));
    setStartModalVisible(false);
    showToast('Service work started successfully.');
  };

  const handleUpdateProgress = () => {
    const p = parseInt(progressForm.percent);
    if (isNaN(p) || p < 0 || p > 100) {
      if (Platform.OS === 'web') { window.alert('Progress must be between 0 and 100.'); }
      else { Alert.alert('Invalid', 'Progress must be between 0 and 100.'); }
      return;
    }
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, currentStage: progressForm.stage || j.currentStage, progress: p } : j));
    setProgressModalVisible(false);
    showToast('Work progress updated successfully.');
  };

  const handleMarkCompleted = () => {
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, status: 'Awaiting Confirmation', progress: 100, currentStage: 'Pending Client Confirmation' } : j));
    setCompleteModalVisible(false);
    showToast('Work completion submitted for client confirmation.');
  };

  const renderBadge = (status) => {
    let bg = '#F1F5F9'; let color = '#64748B';
    if (status === 'Scheduled') { bg = '#EFF6FF'; color = '#2563EB'; }
    else if (status === 'Team Assigned') { bg = '#F5F3FF'; color = '#7C3AED'; }
    else if (status === 'In Progress') { bg = '#FFF7ED'; color = '#EA580C'; }
    else if (status === 'Awaiting Confirmation') { bg = '#FEF2F2'; color = '#EF4444'; }
    else if (status === 'Completed') { bg = '#ECFDF5'; color = '#059669'; }
    else if (status === 'Cancelled') { bg = '#FEF2F2'; color = '#DC2626'; }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusBadgeText, { color }]}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.cardHeaderRow}>
        <Text style={styles.reqId}>{item.id}</Text>
        {renderBadge(item.status)}
      </View>
      
      {/* Service & Client */}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.service}</Text>
      <Text style={styles.clientInfo} numberOfLines={1}>
        <Text style={{fontWeight: '600', color: NAVY}}>{item.client}</Text>
      </Text>
      <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>

      {/* 2-Column Schedule & Amount */}
      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Schedule</Text>
          <Text style={styles.infoValue}>{item.date} · {item.time}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>Service Amount</Text>
          <Text style={styles.infoValue}>{item.amount}</Text>
        </View>
      </View>

      {/* Team Assignment State */}
      <View style={styles.teamStateBox}>
        {!item.assignedTeam ? (
          <View style={styles.teamUnassigned}>
            <UserRound size={14} color="#EA580C" style={{marginRight: 6}} />
            <Text style={styles.teamUnassignedText}>Team not assigned</Text>
          </View>
        ) : (
          <View style={styles.teamAssigned}>
            <Users size={14} color="#059669" style={{marginRight: 6}} />
            <Text style={styles.teamLabel}>Team </Text>
            <Text style={styles.teamAssignedText}>{item.assignedTeam}</Text>
          </View>
        )}
      </View>

      {/* Progress & Stage */}
      {(item.status === 'In Progress' || item.status === 'Awaiting Confirmation') && (
        <View style={styles.progressContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
            <Text style={styles.stageLabel}>Current Stage: <Text style={{fontWeight: '600', color: NAVY}}>{item.currentStage}</Text></Text>
            <Text style={styles.stageLabel}>Progress <Text style={{fontWeight: '700', color: NAVY}}>{item.progress}%</Text></Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.detailsBtn} onPress={() => { setSelectedJob(item); setDetailsModalVisible(true); }}>
          <Text style={styles.detailsBtnText}>View Details</Text>
          <ChevronRight size={16} color={NAVY} />
        </TouchableOpacity>
        
        <View style={styles.actionRight}>
          {item.status === 'Scheduled' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: NAVY }]} onPress={() => { 
              setSelectedJob(item); 
              setAssignForm({ lead: '', members: [], reportingDate: '', reportingTime: '', duration: '', instructions: '', notifyTeam: true });
              setAssignConflictError('');
              setAssignModalVisible(true); 
            }}>
              <Text style={styles.primaryBtnText}>Assign Team</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Team Assigned' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: NAVY }]} onPress={() => { setSelectedJob(item); setStartModalVisible(true); }}>
              <Text style={styles.primaryBtnText}>Start Work</Text>
            </TouchableOpacity>
          )}
          {item.status === 'In Progress' && (
            item.progress < 100 ? (
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: GREEN }]} onPress={() => { setSelectedJob(item); setProgressForm({ percent: item.progress.toString(), stage: item.currentStage, update: '', nextStep: '' }); setProgressModalVisible(true); }}>
                <Text style={styles.primaryBtnText}>Update Progress</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#F59E0B' }]} onPress={() => { setSelectedJob(item); setCompleteModalVisible(true); }}>
                <Text style={styles.primaryBtnText}>Submit Completion</Text>
              </TouchableOpacity>
            )
          )}
          {item.status === 'Awaiting Confirmation' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#7C3AED' }]} onPress={() => showToast('Viewing submission details...')}>
              <Text style={styles.primaryBtnText}>View Submission</Text>
            </TouchableOpacity>
          )}
          {item.status === 'Completed' && (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: NAVY }]} onPress={() => { setSelectedJob(item); setDetailsModalVisible(true); }}>
              <Text style={[styles.primaryBtnText, { color: NAVY }]}>View Summary</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  );

  return (
    <Pressable style={styles.container} onPress={() => setActiveMenuId(null)}>
      <View style={[styles.mainWrapper, isLargeScreen && styles.mainWrapperDesktop]}>
        
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Work Management</Text>
            <Text style={styles.pageSubtitle}>Manage scheduled, active and completed service jobs</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setShowSearch(!showSearch)}>
              <Search size={20} color={NAVY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterModalVisible(true)}>
              <SlidersHorizontal size={20} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchRow}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search service work..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#94A3B8"
            />
          </View>
        )}

        {/* Tabs */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                <View style={[styles.badgePill, activeTab === tab && styles.badgePillActive]}>
                  <Text style={[styles.badgeText, activeTab === tab && styles.badgeTextActive]}>{tabCounts[tab]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List */}
        <FlatList
          data={filteredJobs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}><Search size={24} color="#94A3B8" /></View>
              <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} service work</Text>
              <Text style={styles.emptySub}>Jobs matching this status will appear here.</Text>
            </View>
          )}
        />
      </View>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} transparent animationType="fade" onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Service Work Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            {selectedJob && (
              <ScrollView style={{padding: 20}}>
                <Text style={styles.detailTitle}>{selectedJob.service}</Text>
                <Text style={styles.detailClient}>{selectedJob.client} · {selectedJob.businessType}</Text>
                
                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Schedule & Amount</Text>
                  <Text style={styles.boxValue}>{selectedJob.date} at {selectedJob.time}</Text>
                  <Text style={styles.boxValue}>{selectedJob.amount}</Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.boxLabel}>Assigned Team</Text>
                  <Text style={styles.boxValue}>{selectedJob.assignedTeam || "Not assigned yet"}</Text>
                </View>

                <Text style={styles.boxLabel}>Work Scope & Notes</Text>
                <Text style={styles.detailDesc}>{selectedJob.notes}</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Assign Team Modal */}
      <Modal visible={assignModalVisible} transparent animationType="slide" onRequestClose={() => setAssignModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <View style={[styles.modalCard, { width: '92%', maxWidth: 520, maxHeight: '85%' }]}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Assign Team</Text>
                  <Text style={styles.modalSubtitle}>Select available team members for this service work</Text>
                </View>
                <TouchableOpacity onPress={() => setAssignModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
              </View>
              
              <ScrollView style={{padding: 20}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                
                {/* 1. Work Summary */}
                <View style={[styles.detailBox, {flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, marginBottom: 16, marginTop: 4}]}>
                  <View style={{backgroundColor: '#E2E8F0', padding: 8, borderRadius: 8, marginRight: 12}}>
                    <Wrench size={18} color={NAVY} />
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{fontWeight: '700', fontSize: 14, color: NAVY}}>{selectedJob?.service}</Text>
                    <Text style={{fontSize: 12, color: '#64748B', marginTop: 2}}>{selectedJob?.client} · {selectedJob?.date} at {selectedJob?.time}</Text>
                    <Text style={{fontSize: 12, color: '#64748B'}}>{selectedJob?.location}</Text>
                  </View>
                </View>

                {assignConflictError ? (
                  <View style={styles.conflictBox}>
                    <Text style={styles.conflictText}>{assignConflictError}</Text>
                    <TouchableOpacity onPress={() => setAssignConflictError('')}><Text style={styles.conflictAction}>Resolve</Text></TouchableOpacity>
                  </View>
                ) : null}

                {/* 2. Team Lead */}
                <Text style={styles.label}>Team Lead *</Text>
                <TouchableOpacity style={styles.selectBox} onPress={() => setLeadDropdownOpen(!leadDropdownOpen)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckCircle size={18} color={assignForm.lead ? NAVY : '#94A3B8'} style={{marginRight: 10}} />
                    <Text style={[styles.selectBoxText, !assignForm.lead && {color: '#94A3B8'}]}>
                      {assignForm.lead ? MOCK_TEAM_MEMBERS.find(m => m.id === assignForm.lead)?.name : 'Select team lead'}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" style={{transform: [{rotate: leadDropdownOpen ? '90deg' : '0deg'}]}} />
                </TouchableOpacity>
                {leadDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {MOCK_TEAM_MEMBERS.filter(m => m.canLead && m.active).map(m => (
                      <TouchableOpacity key={m.id} style={styles.dropdownItem} onPress={() => { setAssignForm({...assignForm, lead: m.id, members: assignForm.members.filter(id => id !== m.id)}); setLeadDropdownOpen(false); }}>
                        <Text style={styles.dropdownItemTitle}>{m.name} <Text style={{fontSize: 12, color: '#64748B', fontWeight: 'normal'}}>· {m.role}</Text></Text>
                        <Text style={styles.dropdownItemSub}>{m.skills[0]} · {m.availability} · {m.workload}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* 3. Team Members */}
                <Text style={[styles.label, {marginTop: 16}]}>Team Members</Text>
                <TouchableOpacity style={styles.selectBox} onPress={() => setMemberDropdownOpen(!memberDropdownOpen)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Users size={18} color={assignForm.members.length ? NAVY : '#94A3B8'} style={{marginRight: 10}} />
                    <Text style={[styles.selectBoxText, !assignForm.members.length && {color: '#94A3B8'}]}>
                      {assignForm.members.length ? `${assignForm.members.length} team member(s) selected` : 'Select supporting team members'}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" style={{transform: [{rotate: memberDropdownOpen ? '90deg' : '0deg'}]}} />
                </TouchableOpacity>
                {memberDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {MOCK_TEAM_MEMBERS.filter(m => m.active && m.id !== assignForm.lead).map(m => {
                      const isSel = assignForm.members.includes(m.id);
                      return (
                        <TouchableOpacity key={m.id} style={[styles.dropdownItem, isSel && {backgroundColor: '#F8FAFC'}]} onPress={() => {
                          const next = isSel ? assignForm.members.filter(id => id !== m.id) : [...assignForm.members, m.id];
                          setAssignForm({...assignForm, members: next});
                        }}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View>
                              <Text style={styles.dropdownItemTitle}>{m.name} <Text style={{fontSize: 12, color: '#64748B', fontWeight: 'normal'}}>· {m.role}</Text></Text>
                              <Text style={styles.dropdownItemSub}>{m.skills[0]} · {m.availability} · {m.workload}</Text>
                            </View>
                            {isSel && <CheckCircle size={16} color={GREEN} />}
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                )}
                {assignForm.members.length > 0 && (
                  <View style={[styles.chipsContainer, {marginTop: 8}]}>
                    {assignForm.members.map(id => {
                      const mem = MOCK_TEAM_MEMBERS.find(m => m.id === id);
                      return (
                        <TouchableOpacity key={id} style={styles.removableChip} onPress={() => setAssignForm({...assignForm, members: assignForm.members.filter(mid => mid !== id)})}>
                          <Text style={styles.removableChipText}>{mem?.name}</Text>
                          <XCircle size={14} color="#64748B" style={{marginLeft: 4}} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* 4 & 5. Reporting Date & Time */}
                <View style={[styles.formRow, {marginTop: 16}]}>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Reporting Date *</Text>
                    <View style={styles.inputWrapper}>
                      <CircleCheck size={18} color="#94A3B8" style={styles.inputIcon} />
                      <TextInput style={[styles.input, {paddingLeft: 40}]} value={assignForm.reportingDate} onChangeText={t => setAssignForm({...assignForm, reportingDate: t})} placeholder={selectedJob?.date} />
                    </View>
                  </View>
                  <View style={[styles.formGroup, {flex: 1}]}>
                    <Text style={styles.label}>Reporting Time *</Text>
                    <View style={styles.inputWrapper}>
                      <CircleCheck size={18} color="#94A3B8" style={styles.inputIcon} />
                      <TextInput style={[styles.input, {paddingLeft: 40}]} value={assignForm.reportingTime} onChangeText={t => setAssignForm({...assignForm, reportingTime: t})} placeholder="e.g. 09:30 AM" />
                    </View>
                  </View>
                </View>

                {/* 6. Expected Duration */}
                <Text style={styles.label}>Expected Duration *</Text>
                <View style={styles.inputWrapper}>
                  <CircleCheck size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput style={[styles.input, {paddingLeft: 40}]} value={assignForm.duration} onChangeText={t => setAssignForm({...assignForm, duration: t})} placeholder="e.g. 1 Hour, Half Day, Custom" />
                </View>

                {/* 7. Assignment Instructions */}
                <Text style={[styles.label, {marginTop: 16}]}>Assignment Instructions</Text>
                <View style={styles.inputWrapper}>
                  <FileText size={18} color="#94A3B8" style={[styles.inputIcon, {top: 12}]} />
                  <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top', paddingLeft: 40, paddingTop: 12}]} multiline maxLength={400} value={assignForm.instructions} onChangeText={t => setAssignForm({...assignForm, instructions: t})} placeholder="Add responsibilities, access instructions or safety notes..." />
                </View>

                {/* 8. Required Skills Compact Check */}
                <View style={{marginTop: 16}}>
                  {(() => {
                    const selectedMembers = MOCK_TEAM_MEMBERS.filter(m => m.id === assignForm.lead || (assignForm.members || []).includes(m.id));
                    const missingSkill = REQUIRED_SKILLS.find(skill => !selectedMembers.some(m => (m.skills || []).includes(skill)));
                    
                    if (!assignForm.lead) return null; // Don't show until lead is selected
                    
                    if (missingSkill) {
                      return (
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8}}>
                          <XCircle size={16} color="#EF4444" style={{marginRight: 8}} />
                          <Text style={{fontSize: 13, color: '#991B1B', flex: 1}}>Required skill missing: <Text style={{fontWeight: '600'}}>{missingSkill}</Text></Text>
                        </View>
                      );
                    }
                    return (
                      <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 10, borderRadius: 8}}>
                        <CheckCircle size={16} color="#059669" style={{marginRight: 8}} />
                        <Text style={{fontSize: 13, color: '#065F46'}}>Required skills covered</Text>
                      </View>
                    );
                  })()}
                </View>

                {/* 9. Notify Team */}
                <View style={[styles.formRow, {marginTop: 16, marginBottom: 12, alignItems: 'center'}]}>
                  <TouchableOpacity onPress={() => setAssignForm({...assignForm, notifyTeam: !assignForm.notifyTeam})}>
                    {assignForm.notifyTeam ? <CheckCircle size={20} color={GREEN} /> : <View style={styles.uncheckCircle} />}
                  </TouchableOpacity>
                  <View style={{marginLeft: 10, flex: 1}}>
                    <Text style={[styles.label, {marginBottom: 0}]}>Notify selected team</Text>
                    <Text style={{fontSize: 12, color: '#64748B'}}>Send work and reporting details to assigned members.</Text>
                  </View>
                </View>

              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setAssignModalVisible(false)} disabled={isAssigning}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalSubmitBtn, isAssigning && {opacity: 0.7}]} onPress={handleAssignTeam} disabled={isAssigning}>
                  <Text style={styles.modalSubmitText}>{isAssigning ? 'Assigning...' : 'Assign Team'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Start Work Confirmation */}
      <Modal visible={startModalVisible} transparent animationType="fade" onRequestClose={() => setStartModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {maxWidth: 400}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Start this service work?</Text>
              <TouchableOpacity onPress={() => setStartModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <View style={{padding: 20}}>
              <Text style={styles.boxLabel}>Service</Text><Text style={styles.boxValue}>{selectedJob?.service}</Text>
              <View style={{height: 12}} />
              <Text style={styles.boxLabel}>Client</Text><Text style={styles.boxValue}>{selectedJob?.client}</Text>
              <View style={{height: 12}} />
              <Text style={styles.boxLabel}>Scheduled Time</Text><Text style={styles.boxValue}>{selectedJob?.date} · {selectedJob?.time}</Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setStartModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: NAVY}]} onPress={handleStartWork}><Text style={styles.modalSubmitText}>Start Work</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Progress Modal */}
      <Modal visible={progressModalVisible} transparent animationType="slide" onRequestClose={() => setProgressModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '100%', alignItems: 'center'}}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Work Progress</Text>
                <TouchableOpacity onPress={() => setProgressModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 20}} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Progress Percentage (0-100) *</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={progressForm.percent} onChangeText={t => setProgressForm({...progressForm, percent: t})} placeholder="e.g. 75" />
                
                <Text style={[styles.label, {marginTop: 16}]}>Current Stage *</Text>
                <TextInput style={styles.input} value={progressForm.stage} onChangeText={t => setProgressForm({...progressForm, stage: t})} placeholder="e.g. Testing Equipment" />

                <Text style={[styles.label, {marginTop: 16}]}>Work Update</Text>
                <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} multiline value={progressForm.update} onChangeText={t => setProgressForm({...progressForm, update: t})} placeholder="What was completed today?" />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setProgressModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: GREEN}]} onPress={handleUpdateProgress}><Text style={styles.modalSubmitText}>Save Update</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Submit Completion Modal */}
      <Modal visible={completeModalVisible} transparent animationType="slide" onRequestClose={() => setCompleteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '100%', alignItems: 'center'}}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit for Client Confirmation</Text>
                <TouchableOpacity onPress={() => setCompleteModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
              </View>
              <ScrollView style={{padding: 20}} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Final Amount (₹)</Text>
                <TextInput style={styles.input} value={completeForm.amount} onChangeText={t => setCompleteForm({...completeForm, amount: t})} placeholder={selectedJob?.amount} />
                
                <Text style={[styles.label, {marginTop: 16}]}>Work Summary *</Text>
                <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} multiline value={completeForm.summary} onChangeText={t => setCompleteForm({...completeForm, summary: t})} placeholder="Summary of completed work..." />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setCompleteModalVisible(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalSubmitBtn, {backgroundColor: '#EA580C'}]} onPress={handleMarkCompleted}><Text style={styles.modalSubmitText}>Submit Completion</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Filter Bottom Sheet */}
      <Modal visible={filterModalVisible} transparent animationType="slide" onRequestClose={() => setFilterModalVisible(false)}>
        <View style={[styles.modalOverlay, {justifyContent: 'flex-end', padding: 0}]}>
          <View style={[styles.modalCard, {borderRadius: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxWidth: '100%', maxHeight: '60%'}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}><XCircle size={20} color="#64748B" /></TouchableOpacity>
            </View>
            <ScrollView style={{padding: 20}}>
              <Text style={styles.label}>Scheduled Date</Text>
              <View style={styles.chipsContainer}>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Today</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Tomorrow</Text></View>
                <View style={styles.filterChip}><Text style={styles.filterChipText}>Next 7 Days</Text></View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setFilterModalVisible(false)}><Text style={styles.modalCancelText}>Clear Filters</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={() => setFilterModalVisible(false)}><Text style={styles.modalSubmitText}>Apply Filters</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  mainWrapper: { flex: 1, width: '100%', alignSelf: 'center' },
  mainWrapperDesktop: { maxWidth: 1100, paddingHorizontal: 24 },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  searchRow: { paddingHorizontal: 16, marginBottom: 12 },
  searchInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  tabScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  tabItemActive: { backgroundColor: NAVY, borderColor: NAVY, shadowColor: NAVY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B', marginRight: 8 },
  tabTextActive: { color: '#fff' },
  badgePill: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgePillActive: { backgroundColor: '#334155' },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  badgeTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 120 },

  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reqId: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  clientInfo: { fontSize: 15, color: '#475569', marginBottom: 2 },
  locationText: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 16 },
  infoCol: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: NAVY },

  teamStateBox: { marginBottom: 16 },
  teamUnassigned: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start' },
  teamUnassignedText: { fontSize: 13, fontWeight: '600', color: '#EA580C' },
  teamAssigned: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  teamLabel: { fontSize: 13, color: '#64748B' },
  teamAssignedText: { fontSize: 13, fontWeight: '600', color: NAVY },

  progressContainer: { marginBottom: 16 },
  stageLabel: { fontSize: 12, color: '#64748B' },
  progressTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginTop: 4 },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 3 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, minHeight: 44 },
  detailsBtnText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryBtn: { paddingHorizontal: 16, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  moreMenu: { position: 'absolute', bottom: 44, right: 0, width: 200, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, zIndex: 100 },
  modalCard: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
  menuTextDestructive: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(3,15,38,0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', width: '100%', maxWidth: 540, maxHeight: '85%', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalFooter: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: NAVY },
  modalSubmitBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  detailTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailClient: { fontSize: 15, color: '#64748B', marginBottom: 20 },
  detailBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginBottom: 16 },
  boxLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  boxValue: { fontSize: 14, fontWeight: '600', color: NAVY },
  detailDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginTop: 4, marginBottom: 20 },

  quoteContextBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 20 },
  qcClient: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  qcTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  qcMeta: { fontSize: 12, color: '#64748B', marginTop: 4 },

  label: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  conflictBox: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  conflictText: { fontSize: 13, color: '#DC2626', flex: 1, marginRight: 8 },
  conflictAction: { fontSize: 13, fontWeight: 'bold', color: '#DC2626', textDecorationLine: 'underline' },

  selectBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 46 },
  selectBoxText: { fontSize: 14, color: NAVY, fontWeight: '500' },
  dropdownMenu: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, marginTop: 4, maxHeight: 180, overflow: 'hidden' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  dropdownItemSub: { fontSize: 12, color: '#64748B' },
  
  removableChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  removableChipText: { fontSize: 12, fontWeight: '600', color: NAVY },

  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },

  skillsCheckArea: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginTop: 16 },
  skillsCheckTitle: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  skillChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  skillCovered: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  skillMissing: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  skillTextCovered: { fontSize: 11, fontWeight: '600', color: '#059669' },
  skillTextMissing: { fontSize: 11, fontWeight: '600', color: '#EA580C' },
  skillsHelpText: { fontSize: 11, color: '#64748B', marginTop: 8 },

  toggleWrap: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#E2E8F0', justifyContent: 'center', paddingHorizontal: 2 },
  toggleActive: { backgroundColor: GREEN },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  toggleKnobActive: { transform: [{translateX: 20}] },

  readonlyBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10 },
  readonlyBoxText: { fontSize: 13, color: '#475569', marginBottom: 4 },

  uncheckCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1' }
});
