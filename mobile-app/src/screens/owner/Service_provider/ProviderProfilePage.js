import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, useWindowDimensions, Modal, TextInput, KeyboardAvoidingView, SafeAreaView
} from 'react-native';
import { 
  ArrowLeft, Bookmark, Star, Briefcase, CalendarCheck, 
  Send, ShieldCheck, MapPin, Wrench, ChevronRight, X, Paperclip, BadgeCheck, CheckCircle, Eye
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';
const LIGHT_BG = '#F8FAFC';
const GREEN = '#16A34A';
const BORDER = '#E2E8F0';

const MOCK_SERVICES = [
  { id: 1, name: 'Deep Kitchen Cleaning', desc: 'Thorough cleaning of commercial kitchen spaces including exhaust hoods.', available: 'Available This Week', priceType: 'Starting from', price: '₹5,000' },
  { id: 2, name: 'Pest Control', desc: 'Comprehensive pest management for food service areas.', available: 'Available Today', priceType: 'Inspection Required', price: '₹500 / visit' },
  { id: 3, name: 'AC Maintenance', desc: 'Routine and preventive maintenance for commercial HVAC.', available: 'Available Tomorrow', priceType: 'Fixed Price', price: '₹1,500 / unit' }
];

const MOCK_CERTS = [
  { id: 1, name: 'ISO 9001 Certified', authority: 'ISO', status: 'Verified', validity: '2028' },
  { id: 2, name: 'Health & Safety Compliant', authority: 'FSSAI', status: 'Verified', validity: '2027' },
  { id: 3, name: 'Verified Business Registration', authority: 'Gov', status: 'Verified', validity: 'Lifetime' }
];

const MOCK_REVIEWS = [
  { id: 1, user: 'The Meridian Hotel', type: 'Hotel', rating: 5, comment: 'Excellent and prompt service. The kitchen was left spotless.', date: '2 Days Ago' },
  { id: 2, user: 'Spice Route', type: 'Restaurant', rating: 4, comment: 'Good work, very professional team.', date: '1 Week Ago' },
  { id: 3, user: 'Cafe Mocha', type: 'Cafe', rating: 5, comment: 'Very reliable for monthly maintenance.', date: '3 Weeks Ago' }
];

export default function ProviderProfilePage({ provider, onBack }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';
  const [activeTab, setActiveTab] = useState('Overview');
  const [showFullAbout, setShowFullAbout] = useState(false);
  
  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const currentProvider = provider || {
    name: 'SafeGuard Solutions',
    rating: 4.9,
    experience: '8 Years',
    jobs: 450,
    verified: true,
    location: 'Downtown, Jalgaon',
    availability: 'Available for Requests'
  };

  const handleSendRequest = () => {
    setShowRequestModal(false);
    alert('Direct request sent successfully.'); 
  };

  const renderTabs = () => (
    <View style={styles.tabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {['Overview', 'Services', 'Pricing', 'Reviews'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* ── Page Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.pageTitle} numberOfLines={1}>Provider Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {/* ── Premium Hero Card ── */}
          <View style={styles.heroCard}>
            <View style={styles.heroHeaderRow}>
              <View style={styles.heroIdentity}>
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{currentProvider.name.charAt(0)}</Text>
                </View>
                <View style={styles.heroTitleArea}>
                  <Text style={styles.heroProviderName} numberOfLines={2}>{currentProvider.name}</Text>
                  <View style={styles.heroBadges}>
                    {currentProvider.verified && (
                      <View style={styles.verifiedBadge}>
                        <BadgeCheck size={12} color="#15803D" />
                        <Text style={styles.verifiedText}>Verified Provider</Text>
                      </View>
                    )}
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>Service Provider</Text>
                    </View>
                  </View>
                  <View style={styles.heroLocation}>
                    <Text style={styles.locationText}>{currentProvider.location}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroFactsRow}>
              <View style={styles.factCol}>
                <View style={styles.factValRow}>
                  <Text style={styles.factValue}>{currentProvider.rating}</Text>
                  <Star size={14} color={GOLD} fill={GOLD} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.factLabel}>Rating</Text>
              </View>
              <View style={styles.factDivider} />
              <View style={styles.factCol}>
                <View style={styles.factValRow}>
                  <Text style={styles.factValue}>{currentProvider.jobs}</Text>
                  <CheckCircle size={14} color="#16A34A" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.factLabel}>Services Completed</Text>
              </View>
              <View style={styles.factDivider} />
              <View style={styles.factCol}>
                <View style={styles.factValRow}>
                  <Text style={styles.factValue}>{currentProvider.experience}</Text>
                  <Briefcase size={14} color="#2563EB" style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.factLabel}>Experience</Text>
              </View>
            </View>

            <View style={styles.availabilityRow}>
              <View style={styles.availabilityPill}>
                <CalendarCheck size={14} color="#15803D" />
                <Text style={styles.availabilityText}>Available for Requests</Text>
              </View>
            </View>

            <View style={styles.heroActionsRow}>
              <TouchableOpacity style={styles.primaryActionBtn} onPress={() => setShowRequestModal(true)}>
                <Send size={18} color="#fff" />
                <Text style={styles.primaryActionText}>Send Direct Request</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderTabs()}

          <View style={styles.tabContentContainer}>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'Overview' && (
              <View style={styles.tabSection}>
                <View style={styles.contentBlock}>
                  <Text style={styles.blockTitle}>About Provider</Text>
                  <Text style={styles.aboutText} numberOfLines={showFullAbout ? undefined : 3}>
                    {currentProvider.name} provides professional maintenance and facility services for Hotels, Restaurants, and Cafes. The verified team specialises in reliable cleaning, repair, and preventive-maintenance solutions ensuring compliance and operational efficiency.
                  </Text>
                  <TouchableOpacity onPress={() => setShowFullAbout(!showFullAbout)}>
                    <Text style={styles.readMoreText}>{showFullAbout ? 'Show Less' : 'Read More'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.contentBlock}>
                  <Text style={styles.blockTitle}>Service Highlights</Text>
                  <View style={styles.chipsGrid}>
                    {['Cleaning Services', 'Pest Control', 'Fire Safety', 'AC Maintenance', 'Equipment Repair', 'Interior Maintenance'].map((srv, idx) => (
                      <View key={idx} style={styles.chip}>
                        <CheckCircle size={14} color={NAVY} />
                        <Text style={styles.chipText}>{srv}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.viewAllLink} onPress={() => setActiveTab('Services')}>
                    <Text style={styles.viewAllLinkText}>View All Services</Text>
                    <ChevronRight size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>

                <View style={styles.contentBlock}>
                  <Text style={styles.blockTitle}>Trust & Certifications</Text>
                  <View style={styles.certList}>
                    {MOCK_CERTS.map(cert => (
                      <TouchableOpacity key={cert.id} style={styles.certRow} onPress={() => { setSelectedCert(cert); setShowCertModal(true); }}>
                        <ShieldCheck size={20} color={GREEN} />
                        <Text style={styles.certName}>{cert.name}</Text>
                        <ChevronRight size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* ── SERVICES TAB ── */}
            {activeTab === 'Services' && (
              <View style={styles.tabSection}>
                <Text style={styles.blockTitle}>Available Services</Text>
                <View style={styles.servicesGrid}>
                  {MOCK_SERVICES.map(srv => (
                    <View key={srv.id} style={styles.srvCard}>
                      <View style={styles.srvTop}>
                        <View style={styles.srvIconBox}><Wrench size={20} color={NAVY} /></View>
                        <View style={styles.srvHeaderContent}>
                          <Text style={styles.srvName}>{srv.name}</Text>
                          <Text style={styles.srvAvailable}>{srv.available}</Text>
                        </View>
                      </View>
                      <Text style={styles.srvDesc} numberOfLines={2}>{srv.desc}</Text>
                      <View style={styles.srvFooter}>
                        <View>
                          <Text style={styles.srvPriceType}>{srv.priceType}</Text>
                          <Text style={styles.srvPrice}>{srv.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.viewSrvBtn} onPress={() => { setSelectedService(srv); setShowServiceModal(true); }}>
                          <Text style={styles.viewSrvBtnText}>View Service</Text>
                          <ChevronRight size={14} color={NAVY} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── PRICING TAB ── */}
            {activeTab === 'Pricing' && (
              <View style={styles.tabSection}>
                <Text style={styles.blockTitle}>Pricing Information</Text>
                <View style={styles.pricingList}>
                  {MOCK_SERVICES.map(srv => (
                    <View key={srv.id} style={styles.pricingRow}>
                      <View style={styles.pricingLeft}>
                        <Text style={styles.pricingName}>{srv.name}</Text>
                        <Text style={styles.pricingDesc}>{srv.priceType === 'Inspection Required' ? 'Final price depends on property size and inspection.' : 'Standard rates apply.'}</Text>
                      </View>
                      <View style={styles.pricingRight}>
                        <Text style={styles.pricingValueLabel}>{srv.priceType}</Text>
                        <Text style={styles.pricingValue}>{srv.price}</Text>
                        {srv.priceType === 'Inspection Required' && (
                          <TouchableOpacity style={styles.reqQuoteBtn} onPress={() => setShowRequestModal(true)}>
                            <Text style={styles.reqQuoteText}>Request Quote</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── REVIEWS TAB ── */}
            {activeTab === 'Reviews' && (
              <View style={styles.tabSection}>
                <View style={styles.revOverviewRow}>
                  <View style={styles.revScoreBox}>
                    <Text style={styles.revScoreVal}>{currentProvider.rating}</Text>
                    <View style={styles.revScoreStars}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} color={GOLD} fill={GOLD} />)}
                    </View>
                    <Text style={styles.revScoreTotal}>Based on {currentProvider.jobs}+ jobs</Text>
                  </View>
                </View>

                <Text style={[styles.blockTitle, { marginTop: 16 }]}>Recent Reviews</Text>
                <View style={styles.revList}>
                  {MOCK_REVIEWS.map(rev => (
                    <View key={rev.id} style={styles.revCard}>
                      <View style={styles.revTop}>
                        <View style={styles.revAvatar}><Text style={styles.revAvatarTxt}>{rev.user.charAt(0)}</Text></View>
                        <View style={styles.revMeta}>
                          <Text style={styles.revUserName}>{rev.user}</Text>
                          <Text style={styles.revUserType}>{rev.type} • {rev.date}</Text>
                        </View>
                        <View style={styles.revVerified}><BadgeCheck size={14} color={GREEN} /></View>
                      </View>
                      <View style={styles.revStarsRow}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} color={s <= rev.rating ? GOLD : BORDER} fill={s <= rev.rating ? GOLD : 'transparent'} />)}
                      </View>
                      <Text style={styles.revCommentText}>{rev.comment}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </View>
        </View>
      </ScrollView>



      {/* ── MODALS ── */}

      {/* Send Direct Request Modal */}
      <Modal visible={showRequestModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Send Direct Request</Text>
                <Text style={styles.modalSubtitle}>To: {currentProvider.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRequestModal(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Select Service *</Text>
                <View style={styles.inputBox}><Text style={styles.inputText}>Deep Kitchen Cleaning (Example)</Text></View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Requirement Title *</Text>
                <TextInput style={styles.inputField} placeholder="e.g. Urgent Kitchen Deep Clean" placeholderTextColor="#94A3B8" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Service Description</Text>
                <TextInput style={[styles.inputField, { height: 80 }]} placeholder="Describe your requirement in detail..." multiline placeholderTextColor="#94A3B8" />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Preferred Date & Time</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={[styles.inputBox, { flex: 1 }]}><Text style={styles.inputText}>24 Oct 2026</Text></View>
                  <View style={[styles.inputBox, { flex: 1 }]}><Text style={styles.inputText}>10:00 AM</Text></View>
                </View>
              </View>
              <TouchableOpacity style={styles.attachBtn}>
                <Paperclip size={16} color={NAVY} />
                <Text style={styles.attachText}>Attach Photos/Documents (Optional)</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowRequestModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSendBtn} onPress={handleSendRequest}>
                <Text style={styles.modalSendText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* View Service Details Modal */}
      <Modal visible={showServiceModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '70%' }]}>
            {selectedService && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Service Details</Text>
                  <TouchableOpacity onPress={() => setShowServiceModal(false)} style={styles.closeBtn}><X size={20} color="#64748B" /></TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScroll}>
                  <View style={styles.srvModalTop}>
                    <Wrench size={32} color={NAVY} />
                    <Text style={styles.srvModalName}>{selectedService.name}</Text>
                    <Text style={styles.srvModalAvail}>{selectedService.available}</Text>
                  </View>
                  <Text style={styles.srvModalDesc}>{selectedService.desc}</Text>
                  
                  <View style={styles.srvModalInfoRow}>
                    <Text style={styles.srvModalInfoLabel}>Pricing Type</Text>
                    <Text style={styles.srvModalInfoVal}>{selectedService.priceType}</Text>
                  </View>
                  <View style={styles.srvModalInfoRow}>
                    <Text style={styles.srvModalInfoLabel}>Price Estimate</Text>
                    <Text style={styles.srvModalInfoVal}>{selectedService.price}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Certification Details Modal */}
      <Modal visible={showCertModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            {selectedCert && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Certification Details</Text>
                  <TouchableOpacity onPress={() => setShowCertModal(false)} style={styles.closeBtn}><X size={20} color="#64748B" /></TouchableOpacity>
                </View>
                <View style={styles.certModalBody}>
                  <View style={styles.certModalIconBox}><ShieldCheck size={48} color={GREEN} /></View>
                  <Text style={styles.certModalName}>{selectedCert.name}</Text>
                  
                  <View style={styles.certModalDetailBox}>
                    <View style={styles.certModalRow}>
                      <Text style={styles.certModalLabel}>Issuing Authority</Text>
                      <Text style={styles.certModalVal}>{selectedCert.authority}</Text>
                    </View>
                    <View style={styles.certModalRow}>
                      <Text style={styles.certModalLabel}>Status</Text>
                      <Text style={[styles.certModalVal, { color: GREEN, fontWeight: '700' }]}>{selectedCert.status}</Text>
                    </View>
                    <View style={styles.certModalRow}>
                      <Text style={styles.certModalLabel}>Validity</Text>
                      <Text style={styles.certModalVal}>{selectedCert.validity}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: LIGHT_BG },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: BORDER },
  pageHeaderMobile: { paddingHorizontal: 16 },
  backBtn: { padding: 8, marginLeft: -8 },
  pageTitle: { fontSize: 18, fontWeight: '800', color: NAVY, flex: 1, textAlign: 'center' },
  headerSaveBtn: { padding: 8, marginRight: -8 },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1100, alignSelf: 'center', width: '100%' },

  /* ── Hero Card ── */
  heroCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 24, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 }, android: { elevation: 2 } }) },
  heroHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroIdentity: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 12 },
  avatarBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '900', color: NAVY },
  heroTitleArea: { flex: 1 },
  heroProviderName: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 4 },
  heroBadges: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#15803D', marginLeft: 4 },
  typeBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '600', color: NAVY },
  heroLocation: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  bookmarkBtn: { padding: 4 },

  heroDivider: { height: 1, backgroundColor: BORDER, marginVertical: 16 },

  heroFactsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  factCol: { flex: 1, alignItems: 'center' },
  factValRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  factValue: { fontSize: 16, fontWeight: '900', color: NAVY },
  factLabel: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  factDivider: { width: 1, height: 24, backgroundColor: BORDER },

  availabilityRow: { alignItems: 'flex-start', marginTop: 16, marginBottom: 16 },
  availabilityPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  availabilityText: { fontSize: 12, fontWeight: '700', color: '#15803D', marginLeft: 6 },

  heroActionsRow: { flexDirection: 'row', gap: 12 },
  secondaryActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 12, borderWidth: 1, borderColor: BORDER, backgroundColor: '#fff', gap: 8 },
  secondaryActionText: { fontSize: 14, fontWeight: '700', color: NAVY },
  primaryActionBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, backgroundColor: NAVY, gap: 8 },
  primaryActionText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* ── Tabs ── */
  tabsWrapper: { marginBottom: 20 },
  tabsContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  tab: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER },
  tabActive: { backgroundColor: NAVY, borderColor: NAVY },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#fff' },

  tabContentContainer: { paddingBottom: 24 },
  tabSection: { gap: 24 },
  contentBlock: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BORDER },
  blockTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 16 },
  
  /* ── Overview ── */
  aboutText: { fontSize: 15, color: '#475569', lineHeight: 24, marginBottom: 8 },
  readMoreText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: BORDER },
  chipText: { fontSize: 13, fontWeight: '600', color: NAVY, marginLeft: 6 },
  viewAllLink: { flexDirection: 'row', alignItems: 'center' },
  viewAllLinkText: { fontSize: 14, fontWeight: '700', color: '#2563EB', marginRight: 4 },

  certList: { gap: 12 },
  certRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  certName: { fontSize: 14, fontWeight: '700', color: '#166534', flex: 1, marginLeft: 12 },

  /* ── Services ── */
  servicesGrid: { gap: 16 },
  srvCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  srvTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  srvIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  srvHeaderContent: { flex: 1 },
  srvName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  srvAvailable: { fontSize: 12, fontWeight: '600', color: GREEN },
  srvDesc: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  srvFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  srvPriceType: { fontSize: 12, color: '#94A3B8', marginBottom: 2 },
  srvPrice: { fontSize: 15, fontWeight: '800', color: NAVY },
  viewSrvBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: BORDER },
  viewSrvBtnText: { fontSize: 13, fontWeight: '700', color: NAVY, marginRight: 4 },

  /* ── Pricing ── */
  pricingList: { gap: 12 },
  pricingRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: BORDER },
  pricingLeft: { flex: 1, paddingRight: 16 },
  pricingName: { fontSize: 15, fontWeight: '800', color: NAVY, marginBottom: 4 },
  pricingDesc: { fontSize: 13, color: '#64748B' },
  pricingRight: { alignItems: 'flex-end', justifyContent: 'center' },
  pricingValueLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  pricingValue: { fontSize: 16, fontWeight: '800', color: NAVY },
  reqQuoteBtn: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#EFF6FF' },
  reqQuoteText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  /* ── Reviews ── */
  revOverviewRow: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  revScoreBox: { alignItems: 'center' },
  revScoreVal: { fontSize: 48, fontWeight: '900', color: NAVY },
  revScoreStars: { flexDirection: 'row', gap: 4, marginVertical: 8 },
  revScoreTotal: { fontSize: 13, color: '#64748B' },
  
  revList: { gap: 16 },
  revCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  revTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  revAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  revAvatarTxt: { fontSize: 16, fontWeight: '800', color: NAVY },
  revMeta: { flex: 1 },
  revUserName: { fontSize: 15, fontWeight: '800', color: NAVY },
  revUserType: { fontSize: 12, color: '#94A3B8' },
  revVerified: { padding: 4 },
  revStarsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  revCommentText: { fontSize: 14, color: '#475569', lineHeight: 22 },

  /* ── Sticky Mobile Action ── */
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: BORDER },

  /* ── Modals ── */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(14,32,66,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  closeBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 16 },
  modalScroll: { padding: 20 },
  
  formGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: NAVY, marginBottom: 8 },
  inputBox: { padding: 14, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  inputText: { fontSize: 14, color: NAVY, fontWeight: '600' },
  inputField: { padding: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: BORDER, fontSize: 14, color: NAVY },
  attachBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: BORDER, borderStyle: 'dashed' },
  attachText: { fontSize: 14, fontWeight: '600', color: NAVY, marginLeft: 8 },

  modalFooter: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: BORDER, gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  modalSendBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: NAVY, alignItems: 'center' },
  modalSendText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* Service Modal Specifics */
  srvModalTop: { alignItems: 'center', marginBottom: 24 },
  srvModalName: { fontSize: 22, fontWeight: '900', color: NAVY, marginTop: 12, textAlign: 'center' },
  srvModalAvail: { fontSize: 14, fontWeight: '700', color: GREEN, marginTop: 4 },
  srvModalDesc: { fontSize: 15, color: '#475569', lineHeight: 24, textAlign: 'center', marginBottom: 24 },
  srvModalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  srvModalInfoLabel: { fontSize: 14, color: '#64748B' },
  srvModalInfoVal: { fontSize: 15, fontWeight: '800', color: NAVY },

  /* Cert Modal Specifics */
  certModalBody: { padding: 32, alignItems: 'center' },
  certModalIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  certModalName: { fontSize: 20, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 32 },
  certModalDetailBox: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BORDER, gap: 16 },
  certModalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  certModalLabel: { fontSize: 13, color: '#64748B' },
  certModalVal: { fontSize: 14, fontWeight: '800', color: NAVY }
});
