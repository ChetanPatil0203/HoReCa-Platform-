import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { 
  TrendingUp, Star, Zap, Megaphone, 
  Radio, Mail, FileText, Clock,
  Briefcase, DollarSign, MapPin,
  CheckCircle, Bookmark, Eye, Calendar,
  Activity, ShieldCheck, Wifi, WifiOff
} from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';

const { width } = Dimensions.get('window');

const KPI_DATA = [
  { id: 'broadcast', label: "New Broadcast Requirements", value: "12", delta: "New", icon: Radio, color: "#8B5CF6" },
  { id: 'direct', label: "New Direct Requests", value: "4", delta: "2 Unread", icon: Mail, color: "#2563EB", isShortcut: true },
  { id: 'proposals', label: "Proposals Sent", value: "18", delta: "+3 this week", icon: FileText, color: "#10B981" },
  { id: 'active_c', label: "Active Campaigns", value: "3", delta: "+1 this month", icon: Activity, color: "#F59E0B" },
  { id: 'pending', label: "Pending Creative Approvals", value: "2", delta: "Needs action", icon: Clock, color: "#EF4444" },
  { id: 'completed', label: "Completed Campaigns", value: "45", delta: "+5 this month", icon: CheckCircle, color: "#10B981" },
  { id: 'revenue', label: "Monthly Revenue", value: "₹1.2L", delta: "+34% vs last month", icon: TrendingUp, color: "#059669" },
  { id: 'rating', label: "Agency Rating", value: "4.8 ★", delta: "From 38 reviews", icon: Star, color: "#F59E0B" },
];

const FILTERS = ["All", "New", "Urgent", "Online", "Offline", "Saved", "Responded"];

const BROADCAST_FEED = [
  {
    id: "REQ-101",
    campaign: "Summer Season Social Media Launch",
    business: "Azure Palace Hotel",
    type: "Online",
    category: "Social Media Management",
    budget: "₹45,000 - ₹60,000",
    location: "Mumbai, MH",
    startDate: "01 Aug 2026",
    duration: "3 Months",
    urgency: "High",
    postedTime: "2 hours ago"
  },
  {
    id: "REQ-102",
    campaign: "New Menu Photography & Videography",
    business: "Spice Route Restaurant",
    type: "Offline",
    category: "Content Creation",
    budget: "₹25,000",
    location: "Pune, MH",
    startDate: "15 Aug 2026",
    duration: "1 Week",
    urgency: "Medium",
    postedTime: "5 hours ago"
  }
];

