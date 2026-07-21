import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Menu, Bell, User, Truck, HelpCircle, Settings, Home, ClipboardList, Plus, PackagePlus, Boxes, Users, History, CircleHelp, LogOut } from 'lucide-react-native';
import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import RawMaterialDashboardHome from './RawMaterialDashboardHome';
import RawMaterialOrdersPage from './RawMaterialOrdersPage';
import RawMaterialDeliveriesPage from './RawMaterialDeliveriesPage';
import RawMaterialRevenuePage from './RawMaterialRevenuePage';
import RawMaterialInventoryPage from './RawMaterialInventoryPage';
import RawMaterialProfilePage from './RawMaterialProfilePage';

// Supporting Pages
import RawMaterialNotificationsPage from './RawMaterialNotificationsPage';
import RawMaterialSettingsPage from './RawMaterialSettingsPage';
import RawMaterialSupportPage from './RawMaterialSupportPage';

const PRIMARY = '#0B1736';
const ACCENT = '#6C4CF6';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';

export default function RawMaterialDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterState, setFilterState] = useState(null);
  const [initialAction, setInitialAction] = useState(null);

  // Radial Menu State
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isPlusMenuOpen ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isPlusMenuOpen]);

  const navigateTo = (page, filter = null, action = null) => {
    setFilterState(filter);
    setInitialAction(action);
    setActivePage(page);
    setIsPlusMenuOpen(false);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <RawMaterialDashboardHome onNavigate={navigateTo} />;
      case "requests":
        return <RawMaterialOrdersPage initialFilter={filterState} />;
      case "deliveries":
        return <RawMaterialDeliveriesPage initialFilter={filterState} />;
      case "revenue":
        return <RawMaterialRevenuePage />;
      case "inventory":
        return <RawMaterialInventoryPage initialFilter={filterState} initialAction={initialAction} />;
      case "notifications":
        return <RawMaterialNotificationsPage />;
      case "settings":
        return <RawMaterialSettingsPage />;
      case "support":
        return <RawMaterialSupportPage />;
      case "profile":
        return <RawMaterialProfilePage />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "requests", label: "Orders", icon: ClipboardList },
    { key: "inventory", label: "Inventory", icon: Boxes },
    { key: "deliveries", label: "Deliveries", icon: Truck },
    { key: "history", label: "History", icon: History },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Help & Support", icon: CircleHelp },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: "MF",
    name: "Metro Fresh",
    role: "Raw Material Supplier",
    badge: "VENDOR"
  };

  const togglePlusMenu = () => setIsPlusMenuOpen(!isPlusMenuOpen);

  // Animation styles for radial menu
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg'] // Keep as + per requirements
  });

  const bgOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const action1TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -55]
  });

  const action1TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0]
  });

  const action2TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -55]
  });

  const action2TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 55]
  });

  const actionScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

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
        {/* Mobile Top Header */}
        {isMobile && (
          <View style={styles.mobileBar}>
            <TouchableOpacity style={styles.mobileMenuBtn} onPress={() => setMobileMenuOpen(true)}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.mobileHeaderCenter}>
              <Text style={{ color: '#D4AF37', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }}>HRC HUB</Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn} onPress={() => navigateTo('notifications')}>
                <Bell size={20} color="#fff" />
                <View style={styles.mobileNotificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn} onPress={() => navigateTo('profile')}>
                <Text style={styles.avatarText}>MF</Text>
                <View style={styles.onlineIndicator} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Page Content */}
        <View style={styles.pageArea}>
          {renderActivePage()}
        </View>

        {/* Custom Mobile Bottom Navigation */}
        {isMobile && (
          <View style={styles.bottomNavWrapper}>
            {/* Radial Menu Overlay & Actions */}
            {isPlusMenuOpen && (
              <TouchableWithoutFeedback onPress={() => setIsPlusMenuOpen(false)}>
                <Animated.View style={[styles.radialOverlay, { opacity: bgOpacity }]} />
              </TouchableWithoutFeedback>
            )}
            
            <Animated.View style={[styles.radialAction, { opacity: actionScale, transform: [{ translateX: action1TranslateX }, { translateY: action1TranslateY }, { scale: actionScale }] }]}>
              <TouchableOpacity style={styles.radialActionBtn} onPress={() => navigateTo('inventory', null, null)}>
                <Boxes size={22} color={PRIMARY} />
              </TouchableOpacity>
              <View style={styles.radialLabelBox}>
                <Text style={styles.radialLabelTitle}>Manage Inventory</Text>
              </View>
            </Animated.View>



            {/* Nav Bar */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('dashboard')}>
                <Home size={24} color={activePage === 'dashboard' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'dashboard' && styles.bottomNavTextActive]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('requests')}>
                <ClipboardList size={24} color={activePage === 'requests' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'requests' && styles.bottomNavTextActive]}>Orders</Text>
              </TouchableOpacity>
              
              {/* Center Plus Button Spacer */}
              <View style={styles.centerButtonSpacer} />
              
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('deliveries')}>
                <Truck size={24} color={activePage === 'deliveries' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'deliveries' && styles.bottomNavTextActive]}>Deliveries</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('profile')}>
                <User size={24} color={activePage === 'profile' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'profile' && styles.bottomNavTextActive]}>Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Center Plus Button */}
            <TouchableOpacity style={styles.centerPlusButton} onPress={togglePlusMenu} activeOpacity={0.8}>
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Plus size={32} color={WHITE} />
              </Animated.View>
            </TouchableOpacity>

          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: BG },
  mainContent: { flex: 1, flexDirection: 'column' },
  pageArea: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#94A3B8', fontSize: 18, fontWeight: 'bold' },
  
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 70,
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  mobileMenuBtn: { padding: 6, zIndex: 10 },
  mobileHeaderCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  greetingText: { color: '#B8C6E3', fontSize: 10, letterSpacing: 0.5 },
  vendorNameText: { color: WHITE, fontSize: 16, fontWeight: 'bold', marginVertical: 2 },
  vendorRoleText: { color: '#D4AF37', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  mobileRight: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 },
  mobileIconBtn: { padding: 4, position: 'relative' },
  mobileNotificationDot: { position: 'absolute', top: 4, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: PRIMARY },
  mobileAvatarBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { color: PRIMARY, fontSize: 12, fontWeight: 'bold' },
  onlineIndicator: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', borderWidth: 2, borderColor: WHITE },

  bottomNavWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50 },
  radialOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1000, backgroundColor: 'rgba(11, 23, 54, 0.4)' },
  radialAction: { position: 'absolute', bottom: 30, left: '50%', marginLeft: -55, alignItems: 'center', width: 110 },
  radialActionBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  radialLabelBox: { backgroundColor: WHITE, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginTop: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  radialLabelTitle: { fontSize: 11, fontWeight: 'bold', color: PRIMARY, textAlign: 'center' },
  
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: WHITE, height: 65, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10, paddingBottom: Platform.OS === 'ios' ? 15 : 0 },
  bottomNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomNavText: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  bottomNavTextActive: { color: ACCENT, fontWeight: '600' },
  centerButtonSpacer: { width: 60 },
  centerPlusButton: { position: 'absolute', bottom: Platform.OS === 'ios' ? 25 : 15, left: '50%', marginLeft: -28, width: 56, height: 56, borderRadius: 28, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center', shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
});
