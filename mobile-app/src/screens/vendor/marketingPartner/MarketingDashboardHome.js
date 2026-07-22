import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { 
  Megaphone, Inbox, Rocket, FileClock, ChevronRight, Sparkles, ShieldCheck, 
  Video, Image as ImageIcon, FileText, Phone, MonitorPlay, Presentation
} from 'lucide-react-native';

const NAVY = '#071B3A';
const PURPLE = '#8B5CF6';
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

const MOCK_OPPORTUNITIES = [
  {
    id: "REQ-101", priority: "HIGH PRIORITY",
    title: "Summer Social Media Launch",
    business: "The Meridian Hotel",
    category: "Social Media Marketing",
    budget: "₹45,000 – ₹60,000",
    duration: "3 Months"
  },
  {
    id: "REQ-102", priority: "NORMAL",
    title: "New Menu Photography & Videography",
    business: "Spice Route Restaurant",
    category: "Content Creation",
    budget: "₹25,000",
    duration: "1 Week"
  }
];

const MOCK_SCHEDULE = [
  { id: "SCH-01", time: "10:30 AM", title: "Client Call", business: "Azure Palace Hotel", icon: Phone },
  { id: "SCH-02", time: "02:00 PM", title: "Creative Review", business: "Spice Route Restaurant", icon: MonitorPlay },
  { id: "SCH-03", time: "04:30 PM", title: "Campaign Presentation", business: "The Meridian Hotel", icon: Presentation }
];

export default function MarketingDashboardHome({ setActivePage, handleSendProposal }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const contentPad = width < 340 ? 12 : (isMobile ? 16 : 24);

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
          <TouchableOpacity style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]} onPress={() => setActivePage('opportunities')}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#F5F3FF'}]}>
                <Megaphone size={18} color={PURPLE} />
              </View>
              <ChevronRight size={16} color={MUTED} />
            </View>
            <Text style={styles.overviewCount}>12</Text>
            <Text style={styles.overviewLabel}>Open Opportunities</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]} onPress={() => setActivePage('requests')}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#EFF6FF'}]}>
                <Inbox size={18} color={BLUE} />
              </View>
              <ChevronRight size={16} color={MUTED} />
            </View>
            <Text style={styles.overviewCount}>4</Text>
            <Text style={styles.overviewLabel}>Direct Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]} onPress={() => setActivePage('campaigns')}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#F0FDF4'}]}>
                <Rocket size={18} color={GREEN} />
              </View>
              <ChevronRight size={16} color={MUTED} />
            </View>
            <Text style={styles.overviewCount}>3</Text>
            <Text style={styles.overviewLabel}>Active Campaigns</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.overviewCard, { width: isMobile ? '48%' : '23.5%' }]} onPress={() => setActivePage('campaigns')}>
            <View style={styles.overviewCardTop}>
              <View style={[styles.overviewIconWrap, {backgroundColor: '#FFFBEB'}]}>
                <FileClock size={18} color={ORANGE} />
              </View>
              <ChevronRight size={16} color={MUTED} />
            </View>
            <Text style={styles.overviewCount}>2</Text>
            <Text style={styles.overviewLabel}>Pending Approvals</Text>
          </TouchableOpacity>
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
            
            {/* 5. Today's Schedule (Reordered logically if side-by-side, but numbers match spec sections) */}
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

        {/* 4. Open Opportunities */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Open Opportunities</Text>
            <Text style={styles.sectionSubtitle}>Marketing requirements matching your services</Text>
          </View>
          <TouchableOpacity onPress={() => setActivePage('opportunities')}><Text style={styles.actionLink}>View Feed Wall &gt;</Text></TouchableOpacity>
        </View>

        <View style={styles.oppsGrid}>
          {MOCK_OPPORTUNITIES.map(req => (
            <TouchableOpacity key={req.id} style={[styles.oppCard, !isMobile && { width: '48%' }]} onPress={() => handleSendProposal(req)}>
              <View style={styles.oppTopRow}>
                <Text style={styles.oppId}>{req.id}</Text>
                {req.priority === 'HIGH PRIORITY' && (
                  <View style={styles.badgeRed}><Text style={styles.badgeRedText}>{req.priority}</Text></View>
                )}
              </View>
              <Text style={styles.oppTitle}>{req.title}</Text>
              <Text style={styles.oppBusiness}>{req.business}</Text>
              
              <Text style={styles.oppCategory}>{req.category}</Text>
              <Text style={styles.oppDetails}>{req.budget} · {req.duration}</Text>
              
              <View style={styles.oppFooter}>
                <Text style={styles.textActionText}>View Opportunity</Text>
                <ChevronRight size={16} color={NAVY} />
              </View>
            </TouchableOpacity>
          ))}
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
  heroBadges: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  badgeGlass: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
  badgeGlassText: { fontSize: 11, fontWeight: 'bold', color: WHITE },
  badgeSolid: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6 },
  dotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  badgeSolidText: { fontSize: 11, fontWeight: 'bold', color: GREEN },

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

  // Open Opportunities
  oppsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  oppCard: { width: '100%', backgroundColor: WHITE, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  oppTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  oppId: { fontSize: 12, fontWeight: '600', color: MUTED },
  badgeRed: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeRedText: { fontSize: 10, fontWeight: 'bold', color: '#DC2626' },
  oppTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  oppBusiness: { fontSize: 14, color: MUTED, marginBottom: 12 },
  oppCategory: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 4 },
  oppDetails: { fontSize: 13, color: MUTED, marginBottom: 16 },
  oppFooter: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
});
