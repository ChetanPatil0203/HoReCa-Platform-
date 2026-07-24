import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions, Image , Alert} from 'react-native';
import { ArrowLeft, Star, ShieldCheck, MapPin, Briefcase, Award, CheckCircle, Image as ImageIcon, Send } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';

export default function AgencyProfilePage({ agency, onBack, onSendRequirement }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const defaultAgency = agency || {
    name: '',
    type: '',
    rating: 0,
    projects: 0,
    experience: '',
    verified: false,
    about: '',
    services: [],
    industries: [],
    clients: [],
  };

  return (
    <View style={styles.wrapper}>
      {/* ── Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ArrowLeft size={20} color={NAVY} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Agency Profile</Text>
            <Text style={styles.pageSubtitle}>View details and portfolio</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Banner Placeholder */}
        <View style={styles.banner}>
          <ImageIcon size={48} color="#94A3B8" />
          <Text style={styles.bannerText}>Cover Photo</Text>
        </View>

        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>

          {/* Profile Header Card */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>{defaultAgency.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.agencyName}>{defaultAgency.name}</Text>
                {defaultAgency.verified && <ShieldCheck size={20} color="#16A34A" style={{ marginLeft: 8 }} />}
              </View>
              <Text style={styles.agencyType}>{defaultAgency.type}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Star size={16} color={GOLD} fill={GOLD} style={{ marginRight: 6 }} />
                  <Text style={styles.statValue}>{defaultAgency.rating} Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Briefcase size={16} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.statValue}>{defaultAgency.projects} Projects</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Award size={16} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.statValue}>{defaultAgency.experience}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.twoColGrid, isMobile && { flexDirection: 'column' }]}>
            
            {/* Left Column */}
            <View style={styles.colLeft}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.aboutText}>{defaultAgency.about}</Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Services Offered</Text>
                <View style={styles.tagsContainer}>
                  {defaultAgency.services.map((srv, idx) => (
                    <View key={idx} style={styles.tag}>
                      <CheckCircle size={14} color="#16A34A" style={{ marginRight: 6 }} />
                      <Text style={styles.tagText}>{srv}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Key Clients</Text>
                <View style={styles.tagsContainer}>
                  {defaultAgency.clients.map((c, idx) => (
                    <View key={idx} style={[styles.tag, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                      <Text style={[styles.tagText, { color: NAVY }]}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.colRight}>
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Industries Served</Text>
                <View style={styles.tagsContainer}>
                  {defaultAgency.industries.map((ind, idx) => (
                    <View key={idx} style={[styles.tag, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                      <Text style={[styles.tagText, { color: '#92400E' }]}>{ind}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderFlex}>
                  <Text style={styles.sectionTitle}>Portfolio Gallery</Text>
                  <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'This feature is under development.')}><Text style={styles.linkText}>View All</Text></TouchableOpacity>
                </View>
                <View style={styles.galleryGrid}>
                  {[1,2,3,4].map(i => (
                    <View key={i} style={styles.galleryImage}>
                      <ImageIcon size={24} color="#94A3B8" />
                    </View>
                  ))}
                </View>
              </View>
            </View>

          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <View style={[styles.bottomBarContent, !isMobile && styles.contentLayoutWeb]}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>View Full Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequirement(defaultAgency)}>
            <Send size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Send Direct Requirement</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  banner: { height: 200, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  bannerText: { fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: '600' },
  
  contentLayout: { padding: 16, gap: 24 },
  contentLayoutWeb: { padding: 32, maxWidth: 1200, alignSelf: 'center', width: '100%', gap: 24 },

  profileHeaderCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', marginTop: -40, zIndex: 10 },
  profileAvatar: { width: 80, height: 80, borderRadius: 16, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', marginRight: 24, borderWidth: 4, borderColor: '#fff' },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  agencyName: { fontSize: 24, fontWeight: '900', color: NAVY },
  agencyType: { fontSize: 15, color: '#64748B', marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '700', color: NAVY },
  statDivider: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },

  twoColGrid: { flexDirection: 'row', gap: 24 },
  colLeft: { flex: 2, gap: 24 },
  colRight: { flex: 1, gap: 24 },

  sectionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 16 },
  sectionHeaderFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  linkText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  
  aboutText: { fontSize: 15, color: '#475569', lineHeight: 24 },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#BBF7D0' },
  tagText: { fontSize: 13, fontWeight: '600', color: '#166534' },

  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  galleryImage: { width: '47%', aspectRatio: 1, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, padding: 16 },
  bottomBarContent: { flexDirection: 'row', gap: 16, padding: 0 },
  primaryBtn: { flex: 2, height: 48, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  secondaryBtn: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: NAVY }
});
