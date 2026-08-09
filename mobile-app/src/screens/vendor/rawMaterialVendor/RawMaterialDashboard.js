import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Menu, Bell, User, Truck, CircleHelp as HelpCircle, Settings, Home, ClipboardList, Plus, PackagePlus, Boxes, Users, History, CircleHelp, LogOut } from 'lucide-react-native';
import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import RawMaterialDashboardHome from './RawMaterialDashboardHome';
import RawMaterialOrdersPage from './RawMaterialOrdersPage';
import RawMaterialDeliveriesPage from './RawMaterialDeliveriesPage';
import RawMaterialRevenuePage from './RawMaterialRevenuePage';
import RawMaterialInventoryPage from './RawMaterialInventoryPage';
import RawMaterialProfilePage from './RawMaterialProfilePage';
import RawMaterialHistoryPage from './RawMaterialHistoryPage';
import RawMaterialClientsPage from './RawMaterialClientsPage';

// Supporting Pages
import RawMaterialNotificationsPage from './RawMaterialNotificationsPage';
import RawMaterialSettingsPage from './RawMaterialSettingsPage';
import RawMaterialSupportPage from './RawMaterialSupportPage';
import CompliancePage from '../../owner/compliance/CompliancePage';
import DocumentsKycScreen from '../../common/DocumentsKycScreen';
import HRCSupportBot from '../../../components/owner/chatbot/HRCSupportBot';

import { fetchVendorOrders, fetchUserNotificationsApi } from '../../../services/api.service';

const PRIMARY = '#0B1736';
const ACCENT = '#0B1736';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';

function NotificationBadge({ count }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (count > 0) {
      animation = Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      pulseAnim.setValue(0);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [count]);

  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.65],
  });

  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.75, 0.35, 0],
  });

  const badgeScale = pulseAnim.interpolate({
    inputRange: [0, 0.35, 0.7, 1],
    outputRange: [1, 1.14, 1.06, 1],
  });

  return (
    <View style={styles.notifBadgeWrapper}>
      <Animated.View
        style={[
          styles.whitePulseRing,
          {
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.notifBadge,
          {
            transform: [{ scale: badgeScale }],
          },
        ]}
      >
        <Text style={styles.notifBadgeText}>{displayCount}</Text>
      </Animated.View>
    </View>
  );
}

