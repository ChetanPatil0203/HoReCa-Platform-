import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Package, Users, Wrench, Megaphone, Plus, Search, Star, Clock, CheckCircle, XCircle, ArrowLeft, MessageSquare } from 'lucide-react-native';
import { typography } from '../../../theme/typography';
import { colors } from '../../../theme/colors';

const CAT_META = {
  "raw-material": {
    icon: Package,
    label: "Raw Materials",
    color: "#D4940A",
    bg: "rgba(212,148,10,0.1)",
    desc: "Manage ingredient procurement, packaging, and supply orders",
    vendors: [
      { name: "Metro Fresh Supplies", rating: 4.8, speciality: "Fresh Produce & Grains", deliveries: 42, badge: "Top Rated" },
      { name: "Agro Prime Foods", rating: 4.6, speciality: "Dairy & Meat Products", deliveries: 28, badge: null },
      { name: "SpiceWorld Traders", rating: 4.5, speciality: "Spices & Condiments", deliveries: 19, badge: null },
      { name: "Pacific Seafood Co.", rating: 4.7, speciality: "Fresh & Frozen Seafood", deliveries: 15, badge: "Verified" },
    ],
  },
  manpower: {
    icon: Users,
    label: "Manpower",
    color: "#3B7FE0",
    bg: "rgba(59,127,224,0.1)",
    desc: "Hire and manage kitchen staff, servers, and hospitality professionals",
    vendors: [
      { name: "Elite Staffing Co.", rating: 4.7, speciality: "Kitchen & F&B Staff", deliveries: 28, badge: "Top Rated" },
      { name: "HospitalityHR", rating: 4.5, speciality: "Hotel & Resort Staff", deliveries: 21, badge: null },
    ],
  },
  service: {
    icon: Wrench,
    label: "Service Providers",
    color: "#0FA668",
    bg: "rgba(15,166,104,0.1)",
    desc: "Book facility maintenance, cleaning, and equipment service teams",
    vendors: [
      { name: "ProClean Services", rating: 4.9, speciality: "Commercial Kitchen Cleaning", deliveries: 17, badge: "Top Rated" },
      { name: "TechFix Solutions", rating: 4.6, speciality: "Kitchen Equipment Repair", deliveries: 14, badge: null },
    ],
  },
  marketing: {
    icon: Megaphone,
    label: "Marketing",
    color: "#9B5CF6",
    bg: "rgba(155,92,246,0.1)",
    desc: "Launch campaigns, manage social media, and grow your brand",
    vendors: [
      { name: "BrandCraft Agency", rating: 4.5, speciality: "Social Media & Content", deliveries: 9, badge: null },
      { name: "FoodShot Studios", rating: 4.8, speciality: "Food Photography & Video", deliveries: 7, badge: "Top Rated" },
    ],
  },
};

const SEED_ORDERS = {
  "raw-material": [
    { id: "ORD-287", title: "Premium Basmati Rice", qty: "500 kg", vendor: "Metro Fresh Supplies", date: "14 Jun 2026", status: "Accepted", amount: "₹18,500" },
    { id: "ORD-283", title: "Fresh Vegetables Pack", qty: "200 kg", vendor: "Metro Fresh Supplies", date: "11 Jun 2026", status: "Accepted", amount: "₹12,200" },
    { id: "ORD-279", title: "Atlantic Salmon Fillet", qty: "50 kg", vendor: "Pacific Seafood Co.", date: "08 Jun 2026", status: "Pending", amount: "₹24,000" },
  ],
  manpower: [
    { id: "ORD-286", title: "Weekend Kitchen Staff (2)", qty: "2 persons", vendor: "Elite Staffing Co.", date: "13 Jun 2026", status: "Pending", amount: "₹6,400" },
  ],
  service: [
    { id: "ORD-285", title: "Deep Kitchen Cleaning", qty: "Full property", vendor: "ProClean Services", date: "13 Jun 2026", status: "Accepted", amount: "₹8,500" },
  ],
  marketing: [
    { id: "ORD-284", title: "June Social Campaign", qty: "30 days", vendor: "BrandCraft Agency", date: "12 Jun 2026", status: "New", amount: "₹35,000" },
  ],
};

const STATUS_STYLES = {
  Accepted: { bg: "rgba(15,166,104,0.12)", color: "#0FA668", icon: CheckCircle },
  Pending: { bg: "rgba(212,148,10,0.12)", color: "#D4940A", icon: Clock },
  New: { bg: "rgba(59,127,224,0.12)", color: "#3B7FE0", icon: Clock },
  Rejected: { bg: "rgba(208,64,64,0.12)", color: "#D04040", icon: XCircle },
};

