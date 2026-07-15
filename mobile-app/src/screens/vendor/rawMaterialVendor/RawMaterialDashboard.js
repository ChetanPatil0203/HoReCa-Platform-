import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { Menu, Bell, Search, User, LayoutDashboard, Activity, Truck, Briefcase, DollarSign, BarChart2, Package, HelpCircle, Settings } from 'lucide-react-native';
import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import RawMaterialDashboardHome from './RawMaterialDashboardHome';
import RawMaterialOrdersPage from './RawMaterialOrdersPage';
import RawMaterialDeliveriesPage from './RawMaterialDeliveriesPage';
import RawMaterialClientsPage from './RawMaterialClientsPage';
import RawMaterialRevenuePage from './RawMaterialRevenuePage';
import RawMaterialInventoryPage from './RawMaterialInventoryPage';
import RawMaterialAnalyticsPage from './RawMaterialAnalyticsPage';

// Supporting Pages
import RawMaterialReviewsPage from './RawMaterialReviewsPage';
import RawMaterialNotificationsPage from './RawMaterialNotificationsPage';
import RawMaterialDocumentsPage from './RawMaterialDocumentsPage';
import RawMaterialSettingsPage from './RawMaterialSettingsPage';
import RawMaterialSupportPage from './RawMaterialSupportPage';

export default function RawMaterialDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <RawMaterialDashboardHome />;
      case "requests":
        return <RawMaterialOrdersPage />;
      case "deliveries":
        return <RawMaterialDeliveriesPage />;
      case "clients":
        return <RawMaterialClientsPage />;
      case "revenue":
        return <RawMaterialRevenuePage />;
      case "analytics":
        return <RawMaterialAnalyticsPage />;
      case "inventory":
        return <RawMaterialInventoryPage />;
      case "reviews":
        return <RawMaterialReviewsPage />;
      case "notifications":
        return <RawMaterialNotificationsPage />;
      case "documents":
        return <RawMaterialDocumentsPage />;
      case "settings":
        return <RawMaterialSettingsPage />;
      case "support":
        return <RawMaterialSupportPage />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Orders", icon: Activity, badge: 3 },
    { key: "inventory", label: "Inventory", icon: Package, exclusive: true },
    { key: "deliveries", label: "Deliveries", icon: Truck },
    { key: "clients", label: "Clients", icon: Briefcase },
    { key: "revenue", label: "Revenue", icon: DollarSign },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const bottomNavItems = [
    { key: "support", label: "Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: "MF",
    name: "Metro Fresh",
    role: "Raw Material Supplier",
    badge: "VENDOR"
  };

  return (
    <View style={styles.container}>
      <RoleBasedMobileDrawer
        activePage={activePage}
        onNavigate={setActivePage}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={logout}
        navItems={navItems}
        bottomNavItems={bottomNavItems}
        profile={profileData}
        panelTitle="VENDOR OPERATIONS"
      />

      <View style={styles.mainContent}>
        {/* Top Navbar */}
        {isMobile ? (
          <View style={styles.mobileBar}>
            <TouchableOpacity style={styles.mobileMenuBtn} onPress={() => setMobileMenuOpen(true)}>
              <Menu size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.mobileLogoContainer}>
              <View style={styles.mobileLogoIconBox}>
                <Image source={require('../../../assets/HoReCa_Logo.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
              </View>
              <Text style={styles.mobileLogoText}>
                HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
              </Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn}>
                <Bell size={18} color="#fff" />
                <View style={styles.mobileNotificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn}>
                <User size={16} color="#081A3A" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topNav}>
            <View style={styles.searchBox}>
              <Search size={16} color={colors.muted} />
              <Text style={styles.searchText}>Search orders, clients...</Text>
            </View>

            <View style={styles.navRight}>
              <TouchableOpacity style={styles.iconBtn}>
                <Bell size={20} color={colors.sub} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Page Content */}
        <View style={styles.pageArea}>
          {renderActivePage()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  topNav: {
    height: 70,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  menuBtn: {
    padding: 8,
    marginLeft: -8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    width: 300,
  },
  searchText: {
    color: colors.muted,
    fontSize: 13,
    marginLeft: 8,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageArea: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#081A3A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  mobileMenuBtn: {
    padding: 6,
  },
  mobileLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mobileLogoIconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  mobileRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileIconBtn: {
    padding: 6,
    position: 'relative',
  },
  mobileNotificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  mobileAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
