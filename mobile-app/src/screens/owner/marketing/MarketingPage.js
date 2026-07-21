import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions , Alert} from 'react-native';
import {
  Megaphone, MonitorPlay, Radio, Presentation, FileText, CheckCircle, Clock,
  ArrowRight, MapPin, Star, ShieldCheck, Target, BarChart2, Briefcase, Zap, PlusCircle, Package
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import OnlineBroadcastPage from './OnlineBroadcastPage';
import OfflineBroadcastPage from './OfflineBroadcastPage';
import BrowseAgenciesPage from './BrowseAgenciesPage';
import AgencyProfilePage from './AgencyProfilePage';
import AgencyDirectReqPage from './AgencyDirectReqPage';
import CampaignRequestsPage from './CampaignRequestsPage';
import AgencyResponsesPage from './AgencyResponsesPage';
import CompareAgenciesPage from './CompareAgenciesPage';
import TrackCampaignPage from './TrackCampaignPage';
import CampaignReviewPage from './CampaignReviewPage';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';
const LIGHT_BG = '#F8FAFC';

// =====================================
// MOCK DATA
// =====================================
const SUMMARY_STATS = {
  activeCampaigns: 4,
  agencyResponses: 12,
  runningCampaigns: 2,
  completedCampaigns: 28
};

const RECENT_REQUESTS = [
  { id: 'CMP-001', title: 'Summer Festival Promo', category: 'Social Media', status: 'Pending', responses: 5, date: 'Today, 10:30 AM' },
  { id: 'CMP-002', title: 'New Menu Launch', category: 'Outdoor Branding', status: 'Active', responses: 3, date: 'Yesterday, 02:15 PM' }
];

const UPCOMING_CAMPAIGNS = [
  { id: 'UC-001', title: 'Diwali Special Offers', agency: 'Creative Minds', date: 'Starts: 10 Nov', type: 'Meta Ads' },
  { id: 'UC-002', title: 'Highway Hoarding', agency: 'Outfront Media', date: 'Starts: 01 Dec', type: 'Offline' }
];

const PREFERRED_AGENCIES = [
  { id: 'AGY-001', name: 'Creative Minds', category: 'Digital Marketing', rating: 4.9, campaigns: 15, verified: true },
  { id: 'AGY-002', name: 'Outfront Media', category: 'Outdoor Ads', rating: 4.8, campaigns: 8, verified: true }
];

const TOP_RATED_AGENCIES = [
  { id: 'AGY-003', name: 'BrandBoosters', category: 'Social Media', rating: 5.0, campaigns: 42, verified: true },
  { id: 'AGY-004', name: 'PixelPerfect', category: 'Graphic Design', rating: 4.7, campaigns: 24, verified: false }
];

const ONLINE_CATEGORIES = [
  { id: 'ONL-1', name: 'Social Media', icon: Target },
  { id: 'ONL-2', name: 'Meta Ads', icon: MonitorPlay },
  { id: 'ONL-3', name: 'Google Ads', icon: MonitorPlay },
  { id: 'ONL-4', name: 'SEO', icon: SearchIconMock },
  { id: 'ONL-5', name: 'Branding', icon: Briefcase },
  { id: 'ONL-6', name: 'Graphic Design', icon: Zap },
  { id: 'ONL-7', name: 'Photography', icon: Zap },
  { id: 'ONL-8', name: 'Videography', icon: MonitorPlay },
  { id: 'ONL-9', name: 'Website Design', icon: MonitorPlay }
];

const OFFLINE_CATEGORIES = [
  { id: 'OFF-1', name: 'Hoarding', icon: Presentation },
  { id: 'OFF-2', name: 'Banner Printing', icon: Presentation },
  { id: 'OFF-3', name: 'Newspaper Ads', icon: FileText },
  { id: 'OFF-4', name: 'Radio Ads', icon: Radio },
  { id: 'OFF-5', name: 'Event Promotion', icon: Megaphone },
  { id: 'OFF-6', name: 'Restaurant Launch', icon: Briefcase },
  { id: 'OFF-7', name: 'Outdoor Branding', icon: MapPin }
];

const PERFORMANCE_DATA = [
  { metric: 'Total Reach', value: '1.2M', change: '+12%', positive: true },
  { metric: 'Engagement', value: '84.5K', change: '+5.4%', positive: true },
  { metric: 'Conversions', value: '3,240', change: '-2.1%', positive: false }
];

// Mocking icons not directly imported
function SearchIconMock(props) {
  return <Target {...props} />;
}

// =====================================
// REUSABLE COMPONENTS
// =====================================

const SummaryCard = ({ title, value, icon: Icon, bgColor, iconColor, customStyle }) => (
  <View style={[styles.summaryCard, customStyle]}>
    <View style={[styles.summaryIconBox, { backgroundColor: bgColor }]}>
      <Icon size={20} color={iconColor} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{title}</Text>
  </View>
);

const CampaignRequestCard = ({ request }) => (
  <View style={styles.requestCard}>
    <View style={styles.requestHeader}>
      <Text style={styles.requestTitle}>{request.title}</Text>
      <View style={[styles.statusBadge,
      request.status === 'Completed' ? styles.statusSuccess :
        request.status === 'Active' ? styles.statusPrimary : styles.statusWarning
      ]}>
        <Text style={[styles.statusText,
        request.status === 'Completed' ? styles.statusSuccessText :
          request.status === 'Active' ? styles.statusPrimaryText : styles.statusWarningText
        ]}>{request.status}</Text>
      </View>
    </View>
    <Text style={styles.requestMeta}>{request.category} • {request.date}</Text>
    <View style={styles.requestFooter}>
      <Text style={styles.requestResponses}>{request.responses} Agency Responses</Text>
      <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const AgencyCard = ({ agency }) => (
  <View style={styles.providerCard}>
    <View style={styles.providerHeader}>
      <View style={styles.providerAvatar}>
        <Text style={styles.providerAvatarText}>{agency.name.charAt(0)}</Text>
      </View>
      <View style={styles.ratingBox}>
        <Star size={12} color={GOLD} fill={GOLD} />
        <Text style={styles.ratingText}>{agency.rating}</Text>
      </View>
    </View>
    <View style={styles.providerNameRow}>
      <Text style={styles.providerName} numberOfLines={1}>{agency.name}</Text>
      {agency.verified && <ShieldCheck size={14} color="#16A34A" style={{ marginLeft: 4 }} />}
    </View>
    <Text style={styles.providerCategory}>{agency.category}</Text>
    <Text style={styles.providerJobs}>{agency.campaigns} Campaigns</Text>
    <TouchableOpacity style={styles.providerBtn}>
      <Text style={styles.providerBtnText}>View Profile</Text>
    </TouchableOpacity>
  </View>
);

const CategoryItem = ({ category, type }) => {
  const Icon = category.icon;
  return (
    <View style={styles.categoryItem}>
      <View style={[styles.catIconBox, type === 'offline' && { backgroundColor: '#FEE2E2' }]}>
        <Icon size={16} color={type === 'offline' ? '#991B1B' : NAVY} />
      </View>
      <Text style={styles.categoryItemName}>{category.name}</Text>
    </View>
  );
};

// =====================================
// MAIN SCREEN
// =====================================
export default function MarketingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [currentView, setCurrentView] = useState('home');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  if (currentView === 'onlineBroadcast') {
    return (
      <OnlineBroadcastPage
        onBack={() => setCurrentView('home')}
        onViewCampaigns={() => setCurrentView('home')} // Link to 'myCampaigns' when it is built
      />
    );
  }

  if (currentView === 'offlineBroadcast') {
    return (
      <OfflineBroadcastPage
        onBack={() => setCurrentView('home')}
        onViewRequests={() => setCurrentView('campaignRequests')}
      />
    );
  }

  if (currentView === 'campaignRequests') {
    return (
      <CampaignRequestsPage
        onBack={() => setCurrentView('home')}
        onViewResponses={(req) => {
          setSelectedRequest(req);
          setCurrentView('agencyResponses');
        }}
        onTrack={(req) => {
          setSelectedRequest(req);
          setCurrentView('trackCampaign');
        }}
      />
    );
  }

  if (currentView === 'agencyResponses') {
    return (
      <AgencyResponsesPage
        request={selectedRequest}
        onBack={() => setCurrentView('campaignRequests')}
        onCompare={() => setCurrentView('compareAgencies')}
        onAccept={(agency) => {
          // Success/Home link placeholder
          setCurrentView('home');
        }}
      />
    );
  }

  if (currentView === 'compareAgencies') {
    return (
      <CompareAgenciesPage
        onBack={() => setCurrentView('agencyResponses')}
        onAccept={(agency) => {
          // Success/Home link placeholder
          setCurrentView('trackCampaign');
        }}
      />
    );
  }

  if (currentView === 'trackCampaign') {
    return (
      <TrackCampaignPage
        campaign={selectedRequest}
        onBack={() => setCurrentView('campaignRequests')}
        onReview={() => setCurrentView('campaignReview')}
        onBookAgain={() => setCurrentView('onlineBroadcast')}
      />
    );
  }

  if (currentView === 'campaignReview') {
    return (
      <CampaignReviewPage
        onBack={() => setCurrentView('trackCampaign')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'browseAgencies') {
    return (
      <BrowseAgenciesPage
        onBack={() => setCurrentView('home')}
        onViewProfile={(agency) => {
          setSelectedAgency(agency);
          setCurrentView('agencyProfile');
        }}
      />
    );
  }

  if (currentView === 'agencyProfile') {
    return (
      <AgencyProfilePage
        agency={selectedAgency}
        onBack={() => setCurrentView('browseAgencies')}
        onSendRequirement={(agency) => {
          setSelectedAgency(agency);
          setCurrentView('agencyDirectReq');
        }}
      />
    );
  }

  if (currentView === 'agencyDirectReq') {
    return (
      <AgencyDirectReqPage
        agency={selectedAgency}
        onBack={() => setCurrentView('agencyProfile')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.pageTitle}>Marketing</Text>
          <Text style={styles.pageSubtitle}>Launch digital and offline campaigns to grow your business.</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('campaignRequests')}>
            <Package size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Top Summary Cards ── */}
          <View style={[styles.summaryGrid, isMobile && { flexWrap: 'wrap' }]}>
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Active Campaigns" value={SUMMARY_STATS.activeCampaigns} icon={Megaphone} bgColor="#FFFBEB" iconColor={GOLD} />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Agency Responses" value={SUMMARY_STATS.agencyResponses} icon={FileText} bgColor="#EFF6FF" iconColor="#2563EB" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Running Campaigns" value={SUMMARY_STATS.runningCampaigns} icon={BarChart2} bgColor="#F3E8FF" iconColor="#9333EA" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Completed Campaigns" value={SUMMARY_STATS.completedCampaigns} icon={CheckCircle} bgColor="#DCFCE7" iconColor="#16A34A" />
          </View>

          {/* ── Quick Actions ── */}
          <View style={[styles.actionsRow, isMobile && { flexDirection: 'column' }]}>
            <TouchableOpacity
              style={styles.primaryActionCard}
              onPress={() => setCurrentView('onlineBroadcast')}
            >
              <View style={styles.actionHeader}>
                <View style={styles.primaryIconBox}>
                  <MonitorPlay size={24} color="#fff" />
                </View>
                <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.primaryActionTitle}>Online Marketing</Text>
              <Text style={styles.primaryActionDesc}>Run digital marketing campaigns.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionCard}
              onPress={() => setCurrentView('offlineBroadcast')}
            >
              <View style={styles.actionHeader}>
                <View style={styles.secondaryIconBox}>
                  <Presentation size={24} color={NAVY} />
                </View>
                <ArrowRight size={20} color={NAVY} />
              </View>
              <Text style={styles.secondaryActionTitle}>Offline Marketing</Text>
              <Text style={styles.secondaryActionDesc}>Promote your business using offline media.</Text>
            </TouchableOpacity>
          </View>

          {/* ── Two Column Layout for Grids ── */}
          <View style={[styles.twoColGrid, isMobile && { flexDirection: 'column' }]}>

            {/* Left Column */}
            <View style={styles.colHalf}>
              {/* Recent Campaign Requests */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Campaign Requests</Text>
                  <TouchableOpacity onPress={() => setCurrentView('campaignRequests')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                {RECENT_REQUESTS.map(req => <CampaignRequestCard key={req.id} request={req} />)}
              </View>

              {/* Performance Summary */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Campaign Performance Summary</Text>
                </View>
                <View style={styles.perfCard}>
                  {PERFORMANCE_DATA.map((data, idx) => (
                    <View key={idx} style={styles.perfRow}>
                      <Text style={styles.perfMetric}>{data.metric}</Text>
                      <View style={styles.perfRight}>
                        <Text style={styles.perfValue}>{data.value}</Text>
                        <View style={[styles.perfBadge, data.positive ? styles.perfBadgePos : styles.perfBadgeNeg]}>
                          <Text style={[styles.perfBadgeText, data.positive ? styles.perfBadgeTextPos : styles.perfBadgeTextNeg]}>{data.change}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* ── Preferred Agencies ── */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Preferred Agencies</Text>
                  <TouchableOpacity onPress={() => setCurrentView('browseAgencies')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                  {PREFERRED_AGENCIES.map(agency => (
                    <TouchableOpacity key={agency.id} onPress={() => { setSelectedAgency(agency); setCurrentView('agencyProfile'); }}>
                      <AgencyCard agency={agency} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

            </View>

            {/* Right Column */}
            <View style={styles.colHalf}>
              {/* Upcoming Campaigns */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Campaigns</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                {UPCOMING_CAMPAIGNS.map(cmp => (
                  <View key={cmp.id} style={styles.upcomingCard}>
                    <View style={styles.upcomingTop}>
                      <View style={styles.upcomingIcon}>
                        <Megaphone size={20} color={NAVY} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.upcomingTitle}>{cmp.title}</Text>
                        <Text style={styles.upcomingAgency}>{cmp.agency}</Text>
                      </View>
                    </View>
                    <View style={styles.upcomingBottom}>
                      <Text style={styles.upcomingDate}>{cmp.date}</Text>
                      <View style={styles.upcomingBadge}>
                        <Text style={styles.upcomingBadgeText}>{cmp.type}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Popular Categories */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular Marketing Categories</Text>
                </View>
                <View style={styles.categoriesWrapper}>
                  <Text style={styles.catHeading}>Online Categories</Text>
                  <View style={styles.catFlexRow}>
                    {ONLINE_CATEGORIES.map(cat => <CategoryItem key={cat.id} category={cat} type="online" />)}
                  </View>

                  <Text style={[styles.catHeading, { marginTop: 16 }]}>Offline Categories</Text>
                  <View style={styles.catFlexRow}>
                    {OFFLINE_CATEGORIES.map(cat => <CategoryItem key={cat.id} category={cat} type="offline" />)}
                  </View>
                </View>
              </View>

              {/* ── Top Rated Agencies ── */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Top Rated Agencies</Text>
                  <TouchableOpacity onPress={() => setCurrentView('browseAgencies')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                  {TOP_RATED_AGENCIES.map(agency => (
                    <TouchableOpacity key={agency.id} onPress={() => { setSelectedAgency(agency); setCurrentView('agencyProfile'); }}>
                      <AgencyCard agency={agency} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

            </View>

          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// =====================================
// STYLES
// =====================================
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: LIGHT_BG },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 32 },

  // Summary Cards
  summaryGrid: { flexDirection: 'row', gap: 16 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  summaryIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  summaryValue: { fontSize: 28, fontWeight: '900', color: NAVY, marginBottom: 4 },
  summaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 16 },
  primaryActionCard: { flex: 1, backgroundColor: NAVY, borderRadius: 16, padding: 24 },
  secondaryActionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  actionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  primaryIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  secondaryIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  primaryActionTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  primaryActionDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  secondaryActionTitle: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 8 },
  secondaryActionDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },

  // Sections & Grids
  twoColGrid: { flexDirection: 'row', gap: 24 },
  colHalf: { flex: 1, gap: 24 },
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  horizontalScroll: { gap: 16, paddingRight: 16 },

  // Request Card
  requestCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  requestTitle: { fontSize: 16, fontWeight: '800', color: NAVY, flex: 1, paddingRight: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusWarning: { backgroundColor: '#FEF3C7' },
  statusWarningText: { color: '#D97706', fontSize: 11, fontWeight: '700' },
  statusSuccess: { backgroundColor: '#DCFCE7' },
  statusSuccessText: { color: '#16A34A', fontSize: 11, fontWeight: '700' },
  statusPrimary: { backgroundColor: '#EFF6FF' },
  statusPrimaryText: { color: '#2563EB', fontSize: 11, fontWeight: '700' },
  requestMeta: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  requestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  requestResponses: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  viewBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: NAVY },

  // Upcoming Campaigns
  upcomingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  upcomingTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  upcomingIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  upcomingTitle: { fontSize: 15, fontWeight: '800', color: NAVY },
  upcomingAgency: { fontSize: 13, color: '#64748B', marginTop: 2 },
  upcomingBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  upcomingDate: { fontSize: 13, fontWeight: '700', color: NAVY },
  upcomingBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  upcomingBadgeText: { fontSize: 11, fontWeight: '600', color: '#475569' },

  // Performance Summary
  perfCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  perfMetric: { fontSize: 14, fontWeight: '600', color: '#475569' },
  perfRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perfValue: { fontSize: 16, fontWeight: '800', color: NAVY },
  perfBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  perfBadgePos: { backgroundColor: '#DCFCE7' },
  perfBadgeNeg: { backgroundColor: '#FEF2F2' },
  perfBadgeText: { fontSize: 11, fontWeight: '700' },
  perfBadgeTextPos: { color: '#16A34A' },
  perfBadgeTextNeg: { color: '#DC2626' },

  // Categories
  categoriesWrapper: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  catHeading: { fontSize: 13, fontWeight: '800', color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  catFlexRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingRight: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  catIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  categoryItemName: { fontSize: 13, fontWeight: '600', color: NAVY },

  // Agency Card
  providerCard: { width: 240, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  providerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  providerAvatar: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  providerAvatarText: { fontSize: 16, fontWeight: '800', color: NAVY },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 11, fontWeight: '700', color: GOLD, marginLeft: 4 },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  providerName: { fontSize: 15, fontWeight: '800', color: NAVY, flex: 1 },
  providerCategory: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  providerJobs: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 16 },
  providerBtn: { paddingVertical: 8, borderRadius: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  providerBtnText: { fontSize: 12, fontWeight: '700', color: NAVY }
});
