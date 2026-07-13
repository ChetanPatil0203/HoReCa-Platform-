import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Image } from 'react-native';
import { ArrowLeft, ShieldCheck, Star, MapPin, Users, Briefcase, DollarSign, Clock, ImageDown, MessageSquare } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const GOLD = '#D97706';
const BLUE = '#2563EB';

export default function AgencyProfilePage({ agency, onBack, onSendRequirement }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  if (!agency) return null;

  return (
    <View style={styles.wrapper}>
      {/* ── Top Bar ── */}
      <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agency Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerBg} />
          <View style={[styles.bannerContent, !isMobile && styles.contentLayoutWeb]}>
            <View style={styles.profileRow}>
              <View style={styles.agencyLogoLg}>
                <Text style={styles.agencyLogoTextLg}>{agency.logo}</Text>
              </View>
              <View style={styles.profileTextCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.agencyNameLg}>{agency.name}</Text>
                  {agency.verified && <ShieldCheck size={20} color="#16A34A" style={{ marginLeft: 8 }} />}
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#CBD5E1" />
                  <Text style={styles.locationTextLg}>{agency.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Key Stats */}
          <View style={[styles.statsGrid, isMobile && { flexDirection: 'column' }]}>
            <View style={styles.statCard}>
              <Star size={20} color={GOLD} fill={GOLD} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{agency.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Briefcase size={20} color={BLUE} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{agency.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Users size={20} color="#16A34A" />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue}>{agency.availableStaff}</Text>
                <Text style={styles.statLabel}>Available Staff</Text>
              </View>
            </View>
          </View>

          {/* About & Policies */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>About {agency.name}</Text>
            <Text style={styles.aboutText}>
              We are a premium manpower agency specializing in the hospitality sector. We provide highly trained chefs, waiters, housekeepers, and management staff to top hotels and restaurants across {agency.location}.
            </Text>

            <View style={styles.divider} />
            
            <View style={[styles.policyGrid, isMobile && { flexDirection: 'column' }]}>
              <View style={styles.policyItem}>
                <View style={styles.policyIconBox}><Clock size={16} color="#64748B" /></View>
                <View>
                  <Text style={styles.policyLabel}>Replacement Policy</Text>
                  <Text style={styles.policyValue}>{agency.replacementPolicy}</Text>
                </View>
              </View>
              <View style={styles.policyItem}>
                <View style={styles.policyIconBox}><DollarSign size={16} color="#64748B" /></View>
                <View>
                  <Text style={styles.policyLabel}>Service Charge</Text>
                  <Text style={styles.policyValue}>8.33% of Annual CTC</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={[styles.actionsRow, isMobile && { flexDirection: 'column' }]}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequirement(agency)}>
              <Text style={styles.primaryBtnText}>Send Direct Requirement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>View Available Staff</Text>
            </TouchableOpacity>
          </View>

          {/* Gallery Placeholder */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {[1, 2, 3].map(i => (
                <View key={i} style={styles.galleryPlaceholder}>
                  <ImageDown size={24} color="#94A3B8" />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Reviews Placeholder */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarTxt}>T</Text></View>
                <View>
                  <Text style={styles.reviewName}>Taj Palace Hotel</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} color={GOLD} fill={GOLD} />)}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>"Excellent staff provided. Very professional and fast replacement."</Text>
            </View>
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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16, gap: 20 },
  contentLayoutWeb: { padding: 32, maxWidth: 800, alignSelf: 'center', width: '100%' },

  bannerContainer: { backgroundColor: '#0F172A', paddingTop: 20, paddingBottom: 20 },
  bannerBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundColor: '#2563EB' },
  bannerContent: { paddingHorizontal: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  agencyLogoLg: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  agencyLogoTextLg: { fontSize: 32, fontWeight: '900', color: BLUE },
  profileTextCol: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  agencyNameLg: { fontSize: 24, fontWeight: '800', color: '#fff' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationTextLg: { fontSize: 14, color: '#CBD5E1', marginLeft: 6 },

  statsGrid: { flexDirection: 'row', gap: 16 },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  statTextCol: { flex: 1 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },

  cardSection: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  aboutText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  
  policyGrid: { flexDirection: 'row', gap: 20 },
  policyItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  policyIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  policyLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  policyValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  actionsRow: { flexDirection: 'row', gap: 16 },
  primaryBtn: { flex: 1, backgroundColor: BLUE, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#0F172A', fontSize: 15, fontWeight: '700' },

  galleryPlaceholder: { width: 120, height: 120, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },

  reviewCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reviewAvatarTxt: { color: '#fff', fontWeight: '800' },
  reviewName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  reviewText: { fontSize: 13, color: '#475569', fontStyle: 'italic' }
});
