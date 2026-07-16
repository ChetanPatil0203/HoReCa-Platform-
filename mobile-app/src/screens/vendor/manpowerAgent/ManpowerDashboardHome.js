import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, FlatList, Platform
} from 'react-native';
import {
  Briefcase, UserPlus, FileText, Calendar, Clock, Star, MapPin, 
  Search, Filter, MoreVertical, X, CheckCircle, Save, XCircle,
  AlertTriangle, User, Users, ChevronRight, Activity, DollarSign, Bell
} from 'lucide-react-native';

import SubmissionDetailsModal from '../../../components/vendor/manpowerAgent/SubmissionDetailsModal';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_METRICS = [
  { label: "New Broadcasts", value: "24", icon: Briefcase, color: "#3B82F6" },
  { label: "Available Candidates", value: "85", icon: Users, color: "#10B981" },
  { label: "Candidates Submitted", value: "142", icon: FileText, color: "#8B5CF6" },
  { label: "Shortlisted Candidates", value: "8", icon: Users, color: "#F59E0B" },
  { label: "Active Deployments", value: "56", icon: CheckCircle, color: "#10B981" },
  { label: "Replacement Requests", value: "2", icon: AlertTriangle, color: "#EF4444" },
  { label: "Monthly Revenue", value: "₹4.2L", icon: DollarSign, color: "#10B981" },
  { label: "Agency Rating", value: "4.8", icon: Star, color: "#F59E0B" },
];

const MOCK_BROADCASTS = [
  {
    id: "REQ-901", businessName: "The Grand Taj", type: "Hotel", verified: true,
    role: "Head Chef", count: 1, experience: "8-10 Years", salary: "₹60k - ₹80k",
    typeStr: "Full-Time", shift: "Morning", location: "Bandra West, Mumbai",
    joining: "Immediate", food: "Provided", accommodation: "Provided",
    urgency: "High", posted: "2 hours ago", status: "New",
    skills: ["Continental", "Team Management", "Inventory"],
    desc: "Looking for an experienced Head Chef to lead our new continental fine-dining restaurant. Must have experience managing a team of at least 15 staff.",
    deadline: "20 Jul 2026"
  },
  {
    id: "REQ-902", businessName: "Cafe Mocha", type: "Cafe", verified: true,
    role: "Barista", count: 3, experience: "1-3 Years", salary: "₹18k - ₹25k",
    typeStr: "Full-Time", shift: "Rotational", location: "Andheri, Mumbai",
    joining: "Within 7 Days", food: "Provided", accommodation: "Not Provided",
    urgency: "Normal", posted: "5 hours ago", status: "Responded",
    skills: ["Latte Art", "Customer Service", "Espresso"],
    desc: "Seeking enthusiastic baristas with good communication skills.",
    deadline: "25 Jul 2026"
  }
];

const MOCK_SUBMISSIONS = [
  { id: "SUB-01", name: "Rahul Sharma", role: "Head Chef", business: "The Grand Taj", date: "14 Jul 2026", status: "Shortlisted" },
  { id: "SUB-02", name: "Priya Desai", role: "Barista", business: "Cafe Mocha", date: "13 Jul 2026", status: "Shortlisted" },
  { id: "SUB-03", name: "Amit Kumar", role: "Steward", business: "Olive Bar", date: "12 Jul 2026", status: "Viewed" },
];

const MOCK_DEPLOYMENTS = [
  { id: "DEP-01", candidate: "Vikram Singh", business: "JW Marriott", role: "Sous Chef", joining: "10 Jan 2026", status: "Active" },
  { id: "DEP-02", candidate: "Neha Gupta", business: "Starbucks", role: "Store Manager", joining: "15 Jul 2026", status: "Joining Scheduled" },
];

const MOCK_REPLACEMENTS = [
  { id: "REP-01", business: "The Leela", candidate: "Rajesh Patel", role: "Bartender", reason: "Medical Emergency", deadline: "16 Jul 2026", urgency: "High" }
];

