import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const MOCK_REVIEWS = [
  { id: '1', client: 'The Meridian Grand', date: '12 Jul 2026', rating: 5, comment: 'Excellent quality Basmati Rice. Delivered exactly on time.' },
  { id: '2', client: 'Café Zephyr', date: '10 Jul 2026', rating: 4, comment: 'Good quality, but packaging was slightly damaged on one box.' },
  { id: '3', client: 'Azure Palace', date: '05 Jul 2026', rating: 5, comment: 'Consistent quality as always. Very satisfied.' }
];

export default function RawMaterialReviewsPage() {
  const renderStars = (rating) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={14} color={s <= rating ? '#F59E0B' : '#E2E8F0'} fill={s <= rating ? '#F59E0B' : 'transparent'} />
        ))}
      </View>
    );
  };

  const renderReviewCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <View style={styles.ratingRow}>{renderStars(item.rating)}</View>
      <Text style={styles.commentText}>{item.comment}</Text>
      <TouchableOpacity style={styles.replyBtn}>
        <MessageSquare size={16} color={NAVY} />
        <Text style={styles.replyBtnText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reviews</Text>
        </View>

        <FlatList
          data={MOCK_REVIEWS}
          keyExtractor={item => item.id}
          renderItem={renderReviewCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <Text style={styles.avgRating}>4.8</Text>
                {renderStars(5)}
                <Text style={styles.totalReviews}>124 Reviews</Text>
              </View>
              <View style={styles.summaryRight}>
                {[5, 4, 3, 2, 1].map((star, idx) => {
                  const width = star === 5 ? '80%' : star === 4 ? '15%' : '0%';
                  return (
                    <View key={star} style={styles.distRow}>
                      <Text style={styles.distLabel}>{star}</Text>
                      <View style={styles.distBarBg}><View style={[styles.distBarFill, { width }]} /></View>
                    </View>
                  );
                })}
              </View>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NAVY },
  listContent: { padding: 16, paddingBottom: 80 },
  summaryCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12,
    marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1
  },
  summaryLeft: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  avgRating: { fontSize: 36, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  totalReviews: { fontSize: 12, color: '#64748B', marginTop: 4 },
  summaryRight: { flex: 1.5, paddingLeft: 16, justifyContent: 'center' },
  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  distLabel: { fontSize: 12, color: '#64748B', width: 12 },
  distBarBg: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginLeft: 8 },
  distBarFill: { height: 6, backgroundColor: '#F59E0B', borderRadius: 3 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  clientName: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  dateText: { fontSize: 12, color: '#64748B' },
  ratingRow: { marginBottom: 8 },
  commentText: { fontSize: 14, color: '#334155', lineHeight: 20, marginBottom: 16 },
  replyBtn: { flexDirection: 'row', alignItems: 'center' },
  replyBtnText: { fontSize: 14, fontWeight: '600', color: NAVY, marginLeft: 6 },
});
