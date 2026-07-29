import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Modal
} from 'react-native';
import {
  Send,
  ClipboardPlus,
  ClipboardList,
  FileText,
  Megaphone,
  ChevronRight,
  BadgeCheck,
  X
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import AgencyDirectReqPage from './AgencyDirectReqPage';
import PostRequirementPage from './PostRequirementPage';

const NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG_PAGE = '#F5F7FA';
const CARD_BG = '#FFFFFF';
const INPUT_BG = '#F7F9FC';
const BORDER = '#E3E9F1';
const TEXT_PRIMARY = '#091B3A';
const TEXT_SECONDARY = '#71829B';
const ACCENT_ORANGE = '#F97316';
const ACCENT_PURPLE = '#8B5CF6';

// =====================================
// MOCK DATA
// =====================================

const MY_REQUIREMENTS = [];
const RECENT_PROPOSALS = [];

// =====================================
// HELPER COMPONENTS
// =====================================

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft': return '#94A3B8';
    case 'Open': case 'New': return '#3B82F6';
    case 'Proposal Received': case 'In Progress': case 'Shortlisted': return '#8B5CF6';
    case 'Agency Selected': case 'Completed': case 'Accepted': return '#10B981';
    case 'Under Review': return '#F59E0B';
    case 'Cancelled': case 'Rejected': return '#EF4444';
    default: return '#94A3B8';
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'Draft': return '#F1F5F9';
    case 'Open': case 'New': return '#EFF6FF';
    case 'Proposal Received': case 'In Progress': case 'Shortlisted': return '#F5F3FF';
    case 'Agency Selected': case 'Completed': case 'Accepted': return '#ECFDF5';
    case 'Under Review': return '#FFFBEB';
    case 'Cancelled': case 'Rejected': return '#FEF2F2';
    default: return '#F1F5F9';
  }
};

// =====================================
// MAIN SCREEN
// =====================================

