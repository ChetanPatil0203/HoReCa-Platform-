import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Alert, Platform, SafeAreaView, useWindowDimensions 
} from 'react-native';
import { 
  Building2, ChevronRight, TriangleAlert, Send
} from 'lucide-react-native';

const NAVY = '#071B3A';
const BG = '#F8FAFC';
const PURPLE = '#071B3A';

const INITIAL_FEED = [];

const CATEGORIES = ["All", "Social Media Marketing", "Content Creation", "SEO", "Performance Marketing", "Influencer Marketing"];

// Helper to format category for compact display
const formatCategory = (cat) => {
  if (cat === "Social Media Marketing") return "Social Media";
  if (cat === "Photography & Videography") return "Photo & Video";
  if (cat === "Performance Marketing") return "Performance Ads";
  return cat;
};

// Helper to format budget strictly for compact space
const formatBudget = (budgetStr) => {
  return budgetStr.replace(/,000/g, 'K').replace(/ /g, '');
};

export default function MarketingFeedWallScreen({ setActivePage }) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  const [feedItems, setFeedItems] = useState(INITIAL_FEED);
  const [activeCategory, setActiveCategory] = useState('All');

  const showToast = (msg) => {
    if (Platform.OS === 'web') { window.alert(msg); }
    else { Alert.alert('Success', msg); }
  };

  const getPrimaryBadge = (item) => {
    if (item.status === 'Proposal Sent') return 'Proposal Sent';
    if (item.status === 'Closed') return 'Closed';
    if (item.priority === 'High Priority') return 'High Priority';
    if (item.priority === 'Closing Soon') return 'Closing Soon';
    if (item.priority === 'New') return 'New';
    return null;
  };

  const renderBadge = (badgeText) => {
    if (!badgeText) return null;
    let bgColor = '#F1F5F9';
    let textColor = '#64748B';
    
    if (badgeText === 'Proposal Sent') { bgColor = '#F3E8FF'; textColor = '#7E22CE'; }
    else if (badgeText === 'High Priority') { bgColor = '#FEF2F2'; textColor = '#EF4444'; }
    else if (badgeText === 'Closing Soon') { bgColor = '#FFF7ED'; textColor = '#F97316'; }
    else if (badgeText === 'New') { bgColor = '#EFF6FF'; textColor = '#2563EB'; }

    return (
      <View style={[styles.priorityBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.priorityText, { color: textColor }]}>{badgeText}</Text>
      </View>
    );
  };

  const getActionDetails = (status, priority) => {
    let label = 'Send Proposal';
    let icon = <ChevronRight size={14} color="#FFF" style={{marginLeft: 4}} />;
    let isViewAction = false;
    
    if (status === 'Proposal Sent') {
      label = 'View Proposal';
      isViewAction = true;
    } else if (status === 'Closed') {
      label = 'View Details';
      isViewAction = true;
    }
    
    return { label, icon, isViewAction };
  };

  const filteredItems = feedItems.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    return true;
  });

  const renderItem = ({ item }) => {
    const badgeText = getPrimaryBadge(item);
    const { label: actionLabel, icon: actionIcon, isViewAction } = getActionDetails(item.status, item.priority);

    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => console.log('View Details', item.id)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.reqId}>{item.id}</Text>
          {renderBadge(badgeText)}
        </View>

        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.clientRow}>
          <Building2 size={14} color="#64748B" />
          <Text style={styles.clientText} numberOfLines={1}>
            {item.businessName} · {item.location}
          </Text>
        </View>

        <View style={[styles.metaRow, isSmallScreen && { flexWrap: 'wrap' }]}>
          <Text style={styles.metaTextVal}>{formatBudget(item.budget)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaTextVal}>{item.duration}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaTextVal}>{formatCategory(item.category)}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.postedText}>Posted {item.postedAt}</Text>
          <TouchableOpacity 
            style={[styles.actionBtn, isViewAction && styles.actionBtnOutline]}
            onPress={() => setActivePage(isViewAction ? 'view_details' : 'send_proposal')}
          >
            <Text style={[styles.actionBtnText, isViewAction && { color: PURPLE }]}>{actionLabel}</Text>
            {isViewAction ? 
              <ChevronRight size={14} color={PURPLE} style={{marginLeft: 2}} /> :
              <ChevronRight size={14} color="#FFF" style={{marginLeft: 2}} />
            }
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Feed Wall</Text>
          <Text style={styles.headerSubtitle}>Discover new marketing opportunities broadcasted by HoReCa owners.</Text>
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, activeCategory === item && styles.filterChipActive]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.filterChipText, activeCategory === item && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching opportunities</Text>
            <Text style={styles.emptySub}>Check back later or change your category filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  
  filtersWrapper: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  filterList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  filterChipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterChipTextActive: { color: '#FFF', fontWeight: 'bold' },

  listContent: { padding: 14, paddingBottom: 100, alignSelf: 'center', width: '100%', maxWidth: 800 },
  
  card: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reqId: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  priorityText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  title: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 5, lineHeight: 20 },
  
  clientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  clientText: { fontSize: 13, color: '#64748B', marginLeft: 6, flex: 1 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  metaTextVal: { fontSize: 13, fontWeight: '600', color: NAVY },
  metaDot: { color: '#CBD5E1', marginHorizontal: 6, fontSize: 13 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  postedText: { fontSize: 12, color: '#94A3B8' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: PURPLE, paddingHorizontal: 12, height: 36, borderRadius: 10, justifyContent: 'center' },
  actionBtnOutline: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#FFF' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY, marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B' },
});
