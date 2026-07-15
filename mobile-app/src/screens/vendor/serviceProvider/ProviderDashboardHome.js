import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Platform, 
  TouchableOpacity, useWindowDimensions, SafeAreaView, FlatList 
} from 'react-native';
import { 
  Activity, Star, Briefcase, FileText, TrendingUp, 
  Clock, MapPin, AlertCircle, Calendar, CheckCircle, 
  ChevronRight, Users, MessageSquare 
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: "New Broadcasts", value: "24", icon: Activity, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Direct Requests", value: "5", icon: MessageSquare, color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Quotes Sent", value: "18", icon: FileText, color: "#8B5CF6", bg: "#F3E8FF" },
  { label: "Scheduled Jobs", value: "12", icon: Calendar, color: "#10B981", bg: "#D1FAE5" },
  { label: "In Progress", value: "4", icon: Clock, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Completed", value: "142", icon: CheckCircle, color: "#10B981", bg: "#D1FAE5" },
  { label: "Monthly Rev.", value: "₹2.8L", icon: TrendingUp, color: "#10B981", bg: "#D1FAE5" },
  { label: "Avg. Rating", value: "4.8", icon: Star, color: "#F59E0B", bg: "#FEF3C7" },
];

const BROADCAST_REQUESTS = [
  {
    id: "REQ-209",
    business: "Grand Hotel & Spa",
    service: "AC Deep Cleaning & Service",
    budget: "₹15,000 - ₹20,000",
    date: "24 Oct 2026",
    location: "Bandra West",
    urgency: "High",
  },
  {
    id: "REQ-208",
    business: "Cafe Mocha",
    service: "Commercial Oven Repair",
    budget: "₹8,000 - ₹12,000",
    date: "25 Oct 2026",
    location: "Andheri East",
    urgency: "Medium",
  },
  {
    id: "REQ-205",
    business: "The Gourmet Kitchen",
    service: "Exhaust Fan Installation",
    budget: "₹25,000",
    date: "28 Oct 2026",
    location: "Lower Parel",
    urgency: "Low",
  }
];

const RECENT_REVIEWS = [
  { id: 1, client: "Sea View Restaurant", rating: 5, text: "Excellent plumbing work. Arrived on time." },
  { id: 2, client: "Urban Cafe", rating: 4, text: "Good service, but slightly delayed." },
];

const TEAM_MEMBERS = [
  { id: 1, name: "Rahul S.", role: "Senior Electrician", status: "Available" },
  { id: 2, name: "Amit K.", role: "AC Technician", status: "On Job" },
];

export default function ProviderDashboardHome() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const renderSummaryCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <View style={[styles.summaryCard, { width: (width - 48) / 2 }]}>
        <View style={styles.summaryTop}>
          <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
            <Icon size={20} color={item.color} />
          </View>
          <Text style={styles.summaryValue}>{item.value}</Text>
        </View>
        <Text style={styles.summaryLabel}>{item.label}</Text>
      </View>
    );
  };

  const renderBroadcastCard = ({ item }) => (
    <View style={styles.feedCard}>
      <View style={styles.feedHeader}>
        <Text style={styles.feedId}>{item.id}</Text>
        <View style={[styles.urgencyBadge, item.urgency === 'High' ? styles.urgencyHigh : styles.urgencyNormal]}>
          <Text style={[styles.urgencyText, item.urgency === 'High' ? styles.urgencyTextHigh : styles.urgencyTextNormal]}>
            {item.urgency} Urgency
          </Text>
        </View>
      </View>
      <View style={styles.feedBody}>
        <Text style={styles.feedBusiness}>{item.business}</Text>
        <Text style={styles.feedService}>{item.service}</Text>
        
        <View style={styles.feedDetailsRow}>
          <View style={styles.feedDetailItem}>
            <AlertCircle size={14} color="#64748B" />
            <Text style={styles.feedDetailText}>{item.budget}</Text>
          </View>
          <View style={styles.feedDetailItem}>
            <Calendar size={14} color="#64748B" />
            <Text style={styles.feedDetailText}>{item.date}</Text>
          </View>
          <View style={styles.feedDetailItem}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.feedDetailText}>{item.location}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.feedFooter, isSmallScreen && { flexDirection: 'column' }]}>
        <TouchableOpacity style={[styles.btnOutline, isSmallScreen && { marginBottom: 8, width: '100%' }]}>
          <Text style={styles.btnOutlineText}>View Details</Text>
        </TouchableOpacity>
        <View style={[styles.actionBtns, isSmallScreen && { width: '100%' }]}>
          <TouchableOpacity style={[styles.btnOutline, { marginRight: 8, flex: isSmallScreen ? 1 : undefined }]}>
            <Text style={styles.btnOutlineText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, { flex: isSmallScreen ? 1 : undefined }]}>
            <Text style={styles.btnPrimaryText}>Send Quote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <FlatList
            data={SUMMARY_DATA}
            keyExtractor={(item) => item.label}
            renderItem={renderSummaryCard}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.summaryRow}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Broadcast Requirements Feed</Text>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={NAVY} />
            </TouchableOpacity>
          </View>
          {BROADCAST_REQUESTS.map(item => (
            <React.Fragment key={item.id}>
              {renderBroadcastCard({ item })}
            </React.Fragment>
          ))}
        </View>

        <View style={styles.twoColSection}>
          <View style={[styles.col, { marginRight: 8 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Team</Text>
            </View>
            <View style={styles.card}>
              {TEAM_MEMBERS.map((member, idx) => (
                <View key={member.id} style={[styles.listItem, idx === TEAM_MEMBERS.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.listAvatar}>
                    <Users size={16} color="#64748B" />
                  </View>
                  <View style={styles.listBody}>
                    <Text style={styles.listTitle}>{member.name}</Text>
                    <Text style={styles.listSub}>{member.role}</Text>
                  </View>
                  <View style={[styles.statusDot, member.status === 'Available' ? { backgroundColor: '#10B981' } : { backgroundColor: '#F59E0B' }]} />
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.col, { marginLeft: 8 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
            </View>
            <View style={styles.card}>
              {RECENT_REVIEWS.map((review, idx) => (
                <View key={review.id} style={[styles.listItem, idx === RECENT_REVIEWS.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.listBody}>
                    <Text style={styles.listTitle}>{review.client}</Text>
                    <View style={styles.ratingRow}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{review.rating}</Text>
                    </View>
                    <Text style={styles.reviewText} numberOfLines={2}>{review.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
    marginRight: 4,
  },
  summaryRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  feedId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyHigh: {
    backgroundColor: '#FEE2E2',
  },
  urgencyNormal: {
    backgroundColor: '#F1F5F9',
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  urgencyTextHigh: {
    color: '#EF4444',
  },
  urgencyTextNormal: {
    color: '#64748B',
  },
  feedBody: {
    marginBottom: 16,
  },
  feedBusiness: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  feedService: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
  },
  feedDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feedDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  feedDetailText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#64748B',
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionBtns: {
    flexDirection: 'row',
  },
  btnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: NAVY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: NAVY,
    fontWeight: '600',
    fontSize: 13,
  },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: NAVY,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  twoColSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  col: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listBody: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  listSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  }
});
