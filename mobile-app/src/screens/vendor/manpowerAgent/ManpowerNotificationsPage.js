import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Bell, Briefcase, User, Calendar, CheckCircle, DollarSign, AlertTriangle, ChevronRight, Check } from 'lucide-react-native';

const NAVY = '#081A3A';

const MOCK_NOTIFICATIONS = [];

const FILTERS = ['All', 'Requirements', 'Candidates', 'Staff Records', 'Payments', 'System'];

export default function ManpowerNotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNotifs = notifications.filter(n => activeFilter === 'All' || n.type === activeFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast("Opening related screen...");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read.");
  };

  const renderEmptyState = () => (
    <View style={styles.emptyBox}>
      <Bell size={48} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyDesc}>You're all caught up! New alerts will appear here.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Bell size={22} color={NAVY} />
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount} New</Text></View>}
        </View>
        <Text style={styles.headerSub}>Stay updated on candidate and client activities.</Text>
      </View>

      {/* Top Actions & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterLabel}>Filter by Type</Text>
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
            <Check size={14} color="#10B981" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[NAVY]} />}
        renderItem={({item}) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity style={[styles.notifCard, !item.read && styles.notifCardUnread]} onPress={() => markAsRead(item.id)}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <Icon size={20} color={item.color} />
              </View>
              <View style={styles.notifInfo}>
                <View style={styles.notifTitleRow}>
                  <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMsg}>{item.message}</Text>
                <View style={styles.notifFooterRow}>
                  <Text style={styles.notifDate}>{item.date}</Text>
                  <View style={styles.entityBadge}><Text style={styles.entityBadgeText}>{item.type}</Text></View>
                </View>
              </View>
              <View style={styles.chevronBox}>
                <ChevronRight size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Toast */}
      {toastMsg ? <View style={styles.toastContainer}><Text style={styles.toastText}>{toastMsg}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  headerSub: { fontSize: 13, color: '#64748B' },
  badge: { backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 12 },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },

  filterSection: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  filterLabel: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  markAllText: { fontSize: 12, color: '#059669', fontWeight: 'bold', marginLeft: 4 },

  chipScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  listContent: { padding: 16, paddingBottom: 40 },
  
  notifCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  notifCardUnread: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notifInfo: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '600', color: '#334155', flex: 1 },
  notifTitleUnread: { color: '#1E293B', fontWeight: 'bold' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginLeft: 8 },
  
  notifMsg: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 8 },
  
  notifFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifDate: { fontSize: 11, color: '#94A3B8' },
  entityBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  entityBadgeText: { fontSize: 10, color: '#64748B', fontWeight: '500' },

  chevronBox: { justifyContent: 'center', marginLeft: 12 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },

  toastContainer: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 5 },
  toastText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
