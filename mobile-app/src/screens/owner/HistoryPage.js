import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, 
  Platform, Dimensions, Modal, KeyboardAvoidingView, FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  History, Search, SlidersHorizontal, Package, UsersRound, Wrench, 
  Megaphone, ChevronRight, ListChecks, Clock3, CircleCheck, 
  MoreVertical, Download, CalendarRange, X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const NAVY = '#071B3A';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F8FAFC';
const MUTED = '#94A3B8';
const GRAY = '#64748B';

const COLORS = {
  'raw-material': '#D97706', // Soft orange/gold
  'manpower': '#3B82F6', // Soft blue
  'service': '#10B981', // Soft green
  'marketing': '#8B5CF6', // Soft purple
};

const BG_COLORS = {
  'raw-material': '#FEF3C7',
  'manpower': '#EFF6FF',
  'service': '#D1FAE5',
  'marketing': '#F5F3FF',
};

const HISTORY_DATA = [];

const CAT_LABELS = {
  'raw-material': 'RAW MATERIAL',
  'manpower': 'MANPOWER',
  'service': 'SERVICE',
  'marketing': 'MARKETING'
};

const getStatusStyle = (status) => {
  const s = status.toLowerCase();
  if (s.includes('progress') || s.includes('active') || s.includes('processing') || s.includes('submitted')) {
    return { bg: '#FEF3C7', text: '#D97706' }; // Orange
  }
  if (s.includes('completed') || s.includes('delivered') || s.includes('closed')) {
    return { bg: '#D1FAE5', text: '#10B981' }; // Green
  }
  if (s.includes('cancelled') || s.includes('rejected')) {
    return { bg: '#FEE2E2', text: '#EF4444' }; // Red
  }
  return { bg: '#EFF6FF', text: '#3B82F6' }; // Blue (New, Open, Accepted, Scheduled)
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [moreMenu, setMoreMenu] = useState(false);
  const [filterSheet, setFilterSheet] = useState(false);

  const filtered = HISTORY_DATA.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                        o.vendor.toLowerCase().includes(search.toLowerCase()) || 
                        o.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || o.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalCount = HISTORY_DATA.length;
  const completedCount = HISTORY_DATA.filter(o => ['Completed', 'Delivered', 'Closed'].includes(o.status)).length;
  const inProgressCount = totalCount - completedCount - HISTORY_DATA.filter(o => ['Cancelled', 'Rejected'].includes(o.status)).length;

  const renderCard = ({ item }) => {
    const statStyle = getStatusStyle(item.status);
    const catColor = COLORS[item.category];
    const catBg = BG_COLORS[item.category];

    return (
      <View style={[styles.card, !isMobile && { width: '48%', marginRight: '2%' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.recordId}>{item.id}</Text>
          <View style={[styles.badge, { backgroundColor: statStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: catBg, alignSelf: 'flex-start', marginBottom: 12 }]}>
          <Text style={[styles.badgeText, { color: catColor }]}>{CAT_LABELS[item.category]}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardProvider} numberOfLines={1}>{item.vendor}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            {item.qty && <Text style={styles.metaText}>{item.qty} · </Text>}
            {item.amount && <Text style={styles.metaText}>{item.amount}</Text>}
          </View>
          <Text style={styles.metaText}>{item.date}</Text>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => { setSelectedRecord(item); setDetailsModal(true); }}>
            <Text style={[styles.actionText, { color: catColor }]}>View Details</Text>
            <ChevronRight size={16} color={catColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDetailsModal = () => {
    if (!selectedRecord) return null;
    const catColor = COLORS[selectedRecord.category];
    const statStyle = getStatusStyle(selectedRecord.status);

    let modalTitle = 'Activity Details';
    if (selectedRecord.category === 'raw-material') modalTitle = 'Raw Material Order Details';
    if (selectedRecord.category === 'manpower') modalTitle = 'Manpower Requirement Details';
    if (selectedRecord.category === 'service') modalTitle = 'Service Booking Details';
    if (selectedRecord.category === 'marketing') modalTitle = 'Marketing Project Details';

    return (
      <Modal visible={detailsModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setDetailsModal(false)}><X size={24} color={GRAY} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailId}>{selectedRecord.id}</Text>
                  <View style={[styles.badge, { backgroundColor: statStyle.bg, alignSelf: 'flex-start', marginTop: 4 }]}>
                    <Text style={[styles.badgeText, { color: statStyle.text }]}>{selectedRecord.status}</Text>
                  </View>
                </View>
                <View style={[styles.badge, { backgroundColor: BG_COLORS[selectedRecord.category] }]}>
                  <Text style={[styles.badgeText, { color: catColor }]}>{CAT_LABELS[selectedRecord.category]}</Text>
                </View>
              </View>

              <Text style={styles.detailTitle}>{selectedRecord.title}</Text>
              <Text style={styles.detailProvider}>{selectedRecord.vendor}</Text>

              <View style={styles.infoGrid}>
                {selectedRecord.qty && (
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoLabel}>QUANTITY / DURATION</Text>
                    <Text style={styles.infoValue}>{selectedRecord.qty}</Text>
                  </View>
                )}
                {selectedRecord.amount && (
                  <View style={styles.infoGridItem}>
                    <Text style={styles.infoLabel}>AMOUNT</Text>
                    <Text style={styles.infoValue}>{selectedRecord.amount}</Text>
                  </View>
                )}
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>DATE</Text>
                  <Text style={styles.infoValue}>{selectedRecord.date}</Text>
                </View>
              </View>

              <Text style={styles.sectionHeading}>Status Timeline</Text>
              <View style={styles.timelineBox}>
                {selectedRecord.timeline.map((step, idx) => (
                  <View key={idx} style={styles.timelineStep}>
                    <View style={styles.timelineDot} />
                    {idx !== selectedRecord.timeline.length - 1 && <View style={styles.timelineLine} />}
                    <Text style={styles.timelineText}>{step}</Text>
                  </View>
                ))}
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMoreMenu = () => (
    <Modal visible={moreMenu} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMoreMenu(false)}>
        <View style={styles.menuOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenu(false)}>
                <Download size={18} color={NAVY} /><Text style={styles.menuText}>Export History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => setMoreMenu(false)}>
                <CalendarRange size={18} color={NAVY} /><Text style={styles.menuText}>Select Date Range</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: isMobile ? (width < 340 ? 12 : 16) : 24 }]}>
        
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <History size={22} color={NAVY} />
              <Text style={styles.pageTitle}>Activity History</Text>
            </View>
            <Text style={styles.pageSubtitle}>Track orders, hiring requests, service bookings and marketing projects</Text>
          </View>
          <TouchableOpacity style={styles.moreBtn} onPress={() => setMoreMenu(true)}>
            <MoreVertical size={20} color={NAVY} />
          </TouchableOpacity>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>History Overview</Text>
          <View style={styles.overviewCols}>
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}><ListChecks size={18} color={'#3B82F6'} /></View>
              <Text style={styles.overviewVal}>{totalCount}</Text>
              <Text style={styles.overviewLabel}>Total Records</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}><Clock3 size={18} color={'#F59E0B'} /></View>
              <Text style={styles.overviewVal}>{inProgressCount}</Text>
              <Text style={styles.overviewLabel}>In Progress</Text>
            </TouchableOpacity>
            <View style={styles.overviewDivider} />
            <TouchableOpacity style={styles.overviewCol}>
              <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}><CircleCheck size={18} color={'#10B981'} /></View>
              <Text style={styles.overviewVal}>{completedCount}</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search size={18} color={MUTED} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search by ID, item, service or provider..." 
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={NAVY} />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <View style={styles.pillsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            <TouchableOpacity style={[styles.pill, filterCat === 'All' && styles.pillActive]} onPress={() => setFilterCat('All')}>
              <Text style={[styles.pillText, filterCat === 'All' && styles.pillTextActive]}>All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.pill, filterCat === 'raw-material' && styles.pillActive]} onPress={() => setFilterCat('raw-material')}>
              <Package size={14} color={filterCat === 'raw-material' ? WHITE : NAVY} style={{marginRight: 6}}/>
              <Text style={[styles.pillText, filterCat === 'raw-material' && styles.pillTextActive]}>Raw Material</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.pill, filterCat === 'manpower' && styles.pillActive]} onPress={() => setFilterCat('manpower')}>
              <UsersRound size={14} color={filterCat === 'manpower' ? WHITE : NAVY} style={{marginRight: 6}}/>
              <Text style={[styles.pillText, filterCat === 'manpower' && styles.pillTextActive]}>Manpower</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.pill, filterCat === 'service' && styles.pillActive]} onPress={() => setFilterCat('service')}>
              <Wrench size={14} color={filterCat === 'service' ? WHITE : NAVY} style={{marginRight: 6}}/>
              <Text style={[styles.pillText, filterCat === 'service' && styles.pillTextActive]}>Services</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.pill, filterCat === 'marketing' && styles.pillActive]} onPress={() => setFilterCat('marketing')}>
              <Megaphone size={14} color={filterCat === 'marketing' ? WHITE : NAVY} style={{marginRight: 6}}/>
              <Text style={[styles.pillText, filterCat === 'marketing' && styles.pillTextActive]}>Marketing</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Desktop Table Header (only if on web & large screen) */}
        {!isMobile && (
          <View style={styles.desktopTableHeader}>
            <Text style={[styles.th, { flex: 1.5 }]}>Record ID</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>Category</Text>
            <Text style={[styles.th, { flex: 3 }]}>Activity</Text>
            <Text style={[styles.th, { flex: 2 }]}>Provider</Text>
            <Text style={[styles.th, { flex: 2 }]}>Status</Text>
            <Text style={[styles.th, { flex: 1 }]}></Text>
          </View>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <History size={48} color={MUTED} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No activity history found</Text>
            <Text style={styles.emptyDesc}>Your orders, hiring requests, service bookings and marketing projects will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderCard}
            scrollEnabled={false}
            numColumns={isMobile ? 1 : 2}
            key={isMobile ? 'mobile' : 'desktop'}
            columnWrapperStyle={!isMobile && { justifyContent: 'flex-start' }}
          />
        )}

      </ScrollView>

      {renderDetailsModal()}
      {renderMoreMenu()}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  scrollContent: { paddingBottom: 115, maxWidth: 1320, alignSelf: 'center', width: '100%', paddingTop: 24 },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  pageSubtitle: { fontSize: 13, color: GRAY },
  moreBtn: { padding: 8, backgroundColor: WHITE, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },

  overviewCard: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  overviewCardTitle: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginBottom: 16, textAlign: 'center' },
  overviewCols: { flexDirection: 'row', alignItems: 'center' },
  overviewCol: { flex: 1, alignItems: 'center' },
  overviewDivider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  iconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  overviewVal: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  overviewLabel: { fontSize: 12, color: GRAY },

  searchFilterRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingHorizontal: 14, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: NAVY },
  filterBtn: { width: 44, height: 44, backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },

  pillsWrap: { marginBottom: 16 },
  pillsScroll: { gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: NAVY, borderColor: NAVY },
  pillText: { fontSize: 13, color: NAVY, fontWeight: '500' },
  pillTextActive: { color: WHITE },

  card: { backgroundColor: WHITE, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recordId: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  cardProvider: { fontSize: 14, color: GRAY, marginBottom: 12 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  metaLeft: { flexDirection: 'row' },
  metaText: { fontSize: 13, color: GRAY, fontWeight: '500' },

  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingLeft: 12 },
  actionText: { fontSize: 13, fontWeight: 'bold', marginRight: 2 },

  desktopTableHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC', marginBottom: 12, borderRadius: 8 },
  th: { fontSize: 12, fontWeight: 'bold', color: GRAY, textTransform: 'uppercase' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: GRAY, textAlign: 'center', lineHeight: 20 },

  // Modals & Menus
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContainer: { backgroundColor: WHITE, borderRadius: 20, width: '100%', maxWidth: 580, maxHeight: '84%', overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  modalScroll: { padding: 20 },
  
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  detailId: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailProvider: { fontSize: 16, color: GRAY, marginBottom: 20 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  infoGridItem: { width: isMobile ? '100%' : '45%', marginBottom: 8 },
  infoLabel: { fontSize: 11, color: MUTED, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 14, color: NAVY, fontWeight: '600' },

  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 16 },
  timelineBox: { paddingLeft: 8, marginBottom: 32 },
  timelineStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3B82F6', marginTop: 4, marginRight: 16, zIndex: 2 },
  timelineLine: { position: 'absolute', top: 16, left: 5, width: 2, height: 32, backgroundColor: '#EFF6FF', zIndex: 1 },
  timelineText: { fontSize: 14, color: NAVY, fontWeight: '500' },

  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  menuContent: { position: 'absolute', top: 80, right: 16, backgroundColor: WHITE, borderRadius: 12, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, minWidth: 200 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  menuText: { fontSize: 14, fontWeight: '500', color: NAVY },
});
