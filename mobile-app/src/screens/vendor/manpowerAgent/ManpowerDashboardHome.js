import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  useWindowDimensions, SafeAreaView, Modal, Pressable
} from 'react-native';
import {
  ClipboardPlus, FileClock, UsersRound, UserRoundCheck,
  Briefcase, MapPin, DollarSign, CheckCircle, Clock, ChevronRight, X
} from 'lucide-react-native';

const NAVY = '#071B3A';
const MUTED = '#64748B';

const OVERVIEW_STATS = [
  { id: 'new', label: 'New Requirements', value: '24', icon: ClipboardPlus, color: '#3B82F6' },
  { id: 'active', label: 'Active Requirements', value: '8', icon: FileClock, color: '#F97316' },
  { id: 'available', label: 'Available Candidates', value: '12', icon: UsersRound, color: '#8B5CF6' },
  { id: 'staff', label: 'Active Staff', value: '5', icon: UserRoundCheck, color: '#10B981' },
];

const NEW_REQUIREMENTS = [
  {
    id: "REQ-901", businessName: "The Grand Taj", type: "Hotel", verified: true, location: "Bandra West",
    role: "Head Chef", count: 1, experience: "8-10 Years", salary: "₹60K–₹80K",
    typeStr: "Full Time", joining: "25 Jul 2026", status: "NEW"
  },
  {
    id: "REQ-902", businessName: "Sky Lounge", type: "Bar", verified: true, location: "Colaba",
    role: "Bartender", count: 2, experience: "3-5 Years", salary: "₹30K–₹40K",
    typeStr: "Full Time", joining: "Immediate", status: "HIGH PRIORITY"
  }
];

const RECENT_ACTIVITY = [
  { id: 1, title: 'Candidate Submitted', sub: 'Rahul Patil submitted for Head Chef', time: '10 minutes ago', icon: UsersRound, color: '#3B82F6' },
  { id: 2, title: 'Candidate Selected', sub: 'Priya Sharma selected for Wait Staff', time: '1 hour ago', icon: CheckCircle, color: '#F97316' },
  { id: 3, title: 'Staff Started Working', sub: 'Amit Kumar joined The Meridian Hotel', time: 'Yesterday', icon: UserRoundCheck, color: '#10B981' },
];

