import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import {
  Activity, Clock, Search, CheckCircle, XCircle, MapPin,
  Calendar, Hash, User, AlertCircle, RefreshCw, Package, Phone
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { AuthContext } from '../../context/AuthContext';
import { fetchVendorOrders, vendorRespondOrder } from '../../services/api.service';

const FILTERS = ['All', 'pending', 'confirmed', 'cancelled'];

const FILTER_LABELS = {
  All: 'All',
  pending: 'New',
  confirmed: 'Accepted',
  cancelled: 'Rejected',
};

export default function VendorRequestsPage() {
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [respondingId, setRespondingId] = useState(null);

  // supplierId = the vendor's registration ID (from login response -> registration.id)
  const supplierId = user?.id;

  React.useEffect(() => {
    loadOrders();
  }, [supplierId]);

  const loadOrders = async () => {
    if (!supplierId) {
      setLoading(false);
      setError('Vendor ID not found. Please login again.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetchVendorOrders(supplierId);
      if (res?.success) {
        setOrders(res.data);
      } else {
        setError(res?.message || 'Failed to load orders.');
      }
    } catch (err) {
      console.error('VendorRequestsPage: fetchVendorOrders error:', err);
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (orderId, action) => {
    const label = action === 'confirmed' ? 'Accept' : 'Reject';
    Alert.alert(
      `${label} Order?`,
      `Are you sure you want to ${label.toLowerCase()} this order?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: label,
          style: action === 'confirmed' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setRespondingId(orderId);
              const res = await vendorRespondOrder(orderId, supplierId, action);
              if (res?.success) {
                // Update locally
                setOrders(prev =>
                  prev.map(o =>
                    o.id === orderId ? { ...o, status: action } : o
                  )
                );
              } else {
                Alert.alert('Error', res?.message || 'Failed to update order.');
              }
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.message || err.message || 'Something went wrong.');
            } finally {
              setRespondingId(null);
            }
          }
        }
      ]
    );
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const ownerName = o.owner?.bizName || '';
    const matchSearch = ownerName.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && (searchText === '' || matchSearch);
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Incoming Orders</Text>
            <Text style={styles.pageSubtitle}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadOrders}>
            <RefreshCw size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.bannerIconBox}>
            <Activity size={24} color="#F59E0B" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Raw Material Requests</Text>
            <Text style={styles.bannerSubtitle}>Procurement requests from hotels, restaurants and cafés in your area</Text>
          </View>
          <View style={styles.liveFeedBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveFeedText}>Live Feed</Text>
          </View>
        </View>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
            <Text style={[styles.statValue, { color: '#D97706' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Awaiting Response</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }]}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{stats.cancelled}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </ScrollView>

        {/* Search & Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by client name..."
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {FILTERS.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {FILTER_LABELS[filter]}
                </Text>
                {filter !== 'All' && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>
                      {filter === 'pending' ? stats.pending : filter === 'confirmed' ? stats.confirmed : stats.cancelled}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.emptyText}>Loading orders...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Package size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>Error</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadOrders}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptyText}>
              {orders.length === 0
                ? 'No incoming orders yet. They will appear here when a client places an order.'
                : 'Try changing your filter or search term.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredOrders.map(req => {
              const isResponding = respondingId === req.id;
              const itemNames = (req.items || []).map(i => i.product?.name).filter(Boolean).join(', ');
              const totalQty = (req.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
              const displayId = `#ORD-${req.id.substring(0, 8).toUpperCase()}`;

              return (
                <View key={req.id} style={styles.card}>
                  {/* Urgency Banner for pending */}
                  {req.status === 'pending' && (
                    <View style={styles.urgencyBanner}>
                      <AlertCircle size={14} color="#D97706" />
                      <Text style={styles.urgencyBannerText}>New Request — Response needed</Text>
                    </View>
                  )}

                  <View style={styles.cardInner}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.idRow}>
                        <Text style={styles.idText}>{displayId}</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Clock size={12} color={colors.muted} />
                        <Text style={styles.timeText}>
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        req.status === 'pending' ? styles.statusNew :
                        req.status === 'confirmed' ? styles.statusConfirmed :
                        styles.statusCancelled
                      ]}>
                        <Text style={[
                          styles.statusText,
                          req.status === 'pending' ? styles.statusTextNew :
                          req.status === 'confirmed' ? styles.statusTextConfirmed :
                          styles.statusTextCancelled
                        ]}>
                          {req.status === 'pending' ? 'New' : req.status === 'confirmed' ? 'Accepted' : 'Rejected'}
                        </Text>
                      </View>
                    </View>

                    {/* Product Title */}
                    <Text style={styles.reqTitle} numberOfLines={2}>
                      {itemNames || 'Raw Material Order'}
                    </Text>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <User size={14} color="#F59E0B" style={styles.detailIcon} />
                        <View>
                          <Text style={styles.detailLabel}>Client</Text>
                          <Text style={styles.detailValue}>{req.owner?.bizName || 'N/A'}</Text>
                        </View>
                      </View>
                      <View style={styles.detailItem}>
                        <Hash size={14} color="#3B82F6" style={styles.detailIcon} />
                        <View>
                          <Text style={styles.detailLabel}>Total Qty</Text>
                          <Text style={styles.detailValue}>{totalQty} units</Text>
                        </View>
                      </View>
                      <View style={styles.detailItem}>
                        <MapPin size={14} color="#10B981" style={styles.detailIcon} />
                        <View>
                          <Text style={styles.detailLabel}>Delivery</Text>
                          <Text style={styles.detailValue} numberOfLines={1}>{req.owner?.city || req.deliveryAddress || 'N/A'}</Text>
                        </View>
                      </View>
                      {req.owner?.mobile ? (
                        <View style={styles.detailItem}>
                          <Phone size={14} color="#8B5CF6" style={styles.detailIcon} />
                          <View>
                            <Text style={styles.detailLabel}>Contact</Text>
                            <Text style={styles.detailValue}>{req.owner.mobile}</Text>
                          </View>
                        </View>
                      ) : null}
                    </View>

                    {/* Budget */}
                    <View style={styles.budgetRow}>
                      <Text style={styles.budgetLabel}>Order Value</Text>
                      <Text style={styles.budgetVal}>₹{parseFloat(req.totalAmount || 0).toLocaleString('en-IN')}</Text>
                    </View>

                    {/* Items breakdown */}
                    {req.items && req.items.length > 0 && (
                      <View style={styles.noteBox}>
                        <Text style={styles.noteLabel}>Items Ordered:</Text>
                        {req.items.map((item, idx) => (
                          <Text key={idx} style={styles.noteText}>
                            • {item.product?.name || 'Product'} × {item.quantity} {item.product?.unit || 'units'} @ ₹{parseFloat(item.priceAtPurchase || 0).toFixed(0)}/unit
                          </Text>
                        ))}
                      </View>
                    )}

                    {/* Notes from owner */}
                    {req.notes ? (
                      <View style={[styles.noteBox, { marginTop: 8 }]}>
                        <Text style={styles.noteLabel}>Client Note:</Text>
                        <Text style={styles.noteText}>"{req.notes}"</Text>
                      </View>
                    ) : null}

                    {/* Actions */}
                    <View style={styles.cardFooter}>
                      {req.status === 'pending' ? (
                        <View style={styles.actions}>
                          <TouchableOpacity
                            style={[styles.acceptBtn, isResponding && styles.btnDisabled]}
                            onPress={() => !isResponding && handleRespond(req.id, 'confirmed')}
                            disabled={isResponding}
                          >
                            {isResponding ? (
                              <ActivityIndicator size="small" color="#10B981" />
                            ) : (
                              <CheckCircle size={16} color="#10B981" />
                            )}
                            <Text style={styles.acceptText}>Accept Order</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.rejectBtn, isResponding && styles.btnDisabled]}
                            onPress={() => !isResponding && handleRespond(req.id, 'cancelled')}
                            disabled={isResponding}
                          >
                            <XCircle size={16} color="#EF4444" />
                            <Text style={styles.rejectText}>Decline</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.actions}>
                          <Text style={{
                            fontSize: 14, fontWeight: 'bold',
                            color: req.status === 'confirmed' ? '#10B981' : '#EF4444'
                          }}>
                            {req.status === 'confirmed' ? '✓ Order Accepted' : '✕ Order Rejected'}
                          </Text>
                        </View>
                      )}
                      {req.status === 'pending' && (
                        <Text style={styles.rankingTip}>Responding within 2 hrs improves your ranking</Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', minHeight: 80, paddingTop: 36, paddingBottom: 16, marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  pageSubtitle: { fontSize: 13, color: colors.muted, marginTop: 4 },
  refreshBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },

  infoBanner: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  bannerIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFFBEB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  bannerSubtitle: { fontSize: 12, color: colors.muted, lineHeight: 16 },
  liveFeedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', position: 'absolute', top: 16, right: 16 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginRight: 6 },
  liveFeedText: { fontSize: 10, fontWeight: '600', color: '#D97706' },

  statsContainer: { gap: 12, marginBottom: 20, paddingRight: 16 },
  statCard: { width: 120, padding: 16, borderRadius: 12, borderWidth: 1, marginRight: 12 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.muted, fontWeight: '500' },

  searchFilterContainer: { marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A' },
  filterScroll: { flexDirection: 'row' },
  filterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  filterPillActive: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  filterTextActive: { color: '#D97706' },
  filterCount: { backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  filterCountText: { fontSize: 10, fontWeight: '700', color: colors.muted },

  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  emptyText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8 },
  retryBtn: { marginTop: 16, backgroundColor: '#F59E0B', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 4px 12px rgba(0,0,0,0.03)' } }) },
  urgencyBanner: { backgroundColor: '#FEF3C7', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  urgencyBannerText: { fontSize: 12, fontWeight: '600', color: '#D97706' },
  cardInner: { padding: 16 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  idText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
  dotSeparator: { marginHorizontal: 4, color: colors.muted, fontSize: 14 },
  timeText: { fontSize: 12, color: colors.muted },

  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusNew: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  statusConfirmed: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  statusCancelled: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextNew: { color: '#2563EB' },
  statusTextConfirmed: { color: '#16A34A' },
  statusTextCancelled: { color: '#DC2626' },

  reqTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 16, lineHeight: 22 },

  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailItem: { width: '45%', flexDirection: 'row', alignItems: 'flex-start' },
  detailIcon: { backgroundColor: '#F8FAFC', padding: 6, borderRadius: 8, marginRight: 8, overflow: 'hidden' },
  detailLabel: { fontSize: 11, color: colors.muted, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },

  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 12 },
  budgetLabel: { fontSize: 13, color: colors.muted, fontWeight: '500' },
  budgetVal: { fontSize: 18, fontWeight: '800', color: '#F59E0B' },

  noteBox: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 8 },
  noteLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 4 },
  noteText: { fontSize: 13, color: '#475569', lineHeight: 20 },

  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  acceptBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#10B981', gap: 8 },
  acceptText: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#EF4444', gap: 8 },
  rejectText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  btnDisabled: { opacity: 0.6 },
  rankingTip: { fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 4 },
});
