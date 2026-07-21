import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, useWindowDimensions, ScrollView, Alert
} from 'react-native';
import { 
  Bell, CheckCircle, Clock, FileText, IndianRupee, 
  Star, Settings, Volume2, Briefcase, RefreshCcw, BellOff
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const FILTERS = ['All', 'Requests', 'Jobs', 'Payments', 'Reviews'];

const MOCK_NOTIFICATIONS = [
  {
    id: "NOT-101",
    category: "Requests",
    type: "Direct Request",
    title: "New Direct Request",
    message: "Cafe Zephyr requested AC Deep Cleaning.",
    time: "10 mins ago",
    isRead: false
  },
  {
    id: "NOT-102",
    category: "Requests",
    type: "Broadcast Request",
    title: "Broadcast Alert",
    message: "New plumbing requirement posted in your area (Bandra).",
    time: "1 hour ago",
    isRead: false
  },
  {
    id: "NOT-103",
    category: "Jobs",
    type: "Quote Accepted",
    title: "Quote Accepted",
    message: "Sunset Resort accepted your quote of ₹45,000.",
    time: "2 hours ago",
    isRead: true
  },
  {
    id: "NOT-104",
    category: "Jobs",
    type: "Job Scheduled",
    title: "Job Scheduled",
    message: "HVAC Maintenance for Sunset Resort is scheduled for tomorrow at 9:00 AM.",
    time: "3 hours ago",
    isRead: false
  },
  {
    id: "NOT-105",
    category: "Jobs",
    type: "Team Reminder",
    title: "Team Assignment Reminder",
    message: "You have 1 job scheduled today that is unassigned.",
    time: "4 hours ago",
    isRead: true
  },
  {
    id: "NOT-106",
    category: "Jobs",
    type: "Rework Request",
    title: "Rework Requested",
    message: "Client raised an issue for JOB-412 (Plumbing).",
    time: "5 hours ago",
    isRead: true
  },
  {
    id: "NOT-107",
    category: "Payments",
    type: "Payment Received",
    title: "Payment Received",
    message: "₹32,000 received from Cafe Zephyr for Invoice INV-2026-099.",
    time: "1 day ago",
    isRead: true
  },
  {
    id: "NOT-108",
    category: "Reviews",
    type: "New Review",
    title: "New 5-Star Review",
    message: "The Meridian Grand left a review for your recent service.",
    time: "2 days ago",
    isRead: true
  }
];

export default function ProviderNotificationsPage() {
  const { width } = useWindowDimensions();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getIconData = (type) => {
    switch(type) {
      case 'Direct Request': return { icon: FileText, color: '#3B82F6', bg: '#DBEAFE' };
      case 'Broadcast Request': return { icon: Volume2, color: '#6366F1', bg: '#E0E7FF' };
      case 'Quote Accepted': return { icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' };
      case 'Job Scheduled': return { icon: Clock, color: '#F59E0B', bg: '#FEF3C7' };
      case 'Team Reminder': return { icon: Briefcase, color: '#8B5CF6', bg: '#F3E8FF' };
      case 'Rework Request': return { icon: RefreshCcw, color: '#EF4444', bg: '#FEE2E2' };
      case 'Payment Received': return { icon: IndianRupee, color: '#10B981', bg: '#D1FAE5' };
      case 'New Review': return { icon: Star, color: GOLD, bg: '#FEF9C3' };
      default: return { icon: Bell, color: '#64748B', bg: '#F1F5F9' };
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handlePressNotification = (item) => {
    // Mark as read
    if (!item.isRead) {
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    }
    
    // Simulate navigation
    Alert.alert(
      "Opening Screen",
      `Navigating to details for ${item.type}...`,
      [{ text: "OK" }]
    );
  };

  const filteredData = notifications.filter(n => activeFilter === 'All' || n.category === activeFilter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationCard = ({ item }) => {
    const { icon: Icon, color, bg } = getIconData(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.card, !item.isRead && styles.cardUnread]}
        onPress={() => handlePressNotification(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardLayout}>
          <View style={[styles.iconBox, { backgroundColor: bg }]}>
            <Icon size={20} color={color} />
          </View>
          
          <View style={styles.contentBox}>
            <Text style={[styles.title, !item.isRead && styles.titleUnread]}>{item.title}</Text>
            <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount} New</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                style={[styles.chip, activeFilter === filter && styles.chipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderNotificationCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <BellOff size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No notifications found in '{activeFilter}'.</Text>
            </View>
          }
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  markAllText: {
    fontSize: 14,
    color: GOLD,
    fontWeight: '600',
  },
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardUnread: {
    backgroundColor: '#F4F7FB', 
    borderColor: '#DBEAFE',
  },
  cardLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentBox: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 4,
  },
  titleUnread: {
    fontWeight: 'bold',
  },
  message: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginLeft: 8,
  },
});