export default function ManpowerDashboardHome() {
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 380;

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const [selectedSub, setSelectedSub] = useState(null);
  const [subModalVisible, setSubModalVisible] = useState(false);

  const filters = ["All", "New", "Urgent", "Saved", "Responded", "Closed"];

  const openReqDetails = (req) => {
    setSelectedReq(req);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return '#F59E0B';
      case 'Selected': return '#10B981';
      case 'Rejected': return '#EF4444';
      case 'Active': return '#10B981';
      case 'Joining Scheduled': return '#3B82F6';
      case 'Left': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleSubmissionClick = (sub) => {
    setSelectedSub({
      candidateName: sub.name,
      role: sub.role,
      business: sub.business,
      date: sub.date,
      status: sub.status,
      note: "Candidate is highly experienced."
    });
    setSubModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.agencyName}>Elite Manpower</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
              <TouchableOpacity style={styles.notifBtn}>
                <Bell size={24} color={NAVY} />
                <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
              </TouchableOpacity>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>EM</Text>
              </View>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color="#10B981" />
              <Text style={styles.verifiedText}>Verified Agency</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>4.8 Rating</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionBtn}>
            <UserPlus size={20} color="#fff" />
            <Text style={styles.quickActionText}>Add Candidate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }]}>
            <Activity size={20} color={NAVY} />
            <Text style={[styles.quickActionText, { color: NAVY }]}>Manage Availability</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Metrics */}
        <View style={styles.metricsGrid}>
          {SUMMARY_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <View key={idx} style={[styles.metricCard, isSmallMobile && styles.metricCardFull]}>
                <View style={[styles.metricIconBox, { backgroundColor: item.color + '15' }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={styles.metricValue}>{item.value}</Text>
                <Text style={styles.metricLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Replacement Alerts */}
        {MOCK_REPLACEMENTS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: '#EF4444', marginLeft: 8 }]}>Replacement Alerts</Text>
            </View>
            {MOCK_REPLACEMENTS.map((rep) => (
              <View key={rep.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertBusiness}>{rep.business}</Text>
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>URGENT</Text>
                  </View>
                </View>
                <Text style={styles.alertDesc}>
                  Replacement required for <Text style={{fontWeight: 'bold'}}>{rep.candidate}</Text> ({rep.role}). 
                  Reason: {rep.reason}
                </Text>
                <View style={styles.alertFooter}>
                  <Text style={styles.alertDeadline}>Deadline: {rep.deadline}</Text>
                  <TouchableOpacity style={styles.alertActionBtn}>
                    <Text style={styles.alertActionText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Broadcast Feed Wall */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Broadcast Requirements</Text>
          <Text style={styles.sectionSubtitle}>Requirements posted by hotels, restaurants and cafés.</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {MOCK_BROADCASTS.map(req => (
            <View key={req.id} style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <View style={styles.reqHeaderLeft}>
                  <Text style={styles.reqRole}>{req.role}</Text>
                  <View style={styles.reqBusinessRow}>
                    <Briefcase size={12} color="#64748B" />
                    <Text style={styles.reqBusiness}>{req.businessName}</Text>
                    {req.verified && <CheckCircle size={12} color="#10B981" style={{marginLeft: 4}}/>}
                  </View>
                </View>
                {req.urgency === 'High' && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>URGENT</Text>
                  </View>
                )}
              </View>

              <View style={styles.reqDetailsGrid}>
                <View style={styles.reqDetailItem}>
                  <Users size={14} color="#64748B" />
                  <Text style={styles.reqDetailText}>{req.count} Staff</Text>
                </View>
                <View style={styles.reqDetailItem}>
                  <Briefcase size={14} color="#64748B" />
                  <Text style={styles.reqDetailText}>{req.experience}</Text>
                </View>
                <View style={styles.reqDetailItem}>
                  <DollarSign size={14} color="#64748B" />
                  <Text style={styles.reqDetailText}>{req.salary}</Text>
                </View>
                <View style={styles.reqDetailItem}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.reqDetailText}>{req.location}</Text>
                </View>
              </View>

              <View style={styles.reqFooter}>
                <Text style={styles.reqPostedText}>Posted: {req.posted}</Text>
                <View style={styles.reqActionRow}>
                  <TouchableOpacity style={styles.iconBtnOutline}>
                    <Save size={16} color={NAVY} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => openReqDetails(req)}>
                    <Text style={styles.primaryBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Candidate Submissions & Deployments Split */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Submissions</Text>
          {MOCK_SUBMISSIONS.map(sub => (
            <TouchableOpacity key={sub.id} style={styles.miniCard} onPress={() => handleSubmissionClick(sub)}>
              <View style={styles.miniAvatar}>
                <User size={16} color="#64748B" />
              </View>
              <View style={styles.miniInfo}>
                <Text style={styles.miniName}>{sub.name}</Text>
                <Text style={styles.miniDesc}>{sub.role} at {sub.business}</Text>
              </View>
              <View style={styles.miniStatusBox}>
                <Text style={[styles.miniStatusText, { color: getStatusColor(sub.status) }]}>{sub.status}</Text>
                <Text style={styles.miniDate}>{sub.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Submissions</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Deployments</Text>
          {MOCK_DEPLOYMENTS.map(dep => (
            <View key={dep.id} style={styles.miniCard}>
              <View style={[styles.miniAvatar, { backgroundColor: '#10B98115' }]}>
                <CheckCircle size={16} color="#10B981" />
              </View>
              <View style={styles.miniInfo}>
                <Text style={styles.miniName}>{dep.candidate}</Text>
                <Text style={styles.miniDesc}>{dep.role} at {dep.business}</Text>
              </View>
              <View style={styles.miniStatusBox}>
                <Text style={[styles.miniStatusText, { color: getStatusColor(dep.status) }]}>{dep.status}</Text>
                <Text style={styles.miniDate}>Joined: {dep.joining}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Deployments</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom padding */}
        <View style={{height: 40}} />
      </ScrollView>

      {/* Requirement Details Modal */}
      <Modal
        visible={detailsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)} style={styles.modalCloseBtn}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Requirement Details</Text>
            <View style={{width: 40}} />
          </View>
          
          {selectedReq && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.reqHeaderLeft}>
                <Text style={styles.reqRole}>{selectedReq.role}</Text>
                <View style={styles.reqBusinessRow}>
                  <Briefcase size={14} color="#64748B" />
                  <Text style={styles.reqBusiness}>{selectedReq.businessName} ({selectedReq.type})</Text>
                  {selectedReq.verified && <CheckCircle size={14} color="#10B981" style={{marginLeft: 4}}/>}
                </View>
                <Text style={styles.reqId}>ID: {selectedReq.id} • Posted {selectedReq.posted}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionSubtitleBold}>Job Description</Text>
              <Text style={styles.modalDesc}>{selectedReq.desc}</Text>

              <View style={styles.tagsContainer}>
                {selectedReq.skills.map(s => (
                  <View key={s} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />
              
              <Text style={styles.sectionSubtitleBold}>Key Requirements</Text>
              <View style={styles.specGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Staff Count</Text>
                  <Text style={styles.specVal}>{selectedReq.count}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Experience</Text>
                  <Text style={styles.specVal}>{selectedReq.experience}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Salary Range</Text>
                  <Text style={styles.specVal}>{selectedReq.salary}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Shift</Text>
                  <Text style={styles.specVal}>{selectedReq.shift}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Joining</Text>
                  <Text style={styles.specVal}>{selectedReq.joining}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Food/Accom.</Text>
                  <Text style={styles.specVal}>{selectedReq.food} / {selectedReq.accommodation}</Text>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.secondaryBtnOutline}>
              <Text style={styles.secondaryBtnText}>Not Interested</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtnLarge}>
              <Text style={styles.primaryBtnLargeText}>Send Candidates</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Embedded Workflow Modals */}
      <SubmissionDetailsModal 
        visible={subModalVisible} 
        onClose={() => setSubModalVisible(false)} 
        submission={selectedSub} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16 },
  
  headerBox: { marginBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 14, color: '#64748B' },
  agencyName: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginTop: 4 },
  
  notifBtn: { position: 'relative', padding: 4 },
  notifBadge: { position: 'absolute', top: -2, right: -4, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F8FAFC' },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B98115', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { fontSize: 12, color: '#10B981', fontWeight: 'bold', marginLeft: 4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { fontSize: 12, color: '#D97706', fontWeight: 'bold', marginLeft: 4 },

  quickActionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY, paddingVertical: 12, borderRadius: 12, gap: 8 },
  quickActionText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  metricCard: { width: '48%', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  metricCardFull: { width: '100%' },
  metricIconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  metricLabel: { fontSize: 12, color: '#64748B' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  sectionSubtitleBold: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },

  alertCard: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 16, marginBottom: 12 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertBusiness: { fontSize: 15, fontWeight: 'bold', color: '#991B1B' },
  alertDesc: { fontSize: 13, color: '#7F1D1D', lineHeight: 20, marginBottom: 12 },
  alertFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#FECACA', paddingTop: 12 },
  alertDeadline: { fontSize: 12, fontWeight: 'bold', color: '#DC2626' },
  alertActionBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#DC2626', borderRadius: 6 },
  alertActionText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  filterScroll: { marginBottom: 16 },
  filterScrollContent: { paddingRight: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  reqCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  reqHeaderLeft: { flex: 1 },
  reqRole: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 },
  reqBusinessRow: { flexDirection: 'row', alignItems: 'center' },
  reqBusiness: { fontSize: 14, color: '#475569', marginLeft: 6, fontWeight: '500' },
  reqId: { fontSize: 12, color: '#94A3B8', marginTop: 6 },
  urgentBadge: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  urgentBadgeText: { fontSize: 10, color: '#DC2626', fontWeight: 'bold' },

  reqDetailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16 },
  reqDetailItem: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  reqDetailText: { fontSize: 13, color: '#475569', marginLeft: 8 },

  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  reqPostedText: { fontSize: 12, color: '#94A3B8' },
  reqActionRow: { flexDirection: 'row', gap: 8 },
  iconBtnOutline: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  miniCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  miniAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  miniInfo: { flex: 1 },
  miniName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  miniDesc: { fontSize: 12, color: '#64748B' },
  miniStatusBox: { alignItems: 'flex-end' },
  miniStatusText: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  miniDate: { fontSize: 11, color: '#94A3B8' },

  viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 4 },
  viewAllText: { fontSize: 14, fontWeight: '600', color: NAVY, marginRight: 4 },

  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalCloseBtn: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalContent: { flex: 1, padding: 16, backgroundColor: '#fff' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  modalDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 12, color: '#475569', fontWeight: '500' },

  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingBottom: 40 },
  specItem: { width: '45%' },
  specLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  specVal: { fontSize: 14, color: '#1E293B', fontWeight: '500' },

  modalFooter: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  secondaryBtnOutline: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  primaryBtnLarge: { flex: 1.5, backgroundColor: NAVY, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLargeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