export default function ManpowerDashboardHome({ onNavigate }) {
  const { width } = useWindowDimensions();
  const pagePadding = width < 340 ? 12 : 16;
  const gridGap = 12;
  const columns = 2;
  const cardWidth = (width - (pagePadding * 2) - gridGap) / columns;

  const [selectedReq, setSelectedReq] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetails = (req) => {
    setSelectedReq(req);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: pagePadding }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Premium Welcome Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>Good Morning 👋</Text>
            <Text style={styles.heroAgencyName}>Elite Manpower</Text>
            <Text style={styles.heroAgencyType}>Manpower Agency</Text>
            

            
            <Text style={styles.heroDesc}>Manage job requirements, candidates and staff records from one place.</Text>
          </View>
          {/* Subtle watermark or abstraction could go here */}
        </View>

        {/* Overview Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={[styles.gridContainer, { gap: gridGap }]}>
            {OVERVIEW_STATS.map((stat) => (
              <TouchableOpacity 
                key={stat.id} 
                style={[styles.overviewCard, { width: cardWidth }]}
                onPress={() => console.log(`Navigate to ${stat.label}`)}
              >
                <View style={[styles.overviewIconBox, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={20} color={stat.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.overviewValue}>{stat.value}</Text>
                <Text style={styles.overviewLabel} numberOfLines={1}>{stat.label}</Text>
                <View style={styles.overviewFooter}>
                  <Text style={styles.overviewLinkText}>View</Text>
                  <Text style={styles.overviewLinkArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* New Job Requirements */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>New Job Requirements</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewAllText}>View All {'>'}</Text></TouchableOpacity>
          </View>

          {NEW_REQUIREMENTS.map((req) => (
            <TouchableOpacity 
              key={req.id} 
              style={styles.reqCard} 
              activeOpacity={0.7}
              onPress={() => openDetails(req)}
            >
              <View style={styles.reqTopRow}>
                <Text style={styles.reqRole} numberOfLines={1}>{req.role}</Text>
                <View style={[styles.reqStatusBadge, req.status === 'HIGH PRIORITY' && { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <Text style={[styles.reqStatusText, req.status === 'HIGH PRIORITY' && { color: '#DC2626' }]}>{req.status}</Text>
                </View>
              </View>

              <View style={styles.reqBusinessRow}>
                <Text style={styles.reqBusinessText} numberOfLines={1}>{req.businessName}</Text>
                {req.verified && <CheckCircle size={14} color="#10B981" style={{ marginLeft: 4, marginRight: 4 }} />}
                <Text style={styles.reqBusinessSub} numberOfLines={1}>• {req.location}</Text>
              </View>

              <View style={styles.reqSimpleInfo}>
                <Text style={styles.reqInfoText}>{req.count} Staff</Text>
                <Text style={styles.reqInfoText}>{req.salary}</Text>
                <Text style={styles.reqInfoText}>Joining: {req.joining}</Text>
              </View>

              <View style={styles.reqFooterAction}>
                <Text style={styles.reqActionText}>View Details</Text>
                <ChevronRight size={16} color={NAVY} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.listCardWrapper}>
            <View style={styles.listCardHeader}>
              <Text style={styles.listCardTitle}>Recent Activity</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View All {'>'}</Text></TouchableOpacity>
            </View>
            <View style={styles.listCardBody}>
              {RECENT_ACTIVITY.map((activity, idx) => (
                <TouchableOpacity key={idx} style={[styles.listRow, idx === RECENT_ACTIVITY.length - 1 && styles.noBorder]}>
                  <View style={[styles.listIconBox, { backgroundColor: `${activity.color}15` }]}>
                    <activity.icon size={16} color={activity.color} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listTitle} numberOfLines={1}>{activity.title}</Text>
                    <Text style={styles.listSub} numberOfLines={1}>{activity.sub}</Text>
                  </View>
                  <Text style={styles.listTime}>{activity.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Requirement Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Requirement Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={NAVY} />
              </TouchableOpacity>
            </View>

            {selectedReq && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalTopInfo}>
                  <Text style={styles.modalRole}>{selectedReq.role}</Text>
                  <View style={[styles.reqStatusBadge, { alignSelf: 'flex-start', marginTop: 4 }]}>
                    <Text style={styles.reqStatusText}>{selectedReq.status}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Business Information</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Name:</Text> {selectedReq.businessName}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Type:</Text> {selectedReq.type}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Location:</Text> {selectedReq.location}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Requirement Details</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Staff Count:</Text> {selectedReq.count}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Experience:</Text> {selectedReq.experience}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Salary:</Text> {selectedReq.salary}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Employment Type:</Text> {selectedReq.typeStr}</Text>
                  <Text style={styles.modalText}><Text style={{fontWeight: '700'}}>Joining Date:</Text> {selectedReq.joining}</Text>
                </View>

                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 24, marginBottom: 40 }]}>
                  <Text style={styles.primaryBtnText}>Submit Candidates</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 110,
  },
  heroCard: {
    marginBottom: 24,
    backgroundColor: NAVY,
    borderRadius: 22,
    padding: 20,
    minHeight: 145,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    justifyContent: 'center',
  },
  heroGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroAgencyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroAgencyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F6B800', // Gold accent
    marginBottom: 12,
  },
  heroStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  heroStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    maxWidth: '90%',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    maxWidth: 220,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 132,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  overviewIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  overviewFooter: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  overviewLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  overviewLinkArrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 4,
  },
  reqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  reqTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reqRole: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    flex: 1,
    marginRight: 8,
  },
  reqStatusBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reqStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  reqBusinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reqBusinessText: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
  },
  reqBusinessSub: {
    fontSize: 13,
    color: MUTED,
  },
  reqSimpleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reqInfoText: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '500',
  },
  reqFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 36,
    justifyContent: 'center',
  },
  reqActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginRight: 4,
  },
  listCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: NAVY,
  },
  listCardBody: {
    paddingVertical: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  listIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
    paddingRight: 8,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 2,
  },
  listSub: {
    fontSize: 11,
    color: MUTED,
  },
  listTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 27, 58, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: NAVY,
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalTopInfo: {
    marginBottom: 24,
  },
  modalRole: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
  },
  modalSection: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: NAVY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
