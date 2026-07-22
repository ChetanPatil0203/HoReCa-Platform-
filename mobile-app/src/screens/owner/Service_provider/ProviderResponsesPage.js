import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, useWindowDimensions, Modal, SafeAreaView 
} from 'react-native';
import { 
  ArrowLeft, MessageSquare, ArrowUpDown, GitCompareArrows, 
  BadgeCheck, Star, ChevronRight, CheckCircle, MoreVertical, X,
  ShieldCheck, Circle
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const NAVY = '#0E2042';
const GOLD = '#D4AF37';
const LIGHT_BG = '#F8FAFC';
const GREEN = '#16A34A';
const BORDER = '#E2E8F0';

const MOCK_RESPONSES = [
  { 
    id: 'RSP-001', 
    providerName: 'Elite Fixers', 
    verified: true, 
    rating: 4.9,
    jobs: 450,
    quotedPrice: '₹3,500', 
    visitCharge: '₹200 · Waived on Hire', 
    availability: 'Tomorrow · 10:30 AM', 
    warranty: '30 Days', 
    estimatedTime: '2–3 Hours',
    status: 'Recommended',
    included: 'Leak repair, pipe replacement (up to 2m)',
    excluded: 'Concealed wiring, tile damage',
    paymentTerms: '50% advance, 50% on completion'
  },
  { 
    id: 'RSP-002', 
    providerName: 'Rapid Repairs', 
    verified: false, 
    rating: 4.5,
    jobs: 120,
    quotedPrice: '₹3,000', 
    visitCharge: '₹150', 
    availability: 'Today · 4:00 PM', 
    warranty: 'No Warranty', 
    estimatedTime: '4 Hours',
    status: 'New',
    included: 'Leak repair, basic patching',
    excluded: 'Major pipe replacement, civil work',
    paymentTerms: '100% on completion'
  },
  { 
    id: 'RSP-003', 
    providerName: 'SafeGuard Solutions', 
    verified: true, 
    rating: 4.8,
    jobs: 890,
    quotedPrice: '₹3,800', 
    visitCharge: 'No Visit Charge', 
    availability: '24 Jul · Morning', 
    warranty: '90 Days', 
    estimatedTime: '2 Hours',
    status: 'Reviewed',
    included: 'Complete repair, pipe replacement, testing',
    excluded: 'None',
    paymentTerms: '100% advance'
  }
];

export default function ProviderResponsesPage({ request, onBack, onProviderProfile }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || Platform.OS !== 'web';

  const [responses, setResponses] = useState(MOCK_RESPONSES);
  
  // Comparison state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Modals state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [quoteToAccept, setQuoteToAccept] = useState(null);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [quoteToDecline, setQuoteToDecline] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const [showCompareModal, setShowCompareModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Status Colors mapping
  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { bg: '#EFF6FF', text: '#2563EB' }; // Soft Blue
      case 'Reviewed': return { bg: '#F1F5F9', text: '#475569' }; // Soft Gray-Blue
      case 'Recommended': return { bg: '#FDF4FF', text: '#C026D3' }; // Soft Purple
      case 'Accepted': return { bg: '#DCFCE7', text: '#15803D' }; // Soft Green
      case 'Declined': return { bg: '#FEE2E2', text: '#DC2626' }; // Soft Red
      case 'Expired': return { bg: '#FEE2E2', text: '#991B1B' }; // Soft Gray-Red
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const handleToggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const openQuoteDetails = (quote) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
    setOpenMenuId(null);
  };

  const confirmAccept = () => {
    setResponses(prev => prev.map(r => 
      r.id === quoteToAccept.id ? { ...r, status: 'Accepted' } : r
    ));
    setShowAcceptModal(false);
    alert('Quotation accepted successfully.');
  };

  const confirmDecline = () => {
    setResponses(prev => prev.map(r => 
      r.id === quoteToDecline.id ? { ...r, status: 'Declined' } : r
    ));
    setShowDeclineModal(false);
    alert('Provider response declined.');
  };

  const toggleMenu = (id) => {
    if (openMenuId === id) setOpenMenuId(null);
    else setOpenMenuId(id);
  };

  const hasAcceptedQuote = responses.some(r => r.status === 'Accepted');

  const renderMoreMenu = (resp) => {
    if (openMenuId !== resp.id) return null;

    return (
      <View style={styles.moreMenu}>
        {resp.status === 'New' || resp.status === 'Reviewed' || resp.status === 'Recommended' ? (
          <>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Save for Comparison</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { setQuoteToDecline(resp); setShowDeclineModal(true); setOpenMenuId(null); }}
            >
              <Text style={styles.menuTextDestructive}>Decline Response</Text>
            </TouchableOpacity>
          </>
        ) : resp.status === 'Accepted' ? (
          <>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>View Accepted Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Contact Provider</Text>
            </TouchableOpacity>
          </>
        ) : resp.status === 'Declined' ? (
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>View Response</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* ── Page Header ── */}
      <View style={[styles.pageHeader, isMobile && styles.pageHeaderMobile]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color={NAVY} />
        </TouchableOpacity>
        <View style={styles.headerTitleArea}>
          <Text style={styles.pageTitle}>Provider Responses</Text>
          <Text style={styles.pageSubtitle}>Compare quotations for Plumbing Repair</Text>
          <Text style={styles.pageMeta}>REQ-091 · {responses.length} Responses</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <ArrowUpDown size={20} color={NAVY} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconBtn, isCompareMode && styles.iconBtnActive]}
            onPress={() => { setIsCompareMode(!isCompareMode); setSelectedForCompare([]); }}
          >
            <GitCompareArrows size={20} color={isCompareMode ? '#2563EB' : NAVY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.contentLayout, !isMobile && styles.contentLayoutWeb]}>
          
          {/* ── Requirement Summary ── */}
          <View style={styles.reqSummaryCard}>
            <View style={styles.reqSummaryTop}>
              <Text style={styles.reqSummaryTitle}>Plumbing Repair</Text>
              <TouchableOpacity>
                <Text style={styles.viewReqText}>View Requirement →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reqSummaryDetails}>
              <Text style={styles.reqSummaryText}>Business Location: <Text style={{fontWeight:'600'}}>The Meridian Hotel, Jalgaon</Text></Text>
              <Text style={styles.reqSummaryText}>Preferred Date: <Text style={{fontWeight:'600'}}>24 Jul 2026</Text></Text>
              <Text style={styles.reqSummaryText}>Budget: <Text style={{fontWeight:'600'}}>₹2,500 – ₹4,000</Text></Text>
            </View>
          </View>

          {/* ── Response List Header ── */}
          <View style={styles.listHeader}>
            <Text style={styles.responseCount}>{responses.length} Provider Responses</Text>
            <View style={styles.sortBox}>
              <Text style={styles.sortLabel}>Sort: </Text>
              <Text style={styles.sortValue}>Recommended</Text>
            </View>
          </View>

          {/* ── Empty State ── */}
          {responses.length === 0 && (
            <View style={styles.emptyState}>
              <MessageSquare size={48} color="#94A3B8" />
              <Text style={styles.emptyStateTitle}>No provider responses yet</Text>
              <Text style={styles.emptyStateSub}>Service provider quotations for this requirement will appear here.</Text>
            </View>
          )}

          {/* ── Provider Cards ── */}
          {responses.map(resp => {
            const statusStyle = getStatusStyle(resp.status);
            const isSelected = selectedForCompare.includes(resp.id);
            
            return (
              <View key={resp.id} style={styles.card}>
                
                {/* Status Badge Positioned Absolutely or Top Right */}
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>{resp.status.toUpperCase()}</Text>
                </View>

                {/* Card Header (Identity & Price) */}
                <View style={styles.cardHeader}>
                  {isCompareMode && (
                    <TouchableOpacity style={styles.checkboxWrapper} onPress={() => handleToggleCompare(resp.id)}>
                      {isSelected ? <CheckCircle size={24} color="#2563EB" /> : <Circle size={24} color="#94A3B8" />}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.identityRow} onPress={() => onProviderProfile && onProviderProfile(resp)}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{resp.providerName.charAt(0)}</Text>
                    </View>
                    <View style={styles.identityInfo}>
                      <Text style={styles.providerName} numberOfLines={2}>{resp.providerName}</Text>
                      <View style={styles.metaRow}>
                        {resp.verified && (
                          <View style={styles.verifiedTag}>
                            <BadgeCheck size={12} color="#15803D" />
                            <Text style={styles.verifiedTagText}>Verified Provider</Text>
                          </View>
                        )}
                        {resp.rating && (
                          <View style={styles.ratingTag}>
                            <Star size={12} color={GOLD} fill={GOLD} />
                            <Text style={styles.ratingTagText}>{resp.rating} · {resp.jobs} Services</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceLabel}>Quoted Price</Text>
                    <Text style={styles.quotedPrice}>{resp.quotedPrice}</Text>
                  </View>
                </View>

                {/* 2x2 Quotation Summary Grid */}
                <View style={styles.summaryGrid}>
                  <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Availability</Text>
                      <Text style={styles.gridValue}>{resp.availability}</Text>
                    </View>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Completion</Text>
                      <Text style={styles.gridValue}>{resp.estimatedTime}</Text>
                    </View>
                  </View>
                  <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Visit Charge</Text>
                      <Text style={styles.gridValue}>{resp.visitCharge}</Text>
                    </View>
                    <View style={styles.gridCol}>
                      <Text style={styles.gridLabel}>Warranty</Text>
                      <Text style={styles.gridValue}>{resp.warranty}</Text>
                    </View>
                  </View>
                </View>

                {/* Card Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.viewQuoteBtn} onPress={() => openQuoteDetails(resp)}>
                    <Text style={styles.viewQuoteText}>View Quote</Text>
                    <ChevronRight size={16} color={NAVY} />
                  </TouchableOpacity>

                  <View style={styles.actionsRight}>
                    {resp.status === 'Accepted' ? (
                      <TouchableOpacity style={styles.viewBookingBtn}>
                        <Text style={styles.viewBookingText}>View Booking</Text>
                      </TouchableOpacity>
                    ) : hasAcceptedQuote ? (
                      <Text style={styles.disabledText}>Another quotation was selected</Text>
                    ) : (
                      <TouchableOpacity 
                        style={styles.acceptBtn} 
                        onPress={() => { setQuoteToAccept(resp); setShowAcceptModal(true); setOpenMenuId(null); }}
                      >
                        <CheckCircle size={16} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.acceptBtnText}>Accept Quote</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.moreBtn} onPress={() => toggleMenu(resp.id)}>
                      <MoreVertical size={20} color={NAVY} />
                    </TouchableOpacity>

                    {renderMoreMenu(resp)}
                  </View>
                </View>

              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Sticky Comparison Footer ── */}
      {isCompareMode && selectedForCompare.length >= 2 && (
        <View style={styles.compareFooter}>
          <Text style={styles.compareCount}>{selectedForCompare.length} Providers Selected</Text>
          <TouchableOpacity style={styles.compareActionBtn} onPress={() => setShowCompareModal(true)}>
            <Text style={styles.compareActionText}>Compare Quotations</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── MODALS ── */}

      {/* Accept Quote Confirmation Modal */}
      <Modal visible={showAcceptModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Accept this quotation?</Text>
            </View>
            {quoteToAccept && (
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.confText}>Provider: <Text style={{fontWeight:'700'}}>{quoteToAccept.providerName}</Text></Text>
                <Text style={styles.confText}>Service: <Text style={{fontWeight:'700'}}>Plumbing Repair</Text></Text>
                <View style={styles.confHighlightBox}>
                  <Text style={styles.confText}>Quoted Price: <Text style={styles.confPrice}>{quoteToAccept.quotedPrice}</Text></Text>
                  <Text style={styles.confText}>Visit Charge: <Text style={{fontWeight:'700'}}>{quoteToAccept.visitCharge}</Text></Text>
                </View>
                <Text style={styles.confText}>Availability: <Text style={{fontWeight:'700'}}>{quoteToAccept.availability}</Text></Text>
                <Text style={styles.confText}>Estimated Completion: <Text style={{fontWeight:'700'}}>{quoteToAccept.estimatedTime}</Text></Text>
                <Text style={styles.confText}>Warranty: <Text style={{fontWeight:'700'}}>{quoteToAccept.warranty}</Text></Text>
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAcceptModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmAcceptBtn} onPress={confirmAccept}>
                <Text style={styles.modalConfirmAcceptText}>Accept Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Decline Quote Confirmation Modal */}
      <Modal visible={showDeclineModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decline this provider response?</Text>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalSubtitle}>Please select a reason:</Text>
              {['Price is too high', 'Availability is not suitable', 'Warranty is insufficient', 'Provider profile is not suitable', 'Requirement already fulfilled', 'Other'].map(r => (
                <TouchableOpacity 
                  key={r} 
                  style={styles.radioRow}
                  onPress={() => setDeclineReason(r)}
                >
                  {declineReason === r ? <CheckCircle size={20} color="#DC2626" /> : <Circle size={20} color="#94A3B8" />}
                  <Text style={styles.radioText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowDeclineModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalConfirmDeclineBtn, !declineReason && { opacity: 0.5 }]} 
                onPress={confirmDecline}
                disabled={!declineReason}
              >
                <Text style={styles.modalConfirmDeclineText}>Decline Response</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quote Details Center Modal */}
      <Modal visible={showQuoteModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Quotation Details</Text>
              <TouchableOpacity onPress={() => setShowQuoteModal(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            {selectedQuote && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.qHeader}>
                  <Text style={styles.qProviderName}>{selectedQuote.providerName}</Text>
                  <Text style={styles.qReqId}>Quotation ID: {selectedQuote.id}</Text>
                </View>
                
                <View style={styles.qPriceBox}>
                  <View style={styles.qPriceRow}>
                    <Text style={styles.qPriceLabel}>Total Payable Amount</Text>
                    <Text style={styles.qPriceVal}>{selectedQuote.quotedPrice}</Text>
                  </View>
                  <View style={styles.qPriceRow}>
                    <Text style={styles.qPriceSub}>Visit Charge</Text>
                    <Text style={styles.qPriceSubVal}>{selectedQuote.visitCharge}</Text>
                  </View>
                </View>
                
                <View style={styles.qSection}>
                  <Text style={styles.qSectionTitle}>Service Terms</Text>
                  <View style={styles.qTermRow}><Text style={styles.qTermL}>Availability</Text><Text style={styles.qTermV}>{selectedQuote.availability}</Text></View>
                  <View style={styles.qTermRow}><Text style={styles.qTermL}>Est. Completion</Text><Text style={styles.qTermV}>{selectedQuote.estimatedTime}</Text></View>
                  <View style={styles.qTermRow}><Text style={styles.qTermL}>Warranty</Text><Text style={styles.qTermV}>{selectedQuote.warranty}</Text></View>
                  <View style={styles.qTermRow}><Text style={styles.qTermL}>Payment Terms</Text><Text style={styles.qTermV}>{selectedQuote.paymentTerms}</Text></View>
                </View>

                <View style={styles.qSection}>
                  <Text style={styles.qSectionTitle}>Scope of Work</Text>
                  <Text style={styles.qScopeText}><Text style={{fontWeight:'700'}}>Included: </Text>{selectedQuote.included}</Text>
                  <Text style={styles.qScopeText}><Text style={{fontWeight:'700'}}>Excluded: </Text>{selectedQuote.excluded}</Text>
                </View>
              </ScrollView>
            )}
            
            {selectedQuote && selectedQuote.status !== 'Accepted' && selectedQuote.status !== 'Declined' && !hasAcceptedQuote && (
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowQuoteModal(false); setQuoteToDecline(selectedQuote); setShowDeclineModal(true); }}>
                  <Text style={[styles.modalCancelText, {color: '#DC2626'}]}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmAcceptBtn} onPress={() => { setShowQuoteModal(false); setQuoteToAccept(selectedQuote); setShowAcceptModal(true); }}>
                  <Text style={styles.modalConfirmAcceptText}>Accept Quote</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Compare Modal */}
      <Modal visible={showCompareModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Compare Quotations</Text>
              <TouchableOpacity onPress={() => setShowCompareModal(false)} style={styles.closeBtn}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} horizontal>
               <View style={{ flexDirection: 'row', gap: 16 }}>
                 {selectedForCompare.map(id => {
                   const q = responses.find(r => r.id === id);
                   return (
                     <View key={id} style={styles.compareCol}>
                       <Text style={styles.compProvName}>{q.providerName}</Text>
                       <Text style={styles.compPrice}>{q.quotedPrice}</Text>
                       
                       <View style={styles.compItem}><Text style={styles.compLabel}>Visit Charge</Text><Text style={styles.compVal}>{q.visitCharge}</Text></View>
                       <View style={styles.compItem}><Text style={styles.compLabel}>Availability</Text><Text style={styles.compVal}>{q.availability}</Text></View>
                       <View style={styles.compItem}><Text style={styles.compLabel}>Completion</Text><Text style={styles.compVal}>{q.estimatedTime}</Text></View>
                       <View style={styles.compItem}><Text style={styles.compLabel}>Warranty</Text><Text style={styles.compVal}>{q.warranty}</Text></View>
                       
                       {!hasAcceptedQuote && q.status !== 'Accepted' && (
                         <TouchableOpacity style={[styles.acceptBtn, {marginTop: 16}]} onPress={() => { setShowCompareModal(false); setQuoteToAccept(q); setShowAcceptModal(true); }}>
                           <Text style={styles.acceptBtnText}>Accept Quote</Text>
                         </TouchableOpacity>
                       )}
                     </View>
                   )
                 })}
               </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: LIGHT_BG },
  
  /* ── Header ── */
  pageHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: BORDER },
  pageHeaderMobile: { paddingHorizontal: 16 },
  backBtn: { padding: 8, marginLeft: -8, marginTop: 4 },
  headerTitleArea: { flex: 1, paddingHorizontal: 8 },
  pageTitle: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  pageSubtitle: { fontSize: 13, color: '#475569', marginBottom: 6 },
  pageMeta: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  iconBtnActive: { backgroundColor: '#EFF6FF' },
  
  scroll: { flex: 1 },
  contentLayout: { padding: 16 },
  contentLayoutWeb: { padding: 32, maxWidth: 1100, alignSelf: 'center', width: '100%' },

  /* ── Requirement Summary ── */
  reqSummaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  reqSummaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reqSummaryTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  viewReqText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
  reqSummaryDetails: { gap: 4 },
  reqSummaryText: { fontSize: 13, color: '#475569' },

  /* ── List Header ── */
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  responseCount: { fontSize: 15, fontWeight: '800', color: NAVY },
  sortBox: { flexDirection: 'row', alignItems: 'center' },
  sortLabel: { fontSize: 13, color: '#64748B' },
  sortValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* ── Empty State ── */
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyStateTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginTop: 16, marginBottom: 8 },
  emptyStateSub: { fontSize: 14, color: '#64748B', textAlign: 'center', maxWidth: 300 },

  /* ── Provider Card ── */
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 12, position: 'relative', zIndex: 1, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8 }, android: { elevation: 2 } }) },
  statusBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, marginTop: 12 },
  checkboxWrapper: { marginRight: 12, justifyContent: 'center', marginTop: 10 },
  identityRow: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '900', color: NAVY },
  identityInfo: { flex: 1, paddingRight: 8 },
  providerName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  verifiedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  verifiedTagText: { fontSize: 10, fontWeight: '700', color: '#15803D', marginLeft: 2 },
  ratingTag: { flexDirection: 'row', alignItems: 'center' },
  ratingTagText: { fontSize: 11, fontWeight: '600', color: '#64748B', marginLeft: 4 },
  
  priceBox: { alignItems: 'flex-end', justifyContent: 'center', marginLeft: 8 },
  priceLabel: { fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 2 },
  quotedPrice: { fontSize: 18, fontWeight: '900', color: '#16A34A' },

  /* ── Quotation Summary Grid ── */
  summaryGrid: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 16 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gridCol: { flex: 1, paddingRight: 8 },
  gridLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  gridValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  /* ── Actions ── */
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 },
  viewQuoteBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12 },
  viewQuoteText: { fontSize: 14, fontWeight: '700', color: NAVY, marginRight: 4 },
  actionsRight: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  acceptBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: GREEN, paddingHorizontal: 16, height: 40, borderRadius: 10 },
  acceptBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  viewBookingBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 16, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE' },
  viewBookingText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  disabledText: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic', marginRight: 12 },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },

  moreMenu: { position: 'absolute', top: 48, right: 0, width: 200, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: BORDER, ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }, android: { elevation: 4 } }), zIndex: 10 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12 },
  menuText: { fontSize: 14, fontWeight: '600', color: NAVY },
  menuTextDestructive: { fontSize: 14, fontWeight: '600', color: '#DC2626' },
  menuDivider: { height: 1, backgroundColor: BORDER },

  /* ── Sticky Compare Footer ── */
  compareFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: BORDER, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Platform.select({ web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 4 } }) },
  compareCount: { fontSize: 14, fontWeight: '700', color: NAVY },
  compareActionBtn: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  compareActionText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  /* ── Modals ── */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(14,32,66,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', maxWidth: 500, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: BORDER },
  modalTitle: { fontSize: 18, fontWeight: '900', color: NAVY },
  modalSubtitle: { fontSize: 14, color: '#64748B', marginTop: 8 },
  closeBtn: { padding: 4, backgroundColor: '#F1F5F9', borderRadius: 16 },
  modalScroll: { padding: 20, maxHeight: 400 },
  
  confText: { fontSize: 14, color: '#475569', marginBottom: 8 },
  confHighlightBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginVertical: 12, borderWidth: 1, borderColor: BORDER },
  confPrice: { fontSize: 18, fontWeight: '900', color: GREEN },
  
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  radioText: { fontSize: 14, color: NAVY, marginLeft: 12 },

  modalFooter: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: BORDER, gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  modalConfirmAcceptBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: GREEN, alignItems: 'center' },
  modalConfirmAcceptText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  modalConfirmDeclineBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#DC2626', alignItems: 'center' },
  modalConfirmDeclineText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  /* Quote Details Modal Specifics */
  qHeader: { marginBottom: 20 },
  qProviderName: { fontSize: 20, fontWeight: '900', color: NAVY },
  qReqId: { fontSize: 12, color: '#64748B', marginTop: 4 },
  qPriceBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: BORDER },
  qPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  qPriceLabel: { fontSize: 14, fontWeight: '700', color: NAVY },
  qPriceVal: { fontSize: 24, fontWeight: '900', color: GREEN },
  qPriceSub: { fontSize: 13, color: '#64748B' },
  qPriceSubVal: { fontSize: 13, fontWeight: '700', color: NAVY },
  qSection: { marginBottom: 24 },
  qSectionTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8 },
  qTermRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  qTermL: { fontSize: 13, color: '#64748B' },
  qTermV: { fontSize: 14, fontWeight: '600', color: NAVY, textAlign: 'right', flex: 1, marginLeft: 16 },
  qScopeText: { fontSize: 13, color: '#475569', marginBottom: 6, lineHeight: 20 },

  /* Compare Modal Specifics */
  compareCol: { width: 220, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  compProvName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 8 },
  compPrice: { fontSize: 20, fontWeight: '900', color: GREEN, marginBottom: 16 },
  compItem: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 8 },
  compLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  compVal: { fontSize: 13, fontWeight: '600', color: NAVY }
});
