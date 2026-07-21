import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { History, Search, ChevronRight } from 'lucide-react-native';

const NAVY = '#081A3A';
const BG = '#F8FAFC';

const MOCK_HISTORY = [
  { id: 'H1', type: 'Requirement', name: 'Wait Staff', business: 'Cafe Mocha', date: '15 Jul 2026', status: 'Completed' },
  { id: 'H2', type: 'Candidate', name: 'Amit Kumar', business: 'Olive Bar', date: '12 Jul 2026', status: 'Candidate Selected' },
  { id: 'H3', type: 'Staff Record', name: 'Rajesh Patel', business: 'The Leela', date: '10 Jul 2026', status: 'Left' },
];

export default function ManpowerHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Requirements', 'Candidates', 'Staff Records'];

  const filteredHistory = MOCK_HISTORY.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Requirements' && item.type === 'Requirement') return true;
    if (activeFilter === 'Candidates' && item.type === 'Candidate') return true;
    if (activeFilter === 'Staff Records' && item.type === 'Staff Record') return true;
    return false;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>History</Text>
        <Text style={styles.pageSubtitle}>View previous manpower activities.</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748B" />
          <Text style={styles.searchText}>Search history...</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredHistory.map(item => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.typeBadge}>
                <History size={12} color={NAVY} style={{marginRight: 4}} />
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBusiness}>{item.business}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.statusText}>{item.status}</Text>
              <TouchableOpacity style={styles.detailsBtn}>
                <Text style={styles.detailsBtnText}>View Details</Text>
                <ChevronRight size={14} color={NAVY} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16,  padding: 16, paddingBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: '#64748B' },
  
  searchContainer: { paddingHorizontal: 16, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchText: { color: '#94A3B8', fontSize: 14, marginLeft: 8 },
  
  filterContainer: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  historyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: 'bold', color: NAVY },
  dateText: { fontSize: 12, color: '#64748B' },
  
  cardBody: { marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  itemBusiness: { fontSize: 13, color: '#64748B' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  statusText: { fontSize: 13, fontWeight: '600', color: '#10B981' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsBtnText: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginRight: 2 },
});
