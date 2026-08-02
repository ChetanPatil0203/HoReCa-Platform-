import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {
  Send,
  ClipboardPlus,
  ClipboardList,
  MessageSquare,
  Megaphone,
  CircleCheck,
  ChevronRight,
  BadgeCheck,
  ShieldCheck,
  Star,
  X,
  Share2,
  Search,
  MousePointerClick,
  Palette,
  FileText,
  Camera,
  PanelTop,
  CalendarDays,
  BriefcaseBusiness,
  Package
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { AuthContext } from '../../../context/AuthContext';
import { fetchMarketingDashboardSummary } from '../../../services/api.service';
import AgencyDirectReqPage from './AgencyDirectReqPage';
import PostRequirementPage from './PostRequirementPage';
import BrowseAgenciesPage from './BrowseAgenciesPage';
import CampaignRequestsPage from './CampaignRequestsPage';

const NAVY = '#071B3A';
const BORDER = '#E2E8F0';
const TEXT_MUTED = '#64748B';
const ACCENT_ORANGE = '#F97316';
const ACCENT_PURPLE = '#8B5CF6';

const POPULAR_SERVICES = [
  { id: 'social', name: 'Social Media', icon: Share2, category: 'Social Media' },
  { id: 'seo', name: 'SEO', icon: Search, category: 'SEO' },
  { id: 'ads', name: 'Paid Ads', icon: MousePointerClick, category: 'Paid Ads' },
  { id: 'branding', name: 'Branding', icon: Palette, category: 'Branding' },
  { id: 'content', name: 'Content', icon: FileText, category: 'Content' },
  { id: 'photo', name: 'Photography', icon: Camera, category: 'Photography' },
  { id: 'outdoor', name: 'Outdoor Ads', icon: PanelTop, category: 'Outdoor Ads' },
  { id: 'event', name: 'Event Promo', icon: CalendarDays, category: 'Events' }
];

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

export default function MarketingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const isNarrowMobile = width <= 340;
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  // Layout sizing
  const pagePadding = isMobile ? 16 : 32;
  const gridGap = 12;
  const columns = isMobile ? 2 : 4;
  const overviewCardWidth = isMobile
    ? (width - (pagePadding * 2) - gridGap) / columns
    : (Math.min(width, 1200) - (pagePadding * 2) - (gridGap * 3)) / columns;

  // Modal states
  const [directRequestVisible, setDirectRequestVisible] = useState(false);
  const [postRequirementVisible, setPostRequirementVisible] = useState(false);
  const [browseAgenciesVisible, setBrowseAgenciesVisible] = useState(false);
  const [viewRequirementVisible, setViewRequirementVisible] = useState(false);
  const [viewProposalVisible, setViewProposalVisible] = useState(false);

  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedProp, setSelectedProp] = useState(null);
  const [campaignRequestsVisible, setCampaignRequestsVisible] = useState(false);

  // Dynamic backend state
  const [metrics, setMetrics] = useState({
    activeReq: 0,
    proposals: 0,
    campaigns: 0,
    completed: 0,
  });
  const [myRequirements, setMyRequirements] = useState([]);
  const [recentProposals, setRecentProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchMarketingDashboardSummary(ownerId);
      if (res.success && res.data) {
        if (res.data.metrics) setMetrics(res.data.metrics);
        if (res.data.myRequirements) setMyRequirements(res.data.myRequirements);
        if (res.data.recentProposals) setRecentProposals(res.data.recentProposals);
      }
    } catch (err) {
      console.warn('Failed to load marketing dashboard summary:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ownerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openDirectRequest = () => setDirectRequestVisible(true);
  const openPostRequirement = () => setPostRequirementVisible(true);

  // Overview metric cards config
  const OVERVIEW_METRICS = [
    {
      id: 'activeReq',
      label: 'Active Requirements',
      value: String(metrics.activeReq),
      icon: ClipboardList,
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      id: 'proposals',
      label: 'Proposals Received',
      value: String(metrics.proposals),
      icon: MessageSquare,
      color: '#8B5CF6',
      bgColor: '#F5F3FF'
    },
    {
      id: 'campaigns',
      label: 'Active Campaigns',
      value: String(metrics.campaigns),
      icon: Megaphone,
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    {
      id: 'completed',
      label: 'Completed Campaigns',
      value: String(metrics.completed),
      icon: CircleCheck,
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    }
  ];

  return (
    <View style={styles.wrapper}>
      {/* ── 1. Page Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.pageTitle}>Marketing</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCampaignRequestsVisible(true)}>
            <Package size={20} color={NAVY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── 2. Overview Grid (2 x 2 Grid) ── */}
          <View style={styles.sectionContainer}>
            <View style={[styles.gridContainer, { gap: gridGap }]}>
              {OVERVIEW_METRICS.map((stat) => {
                const IconComp = stat.icon;
                return (
                  <View key={stat.id} style={[styles.overviewCard, { width: overviewCardWidth }]}>
                    <View style={styles.overviewHeader}>
                      <View style={[styles.overviewIconBox, { backgroundColor: stat.bgColor }]}>
                        <IconComp size={20} color={stat.color} strokeWidth={2.5} />
                      </View>
                      <Text style={styles.overviewValue}>{stat.value}</Text>
                    </View>
                    <Text style={styles.overviewLabel} numberOfLines={1}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── 3. Action Cards (Post Requirement + Browse Agencies) ── */}
          <View style={styles.actionsRow}>
            {/* Post Requirement Card (Primary Navy Card like Photo 2) */}
            <TouchableOpacity
              style={styles.primaryActionCard}
              onPress={openPostRequirement}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <View style={styles.actionHeader}>
                <View style={styles.primaryActionIconBox}>
                  <ClipboardPlus size={22} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.primaryActionTitle} numberOfLines={1}>Post Requirement</Text>
            </TouchableOpacity>

            {/* Browse Agencies Card (Secondary White Card like Photo 2) */}
            <TouchableOpacity
              style={styles.secondaryActionCard}
              onPress={() => setBrowseAgenciesVisible(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <View style={styles.actionHeader}>
                <View style={styles.secondaryActionIconBox}>
                  <Search size={22} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.secondaryActionTitle} numberOfLines={1}>Browse Agencies</Text>
            </TouchableOpacity>
          </View>

          {/* ── 4. Popular Marketing Services ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Marketing Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScroll}>
              {POPULAR_SERVICES.map(service => {
                const IconComp = service.icon;
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={openPostRequirement}
                  >
                    <View style={styles.serviceIconBox}>
                      <IconComp size={20} color="#475569" />
                    </View>
                    <Text style={styles.serviceTitle} numberOfLines={2}>{service.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ── 5. My Requirements ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>My Requirements</Text>
              </View>
              <TouchableOpacity onPress={openPostRequirement}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : myRequirements.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <ClipboardList size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                <Text style={styles.emptyTitle}>No active requirements</Text>
                <Text style={styles.emptySubtitle}>Your active marketing requirements will appear here.</Text>
              </View>
            ) : (
              <View style={styles.cardsList}>
                {myRequirements.slice(0, 5).map((req) => (
                  <View key={req.id} style={styles.reqCard}>
                    <View style={styles.reqCardHeader}>
                      <Text style={styles.reqId}>{req.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(req.status) }]}>
                        <Text style={[styles.statusBadgeText, { color: getStatusColor(req.status) }]}>{req.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.reqTitle} numberOfLines={1}>{req.title}</Text>
                    <Text style={styles.reqService}>{req.service}</Text>

                    <View style={styles.reqFooter}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reqProposalsText}>{req.proposals} Proposals</Text>
                        <Text style={styles.reqBudgetText}>{req.budget}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.reqViewBtn}
                        onPress={() => {
                          setSelectedReq(req);
                          setViewRequirementVisible(true);
                        }}
                        accessibilityRole="button"
                      >
                        <Text style={styles.reqViewBtnText}>View Requirement</Text>
                        <ChevronRight size={14} color={NAVY} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ── 6. Recent Proposals ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Recent Proposals</Text>
              </View>
              <TouchableOpacity onPress={openPostRequirement}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            ) : recentProposals.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <MessageSquare size={32} color="#CBD5E1" style={{ marginBottom: 8 }} />
                <Text style={styles.emptyTitle}>No proposals received yet</Text>
                <Text style={styles.emptySubtitle}>Proposals from verified agencies will appear here.</Text>
              </View>
            ) : (
              <View style={styles.cardsList}>
                {recentProposals.slice(0, 5).map((prop) => (
                  <View key={prop.id} style={styles.proposalCard}>
                    <View style={styles.propHeader}>
                      <View style={styles.propAvatar}>
                        <Text style={styles.propAvatarText}>{prop.initials}</Text>
                      </View>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <View style={styles.propNameRow}>
                          <Text style={styles.propAgencyName} numberOfLines={1}>{prop.agencyName}</Text>
                          {prop.verified && <BadgeCheck size={14} color="#8B5CF6" style={{ marginLeft: 4 }} />}
                          <View style={styles.ratingBadge}>
                            <Star size={11} color="#D97706" fill="#D97706" />
                            <Text style={styles.ratingText}>{prop.rating}</Text>
                          </View>
                        </View>
                        <Text style={styles.propReqTitle} numberOfLines={1}>{prop.reqName}</Text>
                      </View>
                    </View>

                    <View style={styles.propMetaRow}>
                      <View style={styles.propMetaItem}>
                        <Text style={styles.propMetaLabel}>Price</Text>
                        <Text style={styles.propMetaValue}>{prop.amount}</Text>
                      </View>
                      <View style={styles.propMetaItem}>
                        <Text style={styles.propMetaLabel}>Duration</Text>
                        <Text style={styles.propMetaValue}>{prop.duration}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.propViewBtn}
                        onPress={() => {
                          setSelectedProp(prop);
                          setViewProposalVisible(true);
                        }}
                        accessibilityRole="button"
                      >
                        <Text style={styles.propViewBtnText}>View Proposal</Text>
                        <ChevronRight size={14} color={NAVY} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* ── POPUP MODALS & DIALOGS ── */}

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

      {/* Browse Agencies Popup */}
      {browseAgenciesVisible && (
        <Modal visible={browseAgenciesVisible} animationType="slide">
          <BrowseAgenciesPage
            onBack={() => setBrowseAgenciesVisible(false)}
            onViewProfile={(agency) => {
              setBrowseAgenciesVisible(false);
            }}
          />
        </Modal>
      )}
 
      {/* Campaign Requests Popup */}
      {campaignRequestsVisible && (
        <Modal visible={campaignRequestsVisible} animationType="slide">
          <CampaignRequestsPage
            onBack={() => setCampaignRequestsVisible(false)}
            onViewResponses={(req) => {
              setCampaignRequestsVisible(false);
            }}
          />
        </Modal>
      )}

      {/* View Requirement Modal */}
      <Modal visible={viewRequirementVisible} animationType="slide" transparent={true} onRequestClose={() => setViewRequirementVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCentered}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Requirement Details</Text>
              <TouchableOpacity onPress={() => setViewRequirementVisible(false)}>
                <X size={22} color={NAVY} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedReq && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>ID</Text>
                  <Text style={styles.reviewValue}>{selectedReq.id}</Text>
                  <Text style={styles.reviewLabel}>Title</Text>
                  <Text style={styles.reviewValue}>{selectedReq.title}</Text>
                  <Text style={styles.reviewLabel}>Service</Text>
                  <Text style={styles.reviewValue}>{selectedReq.service}</Text>
                  <Text style={styles.reviewLabel}>Status</Text>
                  <Text style={styles.reviewValue}>{selectedReq.status}</Text>
                  <Text style={styles.reviewLabel}>Budget Range</Text>
                  <Text style={styles.reviewValue}>{selectedReq.budget}</Text>
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
              <TouchableOpacity onPress={() => setViewProposalVisible(false)}>
                <X size={22} color={NAVY} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedProp && (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewLabel}>Agency Name</Text>
                  <Text style={styles.reviewValue}>{selectedProp.agencyName}</Text>
                  <Text style={styles.reviewLabel}>For Requirement</Text>
                  <Text style={styles.reviewValue}>{selectedProp.reqName}</Text>
                  <Text style={styles.reviewLabel}>Quoted Amount</Text>
                  <Text style={styles.reviewValue}>{selectedProp.amount}</Text>
                  <Text style={styles.reviewLabel}>Duration</Text>
                  <Text style={styles.reviewValue}>{selectedProp.duration}</Text>

                  <View style={{ marginTop: 20, gap: 10 }}>
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

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: BORDER },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: TEXT_MUTED },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center'
  },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 28 },

  // Section Container
  sectionContainer: { gap: 12 },

  // Overview 2x2 Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  overviewIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '900',
    color: NAVY,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_MUTED
  },

  // Action Cards Row (Matching Photo 2)
  actionsRow: { flexDirection: 'row', gap: 12 },
  primaryActionCard: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 16,
    padding: 16,
    minHeight: 105,
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  primaryActionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryActionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 14
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    minHeight: 105,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  secondaryActionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryActionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14
  },
  actionHeader: { flexDirection: 'row', alignItems: 'center' },

  // Sections
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  sectionSubtitle: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

  // Popular Services
  servicesScroll: { gap: 12, paddingRight: 16 },
  serviceCard: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, width: 92, height: 102, borderWidth: 1, borderColor: BORDER },
  serviceIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceTitle: { fontSize: 11, fontWeight: '600', color: '#475569', textAlign: 'center' },

  // Lists & Cards
  cardsList: { gap: 12 },
  reqCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  reqCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reqId: { fontSize: 12, fontWeight: '700', color: TEXT_MUTED },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  reqTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 2 },
  reqService: { fontSize: 12, color: TEXT_MUTED, marginBottom: 12 },
  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reqProposalsText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  reqBudgetText: { fontSize: 11, color: TEXT_MUTED, marginTop: 1 },
  reqViewBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER },
  reqViewBtnText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Proposal Card
  proposalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  propHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  propAvatar: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  propAvatarText: { fontSize: 15, fontWeight: '800', color: ACCENT_PURPLE },
  propNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  propAgencyName: { fontSize: 15, fontWeight: '800', color: NAVY },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#D97706', marginLeft: 2 },
  propReqTitle: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  propMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  propMetaItem: { flex: 1 },
  propMetaLabel: { fontSize: 11, color: TEXT_MUTED },
  propMetaValue: { fontSize: 13, fontWeight: '800', color: NAVY, marginTop: 1 },
  propViewBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: BORDER },
  propViewBtnText: { fontSize: 12, fontWeight: '700', color: NAVY, marginRight: 2 },

  // Empty State Card
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 210
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: TEXT_MUTED, textAlign: 'center', marginBottom: 12 },
  emptyBtn: { backgroundColor: NAVY, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  emptyBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.55)', justifyContent: 'center', alignItems: 'center' },
  modalContentCentered: { width: '90%', maxWidth: 500, backgroundColor: '#FFFFFF', borderRadius: 16, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 17, fontWeight: '800', color: NAVY },
  modalBody: { padding: 16 },
  reviewBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  reviewLabel: { fontSize: 11, color: TEXT_MUTED, marginBottom: 2 },
  reviewValue: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 10 },
  primaryBtnLarge: { backgroundColor: NAVY, padding: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnLargeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