export default function RawMaterialDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { user, logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterState, setFilterState] = useState(null);
  const [initialAction, setInitialAction] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadVendorUnread = async () => {
      const userId = user?.id || user?.registration?.userId;
      const supplierId = user?.registration?.id || user?.id;

      try {
        let readOverrides = {};
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const saved = window.localStorage.getItem('hrc_read_notifications_v1');
            if (saved) readOverrides = JSON.parse(saved);
          }
        } catch (e) {}

        if (userId) {
          const notifRes = await fetchUserNotificationsApi(userId);
          if (notifRes?.success && Array.isArray(notifRes.data)) {
            const unread = notifRes.data.filter(n => {
              const isOverridden = readOverrides[n.id] !== undefined;
              return isOverridden ? !readOverrides[n.id] : !n.isRead;
            }).length;
            setUnreadCount(unread);
            return;
          }
        }

        if (supplierId) {
          const res = await fetchVendorOrders(supplierId);
          const ordersList = res?.data || res || [];
          if (Array.isArray(ordersList)) {
            const unread = ordersList.filter((o, idx) => {
              const notifId = `ord-${o.id || idx}`;
              const isOverridden = readOverrides[notifId] !== undefined;
              const defaultRead = o.status === 'delivered';
              return isOverridden ? !readOverrides[notifId] : !defaultRead;
            }).length;
            setUnreadCount(unread);
          }
        }
      } catch (e) {
        console.log('Error fetching vendor unread notifications:', e);
      }
    };

    loadVendorUnread();
    const interval = setInterval(loadVendorUnread, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const [imgError, setImgError] = useState(false);
  const userPhoto = user?.profilePhoto || user?.profileImage || user?.registration?.profilePhoto || user?.vendorRegistration?.profilePhoto;

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
      case "profile":
        return <RawMaterialSettingsPage onNavigate={navigateTo} />;
      case "history":
        return <RawMaterialHistoryPage />;
      case "clients":
        return <RawMaterialClientsPage />;
      case "compliance":
        return <CompliancePage />;
      case "documentsKyc":
      case "documents-kyc":
        return <DocumentsKycScreen onBack={() => navigateTo('settings')} />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "requests", label: "Orders", icon: ClipboardList },
    { key: "inventory", label: "Inventory", icon: Boxes },
    { key: "deliveries", label: "Deliveries", icon: Truck },
    { key: "clients", label: "Clients", icon: Users },
    { key: "history", label: "History", icon: History },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Help & Support", icon: CircleHelp },
    { key: "settings", label: "Profile & Settings", icon: Settings },
  ];

  const profileData = {
    initials: (user?.businessName || user?.bizName) ? (user?.businessName || user?.bizName).slice(0, 2).toUpperCase() : "RM",
    name: user?.businessName || user?.bizName || user?.name || "Raw Material Vendor",
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
    outputRange: [20, -120]
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

            <View style={styles.mobileLogoContainer}>
              <View style={styles.mobileLogoIconBox}>
                <Image source={require('../../../assets/HRCHUB_Logo.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
              </View>
              <Text style={styles.mobileLogoText}>
                HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
              </Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn} onPress={() => navigateTo('notifications')}>
                <Bell size={20} color="#fff" />
                <NotificationBadge count={unreadCount} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn} onPress={() => navigateTo('profile')}>
                {userPhoto && !imgError ? (
                  <Image source={{ uri: userPhoto }} style={{ width: 28, height: 28, borderRadius: 14 }} onError={() => setImgError(true)} />
                ) : (
                  <Text style={styles.avatarText}>{profileData.initials}</Text>
                )}
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
            <TouchableOpacity style={styles.centerPlusButton} onPress={() => navigateTo('inventory')} activeOpacity={0.8}>
              <Plus size={32} color={WHITE} />
            </TouchableOpacity>

          </View>
        )}
        {/* Floating Chatbot FAB */}
        <Animated.View style={[styles.chatbotFabContainer, { transform: [{ translateY: floatAnim }] }]}>
          <TouchableOpacity style={styles.chatbotFab} onPress={() => setChatbotOpen(true)} activeOpacity={0.85}>
            <Image source={require('../../../../assets/Chatbot.png')} style={styles.chatbotFabImage} />
          </TouchableOpacity>
        </Animated.View>

        {/* Chatbot Modal */}
        <HRCSupportBot
          visible={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          user={user}
          onNavigate={(page) => { setChatbotOpen(false); setActivePage(page); }}
        />
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
  mobileLogoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mobileLogoIconBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  mobileLogoText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  greetingText: { color: '#B8C6E3', fontSize: 10, letterSpacing: 0.5 },
  vendorNameText: { color: WHITE, fontSize: 16, fontWeight: 'bold', marginVertical: 2 },
  vendorRoleText: { color: '#D4AF37', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  mobileRight: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 },
  mobileIconBtn: { padding: 4, position: 'relative' },
  mobileNotificationDot: { position: 'absolute', top: 4, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: PRIMARY },
  notifBadgeWrapper: {
    position: 'absolute',
    top: -5,
    right: -7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitePulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  notifBadge: {
    backgroundColor: '#E11D48',
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'System',
  },
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
  chatbotFabContainer: { position: 'absolute', right: 20, bottom: 95, zIndex: 99 },
  chatbotFab: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 6px 20px rgba(7,27,58,0.2)' }, ios: { shadowColor: '#071B3A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 }, android: { elevation: 6 } }) },
  chatbotFabImage: { width: '100%', height: '100%', borderRadius: 28, resizeMode: 'cover' },
});
