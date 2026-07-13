import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Clock, Search, Download, Package, Users, Wrench, Megaphone, CheckCircle, XCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const HISTORY_DATA = [
  { id: "ORD-287", category: "raw-material", title: "Premium Basmati Rice", vendor: "Metro Fresh Supplies", qty: "500 kg", date: "14 Jun 2026", amount: "₹18,500", status: "Accepted", invoice: "INV-2026-287" },
  { id: "ORD-286", category: "manpower", title: "Weekend Kitchen Staff (2)", vendor: "Elite Staffing Co.", qty: "2 persons", date: "13 Jun 2026", amount: "₹6,400", status: "Pending", invoice: "—" },
  { id: "ORD-285", category: "service", title: "Deep Kitchen Cleaning", vendor: "ProClean Services", qty: "Full property", date: "13 Jun 2026", amount: "₹8,500", status: "Accepted", invoice: "INV-2026-285" },
  { id: "ORD-284", category: "marketing", title: "June Social Campaign", vendor: "BrandCraft Agency", qty: "30 days", date: "12 Jun 2026", amount: "₹35,000", status: "New", invoice: "—" },
  { id: "ORD-283", category: "raw-material", title: "Fresh Vegetables Pack", vendor: "Metro Fresh Supplies", qty: "200 kg", date: "11 Jun 2026", amount: "₹12,200", status: "Accepted", invoice: "INV-2026-283" },
  { id: "ORD-279", category: "raw-material", title: "Atlantic Salmon Fillet", vendor: "Pacific Seafood Co.", qty: "50 kg", date: "08 Jun 2026", amount: "₹24,000", status: "Accepted", invoice: "INV-2026-279" },
];

const CAT_META = {
  "raw-material": { icon: Package, color: "#D4940A", label: "Raw Material" },
  "manpower": { icon: Users, color: "#3B7FE0", label: "Manpower" },
  "service": { icon: Wrench, color: "#0FA668", label: "Service" },
  "marketing": { icon: Megaphone, color: "#9B5CF6", label: "Marketing" },
};

const STATUS_STYLES = {
  Accepted: { bg: "rgba(15,166,104,0.12)", color: "#0FA668", icon: CheckCircle },
  Pending: { bg: "rgba(212,148,10,0.12)", color: "#D4940A", icon: Clock },
  New: { bg: "rgba(59,127,224,0.12)", color: "#3B7FE0", icon: Clock },
  Rejected: { bg: "rgba(208,64,64,0.12)", color: "#D04040", icon: XCircle },
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const filtered = HISTORY_DATA.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.vendor.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || o.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: "rgba(212,148,10,0.1)" }]}>
            <Clock size={24} color="#D4940A" />
          </View>
          <View>
            <Text style={styles.pageTitle}>Order History</Text>
            <Text style={styles.pageDesc}>Complete record of all past and ongoing orders</Text>
          </View>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: "#D4940A" }]}>{HISTORY_DATA.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: "#0FA668" }]}>4</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: "#3B7FE0" }]}>₹63K</Text>
          <Text style={styles.statLabel}>Total Spend</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: "#9B5CF6" }]}>4</Text>
          <Text style={styles.statLabel}>Vendors Used</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.tableCard}>
        <View style={styles.tableControls}>
          <View style={styles.searchBox}>
            <Search size={16} color={colors.muted} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search orders, vendors..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={colors.muted}
            />
          </View>
          
          <View style={styles.categoryFilters}>
            {["All", "raw-material", "manpower", "service", "marketing"].map(cat => {
              const meta = cat !== "All" ? CAT_META[cat] : null;
              const isActive = filterCat === cat;
              return (
                <TouchableOpacity 
                  key={cat}
                  onPress={() => setFilterCat(cat)}
                  style={[
                    styles.catBtn,
                    isActive && { backgroundColor: meta ? meta.color : "#D4940A" }
                  ]}
                >
                  <Text style={[
                    styles.catBtnText,
                    isActive && { color: "#fff", fontWeight: 'bold' }
                  ]}>
                    {cat === "All" ? "All" : meta.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <TouchableOpacity style={styles.exportBtn}>
            <Download size={14} color={colors.muted} />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
            <View style={{ minWidth: 900, width: '100%' }}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 1.5 }]}>Order ID</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Category</Text>
                <Text style={[styles.th, { flex: 3 }]}>Item / Service</Text>
                <Text style={[styles.th, { flex: 2 }]}>Vendor</Text>
                <Text style={[styles.th, { flex: 1 }]}>Qty</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Date</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Amount</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Status</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>Invoice</Text>
              </View>
              
              {filtered.map((order, i) => {
                const meta = CAT_META[order.category];
                const CatIcon = meta.icon;
                const ss = STATUS_STYLES[order.status];
                const StatusIcon = ss.icon;
                return (
                  <View key={order.id} style={styles.tableRow}>
                    <Text style={[styles.tdId, { flex: 1.5, color: meta.color }]}>{order.id}</Text>
                    
                    <View style={[{ flex: 1.5 }, styles.catCell]}>
                      <CatIcon size={12} color={meta.color} />
                      <Text style={[styles.catCellText, { color: meta.color }]}>{meta.label}</Text>
                    </View>

                    <Text style={[styles.tdTitle, { flex: 3 }]} numberOfLines={1}>{order.title}</Text>
                    <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{order.vendor}</Text>
                    <Text style={[styles.td, { flex: 1 }]}>{order.qty}</Text>
                    <Text style={[styles.td, { flex: 1.5 }]}>{order.date}</Text>
                    <Text style={[styles.tdAmount, { flex: 1.5 }]}>{order.amount}</Text>
                    
                    <View style={[{ flex: 1.5 }]}>
                      <View style={[styles.statusBadge, { backgroundColor: ss.bg }]}>
                        <StatusIcon size={10} color={ss.color} />
                        <Text style={[styles.statusText, { color: ss.color }]}>{order.status}</Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.tdId, { flex: 1.5, color: order.invoice === "—" ? colors.muted : "#3B7FE0" }]}>
                      {order.invoice}
                    </Text>
                  </View>
                );
              })}
            </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  header: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  tableControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 16,
    flexWrap: 'wrap',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    outlineStyle: 'none',
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
    display: Platform.OS === 'web' && Platform.isPad === false ? 'flex' : 'none',
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(15,23,42,0.03)',
  },
  catBtnText: {
    fontSize: 12,
    color: colors.muted,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(15,23,42,0.03)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  exportBtnText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#F8FAFC',
  },
  th: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.muted,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tdId: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    fontSize: 11,
    fontWeight: 'bold',
  },
  catCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catCellText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tdTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.dark,
  },
  td: {
    fontSize: 12,
    color: colors.sub,
  },
  tdAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
