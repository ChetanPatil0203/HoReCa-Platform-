import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import {
  Menu, Search, SlidersHorizontal, Package, Users, Wrench, Megaphone,
  AlertCircle, ShoppingCart, Truck, User, LayoutDashboard,
  ShieldCheck, Tag, Clock, HeadphonesIcon, Bell, ArrowRight,
  Star, MapPin, BadgeCheck, ChevronRight
} from 'lucide-react-native';

const POPULAR_PROVIDERS = [
  {
    id: 1,
    name: "Fresh Farm Suppliers",
    category: "Raw Materials",
    type: "raw-material",
    rating: "4.8",
    reviews: "256",
    distance: "2.1 km away",
    color: "#059669",
    bg: "#F0FDF4",
    icon: Package
  },
  {
    id: 2,
    name: "WorkForce Agency",
    category: "Manpower",
    type: "manpower",
    rating: "4.6",
    reviews: "189",
    distance: "1.8 km away",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: Users
  },
  {
    id: 3,
    name: "QuickFix Services",
    category: "Service Providers",
    type: "service",
    rating: "4.7",
    reviews: "145",
    distance: "1.8 km away",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: Wrench
  },
  {
    id: 4,
    name: "Brand Boost Agency",
    category: "Marketing",
    type: "marketing",
    rating: "4.5",
    reviews: "115",
    distance: "2.7 km away",
    color: "#EA580C",
    bg: "#FFF7ED",
    icon: Megaphone
  }
];

export default function MarketplacePillarsPage({ onNavigate, setMobileMenuOpen }) {

  return (
    <SafeAreaView style={styles.safeArea}>


      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 2. SEARCH BAR */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Search color="#94A3B8" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, services or suppliers..."
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity>
              <SlidersHorizontal color="#64748B" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. MARKETPLACE CATEGORIES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketplace Categories</Text>
          <View style={styles.grid}>

            {/* CARD 1 - RAW MATERIALS */}
            <TouchableOpacity style={[styles.catCard, { borderTopColor: '#059669' }]} onPress={() => onNavigate('raw-material')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <Package color="#059669" size={24} />
                </View>
                <Text style={styles.cardSubtitle}>800+ Suppliers</Text>
              </View>
              <Text style={styles.cardTitle}>Raw Materials</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>Quality raw materials at wholesale prices.</Text>
              <View style={styles.cardCtaContainer}>
                <Text style={[styles.cardCta, { color: '#059669' }]}>Browse Products</Text>
                <ArrowRight size={14} color="#059669" />
              </View>
            </TouchableOpacity>

            {/* CARD 2 - MANPOWER */}
            <TouchableOpacity style={[styles.catCard, { borderTopColor: '#2563EB' }]} onPress={() => onNavigate('manpower')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Users color="#2563EB" size={24} />
                </View>
                <Text style={styles.cardSubtitle}>300+ Agencies</Text>
              </View>
              <Text style={styles.cardTitle}>Manpower</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>Skilled & verified manpower for your business.</Text>
              <View style={styles.cardCtaContainer}>
                <Text style={[styles.cardCta, { color: '#2563EB' }]}>Hire Staff</Text>
                <ArrowRight size={14} color="#2563EB" />
              </View>
            </TouchableOpacity>

            {/* CARD 3 - SERVICE PROVIDERS */}
            <TouchableOpacity style={[styles.catCard, { borderTopColor: '#7C3AED' }]} onPress={() => onNavigate('service')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#F5F3FF' }]}>
                  <Wrench color="#7C3AED" size={24} />
                </View>
                <Text style={styles.cardSubtitle}>200+ Services</Text>
              </View>
              <Text style={styles.cardTitle}>Service Providers</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>Professional services for smooth business operations.</Text>
              <View style={styles.cardCtaContainer}>
                <Text style={[styles.cardCta, { color: '#7C3AED' }]}>Find Providers</Text>
                <ArrowRight size={14} color="#7C3AED" />
              </View>
            </TouchableOpacity>

            {/* CARD 4 - MARKETING */}
            <TouchableOpacity style={[styles.catCard, { borderTopColor: '#EA580C' }]} onPress={() => onNavigate('marketing')}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#FFF7ED' }]}>
                  <Megaphone color="#EA580C" size={24} />
                </View>
                <Text style={styles.cardSubtitle}>150+ Agencies</Text>
              </View>
              <Text style={styles.cardTitle}>Marketing</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>Boost your business with expert marketing agencies.</Text>
              <View style={styles.cardCtaContainer}>
                <Text style={[styles.cardCta, { color: '#EA580C' }]}>Find Agencies</Text>
                <ArrowRight size={14} color="#EA580C" />
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* 6. POPULAR NEAR YOU */}
        <View style={[styles.section, { marginBottom: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight color="#2563EB" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScrollContent}
          >
            {POPULAR_PROVIDERS.map((provider) => {
              const Icon = provider.icon;
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={styles.providerCard}
                  onPress={() => onNavigate(provider.type)}
                >
                  <View style={styles.providerHeader}>
                    <View style={[styles.providerAvatar, { backgroundColor: provider.bg }]}>
                      <Icon color={provider.color} size={22} />
                    </View>
                    <View style={[styles.providerBadge, { backgroundColor: provider.bg }]}>
                      <Text style={[styles.providerBadgeText, { color: provider.color }]}>{provider.category}</Text>
                    </View>
                  </View>

                  <View style={styles.providerNameRow}>
                    <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                    <BadgeCheck color="#059669" size={16} style={{ marginLeft: 6 }} />
                  </View>

                  <View style={styles.providerStats}>
                    <View style={styles.providerStatItem}>
                      <Star color="#EAB308" size={14} fill="#EAB308" />
                      <Text style={styles.providerStatText}>{provider.rating} <Text style={{ color: '#94A3B8' }}>({provider.reviews})</Text></Text>
                    </View>
                    <View style={styles.providerStatDivider} />
                    <View style={styles.providerStatItem}>
                      <MapPin color="#64748B" size={14} />
                      <Text style={styles.providerStatText}>{provider.distance}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.providerBtn} onPress={() => onNavigate(provider.type)}>
                    <Text style={styles.providerBtnText}>View Profile</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

      </ScrollView>

      {/* 7. BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} onPress={() => onNavigate('dashboard')}>
          <LayoutDashboard color="#64748B" size={24} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTabActive} onPress={() => onNavigate('marketplace')}>
          <View style={styles.activeIconWrapper}>
            <ShoppingCart color="#D97706" size={24} />
          </View>
          <Text style={styles.navLabelActive}>Marketplace</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => onNavigate('order-tracking')}>
          <Truck color="#64748B" size={24} />
          <Text style={styles.navLabel}>Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => onNavigate('profile')}>
          <User color="#64748B" size={24} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    minHeight: 90, paddingTop: 40, paddingBottom: 16,
    backgroundColor: '#0A192F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuBtn: {
    padding: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0A192F',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchWrapper: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  catCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  cardCta: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  popularScrollContent: {
    paddingRight: 16,
    gap: 16,
  },
  providerCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  providerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flexShrink: 1,
  },
  providerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  providerStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerStatText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  providerStatDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  providerBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  providerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  navTabActive: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeIconWrapper: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 4,
  }
});

