import React, { useState, useMemo, useEffect, useContext } from 'react';
import { fetchOwnerSupportTicketsApi } from '../../services/api.service';
import { AuthContext } from '../../context/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  useWindowDimensions,
  SafeAreaView
} from 'react-native';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  CircleAlert,
  ChevronRight,
  LifeBuoy,
  X,
  FileText,
  Building2,
  Check
} from 'lucide-react-native';
import SubmitSupportTicketModal from './SubmitSupportTicketModal';
import TicketDetailsModal from '../vendor/manpowerAgent/TicketDetailsModal';

const COLORS = {
  navy: '#071B3A',
  gold: '#F2C230',
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E3E9F1',
  primaryText: '#091B3A',
  secondaryText: '#71829B',
  success: '#16B77A',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

const STATUS_FILTERS = [
  'All',
  'Open',
  'In Progress',
  'Awaiting Response',
  'Resolved',
  'Closed'
];

const INITIAL_TICKETS = [];

const FAQ_CATEGORIES = [
  'All',
  'Account',
  'Orders & Delivery',
  'Payments',
  'Manpower',
  'Services',
  'Marketing',
  'Compliance'
];

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    category: 'Account',
    q: 'How do I update my business profile?',
    a: 'Go to Profile Settings from the top right avatar or sidebar, tap "Edit Profile", update your business name, address, or operational details, and click "Save Changes".'
  },
  {
    id: 'faq-2',
    category: 'Orders & Delivery',
    q: 'How can I track an order?',
    a: 'Navigate to the "Order Tracking" section from your main dashboard navigation. Select the active order to view real-time delivery status and dispatch logs.'
  },
  {
    id: 'faq-3',
    category: 'Services',
    q: 'How do I cancel a service request?',
    a: 'Open "Service Providers", locate your active booking under "My Requests", tap "View Details" and select "Cancel Request" before the vendor dispatches their team.'
  },
  {
    id: 'faq-4',
    category: 'Payments',
    q: 'Where can I view invoices?',
    a: 'All generated supply and retainer invoices are accessible under "Procurement History" or "Payments & Billing" section, where you can download official PDF receipts.'
  },
  {
    id: 'faq-5',
    category: 'Compliance',
    q: 'How do I replace an expired document?',
    a: 'Visit the "Compliance" tab, locate the document marked as expired, tap "Upload Renewal Document", attach your updated license, and submit for verification.'
  },
  {
    id: 'faq-6',
    category: 'Manpower',
    q: 'How do I request a replacement candidate?',
    a: 'Go to Manpower Staff Records, select the active placement, tap "Request Replacement", and provide the reason. A replacement candidate will be assigned within 48 hours.'
  },
  {
    id: 'faq-7',
    category: 'Marketing',
    q: 'How do I track active marketing campaigns?',
    a: 'Go to Growth & Marketing, click on "Active Campaigns" to monitor impression counts, leads generated, and spend analytics in real time.'
  }
];

