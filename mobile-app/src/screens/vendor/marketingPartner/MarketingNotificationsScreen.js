import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import {
  fetchUserNotificationsApi,
  markAllNotificationsReadApi,
  toggleNotificationReadApi,
  fetchVendorOrders
} from '../../../services/api.service';

const NAVY = '#0B2246';
const STORAGE_KEY = 'hrc_read_notifications_marketing';

const TABS = ['All', 'Unread', 'Marked as Read'];

export default function MarketingNotificationsScreen() {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?.registration?.userId || user?.userId;
  const supplierId = user?.registration?.id || user?.id;

  const [activeTab, setActiveTab] = useState('All');
  const [allNotifications, setAllNotifications] = useState([]);
  const [readOverrideMap, setReadOverrideMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Restore persistent read overrides from LocalStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setReadOverrideMap(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.warn('LocalStorage restore error:', e);
    }
  }, []);

  const updateReadOverrides = (updater) => {
    setReadOverrideMap(prev => {
      const nextMap = typeof updater === 'function' ? updater(prev) : updater;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
        }
      } catch (e) {}
      return nextMap;
    });
  };

  const loadNotifications = useCallback(async () => {
    if (!userId && !supplierId) return;

    try {
      let dbRes = null;
      if (userId) {
        try {
          dbRes = await fetchUserNotificationsApi(userId, 'All');
        } catch (e) {}
      }

      if (dbRes?.success && Array.isArray(dbRes.data) && dbRes.data.length > 0) {
        setAllNotifications(dbRes.data);
      } else {
        // Fallback sync from Live Vendor Orders / Campaigns
        const res = await fetchVendorOrders(supplierId);
        const ordersList = res?.data || res || [];
        const list = [];

        if (Array.isArray(ordersList)) {
          ordersList.forEach((ord, idx) => {
            const timeStr = ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '02:15 PM';
            const shortId = (ord.id || '').toString().slice(-4).toUpperCase();
            
            list.push({
              id: `mkt-${ord.id || idx}`,
              type: 'Orders',
              title: `Campaign Update: #${shortId}`,
              message: `Client ${ord.owner?.bizName || 'Grand Hotel'} launched campaign request. Status: ${ord.status || 'Active'}.`,
              createdAt: ord.createdAt || new Date().toISOString(),
              time: timeStr,
              isRead: ord.status === 'completed',
            });
          });
        }
        setAllNotifications(list);
      }
    } catch (err) {
      console.warn('Error loading marketing notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, supplierId]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 2000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const processedNotifications = allNotifications.map(n => {
    const isOverridden = readOverrideMap[n.id] !== undefined;
    return {
      ...n,
      isRead: isOverridden ? readOverrideMap[n.id] : Boolean(n.isRead),
    };
  });

  const unreadCount = processedNotifications.filter(n => !n.isRead).length;
  const readCount = processedNotifications.filter(n => n.isRead).length;
  const totalCount = processedNotifications.length;

  const handleMarkAllAsRead = async () => {
    try {
      if (userId) {
        markAllNotificationsReadApi(userId).catch(() => {});
      }
      
      const newOverrides = { ...readOverrideMap };
      allNotifications.forEach(n => {
        newOverrides[n.id] = true;
      });
      updateReadOverrides(newOverrides);
      setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.warn('Mark all read error:', err);
    }
  };

  const handleNotificationPress = async (item) => {
    if (item.isRead) return;

    try {
      updateReadOverrides(prev => ({
        ...prev,
        [item.id]: true,
      }));

      setAllNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));

      if (userId && !item.id.toString().startsWith('mkt-') && !item.id.toString().startsWith('req-')) {
        toggleNotificationReadApi(item.id).catch(() => {});
      }
    } catch (err) {
      console.warn('Mark notification read error:', err);
    }
  };

  const displayedNotifications = processedNotifications.filter(n => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Marked as Read') return n.isRead;
    return true;
  });

  const getTabLabel = (tabName) => {
    if (tabName === 'All') return `All (${totalCount})`;
    if (tabName === 'Unread') return `Unread (${unreadCount})`;
    if (tabName === 'Marked as Read') return `Marked as Read (${readCount})`;
    return tabName;
  };

  const renderNotif = ({ item }) => {
    const timeDisplay = item.time || (item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

    return (
      <TouchableOpacity 
        style={[styles.notifCard, !item.isRead && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.85}
      >
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, !item.isRead && styles.unreadText]}>{item.title}</Text>
            <Text style={styles.timeText}>{timeDisplay}</Text>
          </View>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadgeHeader}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllAsRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.filterChip, activeTab === tab && styles.activeFilterChip]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.filterChipText, activeTab === tab && styles.activeFilterChipText]}>
                  {getTabLabel(tab)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading && displayedNotifications.length === 0 ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={NAVY} />
          </View>
        ) : displayedNotifications.length === 0 ? (
          <View style={styles.centerBox}>
            <Bell size={44} color="#CBD5E1" />
            <Text style={styles.emptyText}>
              {activeTab === 'Unread' 
                ? 'No unread notifications' 
                : activeTab === 'Marked as Read' 
                ? 'No read notifications' 
                : 'No notifications found'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedNotifications}
            keyExtractor={item => item.id.toString()}
            renderItem={renderNotif}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { 
    paddingTop: 16, 
    paddingBottom: 16,  
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: NAVY },
  unreadBadgeHeader: {
    marginLeft: 8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  markReadBtn: { paddingVertical: 4 },
  markReadText: { fontSize: 13, color: NAVY, fontWeight: '600' },
  
  filterContainer: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterScroll: { paddingHorizontal: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  activeFilterChip: { backgroundColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  activeFilterChipText: { color: '#FFFFFF' },
  
  listContent: { padding: 16, paddingBottom: 80 },
  notifCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadCard: { 
    backgroundColor: '#F0F9FF', 
    borderColor: '#BAE6FD' 
  },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: NAVY },
  unreadText: { fontWeight: '800', color: NAVY },
  timeText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  messageText: { fontSize: 13, color: '#475569', lineHeight: 19 },
  
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { marginTop: 12, fontSize: 14, color: '#94A3B8', fontWeight: '500' },
});