export default function MarketingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  
  // Modal states
  const [directRequestVisible, setDirectRequestVisible] = useState(false);
  const [postRequirementVisible, setPostRequirementVisible] = useState(false);
  const [viewRequirementVisible, setViewRequirementVisible] = useState(false);
  const [viewProposalVisible, setViewProposalVisible] = useState(false);
  
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedProp, setSelectedProp] = useState(null);

  const displayRequirements = MY_REQUIREMENTS.slice(0, isMobile ? 3 : 4);
  const displayProposals = RECENT_PROPOSALS.slice(0, isMobile ? 2 : 3);

  const openDirectRequest = () => { setDirectRequestVisible(true); };
  const openPostRequirement = () => { setPostRequirementVisible(true); };

  // Render Overview Segment
  const renderOverviewSegment = (title, count, icon, accentColor, bgColor) => {
    const Icon = icon;
    return (
      <TouchableOpacity style={styles.overviewSegment} activeOpacity={0.85}>
        <View style={styles.overviewSegmentHeader}>
          <View style={[styles.overviewIconContainer, { backgroundColor: bgColor }]}>
            <Icon size={18} color={accentColor} />
          </View>
          <Text style={styles.overviewCount}>{count}</Text>
        </View>
        <Text style={styles.overviewTitle} numberOfLines={1}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderRequirementCard = (req) => {
    if (isMobile) {
      return (
        <View key={req.id} style={styles.reqCard}>
          <View style={styles.reqCardHeader}>
            <Text style={styles.reqId}>{req.id}</Text>
            <View style={[styles.badge, { backgroundColor: getStatusBgColor(req.status) }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(req.status) }]}>{req.status}</Text>
            </View>
          </View>
          <Text style={styles.reqTitle} numberOfLines={1}>{req.title}</Text>
          <Text style={styles.reqService}>{req.service}</Text>
          
          <View style={styles.reqDetailsRow}>
            <View style={[styles.modeBadge, req.mode === 'Direct Request' ? styles.modeDirect : styles.modeFeed]}>
              <Text style={[styles.modeBadgeText, req.mode === 'Direct Request' ? styles.modeDirectText : styles.modeFeedText]}>
                {req.mode}
              </Text>
            </View>
            <Text style={styles.reqProposals}>{req.proposals} Proposals</Text>
          </View>

          <View style={styles.reqFooter}>
            <Text style={styles.reqDate}>Posted {req.date}</Text>
            <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedReq(req); setViewRequirementVisible(true); }}>
              <Text style={styles.textActionBtnText}>View Requirement</Text>
              <ChevronRight size={16} color={NAVY} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View key={req.id} style={styles.reqRow}>
        <View style={styles.reqRowCol1}>
          <Text style={styles.reqTitle} numberOfLines={1}>{req.title}</Text>
          <Text style={styles.reqId}>{req.id}</Text>
        </View>
        <View style={styles.reqRowCol2}>
          <Text style={styles.reqService} numberOfLines={1}>{req.service}</Text>
          <Text style={styles.reqModeText} numberOfLines={1}>{req.mode}</Text>
        </View>
        <View style={styles.reqRowCol3}>
          <View style={{ alignItems: 'flex-start' }}>
            <View style={[styles.badge, { backgroundColor: getStatusBgColor(req.status) }]}>
              <Text style={[styles.badgeText, { color: getStatusColor(req.status) }]}>{req.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.reqRowCol4}>
          <Text style={styles.reqProposalsDesktop}>{req.proposals} Proposals</Text>
          <Text style={styles.reqDate}>{req.date}</Text>
        </View>
        <View style={styles.reqRowCol5}>
          <TouchableOpacity style={styles.viewRowBtn} onPress={() => { setSelectedReq(req); setViewRequirementVisible(true); }}>
            <Text style={styles.viewRowBtnText}>View</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProposalCard = (prop) => (
    <View key={prop.id} style={styles.reqCard}>
      <View style={styles.propHeader}>
        <View style={styles.propAvatar}>
          <Text style={styles.propAvatarText}>{prop.initials}</Text>
        </View>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <View style={styles.propNameRow}>
            <Text style={styles.propName} numberOfLines={1}>{prop.agencyName}</Text>
            {prop.verified && <BadgeCheck size={16} color={ACCENT_PURPLE} style={{ marginLeft: 4 }} />}
          </View>
          <Text style={styles.propReqName} numberOfLines={1}>{prop.reqName}</Text>
        </View>
      </View>
      
      <View style={styles.propDetailsGrid}>
        <View style={styles.propDetailItem}>
          <Text style={styles.propDetailLabel}>Amount</Text>
          <Text style={styles.propDetailValue}>{prop.amount}</Text>
        </View>
        <View style={styles.propDetailItem}>
          <Text style={styles.propDetailLabel}>Duration</Text>
          <Text style={styles.propDetailValue}>{prop.duration}</Text>
        </View>
      </View>

      <View style={styles.reqFooter}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={[styles.badge, { backgroundColor: getStatusBgColor(prop.status) }]}>
            <Text style={[styles.badgeText, { color: getStatusColor(prop.status) }]}>{prop.status}</Text>
          </View>
          <Text style={styles.reqDate} numberOfLines={1}>{prop.time}</Text>
        </View>
        <TouchableOpacity style={styles.textActionBtn} onPress={() => { setSelectedProp(prop); setViewProposalVisible(true); }}>
          <Text style={styles.textActionBtnText}>View Proposal</Text>
          <ChevronRight size={16} color={NAVY} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── PAGE HEADER ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={styles.pageHeaderInner}>
          <Text style={styles.pageTitle}>Marketing</Text>
          <Text style={styles.pageSubtitle}>Promote your business with verified marketing agencies</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentWrapper, !isMobile && styles.contentWrapperDesktop]}>
          
          {/* ── SECTION HEADER & ACTION CARDS IN ONE ROW ── */}
          <View style={styles.actionSectionContainer}>
            <View style={styles.actionSectionHeader}>
              <Text style={styles.actionSectionTitle}>Choose how to hire an agency</Text>
              <Text style={styles.actionSectionSubtitle}>
                Send a request directly or publish your requirement to receive proposals.
              </Text>
            </View>

            {/* ACTION CARDS ROW (Always 1 row on mobile >=320px) */}
            <View style={[styles.actionCardsRow, width < 320 && styles.actionCardsRowStacked]}>
              
              {/* CARD 1 — DIRECT REQUEST */}
              <TouchableOpacity
                style={styles.actionCard}
                onPress={openDirectRequest}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.cardIconBox, { backgroundColor: '#FFF7ED' }]}>
                    <Send size={18} color={ACCENT_ORANGE} />
                  </View>
                  <View style={[styles.cardBadge, { backgroundColor: '#FFEDD5' }]}>
                    <Text style={[styles.cardBadgeText, { color: '#C2410C' }]}>Quick</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>Direct Request</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    Send your brief to one selected agency.
                  </Text>
                </View>

                <View style={styles.cardActionRow}>
                  <Text style={[styles.cardActionText, { color: ACCENT_ORANGE }]}>Send Request</Text>
                  <ChevronRight size={15} color={ACCENT_ORANGE} />
                </View>
              </TouchableOpacity>

              {/* CARD 2 — POST REQUIREMENT */}
              <TouchableOpacity
                style={styles.actionCard}
                onPress={openPostRequirement}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.cardIconBox, { backgroundColor: '#F5F3FF' }]}>
                    <ClipboardPlus size={18} color={ACCENT_PURPLE} />
                  </View>
                  <View style={[styles.cardBadge, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.cardBadgeText, { color: '#6D28D9' }]}>Recommended</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>Post Requirement</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    Broadcast your brief and receive proposals.
                  </Text>
                </View>

                <View style={styles.cardActionRow}>
                  <Text style={[styles.cardActionText, { color: ACCENT_PURPLE }]}>Post Brief</Text>
                  <ChevronRight size={15} color={ACCENT_PURPLE} />
                </View>
              </TouchableOpacity>

            </View>
          </View>



          {/* ── COMPACT MARKETING OVERVIEW STRIP ── */}
          <View style={styles.overviewContainer}>
            <View style={styles.overviewGrid}>
              {renderOverviewSegment('Active Requirements', 4, ClipboardList, '#3B82F6', '#EFF6FF')}
              <View style={styles.overviewDivider} />
              {renderOverviewSegment('Proposals Received', 12, FileText, '#8B5CF6', '#F5F3FF')}
              <View style={styles.overviewDivider} />
              {renderOverviewSegment('Active Campaigns', 3, Megaphone, '#10B981', '#ECFDF5')}
            </View>
          </View>

          {/* ── MAIN CONTENT LAYOUT ── */}
          <View style={[styles.mainContentGrid, isMobile ? styles.mainContentCol : null]}>
            
            {/* Left Column (Requirements) */}
            <View style={isMobile ? styles.columnMobile : styles.columnLeft}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>My Requirements</Text>
                  <Text style={styles.sectionSubtitle}>Track your direct and posted marketing requirements</Text>
                </View>
                <TouchableOpacity><Text style={styles.viewAllBtn}>View All</Text></TouchableOpacity>
              </View>
              
              <View style={styles.listContainer}>
                {displayRequirements.length > 0 ? (
                  displayRequirements.map(renderRequirementCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No active requirements.</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Right Column (Proposals) */}
            <View style={isMobile ? styles.columnMobile : styles.columnRight}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Recent Proposals</Text>
                  <Text style={styles.sectionSubtitle}>Latest proposals received from marketing agencies</Text>
                </View>
                <TouchableOpacity><Text style={styles.viewAllBtn}>View All</Text></TouchableOpacity>
              </View>

              <View style={styles.listContainer}>
                {displayProposals.length > 0 ? (
                  displayProposals.map(renderProposalCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No recent proposals.</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── POPUP MODALS ── */}

      {/* Direct Request Popup */}
      {directRequestVisible && (
        <AgencyDirectReqPage
          visible={directRequestVisible}
          onBack={() => setDirectRequestVisible(false)}
          onHome={() => setDirectRequestVisible(false)}
        />
      )}

      {/* Post Requirement Popup */}
      {postRequirementVisible && (
        <PostRequirementPage
          visible={postRequirementVisible}
          onBack={() => setPostRequirementVisible(false)}
          onSuccess={() => setPostRequirementVisible(false)}
        />
      )}

      {/* View Requirement Modal */}
      <Modal visible={viewRequirementVisible} animationType="slide" transparent={true} onRequestClose={() => setViewRequirementVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Requirement Details</Text>
              <TouchableOpacity onPress={() => setViewRequirementVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedReq && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>ID:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.id}</Text>
                  <Text style={styles.reviewLabel}>Title:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.title}</Text>
                  <Text style={styles.reviewLabel}>Service:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.service}</Text>
                  <Text style={styles.reviewLabel}>Status:</Text>
                  <Text style={styles.reviewValue}>{selectedReq.status}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* View Proposal Modal */}
      <Modal visible={viewProposalVisible} animationType="slide" transparent={true} onRequestClose={() => setViewProposalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proposal Details</Text>
              <TouchableOpacity onPress={() => setViewProposalVisible(false)}><X size={24} color={NAVY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedProp && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>Agency:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.agencyName}</Text>
                  <Text style={styles.reviewLabel}>Requirement:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.reqName}</Text>
                  <Text style={styles.reviewLabel}>Amount:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.amount}</Text>
                  <Text style={styles.reviewLabel}>Duration:</Text>
                  <Text style={styles.reviewValue}>{selectedProp.duration}</Text>
                  <View style={{ marginTop: 24, gap: 12 }}>
                    <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#10B981' }]} onPress={() => setViewProposalVisible(false)}>
                      <Text style={styles.primaryBtnLargeText}>Accept Proposal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.primaryBtnLarge, { backgroundColor: '#EF4444' }]} onPress={() => setViewProposalVisible(false)}>
                      <Text style={styles.primaryBtnLargeText}>Reject Proposal</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE },
  pageHeader: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: BORDER },
  pageHeaderInner: { width: '100%', maxWidth: 1320, alignSelf: 'center', paddingHorizontal: 32, paddingVertical: 20 },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: TEXT_SECONDARY },
  
  scroll: { flex: 1, width: '100%' },
  scrollContent: { paddingBottom: 120, width: '100%', alignItems: 'center' },
  contentWrapper: { padding: 16, gap: 20, width: '100%' },
  contentWrapperDesktop: { paddingHorizontal: 32, paddingVertical: 24, maxWidth: 1320, flex: 1 },

  // Action Cards Section Header
  actionSectionContainer: { width: '100%', gap: 10 },
  actionSectionHeader: { marginBottom: 2 },
  actionSectionTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 2 },
  actionSectionSubtitle: { fontSize: 13, color: TEXT_SECONDARY },

  // Action Cards Row (Horizontal on Mobile & Desktop)
  actionCardsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    maxWidth: 720
  },
  actionCardsRowStacked: {
    flexDirection: 'column'
  },

  // Premium Action Card
  actionCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    minHeight: 150,
    maxHeight: 170,
    justifyContent: 'space-between',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    lineHeight: 16
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700'
  },

  // Segmented Control Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: BORDER,
    width: '100%',
    height: 48
  },
  tabBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  tabBtnActive: {
    backgroundColor: NAVY
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_SECONDARY
  },
  tabBtnTextActive: {
    color: '#FFFFFF'
  },

  // Overview Strip
  overviewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    width: '100%'
  },
  overviewGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  overviewSegment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  overviewDivider: {
    width: 1,
    height: '60%',
    backgroundColor: BORDER
  },
  overviewIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  overviewSegmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  overviewCount: {
    fontSize: 20,
    fontWeight: '900',
    color: NAVY
  },
  overviewTitle: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    fontWeight: '600',
    textAlign: 'center'
  },

  // Sections
  mainContentGrid: { flexDirection: 'row', gap: 20, width: '100%', alignItems: 'flex-start' },
  mainContentCol: { flexDirection: 'column' },
  columnLeft: { flex: 1.45, gap: 14 },
  columnRight: { flex: 0.75, minWidth: 320, gap: 14 },
  columnMobile: { width: '100%', gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: NAVY, marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: TEXT_SECONDARY },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  listContainer: { gap: 10 },
  emptyState: { padding: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: BORDER, borderStyle: 'dashed' },
  emptyStateText: { color: TEXT_SECONDARY, fontSize: 13 },

  // Request Mobile Card
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: BORDER },
  reqCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  reqId: { fontSize: 12, fontWeight: '700', color: TEXT_SECONDARY },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  reqTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  reqService: { fontSize: 13, color: TEXT_SECONDARY, marginBottom: 10 },
  reqDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  modeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  modeDirect: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  modeFeed: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  modeDirectText: { color: '#C2410C', fontSize: 11, fontWeight: '600' },
  modeFeedText: { color: '#6D28D9', fontSize: 11, fontWeight: '600' },
  reqProposals: { fontSize: 12, fontWeight: '600', color: NAVY },
  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  reqDate: { fontSize: 12, color: TEXT_SECONDARY },
  textActionBtn: { flexDirection: 'row', alignItems: 'center' },
  textActionBtnText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Request Desktop Row
  reqRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: BORDER },
  reqRowCol1: { flex: 2, paddingRight: 12 },
  reqRowCol2: { flex: 1.5, paddingRight: 12 },
  reqRowCol3: { flex: 1, paddingRight: 12 },
  reqRowCol4: { flex: 1, paddingRight: 12 },
  reqRowCol5: { width: 80, alignItems: 'flex-end' },
  reqModeText: { fontSize: 11, color: TEXT_SECONDARY, marginTop: 4, fontWeight: '600' },
  reqProposalsDesktop: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 4 },
  viewRowBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: INPUT_BG, borderRadius: 6, borderWidth: 1, borderColor: BORDER },
  viewRowBtnText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Proposal Card
  propHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  propAvatar: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  propAvatarText: { fontSize: 15, fontWeight: '800', color: ACCENT_PURPLE },
  propNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  propName: { fontSize: 14, fontWeight: '800', color: NAVY },
  propReqName: { fontSize: 12, color: TEXT_SECONDARY },
  propDetailsGrid: { flexDirection: 'row', gap: 12, marginBottom: 14, backgroundColor: INPUT_BG, padding: 10, borderRadius: 8 },
  propDetailItem: { flex: 1 },
  propDetailLabel: { fontSize: 11, color: TEXT_SECONDARY, marginBottom: 2 },
  propDetailValue: { fontSize: 13, fontWeight: '800', color: NAVY },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.55)', justifyContent: 'center', alignItems: 'center' },
  modalContentCentered: { width: '90%', maxWidth: 500, backgroundColor: '#FFFFFF', borderRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  modalBody: { flex: 1, padding: 18 },
  reviewBox: { backgroundColor: INPUT_BG, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  reviewLabel: { fontSize: 12, color: TEXT_SECONDARY, marginBottom: 2 },
  reviewValue: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 10 },
  primaryBtnLarge: { backgroundColor: NAVY, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  primaryBtnLargeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
