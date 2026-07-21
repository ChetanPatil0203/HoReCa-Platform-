import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity, Image, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import { Menu, Bell, Search, User, LayoutDashboard, Activity, Truck, Users, DollarSign, HelpCircle, Settings, Home, ClipboardList, Plus, UserPlus, Send, History, UserCheck, LogOut } from 'lucide-react-native';
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

const PRIMARY = '#081A3A';
const ACCENT = '#6C4CF6';
const BG = '#F3F4F6';
const WHITE = '#FFFFFF';

export default function ManpowerDashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768 || (Platform.OS !== 'web');
  const { logout } = useContext(AuthContext);

  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navigateTo = (page, action = null) => {
    setInitialAction(action);
    setActivePage(page);
    setIsPlusMenuOpen(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard": 
        return <ManpowerDashboardHome onNavigate={navigateTo} />;
      case "job-requirements": 
        return <ManpowerDirectRequestsPage initialAction={initialAction} />;
      case "candidates": 
        return <ManpowerCandidatesPage initialAction={initialAction} />;
      case "staff-records": 
        return <ManpowerDeploymentsPage />;
      case "history":
        return <ManpowerHistoryPage />;
      case "notifications":
        return <ManpowerNotificationsPage />;
      case "support": 
        return <ManpowerSupportPage />;
      case "settings": 
        return <ManpowerSettingsPage />;
      case "profile":
        return <ManpowerProfilePage onNavigate={navigateTo} />;
      default: return <View style={styles.placeholder}><Text style={styles.placeholderText}>{activePage} Under Construction</Text></View>;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "job-requirements", label: "Job Requirements", icon: ClipboardList },
    { key: "candidates", label: "Candidates", icon: Users },
    { key: "staff-records", label: "Staff Records", icon: UserCheck },
    { key: "history", label: "History", icon: History },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const bottomNavItems = [
    { key: "support", label: "Help & Support", icon: HelpCircle },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const profileData = {
    initials: "EM",
    name: "Elite Manpower",
    role: "Manpower Agency",
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

  const action1TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -55]
  });

  const action1TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -55]
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
                <Image source={require('../../../assets/HoReCa_Logo.png')} style={{width: 18, height: 18, resizeMode: 'contain'}} />
              </View>
              <Text style={styles.mobileLogoText}>
                HRC<Text style={{ color: '#D4AF37' }}>HUB</Text>
              </Text>
            </View>

            <View style={styles.mobileRight}>
              <TouchableOpacity style={styles.mobileIconBtn} onPress={() => navigateTo('notifications')}>
                <Bell size={18} color="#fff" />
                <View style={styles.mobileNotificationDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileAvatarBtn} onPress={() => navigateTo('profile')}>
                <User size={16} color={PRIMARY} />
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
              <TouchableOpacity style={styles.radialActionBtn} onPress={() => navigateTo('candidates', 'add-candidate')}>
                <UserPlus size={22} color={PRIMARY} />
              </TouchableOpacity>
              <View style={styles.radialLabelBox}>
                <Text style={styles.radialLabelTitle}>Add Candidate</Text>
              </View>
            </Animated.View>

            <Animated.View style={[styles.radialAction, { opacity: actionScale, transform: [{ translateX: action2TranslateX }, { translateY: action2TranslateY }, { scale: actionScale }] }]}>
              <TouchableOpacity style={styles.radialActionBtn} onPress={() => navigateTo('candidates')}>
                <Users size={22} color={PRIMARY} />
              </TouchableOpacity>
              <View style={styles.radialLabelBox}>
                <Text style={styles.radialLabelTitle}>Manage Candidates</Text>
              </View>
            </Animated.View>

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
});
