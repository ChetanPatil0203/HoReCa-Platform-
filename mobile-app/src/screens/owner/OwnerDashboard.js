import React, { useState, useContext } from 'react';
import { View, StyleSheet, SafeAreaView, useWindowDimensions, ScrollView, TouchableOpacity, Text, Platform, Image, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { Menu, ArrowLeft, Bell, ChefHat, LayoutDashboard, Package, Users, Wrench, Megaphone, BarChart2, Clock, Truck, Settings, HelpCircle, ChevronDown, LogOut, User, ShieldCheck } from 'lucide-react-native';
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
import CompliancePage from './compliance/CompliancePage';

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
  "compliance": "Compliance & Licensing",
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
  const { user: ctxUser, logout } = useContext(AuthContext);
  const user = ctxUser || { name: "", businessName: "", businessType: "" };

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome user={user} onNavigate={setActivePage} />;
      case "marketplace":
        return <MarketplacePillarsPage onNavigate={setActivePage} setMobileMenuOpen={setMobileMenuOpen} />;
      case "raw-material":
        return <RawMaterialPage onNavigate={setActivePage} />;
      case "manpower":
        return <ManpowerPage />;
      case "service":
        return <ServicePage />;
      case "marketing":
        return <MarketingPage />;
      case "compliance":
        return <CompliancePage />;
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
    { key: "compliance", label: "Compliance", icon: ShieldCheck },
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
              {/* LEFT */}
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.mobileMenuBtn}
                  onPress={() => setMobileMenuOpen(true)}
                >
                  <Menu size={22} color="#fff" />
                </TouchableOpacity>
                <Image 
                  source={require('../../assets/HoReCa_Logo.png')} 
                  style={{ width: 24, height: 24, resizeMode: 'contain', marginRight: 8 }} 
                />
                <View style={styles.headerLogoBox}>
                  <Text style={styles.headerLogoText}>HRC<Text style={{color:'#F6B800'}}>HUB</Text></Text>
                  <Text style={styles.headerLogoSub}>HoReCa Business Partner</Text>
                </View>
              </View>

              {/* RIGHT */}
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIconBtn}>
                  <Bell size={20} color="#fff" />
                  <View style={styles.headerBadge} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerAvatarBtn}
                  onPress={() => setProfileDropdownOpen(true)}
                >
                  <Text style={styles.headerAvatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </Text>
                  <View style={styles.onlineDot} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Profile Dropdown Modal */}
          <Modal
            visible={profileDropdownOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setProfileDropdownOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setProfileDropdownOpen(false)}>
              <View style={styles.dropdownOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileDropdownOpen(false);
                        setActivePage("profile");
                      }}
                    >
                      <View style={[styles.dropdownIconBox, {backgroundColor: '#EFF6FF'}]}>
                        <User size={18} color="#2563EB" />
                      </View>
                      <View style={styles.dropdownTextWrapper}>
                        <Text style={styles.dropdownItemTitle}>Profile View</Text>
                        <Text style={styles.dropdownItemSub}>View and manage your profile</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileDropdownOpen(false);
                        setActivePage("settings");
                      }}
                    >
                      <View style={[styles.dropdownIconBox, {backgroundColor: '#F5F3FF'}]}>
                        <Settings size={18} color="#7C3AED" />
                      </View>
                      <View style={styles.dropdownTextWrapper}>
                        <Text style={styles.dropdownItemTitle}>Settings</Text>
                        <Text style={styles.dropdownItemSub}>Manage app settings and preferences</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProfileDropdownOpen(false);
                        Alert.alert(
                          "Logout",
                          "Are you sure you want to logout?",
                          [
                            { text: "Cancel", style: "cancel" },
                            { text: "Logout", style: "destructive", onPress: () => logout() }
                          ]
                        );
                      }}
                    >
                      <View style={[styles.dropdownIconBox, {backgroundColor: '#FEF2F2'}]}>
                        <LogOut size={18} color="#DC2626" />
                      </View>
                      <View style={styles.dropdownTextWrapper}>
                        <Text style={[styles.dropdownItemTitle, {color: '#DC2626'}]}>Logout</Text>
                        <Text style={styles.dropdownItemSub}>Sign out from account</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Page Content Viewport */}
          <View style={styles.pageViewport}>
            {activePage === 'marketplace' ? (
              renderActivePage()
            ) : (
              <ScrollView contentContainerStyle={[styles.scrollContent, !isLargeScreen && { padding: 0, paddingHorizontal: 0, paddingTop: 16, paddingBottom: 110 }]}>
                {renderActivePage()}
              </ScrollView>
            )}
          </View>

          {/* Mobile Bottom Navigation */}
          {!isLargeScreen && activePage !== 'marketplace' && (
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
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(7, 27, 58, 0.95)', // Premium dark navy glass
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    height: Platform.OS === 'ios' ? 90 : 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mobileMenuBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerLogoBox: {
    flexDirection: 'column',
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerLogoSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#0A192F',
  },
  headerAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#081A3A',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0A192F',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    right: 16,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    minHeight: 44,
  },
  dropdownIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownTextWrapper: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  dropdownItemSub: {
    fontSize: 10,
    color: '#64748B',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    marginHorizontal: 8,
  },
});
