import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { ArrowLeft, Search, Star, ShieldCheck, SlidersHorizontal, MapPin, Users, Briefcase } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { TOP_AGENCIES } from '../../../constants/manpowerData';

const NAVY = '#081A3A';
const GOLD = '#F59E0B'; // HRC HUB Gold/Orange accent
const BLUE = '#2563EB';

const FILTERS = ['All', 'Verified', 'Top Rated', 'Nearby'];

export default function BrowseAgenciesPage({ onBack, onViewAgency, onSendRequirement }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAgencies = TOP_AGENCIES.filter(ag => {
    if (searchQuery && !ag.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'Verified' && !ag.verified) return false;
    if (activeFilter === 'Top Rated' && ag.rating < 4.5) return false;
    // Mock logic for Nearby
    return true;
  });

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Browse Manpower Agencies</Text>
          <Text style={styles.headerSub}>Find verified staffing partners for your business</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* ── Search & Filters ── */}
          <View style={styles.searchSection}>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Search size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Search agencies by name, location, or role..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <SlidersHorizontal size={20} color={NAVY} />
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

          {/* ── Agencies List ── */}
          <View style={styles.agenciesGrid}>
            {filteredAgencies.map(agency => {
              // Mocking specific premium data for display
              const roles = agency.roles || ['Chef', 'Waiter', 'Housekeeping'];
              const availability = agency.availability || 'Available Now';
              const reviewCount = Math.floor(agency.rating * 20);

              return (
                <View key={agency.id} style={styles.agencyCard}>
                  
                  {/* Top Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.agencyLogo}>
                      <Text style={styles.agencyLogoText}>{agency.logo}</Text>
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
                          <Text style={styles.reviewCountText}>({reviewCount})</Text>
                        </View>
                        <View style={styles.dotSeparator} />
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.locationText}>{agency.location}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Stats Area */}
                  <View style={styles.statsArea}>
                    <View style={styles.statItem}>
                      <Briefcase size={16} color={NAVY} />
                      <Text style={styles.statValue}>{agency.experience} Experience</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Users size={16} color={NAVY} />
                      <Text style={styles.statValue}>{agency.availableStaff} Available Staff</Text>
                    </View>
                  </View>

                  {/* Roles */}
                  <View style={styles.rolesArea}>
                    {roles.slice(0, 3).map((r, i) => (
                      <React.Fragment key={i}>
                        <Text style={styles.roleText}>{r}</Text>
                        {i < roles.slice(0, 3).length - 1 && <Text style={styles.roleBullet}>•</Text>}
                      </React.Fragment>
                    ))}
                    {roles.length > 3 && <Text style={styles.roleMoreText}>+{roles.length - 3} More</Text>}
                  </View>

                  {/* Availability */}
                  <View style={styles.availabilityRow}>
                    <View style={[styles.availDot, { backgroundColor: availability === 'Available Now' ? '#10B981' : '#F59E0B' }]} />
                    <Text style={[styles.availText, { color: availability === 'Available Now' ? '#10B981' : '#F59E0B' }]}>{availability}</Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => onViewAgency(agency)}>
                      <Text style={styles.secondaryBtnText}>View Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequirement && onSendRequirement(agency)}>
                      <Text style={styles.primaryBtnText}>Send Requirement</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              );
            })}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  topBarMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  headerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 }, // Ensure bottom padding for nav
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  searchSection: { marginBottom: 24 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 48 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },
  filterBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  
  filtersScroll: { flexGrow: 0 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10 },
  filterChipActive: { backgroundColor: NAVY },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#fff' },

  agenciesGrid: { flexDirection: 'column', gap: 16 },
  agencyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  agencyLogo: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  agencyLogoText: { fontSize: 20, fontWeight: 'bold', color: BLUE },
  
  cardHeaderCenter: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 },
  agencyName: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginRight: 8 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  verifiedText: { fontSize: 10, fontWeight: 'bold', color: '#16A34A', marginLeft: 4 },
  
  ratingLocationRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B', marginLeft: 4 },
  reviewCountText: { fontSize: 11, color: '#64748B', marginLeft: 2 },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  locationText: { fontSize: 12, color: '#64748B', marginLeft: 4 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  statsArea: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },

  rolesArea: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 },
  roleText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  roleBullet: { fontSize: 13, color: '#94A3B8', marginHorizontal: 6 },
  roleMoreText: { fontSize: 12, color: BLUE, fontWeight: 'bold', marginLeft: 6 },

  availabilityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  availDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  availText: { fontSize: 12, fontWeight: 'bold' },

  actionsRow: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: GOLD, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
