import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Truck, Search, Eye, MapPin } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const DELIVERIES_DATA = [];

export default function VendorDeliveriesPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.pageTitle}>Deliveries</Text>
                  <Text style={styles.pageSubtitle}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>
              </View>

              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={styles.banner}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={styles.iconBox}>
                        <Truck size={20} color="#D97706" />
                      </View>
                      <View>
                        <Text style={styles.bannerTitle}>Deliveries</Text>
                        <Text style={styles.bannerSub}>Track and manage all your outbound deliveries.</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.liveTrackingBtn}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>Live Tracking</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderTopColor: '#3B82F6', borderTopWidth: 2 }]}>
                      <Text style={[styles.statValue, { color: '#1E293B' }]}>0</Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: '#10B981', borderTopWidth: 2, backgroundColor: '#ECFDF5' }]}>
                      <Text style={[styles.statValue, { color: '#10B981' }]}>0</Text>
                      <Text style={[styles.statLabel, { color: '#10B981' }]}>Delivered</Text>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: '#F59E0B', borderTopWidth: 2 }]}>
                      <Text style={[styles.statValue, { color: '#1E293B' }]}>0</Text>
                      <Text style={styles.statLabel}>Scheduled</Text>
                    </View>
                    <View style={[styles.statCard, { borderTopColor: '#EF4444', borderTopWidth: 2 }]}>
                      <Text style={[styles.statValue, { color: '#1E293B' }]}>0</Text>
                      <Text style={styles.statLabel}>Pending</Text>
                    </View>
                  </View>
                </ScrollView>

                <View style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.searchBox, { flex: 1 }]}>
                      <Search size={16} color="#94A3B8" />
                      <TextInput style={{ color: '#0F172A', fontSize: 14, marginLeft: 8, flex: 1 }} placeholder="Search deliveries, clients..." placeholderTextColor="#94A3B8" />
                    </View>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8 }}>
                  <TouchableOpacity style={[styles.pill, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                    <Text style={[styles.pillText, { color: '#D97706' }]}>All 10</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.pill, { backgroundColor: '#F8FAFC' }]}>
                    <Text style={styles.pillText}>In Transit 1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.pill, { backgroundColor: '#F8FAFC' }]}>
                    <Text style={styles.pillText}>Scheduled 2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.pill, { backgroundColor: '#F8FAFC' }]}>
                    <Text style={styles.pillText}>Delivered 5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.pill, { backgroundColor: '#F8FAFC' }]}>
                    <Text style={styles.pillText}>Pending 1</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          }
          data={DELIVERIES_DATA}
          keyExtractor={item => item.id}
          numColumns={isMobile ? 1 : 2}
          key={isMobile ? 'one-col' : 'two-col'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
             <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 }}>
                <Truck size={32} color="#CBD5E1" />
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 6 }}>No deliveries scheduled</Text>
                <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 }}>Active delivery schedules will show up here.</Text>
             </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, !isMobile && { marginHorizontal: 8, flex: 0.5 }]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName} numberOfLines={1}>{item.client}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <MapPin size={10} color="#64748B" />
                    <Text style={styles.clientAddress} numberOfLines={1}>{item.address}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.deliveryId}>{item.id}</Text>
                  <Text style={styles.orderId}>{item.orderId}</Text>
                </View>
              </View>
              <View style={styles.cardMiddle}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemLabel}>ITEM / PRODUCT</Text>
                  <Text style={styles.itemText}>{item.item}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemLabel}>QTY</Text>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                </View>
              </View>
              <View style={[styles.cardMiddle, { borderTopWidth: 0, paddingTop: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemLabel}>DELIVERY DATE</Text>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={[styles.timeText, item.time.includes('Today') || item.time.includes('Tomorrow') ? { color: '#D97706' } : {}]}>{item.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemLabel}>DRIVER</Text>
                  <Text style={styles.driverText}>{item.driver}</Text>
                  <View style={[styles.driverBadge, item.driverStatus === 'Add Driver' ? { backgroundColor: '#F59E0B' } : { backgroundColor: '#F1F5F9' }]}>
                    <Text style={[styles.driverBadgeText, item.driverStatus === 'Add Driver' ? { color: '#fff' } : { color: '#475569' }]}>{item.driverStatus}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.amountText}>{item.amount}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.statusBadge, item.status === 'Delivered' ? styles.statusGreen : item.status === 'In Transit' ? styles.statusPurple : item.status === 'Scheduled' ? styles.statusYellow : styles.statusBlue]}>
                    <Text style={[styles.statusText, item.status === 'Delivered' ? styles.statusTextGreen : item.status === 'In Transit' ? styles.statusTextPurple : item.status === 'Scheduled' ? styles.statusTextYellow : styles.statusTextBlue]}>{item.status}</Text>
                  </View>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Eye size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({  container: { flex: 1, backgroundColor: '#F8FAFC', maxWidth: 1200, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  
  scrollContent: { paddingBottom: 40 },
  listContent: { paddingBottom: 115 },
  
  banner: { padding: 18, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#EAF0F6', marginBottom: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  bannerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  
  liveTrackingBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FEF3C7', backgroundColor: '#FFFBEB', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  
  statsContainer: { flexDirection: 'row', gap: 12, paddingRight: 16 },
  statCard: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EAF0F6', backgroundColor: '#fff', minWidth: 120, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, borderRadius: 14, height: 48, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  
  filterPills: { flexDirection: 'row', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  
  list: { gap: 16, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#EAF0F6', overflow: 'hidden', flex: 1, marginHorizontal: 16, marginBottom: 16, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  clientName: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2 },
  clientAddress: { fontSize: 12, color: '#64748B', marginLeft: 4, fontWeight: '500' },
  deliveryId: { fontSize: 13, fontWeight: '800', color: '#D97706' },
  orderId: { fontSize: 11, color: '#94A3B8', textAlign: 'right', marginTop: 2, fontWeight: '500' },
  
  cardMiddle: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 6 },
  itemText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  dateText: { fontSize: 13, color: '#0F172A', fontWeight: '700' },
  timeText: { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  driverText: { fontSize: 13, color: '#0F172A', fontWeight: '700' },
  driverBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  driverBadgeText: { fontSize: 10, fontWeight: '700' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: '#F8FAFC' },
  amountText: { fontSize: 16, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  statusGreen: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  statusTextGreen: { color: '#059669' },
  statusPurple: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  statusTextPurple: { color: '#7C3AED' },
  statusYellow: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  statusTextYellow: { color: '#D97706' },
  statusBlue: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  statusTextBlue: { color: '#2563EB' },
  statusText: { fontSize: 11, fontWeight: '800' },
  
  actionBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  pageText: { fontSize: 12, color: '#64748B' },
  pageControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  pageBtnText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  pageIndicator: { paddingHorizontal: 12, height: 28, alignItems: 'center', justifyContent: 'center' },
  pageIndicatorText: { fontSize: 12, fontWeight: '700', color: '#0F172A' }
});
