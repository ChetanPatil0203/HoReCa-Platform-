import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { 
  Megaphone, RadioTower, Inbox, Mail, Rocket, TrendingUp, BadgeAlert, FileClock,
  ChevronRight, Sparkles, MapPin, CalendarDays, Zap, Clock, ShieldCheck, Play
} from 'lucide-react-native';

const NAVY = '#071B3A';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const MOCK_OPPORTUNITIES = [
  {
    id: "REQ-101", priority: "HIGH PRIORITY",
    title: "Summer Season Social Media Launch",
    business: "The Meridian Hotel",
    category: "Social Media Marketing",
    budget: "₹45,000 – ₹60,000",
    duration: "3 Months", location: "Mumbai"
  },
  {
    id: "REQ-102", priority: "NORMAL",
    title: "New Menu Photography & Videography",
    business: "Spice Route Restaurant",
    category: "Content Creation",
    budget: "₹25,000",
    duration: "1 Week", location: "Pune"
  }
];

const MOCK_CAMPAIGNS = [
  {
    id: "CAMP-01", title: "July Social Media Promotion",
    business: "Azure Palace Hotel", category: "Social Media Marketing",
    progress: 65, currentStage: "Content Publishing", nextMilestone: "Client Performance Review",
    due: "25 Jul 2026"
  },
  {
    id: "CAMP-02", title: "Autumn Menu Launch Strategy",
    business: "The Meridian Hotel", category: "Branding",
    progress: 15, currentStage: "Initial Research", nextMilestone: "Concept Presentation",
    due: "15 Aug 2026"
  }
];

const MOCK_APPROVALS = [
  {
    id: "APP-01", title: "Video Ad Draft v2",
    business: "Spice Route Restaurant", campaign: "Summer Promotion Campaign",
    type: "Creative Review", submitted: "Submitted 2 hours ago"
  },
  {
    id: "APP-02", title: "Instagram Carousel Drafts",
    business: "Azure Palace Hotel", campaign: "July Social Media Promotion",
    type: "Content Review", submitted: "Submitted Yesterday"
  }
];

const MOCK_SCHEDULE = [
  { id: "SCH-01", time: "10:30 AM", title: "Client Call", business: "Azure Palace Hotel" },
  { id: "SCH-02", time: "02:00 PM", title: "Creative Review", business: "Spice Route Restaurant" },
  { id: "SCH-03", time: "04:30 PM", title: "Campaign Presentation", business: "The Meridian Hotel" }
];

