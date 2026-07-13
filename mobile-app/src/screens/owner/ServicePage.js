import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { 
  Wrench, FileText, MessageSquare, Clock, CheckCircle, 
  PlusCircle, Search, ArrowRight, MapPin, Star, ShieldCheck, 
  AlertTriangle, Hammer, Zap, Droplets, Wind
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
  activeRequests: 12,
  providerResponses: 28,
  scheduledServices: 5,
  completedServices: 142
};

const RECENT_REQUESTS = [
  { id: 'REQ-001', title: 'Deep Kitchen Cleaning', category: 'Cleaning', status: 'Pending', responses: 3, date: 'Today, 10:30 AM' },
  { id: 'REQ-002', title: 'HVAC Maintenance', category: 'Maintenance', status: 'Active', responses: 5, date: 'Yesterday, 02:15 PM' },
  { id: 'REQ-003', title: 'Plumbing Repair', category: 'Plumbing', status: 'Completed', responses: 2, date: '11 Jun, 09:00 AM' }
];

const UPCOMING_SERVICES = [
  { id: 'SRV-001', title: 'Monthly Pest Control', provider: 'SafeGuard Solutions', date: 'Tomorrow, 08:00 AM', type: 'Scheduled' },
  { id: 'SRV-002', title: 'AC Filter Replacement', provider: 'CoolBreeze HVAC', date: '15 Jul, 11:30 AM', type: 'Maintenance' }
];

const PREFERRED_PROVIDERS = [
  { id: 'PRV-001', name: 'SafeGuard Solutions', category: 'Pest Control', rating: 4.9, jobs: 45, verified: true },
  { id: 'PRV-002', name: 'ProClean Services', category: 'Cleaning', rating: 4.8, jobs: 112, verified: true }
];

const TOP_RATED_PROVIDERS = [
  { id: 'PRV-003', name: 'Elite Fixers', category: 'General Repair', rating: 5.0, jobs: 89, verified: true },
  { id: 'PRV-004', name: 'CoolBreeze HVAC', category: 'Maintenance', rating: 4.7, jobs: 34, verified: true }
];

const CATEGORIES = [
  { id: 'CAT-1', name: 'Cleaning', icon: Droplets },
  { id: 'CAT-2', name: 'Electrical', icon: Zap },
  { id: 'CAT-3', name: 'Plumbing', icon: Hammer },
  { id: 'CAT-4', name: 'HVAC', icon: Wind }
];

const EMERGENCY_SERVICES = [
  { id: 'EMG-1', title: 'Power Outage', timeToResolve: 'Under 30 mins' },
  { id: 'EMG-2', title: 'Water Leak', timeToResolve: 'Under 45 mins' }
];

// =====================================
// REUSABLE COMPONENTS
// =====================================

const SummaryCard = ({ title, value, icon: Icon, bgColor, iconColor }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconBox, { backgroundColor: bgColor }]}>
      <Icon size={20} color={iconColor} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{title}</Text>
  </View>
);

