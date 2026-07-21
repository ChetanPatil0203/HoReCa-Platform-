import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, SafeAreaView } from 'react-native';
import { ArrowLeft, ShieldCheck, Star, MapPin, Users, Briefcase, Clock, Phone, Mail } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#081A3A';
const GOLD = '#F59E0B'; 
const BLUE = '#2563EB';
const GREEN = '#10B981';

export default function AgencyProfilePage({ agency, onBack, onSendRequirement, onViewAvailableStaff }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  if (!agency) return null;

  // Mock roles if none provided
  const roles = agency.roles || ['Chef', 'Waiter', 'Housekeeping', 'Kitchen Staff', 'Security', 'Helper'];
  const reviewCount = Math.floor(agency.rating * 53); // Dummy count

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agency Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

            {/* ── Premium Agency Hero ── */}
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View style={styles.heroLogo}>
                  <Text style={styles.heroLogoText}>{agency.logo}</Text>
                </View>
                <View style={styles.heroDetails}>
                  <View style={styles.heroNameRow}>
                    <Text style={styles.heroAgencyName} numberOfLines={1}>{agency.name}</Text>
                    {agency.verified && <ShieldCheck size={16} color="#3B82F6" style={{ marginLeft: 6 }} />}
                  </View>
                  <View style={styles.heroLocationRow}>
                    <MapPin size={12} color="#94A3B8" />
                    <Text style={styles.heroLocationText}>{agency.location}</Text>
                  </View>
                  <View style={styles.heroAvailRow}>
                    <View style={styles.availDot} />
                    <Text style={styles.availText}>Available Now</Text>
                  </View>
                </View>
              </View>

              <View style={styles.heroDivider} />

              <View style={styles.heroRatingRow}>
                <Star size={16} color={GOLD} fill={GOLD} />
                <Text style={styles.heroRatingText}>{agency.rating}</Text>
                <Text style={styles.heroReviewText}>{reviewCount} Reviews</Text>
              </View>
            </View>

            {/* ── Key Information Strip ── */}
            <View style={styles.infoStrip}>
              <View style={styles.infoStripItem}>
                <Text style={styles.infoStripValue}>{agency.experience}</Text>
                <Text style={styles.infoStripLabel}>Experience</Text>
              </View>
              <View style={styles.infoStripDivider} />
              <View style={styles.infoStripItem}>
                <Text style={[styles.infoStripValue, { color: GREEN }]}>{agency.availableStaff}</Text>
                <Text style={styles.infoStripLabel}>Available Staff</Text>
              </View>
              <View style={styles.infoStripDivider} />
              <View style={styles.infoStripItem}>
                <Text style={[styles.infoStripValue, { color: GOLD }]}>{agency.rating}</Text>
                <Text style={styles.infoStripLabel}>Rating</Text>
              </View>
            </View>

            {/* ── Top Roles / Services ── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Staff Categories</Text>
              <View style={styles.rolesGrid}>
                {roles.slice(0, 6).map((role, i) => (
                  <View key={i} style={styles.roleChip}>
                    <Text style={styles.roleChipText}>{role}</Text>
                  </View>
                ))}
                {roles.length > 6 && (
                  <View style={styles.roleChipMore}>
                    <Text style={styles.roleChipMoreText}>+{roles.length - 6} More</Text>
                  </View>
                )}
              </View>
            </View>

            {/* ── About Agency ── */}
            <View style={styles.sectionContainer}>
              <View style={styles.aboutCard}>
                <Text style={styles.aboutTitle}>About {agency.name}</Text>
                <Text style={styles.aboutText} numberOfLines={4}>
                  We provide verified and skilled hospitality staff for Hotels, Restaurants, and Cafes. Our extensive vetting process ensures you get the best talent tailored precisely to your operational needs.
                </Text>

                <View style={styles.aboutDivider} />

                <View style={styles.policyRow}>
                  <Text style={styles.policyLabel}>Service Charge</Text>
                  <Text style={styles.policyValue}>8.33% of Annual CTC</Text>
                </View>
                <View style={styles.policyRow}>
                  <Text style={styles.policyLabel}>Replacement Policy</Text>
                  <Text style={styles.policyValue}>{agency.replacementPolicy || '90 Days'}</Text>
                </View>
              </View>
            </View>

            {/* ── Trust & Verification ── */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Verified Business</Text>
              <View style={styles.verifyCard}>
                <View style={styles.verifyRow}>
                  <ShieldCheck size={16} color={GREEN} />
                  <Text style={styles.verifyText}>Business Verified</Text>
                </View>
                <View style={styles.verifyRow}>
                  <ShieldCheck size={16} color={GREEN} />
                  <Text style={styles.verifyText}>GST Verified</Text>
                </View>
                <View style={styles.verifyRow}>
                  <ShieldCheck size={16} color={GREEN} />
                  <Text style={styles.verifyText}>Agency Registration Verified</Text>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* ── Primary Actions Sticky Bar ── */}
        <View style={styles.stickyActionBar}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => onViewAvailableStaff && onViewAvailableStaff()}>
            <Text style={styles.secondaryBtnText}>View Available Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequirement && onSendRequirement(agency)}>
            <Text style={styles.primaryBtnText}>Send Requirement</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: NAVY, marginLeft: 8 },
  
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 }, 
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  // Premium Hero
  heroCard: { backgroundColor: NAVY, borderRadius: 16, padding: 20, marginBottom: 16 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center' },
  heroLogo: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  heroLogoText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  heroDetails: { flex: 1, marginLeft: 16 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  heroAgencyName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  heroLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  heroLocationText: { fontSize: 13, color: '#CBD5E1', marginLeft: 4 },
  heroAvailRow: { flexDirection: 'row', alignItems: 'center' },
  availDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN, marginRight: 6 },
  availText: { fontSize: 12, fontWeight: 'bold', color: GREEN },
  
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  heroRatingRow: { flexDirection: 'row', alignItems: 'center' },
  heroRatingText: { fontSize: 14, fontWeight: 'bold', color: GOLD, marginLeft: 6 },
  heroReviewText: { fontSize: 13, color: '#CBD5E1', marginLeft: 8 },

  // Info Strip
  infoStrip: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E8EDF4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  infoStripItem: { flex: 1, alignItems: 'center' },
  infoStripValue: { fontSize: 16, fontWeight: 'bold', color: BLUE, marginBottom: 4 },
  infoStripLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  infoStripDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 10 },

  // Sections
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 12 },

  // Roles
  rolesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  roleChipText: { color: NAVY, fontSize: 13, fontWeight: '500' },
  roleChipMore: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  roleChipMoreText: { color: '#64748B', fontSize: 13, fontWeight: '500' },

  // About Card
  aboutCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8EDF4' },
  aboutTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  aboutText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  aboutDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  policyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  policyLabel: { fontSize: 13, color: '#64748B' },
  policyValue: { fontSize: 13, fontWeight: '600', color: NAVY },

  // Trust Card
  verifyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8EDF4', gap: 12 },
  verifyRow: { flexDirection: 'row', alignItems: 'center' },
  verifyText: { fontSize: 13, fontWeight: '500', color: NAVY, marginLeft: 10 },

  // Sticky Actions Bar
  stickyActionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 12 },
  secondaryBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: 'bold' },
  primaryBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: GOLD, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