export default function MarketingDashboardHome({ setActivePage, handleSendProposal }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const renderHeader = () => (
    <View style={styles.contentPad}>
      {/* Welcome Hero */}
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
          Manage marketing opportunities, campaigns and client approvals from one place.
        </Text>

        <View style={styles.heroBadges}>
          <View style={styles.badgeGlass}>
            <ShieldCheck size={12} color="#D4AF37" />
            <Text style={styles.badgeGlassText}>Verified Agency</Text>
          </View>
          <View style={styles.badgeSolid}>
            <View style={styles.dotGreen} />
            <Text style={styles.badgeSolidText}>Available for Projects</Text>
          </View>
        </View>
      </View>

      {/* Overview Section */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.overviewGrid}>
        
        <TouchableOpacity style={styles.overviewCard} onPress={() => {}}>
          <View style={styles.overviewCardTop}>
            <View style={[styles.overviewIconWrap, {backgroundColor: '#F5F3FF'}]}>
              <RadioTower size={18} color={PURPLE} />
            </View>
            <ChevronRight size={16} color={MUTED} />
          </View>
          <Text style={styles.overviewCount}>12</Text>
          <Text style={styles.overviewLabel}>Open Opportunities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.overviewCard} onPress={() => setActivePage('requests')}>
          <View style={styles.overviewCardTop}>
            <View style={[styles.overviewIconWrap, {backgroundColor: '#EFF6FF'}]}>
              <Inbox size={18} color={BLUE} />
            </View>
            <ChevronRight size={16} color={MUTED} />
          </View>
          <Text style={styles.overviewCount}>4</Text>
          <Text style={styles.overviewLabel}>Direct Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.overviewCard} onPress={() => setActivePage('campaigns')}>
          <View style={styles.overviewCardTop}>
            <View style={[styles.overviewIconWrap, {backgroundColor: '#F0FDF4'}]}>
              <Rocket size={18} color={GREEN} />
            </View>
            <ChevronRight size={16} color={MUTED} />
          </View>
          <Text style={styles.overviewCount}>3</Text>
          <Text style={styles.overviewLabel}>Active Campaigns</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.overviewCard} onPress={() => setActivePage('campaigns')}>
          <View style={styles.overviewCardTop}>
            <View style={[styles.overviewIconWrap, {backgroundColor: '#FFFBEB'}]}>
              <BadgeAlert size={18} color={ORANGE} />
            </View>
            <ChevronRight size={16} color={MUTED} />
          </View>
          <Text style={styles.overviewCount}>2</Text>
          <Text style={styles.overviewLabel}>Pending Approvals</Text>
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}

        {/* Desktop grid layout for sections */}
        <View style={!isMobile && styles.desktopRow}>
          
          <View style={!isMobile && styles.desktopCol}>
            {/* Open Marketing Opportunities */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Open Marketing Opportunities</Text>
                <Text style={styles.sectionSubtitle}>Campaign requirements matching your agency services</Text>
              </View>
              <TouchableOpacity><Text style={styles.actionLink}>View Feed Wall &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.contentPadX}>
              {MOCK_OPPORTUNITIES.map(req => (
                <TouchableOpacity key={req.id} style={styles.card} onPress={() => handleSendProposal(req)}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.reqId}>{req.id}</Text>
                    {req.priority === 'HIGH PRIORITY' && (
                      <View style={styles.badgeRed}><Text style={styles.badgeRedText}>{req.priority}</Text></View>
                    )}
                  </View>
                  <Text style={styles.reqTitle}>{req.title}</Text>
                  <Text style={styles.reqBusiness}>{req.business}</Text>
                  
                  <View style={styles.reqMetaRow}>
                    <Megaphone size={14} color={MUTED} style={styles.metaIcon} />
                    <Text style={styles.reqMetaText}>{req.category}</Text>
                  </View>
                  
                  <View style={styles.reqMetaGrid}>
                    <View style={styles.reqMetaCol}>
                      <Text style={styles.reqMetaLabel}>Budget</Text>
                      <Text style={styles.reqMetaValue}>{req.budget}</Text>
                    </View>
                    <View style={styles.reqMetaCol}>
                      <Text style={styles.reqMetaLabel}>Duration</Text>
                      <Text style={styles.reqMetaValue}>{req.duration}</Text>
                    </View>
                    <View style={styles.reqMetaCol}>
                      <Text style={styles.reqMetaLabel}>Location</Text>
                      <Text style={styles.reqMetaValue}>{req.location}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.textActionBtn}>
                      <Text style={styles.textActionText}>View Opportunity</Text>
                      <ChevronRight size={16} color={NAVY} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Active Campaigns */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Active Campaigns</Text>
                <Text style={styles.sectionSubtitle}>Campaigns currently being managed by your agency</Text>
              </View>
              <TouchableOpacity onPress={() => setActivePage('campaigns')}><Text style={styles.actionLink}>View All &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.contentPadX}>
              {MOCK_CAMPAIGNS.map(camp => (
                <TouchableOpacity key={camp.id} style={styles.card} onPress={() => setActivePage('campaigns')}>
                  <Text style={styles.campTitle}>{camp.title}</Text>
                  <Text style={styles.campBusiness}>{camp.business}</Text>
                  
                  <View style={styles.campCategoryRow}>
                    <View style={styles.campCategoryBadge}><Text style={styles.campCategoryText}>{camp.category}</Text></View>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>{camp.progress}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, {width: `${camp.progress}%`}]} />
                    </View>
                  </View>

                  <View style={styles.campMetaGrid}>
                    <View style={styles.campMetaRow}>
                      <Text style={styles.campMetaLabel}>Current Stage:</Text>
                      <Text style={styles.campMetaValue}>{camp.currentStage}</Text>
                    </View>
                    <View style={styles.campMetaRow}>
                      <Text style={styles.campMetaLabel}>Next Milestone:</Text>
                      <Text style={styles.campMetaValue}>{camp.nextMilestone}</Text>
                    </View>
                    <View style={styles.campMetaRow}>
                      <Text style={styles.campMetaLabel}>Due:</Text>
                      <Text style={styles.campMetaValue}>{camp.due}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.textActionBtn}>
                      <Text style={styles.textActionText}>View Campaign</Text>
                      <ChevronRight size={16} color={NAVY} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={!isMobile && styles.desktopCol}>
            {/* Pending Client Approvals */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Pending Client Approvals</Text>
                <Text style={styles.sectionSubtitle}>Creative work waiting for client review</Text>
              </View>
              <TouchableOpacity onPress={() => setActivePage('campaigns')}><Text style={styles.actionLink}>View All &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.contentPadX}>
              {MOCK_APPROVALS.map(app => (
                <TouchableOpacity key={app.id} style={styles.cardRow} onPress={() => setActivePage('campaigns')}>
                  <View style={styles.cardRowLeft}>
                    <Text style={styles.appTitle}>{app.title}</Text>
                    <Text style={styles.appBusiness}>{app.business}</Text>
                    <Text style={styles.appCampaign}>{app.campaign} · {app.type}</Text>
                    <Text style={styles.appSubmitted}>{app.submitted}</Text>
                  </View>
                  <View style={styles.cardRowRight}>
                    <View style={styles.badgeOrange}><Text style={styles.badgeOrangeText}>Pending Client Approval</Text></View>
                    <View style={[styles.textActionBtn, {marginTop: 12}]}>
                      <Text style={[styles.textActionText, {fontSize: 12}]}>Review Details</Text>
                      <ChevronRight size={14} color={NAVY} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Today's Schedule */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <TouchableOpacity><Text style={styles.actionLink}>View All &gt;</Text></TouchableOpacity>
            </View>

            <View style={styles.contentPadX}>
              <View style={styles.scheduleBox}>
                {MOCK_SCHEDULE.map((sch, i) => (
                  <TouchableOpacity key={sch.id} style={[styles.scheduleRow, i !== MOCK_SCHEDULE.length - 1 && styles.borderBottom]}>
                    <View style={styles.scheduleTimeBox}>
                      <Text style={styles.scheduleTime}>{sch.time}</Text>
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
          
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 115, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  contentPad: { paddingHorizontal: 16 },
  contentPadX: { paddingHorizontal: 16 },

  desktopRow: { flexDirection: 'row', gap: 24, paddingHorizontal: 16 },
  desktopCol: { flex: 1 },

  // Hero
  heroCard: { backgroundColor: NAVY, borderRadius: 20, padding: 20, marginTop: 16, marginBottom: 24, overflow: 'hidden' },
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
  sectionSubtitle: { fontSize: 12, color: MUTED, marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 4 },
  actionLink: { fontSize: 13, fontWeight: 'bold', color: PURPLE },

  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  overviewCard: { width: '48%', backgroundColor: WHITE, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  overviewCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overviewIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overviewCount: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '500' },

  // Cards Generic
  card: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'flex-start' },
  textActionBtn: { flexDirection: 'row', alignItems: 'center' },
  textActionText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  
  // Feed Cards
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reqId: { fontSize: 12, fontWeight: 'bold', color: MUTED },
  badgeRed: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeRedText: { fontSize: 10, fontWeight: 'bold', color: '#DC2626' },
  reqTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  reqBusiness: { fontSize: 14, color: MUTED, marginBottom: 12 },
  reqMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaIcon: { marginRight: 6 },
  reqMetaText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  reqMetaGrid: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, gap: 12 },
  reqMetaCol: { flex: 1 },
  reqMetaLabel: { fontSize: 11, color: MUTED, marginBottom: 4 },
  reqMetaValue: { fontSize: 13, fontWeight: 'bold', color: NAVY },

  // Campaign Cards
  campTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  campBusiness: { fontSize: 13, color: MUTED, marginBottom: 8 },
  campCategoryRow: { flexDirection: 'row', marginBottom: 16 },
  campCategoryBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  campCategoryText: { fontSize: 11, color: MUTED, fontWeight: '600' },
  
  progressSection: { marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: NAVY },
  progressValue: { fontSize: 12, fontWeight: 'bold', color: GREEN },
  progressBarBg: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: GREEN, borderRadius: 3 },

  campMetaGrid: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, gap: 8 },
  campMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campMetaLabel: { fontSize: 12, color: MUTED },
  campMetaValue: { fontSize: 12, fontWeight: '600', color: NAVY },

  // Approval Row Cards
  cardRow: { flexDirection: 'row', backgroundColor: WHITE, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  cardRowLeft: { flex: 1, paddingRight: 12 },
  appTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  appBusiness: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 2 },
  appCampaign: { fontSize: 12, color: MUTED, marginBottom: 6 },
  appSubmitted: { fontSize: 11, color: MUTED, fontStyle: 'italic' },
  cardRowRight: { alignItems: 'flex-end', justifyContent: 'center' },
  badgeOrange: { backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  badgeOrangeText: { fontSize: 10, fontWeight: 'bold', color: ORANGE },

  // Schedule
  scheduleBox: { backgroundColor: WHITE, borderRadius: 16, padding: 8, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  scheduleTimeBox: { width: 70 },
  scheduleTime: { fontSize: 13, fontWeight: 'bold', color: NAVY },
  scheduleContent: { flex: 1, paddingHorizontal: 12 },
  scheduleTitle: { fontSize: 14, fontWeight: '600', color: NAVY, marginBottom: 2 },
  scheduleBusiness: { fontSize: 12, color: MUTED },
});