const ServiceRequestCard = ({ request }) => (
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
      <TouchableOpacity style={styles.viewBtn}>
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

const CategoryCard = ({ category }) => {
  const Icon = category.icon;
  return (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryIconBox}>
        <Icon size={24} color={NAVY} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
};

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
        onBack={() => setCurrentView('providerProfile')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View>
          <Text style={styles.pageTitle}>Service Providers</Text>
          <Text style={styles.pageSubtitle}>Manage your facility maintenance and service providers</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Top Summary Cards ── */}
          <View style={[styles.summaryGrid, isMobile && { flexDirection: 'column' }]}>
            <SummaryCard title="Active Requests" value={SUMMARY_STATS.activeRequests} icon={FileText} bgColor="#FFFBEB" iconColor={GOLD} />
            <SummaryCard title="Provider Responses" value={SUMMARY_STATS.providerResponses} icon={MessageSquare} bgColor="#EFF6FF" iconColor="#2563EB" />
            <SummaryCard title="Scheduled Services" value={SUMMARY_STATS.scheduledServices} icon={Clock} bgColor="#F3E8FF" iconColor="#9333EA" />
            <SummaryCard title="Completed Services" value={SUMMARY_STATS.completedServices} icon={CheckCircle} bgColor="#DCFCE7" iconColor="#16A34A" />
          </View>

          {/* ── Quick Actions ── */}
          <View style={[styles.actionsRow, isMobile && { flexDirection: 'column' }]}>
            <TouchableOpacity 
              style={styles.primaryActionCard}
              onPress={() => setCurrentView('broadcast')}
            >
              <View style={styles.actionHeader}>
                <View style={styles.primaryIconBox}>
                  <PlusCircle size={24} color="#fff" />
                </View>
                <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
              </View>
              <Text style={styles.primaryActionTitle}>Post Requirement</Text>
              <Text style={styles.primaryActionDesc}>Broadcast requirement to all eligible service providers.</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryActionCard}
              onPress={() => setCurrentView('browseProviders')}
            >
              <View style={styles.actionHeader}>
                <View style={styles.secondaryIconBox}>
                  <Search size={24} color={NAVY} />
                </View>
                <ArrowRight size={20} color={NAVY} />
              </View>
              <Text style={styles.secondaryActionTitle}>Browse Providers</Text>
              <Text style={styles.secondaryActionDesc}>Browse trusted service providers and send a direct requirement.</Text>
            </TouchableOpacity>
          </View>

          {/* ── Two Column Layout for Grids ── */}
          <View style={[styles.twoColGrid, isMobile && { flexDirection: 'column' }]}>
            
            {/* Left Column */}
            <View style={styles.colHalf}>
              {/* Recent Service Requests */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Service Requests</Text>
                  <TouchableOpacity onPress={() => setCurrentView('requests')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                {RECENT_REQUESTS.map(req => <ServiceRequestCard key={req.id} request={req} />)}
              </View>

              {/* Emergency Services */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Emergency Services</Text>
                </View>
                <View style={styles.emergencyContainer}>
                  {EMERGENCY_SERVICES.map(emg => (
                    <TouchableOpacity key={emg.id} style={styles.emergencyCard}>
                      <View style={styles.emergencyIcon}>
                        <AlertTriangle size={20} color="#DC2626" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.emergencyTitle}>{emg.title}</Text>
                        <Text style={styles.emergencyMeta}>{emg.timeToResolve}</Text>
                      </View>
                      <ArrowRight size={16} color="#DC2626" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ── Preferred Service Providers ── */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Preferred Service Providers</Text>
                  <TouchableOpacity onPress={() => setCurrentView('browseProviders')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                  {PREFERRED_PROVIDERS.map(provider => (
                    <TouchableOpacity key={provider.id} onPress={() => { setSelectedProvider(provider); setCurrentView('providerProfile'); }}>
                      <ProviderCard provider={provider} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.colHalf}>
              {/* Upcoming Services */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Services</Text>
                  <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                {UPCOMING_SERVICES.map(srv => (
                  <View key={srv.id} style={styles.upcomingCard}>
                    <View style={styles.upcomingTop}>
                      <View style={styles.upcomingIcon}>
                        <Wrench size={20} color={NAVY} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.upcomingTitle}>{srv.title}</Text>
                        <Text style={styles.upcomingProvider}>{srv.provider}</Text>
                      </View>
                    </View>
                    <View style={styles.upcomingBottom}>
                      <Text style={styles.upcomingDate}>{srv.date}</Text>
                      <View style={styles.upcomingBadge}>
                        <Text style={styles.upcomingBadgeText}>{srv.type}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Popular Service Categories */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular Service Categories</Text>
                </View>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map(cat => <CategoryCard key={cat.id} category={cat} />)}
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
  pageHeader: { paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
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

  // Upcoming Services
  upcomingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  upcomingTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  upcomingIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  upcomingTitle: { fontSize: 15, fontWeight: '800', color: NAVY },
  upcomingProvider: { fontSize: 13, color: '#64748B', marginTop: 2 },
  upcomingBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  upcomingDate: { fontSize: 13, fontWeight: '700', color: NAVY },
  upcomingBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  upcomingBadgeText: { fontSize: 11, fontWeight: '600', color: '#475569' },

  // Emergency Services
  emergencyContainer: { gap: 12 },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  emergencyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  emergencyTitle: { fontSize: 15, fontWeight: '800', color: '#991B1B' },
  emergencyMeta: { fontSize: 12, color: '#DC2626', marginTop: 2 },

  // Category Grid
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  categoryIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryName: { fontSize: 13, fontWeight: '700', color: NAVY },

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
