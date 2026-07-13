import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Star, ShieldCheck, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_PROVIDERS = [
  { id: 'PRV-001', name: 'SafeGuard Solutions', rating: 4.9, experience: '8 Years', jobs: 450, verified: true, location: 'Downtown', categories: ['Pest Control', 'Cleaning'] },
  { id: 'PRV-002', name: 'ProClean Services', rating: 4.8, experience: '5 Years', jobs: 320, verified: true, location: 'North Side', categories: ['Deep Cleaning', 'Sanitization'] },
  { id: 'PRV-003', name: 'Elite Fixers', rating: 5.0, experience: '12 Years', jobs: 890, verified: true, location: 'West End', categories: ['General Repair', 'Plumbing'] },
  { id: 'PRV-004', name: 'CoolBreeze HVAC', rating: 4.7, experience: '6 Years', jobs: 210, verified: false, location: 'South Side', categories: ['HVAC', 'Maintenance'] },
  { id: 'PRV-005', name: 'Spark Electricals', rating: 4.5, experience: '3 Years', jobs: 150, verified: true, location: 'Downtown', categories: ['Electrical', 'Lighting'] }
];

export default function BrowseProvidersPage({ onBack, onViewProfile }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Cleaning', 'Pest Control', 'Plumbing', 'HVAC', 'Electrical'];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Browse Providers</Text>
          <Text style={styles.pageSubtitle}>Find trusted service providers for your business</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Search and Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Search size={20} color="#64748B" style={styles.searchIcon} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Search providers by name or service..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <SlidersHorizontal size={20} color={NAVY} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContainer}>
              {categories.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryPillText, activeCategory === cat && styles.categoryPillTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Provider Grid */}
          <View style={[styles.grid, isMobile && styles.gridMobile]}>
            {MOCK_PROVIDERS.map(provider => (
              <View key={provider.id} style={styles.providerCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.logoBox}>
                    <Text style={styles.logoText}>{provider.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Star size={14} color={GOLD} fill={GOLD} />
                    <Text style={styles.ratingText}>{provider.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.nameRow}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  {provider.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 4 }} />}
                </View>
                
                <View style={styles.metaRow}>
                  <MapPin size={14} color="#64748B" style={styles.metaIcon} />
                  <Text style={styles.metaText}>{provider.location}</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Briefcase size={14} color="#64748B" style={styles.statIcon} />
                    <Text style={styles.statText}>{provider.experience}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={[styles.statText, { fontWeight: '700', color: NAVY }]}>{provider.jobs}</Text>
                    <Text style={styles.statText}> Jobs</Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {provider.categories.map((cat, idx) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{cat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.viewProfileBtn} onPress={() => onViewProfile(provider)}>
                  <Text style={styles.viewProfileBtnText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 32 },

  filtersContainer: { gap: 16 },
  searchRow: { flexDirection: 'row', gap: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, height: 52 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A', outlineStyle: 'none' },
  filterBtn: { width: 52, height: 52, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  categoriesScroll: { overflow: 'visible' },
  categoriesContainer: { gap: 12, paddingRight: 20 },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  categoryPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  categoryPillText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  categoryPillTextActive: { color: '#fff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  gridMobile: { flexDirection: 'column' },
  providerCard: { flex: 1, minWidth: 280, maxWidth: 350, backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  logoBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 24, fontWeight: '900', color: NAVY },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 13, fontWeight: '700', color: GOLD, marginLeft: 6 },
  
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  providerName: { fontSize: 18, fontWeight: '800', color: NAVY },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  metaIcon: { marginRight: 6 },
  metaText: { fontSize: 13, color: '#64748B' },

  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 16 },
  statBox: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  statIcon: { marginRight: 6 },
  statText: { fontSize: 13, color: '#475569' },
  statDivider: { width: 1, height: 20, backgroundColor: colors.border },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#F1F5F9', borderRadius: 6 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#64748B' },

  viewProfileBtn: { paddingVertical: 12, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: NAVY, alignItems: 'center' },
  viewProfileBtnText: { fontSize: 14, fontWeight: '700', color: NAVY }
});
