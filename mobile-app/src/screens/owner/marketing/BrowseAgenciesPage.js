import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Filter, Star, ShieldCheck, MapPin, Briefcase, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_AGENCIES = [];

export default function BrowseAgenciesPage({ onBack, onViewProfile }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Online', 'Offline', 'Verified', 'Top Rated'];

  const filteredAgencies = MOCK_AGENCIES.filter(ag => {
    if (activeFilter === 'Online' && ag.type !== 'Online') return false;
    if (activeFilter === 'Offline' && ag.type !== 'Offline') return false;
    if (activeFilter === 'Verified' && !ag.verified) return false;
    if (activeFilter === 'Top Rated' && ag.rating < 4.8) return false;
    if (searchQuery && !ag.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Browse Agencies</Text>
            <Text style={styles.pageSubtitle}>Find and partner with top marketing agencies</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Search & Filter Bar */}
          <View style={[styles.searchFilterContainer, isMobile && { flexDirection: 'column' }]}>
            <View style={styles.searchBox}>
              <Search size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search agencies by name, service, or location..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={20} color={NAVY} style={{ marginRight: 8 }} />
              <Text style={styles.filterBtnText}>Advanced Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFiltersScroll} contentContainerStyle={{ paddingRight: 16 }}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.quickFilterChip, activeFilter === f && styles.quickFilterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.quickFilterText, activeFilter === f && styles.quickFilterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results Grid */}
          <View style={styles.resultsGrid}>
            {filteredAgencies.map(agency => (
              <View key={agency.id} style={styles.agencyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{agency.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.agencyName} numberOfLines={1}>{agency.name}</Text>
                      {agency.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 6 }} />}
                    </View>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, agency.type === 'Online' ? styles.typeOnline : styles.typeOffline]}>
                        <Text style={[styles.typeBadgeText, agency.type === 'Online' ? styles.typeTextOnline : styles.typeTextOffline]}>{agency.type}</Text>
                      </View>
                      <View style={styles.ratingBox}>
                        <Star size={12} color={GOLD} fill={GOLD} style={{ marginRight: 4 }} />
                        <Text style={styles.ratingText}>{agency.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Briefcase size={16} color="#64748B" style={{ marginBottom: 4 }} />
                    <Text style={styles.statValue}>{agency.projects}</Text>
                    <Text style={styles.statLabel}>Projects</Text>
                  </View>
                  <View style={styles.statBox}>
                    <MapPin size={16} color="#64748B" style={{ marginBottom: 4 }} />
                    <Text style={styles.statValue}>{agency.experience}</Text>
                    <Text style={styles.statLabel}>Experience</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.viewProfileBtn} onPress={() => onViewProfile(agency)}>
                    <Text style={styles.viewProfileText}>View Profile</Text>
                    <ChevronRight size={16} color={NAVY} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {filteredAgencies.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 40, color: '#64748B' }}>No agencies found matching your criteria.</Text>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { paddingHorizontal: 20, paddingVertical: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#64748B' },

  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 32 },

  searchFilterContainer: { flexDirection: 'row', gap: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, height: 48 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A', ...Platform.select({ web: { outlineStyle: 'none' } }) },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 20, height: 48 },
  filterBtnText: { fontSize: 14, fontWeight: '700', color: NAVY },

  quickFiltersScroll: { flexGrow: 0, marginBottom: 8 },
  quickFilterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, marginRight: 12 },
  quickFilterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  quickFilterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  quickFilterTextActive: { color: '#fff' },

  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  agencyCard: { width: '100%', maxWidth: 350, backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, flexGrow: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: '900', color: NAVY },
  headerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  agencyName: { fontSize: 18, fontWeight: '800', color: NAVY, flexShrink: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeOnline: { backgroundColor: '#EFF6FF' },
  typeTextOnline: { color: '#2563EB', fontSize: 11, fontWeight: '700' },
  typeOffline: { backgroundColor: '#FEF2F2' },
  typeTextOffline: { color: '#DC2626', fontSize: 11, fontWeight: '700' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 12, fontWeight: '700', color: GOLD },

  statsRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  statValue: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#64748B' },

  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  viewProfileBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  viewProfileText: { fontSize: 14, fontWeight: '700', color: NAVY, marginRight: 4 }
});
