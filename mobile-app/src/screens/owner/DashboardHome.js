import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Package, Users, Wrench, Megaphone, ShoppingCart, MessageSquare, CalendarDays, TriangleAlert, ChevronRight, Star } from 'lucide-react-native';

const NAVY = '#071B3A';
const MUTED = '#64748B';

const QUICK_ACTIONS = [
  { id: 'raw-material', title: 'Raw Material', status: '3 Active Orders', action: 'Browse Products →', icon: Package, color: '#F97316' },
  { id: 'manpower', title: 'Manpower', status: '2 Open Requirements', action: 'Hire Staff →', icon: Users, color: '#3B82F6' },
  { id: 'service', title: 'Service Providers', status: '1 Service Scheduled', action: 'Find Providers →', icon: Wrench, color: '#10B981' },
  { id: 'marketing', title: 'Marketing', status: '2 Active Campaigns', action: 'Explore Agencies →', icon: Megaphone, color: '#8B5CF6' },
];

const OVERVIEW_STATS = [
  { id: 'active', label: 'Orders in Progress', value: '12', icon: ShoppingCart, color: '#3B82F6' },
  { id: 'pending', label: 'Responses Pending', value: '4', icon: MessageSquare, color: '#F97316' },
  { id: 'scheduled', label: 'Scheduled Today', value: '3', icon: CalendarDays, color: '#10B981' },
  { id: 'urgent', label: 'Attention Needed', value: '1', icon: TriangleAlert, color: '#EF4444' },
];

const RECENT_ACTIVITY = [
  { id: 1, title: 'Raw Material Order Confirmed', sub: 'Metro Fresh Supplies', time: '10m ago', icon: Package, color: '#F97316' },
  { id: 2, title: 'New Candidates Submitted', sub: 'Head Chef Requirement', time: '35m ago', icon: Users, color: '#3B82F6' },
  { id: 3, title: 'Service Request Accepted', sub: 'ProClean Services', time: '1h ago', icon: Wrench, color: '#10B981' },
  { id: 4, title: 'Marketing Proposal Received', sub: 'BrandCraft Agency', time: '2h ago', icon: Megaphone, color: '#8B5CF6' },
];

const TOP_PARTNERS = [
  { id: 1, name: 'Metro Fresh Supplies', category: 'Raw Material Supplier', rating: '4.8', initials: 'MF' },
  { id: 2, name: 'Elite Staffing Co.', category: 'Manpower Agency', rating: '4.7', initials: 'ES' },
  { id: 3, name: 'ProClean Services', category: 'Service Provider', rating: '4.9', initials: 'PS' },
  { id: 4, name: 'BrandCraft Agency', category: 'Marketing Partner', rating: '4.6', initials: 'BA' },
];

export default function DashboardHome({ user, onNavigate }) {
  const { width } = useWindowDimensions();
  const pagePadding = width < 340 ? 12 : 16;
  const gridGap = 12;
  const columns = 2;
  
  // Exact card width calculation
  const cardWidth = (width - (pagePadding * 2) - gridGap) / columns;

  return (
    <View style={[styles.container, { paddingHorizontal: pagePadding }]}>
      {/* 2. Welcome Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroGreeting}>Good Morning, {user?.name?.split(" ")[0] || 'Arjun'} 👋</Text>
          <Text style={styles.heroBusiness}>{user?.businessName || 'The Meridian Hotel'}</Text>
          <Text style={styles.heroDesc}>Manage all your HoReCa business operations from one place.</Text>
        </View>
      </View>

      {/* 3. Quick Access */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All {'>'}</Text></TouchableOpacity>
        </View>
        <View style={[styles.gridContainer, { gap: gridGap }]}>
          {QUICK_ACTIONS.map(action => (
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
          <TouchableOpacity><Text style={styles.viewAllText}>View All {'>'}</Text></TouchableOpacity>
        </View>
        <View style={[styles.gridContainer, { gap: gridGap }]}>
          {OVERVIEW_STATS.map((stat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.statCard, { width: cardWidth }]}
              onPress={() => console.log(`Navigate to ${stat.id}`)}
            >
              <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={18} color={stat.color} strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
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

      {/* 7. Top Partners */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Partners</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All {'>'}</Text></TouchableOpacity>
        </View>
      </View>
      {/* Moved ScrollView out of sectionContainer padding so cards bleed to edge slightly, 
          but added left padding to match align */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: pagePadding, paddingRight: pagePadding, gap: 12, paddingBottom: 24 }}
        style={{ marginHorizontal: -pagePadding, marginBottom: 24 }}
      >
        {TOP_PARTNERS.map((partner, idx) => (
          <TouchableOpacity key={idx} style={styles.partnerCard}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerAvatarText}>{partner.initials}</Text>
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName} numberOfLines={1}>{partner.name}</Text>
              <Text style={styles.partnerCat} numberOfLines={1}>{partner.category}</Text>
            </View>
            <View style={styles.partnerRight}>
              <View style={styles.ratingBadge}>
                <Star size={11} color="#F6B800" fill="#F6B800" />
                <Text style={styles.ratingText}>{partner.rating}</Text>
              </View>
              <ChevronRight size={14} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
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
    borderRadius: 16,
    padding: 14,
    minHeight: 112,
    borderWidth: 1,
    borderColor: '#E8EDF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 2,
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
  }
});
