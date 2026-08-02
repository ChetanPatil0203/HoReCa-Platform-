import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, ActivityIndicator, RefreshControl } from 'react-native';
import {
  Users, Search, Star, Clock, FileText, Check, Phone, ShieldCheck, User, CirclePlus, ArrowRight, TriangleAlert, MessageSquare, ChevronRight, Package, PlusCircle
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { AuthContext } from '../../../context/AuthContext';
import { fetchManpowerDashboardSummary } from '../../../services/api.service';
import { FREQUENT_ROLES } from '../../../constants/manpowerData';
import PostRequirementPage from './PostRequirementPage';
import MyRequirementsPage from './MyRequirementsPage';
import AgencyResponsesPage from './AgencyResponsesPage';
import BrowseAgenciesPage from './BrowseAgenciesPage';
import AgencyProfilePage from './AgencyProfilePage';
import DirectRequirementPage from './DirectRequirementPage';
import AvailableStaffPage from './AvailableStaffPage';
import CandidateProfilePage from './CandidateProfilePage';

import SelectedStaffPage from './SelectedStaffPage';
import ReplacementRequestPage from './ReplacementRequestPage';

const GOLD = '#D97706';
const BLUE = '#2563EB';
const NAVY = '#071B3A';

export default function ManpowerPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  const [currentView, setCurrentView] = useState('home');
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const [summary, setSummary] = useState({
    activeRequirements: 0,
    agencyResponses: 0,
    shortlistedCandidates: 0,
    selectedStaff: 0
  });
  const [recentRequirements, setRecentRequirements] = useState([]);
  const [topAgencies, setTopAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchManpowerDashboardSummary(ownerId);
      if (res.success && res.data) {
        if (res.data.summary) setSummary(res.data.summary);
        if (res.data.recentRequirements) setRecentRequirements(res.data.recentRequirements);
        if (res.data.topAgencies) setTopAgencies(res.data.topAgencies);
      }
    } catch (err) {
      console.warn('Failed to load manpower dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (currentView === 'home') {
      loadData();
    }
  }, [currentView, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Helper to map icon names from mock data to actual imported components
  const getRoleIcon = (iconName) => {
    switch (iconName) {
      case 'ChefHat': return User;
      case 'Utensils': return Users;
      case 'UserCircle': return Star;
      case 'Sparkles': return Check;
      case 'Knife': return User;
      case 'Phone': return Phone;
      case 'GlassWater': return Users;
      default: return User;
    }
  };

  if (currentView === 'postRequirement') {
    return (
      <PostRequirementPage
        initialRole={selectedRole}
        onBack={() => {
          setSelectedRole('');
          setCurrentView('home');
        }}
        onViewRequirements={() => {
          setSelectedRole('');
          setCurrentView('requirements');
        }}
      />
    );
  }

  if (currentView === 'requirements') {
    return (
      <MyRequirementsPage
        onBack={() => setCurrentView('home')}
        onViewResponses={(req) => {
          setSelectedRequirement(req);
          setCurrentView('agencyResponses');
        }}
      />
    );
  }

  if (currentView === 'agencyResponses') {
    return (
      <AgencyResponsesPage
        requirement={selectedRequirement}
        onBack={() => setCurrentView('requirements')}
      />
    );
  }

  if (currentView === 'browseAgencies') {
    return (
      <BrowseAgenciesPage
        onBack={() => setCurrentView('home')}
        onViewAgency={(agency) => {
          setSelectedAgency(agency);
          setCurrentView('agencyProfile');
        }}
        onSendRequirement={(agency) => {
          setSelectedAgency(agency);
          setCurrentView('directRequirement');
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
          setCurrentView('directRequirement');
        }}
        onViewAvailableStaff={() => setCurrentView('availableStaff')}
      />
    );
  }

  if (currentView === 'directRequirement') {
    return (
      <DirectRequirementPage
        agency={selectedAgency}
        onBack={() => setCurrentView('agencyProfile')}
        onHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'availableStaff') {
    return (
      <AvailableStaffPage
        onBack={() => setCurrentView('home')}
        onViewCandidate={(cand) => {
          setSelectedCandidate(cand);
          setCurrentView('candidateProfile');
        }}
      />
    );
  }

  if (currentView === 'candidateProfile') {
    return (
      <CandidateProfilePage
        candidate={selectedCandidate}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'selectedStaff') {
    return (
      <SelectedStaffPage
        onBack={() => setCurrentView('home')}
        onRequestReplacement={(emp) => {
          setSelectedEmployee(emp);
          setCurrentView('replacementRequest');
        }}
      />
    );
  }

  if (currentView === 'replacementRequest') {
    return (
      <ReplacementRequestPage
        employee={selectedEmployee}
        onBack={() => setCurrentView('selectedStaff')}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.pageTitle}>Manpower</Text>
          <Text style={styles.pageSubtitle}>Hire & manage your staff</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setCurrentView('requirements')}>
            <Package size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Top Summary Cards ── */}
          <View style={[styles.summaryGrid, isMobile && { flexWrap: 'wrap' }]}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryIconBox}>
                  <FileText size={20} color={GOLD} />
                </View>
                <Text style={styles.summaryValue}>{summary.activeRequirements}</Text>
              </View>
              <Text style={styles.summaryLabel}>Active Requirements</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={[styles.summaryIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <MessageSquare size={20} color={BLUE} />
                </View>
                <Text style={styles.summaryValue}>{summary.agencyResponses}</Text>
              </View>
              <Text style={styles.summaryLabel}>Agency Responses</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={[styles.summaryIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Users size={20} color="#9333EA" />
                </View>
                <Text style={styles.summaryValue}>{summary.shortlistedCandidates}</Text>
              </View>
              <Text style={styles.summaryLabel}>Shortlisted Candidates</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={[styles.summaryIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Users size={20} color="#16A34A" />
                </View>
                <Text style={styles.summaryValue}>{summary.selectedStaff}</Text>
              </View>
              <Text style={styles.summaryLabel}>Selected Staff</Text>
            </View>
          </View>

          {/* ── Quick Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.primaryActionCard, isMobile && { padding: 16 }]} onPress={() => setCurrentView('postRequirement')}>
              <View style={styles.primaryActionHeader}>
                <View style={styles.primaryActionIconBox}>
                  <CirclePlus size={24} color="#fff" />
                </View>
                {!isMobile && <ArrowRight size={20} color="rgba(255,255,255,0.8)" />}
              </View>
              <Text style={[styles.primaryActionTitle, isMobile && { fontSize: 15, marginBottom: 0 }]} numberOfLines={2}>Post Requirement</Text>
              {!isMobile && <Text style={styles.primaryActionDesc}>Share your staffing needs with our network of verified agencies.</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryActionCard, isMobile && { padding: 16 }]} onPress={() => setCurrentView('browseAgencies')}>
              <View style={styles.secondaryActionHeader}>
                <View style={styles.secondaryActionIconBox}>
                  <Search size={24} color={BLUE} />
                </View>
                {!isMobile && <ArrowRight size={20} color={BLUE} />}
              </View>
              <Text style={[styles.secondaryActionTitle, isMobile && { fontSize: 15, marginBottom: 0 }]} numberOfLines={2}>Browse Agencies</Text>
              {!isMobile && <Text style={styles.secondaryActionDesc}>Explore top-rated manpower agencies and view their available staff.</Text>}
            </TouchableOpacity>
          </View>

          {/* ── Frequently Hired Roles ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Hired Roles</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rolesScroll}>
              {FREQUENT_ROLES.map(role => {
                const IconComp = getRoleIcon(role.icon);
                return (
                  <TouchableOpacity
                    key={role.id}
                    style={styles.roleCard}
                    onPress={() => {
                      setSelectedRole(role.title);
                      setCurrentView('postRequirement');
                    }}
                  >
                    <View style={styles.roleIconBox}>
                      <IconComp size={20} color="#475569" />
                    </View>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.twoColGrid, isMobile && { flexDirection: 'column' }]}>
            {/* ── Recent Requirements ── */}
            <View style={styles.colHalf}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Requirements</Text>
                <TouchableOpacity onPress={() => setCurrentView('requirements')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={BLUE} />
                </View>
              ) : recentRequirements.length > 0 ? (
                recentRequirements.map(req => (
                  <View key={req.id} style={styles.reqCard}>
                    <View style={styles.reqHeader}>
                      <Text style={styles.reqRole}>{req.role}</Text>
                      <View style={styles.reqBadge}>
                        <Text style={styles.reqBadgeText}>{req.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.reqMeta}>Needed: {req.staffRequired} Staff • {req.salary}</Text>
                    <Text style={styles.reqMeta}>Joining: {req.joiningDate}</Text>
                    <View style={styles.reqFooter}>
                      <Text style={styles.reqResponses}>{req.responses} Responses</Text>
                      <TouchableOpacity
                        style={styles.reqBtn}
                        onPress={() => {
                          setSelectedRequirement(req);
                          setCurrentView('agencyResponses');
                        }}
                      >
                        <Text style={styles.reqBtnText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No requirements posted yet</Text>
                  <Text style={styles.emptySubtitle}>Post your staffing needs to get applications from top agencies.</Text>
                </View>
              )}
            </View>
          </View>

          {/* ── Top Rated Agencies ── */}
          {topAgencies.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Rated Agencies</Text>
                <TouchableOpacity onPress={() => setCurrentView('browseAgencies')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.agenciesScroll}>
                {topAgencies.map(agency => (
                  <View key={agency.id} style={styles.agencyCard}>
                    <View style={styles.agencyHeader}>
                      <View style={styles.agencyLogo}>
                        <Text style={styles.agencyLogoText}>{agency.logo}</Text>
                      </View>
                      <View style={styles.agencyRatingBox}>
                        <Star size={12} color={GOLD} fill={GOLD} />
                        <Text style={styles.agencyRating}>{agency.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.agencyNameRow}>
                      <Text style={styles.agencyName}>{agency.name}</Text>
                      {agency.verified && <ShieldCheck size={14} color="#16A34A" style={{ marginLeft: 4 }} />}
                    </View>
                    <Text style={styles.agencyLocation}>{agency.location} • {agency.experience} Exp</Text>
                    <View style={styles.agencyStats}>
                      <View style={styles.agencyStat}>
                        <Text style={styles.agencyStatVal}>{agency.availableStaff}</Text>
                        <Text style={styles.agencyStatLbl}>Staff</Text>
                      </View>
                      <View style={styles.agencyStatDivider} />
                      <View style={styles.agencyStat}>
                        <Text style={styles.agencyStatVal}>{agency.replacementPolicy}</Text>
                        <Text style={styles.agencyStatLbl}>Replacement</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.agencyBtn}
                      onPress={() => {
                        setSelectedAgency(agency);
                        setCurrentView('agencyProfile');
                      }}
                    >
                      <Text style={styles.agencyBtnText}>View Agency</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
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

  // Banner
  urgentBanner: { flexDirection: 'row', backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 16, padding: 20, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
  urgentBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 },
  urgentIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  urgentTitle: { fontSize: 16, fontWeight: '800', color: '#991B1B', marginBottom: 2 },
  urgentDesc: { fontSize: 13, color: '#B91C1C' },
  urgentBtn: { backgroundColor: '#DC2626', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  urgentBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Summary
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, minWidth: '46%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 16 },
  primaryActionCard: { flex: 1, backgroundColor: NAVY, borderRadius: 16, padding: 24, overflow: 'hidden' },
  primaryActionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  primaryActionIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  primaryActionTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  primaryActionDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },

  secondaryActionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  secondaryActionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  secondaryActionIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  secondaryActionTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  secondaryActionDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },

  // Sections
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: BLUE },

  // Roles
  rolesScroll: { gap: 12, paddingRight: 16 },
  roleCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, width: 100, borderWidth: 1, borderColor: colors.border },
  roleIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  roleTitle: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center' },

  // Layout Two Col
  twoColGrid: { flexDirection: 'row', gap: 24 },
  colHalf: { flex: 1, gap: 16 },

  // Requirement Card
  reqCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  reqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reqRole: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  reqBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reqBadgeText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  reqMeta: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  reqFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reqResponses: { fontSize: 13, fontWeight: '700', color: BLUE },
  reqBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border },
  reqBtnText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },

  // Response Card
  responseCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  resHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  resAvatar: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resAvatarText: { fontSize: 16, fontWeight: '800', color: BLUE },
  resNameRow: { flexDirection: 'row', alignItems: 'center' },
  resName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  resFor: { fontSize: 12, color: '#64748B', marginTop: 2 },
  resRatingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  resRating: { fontSize: 11, fontWeight: '700', color: GOLD, marginLeft: 4 },
  resDetails: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  resDetailText: { fontSize: 13, color: '#64748B' },
  boldText: { fontWeight: '700', color: '#0F172A' },
  resBtn: { paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  resBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  intTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  intAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  intName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  intRole: { fontSize: 13, color: '#64748B', marginTop: 2 },
  intTypeBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  intTypeText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  intBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  intTime: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  intAgency: { fontSize: 12, color: '#64748B', marginTop: 2 },
  intActionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: BLUE },
  intActionBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Agency Card
  agenciesScroll: { gap: 16, paddingRight: 16 },
  agencyCard: { width: 260, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  agencyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  agencyLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  agencyLogoText: { fontSize: 20, fontWeight: '900', color: BLUE },
  agencyRatingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  agencyRating: { fontSize: 12, fontWeight: '700', color: GOLD, marginLeft: 4 },
  agencyNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  agencyName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  agencyLocation: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  agencyStats: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 16 },
  agencyStat: { flex: 1, alignItems: 'center' },
  agencyStatVal: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  agencyStatLbl: { fontSize: 11, color: '#64748B', marginTop: 2 },
  agencyStatDivider: { width: 1, backgroundColor: colors.border },
  agencyBtn: { paddingVertical: 10, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  agencyBtnText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  // Empty Card
  emptyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  emptyBtn: { backgroundColor: BLUE, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 }
});
