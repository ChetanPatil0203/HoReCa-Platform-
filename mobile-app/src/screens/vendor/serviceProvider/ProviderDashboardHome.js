import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Platform, 
  TouchableOpacity, useWindowDimensions, SafeAreaView 
} from 'react-native';
import { 
  Inbox, Clock, Calendar, Wrench, 
  ChevronRight, CheckCircle, Activity, FileText,
  Star, Briefcase, Radio
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';

const OVERVIEW_DATA = [
  { label: "Open Opportunities", value: "5", icon: Radio, color: "#3B82F6", bg: "#EFF6FF", navigateTo: "feed" },
  { label: "Pending Quotes", value: "3", icon: Clock, color: "#F59E0B", bg: "#FFFBEB", navigateTo: "quotes" },
  { label: "Scheduled Today", value: "2", icon: Calendar, color: "#10B981", bg: "#ECFDF5", navigateTo: "jobs" },
  { label: "Active Jobs", value: "4", icon: Wrench, color: "#6C4CF6", bg: "#F3F0FF", navigateTo: "jobs" },
];

const COMMON_FEED = [
  {
    id: "REQ-209",
    service: "AC Deep Cleaning",
    business: "Grand Hotel & Spa",
    location: "Bandra West",
    budget: "₹15,000 – ₹20,000",
    date: "24 Oct 2026",
    priority: "High",
    responses: 5,
  },
  {
    id: "REQ-208",
    service: "Commercial Oven Repair",
    business: "Cafe Aroma",
    location: "Andheri East",
    budget: "₹8,000 – ₹12,000",
    date: "25 Oct 2026",
    priority: "Normal",
    responses: 2,
  }
];

const TODAYS_SCHEDULE = [
  {
    service: "AC Maintenance",
    business: "The Meridian Hotel",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    service: "Pest Control",
    business: "Cafe Aroma",
    time: "02:00 PM",
    status: "Upcoming",
  }
];

const RECENT_ACTIVITY = [
  {
    title: "Quote Submitted",
    description: "Quote sent to Grand Hotel & Spa",
    time: "10 minutes ago",
    icon: FileText,
    color: "#F59E0B",
    bg: "#FFFBEB"
  },
  {
    title: "Request Accepted",
    description: "AC maintenance request confirmed",
    time: "1 hour ago",
    icon: CheckCircle,
    color: "#10B981",
    bg: "#ECFDF5"
  },
  {
    title: "Service Completed",
    description: "Deep kitchen cleaning completed",
    time: "Yesterday",
    icon: Briefcase,
    color: "#6C4CF6",
    bg: "#F3F0FF"
  }
];

export default function ProviderDashboardHome({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return { text: '#10B981' };
      case 'Upcoming': return { text: '#3B82F6' };
      case 'In Progress': return { text: '#F59E0B' };
      case 'Delayed': return { text: '#EF4444' };
      default: return { text: '#64748B' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, isLargeScreen && styles.centerWrapper]}>
        
        {/* Premium Welcome Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>Good Morning 👋</Text>
            <Text style={styles.heroName}>ProClean Services</Text>
            <Text style={styles.heroSubtitle}>Service Provider</Text>
            <Text style={styles.heroDesc}>Manage service requests, quotations and scheduled jobs from one place.</Text>
          </View>
          <View style={styles.heroWatermark}>
            <Wrench size={100} color="rgba(255,255,255,0.05)" />
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            {OVERVIEW_DATA.map((item, idx) => (
              <View 
                key={idx} 
                style={[styles.overviewCard, isLargeScreen && { width: '23%' }]} 
              >
                <View style={styles.overviewTop}>
                  <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>{item.value}</Text>
                <Text style={styles.overviewLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={isLargeScreen ? styles.desktopRow : null}>
          
          <View style={[isLargeScreen && styles.col, isLargeScreen && { flex: 1.5 }]}>
            {/* Common Feed Wall */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.sectionTitle} numberOfLines={2}>Open Service Opportunities</Text>
                  <Text style={styles.sectionSubtitle} numberOfLines={2}>Common service requirements matching your services</Text>
                </View>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate && onNavigate('feed')}>
                  <Text style={styles.viewAllText}>View Feed Wall</Text>
                  <ChevronRight size={16} color={NAVY} />
                </TouchableOpacity>
              </View>

              {COMMON_FEED.length === 0 ? (
                <View style={styles.emptyFeedBox}>
                  <Text style={styles.emptyFeedTitle}>No matching service opportunities</Text>
                  <Text style={styles.emptyFeedSub}>New requirements matching your services will appear here.</Text>
                </View>
              ) : (
                COMMON_FEED.map((req, idx) => (
                  <View key={idx} style={styles.feedCard}>
                    <View style={styles.feedHeader}>
                      <Text style={styles.feedId}>{req.id}</Text>
                      <View style={styles.opportunityBadge}>
                        <Text style={styles.opportunityText}>Open Opportunity</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.reqService}>{req.service}</Text>
                    <Text style={styles.reqBusiness}>{req.business} • {req.location}</Text>
                    <Text style={styles.reqResponses}>{req.responses} provider responses</Text>
                    
                    <View style={styles.feedDetailsRow}>
                      <Text style={styles.feedDetailText}>{req.budget}</Text>
                      <Text style={styles.feedDetailDot}>•</Text>
                      <Text style={styles.feedDetailText}>{req.date}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.viewActionBtn} onPress={() => onNavigate && onNavigate('feed')}>
                      <Text style={styles.viewActionText}>View Opportunity</Text>
                      <ChevronRight size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={[isLargeScreen && styles.col, isLargeScreen && { flex: 1 }]}>
            {/* Today's Schedule */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Schedule</Text>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate && onNavigate('jobs')}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color={NAVY} />
                </TouchableOpacity>
              </View>

              <View style={styles.listCard}>
                {TODAYS_SCHEDULE.map((job, idx) => (
                  <TouchableOpacity key={idx} style={[styles.scheduleRow, idx === TODAYS_SCHEDULE.length - 1 && { borderBottomWidth: 0 }]} onPress={() => onNavigate && onNavigate('jobs')}>
                    <View style={styles.scheduleInfo}>
                      <Text style={styles.scheduleService}>{job.service}</Text>
                      <Text style={styles.scheduleBusiness}>{job.business}</Text>
                    </View>
                    <View style={styles.scheduleRight}>
                      <Text style={styles.scheduleTime}>{job.time}</Text>
                      <Text style={[styles.scheduleStatus, { color: getStatusStyle(job.status).text }]}>{job.status}</Text>
                    </View>
                    <ChevronRight size={16} color="#CBD5E1" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate && onNavigate('history')}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color={NAVY} />
                </TouchableOpacity>
              </View>

              <View style={styles.listCard}>
                {RECENT_ACTIVITY.map((activity, idx) => (
                  <View key={idx} style={[styles.activityRow, idx === RECENT_ACTIVITY.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[styles.activityIconBox, { backgroundColor: activity.bg }]}>
                      <activity.icon size={16} color={activity.color} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDesc}>{activity.description}</Text>
                    </View>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  centerWrapper: { maxWidth: 1200, alignSelf: 'center', width: '100%' },

  heroCard: { backgroundColor: NAVY, borderRadius: 22, overflow: 'hidden', marginBottom: 24, padding: 20, position: 'relative' },
  heroContent: { position: 'relative', zIndex: 2 },
  heroGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroName: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: GOLD, fontWeight: '600', marginBottom: 8 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', maxWidth: '80%', lineHeight: 18 },
  heroWatermark: { position: 'absolute', right: -15, bottom: -20, zIndex: 1 },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: 13, fontWeight: '600', color: NAVY, marginRight: 2 },

  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  overviewCard: { width: '48%', backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overviewValue: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },

  emptyFeedBox: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  emptyFeedTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 6 },
  emptyFeedSub: { fontSize: 13, color: '#64748B', textAlign: 'center' },

  feedCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  feedId: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  opportunityBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  opportunityText: { fontSize: 11, fontWeight: 'bold', color: '#1D4ED8' },
  reqService: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  reqBusiness: { fontSize: 13, color: '#475569', marginBottom: 4, fontWeight: '500' },
  reqResponses: { fontSize: 12, color: '#F59E0B', fontWeight: '600', marginBottom: 12 },
  feedDetailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  feedDetailText: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  feedDetailDot: { marginHorizontal: 8, color: '#CBD5E1' },
  viewActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 10 },
  viewActionText: { fontSize: 14, fontWeight: 'bold', color: '#2563EB', marginRight: 4 },

  listCard: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  
  scheduleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  scheduleInfo: { flex: 1 },
  scheduleService: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  scheduleBusiness: { fontSize: 12, color: '#64748B' },
  scheduleRight: { alignItems: 'flex-end' },
  scheduleTime: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  scheduleStatus: { fontSize: 11, fontWeight: 'bold' },

  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  activityIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  activityDesc: { fontSize: 12, color: '#64748B' },
  activityTime: { fontSize: 11, color: '#94A3B8', alignSelf: 'flex-start' },

  desktopRow: { flexDirection: 'row', gap: 24 },
  col: { flex: 1 },
});
