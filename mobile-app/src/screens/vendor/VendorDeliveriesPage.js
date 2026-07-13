import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Truck, Search, Eye, MapPin } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const DELIVERIES_DATA = [
  { id: "DEL-2026-291", orderId: "ORD-211", client: "The Meridian Grand", address: "Hotel - Bandra, Mumbai", item: "Premium Basmati Rice", qty: "500 kg", date: "18 Jun 2026", time: "Today 7:30 AM", driver: "Ravi Kumar", driverStatus: "Out for Delivery", amount: "₹21,000", status: "In Transit" },
  { id: "DEL-2026-287", orderId: "ORD-287", client: "Azure Palace Hotel", address: "Hotel - Juhu, Mumbai", item: "Atlantic Salmon Fillet", qty: "80 kg", date: "15 Jun 2026", time: "Delivered", driver: "Suresh Nair", driverStatus: "Delivered", amount: "₹78,400", status: "Delivered" },
  { id: "DEL-2026-283", orderId: "ORD-283", client: "Café Zephyr Group", address: "Café - Lower Parel, Mumbai", item: "Fresh Vegetables Pack", qty: "200 kg", date: "14 Jun 2026", time: "Delivered", driver: "Mukesh Yadav", driverStatus: "Delivered", amount: "₹8,200", status: "Delivered" },
  { id: "DEL-2026-280", orderId: "ORD-280", client: "The Grand Bistro", address: "Restaurant - Fort, Mumbai", item: "Toor Dal + Chana Dal", qty: "80 kg", date: "18 Jun 2026", time: "Tomorrow 10:00 AM", driver: "Ravi Kumar", driverStatus: "Out for Delivery", amount: "₹11,400", status: "Scheduled" },
  { id: "DEL-2026-279", orderId: "ORD-279", client: "Spice Route Restaurant", address: "Restaurant - Andheri, Mumbai", item: "Kashmiri Red Chilli", qty: "25 kg", date: "15 Jun 2026", time: "Delivered", driver: "Anand Patil", driverStatus: "Delivered", amount: "₹13,000", status: "Delivered" },
  { id: "DEL-2026-276", orderId: "ORD-276", client: "The Meridian Grand", address: "Hotel - Bandra, Mumbai", item: "Refined Sunflower Oil", qty: "100 L", date: "19 Jun 2026", time: "11 Jun, 8:00 AM", driver: "Add Driver", driverStatus: "Add Driver", amount: "₹14,500", status: "Pending" },
];

