import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Bell, Package, AlertTriangle, FileText, Check } from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const FILTERS = ['All', 'Orders', 'Alerts', 'System'];

const MOCK_NOTIFICATIONS = [];

export default function RawMaterialNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getIcon = (type) => {
    switch(type) {
      case 'Order': return <Package size={20} color="#3B82F6" />;
      case 'Alert': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'System': return <FileText size={20} color="#10B981" />;
      default: return <Bell size={20} color="#64748B" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
  };

  const filtered = activeFilter === 'All' ? notifications : notifications.filter(n => n.type === activeFilter);

  const renderNotif = ({ item }) => (
    <TouchableOpacity style={[styles.notifCard, !item.isRead && styles.unreadCard]}>
      <View style={styles.iconBox}>{getIcon(item.type)}</View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !item.isRead && styles.unreadText]}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllAsRead}>
            <Check size={16} color={NAVY} />
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map(f => (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f && styles.activeFilterChipText]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderNotif}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  markReadBtn: { flexDirection: 'row', alignItems: 'center' },
  markReadText: { fontSize: 13, color: NAVY, fontWeight: '500', marginLeft: 4 },
  filterContainer: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  filterScroll: { paddingHorizontal: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  activeFilterChip: { backgroundColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeFilterChipText: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 80 },
  notifCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  unreadCard: { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' },
  iconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: 15, color: '#334155' },
  unreadText: { fontWeight: 'bold', color: NAVY },
  timeText: { fontSize: 12, color: '#94A3B8' },
  messageText: { fontSize: 13, color: '#475569', lineHeight: 18 },
});
