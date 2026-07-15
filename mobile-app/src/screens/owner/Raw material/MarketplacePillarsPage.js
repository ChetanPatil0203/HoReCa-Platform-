import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, Platform } from 'react-native';
import { Package, Users, Wrench, Megaphone, Search, ArrowRight, Star, Clock, Heart, ShieldCheck, ChevronRight, CheckCircle } from 'lucide-react-native';

const PILLARS = [
  {
    key: "raw-material",
    icon: Package,
    label: "Raw Materials",
    desc: "Manage ingredient procurement, packaging, and supply orders.",
    color: "#D97706",
    bg: "#FFFBEB",
    badge: "800+ Suppliers",
    stats: ["Same-day delivery", "FSSAI certified"],
    cta: "Browse Products"
  },
  {
    key: "manpower",
    icon: Users,
    label: "Manpower",
    desc: "Hire staff, chefs, waiters, and housekeeping talent.",
    color: "#2563EB",
    bg: "#EFF6FF",
    badge: "300+ Agencies",
    stats: ["Background verified", "On-demand hiring"],
    cta: "Explore Manpower"
  },
  {
    key: "service",
    icon: Wrench,
    label: "Service Providers",
    desc: "Connect with deep cleaning, compliance, and repair vendors.",
    color: "#059669",
    bg: "#ECFDF5",
    badge: "200+ Services",
    stats: ["Certified contractors", "Emergency support"],
    cta: "Explore Services"
  },
  {
    key: "marketing",
    icon: Megaphone,
    label: "Marketing",
    desc: "Source local agency setups, ads, and branding services.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    badge: "150+ Agencies",
    stats: ["Social media", "Influencer network"],
    cta: "Explore Marketing"
  },
];