export default function VendorDeliveriesPage() {
  return (
    <View style={styles.container}>
      {/* Header Matches the Image */}
      <View style={styles.header}>
         <View>
           <Text style={styles.pageTitle}>Deliveries</Text>
           <Text style={styles.pageSubtitle}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner with Icon & Live Tracking */}
        <View style={styles.banner}>
           <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
             <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
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

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}}>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { borderTopColor: '#3B82F6', borderTopWidth: 2 }]}>
              <Text style={[styles.statValue, { color: '#1E293B' }]}>10</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: '#10B981', borderTopWidth: 2, backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>5</Text>
              <Text style={[styles.statLabel, {color: '#10B981'}]}>Delivered</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: '#8B5CF6', borderTopWidth: 2, backgroundColor: '#F5F3FF' }]}>
              <Text style={[styles.statValue, { color: '#8B5CF6' }]}>1</Text>
              <Text style={[styles.statLabel, {color: '#8B5CF6'}]}>In Transit</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: '#F59E0B', borderTopWidth: 2, backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>2</Text>
              <Text style={[styles.statLabel, {color: '#F59E0B'}]}>Scheduled</Text>
            </View>
            <View style={[styles.statCard, { borderTopColor: '#3B82F6', borderTopWidth: 2, backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.statValue, { color: '#3B82F6' }]}>1</Text>
              <Text style={[styles.statLabel, {color: '#3B82F6'}]}>Pending</Text>
            </View>
          </View>
        </ScrollView>

        {/* Search Bar Row with Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}}>
           <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                 <Search size={16} color="#94A3B8" />
                 <Text style={{color: '#94A3B8', fontSize: 12, marginLeft: 8}}>Search deliveries, clients...</Text>
              </View>
              
              <View style={styles.filterPills}>
                 <TouchableOpacity style={[styles.pill, {backgroundColor: '#FFFBEB', borderColor: '#FDE68A'}]}>
                    <Text style={[styles.pillText, {color: '#D97706'}]}>All 10</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.pill, {backgroundColor: '#F8FAFC'}]}>
                    <Text style={styles.pillText}>In Transit 1</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.pill, {backgroundColor: '#F8FAFC'}]}>
                    <Text style={styles.pillText}>Scheduled 2</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.pill, {backgroundColor: '#F8FAFC'}]}>
                    <Text style={styles.pillText}>Delivered 5</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.pill, {backgroundColor: '#F8FAFC'}]}>
                    <Text style={styles.pillText}>Pending 1</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </ScrollView>

        {/* Deliveries Mobile Cards */}
        <View style={styles.list}>
          {DELIVERIES_DATA.map((item, index) => (
            <View key={item.id} style={styles.card}>
              
              {/* Top Row: Client & ID */}
              <View style={styles.cardHeader}>
                 <View style={{flex: 1}}>
                    <Text style={styles.clientName} numberOfLines={1}>{item.client}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
                       <MapPin size={10} color="#64748B" />
                       <Text style={styles.clientAddress} numberOfLines={1}>{item.address}</Text>
                    </View>
                 </View>
                 <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.deliveryId}>{item.id}</Text>
                    <Text style={styles.orderId}>{item.orderId}</Text>
                 </View>
              </View>

              {/* Middle Row: Item & Details */}
              <View style={styles.cardMiddle}>
                 <View style={{flex: 1}}>
                    <Text style={styles.itemLabel}>ITEM / PRODUCT</Text>
                    <Text style={styles.itemText}>{item.item}</Text>
                 </View>
                 <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.itemLabel}>QTY</Text>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                 </View>
              </View>

              <View style={[styles.cardMiddle, { borderTopWidth: 0, paddingTop: 0 }]}>
                 <View style={{flex: 1}}>
                    <Text style={styles.itemLabel}>DELIVERY DATE</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={[styles.timeText, item.time.includes('Today') || item.time.includes('Tomorrow') ? {color: '#D97706'} : {}]}>{item.time}</Text>
                 </View>
                 <View style={{flex: 1}}>
                    <Text style={styles.itemLabel}>DRIVER</Text>
                    <Text style={styles.driverText}>{item.driver}</Text>
                    <View style={[styles.driverBadge, item.driverStatus === 'Add Driver' ? {backgroundColor: '#F59E0B'} : {backgroundColor: '#F1F5F9'}]}>
                       <Text style={[styles.driverBadgeText, item.driverStatus === 'Add Driver' ? {color: '#fff'} : {color: '#475569'}]}>{item.driverStatus}</Text>
                    </View>
                 </View>
              </View>

              {/* Bottom Row: Amount & Status */}
              <View style={styles.cardFooter}>
                 <View>
                    <Text style={styles.amountText}>{item.amount}</Text>
                 </View>
                 
                 <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                   <View style={[styles.statusBadge, item.status === 'Delivered' ? styles.statusGreen : item.status === 'In Transit' ? styles.statusPurple : item.status === 'Scheduled' ? styles.statusYellow : styles.statusBlue]}>
                      <Text style={[styles.statusText, item.status === 'Delivered' ? styles.statusTextGreen : item.status === 'In Transit' ? styles.statusTextPurple : item.status === 'Scheduled' ? styles.statusTextYellow : styles.statusTextBlue]}>{item.status}</Text>
                   </View>
                   <TouchableOpacity style={styles.actionBtn}>
                      <Eye size={16} color="#94A3B8" />
                   </TouchableOpacity>
                 </View>
              </View>

            </View>
          ))}
        </View>
        
        {/* Pagination Footer */}
        <View style={styles.pagination}>
           <Text style={styles.pageText}>Showing 1-6 of 10</Text>
           <View style={styles.pageControls}>
              <TouchableOpacity style={styles.pageBtn}><Text style={styles.pageBtnText}>{'<'}</Text></TouchableOpacity>
              <View style={styles.pageIndicator}><Text style={styles.pageIndicatorText}>1/2</Text></View>
              <TouchableOpacity style={styles.pageBtn}><Text style={styles.pageBtnText}>{'>'}</Text></TouchableOpacity>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  pageTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  pageSubtitle: { fontSize: 12, color: colors.muted, marginTop: 4 },
  
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  banner: { padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  iconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  bannerSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  
  liveTrackingBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FEF3C7', backgroundColor: '#FFFBEB', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  liveText: { fontSize: 10, fontWeight: '700', color: '#D97706' },
  
  statsContainer: { flexDirection: 'row', gap: 12, paddingRight: 16 },
  statCard: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#fff', minWidth: 100 },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#64748B', fontWeight: '600' },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, width: 220 },
  
  filterPills: { flexDirection: 'row', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff' },
  pillText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  
  list: { gap: 16, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  clientName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  clientAddress: { fontSize: 11, color: '#64748B', marginLeft: 4 },
  deliveryId: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  orderId: { fontSize: 11, color: '#94A3B8', textAlign: 'right', marginTop: 2 },
  
  cardMiddle: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  itemText: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  qtyText: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  
  dateText: { fontSize: 12, color: '#1E293B', fontWeight: '500' },
  timeText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  driverText: { fontSize: 12, color: '#1E293B', fontWeight: '500' },
  driverBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  driverBadgeText: { fontSize: 9, fontWeight: '600' },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC' },
  amountText: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusGreen: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  statusTextGreen: { color: '#059669' },
  statusPurple: { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' },
  statusTextPurple: { color: '#7C3AED' },
  statusYellow: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  statusTextYellow: { color: '#D97706' },
  statusBlue: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  statusTextBlue: { color: '#2563EB' },
  statusText: { fontSize: 11, fontWeight: '700' },
  
  actionBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  pageText: { fontSize: 12, color: '#64748B' },
  pageControls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  pageBtnText: { fontSize: 14, color: '#475569', fontWeight: '600' },
  pageIndicator: { paddingHorizontal: 12, height: 28, alignItems: 'center', justifyContent: 'center' },
  pageIndicatorText: { fontSize: 12, fontWeight: '700', color: '#0F172A' }
});
