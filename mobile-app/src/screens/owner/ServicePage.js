import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { 
  Wrench, FileText, MessageSquare, Clock, CheckCircle, 
  PlusCircle, Search, ArrowRight, Activity, MapPin, ShieldCheck, Star, Zap, Droplets, Hammer, Wind, Package
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import BroadcastRequirementPage from './Service_provider/BroadcastRequirementPage';
import MyRequestsPage from './Service_provider/MyRequestsPage';
import ProviderResponsesPage from './Service_provider/ProviderResponsesPage';
import BrowseProvidersPage from './Service_provider/BrowseProvidersPage';
import ProviderProfilePage from './Service_provider/ProviderProfilePage';
import DirectRequirementPage from './Service_provider/DirectRequirementPage';
import CompareProvidersPage from './Service_provider/CompareProvidersPage';
import ServiceSchedulingPage from './Service_provider/ServiceSchedulingPage';
import TrackServicePage from './Service_provider/TrackServicePage';
import ServiceReviewPage from './Service_provider/ServiceReviewPage';
import ServiceComplaintPage from './Service_provider/ServiceComplaintPage';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';
const LIGHT_BG = '#F8FAFC';

// =====================================
// MOCK DATA
// =====================================
const SUMMARY_STATS = {
  activeRequests: 0,
  providerResponses: 0,
  scheduledServices: 0,
  completedServices: 0
};

const RECENT_REQUESTS = [];

const TOP_RATED_PROVIDERS = [];


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

const ServiceRequestCard = ({ request, onView }) => (
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
      <Text style={styles.requestResponses}>{request.responses} Responses</Text>
      <TouchableOpacity style={styles.viewBtn} onPress={onView}>
        <Text style={styles.viewBtnText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ProviderCard = ({ provider }) => (
  <View style={styles.providerCard}>
    <View style={styles.providerHeader}>
      <View style={styles.providerAvatar}>
        <Text style={styles.providerAvatarText}>{provider.name.charAt(0)}</Text>
      </View>
      <View style={styles.ratingBox}>
        <Star size={12} color={GOLD} fill={GOLD} />
        <Text style={styles.ratingText}>{provider.rating}</Text>
      </View>
    </View>
    <View style={styles.providerNameRow}>
      <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
      {provider.verified && <ShieldCheck size={14} color="#16A34A" style={{ marginLeft: 4 }} />}
    </View>
    <Text style={styles.providerCategory}>{provider.category}</Text>
    <Text style={styles.providerJobs}>{provider.jobs} Jobs Completed</Text>
    <TouchableOpacity style={styles.providerBtn}>
      <Text style={styles.providerBtnText}>View Profile</Text>
    </TouchableOpacity>
  </View>
);


// =====================================
// MAIN SCREEN
// =====================================
export default function ServicePage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [currentView, setCurrentView] = useState('home');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  if (currentView === 'broadcast') {
    return (
      <BroadcastRequirementPage 
        onBack={() => setCurrentView('home')} 
        onViewRequests={() => setCurrentView('requests')} 
      />
    );
  }

  if (currentView === 'requests') {
    return (
      <MyRequestsPage 
        onBack={() => setCurrentView('home')}
        onViewResponses={(req) => {
          setSelectedRequest(req);
          setCurrentView('providerResponses');
        }}
      />
    );
  }

  if (currentView === 'providerResponses') {
    return (
      <ProviderResponsesPage 
        request={selectedRequest}
        onBack={() => setCurrentView('requests')}
        onCompare={() => setCurrentView('compareProviders')}
        onAccept={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('serviceScheduling');
        }}
      />
    );
  }

  if (currentView === 'compareProviders') {
    return (
      <CompareProvidersPage 
        request={selectedRequest}
        onBack={() => setCurrentView('providerResponses')}
        onSelectProvider={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('serviceScheduling');
        }}
      />
    );
  }

  if (currentView === 'serviceScheduling') {
    return (
      <ServiceSchedulingPage 
        provider={selectedProvider}
        onBack={() => setCurrentView('providerResponses')}
        onHome={() => setCurrentView('home')}
        onTrackService={() => setCurrentView('trackService')}
      />
    );
  }

  if (currentView === 'trackService') {
    return (
      <TrackServicePage 
        request={selectedRequest}
        onBack={() => setCurrentView('requests')}
        onReview={() => setCurrentView('serviceReview')}
        onComplaint={() => setCurrentView('serviceComplaint')}
        onBookAgain={() => setCurrentView('directRequirement')}
      />
    );
  }

  if (currentView === 'serviceReview') {
    return (
      <ServiceReviewPage 
        onBack={() => setCurrentView('trackService')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'serviceComplaint') {
    return (
      <ServiceComplaintPage 
        onBack={() => setCurrentView('trackService')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'browseProviders') {
    return (
      <BrowseProvidersPage 
        onBack={() => setCurrentView('home')}
        onViewProfile={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('providerProfile');
        }}
        onSendRequest={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('directRequirement');
        }}
      />
    );
  }

  if (currentView === 'providerProfile') {
    return (
      <ProviderProfilePage 
        provider={selectedProvider}
        onBack={() => setCurrentView('browseProviders')}
        onSendRequirement={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('directRequirement');
        }}
      />
    );
  }

  if (currentView === 'directRequirement') {
    return (
      <DirectRequirementPage 
        provider={selectedProvider}
        onBack={() => setCurrentView('browseProviders')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.pageTitle}>Service Providers</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('requests')}>
            <Package size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Top Summary Cards ── */}
          <View style={[styles.summaryGrid, isMobile && { flexWrap: 'wrap' }]}>
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Active Requirements" value={SUMMARY_STATS.activeRequests} icon={FileText} bgColor="#FFFBEB" iconColor={GOLD} />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Provider Responses" value={SUMMARY_STATS.providerResponses} icon={MessageSquare} bgColor="#EFF6FF" iconColor="#2563EB" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Scheduled Services" value={SUMMARY_STATS.scheduledServices} icon={Clock} bgColor="#F3E8FF" iconColor="#9333EA" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Completed Services" value={SUMMARY_STATS.completedServices} icon={CheckCircle} bgColor="#DCFCE7" iconColor="#16A34A" />
          </View>

          {/* ── Quick Actions ── */}
          <View style={[styles.actionsRow, isMobile && { flexDirection: 'row' }]}>
            <TouchableOpacity 
              style={[styles.primaryActionCard, isMobile && { padding: 16 }]}
              onPress={() => setCurrentView('broadcast')}
            >
              <View style={[styles.actionHeader, isMobile && { marginBottom: 12 }]}>
                <View style={styles.primaryIconBox}>
                  <PlusCircle size={24} color="#fff" />
                </View>
                <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={[styles.primaryActionTitle, isMobile && { fontSize: 16, marginBottom: 0 }]}>Post Requirement</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryActionCard, isMobile && { padding: 16 }]}
              onPress={() => setCurrentView('browseProviders')}
            >
              <View style={[styles.actionHeader, isMobile && { marginBottom: 12 }]}>
                <View style={styles.secondaryIconBox}>
                  <Search size={24} color={NAVY} />
                </View>
                <ArrowRight size={20} color={NAVY} />
              </View>
              <Text style={[styles.secondaryActionTitle, isMobile && { fontSize: 16, marginBottom: 0 }]}>Browse Providers</Text>
            </TouchableOpacity>
          </View>

          {/* ── Single Column Sections ── */}
          <View style={styles.sectionsContainer}>
            
            {/* Recent Service Requests */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Requirements</Text>
                <TouchableOpacity onPress={() => setCurrentView('requests')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
              </View>
              <View style={styles.cardsList}>
                {RECENT_REQUESTS.map(req => (
                  <ServiceRequestCard 
                    key={req.id} 
                    request={req} 
                    onView={() => {
                      setSelectedRequest(req);
                      setCurrentView('providerResponses');
                    }}
                  />
                ))}
              </View>
            </View>

            {/* ── Top Rated Providers ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Rated Providers</Text>
                <TouchableOpacity onPress={() => setCurrentView('browseProviders')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {TOP_RATED_PROVIDERS.map(provider => (
                  <TouchableOpacity key={provider.id} onPress={() => { setSelectedProvider(provider); setCurrentView('providerProfile'); }}>
                    <ProviderCard provider={provider} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
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

  // Sections
  sectionsContainer: { gap: 24, marginTop: 8 },
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  cardsList: { gap: 12 },

  // Service Request Card
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

  horizontalScroll: { gap: 16, paddingRight: 16 },

  // Provider Card
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