export default function CategoryPage({ category, onBack }) {
  const meta = CAT_META[category] || CAT_META["raw-material"];
  const Icon = meta.icon;
  const orders = SEED_ORDERS[category] || [];
  
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "New", "Pending", "Accepted"];

  const filteredOrders = orders.filter(o => activeFilter === "All" || o.status === activeFilter);

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
            <Icon size={24} color={meta.color} />
          </View>
          <View>
            <Text style={styles.pageTitle}>{meta.label}</Text>
            <Text style={styles.pageDesc}>{meta.desc}</Text>
          </View>
        </View>

        {category === "raw-material" ? (
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: meta.color }]}>
            <Plus size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Browse Materials</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionGroup}>
            <TouchableOpacity style={[styles.outlineBtn, { borderColor: meta.color }]}>
              <Text style={[styles.outlineBtnText, { color: meta.color }]}>🤝 Direct Hire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gradientBtn}>
              <Text style={styles.gradientBtnText}>📢 Broadcast</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsGrid}>
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Accepted", value: orders.filter(o => o.status === "Accepted").length },
          { label: "Pending", value: orders.filter(o => o.status === "Pending").length },
          { label: "Vendors", value: meta.vendors.length },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: meta.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Filters ── */}
      <View style={styles.filterRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={colors.muted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={styles.filterGroup}>
          {filters.map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[
                styles.filterBtn, 
                activeFilter === f && { backgroundColor: meta.color }
              ]}
            >
              <Text style={[
                styles.filterBtnText, 
                activeFilter === f && styles.filterBtnTextActive
              ]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Content Grid ── */}
      <View style={styles.contentGrid}>
        {/* Table / List */}
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
            <View style={{ minWidth: 600, width: '100%' }}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 1.5 }]}>Order ID</Text>
                <Text style={[styles.th, { flex: 3 }]}>Item / Service</Text>
                <Text style={[styles.th, { flex: 2 }]}>Quantity</Text>
                <Text style={[styles.th, { flex: 3 }]}>Vendor</Text>
                <Text style={[styles.th, { flex: 2 }]}>Status</Text>
                <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>Amount</Text>
              </View>
              {filteredOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No orders found</Text>
                </View>
              ) : (
                filteredOrders.map(order => {
                  const ss = STATUS_STYLES[order.status] || STATUS_STYLES["Pending"];
                  const StatusIcon = ss.icon;
                  return (
                    <View key={order.id} style={styles.tableRow}>
                      <Text style={[styles.tdId, { flex: 1.5, color: meta.color }]}>{order.id}</Text>
                      <Text style={[styles.tdTitle, { flex: 3 }]}>{order.title}</Text>
                      <Text style={[styles.td, { flex: 2 }]}>{order.qty}</Text>
                      <Text style={[styles.td, { flex: 3 }]}>{order.vendor}</Text>
                      <View style={[styles.td, { flex: 2 }]}>
                        <View style={[styles.statusPill, { backgroundColor: ss.bg }]}>
                          <StatusIcon size={12} color={ss.color} />
                          <Text style={[styles.statusText, { color: ss.color }]}>{order.status}</Text>
                        </View>
                      </View>
                      <Text style={[styles.tdAmount, { flex: 2, textAlign: 'right' }]}>{order.amount}</Text>
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        {/* Vendors Panel */}
        <View style={styles.vendorsContainer}>
          <Text style={styles.vendorsTitle}>Preferred Vendors</Text>
          {meta.vendors.map((v) => (
            <View key={v.name} style={styles.vendorCard}>
              <View style={styles.vendorHeader}>
                <View style={[styles.vendorAvatar, { backgroundColor: meta.bg }]}>
                  <Text style={[styles.vendorAvatarText, { color: meta.color }]}>
                    {v.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </Text>
                </View>
                {v.badge && (
                  <View style={[styles.vendorBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.vendorBadgeText, { color: meta.color }]}>{v.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.vendorName}>{v.name}</Text>
              <Text style={styles.vendorSpeciality}>{v.speciality}</Text>
              
              <View style={styles.vendorMeta}>
                <View style={styles.ratingRow}>
                  <Star size={12} color="#D4940A" fill="#D4940A" />
                  <Text style={styles.ratingText}>{v.rating}</Text>
                </View>
                <Text style={styles.deliveriesText}>{v.deliveries} orders</Text>
              </View>

              <View style={styles.vendorActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MessageSquare size={12} color="#1E40AF" />
                  <Text style={styles.chatText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.reviewText}>Leave Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  outlineBtnText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  gradientBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#10B981', // Fallback for gradient
  },
  gradientBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.dark,
    outlineStyle: 'none',
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(15,23,42,0.03)',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.muted,
  },
  filterBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  tableContainer: {
    flex: 2,
    minWidth: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tdId: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    fontSize: 12,
    fontWeight: 'bold',
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
  statusPill: {
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
  tdAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.dark,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
  },
  vendorsContainer: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({ web: { boxShadow: '0 4px 18px rgba(0,0,0,0.03)' } }),
  },
  vendorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  vendorCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vendorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  vendorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vendorBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  vendorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  vendorSpeciality: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 12,
  },
  vendorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4940A',
    marginLeft: 4,
  },
  deliveriesText: {
    fontSize: 12,
    color: colors.muted,
  },
  vendorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.muted,
  }
});
