import React, { useState, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { Menu, ArrowLeft, Bell, ChefHat, LayoutDashboard, Package, Users, Wrench, Megaphone, BarChart2, Clock, Truck, Settings, HelpCircle } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

import RoleBasedMobileDrawer from '../../components/navigation/RoleBasedMobileDrawer';
import Topbar from '../../components/owner/Topbar';
import MobileBottomNav from '../../components/owner/MobileBottomNav';

// Pages
import DashboardHome from './DashboardHome';
import RawMaterialPage from './Raw material/RawMaterialPage';
import ManpowerPage from './manpower/ManpowerPage';
import ServicePage from './ServicePage';
import MarketingPage from './marketing/MarketingPage';
import OrderTrackingPage from './Raw material/OrderTrackingPage';
import HistoryPage from './HistoryPage';
import AnalyticsPage from './AnalyticsPage';
import SupplierMarketplace from './Raw material/SupplierMarketplace';
import MarketplacePillarsPage from './Raw material/MarketplacePillarsPage';
import ProfileSettingsPage from './ProfileSettingsPage';

// Placeholder for missing pages
const PlaceholderPage = ({ title }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18, color: colors.muted }}>{title} - Under Construction</Text>
  </View>
);

const PAGE_TITLES = {
  "dashboard": "Dashboard Overview", 
  "marketplace": "Marketplace Pillars",
  "raw-material": "Raw Material Procurement", 
  "manpower": "Manpower Dispatch",
  "service": "Facilities & Services", 
  "marketing": "Growth & Marketing",
  "order-tracking": "Active Logs Tracking", 
  "history": "Procurement History",
  "analytics": "Business Intelligence Analytics", 
  "profile": "Executive Profile", 
  "settings": "Account Control Panel",
  "support": "Help & Support Desk",
};

export default function OwnerDashboard() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hardcoded mock user for now (will come from AuthContext later)
  const user = {
    name: "Arjun Mehta",
    businessName: "The Meridian Hotel",
    businessType: "hotel"
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome user={user} />;
      case "marketplace":
        return <MarketplacePillarsPage onNavigate={setActivePage} />;
      case "raw-material":
        return <RawMaterialPage onNavigate={setActivePage} />;
      case "manpower":
        return <ManpowerPage />;
      case "service":
        return <ServicePage />;
      case "marketing":
        return <MarketingPage />;
      case "order-tracking":
        return <OrderTrackingPage />;
      case "history":
        return <HistoryPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
      case "settings":
        return <ProfileSettingsPage user={user} />;
      default:
        return <PlaceholderPage title={PAGE_TITLES[activePage] || activePage} />;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "raw-material", label: "Raw Material", icon: Package },
    { key: "manpower", label: "Manpower", icon: Users },
    { key: "service", label: "Service Providers", icon: Wrench },
    { key: "marketing", label: "Marketing", icon: Megaphone },
    { key: "order-tracking", label: "Order Tracking", icon: Truck },
    { key: "history", label: "History", icon: Clock },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const bottomNavItems = [
    { key: "support", label: "Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: user?.name ? user.name.substring(0,2).toUpperCase() : "AD",
    name: user?.name || "Admin User",
    role: "System Administrator",
    badge: "OWNER"
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <RoleBasedMobileDrawer
          activePage={activePage}
          onNavigate={setActivePage}
          isMobile={!isLargeScreen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={logout}
          navItems={navItems}
          bottomNavItems={bottomNavItems}
          profile={profileData}
          panelTitle="ADMIN OPERATIONS"
        />
        
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Desktop/Tablet Topbar */}
          {isLargeScreen && (
            <Topbar 
              activePage={activePage} 
              title={PAGE_TITLES[activePage]}
              user={user}
            />
          )}

          {/* Mobile Bar */}
          {!isLargeScreen && (
            <View style={styles.mobileBar}>
              <TouchableOpacity
                style={styles.mobileMenuBtn}
                onPress={() => {
                  const MARKET_SUBS = ["raw-material", "manpower", "service", "marketing"];
                  if (MARKET_SUBS.includes(activePage)) {
                    setActivePage("marketplace");
                  } else {
                    setMobileMenuOpen(true);
                  }
                }}
              >
                {["raw-material", "manpower", "service", "marketing"].includes(activePage) ? (
                  <ArrowLeft size={20} color="#fff" />
                ) : (
                  <Menu size={20} color="#fff" />
                )}
              </TouchableOpacity>

              <View style={styles.mobileLogoContainer}>
                <View style={styles.mobileLogoIconBox}>
                  <Image source={require('../../assets/HoReCa_Logo.png')} style={{width: 18, height: 18, resizeMode: 'contain'}} />
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
                  <Text style={styles.mobileAvatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'O'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Page Content Viewport */}
          <View style={styles.pageViewport}>
            <ScrollView contentContainerStyle={[styles.scrollContent, !isLargeScreen && { padding: 12 }]}>
              {renderActivePage()}
            </ScrollView>
          </View>

          {/* Mobile Bottom Navigation */}
          {!isLargeScreen && (
            <MobileBottomNav 
              activePage={activePage} 
              onNavigate={setActivePage} 
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E2042', // Match sidebar color behind safe area
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // Main body bg
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  pageViewport: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 100,
  },
  drawerSidebar: {
    width: 280,
    height: '100%',
    zIndex: 101,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.6)',
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
  mobileAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#081A3A',
  },
});
