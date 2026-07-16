import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Star, ShieldCheck, SlidersHorizontal, MapPin, Users, Briefcase } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { TOP_AGENCIES } from '../../../constants/manpowerData';

const GOLD = '#D97706';
const BLUE = '#2563EB';

const FILTERS = ['All', 'Verified', 'Top Rated', 'Near Me', 'Immediate Replacement'];

export default function BrowseAgenciesPage({ onBack, onViewAgency }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAgencies = TOP_AGENCIES.filter(ag => {
    if (searchQuery && !ag.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'Verified' && !ag.verified) return false;
    if (activeFilter === 'Top Rated' && ag.rating < 4.5) return false;
    return true;
  });

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Browse Agencies</Text>
          <Text style={styles.headerSub}>Find the best manpower partners</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Search & Filters ── */}
          <View style={styles.searchSection}>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Search agencies by name or location..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <SlidersHorizontal size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={{ paddingRight: 16 }}>
              {FILTERS.map(f => (
                <TouchableOpacity 
                  key={f} 
                  style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f)}
                >
                  <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Agencies Grid ── */}
          <View style={[styles.agenciesGrid, isMobile && { flexWrap: 'wrap' }]}>
            {filteredAgencies.map(agency => (
              <View key={agency.id} style={[styles.agencyCard, isMobile ? { flex: 1, minWidth: 160, padding: 16 } : { width: '48%' }]}>
                
                <View style={styles.cardHeader}>
                  <View style={styles.agencyLogo}>
                    <Text style={styles.agencyLogoText}>{agency.logo}</Text>
                  </View>
                  <View style={styles.cardHeaderRight}>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color={GOLD} fill={GOLD} />
                      <Text style={styles.ratingText}>{agency.rating}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.nameRow}>
                  <Text style={styles.agencyName}>{agency.name}</Text>
                  {agency.verified && <ShieldCheck size={16} color="#16A34A" style={{ marginLeft: 6 }} />}
                </View>
                
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.locationText}>{agency.location}</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Briefcase size={16} color="#64748B" />
                    <View>
                      <Text style={styles.statLabel}>Experience</Text>
                      <Text style={styles.statValue}>{agency.experience}</Text>
                    </View>
                  </View>
                  <View style={styles.statBox}>
                    <Users size={16} color="#64748B" />
                    <View>
                      <Text style={styles.statLabel}>Available</Text>
                      <Text style={styles.statValue}>{agency.availableStaff} Staff</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.policyBox}>
                  <Text style={styles.policyLabel}>Replacement Policy:</Text>
                  <Text style={styles.policyValue}>{agency.replacementPolicy}</Text>
                </View>

                <TouchableOpacity style={styles.viewBtn} onPress={() => onViewAgency(agency)}>
                  <Text style={styles.viewBtnText}>View Agency</Text>
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
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '600' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%' },

  searchSection: { marginBottom: 24 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, height: 48 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0F172A', outlineStyle: 'none' },
  filterBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  
  filtersScroll: { flexGrow: 0 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  filterChipActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#fff' },

  agenciesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  agencyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  agencyLogo: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  agencyLogoText: { fontSize: 24, fontWeight: '900', color: BLUE },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 13, fontWeight: '700', color: GOLD, marginLeft: 4 },

  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  agencyName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  locationText: { fontSize: 13, color: '#64748B', marginLeft: 4 },

  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
  statLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  policyBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16 },
  policyLabel: { fontSize: 13, color: '#64748B' },
  policyValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  viewBtn: { backgroundColor: BLUE, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  viewBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' }
});
