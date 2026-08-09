import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import { Menu, Bell, Search, User, LayoutDashboard, Activity, Truck, Users, DollarSign, CircleHelp as HelpCircle, Settings, Home, ClipboardList, Plus, UserPlus, Send, History, UserCheck, LogOut, Building2 } from 'lucide-react-native';
import RoleBasedMobileDrawer from '../../../components/navigation/RoleBasedMobileDrawer';
import { AuthContext } from '../../../context/AuthContext';
import { colors } from '../../../theme/colors';

import ManpowerDashboardHome from './ManpowerDashboardHome';
import ManpowerDirectRequestsPage from './ManpowerDirectRequestsPage';
import ManpowerCandidatesPage from './ManpowerCandidatesPage';
import ManpowerDeploymentsPage from './ManpowerDeploymentsPage';
import ManpowerNotificationsPage from './ManpowerNotificationsPage';
import ManpowerSettingsPage from './ManpowerSettingsPage';
import ManpowerSupportPage from './ManpowerSupportPage';
import ManpowerHistoryPage from './ManpowerHistoryPage';
import ManpowerProfilePage from './ManpowerProfilePage';
import ManpowerClientsPage from './ManpowerClientsPage';
import FeedWallPage from '../FeedWallPage';
import CompliancePage from '../../owner/compliance/CompliancePage';
import DocumentsKycScreen from '../../common/DocumentsKycScreen';
import HRCSupportBot from '../../../components/owner/chatbot/HRCSupportBot';
import { fetchVendorOrders, fetchUserNotificationsApi } from '../../../services/api.service';

const PRIMARY = '#081A3A';
const ACCENT = '#081A3A';
const BG = '#F3F4F6';
const WHITE = '#FFFFFF';

