import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Image } from 'react-native';
import { ArrowLeft, Star, ShieldCheck, MapPin, Briefcase, CheckCircle, Info, Send, Phone } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

const MOCK_SERVICES = [
  { id: 1, name: 'Deep Kitchen Cleaning', price: 'Starting from ₹5,000' },
  { id: 2, name: 'Exhaust Fan Maintenance', price: 'Starting from ₹2,500' },
  { id: 3, name: 'Monthly Sanitization', price: '₹8,000 / month' }
];

const MOCK_REVIEWS = [
  { id: 1, user: 'The Meridian Hotel', rating: 5, comment: 'Excellent and prompt service. The kitchen was left spotless.', date: '2 Days Ago' },
  { id: 2, user: 'Spice Route', rating: 4, comment: 'Good work, very professional team.', date: '1 Week Ago' }
];

export default function ProviderProfilePage({ provider, onBack, onSendRequirement }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [activeTab, setActiveTab] = useState('About');

  // Fallback provider data if null
  const currentProvider = provider || {
    name: 'SafeGuard Solutions',
    rating: 4.9,
    experience: '8 Years',
    jobs: 450,
    verified: true,
    location: 'Downtown'
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>Provider Profile</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: '#F1F5F9' }]}>
            <Phone size={18} color={NAVY} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: NAVY }]} onPress={() => onSendRequirement(currentProvider)}>
            <Send size={18} color="#fff" />
            {!isMobile && <Text style={styles.headerBtnText}>Send Requirement</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Banner & Logo */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner} />
          <View style={styles.profileMetaContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>{currentProvider.name.charAt(0)}</Text>
            </View>
            <View style={styles.titleArea}>
              <View style={styles.nameRow}>
                <Text style={styles.providerName}>{currentProvider.name}</Text>
                {currentProvider.verified && <ShieldCheck size={20} color="#16A34A" style={{ marginLeft: 8 }} />}
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#64748B" style={styles.metaIcon} />
                  <Text style={styles.metaText}>{currentProvider.location}</Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Briefcase size={14} color="#64748B" style={styles.metaIcon} />
                  <Text style={styles.metaText}>{currentProvider.experience} Experience</Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Star size={14} color={GOLD} fill={GOLD} style={styles.metaIcon} />
                  <Text style={[styles.metaText, { color: NAVY, fontWeight: '700' }]}>{currentProvider.rating} ({currentProvider.jobs} Jobs)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {['About', 'Services', 'Pricing', 'Reviews'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Area */}
          <View style={styles.tabContent}>
            
            {activeTab === 'About' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Company</Text>
                <Text style={styles.aboutText}>
                  We are a premium facility maintenance company specializing in hospitality and F&B properties. 
                  With over {currentProvider.experience} of experience, our certified professionals ensure top-notch service quality 
                  and reliability. We handle emergency repairs, routine maintenance, and deep cleaning services.
                </Text>

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Certifications</Text>
                <View style={styles.certRow}>
                  <View style={styles.certBadge}>
                    <CheckCircle size={16} color="#16A34A" style={{ marginRight: 6 }} />
                    <Text style={styles.certText}>ISO 9001 Certified</Text>
                  </View>
                  <View style={styles.certBadge}>
                    <CheckCircle size={16} color="#16A34A" style={{ marginRight: 6 }} />
                    <Text style={styles.certText}>Health & Safety Compliant</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'Services' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Offered Services</Text>
                <View style={styles.servicesGrid}>
                  {MOCK_SERVICES.map(srv => (
                    <View key={srv.id} style={styles.serviceCard}>
                      <View style={styles.serviceIconBox}>
                        <CheckCircle size={20} color={NAVY} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.serviceName}>{srv.name}</Text>
                        <Text style={styles.servicePrice}>{srv.price}</Text>
                      </View>
                      <TouchableOpacity style={styles.bookBtn}>
                        <Text style={styles.bookBtnText}>Book</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'Pricing' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pricing Model</Text>
                <View style={styles.pricingBox}>
                  <Info size={20} color="#64748B" />
                  <Text style={styles.pricingText}>
                    Visit charges are applicable for diagnostics but will be waived off if the service is hired. 
                    Standard rate for emergency visits is ₹500. Regular scheduled visits are ₹200.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'Reviews' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Client Reviews</Text>
                <View style={styles.reviewsList}>
                  {MOCK_REVIEWS.map(rev => (
                    <View key={rev.id} style={styles.reviewCard}>
                      <View style={styles.revHeader}>
                        <Text style={styles.revUser}>{rev.user}</Text>
                        <Text style={styles.revDate}>{rev.date}</Text>
                      </View>
                      <View style={styles.revRatingRow}>
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} color={star <= rev.rating ? GOLD : '#E2E8F0'} fill={star <= rev.rating ? GOLD : 'transparent'} />
                        ))}
                      </View>
                      <Text style={styles.revComment}>{rev.comment}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  pageHeaderMobile: { paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pageTitle: { fontSize: 20, fontWeight: '900', color: NAVY },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
  headerBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1000, alignSelf: 'center', width: '100%' },

  bannerContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  banner: { height: 160, backgroundColor: '#E2E8F0' }, // Placeholder for actual image
  profileMetaContainer: { paddingHorizontal: 24, paddingBottom: 24, marginTop: -40, flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 },
  logoBox: { width: 100, height: 100, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }) },
  logoText: { fontSize: 40, fontWeight: '900', color: NAVY },
  titleArea: { flex: 1, minWidth: 250, paddingBottom: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  providerName: { fontSize: 28, fontWeight: '900', color: NAVY },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { marginRight: 4 },
  metaText: { fontSize: 14, color: '#475569' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },

  tabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: NAVY, borderColor: NAVY },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#fff' },

  tabContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  section: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  aboutText: { fontSize: 15, color: '#475569', lineHeight: 24 },
  
  certRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  certBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' },
  certText: { fontSize: 13, fontWeight: '600', color: '#166534' },

  servicesGrid: { gap: 16 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  serviceIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  serviceName: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  servicePrice: { fontSize: 13, color: '#64748B' },
  bookBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: NAVY },
  bookBtnText: { fontSize: 13, fontWeight: '700', color: NAVY },

  pricingBox: { flexDirection: 'row', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 12 },
  pricingText: { flex: 1, fontSize: 14, color: '#475569', lineHeight: 22 },

  reviewsList: { gap: 16 },
  reviewCard: { padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  revHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  revUser: { fontSize: 15, fontWeight: '800', color: NAVY },
  revDate: { fontSize: 12, color: '#94A3B8' },
  revRatingRow: { flexDirection: 'row', marginBottom: 12, gap: 2 },
  revComment: { fontSize: 14, color: '#475569', lineHeight: 22 }
});
