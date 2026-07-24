import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { Truck, Search, CheckCircle, Clock, MapPin, MessageSquare, Package, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

const ORDERS = [];

const CAT_COLORS = {
  "raw-material": "#D4940A",
  "manpower": "#3B7FE0",
  "service": "#0FA668",
  "marketing": "#9B5CF6",
};

const STATUS_META = {
  "Confirmed": { color: "#3B7FE0", bg: "rgba(59,127,224,0.12)" },
  "Dispatched": { color: "#D4940A", bg: "rgba(212,148,10,0.12)" },
  "In-Transit": { color: "#9B5CF6", bg: "rgba(155,92,246,0.12)" },
  "Delivered": { color: "#0FA668", bg: "rgba(15,166,104,0.12)" },
};

export default function OrderTrackingPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');

  const [selectedOrder, setSelectedOrder] = useState(ORDERS[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewingDetail, setViewingDetail] = useState(false);
  
  const statusFilters = ["All", "Confirmed", "Dispatched", "In-Transit", "Delivered"];
  
  const filteredOrders = ORDERS.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      {(!isMobile || !viewingDetail) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: "rgba(155,92,246,0.1)" }]}>
              <Truck size={24} color="#9B5CF6" />
            </View>
            <View>
              <Text style={styles.pageTitle}>Order Track</Text>
              <Text style={styles.pageDesc}>Live status monitoring and timeline updates</Text>
            </View>
          </View>
        </View>
      )}

      {/* Status Filters */}
      {(!isMobile || !viewingDetail) && (
        isMobile ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4, paddingBottom: 12 }} 
            style={{ maxHeight: 60, marginBottom: 8 }}
          >
            {statusFilters.map(s => {
              const isActive = filterStatus === s;
              const meta = STATUS_META[s];
              return (
                <TouchableOpacity 
                  key={s} 
                  onPress={() => setFilterStatus(s)}
                  style={[
                    styles.filterBtn,
                    isActive && { 
                      backgroundColor: meta ? meta.bg : "rgba(212,148,10,0.1)",
                      borderColor: meta ? meta.color : "#D4940A",
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text style={[
                    styles.filterBtnText,
                    isActive && { color: meta ? meta.color : "#D4940A", fontWeight: 'bold' }
                  ]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.filterGroup}>
            {statusFilters.map(s => {
              const isActive = filterStatus === s;
              const meta = STATUS_META[s];
              return (
                <TouchableOpacity 
                  key={s} 
                  onPress={() => setFilterStatus(s)}
                  style={[
                    styles.filterBtn,
                    isActive && { 
                      backgroundColor: meta ? meta.bg : "rgba(212,148,10,0.1)",
                      borderColor: meta ? meta.color : "#D4940A",
                      borderWidth: 1
                    }
                  ]}
                >
                  <Text style={[
                    styles.filterBtnText,
                    isActive && { color: meta ? meta.color : "#D4940A", fontWeight: 'bold' }
                  ]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )
      )}

      <View style={styles.contentGrid}>
        {(!isMobile || !viewingDetail) && (
          <View style={[styles.listContainer, isMobile && { flex: 1, width: '100%', minWidth: 'auto', maxHeight: '100%', borderWidth: 0 }]}>
            <View style={styles.searchBox}>
              <Search size={16} color={colors.muted} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search active orders..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor={colors.muted}
              />
            </View>
            
            <ScrollView style={styles.listScroll}>
              {filteredOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No active orders found.</Text>
                </View>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  const meta = STATUS_META[order.status];
                  return (
                    <TouchableOpacity 
                      key={order.id}
                      onPress={() => {
                        setSelectedOrder(order);
                        if (isMobile) setViewingDetail(true);
                      }}
                      style={[
                        styles.orderCard,
                        isSelected && !isMobile && styles.orderCardSelected,
                        isSelected && !isMobile && { borderLeftColor: CAT_COLORS[order.category] }
                      ]}
                    >
                      <View style={styles.orderCardHeader}>
                        <Text style={[styles.orderId, { color: CAT_COLORS[order.category] }]}>{order.id}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                          <Text style={[styles.statusText, { color: meta.color }]}>{order.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.orderTitle}>{order.title}</Text>
                      <View style={styles.orderMetaRow}>
                        <Text style={styles.orderVendor}>{order.vendor}</Text>
                        <Text style={styles.orderEta}>ETA: {order.eta}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        )}

        {(!isMobile || viewingDetail) && (
          <View style={[styles.detailContainer, isMobile && { flex: 1, width: '100%', minWidth: 'auto', maxHeight: '100%', borderWidth: 0 }]}>
            {selectedOrder ? (
              <View style={{ flex: 1 }}>
                {isMobile && (
                  <TouchableOpacity 
                    onPress={() => setViewingDetail(false)}
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: 16, 
                      borderBottomWidth: 1, 
                      borderBottomColor: '#E2E8F0',
                      backgroundColor: '#F8FAFC'
                    }}
                  >
                    <ArrowLeft size={16} color="#1E40AF" />
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E40AF' }}>Back to Active Orders</Text>
                  </TouchableOpacity>
                )}
                <ScrollView style={styles.detailScroll}>
                  <View style={styles.detailHeader}>
                    <View style={styles.detailHeaderTop}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={[styles.detailId, { color: CAT_COLORS[selectedOrder.category] }]}>{selectedOrder.id}</Text>
                        <Text style={styles.detailTitle}>{selectedOrder.title}</Text>
                        <Text style={styles.detailSub}>{selectedOrder.vendor} · {selectedOrder.qty}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: STATUS_META[selectedOrder.status].bg, paddingVertical: 6, paddingHorizontal: 12, height: 32 }]}>
                        <Text style={[styles.statusText, { color: STATUS_META[selectedOrder.status].color, fontSize: 12 }]}>{selectedOrder.status}</Text>
                      </View>
                    </View>

                    {/* Progress Visual Mock */}
                    <View style={styles.progressTracker}>
                       {['Confirmed', 'Dispatched', 'In-Transit', 'Delivered'].map((step, index) => {
                         const isDone = ['Confirmed', 'Dispatched', 'In-Transit', 'Delivered'].indexOf(selectedOrder.status) >= index;
                         return (
                           <View key={step} style={styles.progressStep}>
                             <View style={[
                               styles.progressCircle, 
                               isDone ? { backgroundColor: STATUS_META[step].bg, borderColor: STATUS_META[step].color } : {}
                             ]}>
                               {isDone && <CheckCircle size={12} color={STATUS_META[step].color} />}
                             </View>
                             <Text style={[styles.progressText, isDone && { color: STATUS_META[step].color, fontWeight: 'bold' }]}>{step}</Text>
                           </View>
                         );
                       })}
                    </View>
                  </View>

                  <View style={styles.timelineSection}>
                    <Text style={styles.sectionTitle}>ACTIVITY TIMELINE</Text>
                    <View style={styles.timeline}>
                      {selectedOrder.updates.map((update, i) => (
                        <View key={i} style={styles.timelineItem}>
                          <View style={[
                            styles.timelineDot, 
                            i === 0 && { backgroundColor: CAT_COLORS[selectedOrder.category], borderColor: CAT_COLORS[selectedOrder.category] }
                          ]} />
                          <View style={styles.timelineContent}>
                            <Text style={[styles.timelineMessage, i === 0 && styles.timelineMessageLatest]}>{update.message}</Text>
                            {update.location ? (
                              <View style={styles.locationRow}>
                                <MapPin size={12} color={colors.muted} />
                                <Text style={styles.timelineLocation}>{update.location}</Text>
                              </View>
                            ) : null}
                            <Text style={styles.timelineTime}>{update.time}</Text>
                          </View>
                        </View>
                      ))}
                      {/* Vertical line connecting dots */}
                      <View style={styles.timelineLine} />
                    </View>
                  </View>

                  <TouchableOpacity style={styles.chatBtn}>
                    <MessageSquare size={16} color="#1E40AF" />
                    <Text style={styles.chatBtnText}>Chat with Vendor</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              <View style={styles.emptyStateCenter}>
                <Text style={styles.emptyText}>Select an order to view live transit details</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  header: { minHeight: 90, paddingTop: 40, paddingBottom: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.dark,
  },
  pageDesc: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(15,23,42,0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterBtnText: {
    fontSize: 12,
    color: colors.muted,
  },
  contentGrid: {
    flex: 1,
    flexDirection: Platform.OS === 'web' && Platform.isPad === false ? 'row' : 'column',
    gap: 20,
    ...(Platform.OS === 'web' ? { display: 'flex', flexDirection: 'row' } : {})
  },
  listContainer: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    maxHeight: 600,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    outlineStyle: 'none',
  },
  listScroll: {
    flex: 1,
  },
  orderCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  orderCardSelected: {
    backgroundColor: 'rgba(15,23,42,0.02)',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  orderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderVendor: {
    fontSize: 12,
    color: colors.muted,
  },
  orderEta: {
    fontSize: 12,
    color: colors.muted,
  },
  detailContainer: {
    flex: 2,
    minWidth: 400,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    maxHeight: 600,
  },
  detailScroll: {
    flex: 1,
  },
  detailHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  detailId: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  detailSub: {
    fontSize: 14,
    color: colors.muted,
  },
  progressTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.03)',
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  timelineSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 16,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 12,
  },
  timelineLine: {
    position: 'absolute',
    left: 17,
    top: 10,
    bottom: 20,
    width: 2,
    backgroundColor: 'rgba(15,23,42,0.06)',
    zIndex: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 16,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineMessage: {
    fontSize: 14,
    color: colors.sub,
    marginBottom: 4,
  },
  timelineMessageLatest: {
    color: colors.dark,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineLocation: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 4,
  },
  timelineTime: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
  },
  chatBtnText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
  },
});
