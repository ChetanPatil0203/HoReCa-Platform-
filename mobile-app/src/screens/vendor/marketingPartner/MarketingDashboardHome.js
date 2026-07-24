import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { 
  Megaphone, Inbox, Rocket, FileClock, ChevronRight, Sparkles, ShieldCheck, 
  Video, Image as ImageIcon, FileText, Phone, MonitorPlay, Presentation, Building2, Clock, Globe
} from 'lucide-react-native';

const NAVY = '#071B3A';
const PURPLE = '#071B3A';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const MOCK_NEEDS_ATTENTION = [
  {
    id: "NA-01", title: "Video Ad Draft v2",
    context: "Spice Route Restaurant", status: "Client approval pending",
    action: "Review", icon: Video, color: ORANGE
  },
  {
    id: "NA-02", title: "Instagram Carousel Draft",
    context: "Azure Palace Hotel", status: "Changes requested by client",
    action: "View Feedback", icon: ImageIcon, color: RED
  },
  {
    id: "NA-03", title: "Proposal Deadline",
    context: "Summer Social Media Launch", status: "Due Today",
    action: "Open", icon: FileText, color: RED
  }
];

const FEED_WALL_DATA = [
  { 
    id: "REQ-101", title: "Summer Social Media Launch", 
    businessName: "The Meridian Hotel", location: "Andheri, Mumbai",
    category: "Social Media Marketing", budget: "₹45,000–₹60,000", date: "25 Jun 2026",
    priority: "High Priority", postedAt: "2 hours ago", 
    description: "Looking for an agency to run our 3-month summer campaign across Instagram and Facebook. We want to target high-net-worth individuals for our luxury suites.",
    duration: "3 Months", status: "New"
  },
  { 
    id: "REQ-102", title: "New Menu Photography & Videography", 
    businessName: "Spice Route Restaurant", location: "Bandra, Mumbai",
    category: "Content Creation", budget: "₹25,000", date: "22 Jun 2026",
    priority: "New", postedAt: "5 hours ago", 
    description: "Need professional photos and 15-second reels for our upcoming menu launch. Food styling experience is required.",
    duration: "1 Week", status: "Proposal Sent"
  },
  { 
    id: "REQ-103", title: "Local SEO Optimization", 
    businessName: "Café Zephyr", location: "Lower Parel, Mumbai",
    category: "SEO", budget: "₹15,000 / Month", date: "20 Jun 2026",
    priority: "Closing Soon", postedAt: "1 day ago", 
    description: "Improve local search rankings on Google Maps and Zomato. We need more foot traffic from local office goers.",
    duration: "Ongoing", status: "Closed"
  }
];

const MOCK_SCHEDULE = [
  { id: "SCH-01", time: "10:30 AM", title: "Client Call", business: "Azure Palace Hotel", icon: Phone },
  { id: "SCH-02", time: "02:00 PM", title: "Creative Review", business: "Spice Route Restaurant", icon: MonitorPlay },
  { id: "SCH-03", time: "04:30 PM", title: "Campaign Presentation", business: "The Meridian Hotel", icon: Presentation }
];

const CATEGORIES = ["All", "Social Media Marketing", "Content Creation", "SEO", "Performance Marketing", "Influencer Marketing"];

// Helpers
const formatCategory = (cat) => {
  if (cat === "Social Media Marketing") return "Social Media";
  if (cat === "Photography & Videography" || cat === "Content Creation") return "Photo & Video";
  if (cat === "Performance Marketing") return "Performance Ads";
  return cat;
};

const formatBudget = (budgetStr) => {
  return budgetStr.replace(/,000/g, 'K').replace(/ /g, '');
};

