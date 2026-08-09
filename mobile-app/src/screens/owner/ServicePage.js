import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Wrench, FileText, MessageSquare, Clock, CircleCheck as CheckCircle, CirclePlus as PlusCircle, Search, ArrowRight, Activity, MapPin, ShieldCheck, Star, Zap, Droplets, Hammer, Wind, Package } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { fetchOwnerRequirements, fetchServiceProviders } from '../../services/api.service';
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
// REUSABLE COMPONENTS
// =====================================

const SummaryCard = ({ title, value, icon: Icon, bgColor, iconColor, customStyle }) => (
  <View style={[styles.summaryCard, customStyle]}>
    <View style={styles.summaryHeader}>
      <View style={[styles.summaryIconBox, { backgroundColor: bgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
    <Text style={styles.summaryLabel}>{title}</Text>
  </View>
);

const ServiceRequestCard = ({ request, onView }) => (
  <View style={styles.requestCard}>
    <View style={styles.requestHeader}>
      <View>
        <Text style={styles.requestId}>{request.id}</Text>
        <Text style={styles.requestTitle}>{request.title}</Text>
      </View>
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
    <View style={styles.requestFooter}>
      <Text style={styles.requestMeta}>{request.category} • {request.responseCount || 0} Responses</Text>
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
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  const [currentView, setCurrentView] = useState('home');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [stats, setStats] = useState({
    activeRequests: 0,
    providerResponses: 0,
    scheduledServices: 0,
    completedServices: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!ownerId) return;
      try {
        const [reqRes, provRes] = await Promise.all([
          fetchOwnerRequirements(ownerId),
          fetchServiceProviders().catch(() => ({ data: [] }))
        ]);

        const list = reqRes?.data || reqRes || [];
        if (Array.isArray(list)) {
          const spList = list.filter(r => r.type === 'serviceProvider');
          const active = spList.filter(r => r.status === 'pending' || r.status === 'active').length;
          const responses = spList.filter(r => r.supplierId || r.extraData?.responseCount > 0).length;
          const scheduled = spList.filter(r => r.status === 'scheduled').length;
          const completed = spList.filter(r => r.status === 'completed').length;

          setStats({
            activeRequests: active,
            providerResponses: responses,
            scheduledServices: scheduled,
            completedServices: completed
          });

          setRecentRequests(spList.slice(0, 5).map(r => ({
            id: `#${r.id.slice(0, 8).toUpperCase()}`,
            _rawId: r.id,
            title: r.title,
            category: r.extraData?.category || 'Service',
            responseCount: r.supplierId ? 1 : 0,
            budget: r.budget || '—',
            date: new Date(r.createdAt).toLocaleDateString('en-IN'),
            status: r.status === 'pending' ? 'Active' : r.status
          })));
        }

        const providersList = provRes?.data || provRes || [];
        if (Array.isArray(providersList)) {
          setTopProviders(providersList.map(p => ({
            id: p.id,
            name: p.bizName || p.contactPerson || 'Service Provider',
            category: p.subCategory || 'General Maintenance',
            rating: '4.8',
            jobs: '12+',
            verified: p.status === 'approved'
          })));
        }
      } catch (err) {
        console.warn('Error loading owner service page stats:', err);
      }
    };
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 4000);
    return () => clearInterval(interval);
  }, [ownerId]);

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
        onViewBooking={(provider) => {
          setSelectedProvider(provider);
          setCurrentView('trackService');
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
        onBack={() => setCurrentView('home')}
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
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Active Requirements" value={stats.activeRequests} icon={FileText} bgColor="#FFFBEB" iconColor={GOLD} />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Provider Responses" value={stats.providerResponses} icon={MessageSquare} bgColor="#EFF6FF" iconColor="#2563EB" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Scheduled Services" value={stats.scheduledServices} icon={Clock} bgColor="#F3E8FF" iconColor="#9333EA" />
            <SummaryCard customStyle={isMobile && { flexBasis: '46%', flexGrow: 1 }} title="Completed Services" value={stats.completedServices} icon={CheckCircle} bgColor="#DCFCE7" iconColor="#16A34A" />
          </View>

          {/* ── Quick Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.primaryActionCard}
              onPress={() => setCurrentView('broadcast')}
              activeOpacity={0.85}
            >
              <View style={styles.actionHeader}>
                <View style={styles.primaryIconBox}>
                  <PlusCircle size={22} color="#fff" />
                </View>
              </View>
              <Text style={styles.primaryActionTitle} numberOfLines={1}>Post Requirement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionCard}
              onPress={() => setCurrentView('browseProviders')}
              activeOpacity={0.85}
            >
              <View style={styles.actionHeader}>
                <View style={styles.secondaryIconBox}>
                  <Search size={22} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.secondaryActionTitle} numberOfLines={1}>Browse Providers</Text>
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
                {recentRequests.length === 0 ? (
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#94A3B8' }}>No service requirements posted yet.</Text>
                  </View>
                ) : (
                  recentRequests.map(req => (
                    <ServiceRequestCard
                      key={req.id}
                      request={req}
                      onView={() => {
                        setSelectedRequest(req);
                        setCurrentView('providerResponses');
                      }}
                    />
                  ))
                )}
              </View>
            </View>

            {/* ── Top Rated Providers ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Rated Providers</Text>
                <TouchableOpacity onPress={() => setCurrentView('browseProviders')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
              </View>
              {topProviders.length === 0 ? (
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#94A3B8' }}>No rated providers found.</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {topProviders.map(provider => (
                    <TouchableOpacity
                      key={provider.id}
                      style={styles.providerRowCard}
                      onPress={() => {
                        setSelectedProvider(provider);
                        setCurrentView('providerProfile');
                      }}
                      activeOpacity={0.85}
                    >
                      <View style={styles.providerAvatar}>
                        <Text style={styles.providerAvatarText}>
                          {provider.name ? provider.name.charAt(0).toUpperCase() : 'P'}
                        </Text>
                      </View>
                      <View style={styles.providerInfo}>
                        <Text style={styles.providerRowName} numberOfLines={1}>{provider.name}</Text>
                        <Text style={styles.providerRowCat} numberOfLines={1}>{provider.category || 'Service Provider'}</Text>
                      </View>
                      <View style={styles.providerRight}>
                        <View style={styles.providerRatingBadge}>
                          <Star size={12} color="#D97706" fill="#D97706" />
                          <Text style={styles.providerRatingText}>{provider.rating || 4.8}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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

  summaryGrid: { flexDirection: 'row', gap: 16 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: 24, fontWeight: '900', color: NAVY },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },

  // Actions (Matching Marketing card size)
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
  primaryIconBox: {
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
    borderColor: colors.border,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  secondaryIconBox: {
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
    color: NAVY,
    marginTop: 14
  },
  actionHeader: { flexDirection: 'row', alignItems: 'center' },

  // Sections
  sectionsContainer: { gap: 24, marginTop: 8 },
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#000000' },
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
  providerBtnText: { fontSize: 12, fontWeight: '700', color: NAVY },

  // Provider Row Card (Matches Manpower layout)
  providerRowCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  providerInfo: {
    flex: 1,
    paddingRight: 6,
  },
  providerRowName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#071B3A',
    marginBottom: 2,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  providerRowCat: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
  providerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  providerRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  providerRatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  }
});
