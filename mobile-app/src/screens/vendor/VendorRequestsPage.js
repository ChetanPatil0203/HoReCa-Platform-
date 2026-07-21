import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Activity, Clock, Search, Filter, CheckCircle, XCircle, MapPin, Calendar, Hash, User, AlertCircle, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const REQUESTS = [
  { 
    id: "ORD-291", 
    time: "Just now",
    title: "Premium Basmati Rice", 
    client: "The Meridian Hotels", 
    quantity: "600 kg",
    requiredBy: "18 Jun 2026",
    location: "Bandra, Mumbai",
    budget: "₹21,000", 
    note: "Long grain, aged 2yr preferred. Must deliver before 8am. Loading dock at rear entrance.",
    urgency: "Urgent Request — Response needed ASAP", 
    status: "New" 
  },
  { 
    id: "ORD-289", 
    time: "Just now",
    title: "Sunflower Oil (Refined) - 100L", 
    client: "The Meridian Hotels", 
    quantity: "100 L",
    requiredBy: "17 Jun 2026",
    location: "Andheri, Mumbai",
    budget: "₹14,500", 
    note: "Double-filtered, FSSAI certified. 5L cans preferred.",
    urgency: null, 
    status: "Pending" 
  },
];

import { mockDb } from '../../services/mockDb';

const FILTERS = ['All', 'New', 'Pending', 'Accepted', 'Rejected'];

export default function VendorRequestsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);

  React.useEffect(() => {
    setOrders(mockDb.getOrders());
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    const list = mockDb.getOrders().map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    mockDb.saveOrders(list);
    setOrders(list);
    alert(`Order has been ${newStatus === 'Accepted' ? 'Accepted' : 'Declined'}!`);
  };

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'All') return true;
    return o.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Incoming Orders</Text>
          <Text style={styles.pageSubtitle}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.bannerIconBox}>
             <Activity size={24} color="#F59E0B" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Raw Material Requests</Text>
            <Text style={styles.bannerSubtitle}>Procurement requests from hotels, restaurants and cafés in your area</Text>
          </View>
          <View style={styles.liveFeedBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveFeedText}>Live Feed</Text>
          </View>
        </View>

        {/* Stats Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
            <Text style={[styles.statValue, { color: '#D97706' }]}>3</Text>
            <Text style={styles.statLabel}>Total Requests</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>2</Text>
            <Text style={styles.statLabel}>Awaiting Response</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
            <Text style={[styles.statValue, { color: '#0EA5E9' }]}>1</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>0</Text>
            <Text style={styles.statLabel}>Declined</Text>
          </View>
        </ScrollView>

        {/* Search & Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={colors.muted} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search raw material requests..."
              placeholderTextColor={colors.muted}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {FILTERS.map((filter, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.filterPill, 
                  activeFilter === filter && styles.filterPillActive
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive
                ]}>
                  {filter}
                </Text>
                {filter !== 'All' && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>1</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <View style={styles.list}>
          {filteredOrders.map(req => (
            <View key={req.id} style={styles.card}>
              {/* Urgency Banner */}
              {req.status === 'New' && (
                <View style={styles.urgencyBanner}>
                  <AlertCircle size={14} color="#D97706" />
                  <Text style={styles.urgencyBannerText}>Urgent Request — Response needed ASAP</Text>
                </View>
              )}
              
              <View style={styles.cardInner}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.idRow}>
                    <Text style={styles.idText}>{req.id}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.timeText}>Just now</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    req.status === 'New' ? styles.statusNew : styles.statusPending
                  ]}>
                    {req.status === 'New' ? (
                        <Activity size={12} color="#3B82F6" />
                    ) : (
                        <Clock size={12} color="#F59E0B" />
                    )}
                    <Text style={[
                      styles.statusText,
                      req.status === 'New' ? styles.statusTextNew : styles.statusTextPending
                    ]}>{req.status}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.reqTitle}>{req.title}</Text>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <User size={14} color="#F59E0B" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Client</Text>
                      <Text style={styles.detailValue}>{req.client || 'The Meridian Hotels'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Hash size={14} color="#3B82F6" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>{req.qty || '100 units'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#10B981" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Required By</Text>
                      <Text style={styles.detailValue}>{req.date}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#F59E0B" style={styles.detailIcon} />
                    <View>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>Bandra, Mumbai</Text>
                    </View>
                  </View>
                </View>

                {/* Budget */}
                <View style={styles.budgetRow}>
                  <Text style={styles.budgetLabel}>Estimated Budget</Text>
                  <Text style={styles.budgetVal}>{req.amount}</Text>
                </View>

                {/* Note */}
                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>Client Note: "Urgent procurement request. Must deliver on time."</Text>
                </View>

                {/* Actions */}
                <View style={styles.cardFooter}>
                  {req.status === 'New' || req.status === 'Pending' ? (
                    <View style={styles.actions}>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleStatusUpdate(req.id, 'Accepted')}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.acceptText}>Accept Order</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleStatusUpdate(req.id, 'Rejected')}>
                        <XCircle size={16} color="#EF4444" />
                        <Text style={styles.rejectText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.actions}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: req.status === 'Accepted' ? '#10B981' : '#EF4444' }}>
                        {req.status === 'Accepted' ? '✓ Accepted' : '✕ Declined'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.rankingTip}>Responding within 2 hrs improves your ranking</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  pageSubtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  
  infoBanner: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  bannerIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  bannerSubtitle: { fontSize: 12, color: colors.muted, lineHeight: 16 },
  liveFeedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', position: 'absolute', top: 16, right: 16 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginRight: 6 },
  liveFeedText: { fontSize: 10, fontWeight: '600', color: '#D97706' },
  
  statsContainer: { gap: 12, marginBottom: 20, paddingRight: 16 },
  statCard: { width: 120, padding: 16, borderRadius: 12, borderWidth: 1, marginRight: 12 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  
  searchFilterContainer: { marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A' },
  filterScroll: { flexDirection: 'row' },
  filterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filterPillActive: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  filterTextActive: { color: '#D97706' },
  filterCount: { backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  filterCountText: { fontSize: 10, fontWeight: '700', color: colors.muted },
  
  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' } }) },
  urgencyBanner: { backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  urgencyBannerText: { fontSize: 12, fontWeight: '600', color: '#D97706' },
  cardInner: { padding: 16 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  idText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  dotSeparator: { marginHorizontal: 6, color: colors.muted, fontSize: 14 },
  timeText: { fontSize: 12, color: colors.muted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusNew: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  statusPending: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  statusText: { fontSize: 11, fontWeight: '600' },
  statusTextNew: { color: '#2563EB' },
  statusTextPending: { color: '#D97706' },
  
  reqTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailItem: { width: '45%', flexDirection: 'row', alignItems: 'flex-start' },
  detailIcon: { backgroundColor: '#F8FAFC', padding: 6, borderRadius: 8, marginRight: 8, overflow: 'hidden' },
  detailLabel: { fontSize: 11, color: colors.muted, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 12 },
  budgetLabel: { fontSize: 13, color: colors.muted, fontWeight: '500' },
  budgetVal: { fontSize: 18, fontWeight: '800', color: '#F59E0B' },
  
  noteBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 16 },
  noteText: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 20 },
  
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  acceptBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#10B981', gap: 8 },
  acceptText: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#EF4444', gap: 8 },
  rejectText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  rankingTip: { fontSize: 11, color: colors.muted, textAlign: 'center' }
});

