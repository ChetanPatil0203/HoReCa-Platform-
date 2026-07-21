import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, ToastAndroid } from 'react-native';
import {
  Bell, Check, Trash2, Megaphone, Send, Eye, ThumbsUp, XCircle,
  MessageSquare, CheckCircle, Image as ImageIcon, Calendar, Clock, Flag,
  DollarSign, Star, Info
} from 'lucide-react-native';

const FILTERS = ["All", "Requirements", "Proposals", "Campaigns", "Approvals", "Payments", "System"];

const INITIAL_NOTIFICATIONS = [
  { id: 'NOT-1', type: 'New Broadcast Requirement', category: 'Requirements', title: 'New Broadcast: Hotel Azure', message: 'Azure Palace Hotel is looking for a comprehensive branding package.', time: '10 mins ago', isRead: false },
  { id: 'NOT-2', type: 'Payment Received', category: 'Payments', title: 'Payment Received', message: '₹50,000 received from Café Zephyr for Invoice #INV-26001.', time: '2 hours ago', isRead: false },
  { id: 'NOT-3', type: 'Creative Changes Requested', category: 'Approvals', title: 'Revision Requested', message: 'Client requested changes on "Summer Poster v1.0".', time: '5 hours ago', isRead: false },
  { id: 'NOT-4', type: 'Proposal Accepted', category: 'Proposals', title: 'Proposal Accepted!', message: 'Spice Route accepted your proposal for the Menu Launch PR.', time: 'Yesterday', isRead: true },
  { id: 'NOT-5', type: 'Campaign Completed', category: 'Campaigns', title: 'Campaign Completed', message: 'Weekend Brunch Influencer Push has successfully ended.', time: '2 days ago', isRead: true },
  { id: 'NOT-6', type: 'New Review', category: 'System', title: 'New 5-Star Review', message: 'Spice Route left a new review on your agency profile.', time: '3 days ago', isRead: true },
];

export default function MarketingNotificationsScreen({ setActivePage }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const filteredNotifs = activeFilter === "All" ? notifications : notifications.filter(n => n.category === activeFilter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIconForType = (type) => {
    switch (type) {
      case 'New Broadcast Requirement': return <Megaphone size={20} color="#8B5CF6" />;
      case 'New Direct Request': return <Send size={20} color="#8B5CF6" />;
      case 'Proposal Viewed': return <Eye size={20} color="#3B82F6" />;
      case 'Proposal Accepted': return <ThumbsUp size={20} color="#10B981" />;
      case 'Proposal Rejected': return <XCircle size={20} color="#EF4444" />;
      case 'Revision Requested': return <MessageSquare size={20} color="#F59E0B" />;
      case 'Creative Approved': return <CheckCircle size={20} color="#10B981" />;
      case 'Creative Changes Requested': return <ImageIcon size={20} color="#EF4444" />;
      case 'Campaign Start Reminder': return <Calendar size={20} color="#3B82F6" />;
      case 'Task Due': return <Clock size={20} color="#F59E0B" />;
      case 'Campaign Completed': return <Flag size={20} color="#10B981" />;
      case 'Payment Received': return <DollarSign size={20} color="#10B981" />;
      case 'New Review': return <Star size={20} color="#F59E0B" />;
      default: return <Info size={20} color="#64748B" />;
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    if (Platform.OS === 'android') {
      ToastAndroid.show("All marked as read.", ToastAndroid.SHORT);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleCardPress = (item) => {
    markAsRead(item.id);
    // Simulation of opening related screen
    if (item.category === 'Payments') setActivePage('revenue');
    else if (item.category === 'Campaigns') setActivePage('campaigns');
    else if (item.category === 'Approvals') setActivePage('campaigns');
    else if (item.category === 'Requirements') setActivePage('dashboard');
    else if (item.category === 'Proposals') setActivePage('requests');
  };

  const renderNotifCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.cardUnread]}
      onPress={() => handleCardPress(item)}
    >
      <View style={styles.iconBox}>
        {getIconForType(item.type)}
      </View>
      <View style={styles.contentBox}>
        <Text style={[styles.title, !item.isRead && styles.titleUnread]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.actionCol}>
        {!item.isRead && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => markAsRead(item.id)}>
            <Check size={18} color="#8B5CF6" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={() => deleteNotif(item.id)}>
          <Trash2 size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
          <Check size={16} color="#8B5CF6" />
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredNotifs}
        keyExtractor={item => item.id}
        renderItem={renderNotifCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Bell size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F8FAFC',
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  headerTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#0F172A',
  },
  unreadBadge: {
    backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  unreadBadgeText: {
    color: '#fff', fontSize: 10, fontWeight: 'bold',
  },
  markAllBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, gap: 4,
  },
  markAllText: {
    color: '#8B5CF6', fontWeight: 'bold', fontSize: 12,
  },
  filterWrapper: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16, gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6', borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 13, fontWeight: '600', color: '#64748B',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16, paddingBottom: 40,
  },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardUnread: {
    backgroundColor: '#F5F3FF', borderColor: '#DDD6FE',
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  contentBox: {
    flex: 1,
  },
  title: {
    fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 4,
  },
  titleUnread: {
    color: '#0F172A', fontWeight: 'bold',
  },
  message: {
    fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 6,
  },
  time: {
    fontSize: 11, color: '#94A3B8', fontWeight: '500',
  },
  actionCol: {
    justifyContent: 'space-between', paddingLeft: 12,
  },
  actionBtn: {
    padding: 4,
  },
  emptyBox: {
    alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40,
  },
  emptyText: {
    marginTop: 12, fontSize: 16, color: '#94A3B8', fontWeight: '500',
  }
});