export default function MarketingDashboardHome({ setActivePage, handleSendProposal }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const contentPad = width < 340 ? 12 : (isMobile ? 16 : 24);

  const [activeCategory, setActiveCategory] = useState('All');

  const getPrimaryBadge = (item) => {
    if (item.status === 'Proposal Sent') return 'Proposal Sent';
    if (item.status === 'Closed') return 'Closed';
    if (item.priority === 'High Priority') return 'High Priority';
    if (item.priority === 'Closing Soon') return 'Closing Soon';
    if (item.priority === 'New') return 'New';
    return null;
  };

  const renderBadge = (badgeText) => {
    if (!badgeText) return null;
    let bgColor = '#F1F5F9';
    let textColor = '#64748B';
    
    if (badgeText === 'Proposal Sent') { bgColor = '#F3E8FF'; textColor = '#7E22CE'; }
    else if (badgeText === 'High Priority') { bgColor = '#FEF2F2'; textColor = '#EF4444'; }
    else if (badgeText === 'Closing Soon') { bgColor = '#FFF7ED'; textColor = '#F97316'; }
    else if (badgeText === 'New') { bgColor = '#EFF6FF'; textColor = '#2563EB'; }

    return (
      <View style={styles.priorityBadge}>
        <View style={[styles.priorityBadgeColor, { backgroundColor: bgColor }]}>
          <Text style={[styles.priorityText, { color: textColor }]}>{badgeText}</Text>
        </View>
      </View>
    );
  };

  const getActionDetails = (status) => {
    let label = 'Send Proposal';
    let isViewAction = false;
    
    if (status === 'Proposal Sent') {
      label = 'View Proposal';
      isViewAction = true;
    } else if (status === 'Closed') {
      label = 'View Details';
      isViewAction = true;
    }
    
    return { label, isViewAction };
  };

  const filteredFeed = FEED_WALL_DATA.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPad }]}>
        
        {/* 1. Welcome Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroGreeting}>Good Morning 👋</Text>
              <Text style={styles.heroTitle}>BrandCraft Agency</Text>
              <Text style={styles.heroSubtitle}>Marketing Agency</Text>
            </View>
            <View style={styles.heroIconBox}>
              <Sparkles size={24} color={WHITE} opacity={0.6} />
            </View>
          </View>
          
          <Text style={styles.heroDesc}>
            Manage opportunities, campaigns and client approvals.
          </Text>
        </View>

        {/* 2. Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#F5F3FF'}]}>
                <Megaphone size={18} color={PURPLE} />
              </View>
            </View>
            <Text style={styles.overviewCount}>12</Text>
            <Text style={styles.overviewLabel}>Open Opportunities</Text>
          </View>

          <View style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#EFF6FF'}]}>
                <Inbox size={18} color={BLUE} />
              </View>
            </View>
            <Text style={styles.overviewCount}>4</Text>
            <Text style={styles.overviewLabel}>Direct Requests</Text>
          </View>

          <View style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#F0FDF4'}]}>
                <Rocket size={18} color={GREEN} />
              </View>
            </View>
            <Text style={styles.overviewCount}>3</Text>
            <Text style={styles.overviewLabel}>Active Campaigns</Text>
          </View>

          <View style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#FFFBEB'}]}>
                <FileClock size={18} color={ORANGE} />
              </View>
            </View>
            <Text style={styles.overviewCount}>2</Text>
            <Text style={styles.overviewLabel}>Pending Approvals</Text>
          </View>
        </View>

        <View style={!isMobile && styles.desktopGrid}>
          <View style={!isMobile && styles.desktopColLeft}>
            
            {/* 3. Needs Attention */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Needs Attention</Text>
                <Text style={styles.sectionSubtitle}>Items requiring your response</Text>
              </View>
              <TouchableOpacity onPress={() => setActivePage('campaigns')}><Text style={styles.actionLink}>View All &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.attentionContainer}>
              {MOCK_NEEDS_ATTENTION.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.attentionRow, index !== MOCK_NEEDS_ATTENTION.length - 1 && styles.borderBottom]}
                  onPress={() => setActivePage(item.action === 'Open' ? 'proposals' : 'campaigns')}
                >
                  <View style={[styles.attentionIconBox, { backgroundColor: item.color + '15' }]}>
                    <item.icon size={16} color={item.color} />
                  </View>
                  <View style={styles.attentionContent}>
                    <Text style={styles.attentionTitle}>{item.title}</Text>
                    <Text style={styles.attentionContext}>{item.context}</Text>
                    <Text style={[styles.attentionStatus, { color: item.color }]}>{item.status}</Text>
                  </View>
                  <View style={styles.textActionBtn}>
                    <Text style={styles.textActionText}>{item.action}</Text>
                    <ChevronRight size={14} color={NAVY} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </View>

          <View style={!isMobile && styles.desktopColRight}>
            
            {/* 5. Today's Schedule */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Today’s Schedule</Text>
              </View>
              <TouchableOpacity onPress={() => setActivePage('campaigns')}><Text style={styles.actionLink}>View All &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.scheduleBox}>
              {MOCK_SCHEDULE.map((sch, index) => (
                <TouchableOpacity 
                  key={sch.id} 
                  style={[styles.scheduleRow, index !== MOCK_SCHEDULE.length - 1 && styles.borderBottom]}
                  onPress={() => setActivePage('campaigns')}
                >
                  <Text style={styles.scheduleTime}>{sch.time}</Text>
                  <View style={styles.scheduleIconWrap}>
                    <sch.icon size={14} color={MUTED} />
                  </View>
                  <View style={styles.scheduleContent}>
                    <Text style={styles.scheduleTitle}>{sch.title}</Text>
                    <Text style={styles.scheduleBusiness}>{sch.business}</Text>
                  </View>
                  <ChevronRight size={16} color={MUTED} />
                </TouchableOpacity>
              ))}
            </View>

          </View>
        </View>

        {/* 4. Feed Wall Integrated Widget */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Feed Wall Broadcasts</Text>
            <Text style={styles.sectionSubtitle}>Discover marketing opportunities broadcasted by HoReCa owners.</Text>
          </View>
          <TouchableOpacity onPress={() => setActivePage('feed')}><Text style={styles.actionLink}>Full Screen &gt;</Text></TouchableOpacity>
        </View>

        {/* Horizontal Category Filters */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.filterChip, activeCategory === item && styles.filterChipActive]}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={[styles.filterChipText, activeCategory === item && styles.filterChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feed Cards Grid */}
        <View style={styles.feedGrid}>
          {filteredFeed.length === 0 ? (
            <View style={styles.emptyFeedState}>
              <Text style={styles.emptyFeedTitle}>No broadcasts matching filter</Text>
              <Text style={styles.emptyFeedSub}>Try changing the category or check back later.</Text>
            </View>
          ) : (
            filteredFeed.map((item) => {
              const badgeText = getPrimaryBadge(item);
              const { label: actionLabel, isViewAction } = getActionDetails(item.status);

              return (
                <View key={item.id} style={[styles.feedCard, !isMobile && { width: '48%' }]}>
                  <View style={styles.feedCardTop}>
                    <Text style={styles.feedReqId}>{item.id}</Text>
                    {renderBadge(badgeText)}
                  </View>

                  <Text style={styles.feedTitle} numberOfLines={1}>{item.title}</Text>
                  
                  <View style={styles.feedClientRow}>
                    <Building2 size={13} color={MUTED} />
                    <Text style={styles.feedClientText} numberOfLines={1}>
                      {item.businessName} · {item.location}
                    </Text>
                  </View>

                  <Text style={styles.feedDesc} numberOfLines={2}>{item.description}</Text>

                  <View style={styles.feedMetaRow}>
                    <Text style={styles.feedMetaTextVal}>{formatBudget(item.budget)}</Text>
                    <Text style={styles.feedMetaDot}>·</Text>
                    <Text style={styles.feedMetaTextVal}>{item.duration}</Text>
                    <Text style={styles.feedMetaDot}>·</Text>
                    <Text style={styles.feedMetaTextVal}>{formatCategory(item.category)}</Text>
                  </View>

                  <View style={styles.feedCardFooter}>
                    <View style={styles.postedTimeRow}>
                      <Clock size={12} color={MUTED} style={{ marginRight: 4 }} />
                      <Text style={styles.feedPostedText}>Posted {item.postedAt}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.feedActionBtn, isViewAction && styles.feedActionBtnOutline]}
                      onPress={() => {
                        if (isViewAction) {
                          setActivePage('proposals');
                        } else {
                          handleSendProposal(item);
                        }
                      }}
                    >
                      <Text style={[styles.feedActionBtnText, isViewAction && { color: PURPLE }]}>{actionLabel}</Text>
                      <ChevronRight size={13} color={isViewAction ? PURPLE : WHITE} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%', paddingTop: 16 },

  desktopGrid: { flexDirection: 'row', gap: 24 },
  desktopColLeft: { flex: 1 },
  desktopColRight: { flex: 0.65, minWidth: 320 },

  // Hero
  heroCard: { backgroundColor: NAVY, borderRadius: 20, padding: 20, marginBottom: 24, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroGreeting: { fontSize: 14, color: '#CBD5E1', marginBottom: 4 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: WHITE, marginBottom: 2 },
  heroSubtitle: { fontSize: 13, color: '#D4AF37', fontWeight: '600' },
  heroIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  heroDesc: { fontSize: 13, color: '#94A3B8', marginTop: 12, marginBottom: 16, maxWidth: '90%', lineHeight: 20 },

  // Overview
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: MUTED, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  actionLink: { fontSize: 13, fontWeight: 'bold', color: PURPLE },

  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  overviewCard: { backgroundColor: WHITE, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  overviewCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overviewIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overviewCount: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '500' },

  // Needs Attention
  attentionContainer: { backgroundColor: WHITE, borderRadius: 18, padding: 8, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  attentionRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  attentionIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  attentionContent: { flex: 1 },
  attentionTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  attentionContext: { fontSize: 13, color: MUTED, marginBottom: 4 },
  attentionStatus: { fontSize: 12, fontWeight: '600' },
  
  // Generic
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  textActionBtn: { flexDirection: 'row', alignItems: 'center' },
  textActionText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },

  // Schedule
  scheduleBox: { backgroundColor: WHITE, borderRadius: 18, padding: 8, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  scheduleTime: { width: 65, fontSize: 13, fontWeight: 'bold', color: NAVY },
  scheduleIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  scheduleContent: { flex: 1 },
  scheduleTitle: { fontSize: 14, fontWeight: '600', color: NAVY, marginBottom: 2 },
  scheduleBusiness: { fontSize: 12, color: MUTED },

  // Embedded Feed Wall styles
  filtersWrapper: { marginBottom: 16, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  filterList: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  filterChipText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#FFF', fontWeight: 'bold' },

  feedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  feedCard: { width: '100%', backgroundColor: WHITE, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  feedCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  feedReqId: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  priorityBadge: { flexDirection: 'row' },
  priorityBadgeColor: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase' },
  feedTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 6 },
  feedClientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  feedClientText: { fontSize: 13, color: '#64748B', marginLeft: 6, flex: 1 },
  feedDesc: { fontSize: 13, color: MUTED, lineHeight: 18, marginBottom: 12 },
  feedMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  feedMetaTextVal: { fontSize: 12, fontWeight: '600', color: NAVY },
  feedMetaDot: { color: '#CBD5E1', marginHorizontal: 6, fontSize: 12 },
  feedCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  postedTimeRow: { flexDirection: 'row', alignItems: 'center' },
  feedPostedText: { fontSize: 11, color: '#94A3B8' },
  feedActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: PURPLE, paddingHorizontal: 12, height: 32, borderRadius: 8, justifyContent: 'center' },
  feedActionBtnOutline: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  feedActionBtnText: { fontSize: 12, fontWeight: '600', color: '#FFF' },

  emptyFeedState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, width: '100%' },
  emptyFeedTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  emptyFeedSub: { fontSize: 13, color: '#64748B', textAlign: 'center' },
});
