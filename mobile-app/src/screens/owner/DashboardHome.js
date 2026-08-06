import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Modal, TextInput } from 'react-native';
import { Package, Users, Wrench, Megaphone, ShoppingCart, MessageSquare, CalendarDays, TriangleAlert, ChevronRight, Star, Clock, X, ShieldCheck, Building2, Search } from 'lucide-react-native';
import { fetchOwnerRequirements, fetchOwnerMainDashboardSummary } from '../../services/api.service';

const NAVY = '#071B3A';
const MUTED = '#64748B';

export default function DashboardHome({ user, onNavigate }) {
  const { width } = useWindowDimensions();
  const pagePadding = width < 340 ? 12 : 16;
  const gridGap = 12;
  const columns = 2;
  const ownerId = user?.id;

  const [dashboardData, setDashboardData] = useState({
    counts: {
      rawMaterial: 0,
      manpower: 0,
      service: 0,
      marketing: 0,
      ordersInProgress: 0,
      pendingResponses: 0,
      scheduledToday: 0,
      attentionNeeded: 0
    },
    recentActivity: [],
    topPartners: []
  });

  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [partnersModalVisible, setPartnersModalVisible] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');

  useEffect(() => {
    const loadOwnerDashboard = async () => {
      if (!ownerId) return;
      try {
        const res = await fetchOwnerMainDashboardSummary(ownerId);
        if (res?.success && res?.data) {
          setDashboardData(res.data);
        } else {
          // Fallback to basic owner requirements call
          const reqRes = await fetchOwnerRequirements(ownerId);
          const list = reqRes?.data || reqRes || [];
          if (Array.isArray(list)) {
            const mp = list.filter(r => r.type === 'manpower').length;
            const sp = list.filter(r => r.type === 'serviceProvider').length;
            const mk = list.filter(r => r.type === 'marketing').length;
            const pending = list.filter(r => r.supplierId || (r.extraData && r.extraData.responseCount > 0)).length;

            setDashboardData(prev => ({
              ...prev,
              counts: {
                ...prev.counts,
                manpower: mp,
                service: sp,
                marketing: mk,
                pendingResponses: pending,
                scheduledToday: sp
              }
            }));
          }
        }
      } catch (err) {
        console.warn('Error fetching owner dashboard summary:', err);
      }
    };
    loadOwnerDashboard();
    const interval = setInterval(loadOwnerDashboard, 5000);
    return () => clearInterval(interval);
  }, [ownerId]);

  const counts = dashboardData.counts || {};

  const displayedActivity = (dashboardData.recentActivity || []).slice(0, 2);
  const displayedPartners = (dashboardData.topPartners || []).slice(0, 2);

  const quickActions = [
    { id: 'raw-material', title: 'Raw Material', status: `${counts.rawMaterial || 0} Active Orders`, action: 'Browse Products →', icon: Package, color: '#F97316' },
    { id: 'manpower', title: 'Manpower', status: `${counts.manpower || 0} Open Requirements`, action: 'Hire Staff →', icon: Users, color: '#3B82F6' },
    { id: 'service', title: 'Service Providers', status: `${counts.service || 0} Services Scheduled`, action: 'Find Providers →', icon: Wrench, color: '#10B981' },
    { id: 'marketing', title: 'Marketing', status: `${counts.marketing || 0} Active Campaigns`, action: 'Explore Agencies →', icon: Megaphone, color: '#8B5CF6' },
  ];

  const overviewStats = [
    { id: 'active', label: 'Orders in Progress', value: (counts.ordersInProgress || 0).toString(), icon: ShoppingCart, color: '#3B82F6' },
    { id: 'pending', label: 'Responses Pending', value: (counts.pendingResponses || 0).toString(), icon: MessageSquare, color: '#F97316' },
    { id: 'scheduled', label: 'Scheduled Today', value: (counts.scheduledToday || 0).toString(), icon: CalendarDays, color: '#10B981' },
    { id: 'urgent', label: 'Attention Needed', value: (counts.attentionNeeded || 0).toString(), icon: TriangleAlert, color: '#EF4444' },
  ];

  // Exact card width calculation
  const cardWidth = (width - (pagePadding * 2) - gridGap) / columns;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingHorizontal: pagePadding, paddingBottom: 110, paddingTop: 16 }]}
    >
      {/* 2. Welcome Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroGreeting}>{getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ''} 👋</Text>
          <Text style={styles.heroBusiness}>{user?.registration?.bizName || user?.businessName || 'Business Owner'}</Text>
          <Text style={styles.heroDesc}>Manage all your HoReCa business operations from one place.</Text>
        </View>
      </View>

      {/* 3. Quick Access */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <TouchableOpacity style={styles.viewAllBtn}><Text style={styles.viewAllText}>View All</Text><ChevronRight size={13} color="#F6B800" /></TouchableOpacity>
        </View>
        <View style={[styles.gridContainer, { gap: gridGap }]}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickCard, { width: cardWidth }]}
              onPress={() => onNavigate && onNavigate(action.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                <action.icon size={20} color={action.color} strokeWidth={2.5} />
              </View>
              <Text style={styles.quickTitle} numberOfLines={1}>{action.title}</Text>
              <Text style={styles.quickStatus} numberOfLines={1}>{action.status}</Text>
              <View style={styles.flexSpacer} />
              <Text style={[styles.quickActionText, { color: action.color }]}>{action.action}</Text>
              <View style={styles.watermarkContainer}>
                <action.icon size={50} color={`${action.color}08`} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. Today at a Glance */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today at a Glance</Text>
          <TouchableOpacity style={styles.viewAllBtn}><Text style={styles.viewAllText}>View All</Text><ChevronRight size={13} color="#F6B800" /></TouchableOpacity>
        </View>
        <View style={[styles.gridContainer, { gap: gridGap }]}>
          {overviewStats.map((stat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.statCard, { width: cardWidth }]}
              onPress={() => console.log(`Navigate to ${stat.id}`)}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                  <stat.icon size={18} color={stat.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statLabel} numberOfLines={1}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 5. Recent Activity */}
      <View style={styles.sectionContainer}>
        <View style={styles.listCardWrapper}>
          <View style={styles.listCardHeader}>
            <Text style={styles.listCardTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => setActivityModalVisible(true)} activeOpacity={0.8} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={13} color="#F6B800" />
            </TouchableOpacity>
          </View>
          <View style={styles.listCardBody}>
            {displayedActivity && displayedActivity.length > 0 ? (
              displayedActivity.map((item, index) => (
                <View
                  key={item.id || index}
                  style={[styles.listRow, index === displayedActivity.length - 1 && styles.noBorder]}
                >
                  <View style={[styles.listIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Clock size={16} color={NAVY} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listSub}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.listTime}>{item.time}</Text>
                </View>
              ))
            ) : (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: MUTED }}>No recent activity.</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 7. Top Partners */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Partners</Text>
          <TouchableOpacity onPress={() => setPartnersModalVisible(true)} activeOpacity={0.8} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={13} color="#F6B800" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingBottom: 24 }}>
        {displayedPartners && displayedPartners.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {displayedPartners.map(partner => {
              const cardWidth = displayedPartners.length > 1
                ? width - (pagePadding * 2) - 30
                : width - (pagePadding * 2);
              return (
                <TouchableOpacity
                  key={partner.id}
                  style={[styles.partnerCard, { width: cardWidth }]}
                  activeOpacity={0.85}
                >
                  <View style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>
                      {partner.name ? partner.name.charAt(0).toUpperCase() : 'P'}
                    </Text>
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName} numberOfLines={1}>{partner.name}</Text>
                    <Text style={styles.partnerCat} numberOfLines={1}>{partner.category}</Text>
                  </View>
                  <View style={styles.partnerRight}>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color="#D97706" fill="#D97706" />
                      <Text style={styles.ratingText}>{partner.rating || 4.8}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: MUTED }}>No partners found.</Text>
          </View>
        )}
      </View>

      {/* ── Recent Activity Full List Modal ── */}
      <Modal visible={activityModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%', width: '95%', maxWidth: 540 }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color={NAVY} />
                <Text style={styles.modalTitle}>All Recent Activities</Text>
              </View>
              <TouchableOpacity onPress={() => setActivityModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {(dashboardData.recentActivity || []).map((item, idx) => (
                <View key={item.id || idx} style={styles.fullActivityRow}>
                  <View style={[styles.listIconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Clock size={16} color={NAVY} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listSub}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.listTime}>{item.time}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity style={styles.closeFullModalBtn} onPress={() => setActivityModalVisible(false)}>
                <Text style={styles.closeFullModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Top Partners Full List Modal ── */}
      <Modal visible={partnersModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%', width: '95%', maxWidth: 540 }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Building2 size={20} color={NAVY} />
                <Text style={styles.modalTitle}>All Top Partners & Vendors</Text>
              </View>
              <TouchableOpacity onPress={() => setPartnersModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {(dashboardData.topPartners || []).map((partner, idx) => (
                <View key={partner.id || idx} style={styles.fullPartnerRow}>
                  <View style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>
                      {partner.name ? partner.name.charAt(0).toUpperCase() : 'P'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <Text style={styles.partnerCat}>{partner.category} • {partner.location || 'Local'}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#D97706" fill="#D97706" />
                    <Text style={styles.ratingText}>{partner.rating || 4.8}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooterRow}>
              <TouchableOpacity style={styles.closeFullModalBtn} onPress={() => setPartnersModalVisible(false)}>
                <Text style={styles.closeFullModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    width: '100%',
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
  heroBusiness: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F6B800', // Brand Gold
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    maxWidth: '90%',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F6B800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    minHeight: 132,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 2,
  },
  quickStatus: {
    fontSize: 11,
    color: MUTED,
    fontWeight: '500',
  },
  flexSpacer: {
    flex: 1,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    opacity: 0.8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
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
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: NAVY,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
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
  partnerCard: {
    width: 250,
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
  partnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  partnerAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: NAVY,
  },
  partnerInfo: {
    flex: 1,
    paddingRight: 6,
  },
  partnerName: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 2,
  },
  partnerCat: {
    fontSize: 11,
    color: MUTED,
  },
  partnerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
  },

  /* Modals for Full List Views */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(7, 27, 58, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  modalCloseBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 14 },
  fullActivityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fullPartnerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalFooterRow: { padding: 14, borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'flex-end' },
  closeFullModalBtn: { backgroundColor: NAVY, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10 },
  closeFullModalText: { color: '#fff', fontSize: 13, fontWeight: '700' }
});
