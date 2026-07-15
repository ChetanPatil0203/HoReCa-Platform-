import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Platform, 
  TouchableOpacity, useWindowDimensions, SafeAreaView, Image 
} from 'react-native';
import { 
  Package, Clock, Truck, CheckCircle, TrendingUp, 
  AlertTriangle, CreditCard, Star, Plus, Edit, 
  FileText, Activity, Box, ShoppingCart
} from 'lucide-react-native';

const NAVY = '#081A3A';
const GOLD = '#D4AF37';

const SUMMARY_DATA = [
  { label: "Total Orders", value: "245", icon: ShoppingCart, color: "#3B82F6", bg: "#DBEAFE" },
  { label: "Pending", value: "12", icon: Clock, color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Processing", value: "18", icon: Activity, color: "#8B5CF6", bg: "#F3E8FF" },
  { label: "Delivered", value: "215", icon: CheckCircle, color: "#10B981", bg: "#D1FAE5" },
  { label: "Monthly Rev.", value: "₹4.2L", icon: TrendingUp, color: "#10B981", bg: "#D1FAE5" },
  { label: "Low Stock", value: "5", icon: AlertTriangle, color: "#EF4444", bg: "#FEE2E2" },
  { label: "Payments", value: "₹35K", icon: CreditCard, color: "#F59E0B", bg: "#FEF3C7" },
  { label: "Avg Rating", value: "4.8", icon: Star, color: GOLD, bg: "#FEF3C7" },
];

const RECENT_ORDERS = [
  { id: "ORD-941", product: "Premium Basmati Rice", qty: "500kg", client: "The Meridian Grand", date: "Today, 10:30 AM", amount: "₹45,000", status: "Pending", statusColor: "#F59E0B" },
  { id: "ORD-938", product: "Atlantic Salmon", qty: "50kg", client: "Azure Palace Hotel", date: "Yesterday", amount: "₹60,000", status: "Processing", statusColor: "#3B82F6" },
  { id: "ORD-935", product: "Olive Oil (Extra Virgin)", qty: "20L", client: "Café Zephyr", date: "12 Jun", amount: "₹18,500", status: "Delivered", statusColor: "#10B981" },
];

const INVENTORY_ALERTS = [
  { id: "INV-1", name: "Saffron Threads", stock: "150g", threshold: "200g", status: "Critical" },
  { id: "INV-2", name: "Truffle Oil", stock: "2L", threshold: "5L", status: "Low" },
];

const TOP_PRODUCTS = [
  { id: "PRD-1", name: "Basmati Rice (Premium)", sales: "1,200 kg", revenue: "₹1.4L" },
  { id: "PRD-2", name: "Atlantic Salmon", sales: "450 kg", revenue: "₹3.8L" },
];

const DELIVERY_OVERVIEW = [
  { label: "Scheduled", val: "8", color: "#6366F1" },
  { label: "In Transit", val: "4", color: "#3B82F6" },
  { label: "Delayed", val: "1", color: "#EF4444" },
];

export default function RawMaterialDashboardHome() {
  const { width } = useWindowDimensions();
  // Mobile first approach: 2 columns on normal phones, 1 on very small
  const isSmallScreen = width < 360;
  const colWidth = isSmallScreen ? '100%' : '48%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>MF</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Hello, Partner</Text>
              <Text style={styles.businessName}>Metro Fresh Suppliers</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active Vendor</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.qaIconWrapper, { backgroundColor: '#E0E7FF' }]}>
                <Plus size={20} color="#4F46E5" />
              </View>
              <Text style={styles.qaText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.qaIconWrapper, { backgroundColor: '#FEF3C7' }]}>
                <Edit size={20} color="#F59E0B" />
              </View>
              <Text style={styles.qaText}>Update Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.qaIconWrapper, { backgroundColor: '#DBEAFE' }]}>
                <Truck size={20} color="#3B82F6" />
              </View>
              <Text style={styles.qaText}>Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={[styles.qaIconWrapper, { backgroundColor: '#F3E8FF' }]}>
                <FileText size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.qaText}>Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.summaryGrid}>
            {SUMMARY_DATA.map((item, idx) => (
              <View key={idx} style={[styles.summaryCard, { width: colWidth }]}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={16} color={item.color} />
                  </View>
                </View>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Orders - Native Mobile Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {RECENT_ORDERS.map((order, idx) => (
            <TouchableOpacity key={idx} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[styles.orderStatusBadge, { backgroundColor: order.statusColor + '20' }]}>
                  <Text style={[styles.orderStatusText, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderBody}>
                <View style={styles.orderDetailRow}>
                  <Package size={14} color="#64748B" style={styles.orderIcon} />
                  <Text style={styles.orderProduct} numberOfLines={1}>{order.product} ({order.qty})</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderClient} numberOfLines={1}>{order.client}</Text>
                </View>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderAmount}>{order.amount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Two Column Layout on larger screens for Alerts & Deliveries, stacked on mobile */}
        <View style={[styles.splitSection, isSmallScreen ? { flexDirection: 'column' } : { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }]}>
          
          {/* Inventory Alerts */}
          <View style={[styles.halfSection, isSmallScreen ? { width: '100%' } : { width: '48%' }]}>
            <Text style={styles.sectionTitle}>Inventory Alerts</Text>
            {INVENTORY_ALERTS.map((alert, idx) => (
              <View key={idx} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertName} numberOfLines={1}>{alert.name}</Text>
                  <Text style={[styles.alertStatus, alert.status === 'Critical' ? styles.statusCritical : styles.statusLow]}>
                    {alert.status}
                  </Text>
                </View>
                <Text style={styles.alertDetails}>Stock: <Text style={styles.boldText}>{alert.stock}</Text> / {alert.threshold}</Text>
              </View>
            ))}
          </View>

          {/* Delivery Overview */}
          <View style={[styles.halfSection, isSmallScreen ? { width: '100%' } : { width: '48%' }]}>
            <Text style={styles.sectionTitle}>Deliveries</Text>
            <View style={styles.deliveryCard}>
              {DELIVERY_OVERVIEW.map((del, idx) => (
                <View key={idx} style={styles.deliveryRow}>
                  <View style={styles.deliveryDotLabel}>
                    <View style={[styles.deliveryDot, { backgroundColor: del.color }]} />
                    <Text style={styles.deliveryLabel}>{del.label}</Text>
                  </View>
                  <Text style={styles.deliveryVal}>{del.val}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>

        {/* Top Selling Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          {TOP_PRODUCTS.map((prod, idx) => (
            <View key={idx} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                <Text style={styles.productSales}>Sold: {prod.sales}</Text>
              </View>
              <Text style={styles.productRevenue}>{prod.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Bottom padding for mobile navigation bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: GOLD,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: GOLD,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickActionCard: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  qaIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qaText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NAVY,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: GOLD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderBody: {
    marginBottom: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderIcon: {
    marginRight: 8,
  },
  orderProduct: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  orderClient: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 22, 
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  orderAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: NAVY,
  },
  splitSection: {
    marginBottom: 8,
  },
  halfSection: {
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  alertStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusCritical: {
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
  },
  statusLow: {
    backgroundColor: '#FFFBEB',
    color: '#F59E0B',
  },
  alertDetails: {
    fontSize: 12,
    color: '#64748B',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deliveryDotLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deliveryLabel: {
    fontSize: 14,
    color: '#475569',
  },
  deliveryVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: NAVY,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 4,
  },
  productSales: {
    fontSize: 12,
    color: '#64748B',
  },
  productRevenue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bottomSpacer: {
    height: 80,
  }
});