function NotificationBadge({ count = 3 }) {
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

export default function ManpowerDashboard({ initialTab = "dashboard" }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { user, logout } = useContext(AuthContext);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadManpowerUnread = async () => {
      const userId = user?.id || user?.registration?.userId || user?.userId;
      const supplierId = user?.registration?.id || user?.id;

      try {
        let readOverrides = {};
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            const saved = window.localStorage.getItem('hrc_read_notifications_manpower');
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
              const notifId = `man-${o.id || idx}`;
              const isOverridden = readOverrides[notifId] !== undefined;
              const defaultRead = o.status === 'completed';
              return isOverridden ? !readOverrides[notifId] : !defaultRead;
            }).length;
            setUnreadCount(unread);
          }
        }
      } catch (e) {
        console.log('Error fetching manpower unread notifications:', e);
      }
    };

    loadManpowerUnread();
    const interval = setInterval(loadManpowerUnread, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const [activePage, setActivePage] = useState(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navigateTo = (page, action = null) => {
    setInitialAction(action);
    setActivePage(page);
    setIsPlusMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to logout?")) {
        logout();
      }
    } else {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Logout", style: "destructive", onPress: () => logout() }
        ]
      );
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <ManpowerDashboardHome onNavigate={navigateTo} />;
      case "feed":
      case "feedwall":
      case "FeedWall":
        return <FeedWallPage />;
      case "job-requirements":
      case "DirectRequests":
      case "direct-requests":
        return <ManpowerDirectRequestsPage initialAction={initialAction} />;
      case "candidates":
      case "Candidates":
        return <ManpowerCandidatesPage initialAction={initialAction} />;
      case "staff-records":
      case "StaffRecords":
      case "staff":
        return <ManpowerDeploymentsPage />;
      case "history":
        return <ManpowerHistoryPage />;
      case "notifications":
        return <ManpowerNotificationsPage />;
      case "support":
        return <ManpowerSupportPage />;
      case "settings":
      case "profile":
        return <ManpowerSettingsPage onNavigate={navigateTo} />;
      case "clients":
        return <ManpowerClientsPage />;
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
    { key: "job-requirements", label: "Job Requirements", icon: ClipboardList },
    { key: "candidates", label: "Candidates", icon: Users },
    { key: "staff-records", label: "Staff Records", icon: UserCheck },
    { key: "clients", label: "Clients", icon: Building2 },
    { key: "history", label: "History", icon: History },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Help & Support", icon: HelpCircle },
    { key: "settings", label: "Profile & Settings", icon: Settings },
  ];

  const agencyName = user?.registration?.bizName || user?.bizName || user?.contactPerson || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Agency Partner');
  const initials = agencyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const vendorType = user?.registration?.vendorType || 'Manpower Agency';

  const profileData = {
    initials: initials,
    name: agencyName,
    role: vendorType,
    badge: "AGENCY"
  };

  const togglePlusMenu = () => setIsPlusMenuOpen(!isPlusMenuOpen);

  // Animation styles for radial menu
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg']
  });

  const bgOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const action2TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -60]
  });

  const action2TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0]
  });

  const actionScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={styles.container}>
      <RoleBasedMobileDrawer
        activePage={activePage === 'profile' ? 'dashboard' : activePage}
        onNavigate={setActivePage}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
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
                <Image source={require('../../../assets/HRCHUB_Logo.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} />
              </View>
              <Text style={styles.mobileLogoText}>
                HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
              </Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn} onPress={() => navigateTo('notifications')}>
                <Bell size={18} color="#fff" />
                <NotificationBadge count={unreadCount} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn} onPress={() => navigateTo('profile')}>
                {(user?.profilePhoto || user?.profileImage || user?.registration?.profilePhoto || user?.vendorRegistration?.profilePhoto) ? (
                  <Image source={{ uri: user?.profilePhoto || user?.profileImage || user?.registration?.profilePhoto || user?.vendorRegistration?.profilePhoto }} style={{ width: 28, height: 28, borderRadius: 14 }} />
                ) : (
                  <User size={16} color={PRIMARY} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.topNav}>
            <View style={styles.searchBox}>
              <Search size={16} color={colors.muted} />
              <Text style={styles.searchText}>Search candidates...</Text>
            </View>

            <View style={styles.navRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigateTo('notifications')}>
                <Bell size={20} color={colors.sub} />
                <NotificationBadge count={unreadCount} />
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

            <Animated.View style={[styles.radialAction, { opacity: actionScale, transform: [{ translateX: action2TranslateX }, { translateY: action2TranslateY }, { scale: actionScale }] }]}>
              <TouchableOpacity style={styles.radialActionBtn} onPress={() => navigateTo('candidates')}>
                <Users size={22} color={PRIMARY} />
              </TouchableOpacity>
              <View style={styles.radialLabelBox}>
                <Text style={styles.radialLabelTitle}>Manage Candidates</Text>
              </View>
            </Animated.View>

            {/* Nav Bar */}

            {/* Nav Bar */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('dashboard')}>
                <Home size={24} color={activePage === 'dashboard' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'dashboard' && styles.bottomNavTextActive]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('job-requirements')}>
                <ClipboardList size={24} color={activePage === 'job-requirements' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'job-requirements' && styles.bottomNavTextActive]}>Requirements</Text>
              </TouchableOpacity>

              {/* Center Plus Button Spacer */}
              <View style={styles.centerButtonSpacer} />

              <TouchableOpacity style={styles.bottomNavItem} onPress={() => navigateTo('staff-records')}>
                <UserCheck size={24} color={activePage === 'staff-records' ? ACCENT : '#94A3B8'} />
                <Text style={[styles.bottomNavText, activePage === 'staff-records' && styles.bottomNavTextActive]}>Staff Records</Text>
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
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BG,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  topNav: {
    height: 70,
    backgroundColor: WHITE,
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
    height: 70,
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  mobileMenuBtn: {
    padding: 6,
    zIndex: 10
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
    backgroundColor: 'transparent',
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
    zIndex: 10
  },
  mobileIconBtn: {
    padding: 4,
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
  mobileAvatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
