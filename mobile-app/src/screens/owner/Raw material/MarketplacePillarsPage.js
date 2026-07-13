import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Package, Users, Wrench, Megaphone, ArrowRight, ShoppingCart, Star } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const PILLARS = [
  {
    key: "raw-material",
    icon: Package,
    label: "Raw Materials",
    desc: "Manage ingredient procurement, packaging, and supply orders.",
    color: "#D97706",
    bg: "#FFFBEB",
    badge: "800+ Suppliers",
    badgeBg: "#FEF3C7",
    badgeColor: "#D97706",
    stats: ["Same-day delivery", "FSSAI certified"],
  },
  {
    key: "manpower",
    icon: Users,
    label: "Manpower",
    desc: "Hire staff, chefs, waiters, and housekeeping talent.",
    color: "#2563EB",
    bg: "#EFF6FF",
    badge: "300+ Agencies",
    badgeBg: "#DBEAFE",
    badgeColor: "#1D4ED8",
    stats: ["Background verified", "On-demand hiring"],
  },
  {
    key: "service",
    icon: Wrench,
    label: "Service Providers",
    desc: "Connect with deep cleaning, FSSAI compliance, and repair vendors.",
    color: "#059669",
    bg: "#ECFDF5",
    badge: "200+ Services",
    badgeBg: "#D1FAE5",
    badgeColor: "#065F46",
    stats: ["Certified contractors", "Emergency support"],
  },
  {
    key: "marketing",
    icon: Megaphone,
    label: "Marketing",
    desc: "Source local agency setups, ads, and branding services.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    badge: "150+ Agencies",
    badgeBg: "#EDE9FE",
    badgeColor: "#5B21B6",
    stats: ["Social media", "Influencer network"],
  },
];

export default function MarketplacePillarsPage({ onNavigate }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ShoppingCart size={20} color="#1E40AF" />
          <Text style={styles.titleText}>Marketplace</Text>
        </View>
        <Text style={styles.subText}>Select a category to browse suppliers and place orders</Text>
      </View>

      {/* Trust Bar */}
      <View style={styles.trustBar}>
        <View style={styles.starsRow}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
          ))}
        </View>
        <Text style={styles.trustText}>
          <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>1,500+</Text> active HoReCa businesses trust HRCHUB
        </Text>
      </View>

      {/* 2x2 Pillar Grid */}
      <View style={styles.grid}>
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <TouchableOpacity
              key={pillar.key}
              style={styles.card}
              onPress={() => onNavigate(pillar.key)}
            >
              <View style={[styles.accentBar, { backgroundColor: pillar.color }]} />
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: pillar.bg }]}>
                    <Icon size={20} color={pillar.color} />
                  </View>
                  <View style={[styles.badge, { backgroundColor: pillar.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: pillar.badgeColor }]}>{pillar.badge}</Text>
                  </View>
                </View>

                <Text style={styles.cardLabel}>{pillar.label}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{pillar.desc}</Text>

                <View style={styles.statsStrip}>
                  {pillar.stats.map((s) => (
                    <View key={s} style={styles.statLine}>
                      <View style={[styles.statDot, { backgroundColor: pillar.color }]} />
                      <Text style={styles.statText} numberOfLines={1}>{s}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.exploreRow}>
                  <Text style={[styles.exploreText, { color: pillar.color }]}>Explore</Text>
                  <ArrowRight size={12} color={pillar.color} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Stats Strip */}
      <View style={styles.quickStatsRow}>
        {[
          { label: "Active Vendors", value: "1,800+" },
          { label: "Orders Today", value: "340+" },
          { label: "Avg. Rating", value: "4.8 ★" },
        ].map((s) => (
          <View key={s.label} style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>{s.value}</Text>
            <Text style={styles.quickStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  titleText: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  subText: { fontSize: 13, color: '#64748B' },
  
  trustBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginBottom: 16, gap: 8 },
  starsRow: { flexDirection: 'row', gap: 2 },
  trustText: { fontSize: 11, color: '#64748B' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  accentBar: { height: 3, width: '100%' },
  cardContent: { padding: 12, gap: 8, flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 8, fontWeight: 'bold' },
  cardLabel: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  cardDesc: { fontSize: 11, color: '#64748B', lineHeight: 14 },
  statsStrip: { gap: 4, marginTop: 4 },
  statLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statDot: { width: 4, height: 4, borderRadius: 2 },
  statText: { fontSize: 10, color: '#64748B' },
  exploreRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  exploreText: { fontSize: 11, fontWeight: 'bold' },

  quickStatsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 40 },
  quickStatCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, alignItems: 'center' },
  quickStatValue: { fontSize: 14, fontWeight: '800', color: '#1E40AF', marginBottom: 2 },
  quickStatLabel: { fontSize: 10, color: '#94A3B8', textAlign: 'center' }
});