export default function MarketingDashboardHome({ setActivePage, handleSendProposal }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const renderHeader = () => (
    <View>
      {/* Welcome Banner */}
      <View style={[styles.welcomeBanner, { backgroundColor: "#F5F3FF", borderColor: "#DDD6FE" }]}>
        <View style={styles.avatarBox}>
           <Text style={styles.avatarInitials}>BC</Text>
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Welcome back, BrandCraft</Text>
          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={styles.verifiedText}>Verified Agency</Text>
            </View>
            <View style={styles.modeBadge}>
              <Wifi size={12} color="#2563EB" />
              <Text style={styles.modeText}>Online & Offline</Text>
            </View>
          </View>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        {KPI_DATA.map((kpi) => (
          <TouchableOpacity 
            key={kpi.id} 
            style={[styles.kpiCard, { borderTopColor: kpi.color }]}
            activeOpacity={kpi.isShortcut ? 0.7 : 1}
            onPress={() => {
              if (kpi.isShortcut) setActivePage('requests');
            }}
          >
            <View style={styles.kpiHeader}>
              <View style={[styles.kpiIconBox, { backgroundColor: kpi.color + '14' }]}>
                <kpi.icon size={16} color={kpi.color} />
              </View>
            </View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={[styles.kpiDelta, { color: kpi.color }]}>{kpi.delta}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>Broadcast Requirements</Text>
      
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
        {FILTERS.map((f, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.bottomSections}>
      <Text style={styles.sectionHeader}>Active Campaigns</Text>
      <View style={styles.cardBox}>
        <View style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemTitle}>July Social Media Promo</Text>
            <Text style={styles.listItemSub}>Azure Palace Hotel</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: "#D1FAE5" }]}>
            <Text style={[styles.statusText, { color: "#059669" }]}>Running</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Pending Creative Approvals</Text>
      <View style={styles.cardBox}>
        <View style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemTitle}>Video Ad Draft v2</Text>
            <Text style={styles.listItemSub}>Spice Route Restaurant</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: "#FEE2E2" }]}>
            <Text style={[styles.statusText, { color: "#EF4444" }]}>Pending</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Recent Proposals</Text>
      <View style={styles.cardBox}>
        <View style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemTitle}>SEO Optimization 6-Months</Text>
            <Text style={styles.listItemSub}>Submitted 1 day ago</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.statusText, { color: "#D97706" }]}>Under Review</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Today's Schedule</Text>
      <View style={styles.cardBox}>
        <View style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemTitle}>Client Pitch - Azure Palace</Text>
            <View style={styles.timeRow}>
              <Clock size={12} color="#64748B"/>
              <Text style={styles.listItemSubTime}>10:00 AM</Text>
            </View>
          </View>
        </View>
      </View>

    </View>
  );

  const renderFeedItem = ({ item }) => (
    <View style={styles.feedCard}>
      <View style={styles.feedHeaderRow}>
        <Text style={styles.reqIdText}>{item.id}</Text>
        {item.type === 'Online' ? (
           <View style={[styles.typeBadge, { backgroundColor: '#DBEAFE' }]}><Text style={[styles.typeBadgeText, { color: '#1D4ED8' }]}>Online</Text></View>
        ) : (
           <View style={[styles.typeBadge, { backgroundColor: '#F3F4F6' }]}><Text style={[styles.typeBadgeText, { color: '#4B5563' }]}>Offline</Text></View>
        )}
      </View>

      <Text style={styles.feedTitle}>{item.campaign}</Text>
      
      <View style={styles.feedDetailsGrid}>
        <View style={styles.feedDetailCol}>
          <Briefcase size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>{item.business}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <Activity size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>{item.category}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <DollarSign size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>{item.budget}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>Starts {item.startDate}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>{item.duration}</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <Zap size={14} color={item.urgency === 'High' ? '#EF4444' : '#F59E0B'} />
          <Text style={[styles.feedText, { color: item.urgency === 'High' ? '#EF4444' : '#F59E0B', fontWeight: 'bold' }]} numberOfLines={1}>{item.urgency} Urgency</Text>
        </View>
        <View style={styles.feedDetailCol}>
          <Radio size={14} color="#64748B" />
          <Text style={styles.feedText} numberOfLines={1}>Posted {item.postedTime}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.btnOutline}>
          <Eye size={16} color="#8B5CF6" />
          <Text style={styles.btnOutlineText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => handleSendProposal(item)}>
          <Text style={styles.btnPrimaryText}>Send Proposal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnIcon}>
           <Bookmark size={18} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={BROADCAST_FEED}
      keyExtractor={(item) => item.id}
      renderItem={renderFeedItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeBanner: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderRadius: 16, padding: 20, marginBottom: 24,
  },
  avatarBox: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#8B5CF6',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  avatarInitials: {
    color: '#fff', fontWeight: 'bold', fontSize: 18,
  },
  bannerContent: {
    flex: 1, marginLeft: 16,
  },
  bannerTitle: {
    fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap',
  },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  verifiedText: {
    fontSize: 10, fontWeight: 'bold', color: '#059669',
  },
  modeBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  modeText: {
    fontSize: 10, fontWeight: 'bold', color: '#1D4ED8',
  },
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24,
  },
  kpiCard: {
    width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 3,
    elevation: 1,
  },
  kpiHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12,
  },
  kpiIconBox: {
    width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 20, fontWeight: '800', color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 12, color: '#64748B', marginTop: 2,
  },
  kpiDelta: {
    fontSize: 11, fontWeight: '600', marginTop: 8,
  },
  sectionHeader: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, marginTop: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingRight: 16, gap: 8, flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6', borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 13, color: '#475569', fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff', fontWeight: 'bold',
  },
  feedCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  feedHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  },
  reqIdText: {
    fontSize: 12, fontWeight: 'bold', color: '#64748B',
  },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10, fontWeight: 'bold',
  },
  feedTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12,
  },
  feedDetailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16,
  },
  feedDetailCol: {
    width: '45%', flexDirection: 'row', alignItems: 'center',
  },
  feedText: {
    fontSize: 12, color: '#475569', marginLeft: 6, flex: 1,
  },
  actionButtons: {
    flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16,
  },
  btnPrimary: {
    flex: 1, backgroundColor: '#8B5CF6', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff', fontWeight: 'bold', fontSize: 13,
  },
  btnOutline: {
    flex: 1, flexDirection: 'row', backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  btnOutlineText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 13,
  },
  btnIcon: {
    width: 40, height: 40, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#DDD6FE', borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  bottomSections: {
    marginTop: 16,
  },
  cardBox: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#E2E8F0', elevation: 1,
  },
  listItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14, fontWeight: '600', color: '#0F172A',
  },
  listItemSub: {
    fontSize: 12, color: '#64748B', marginTop: 4,
  },
  timeRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4,
  },
  listItemSubTime: {
    fontSize: 12, color: '#64748B', marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  statusText: {
    fontSize: 10, fontWeight: 'bold',
  },
});
