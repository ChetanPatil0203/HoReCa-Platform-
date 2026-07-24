import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions, SafeAreaView } from 'react-native';
import { ArrowLeft, Search, Star, ShieldCheck, MapPin, Briefcase, SlidersHorizontal, ClipboardCheck } from 'lucide-react-native';

const NAVY = '#0E2042';
const GOLD = '#F59E0B'; // Changed to match HRC HUB primary CTA Gold/Orange
const BLUE = '#2563EB';
const GREEN = '#10B981';

const MOCK_PROVIDERS = [];

export default function BrowseProvidersPage({ onBack, onViewProfile, onSendRequest }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Cleaning', 'Pest Control', 'Plumbing', 'Electrical', 'AC & Refrigeration', 'Maintenance'];

  const filteredProviders = MOCK_PROVIDERS.filter(provider => {
    if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) && !provider.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) && !provider.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory !== 'All' && !provider.categories.includes(activeCategory)) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        
        {/* ── Page Header ── */}
        <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.pageTitle}>Browse Service Providers</Text>
            <Text style={styles.pageSubtitle}>Find trusted service professionals for your business</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

            {/* ── Search & Filters ── */}
            <View style={styles.filtersContainer}>
              <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                  <Search size={18} color="#94A3B8" />
                  <TextInput 
                    style={styles.searchInput}
                    placeholder="Search providers by name, service, or location..."
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

            {/* ── Provider Grid ── */}
            <View style={styles.grid}>
              {filteredProviders.map(provider => {
                const reviewCount = Math.floor(provider.rating * 42); // Dummy reviews
                
                return (
                  <View key={provider.id} style={styles.providerCard}>
                    
                    {/* Top Section */}
                    <View style={styles.cardHeader}>
                      <View style={styles.logoBox}>
                        <Text style={styles.logoText}>{provider.name.charAt(0)}</Text>
                      </View>
                      
                      <View style={styles.headerContent}>
                        <View style={styles.nameRow}>
                          <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                          <View style={styles.ratingBox}>
                            <Star size={12} color={GOLD} fill={GOLD} />
                            <Text style={styles.ratingText}>{provider.rating}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.verifiedLocationRow}>
                          {provider.verified && (
                            <View style={styles.verifiedBadge}>
                              <ShieldCheck size={12} color={BLUE} />
                              <Text style={styles.verifiedText}>Verified Provider</Text>
                            </View>
                          )}
                          <View style={styles.dotSeparator} />
                          <MapPin size={12} color="#64748B" />
                          <Text style={styles.metaText}>{provider.location}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Details Strip */}
                    <View style={styles.detailsStrip}>
                      <View style={styles.detailItem}>
                        <Briefcase size={16} color={NAVY} />
                        <View>
                          <Text style={styles.detailValue}>{provider.experience}</Text>
                          <Text style={styles.detailLabel}>Experience</Text>
                        </View>
                      </View>
                      <View style={styles.detailItem}>
                        <ClipboardCheck size={16} color={NAVY} />
                        <View>
                          <Text style={styles.detailValue}>{provider.jobs}+</Text>
                          <Text style={styles.detailLabel}>Jobs Completed</Text>
                        </View>
                      </View>
                    </View>

                    {/* Service Tags */}
                    <View style={styles.tagsContainer}>
                      {provider.categories.slice(0, 3).map((cat, idx) => (
                        <View key={idx} style={styles.tagChip}>
                          <Text style={styles.tagText}>{cat}</Text>
                        </View>
                      ))}
                      {provider.categories.length > 3 && (
                        <View style={styles.tagChipMore}>
                          <Text style={styles.tagMoreText}>+{provider.categories.length - 3} More</Text>
                        </View>
                      )}
                    </View>

                    {/* Availability */}
                    <View style={styles.availabilityRow}>
                      <View style={[styles.availDot, { backgroundColor: provider.availability === 'Available Today' ? GREEN : GOLD }]} />
                      <Text style={[styles.availText, { color: provider.availability === 'Available Today' ? GREEN : GOLD }]}>{provider.availability}</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.secondaryBtn} onPress={() => onViewProfile(provider)}>
                        <Text style={styles.secondaryBtnText}>View Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequest && onSendRequest(provider)}>
                        <Text style={styles.primaryBtnText}>Send Request</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                );
              })}
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  pageHeaderMobile: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
  pageTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 }, // Sufficient bottom padding for nav
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  filtersContainer: { marginBottom: 24 },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 48 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },
  filterBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  
  categoriesScroll: { flexGrow: 0 },
  categoriesContainer: { paddingRight: 16 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10 },
  categoryPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  categoryPillText: { fontSize: 13, fontWeight: '600', color: NAVY },
  categoryPillTextActive: { color: '#fff' },

  grid: { flexDirection: 'column', gap: 16 },
  
  providerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: 'bold', color: BLUE },
  
  headerContent: { flex: 1, marginLeft: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  providerName: { fontSize: 16, fontWeight: 'bold', color: NAVY, flex: 1, marginRight: 8 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginLeft: 4 },
  
  verifiedLocationRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center' },
  verifiedText: { fontSize: 12, fontWeight: '600', color: BLUE, marginLeft: 4 },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  metaText: { fontSize: 12, color: '#64748B', marginLeft: 4 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  detailsStrip: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  detailLabel: { fontSize: 11, color: '#64748B' },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  tagText: { color: NAVY, fontSize: 12, fontWeight: '500' },
  tagChipMore: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  tagMoreText: { color: BLUE, fontSize: 12, fontWeight: '600' },

  availabilityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  availDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  availText: { fontSize: 12, fontWeight: 'bold' },

  actionsRow: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: NAVY, alignItems: 'center' },
  secondaryBtnText: { color: NAVY, fontSize: 14, fontWeight: 'bold' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