export default function HelpAndSupportScreen() {
  const { width } = useWindowDimensions();
  const auth = useContext(AuthContext);
  const user = auth?.userData;

  // Screen Tabs
  const [activeTab, setActiveTab] = useState('My Tickets');

  // Tickets State & Filters
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = async () => {
    try {
      const res = await fetchOwnerSupportTicketsApi(user?.id, auth?.userRole || 'owner');
      if (res && res.success && res.data) {
        const mapped = res.data.map(t => ({
          id: t.ticketId || t.id,
          category: t.category,
          subject: t.subject,
          description: t.message,
          relatedRecord: t.relatedTo,
          priority: t.priority,
          status: t.status,
          createdAt: new Date(t.createdAt).toLocaleDateString(),
          lastUpdated: new Date(t.updatedAt).toLocaleDateString()
        }));
        setTickets(mapped);
      }
    } catch (err) {
      console.warn('Fetch owner support tickets note:', err?.message);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user?.id]);

  // FAQ State & Search & Category
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Submit Modal
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  // Status Filter Counts
  const filterCounts = useMemo(() => {
    const counts = { All: tickets.length };
    STATUS_FILTERS.forEach(f => {
      if (f !== 'All') {
        counts[f] = tickets.filter(t => t.status === f).length;
      }
    });
    return counts;
  }, [tickets]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    if (statusFilter === 'All') return tickets;
    return tickets.filter(t => t.status === statusFilter);
  }, [tickets, statusFilter]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = faqCategoryFilter === 'All' || faq.category === faqCategoryFilter;
      const matchesSearch = !faqSearch.trim() ||
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, faqCategoryFilter, faqSearch]);

  const handleTicketSubmitted = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Open':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'In Progress':
        return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'Awaiting Response':
        return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' };
      case 'Resolved':
        return { bg: '#E6F4EA', text: '#16B77A', border: '#A7F3D0' };
      case 'Closed':
        return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
      default:
        return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER BLOCK */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTextCol}>
            <Text style={styles.pageTitle}>Help & Support</Text>
            <Text style={styles.pageSubtitle}>Manage your support tickets and find quick answers.</Text>
          </View>
          <TouchableOpacity
            style={styles.createTicketHeaderBtn}
            onPress={() => setSubmitModalVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.createTicketHeaderBtnText}>Create Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* TOP LEVEL NAVIGATION TABS */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'My Tickets' && styles.mainTabActive]}
            onPress={() => setActiveTab('My Tickets')}
          >
            <Text style={[styles.mainTabText, activeTab === 'My Tickets' && styles.mainTabTextActive]}>
              My Tickets ({tickets.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'FAQs' && styles.mainTabActive]}
            onPress={() => setActiveTab('FAQs')}
          >
            <Text style={[styles.mainTabText, activeTab === 'FAQs' && styles.mainTabTextActive]}>
              FAQs
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABS CONTENT */}
        {activeTab === 'My Tickets' ? (
          <View style={styles.tabContentContainer}>
            {/* HORIZONTAL COMPACT STATUS PILLS */}
            <View style={styles.filterPillsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterPillsScroll}
              >
                {STATUS_FILTERS.map((st) => {
                  const isSelected = statusFilter === st;
                  const count = filterCounts[st] || 0;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusPill,
                        isSelected ? styles.statusPillActive : styles.statusPillInactive
                      ]}
                      onPress={() => setStatusFilter(st)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusPillText, isSelected ? styles.statusPillTextActive : styles.statusPillTextInactive]}>
                        {st} ({count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* TICKET LIST OR EMPTY STATE */}
            {filteredTickets.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <View style={styles.emptyIconBox}>
                  <MessageSquare size={28} color={COLORS.secondaryText} />
                </View>
                <Text style={styles.emptyTitle}>No support tickets yet</Text>
                <Text style={styles.emptyMessage}>
                  {statusFilter === 'All'
                    ? 'Need help? Create a ticket and our support team will assist you.'
                    : `No support tickets currently found under "${statusFilter}".`}
                </Text>
                <TouchableOpacity
                  style={styles.emptyCreateBtn}
                  onPress={() => setSubmitModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Plus size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.emptyCreateBtnText}>Create Ticket</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                style={styles.ticketScroll}
                contentContainerStyle={styles.ticketScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {filteredTickets.map((tkt) => {
                  const badgeStyle = getStatusBadgeStyle(tkt.status);
                  return (
                    <View key={tkt.id} style={styles.ticketCard}>
                      <View style={styles.tktTopRow}>
                        <Text style={styles.tktIdText}>{tkt.id}</Text>
                        <View style={[styles.tktStatusBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                          <Text style={[styles.tktStatusText, { color: badgeStyle.text }]}>
                            {tkt.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.tktSubjectText}>{tkt.subject}</Text>

                      <Text style={styles.tktCategoryPriorityText}>
                        {tkt.category}  •  <Text style={{ color: COLORS.navy, fontWeight: '700' }}>{tkt.priority}</Text>
                      </Text>

                      {tkt.relatedRecord ? (
                        <View style={styles.relatedRecordBox}>
                          <Text style={styles.relatedRecordText} numberOfLines={1}>{tkt.relatedRecord}</Text>
                        </View>
                      ) : null}

                      <View style={styles.tktFooterRow}>
                        <View style={styles.updatedTimeCol}>
                          <Text style={styles.updatedTimeLabel}>Last Updated:</Text>
                          <Text style={styles.updatedTimeVal}>{tkt.lastUpdated}</Text>
                        </View>

                        <TouchableOpacity
                          style={styles.viewTicketBtn}
                          onPress={() => setSelectedTicket(tkt)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.viewTicketBtnText}>View Ticket</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                <View style={{ height: 24 }} />
              </ScrollView>
            )}
          </View>
        ) : (
          /* FAQs TAB CONTENT */
          <View style={styles.tabContentContainer}>
            {/* SEARCH INPUT */}
            <View style={styles.faqSearchBox}>
              <Search size={18} color={COLORS.secondaryText} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.faqSearchInput}
                value={faqSearch}
                onChangeText={setFaqSearch}
                placeholder="Search FAQs..."
                placeholderTextColor="#94A3B8"
              />
              {faqSearch.length > 0 ? (
                <TouchableOpacity onPress={() => setFaqSearch('')}>
                  <X size={16} color={COLORS.secondaryText} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* CATEGORY PILLS */}
            <View style={styles.filterPillsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterPillsScroll}
              >
                {FAQ_CATEGORIES.map((cat) => {
                  const isSelected = faqCategoryFilter === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.statusPill,
                        isSelected ? styles.statusPillActive : styles.statusPillInactive
                      ]}
                      onPress={() => setFaqCategoryFilter(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusPillText, isSelected ? styles.statusPillTextActive : styles.statusPillTextInactive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ACCORDION FAQ LIST */}
            <ScrollView
              style={styles.ticketScroll}
              contentContainerStyle={styles.ticketScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredFaqs.length === 0 ? (
                <View style={styles.emptyFaqCard}>
                  <Text style={styles.emptyFaqTitle}>No FAQs found</Text>
                  <Text style={styles.emptyFaqDesc}>Try searching with different keywords or select another category.</Text>
                </View>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <View key={faq.id} style={styles.faqAccordionCard}>
                      <TouchableOpacity
                        style={styles.faqAccordionHeader}
                        onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.faqHeaderLeft}>
                          <Text style={styles.faqQuestionText}>{faq.q}</Text>
                          <View style={styles.faqCategoryBadge}>
                            <Text style={styles.faqCategoryBadgeText}>{faq.category}</Text>
                          </View>
                        </View>
                        {isExpanded ? (
                          <ChevronUp size={20} color={COLORS.navy} />
                        ) : (
                          <ChevronDown size={20} color={COLORS.secondaryText} />
                        )}
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.faqAccordionBody}>
                          <Text style={styles.faqAnswerText}>{faq.a}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        )}

        {/* SUBMIT SUPPORT TICKET MODAL */}
        <SubmitSupportTicketModal
          visible={submitModalVisible}
          onClose={() => setSubmitModalVisible(false)}
          onSubmitSuccess={(newTicket) => {
            setTickets(prev => [newTicket, ...prev]);
            loadTickets();
          }}
          onViewTicket={(tkt) => setSelectedTicket(tkt)}
        />

        {/* TICKET DETAILS MODAL */}
        <TicketDetailsModal
          visible={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },

  /* HEADER BLOCK */
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTextCol: { flex: 1, marginRight: 12 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primaryText },
  pageSubtitle: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  createTicketHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 12,
  },
  createTicketHeaderBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  /* TABS */
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mainTab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  mainTabActive: {
    borderBottomColor: COLORS.navy,
  },
  mainTabText: { fontSize: 14, fontWeight: '600', color: COLORS.secondaryText },
  mainTabTextActive: { color: COLORS.navy, fontWeight: '800' },

  /* CONTENT CONTAINER */
  tabContentContainer: { flex: 1, paddingTop: 12 },

  /* STATUS FILTER PILLS */
  filterPillsWrapper: { marginBottom: 12 },
  filterPillsScroll: { paddingHorizontal: 16, gap: 8 },
  statusPill: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusPillActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  statusPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.border,
  },
  statusPillText: { fontSize: 12, fontWeight: '600' },
  statusPillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  statusPillTextInactive: { color: COLORS.primaryText },

  /* TICKETS SCROLL */
  ticketScroll: { flex: 1 },
  ticketScrollContent: { paddingHorizontal: 16 },

  /* TICKET CARD */
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tktTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tktIdText: { fontSize: 13, fontWeight: '800', color: COLORS.navy },
  tktStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tktStatusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  tktSubjectText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryText,
    marginBottom: 6,
    lineHeight: 20,
  },
  tktCategoryPriorityText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 8,
  },

  relatedRecordBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  relatedRecordText: { fontSize: 11, fontWeight: '600', color: COLORS.navy },

  tktFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  updatedTimeCol: { flex: 1 },
  updatedTimeLabel: { fontSize: 10, color: COLORS.secondaryText },
  updatedTimeVal: { fontSize: 11, fontWeight: '700', color: COLORS.primaryText, marginTop: 1 },

  viewTicketBtn: {
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: COLORS.navy,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  viewTicketBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.navy },

  /* EMPTY STATE CARD (MAX 220-250px HEIGHT) */
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 240,
    alignSelf: 'stretch',
    shadowColor: '#071B3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryText, marginBottom: 4 },
  emptyMessage: { fontSize: 12, color: COLORS.secondaryText, textAlign: 'center', lineHeight: 17, marginBottom: 14 },
  emptyCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
  },
  emptyCreateBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  /* FAQ STYLES */
  faqSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  faqSearchInput: { flex: 1, fontSize: 14, color: COLORS.primaryText },

  faqAccordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  faqAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  faqHeaderLeft: { flex: 1, marginRight: 10 },
  faqQuestionText: { fontSize: 14, fontWeight: '700', color: COLORS.primaryText, lineHeight: 19 },
  faqCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  faqCategoryBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.secondaryText },

  faqAccordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  faqAnswerText: { fontSize: 13, color: COLORS.secondaryText, lineHeight: 19 },

  emptyFaqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  emptyFaqTitle: { fontSize: 15, fontWeight: '800', color: COLORS.primaryText, marginBottom: 4 },
  emptyFaqDesc: { fontSize: 12, color: COLORS.secondaryText, textAlign: 'center' },
});
