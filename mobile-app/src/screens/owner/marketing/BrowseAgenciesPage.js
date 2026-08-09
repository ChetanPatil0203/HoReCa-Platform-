import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Filter, Star, ShieldCheck, MapPin, Briefcase, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { fetchMarketingAgencies } from '../../../services/api.service';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

export default function BrowseAgenciesPage({ onBack, onViewProfile }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMarketingAgencies();
        if (res.success) {
          const mapped = res.data.map(v => ({
            id: v.id,
            name: v.bizName || 'Unknown Agency',
            verified: v.status === 'approved',
            type: v.subCategory && v.subCategory.toLowerCase().includes('offline') ? 'Offline' : 'Online',
            rating: 4.8,
            projects: '50+',
            experience: '4+ Years'
          }));
          setAgencies(mapped);
        }
      } catch (err) {
        console.warn('Error fetching marketing agencies:', err);
      }
    };
    load();
  }, []);

  const filters = ['All', 'Online', 'Offline', 'Verified', 'Top Rated'];

  const filteredAgencies = agencies.filter(ag => {
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

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchBox}>
              <Search size={18} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search agencies by name, service, or location..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
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
          <View style={styles.agenciesGrid}>
            {filteredAgencies.map(agency => (
              <View key={agency.id} style={styles.agencyCard}>
                
                {/* Top Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.agencyLogo}>
                    <Text style={styles.agencyLogoText}>{agency.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.cardHeaderCenter}>
                    <View style={styles.nameRow}>
                      <Text style={styles.agencyName} numberOfLines={1}>{agency.name}</Text>
                      {agency.verified && (
                        <View style={styles.verifiedBadge}>
                          <ShieldCheck size={12} color="#16A34A" />
                          <Text style={styles.verifiedText}>Verified Agency</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.ratingLocationRow}>
                      <View style={styles.ratingBox}>
                        <Star size={12} color={GOLD} fill={GOLD} />
                        <Text style={styles.ratingText}>{agency.rating}</Text>
                      </View>
                      <View style={styles.dotSeparator} />
                      <View style={[styles.typeBadge, agency.type === 'Online' ? styles.typeOnline : styles.typeOffline]}>
                        <Text style={[styles.typeBadgeText, agency.type === 'Online' ? styles.typeTextOnline : styles.typeTextOffline]}>{agency.type}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Stats Area */}
                <View style={styles.statsArea}>
                  <View style={styles.statItem}>
                    <Briefcase size={16} color={NAVY} />
                    <Text style={styles.statValue}>{agency.projects} Projects</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MapPin size={16} color={NAVY} />
                    <Text style={styles.statValue}>{agency.experience} Experience</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => onViewProfile(agency)}>
                    <Text style={styles.secondaryBtnText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => onViewProfile(agency)}>
                    <Text style={styles.primaryBtnText}>Send Requirement</Text>
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
  pageHeader: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 14, paddingVertical: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pageTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 12, color: '#64748B' },

  scroll: { flex: 1 },
  contentLayout: { padding: 12, gap: 10 },
  contentLayoutWeb: { padding: 24, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 16 },

  searchSection: { marginBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, height: 38 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  quickFiltersScroll: { flexGrow: 0, marginBottom: 4 },
  quickFilterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  quickFilterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  quickFilterText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  quickFilterTextActive: { color: '#fff' },

  agenciesGrid: { flexDirection: 'column', gap: 10 },
  agencyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  agencyLogo: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  agencyLogoText: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  
  cardHeaderCenter: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 },
  agencyName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginRight: 8 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  verifiedText: { fontSize: 10, fontWeight: 'bold', color: '#16A34A', marginLeft: 4 },
  
  ratingLocationRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B', marginLeft: 4 },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeOnline: { backgroundColor: '#EFF6FF' },
  typeTextOnline: { color: '#2563EB', fontSize: 11, fontWeight: '700' },
  typeOffline: { backgroundColor: '#FEF2F2' },
  typeTextOffline: { color: '#DC2626', fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  statsArea: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },

  actionsRow: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
