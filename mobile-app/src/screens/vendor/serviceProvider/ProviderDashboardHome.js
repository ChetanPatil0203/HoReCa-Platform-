import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Platform, 
  TouchableOpacity, useWindowDimensions, SafeAreaView 
} from 'react-native';
import { Inbox, Clock, Calendar, Wrench, ChevronRight, CircleCheck as CheckCircle, Activity, FileText, Star, Briefcase, Radio } from 'lucide-react-native';
import { AuthContext } from '../../../context/AuthContext';
import { fetchVendorRequirements, fetchPublicRequirements } from '../../../services/api.service';

const NAVY = '#081A3A';
const GOLD = '#F6B800';

export default function ProviderDashboardHome({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { user } = useContext(AuthContext);

  const userRef = useRef(user);
  userRef.current = user;

  const [feedItems, setFeedItems] = useState([]);
  const [stats, setStats] = useState({
    openOpportunities: 0,
    directRequests: 0,
    scheduledToday: 0,
    activeJobs: 0
  });

  useEffect(() => {
    const loadHomeData = async () => {
      const currentSupplierId = userRef.current?.registration?.id || userRef.current?.id;
      try {
        const [publicRes, directRes] = await Promise.all([
          fetchPublicRequirements('serviceProvider'),
          currentSupplierId ? fetchVendorRequirements(currentSupplierId) : Promise.resolve([])
        ]);

        const publicList = publicRes?.data || publicRes || [];
        const directList = directRes?.data || directRes || [];

        const combinedFeed = [];
        if (Array.isArray(directList)) {
          directList.forEach((r, idx) => {
            combinedFeed.push({
              id: `DIR-${r.id ? r.id.substring(0,4).toUpperCase() : idx}`,
              service: r.title || 'Direct Service Request',
              business: r.owner?.bizName || 'HoReCa Owner',
              location: r.location || 'Location Specified',
              responses: 1,
              budget: r.budget || 'Custom Quote',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Today',
              isDirect: true
            });
          });
        }

        if (Array.isArray(publicList)) {
          publicList.forEach((r, idx) => {
            combinedFeed.push({
              id: r.id ? `REQ-${r.id.substring(0,5).toUpperCase()}` : `REQ-${101 + idx}`,
              service: r.title || r.extraData?.serviceType || 'Service Requirement',
              business: r.owner?.bizName || 'HoReCa Establishment',
              location: r.location || r.owner?.city || 'Location Specified',
              responses: 0,
              budget: r.budget || 'Open Budget',
              date: r.extraData?.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Immediate'),
              isDirect: false
            });
          });
        }

        setFeedItems(combinedFeed);
        setStats({
          openOpportunities: publicList.length,
          directRequests: directList.length,
          scheduledToday: 0,
          activeJobs: directList.length
        });
      } catch (err) {
        console.warn('Error loading provider dashboard home:', err);
      }
    };

    loadHomeData();
    const interval = setInterval(loadHomeData, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const overviewData = [
    { label: "Open Opportunities", value: stats.openOpportunities.toString(), icon: Radio, color: "#3B82F6", bg: "#EFF6FF", navigateTo: "feed" },
    { label: "Direct Requests", value: stats.directRequests.toString(), icon: Clock, color: "#F59E0B", bg: "#FFFBEB", navigateTo: "requests" },
    { label: "Scheduled Today", value: stats.scheduledToday.toString(), icon: Calendar, color: "#10B981", bg: "#ECFDF5", navigateTo: "jobs" },
    { label: "Active Jobs", value: stats.activeJobs.toString(), icon: Wrench, color: "#6C4CF6", bg: "#F3F0FF", navigateTo: "jobs" },
  ];

  const providerName = user?.registration?.bizName || (user?.firstName ? `${user.firstName}'s Services` : 'Service Provider');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return { text: '#10B981' };
      case 'Upcoming': return { text: '#3B82F6' };
      case 'In Progress': return { text: '#F59E0B' };
      case 'Delayed': return { text: '#EF4444' };
      default: return { text: '#64748B' };
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🖐️';
    if (hour < 17) return 'Good Afternoon 🖐️';
    return 'Good Evening 🖐️';
  };

  const vendorType = user?.registration?.vendorType || 'Registered Service Provider';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, isLargeScreen && styles.centerWrapper]}>
        
        {/* Premium Welcome Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>{getGreeting()}</Text>
            <Text style={styles.heroName}>{providerName}</Text>
            <Text style={styles.heroSubtitle}>{vendorType}</Text>
            <Text style={styles.heroDesc}>Manage direct service requests, quotations and scheduled jobs in real-time.</Text>
          </View>
          <View style={styles.heroWatermark}>
            <Wrench size={100} color="rgba(255,255,255,0.05)" />
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewGrid}>
            {overviewData.map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.overviewCard, isLargeScreen && { width: '23%' }]} 
                onPress={() => onNavigate && onNavigate(item.navigateTo)}
              >
                <View style={styles.overviewTop}>
                  <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={18} color={item.color} />
                  </View>
                  <Text style={styles.overviewValue}>{item.value}</Text>
                </View>
                <Text style={styles.overviewLabel}>{item.label}</Text>
              </TouchableOpacity>
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
                  <Text style={styles.sectionSubtitle} numberOfLines={2}>Live direct & broadcast service requirements</Text>
                </View>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate && onNavigate('feed')}>
                  <Text style={styles.viewAllText}>View Feed Wall</Text>
                  <ChevronRight size={16} color={NAVY} />
                </TouchableOpacity>
              </View>

              {feedItems.length === 0 ? (
                <View style={styles.emptyFeedBox}>
                  <Text style={styles.emptyFeedTitle}>No matching service opportunities</Text>
                  <Text style={styles.emptyFeedSub}>New requirements posted by HoReCa owners will appear here.</Text>
                </View>
              ) : (
                feedItems.map((req, idx) => (
                  <View key={idx} style={styles.feedCard}>
                    <View style={styles.feedHeader}>
                      <Text style={styles.feedId}>{req.id}</Text>
                      <View style={[styles.opportunityBadge, req.isDirect && { backgroundColor: '#DBEAFE' }]}>
                        <Text style={[styles.opportunityText, req.isDirect && { color: '#1E40AF' }]}>
                          {req.isDirect ? 'Direct Request' : 'Open Opportunity'}
                        </Text>
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
                      <Text style={styles.viewActionText}>View Request Details</Text>
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
                  <ChevronRight size={16} color="#000000" />
                </TouchableOpacity>
              </View>

              <View style={styles.listCard}>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '500' }}>No jobs scheduled for today.</Text>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity style={styles.viewAllBtn} onPress={() => onNavigate && onNavigate('history')}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <ChevronRight size={16} color="#000000" />
                </TouchableOpacity>
              </View>

              <View style={styles.listCard}>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '500' }}>No recent activity.</Text>
                </View>
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
  viewAllText: { fontSize: 13, fontWeight: '600', color: '#000000', marginRight: 2 },

  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  overviewCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, display: 'flex', flexDirection: 'column' },
  overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overviewValue: { fontSize: 24, fontWeight: '900', color: NAVY },
  overviewLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },

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