const RECENTLY_USED = [
  { label: "Fresh Dairy", icon: Package, color: "#D97706", bg: "#FFFBEB" },
  { label: "Deep Clean", icon: Wrench, color: "#059669", bg: "#ECFDF5" },
  { label: "Wait Staff", icon: Users, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Promo Ads", icon: Megaphone, color: "#7C3AED", bg: "#F5F3FF" },
];

const RECOMMENDED = [
  { title: "Premium Exec Chefs", subtitle: "Top rated manpower", badge: "Manpower" },
  { title: "FSSAI Consultants", subtitle: "Certified legal aid", badge: "Service" },
  { title: "Organic Veggies", subtitle: "Farm-to-table", badge: "Raw Material" },
];

export default function MarketplacePillarsPage({ onNavigate }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 360;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#64748B" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search products, agencies or services..." 
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Everything your HoReCa business needs</Text>
        <Text style={styles.heroSub}>Raw materials, trained staff, trusted services and marketing agencies in one place.</Text>
      </View>

      {/* Recently Used */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recently Used</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
          {RECENTLY_USED.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={idx} style={styles.recentItem}>
                <View style={[styles.recentIconBox, { backgroundColor: item.bg }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={styles.recentLabel} numberOfLines={1}>{item.label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Urgent Requirement Banner */}
      <View style={styles.urgentBanner}>
        <View style={{flex: 1}}>
          <Text style={styles.urgentTitle}>Urgent Requirement?</Text>
          <Text style={styles.urgentSub}>Need staff, a service or marketing support urgently?</Text>
        </View>
        <TouchableOpacity style={styles.urgentBtn}>
          <Text style={styles.urgentBtnText}>Post Now</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Marketplace Categories</Text>
        <View style={styles.grid}>
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <TouchableOpacity
                key={pillar.key}
                activeOpacity={0.85}
                style={[styles.card, isNarrow && { width: '100%' }]}
                onPress={() => onNavigate(pillar.key)}
              >
                <View style={[styles.accentBar, { backgroundColor: pillar.color }]} />
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconAndLabel}>
                      <View style={[styles.iconBox, { backgroundColor: pillar.bg }]}>
                        <Icon size={22} color={pillar.color} />
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>{pillar.label}</Text>
                        <Text style={styles.badgeText}>{pillar.badge}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.cardDesc} numberOfLines={2}>{pillar.desc}</Text>

                  <View style={styles.statsStrip}>
                    {pillar.stats.map((s, idx) => (
                      <View key={idx} style={styles.statLine}>
                        <CheckCircle size={12} color={pillar.color} />
                        <Text style={styles.statText} numberOfLines={1}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={[styles.ctaButton, { backgroundColor: pillar.bg }]}>
                  <Text style={[styles.ctaText, { color: pillar.color }]}>{pillar.cta}</Text>
                  <ArrowRight size={14} color={pillar.color} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Recommended For You */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendScroll}>
          {RECOMMENDED.map((rec, idx) => (
            <TouchableOpacity key={idx} style={styles.recommendCard}>
              <Text style={styles.recBadge}>{rec.badge}</Text>
              <Text style={styles.recTitle} numberOfLines={1}>{rec.title}</Text>
              <Text style={styles.recSub} numberOfLines={1}>{rec.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trust Strip */}
      <View style={styles.trustStrip}>
        <ShieldCheck size={18} color="#059669" />
        <Text style={styles.trustStripText}>
          <Text style={styles.trustBold}>1,800+</Text> Verified Vendors  •  <Text style={styles.trustBold}>340+</Text> Daily Orders  •  <Text style={styles.trustBold}>4.8</Text> Avg Rating
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 16, marginTop: 12, marginBottom: 16,
    paddingHorizontal: 12, height: 44, borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },

  heroBanner: {
    backgroundColor: '#081A3A', marginHorizontal: 16, padding: 20, borderRadius: 16,
    marginBottom: 24,
  },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8, lineHeight: 24 },
  heroSub: { color: '#B8C6E3', fontSize: 13, lineHeight: 18 },

  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginLeft: 16, marginBottom: 12 },

  recentScroll: { paddingHorizontal: 16, gap: 16 },
  recentItem: { alignItems: 'center', width: 68 },
  recentIconBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  recentLabel: { fontSize: 11, color: '#475569', textAlign: 'center', fontWeight: '500' },

  urgentBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2',
    marginHorizontal: 16, padding: 16, borderRadius: 12, marginBottom: 24,
    borderWidth: 1, borderColor: '#FECACA'
  },
  urgentTitle: { fontSize: 14, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 },
  urgentSub: { fontSize: 12, color: '#B91C1C', paddingRight: 8 },
  urgentBtn: {
    backgroundColor: '#DC2626', paddingHorizontal: 12, height: 36,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center'
  },
  urgentBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, gap: 12 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  accentBar: { height: 4, width: '100%' },
  cardContent: { padding: 14, gap: 10, flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconAndLabel: { flexDirection: 'column', gap: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 2 },
  
  cardDesc: { fontSize: 12, color: '#475569', lineHeight: 16 },
  statsStrip: { gap: 6, marginTop: 4 },
  statLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 11, color: '#334155' },
  
  ctaButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    gap: 6, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)'
  },
  ctaText: { fontSize: 13, fontWeight: 'bold' },

  recommendScroll: { paddingHorizontal: 16, gap: 12 },
  recommendCard: { 
    width: 160, backgroundColor: '#fff', padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  recBadge: { fontSize: 9, fontWeight: 'bold', color: '#D4AF37', textTransform: 'uppercase', marginBottom: 6 },
  recTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  recSub: { fontSize: 11, color: '#64748B' },

  trustStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ECFDF5', marginHorizontal: 16, paddingVertical: 12, paddingHorizontal: 8,
    borderRadius: 8, borderWidth: 1, borderColor: '#A7F3D0', gap: 8
  },
  trustStripText: { fontSize: 10, color: '#065F46' },
  trustBold: { fontWeight: 'bold' }
});
